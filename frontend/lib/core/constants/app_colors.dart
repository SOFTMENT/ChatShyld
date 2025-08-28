import 'package:flutter/material.dart';

class AppColors {
  AppColors._(); // Private constructor to prevent instantiation

  /// Whites & Blacks
  static const Color white = Colors.white;
  static const Color black = Colors.black;

  /// Primary brand colors
  static const Color lightBlue = Color(0xFFE7FBEF);
  static const Color primaryBlue = Color(0xFF05C0FC);
  static const Color primaryDark = Color(0xFF037296);

  /// Accent & feedback
  static const Color accentOrange = Color(0xFFFFA500);
  static const Color successGreen = Color(0xFF388E3C);
  static const Color errorRed = Color(0xFFB00020);

  /// Backgrounds & surfaces
  static const Color background = Color(0xFFF9FAFC);
  static const Color surface = Colors.white;

  /// Text
  static const Color textPrimary = Color(0xFF212121);
  static const Color textSecondary = Color(0xFF757575);
  static const Color textLightGrey = Color(0XFFB1B1B1);

  /// Borders, dividers, etc.
  static const Color divider = Color(0xFFBDBDBD);
}
