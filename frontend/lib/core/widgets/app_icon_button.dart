import 'package:flutter/material.dart';

class AppIconButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback? onTap;
  final double size;
  final Color backgroundColor;
  final Color iconColor;
  final double borderRadius;
  final double fill;
  final double iconSize;
  const AppIconButton({
    super.key,
    required this.icon,
    this.onTap,
    this.size = 40,
    this.iconSize = 32,
    this.backgroundColor = const Color(0xFFE6F0FF),
    this.iconColor = Colors.black,
    this.borderRadius = 12,
    this.fill = 0,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap ?? () => Navigator.of(context).pop(),
      child: Container(
        height: size,
        width: size,
        decoration: BoxDecoration(
          color: backgroundColor,
          borderRadius: BorderRadius.circular(borderRadius),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFFACACAC).withValues(alpha: 0.25),
              offset: const Offset(0.7, 0.7),
              blurRadius: 2,
              spreadRadius: 1,
            ),
          ],
        ),
        child: Center(
          child: Icon(icon, size: iconSize, color: iconColor, opticalSize: 1),
        ),
      ),
    );
  }
}
