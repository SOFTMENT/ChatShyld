import 'package:chatshyld/core/auth/auth_state.dart';
import 'package:chatshyld/core/constants/app_colors.dart';
import 'package:chatshyld/core/constants/app_routes.dart';

import 'package:chatshyld/core/network/api_error.dart';
import 'package:chatshyld/core/network/dio_client.dart';

import 'package:chatshyld/core/widgets/app_icon_button.dart';
import 'package:chatshyld/core/widgets/searchbar_field.dart';
import 'package:chatshyld/features/chat/data/services/contacts_api.dart';
import 'package:chatshyld/features/chat/data/services/device_contacts.dart';
import 'package:chatshyld/features/contacts/data/models/matched_contact.dart';
import 'package:chatshyld/features/contacts/pages/matched_contacts_sheet.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'package:material_symbols_icons/symbols.dart';
import 'package:phone_numbers_parser/phone_numbers_parser.dart';
import 'package:provider/provider.dart';

class AllChatsPage extends StatelessWidget {
  AllChatsPage({super.key});

  final _client = DioClient();
  late final ContactsApi _contactsApi = ContactsApi(_client.dio);

  Future<void> onPlusPressed(BuildContext context) async {
    final picked = await showMatchedContactsSheet(
      context,
      loadMatches: () async {
        // 1) Read device contacts (E.164 already)
        final device = await DeviceContacts.load(userIso: IsoCode.IN);
        // map phone -> local name
        final nameByPhone = <String, String>{
          for (final c in device)
            if (c['phone'] != null) c['phone']!: (c['name'] ?? c['phone']!),
        };

        // dedupe phones
        final phones = nameByPhone.keys.toSet().toList();
        if (phones.isEmpty) return <MatchedContact>[];

        // 2) Lookup on backend (chunking handled inside ContactsApi)
        try {
          final users = await _contactsApi.lookupByPhones(phones);

          if (!context.mounted) return [];
          final myId = context.read<AuthState>().me?.userId; // or pass it in

          return users
              .where((u) => u.userId != myId) // drop myself
              .map((u) {
                final local = nameByPhone[u.phone] ?? u.phone;
                return MatchedContact(
                  userId: u.userId,
                  phone: u.phone,
                  localName: local,
                  createdAt: u.createdAt,
                  photoKey: u.photoKey,
                );
              })
              .toList();
        } on ApiError {
          rethrow;
        }
      },
    );

    if (picked != null) {
      if (!context.mounted) return;
      context.push(AppRoutes.chatPage, extra: {'contact': picked});
    }
  }

  @override
  Widget build(BuildContext context) {
    TextEditingController searchCtrl = TextEditingController();
    int onlineCount = 0;
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 25),
              child: Row(
                children: [
                  const Text(
                    'Chats',
                    style: TextStyle(
                      color: AppColors.black,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const Spacer(),
                  AppIconButton(
                    size: 36,
                    icon: Symbols.add_circle,
                    fill: 1,
                    iconSize: 30,
                    iconColor: AppColors.primaryDark,
                    onTap: () {
                      onPlusPressed(context);
                    },
                  ),
                ],
              ),
            ),
            if (onlineCount > 0)
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 25, vertical: 20),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Text(
                      'Online',
                      style: TextStyle(
                        color: AppColors.textPrimary,
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    Spacer(),
                    Text(
                      'View All',
                      style: TextStyle(
                        color: AppColors.textPrimary,
                        fontSize: 12,
                        fontWeight: FontWeight.w400,
                      ),
                    ),
                  ],
                ),
              ),
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 25),
              child: SearchBarField(
                controller: searchCtrl,
                onChanged: (value) {},
              ),
            ),

            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 25),
              child: Row(
                children: [
                  Image.asset(
                    'assets/icons/chat_black.png',
                    width: 20,
                    height: 20,
                  ),
                  const SizedBox(width: 12),
                  const Text(
                    'All Chats',
                    style: TextStyle(
                      color: AppColors.textPrimary,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
