import 'package:chatshyld/features/contacts/widgets/header_delegate.dart';
import 'package:flutter/material.dart';

class StickyHeader extends StatelessWidget {
  const StickyHeader({super.key, required this.title});
  final String title;

  @override
  Widget build(BuildContext context) {
    return SliverPersistentHeader(
      pinned: true,
      delegate: HeaderDelegate(
        minHeight: 28,
        maxHeight: 28,
        child: Container(
          color: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          alignment: Alignment.centerLeft,
          child: Text(
            title,
            style: const TextStyle(
              fontSize: 12,
              color: Color(0xFF777777),
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ),
    );
  }
}
