class ChatMessage {
  final String messageId;
  final String fromUser;
  final String toUser;
  final String? body; // null when media-only
  final Map<String, dynamic>? media; // { key, mime, ... }
  final DateTime createdAt;

  bool get isMine => fromUser == meId;
  static String meId = ''; // set this once from your AuthState after login

  ChatMessage({
    required this.messageId,
    required this.fromUser,
    required this.toUser,
    required this.createdAt,
    this.body,
    this.media,
  });

  factory ChatMessage.fromWs(Map<String, dynamic> m) {
    final msg = m['message'] as Map<String, dynamic>;
    return ChatMessage(
      messageId: msg['messageId'] as String,
      fromUser: msg['fromUser'] as String,
      toUser: msg['toUser'] as String,
      body: msg['body'] as String?,
      media: msg['media'] as Map<String, dynamic>?,
      createdAt: DateTime.parse(msg['createdAt'] as String),
    );
  }
}
