import 'package:chatshyld/core/constants/app_colors.dart';
import 'package:flutter/material.dart';
import 'package:chatshyld/core/widgets/custom_image.dart';
import 'package:chatshyld/features/chat/data/models/chat_message.dart';
import 'package:chatshyld/features/chat/state/chat_room_state.dart';

class MessageList extends StatelessWidget {
  const MessageList({super.key, required this.state});
  final ChatRoomState state;

  @override
  Widget build(BuildContext context) {
    final items = state.messages;

    return ListView.builder(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 120),
      reverse: false,
      itemCount: items.length + (state.peerTyping ? 1 : 0),
      itemBuilder: (ctx, i) {
        if (i == items.length && state.peerTyping) {
          return const _TypingRow();
        }
        final m = items[i];
        final isMine = m.fromUser == ChatMessage.meId;

        final prev = i > 0 ? items[i - 1] : null;
        final showHead = _isNewCluster(prev, m);

        return Padding(
          padding: EdgeInsets.only(top: showHead ? 12 : 6, bottom: 6),
          child: Align(
            alignment: isMine ? Alignment.centerRight : Alignment.centerLeft,
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 280),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: isMine
                    ? CrossAxisAlignment.end
                    : CrossAxisAlignment.end,
                children: [
                  ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 280),
                    child: _Bubble(message: m, isMine: isMine),
                  ),
                  const SizedBox(height: 4),
                  _TimeStamp(ts: m.createdAt, isMine: isMine),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  bool _isNewCluster(ChatMessage? prev, ChatMessage curr) {
    if (prev == null) return true;
    if (prev.fromUser != curr.fromUser) return true;
    final dt = curr.createdAt.difference(prev.createdAt).inMinutes.abs();
    return dt >= 5;
  }
}

class _Bubble extends StatelessWidget {
  const _Bubble({required this.message, required this.isMine});
  final ChatMessage message;
  final bool isMine;

  Color get _bg => isMine
      ? const Color(0xFFE6F6EA) /* mint */
      : const Color.fromARGB(33, 5, 187, 248);
  Color get _text => AppColors.textPrimary;

  @override
  Widget build(BuildContext context) {
    final radius = BorderRadius.only(
      topLeft: Radius.circular(isMine ? 12 : 0),
      topRight: Radius.circular(isMine ? 0 : 12),
      bottomLeft: const Radius.circular(12),
      bottomRight: const Radius.circular(12),
    );

    final media = message.media;
    if (media != null) {
      return ClipRRect(
        borderRadius: radius,
        child: Container(
          color: _bg,
          child: _MediaBubble(media: media),
        ),
      );
    }

    return Container(
      decoration: BoxDecoration(color: _bg, borderRadius: radius),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      child: Text(
        message.body ?? '',
        style: TextStyle(color: _text, fontSize: 14.5, height: 1.35),
      ),
    );
  }
}

class _MediaBubble extends StatelessWidget {
  const _MediaBubble({required this.media});
  final Map<String, dynamic> media; // {key,mime,width,height,...}

  @override
  Widget build(BuildContext context) {
    final mime = (media['mime'] as String?) ?? '';
    final isImage = mime.startsWith('image/');
    final isVideo = mime.startsWith('video/');

    // Size nicely
    final w = (media['width'] as num?)?.toDouble() ?? 320;
    final h = (media['height'] as num?)?.toDouble() ?? 200;
    final ar = (w > 0 && h > 0) ? (w / h) : (4 / 3);

    return AspectRatio(
      aspectRatio: ar.clamp(0.6, 1.6),
      child: Stack(
        children: [
          Positioned.fill(
            child: CustomImage(
              imageKey: media['key'] as String?,

              borderRadius: 0,
            ),
          ),
          if (isVideo)
            const Positioned(
              right: 8,
              bottom: 8,
              child: Icon(
                Icons.play_circle_outline,
                size: 36,
                color: Colors.white,
              ),
            ),
        ],
      ),
    );
  }
}

class _TimeStamp extends StatelessWidget {
  const _TimeStamp({required this.ts, required this.isMine});
  final DateTime ts;
  final bool isMine;

  @override
  Widget build(BuildContext context) {
    final t = ts.toLocal();
    final hh = t.hour.toString().padLeft(2, '0');
    final mm = t.minute.toString().padLeft(2, '0');
    return Text(
      '$hh:$mm',
      style: const TextStyle(fontSize: 11, color: Color(0xFF888888)),
      textAlign: isMine ? TextAlign.right : TextAlign.left,
    );
  }
}

class _TypingRow extends StatelessWidget {
  const _TypingRow();

  @override
  Widget build(BuildContext context) {
    return const Row(
      children: [
        SizedBox(width: 8),
        Text('Typing…', style: TextStyle(fontSize: 13, color: Colors.black54)),
      ],
    );
  }
}
