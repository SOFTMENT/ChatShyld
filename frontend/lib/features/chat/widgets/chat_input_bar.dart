import 'package:chatshyld/core/constants/app_colors.dart';
import 'package:chatshyld/features/chat/state/chat_room_state.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class ChatInputBar extends StatefulWidget {
  const ChatInputBar({
    super.key,
    this.onAttach,
    this.onMic,
    required this.onSend,
    this.hintText = 'Type message...',
    this.maxLines = 8,
  });

  final VoidCallback? onAttach;
  final VoidCallback? onMic;
  final void Function(String text) onSend;
  final String hintText;
  final int maxLines;

  @override
  State<ChatInputBar> createState() => _ChatInputBarState();
}

class _ChatInputBarState extends State<ChatInputBar> {
  final _controller = TextEditingController();
  final _focus = FocusNode();
  bool _hasText = false;

  @override
  void initState() {
    super.initState();

    _controller.addListener(() {
      final has = _controller.text.trim().isNotEmpty;
      setState(() => _hasText = has);

      // Tell the room that I’m typing / stopped
      try {
        context.read<ChatRoomState>().sendTyping(has);
      } catch (_) {
        // ChatInputBar might be used outside a ChatRoom; ignore
      }
    });

    _controller.addListener(
      () => setState(() {
        _hasText = _controller.text.trim().isNotEmpty;
      }),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    _focus.dispose();
    super.dispose();
  }

  void _send() {
    final text = _controller.text.trim();
    if (text.isEmpty) return;
    widget.onSend(text);
    _controller.clear();
    _focus.requestFocus();
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      top: false,
      bottom: true,
      child: Padding(
        padding: const EdgeInsets.fromLTRB(25, 0, 25, 0),
        child: Row(
          children: [
            Expanded(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 2, vertical: 6),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(8),
                  boxShadow: const [
                    BoxShadow(
                      color: Color(0x40848484), // #848484 @ 25% opacity
                      offset: Offset(0, 1), // X:0, Y:1
                      blurRadius: 5, // Blur: 5
                      spreadRadius: 0, // Spread: 0
                    ),
                  ],
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.end,

                  children: [
                    const SizedBox(width: 4),
                    Padding(
                      padding: const EdgeInsets.only(bottom: 6.2, right: 4),
                      child: GestureDetector(
                        onTap: widget.onAttach,

                        child: const Icon(
                          Icons.attach_file_outlined,
                          color: AppColors.darkGrey,
                        ),
                      ),
                    ),

                    // Text field
                    Expanded(
                      child: TextField(
                        controller: _controller,
                        focusNode: _focus,
                        textCapitalization: TextCapitalization.sentences,
                        keyboardType: TextInputType.multiline,
                        textInputAction: TextInputAction.newline,
                        minLines: 1,
                        maxLines: widget.maxLines,
                        decoration: InputDecoration(
                          hintText: widget.hintText,
                          isDense: true,
                          hintStyle: const TextStyle(
                            color: AppColors.textLightGrey,
                            fontSize: 14,
                          ),
                          border: InputBorder.none,
                          contentPadding: const EdgeInsets.symmetric(
                            vertical: 8,
                          ),
                        ),
                        style: const TextStyle(fontSize: 15),
                      ),
                    ),

                    // Mic
                    Padding(
                      padding: const EdgeInsets.only(bottom: 4),
                      child: GestureDetector(
                        onTap: widget.onMic,

                        child: const Icon(
                          Icons.mic_none,

                          color: AppColors.darkGrey,

                          size: 28,
                        ),
                      ),
                    ),
                    const SizedBox(width: 6),
                    Padding(
                      padding: const EdgeInsets.only(bottom: 4.0),
                      child: GestureDetector(
                        onTap: _hasText ? _send : null,
                        child: AnimatedOpacity(
                          duration: const Duration(milliseconds: 150),
                          opacity: _hasText ? 1 : 0.45,
                          child: Container(
                            height: 30,
                            width: 30,
                            decoration: const BoxDecoration(
                              color: Colors.black,
                              shape: BoxShape.circle,
                              boxShadow: [
                                BoxShadow(
                                  color: Color(0x40848484),
                                  offset: Offset(0, 1),
                                  blurRadius: 5,
                                ),
                              ],
                            ),
                            child: const Icon(
                              Icons.arrow_upward,
                              size: 20,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
