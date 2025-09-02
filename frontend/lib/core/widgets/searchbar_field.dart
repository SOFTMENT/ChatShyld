import 'package:flutter/material.dart';

class SearchBarField extends StatelessWidget {
  const SearchBarField({super.key, this.controller, this.onChanged});

  final TextEditingController? controller;
  final ValueChanged<String>? onChanged;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 44, // tweak if you want taller/shorter
      child: TextField(
        controller: controller,
        onChanged: onChanged,
        textInputAction: TextInputAction.search,
        style: const TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.w500,
          color: Colors.black,
        ),
        decoration: InputDecoration(
          hintText: 'Search or start a chat',
          hintStyle: const TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w500,
            color: Color(0xFFB0B0B0), // soft grey placeholder
          ),
          filled: true,
          fillColor: const Color(0xFFF2EFF4), // BG F2EFF4
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 14,
            vertical: 12,
          ),

          // Rounded pill, no border lines
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide.none,
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide.none,
          ),

          // Trailing search icon from assets
          suffixIcon: Padding(
            padding: const EdgeInsets.only(right: 12),
            child: Image.asset(
              'assets/icons/search.png',
              width: 18,
              height: 18,
              color: const Color(
                0xFF9F9F9F,
              ), // tint to grey (remove if your PNG is precolored)
            ),
          ),
          suffixIconConstraints: const BoxConstraints(
            minWidth: 18,
            minHeight: 18,
          ),
        ),
        cursorColor: Colors.black,
      ),
    );
  }
}
