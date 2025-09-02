import 'package:chatshyld/core/constants/app_colors.dart';
import 'package:chatshyld/core/widgets/outline_switch.dart';
import 'package:flutter/material.dart';

class PermissionContainer extends StatelessWidget {
  final String title;
  final String message;
  final Image icon;
  final bool value;
  final void Function(bool) onChange;

  const PermissionContainer({
    super.key,
    required this.icon,
    required this.title,
    required this.message,
    required this.value,
    required this.onChange,
  });
  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.only(top: 8, left: 12, right: 12, bottom: 10),
      decoration: BoxDecoration(
        color: Colors.white, // your card/background color
        borderRadius: BorderRadius.circular(12),
        boxShadow: const [
          BoxShadow(
            color: Color(0x40EBEBEB), // 25% of #EBEBEB (AA=0x40)
            offset: Offset(1, 1), // X=1, Y=1
            blurRadius: 1, // Blur = 1
            spreadRadius: 1, // Spread = 1
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(padding: const EdgeInsets.only(top: 3), child: icon),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        color: AppColors.black,
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const Spacer(),
                    OutlineSwitch(
                      height: 20,
                      width: 36,
                      value: value,
                      onChanged: onChange,
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  message,
                  style: const TextStyle(
                    color: AppColors.textSecondary,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
