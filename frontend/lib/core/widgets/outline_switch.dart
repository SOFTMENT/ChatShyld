import 'package:flutter/material.dart';

class OutlineSwitch extends StatelessWidget {
  const OutlineSwitch({
    super.key,
    required this.value,
    required this.onChanged,
    this.width = 46,
    this.height = 26,
    this.color = const Color(0xFF22C55E),
  });

  final bool value;
  final ValueChanged<bool> onChanged;
  final double width;
  final double height;
  final Color color;

  @override
  Widget build(BuildContext context) {
    final knob = height - 6; // 3px padding each side
    return GestureDetector(
      onTap: () => onChanged(!value),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 160),
        curve: Curves.easeOut,
        width: width,
        height: height,
        padding: const EdgeInsets.all(3),
        decoration: BoxDecoration(
          color: value ? color : Colors.white, // ← filled when ON
          borderRadius: BorderRadius.circular(height / 2),
          border: Border.all(color: color, width: 2),
        ),
        child: AnimatedAlign(
          duration: const Duration(milliseconds: 160),
          curve: Curves.easeOut,
          alignment: value ? Alignment.centerRight : Alignment.centerLeft,
          child: Container(
            width: knob,
            height: knob,
            decoration: BoxDecoration(
              color: value ? Colors.white : color, // white knob on filled track
              shape: BoxShape.circle,
            ),
          ),
        ),
      ),
    );
  }
}
