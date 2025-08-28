import 'package:flutter/material.dart';
import 'package:chatshyld/core/widgets/app_icon_button.dart';

class MyAppBar extends StatelessWidget {
  final String title;
  final VoidCallback? onBack;

  const MyAppBar({super.key, required this.title, this.onBack});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 56,
      width: double.infinity,
      child: Stack(
        alignment: Alignment.center,
        children: [
          Align(
            alignment: Alignment.centerLeft,
            child: Padding(
              padding: const EdgeInsets.only(left: 12),
              child: AppIconButton(
                icon: Icons.keyboard_backspace,
                onTap: onBack ?? () => Navigator.of(context).pop(),
              ),
            ),
          ),
          Center(
            child: Text(
              title,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
              textAlign: TextAlign.center,
            ),
          ),
        ],
      ),
    );
  }
}
