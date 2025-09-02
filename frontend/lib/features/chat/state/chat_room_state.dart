// lib/features/chat/state/chat_room_state.dart
import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:chatshyld/features/chat/data/models/chat_message.dart';
import 'package:chatshyld/features/chat/data/services/chat_socket.dart';

/// State for ONE conversation (you ↔ otherUserId).
class ChatRoomState extends ChangeNotifier {
  ChatRoomState({required this.otherUserId}) {
    _sub = ChatSocket.I.events.listen(_onEvent);
  }

  final String otherUserId;
  final List<ChatMessage> _messages = [];
  bool _peerTyping = false;

  List<ChatMessage> get messages => List.unmodifiable(_messages);
  bool get peerTyping => _peerTyping;

  StreamSubscription? _sub;

  @override
  void dispose() {
    _sub?.cancel();
    super.dispose();
  }

  // --------- SEND ------------------------------------------------------------

  /// Send text with an optimistic local message we can later replace.
  void sendText(String text) {
    final t = text.trim();
    if (t.isEmpty) return;

    final localId = 'local-${DateTime.now().microsecondsSinceEpoch}';
    final provisional = ChatMessage(
      messageId: localId,
      fromUser: ChatMessage.meId,
      toUser: otherUserId,
      createdAt: DateTime.now(),
      body: t,
    );
    _messages.add(provisional);
    _messages.sort((a, b) => a.createdAt.compareTo(b.createdAt));
    notifyListeners();

    ChatSocket.I.sendText(toUserId: otherUserId, text: t);
  }

  void sendTyping(bool flag) {
    ChatSocket.I.typing(toUserId: otherUserId, isTyping: flag);
  }

  // --------- INCOMING --------------------------------------------------------

  void _onEvent(Map<String, dynamic> e) {
    final type = e['type'];

    if (type == 'message.new') {
      final msg = ChatMessage.fromWs(e);
      final mine = ChatMessage.meId;

      // only messages for this pair
      final a = msg.fromUser, b = msg.toUser;
      final isThisPair =
          (a == mine && b == otherUserId) || (b == mine && a == otherUserId);
      if (!isThisPair) return;

      // de-dupe by id if already present
      final already = _messages.indexWhere((m) => m.messageId == msg.messageId);
      if (already >= 0) {
        _messages[already] = msg;
      } else if (msg.fromUser == mine) {
        // replace the latest optimistic (local-*) that matches my body
        final idx = _messages.lastIndexWhere(
          (m) =>
              m.messageId.startsWith('local-') &&
              m.fromUser == mine &&
              (m.body ?? '') == (msg.body ?? ''),
        );
        if (idx >= 0) {
          _messages[idx] = msg;
        } else {
          _messages.add(msg); // came from another device—just add
        }
      } else {
        _messages.add(msg);
      }

      _messages.sort((a, b) => a.createdAt.compareTo(b.createdAt));
      notifyListeners();
    }

    if (type == 'typing') {
      final from = e['fromUser'] as String?;
      if (from == otherUserId) {
        _peerTyping = (e['typing'] as bool?) ?? false;
        notifyListeners();
      }
    }
  }
}
