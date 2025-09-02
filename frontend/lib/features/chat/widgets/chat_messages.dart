import 'package:chatshyld/features/chat/data/models/chat_message.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:chatshyld/features/chat/state/chat_room_state.dart';

class ChatMessages extends StatelessWidget {
  const ChatMessages({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<ChatRoomState>(
      builder: (context, room, _) {
        final items = room.messages;
        return ListView.builder(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
          reverse: false,
          itemCount: items.length,
          itemBuilder: (c, i) {
            final m = items[i];
            final mine = m.fromUser == ChatMessage.meId;
            return Align(
              alignment: mine ? Alignment.centerRight : Alignment.centerLeft,
              child: Container(
                constraints: const BoxConstraints(maxWidth: 280),
                margin: const EdgeInsets.symmetric(vertical: 3),
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 8,
                ),
                decoration: BoxDecoration(
                  color: mine ? Colors.black : Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: mine
                      ? null
                      : const [
                          BoxShadow(
                            color: Color(0x1A000000),
                            blurRadius: 6,
                            offset: Offset(0, 2),
                          ),
                        ],
                ),
                child: _bubbleContent(m, mine),
              ),
            );
          },
        );
      },
    );
  }

  Widget _bubbleContent(ChatMessage m, bool mine) {
    // text or media preview — keep it minimal; you can expand later
    if (m.media != null) {
      final mime = (m.media!['mime'] as String?) ?? '';
      final isImage = mime.startsWith('image/');
      final isVideo = mime.startsWith('video/');
      final label = isImage
          ? '📷 Photo'
          : isVideo
          ? '🎬 Video'
          : '📎 File';
      return Text(
        m.body?.isNotEmpty == true ? '${m.body}\n$label' : label,
        style: TextStyle(
          color: mine ? Colors.white : Colors.black,
          fontSize: 15,
        ),
      );
    }
    return Text(
      m.body ?? '',
      style: TextStyle(color: mine ? Colors.white : Colors.black, fontSize: 15),
    );
  }
}
