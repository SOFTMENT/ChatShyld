import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';

class AppButton extends StatelessWidget {
  final VoidCallback onPressed;
  final String label;
  final Color bgColor;
  final Color labelColor;
  final Gradient? gradient;
  final bool isLoading;

  const AppButton({
    super.key,

    required this.label,
    this.bgColor = Colors.black,
    this.labelColor = Colors.white,
    this.gradient,
    this.isLoading = false,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext ctx) {
    return DecoratedBox(
      decoration: BoxDecoration(
        // use gradient if provided, else solid bgColor
        gradient: gradient,
        color: gradient == null ? bgColor : null,
        borderRadius: BorderRadius.circular(12),
      ),
      child: isLoading
          ? const SpinKitThreeBounce(
              size: 16,
              color: Color.fromARGB(255, 255, 255, 46),
            )
          : TextButton(
              style: TextButton.styleFrom(
                backgroundColor: Colors.transparent,
                foregroundColor: labelColor,
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 12,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                textStyle: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
              onPressed: onPressed,
              child: Text(label),
            ),
    );
  }
}
