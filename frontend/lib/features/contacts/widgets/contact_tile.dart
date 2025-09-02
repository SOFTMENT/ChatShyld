import 'package:chatshyld/core/widgets/custom_image.dart';
import 'package:chatshyld/features/contacts/data/models/matched_contact.dart';
import 'package:flutter/material.dart';

class ContactTile extends StatelessWidget {
  const ContactTile({super.key, required this.item});
  final MatchedContact item;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      onTap: () => Navigator.of(context).pop(item),
      leading: _avatar(item),
      title: Text(
        item.localName,
        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
        overflow: TextOverflow.ellipsis,
      ),
      // subtitle: Text(item.phone, style: const TextStyle(color: Colors.grey)),
      dense: true,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 3),
    );
  }

  Widget _avatar(MatchedContact c) {
    if ((c.photoKey ?? '').isNotEmpty) {
      // CustomImage should handle sizing itself; add a radius if needed.
      return ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: SizedBox(
          height: 40,
          width: 40,
          child: CustomImage(imageKey: c.photoKey),
        ),
      );
    }
    final parts = c.localName.trim().split(RegExp(r'\s+'));
    final initials = parts
        .take(2)
        .map((e) => e.isNotEmpty ? e[0] : '')
        .join()
        .toUpperCase();
    return CircleAvatar(
      radius: 20,
      backgroundColor: const Color(0xFFE8F1FF),
      child: Text(initials, style: const TextStyle(color: Colors.black)),
    );
  }
}
