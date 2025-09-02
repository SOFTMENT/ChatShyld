import 'package:chatshyld/core/widgets/app_icon_button.dart';
import 'package:chatshyld/core/widgets/custom_image.dart';
import 'package:chatshyld/core/widgets/dismiss_keyboard_ontap.dart';

import 'package:chatshyld/features/chat/widgets/chat_input_bar.dart';
import 'package:chatshyld/features/contacts/data/models/matched_contact.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:material_symbols_icons/symbols.dart';
import 'package:provider/provider.dart';
import 'package:chatshyld/features/chat/state/chat_room_state.dart';

import 'package:chatshyld/features/chat/widgets/message_list.dart';

class ChatPage extends StatelessWidget {
  final MatchedContact? matchedContact;
  const ChatPage({super.key, required this.matchedContact});

  @override
  Widget build(BuildContext context) {
    if (matchedContact == null) {
      context.pop();
      return const SizedBox();
    }

    return ChangeNotifierProvider(
      create: (_) => ChatRoomState(otherUserId: matchedContact!.userId),
      child: _ScaffoldWithList(matchedContact: matchedContact!),
    );
  }
}

class _ScaffoldWithList extends StatelessWidget {
  const _ScaffoldWithList({required this.matchedContact});
  final MatchedContact matchedContact;

  @override
  Widget build(BuildContext context) {
    final room = context.watch<ChatRoomState>();

    return Stack(
      children: [
        Image.asset(
          'assets/images/chatbg.png',
          width: double.infinity,
          height: double.infinity,
          fit: BoxFit.cover,
        ),
        DismissKeyboardOnTap(
          child: Scaffold(
            resizeToAvoidBottomInset: true,
            backgroundColor: Colors.transparent,
            body: Column(
              children: [
                // your header (unchanged) ...
                Container(
                  color: Colors.white,
                  child: SafeArea(
                    bottom: false,
                    child: _Header(matchedContact: matchedContact),
                  ),
                ),
                // the list
                Expanded(
                  child: MessageList(
                    state: room, // your ChatRoomState
                  ),
                ),
              ],
            ),
            bottomNavigationBar: Padding(
              padding: EdgeInsets.only(
                bottom: 6 + MediaQuery.viewInsetsOf(context).bottom,
              ),
              child: ChatInputBar(
                onAttach: () {},
                onMic: () {},
                onSend: (text) => room.sendText(text),
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class _Header extends StatelessWidget {
  const _Header({required this.matchedContact});
  final MatchedContact matchedContact;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Color(0x40A3A3A3),
            offset: Offset(0, 1),
            spreadRadius: 1,
          ),
        ],
      ),
      width: double.infinity,
      height: 68,
      child: Row(
        children: [
          const Padding(
            padding: EdgeInsets.only(left: 20, right: 12),
            child: AppIconButton(
              fill: 1,
              icon: Symbols.keyboard_backspace,
              size: 36,
              iconSize: 28,
            ),
          ),
          SizedBox(
            width: 48,
            height: 48,
            child: CustomImage(
              imageKey: matchedContact.photoKey,
              borderRadius: 12,
            ),
          ),
          const SizedBox(width: 8),
          Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                matchedContact.localName,
                style: const TextStyle(
                  fontWeight: FontWeight.w600,
                  fontSize: 14,
                ),
              ),
              const SizedBox(height: 1),
              const Text(
                'Offline',
                style: TextStyle(color: Colors.grey, fontSize: 12),
              ),
            ],
          ),
          const Spacer(),
          const Padding(
            padding: EdgeInsets.only(right: 20),
            child: AppIconButton(fill: 1, icon: Symbols.more_horiz, size: 36),
          ),
        ],
      ),
    );
  }
}
