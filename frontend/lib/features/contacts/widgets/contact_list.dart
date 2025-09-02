import 'dart:collection';

import 'package:chatshyld/features/contacts/data/models/matched_contact.dart';
import 'package:chatshyld/features/contacts/widgets/contact_tile.dart';
import 'package:chatshyld/features/contacts/widgets/sticky_header.dart';
import 'package:flutter/material.dart';

class ContactsList extends StatelessWidget {
  const ContactsList({
    super.key,
    required this.controller,
    required this.grouped,
  });
  final ScrollController controller;
  final SplayTreeMap<String, List<MatchedContact>> grouped;

  @override
  Widget build(BuildContext context) {
    final sections = grouped.entries.toList();
    return CustomScrollView(
      controller: controller,
      slivers: [
        for (final s in sections) ...[
          StickyHeader(title: s.key),
          SliverList(
            delegate: SliverChildBuilderDelegate(
              (context, i) => ContactTile(item: s.value[i]),
              childCount: s.value.length,
            ),
          ),
        ],
        const SliverToBoxAdapter(child: SizedBox(height: 24)),
      ],
    );
  }
}
