import 'package:chatshyld/core/auth/auth_state.dart';
import 'package:chatshyld/core/constants/app_colors.dart';
import 'package:chatshyld/core/widgets/app_button.dart';
import 'package:chatshyld/features/permission/data/services/permission_service.dart';

import 'package:chatshyld/features/permission/widgets/permission_container.dart';
import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

class PermissionPage extends StatefulWidget {
  const PermissionPage({super.key});

  @override
  State<PermissionPage> createState() => _PermissionPageState();
}

class _PermissionPageState extends State<PermissionPage> {
  bool _contactPermission = false;
  bool _mediaPermission = false;
  bool _cameraPermission = false;
  bool _notificationPermission = false;
  final permissionService = PermissionService();

  void _requestPermission(String type) async {
    switch (type) {
      case 'contact':
        final isGranted = await permissionService.request(
          context,
          permission: Permission.contacts,
        );
        setState(() {
          _contactPermission = isGranted;
        });
        break;

      case 'media':
        final isGranted = await permissionService.request(
          context,
          permission: Permission.photos,
        );
        setState(() {
          _mediaPermission = isGranted;
        });
        break;

      case 'camera':
        final isGranted = await permissionService.request(
          context,
          permission: Permission.camera,
        );
        if (!mounted) return;
        final isGranted1 = await permissionService.request(
          context,
          permission: Permission.microphone,
        );
        setState(() {
          _cameraPermission = (isGranted || isGranted1);
        });
        break;

      case 'notification':
        final isGranted = await permissionService.request(
          context,
          permission: Permission.notification,
        );
        setState(() {
          _notificationPermission = isGranted;
        });
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const ClampingScrollPhysics(),
          child: Padding(
            padding: const EdgeInsets.only(
              top: 12,
              left: 25,
              right: 25,
              bottom: 10,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Permissions',
                  style: TextStyle(
                    color: AppColors.black,
                    fontSize: 32,
                    fontWeight: FontWeight.bold,

                    height: 1.2,
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'To provide you with a full-featured and secure messaging experience, we need your permission for a few things.We respect your privacy — your data is never shared or stored without encryption.',
                  style: TextStyle(
                    color: AppColors.darkGrey,
                    fontSize: 13,
                    height: 1.6,
                  ),
                ),

                const SizedBox(height: 20),
                PermissionContainer(
                  icon: Image.asset(
                    'assets/icons/contact.png',
                    width: 22,
                    height: 22,
                  ),
                  title: 'Access Contacts',
                  message:
                      'See which contacts are using the app and start chatting. We match numbers securely using hashes and never store your contact list.',
                  value: _contactPermission,
                  onChange: (p0) {
                    if (p0) {
                      _requestPermission('contact');
                    }
                  },
                ),

                const SizedBox(height: 12),
                PermissionContainer(
                  icon: Image.asset(
                    'assets/icons/media.png',
                    width: 22,
                    height: 22,
                  ),
                  title: 'Access Media & Files',
                  message:
                      'Send and receive photos, videos, and documents in chats. All media is encrypted for your privacy.',
                  value: _mediaPermission,
                  onChange: (p0) {
                    _requestPermission('media');
                  },
                ),
                const SizedBox(height: 12),
                PermissionContainer(
                  icon: Image.asset(
                    'assets/icons/camera.png',
                    width: 22,
                    height: 22,
                  ),
                  title: 'Camera & Microphone',
                  message:
                      'Capture photos, record voice messages, and make secure video calls directly from the app.',
                  value: _cameraPermission,
                  onChange: (p0) {
                    _requestPermission('camera');
                  },
                ),
                const SizedBox(height: 12),
                PermissionContainer(
                  icon: Image.asset(
                    'assets/icons/notification.png',
                    width: 22,
                    height: 22,
                  ),
                  title: 'Notifications',
                  message:
                      'Get notified instantly when you receive new messages or calls. We don’t show message content in notifications.',
                  value: _notificationPermission,
                  onChange: (p0) {
                    _requestPermission('notification');
                  },
                ),

                const SizedBox(height: 12),
                const Text(
                  'We believe in privacy by design. All your messages and calls are end-to-end encrypted, and we do not collect unnecessary data. You can manage permissions anytime in Settings > Privacy.',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: AppColors.darkGrey,
                    fontSize: 12,
                    height: 1.4,
                  ),
                ),
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: AppButton(
                    label: 'Continue & Grant Permission',

                    gradient: const LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [Color(0xFF05BDF8), Color(0xFF036F92)],
                    ),
                    onPressed: () async {
                      final prefs = await SharedPreferences.getInstance();
                      prefs.setBool('permission', true);

                      if (!context.mounted) return;

                      context.read<AuthState>().notify();
                    },
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
