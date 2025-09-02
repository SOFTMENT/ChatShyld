import 'dart:async';
import 'dart:convert';
import 'package:web_socket_channel/web_socket_channel.dart';

/// Very small, app-wide WS service.
/// Connect once with (wsUrl, token), all rooms reuse it.
class ChatSocket {
  ChatSocket._();
  static final ChatSocket I = ChatSocket._();

  WebSocketChannel? _ch;
  StreamSubscription? _sub;

  String? _wsUrl;
  String? _token;

  // backoff
  int _retries = 0;
  Timer? _reconnectT;
  Timer? _pingT;

  // broadcast incoming events: {type, ...}
  final _events = StreamController<Map<String, dynamic>>.broadcast();
  Stream<Map<String, dynamic>> get events => _events.stream;

  bool get isConnected => _ch != null;

  Future<void> connect({
    required String wsBaseUrl,
    required String accessToken,
  }) async {
    // Example base: wss://abc.execute-api.ap-south-1.amazonaws.com/prod
    _wsUrl = wsBaseUrl;
    _token = accessToken;

    await disconnect();

    final uri = Uri.parse(wsBaseUrl);
    // backend allows ?token on $connect
    final withToken = uri.replace(
      queryParameters: {...uri.queryParameters, 'token': accessToken},
    );

    try {
      _ch = WebSocketChannel.connect(withToken);
      _sub = _ch!.stream.listen(
        (data) => _onData(data),
        onDone: _onDone,
        onError: (e, st) => _onError(e),
      );
      _startPing();
      _retries = 0;
    } catch (_) {
      _scheduleReconnect();
    }
  }

  Future<void> disconnect() async {
    _pingT?.cancel();
    _reconnectT?.cancel();
    _pingT = null;
    _reconnectT = null;

    await _sub?.cancel();
    _sub = null;
    await _ch?.sink.close();
    _ch = null;
  }

  void _onData(dynamic data) {
    try {
      final m = data is String ? jsonDecode(data) : data;
      if (m is Map<String, dynamic>) _events.add(m);
    } catch (_) {}
  }

  void _onDone() => _scheduleReconnect();
  void _onError(Object _) => _scheduleReconnect();

  void _scheduleReconnect() {
    if (_wsUrl == null || _token == null) return;
    _reconnectT?.cancel();
    final delay = Duration(seconds: [2, 4, 8, 15, 30][_retries.clamp(0, 4)]);
    _retries++;
    _reconnectT = Timer(delay, () {
      connect(wsBaseUrl: _wsUrl!, accessToken: _token!);
    });
  }

  void _startPing() {
    _pingT?.cancel();
    _pingT = Timer.periodic(const Duration(seconds: 25), (_) {
      // keep-alive route
      sendJson({'action': 'ping'});
    });
  }

  // ---- Outgoing helpers -----------------------------------------------------

  void sendJson(Map<String, dynamic> payload) {
    final s = jsonEncode(payload);
    _ch?.sink.add(s);
  }

  void sendText({required String toUserId, required String text}) {
    sendJson({'action': 'sendMessage', 'to': toUserId, 'body': text});
  }

  void sendMedia({
    required String toUserId,
    required Map<String, dynamic> media,
  }) {
    sendJson({
      'action': 'sendMessage',
      'to': toUserId,
      'media': media, // {key,mime,width,height,durationMs,filename}
    });
  }

  Timer? _typingDebounce;
  bool _typingSent = false;

  /// Call when the input has text (true) or cleared (false)
  void typing({required String toUserId, required bool isTyping}) {
    // debounce to reduce spam:
    _typingDebounce?.cancel();
    _typingDebounce = Timer(const Duration(milliseconds: 200), () {
      if (isTyping != _typingSent) {
        _typingSent = isTyping;
        sendJson({'action': 'typing', 'to': toUserId, 'typing': isTyping});
      }
    });
    // also auto-stop typing after 3s idle:
    if (isTyping) {
      Timer(const Duration(seconds: 3), () {
        if (_typingSent) {
          _typingSent = false;
          sendJson({'action': 'typing', 'to': toUserId, 'typing': false});
        }
      });
    }
  }
}
