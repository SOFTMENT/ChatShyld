import 'package:flutter/material.dart';

class AppScaffoldMessenger {
  static void showScaffold(BuildContext context, String message) {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text(message)));
  }
}
