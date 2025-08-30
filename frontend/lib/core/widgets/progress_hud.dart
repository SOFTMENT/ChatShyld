import 'package:flutter/material.dart';

class ProgressHud extends StatelessWidget {
  final String? message;

  // Constructor to accept the message
  const ProgressHud({super.key, this.message});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color.fromARGB(
          255,
          32,
          32,
          33,
        ).withValues(alpha: 0.5), // Semi-transparent black background
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const SizedBox(
            width: 24,
            height: 24,
            child: CircularProgressIndicator(
              strokeWidth: 3,
              color: Colors.white, // White color for the spinner
            ),
          ),
          if (message != null) const SizedBox(width: 20),
          if (message != null)
            Text(
              message!,
              style: const TextStyle(color: Colors.white, fontSize: 14),
            ),
        ],
      ),
    );
  }
}
