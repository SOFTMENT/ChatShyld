// lib/core/constants/app_text_styles.dart

import 'package:flutter/material.dart';
import 'app_colors.dart';

class AppTextStyles {
  AppTextStyles._(); // no instances

  // Headline / big titles
  static const TextStyle headline = TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.bold,
    color: AppColors.black,
  );

  // Subheading / section titles
  static const TextStyle subheading = TextStyle(
    fontSize: 17,
    fontWeight: FontWeight.w600,
    color: AppColors.textPrimary,
  );

  // Body text
  static const TextStyle body = TextStyle(
    fontSize: 14,
    color: AppColors.textPrimary,
  );

  // Accent text
  static const TextStyle accent = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.w500,
    color: AppColors.accentOrange,
  );
}
