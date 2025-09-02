import 'dart:collection';
import 'package:chatshyld/features/contacts/data/models/matched_contact.dart';
import 'package:chatshyld/features/contacts/widgets/contact_list.dart';

import 'package:flutter/material.dart';

import 'package:chatshyld/core/widgets/progress_hud.dart';

/// Opens a draggable bottom sheet and returns the picked contact (or null).
Future<MatchedContact?> showMatchedContactsSheet(
  BuildContext context, {
  required Future<List<MatchedContact>> Function() loadMatches,
  String title = 'Start Chat',
  String searchHint = 'Search by name or number',
}) {
  return showModalBottomSheet<MatchedContact>(
    context: context,
    isScrollControlled: true,
    useSafeArea: true,
    backgroundColor: Colors.transparent,
    builder: (_) => _MatchedContactsSheet(
      loadMatches: loadMatches,
      title: title,
      searchHint: searchHint,
    ),
  );
}

class _MatchedContactsSheet extends StatefulWidget {
  const _MatchedContactsSheet({
    required this.loadMatches,
    required this.title,
    required this.searchHint,
  });

  final Future<List<MatchedContact>> Function() loadMatches;
  final String title;
  final String searchHint;

  @override
  State<_MatchedContactsSheet> createState() => _MatchedContactsSheetState();
}

class _MatchedContactsSheetState extends State<_MatchedContactsSheet> {
  final _search = TextEditingController();
  List<MatchedContact> _all = const [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _init();
    _search.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    _search.dispose();
    super.dispose();
  }

  Future<void> _init() async {
    try {
      final data = await widget.loadMatches();
      data.sort(
        (a, b) =>
            a.localName.toLowerCase().compareTo(b.localName.toLowerCase()),
      );
      if (!mounted) return;
      setState(() {
        _all = data;
        _loading = false;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() => _loading = false);
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Failed to load contacts')));
    }
  }

  List<MatchedContact> get _filtered {
    final q = _search.text.trim().toLowerCase();
    if (q.isEmpty) return _all;
    return _all
        .where(
          (c) => c.localName.toLowerCase().contains(q) || c.phone.contains(q),
        )
        .toList();
  }

  /// Group by first letter A–Z, others '#'
  SplayTreeMap<String, List<MatchedContact>> _grouped(
    List<MatchedContact> list,
  ) {
    final map = SplayTreeMap<String, List<MatchedContact>>();
    for (final c in list) {
      final ch = (c.localName.isNotEmpty ? c.localName[0] : '#').toUpperCase();
      final key = RegExp(r'^[A-Z]$').hasMatch(ch) ? ch : '#';
      map.putIfAbsent(key, () => <MatchedContact>[]).add(c);
    }
    return map;
  }

  @override
  Widget build(BuildContext context) {
    return DraggableScrollableSheet(
      initialChildSize: 0.95,
      minChildSize: 0.55,
      maxChildSize: 0.95,
      builder: (context, controller) {
        return GestureDetector(
          onTap: () => FocusScope.of(context).unfocus(),
          child: Container(
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
              boxShadow: [BoxShadow(blurRadius: 12, color: Color(0x33000000))],
            ),
            child: Column(
              children: [
                const SizedBox(height: 10),
                Container(
                  height: 4,
                  width: 36,
                  decoration: BoxDecoration(
                    color: const Color(0x22000000),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  widget.title,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 12),

                // Search field
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: TextField(
                    controller: _search,
                    textInputAction: TextInputAction.search,
                    decoration: InputDecoration(
                      hintText: widget.searchHint,
                      filled: true,
                      fillColor: const Color(0xFFF2EFF4),
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 14,
                        vertical: 10,
                      ),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide.none,
                      ),
                      suffixIcon: Padding(
                        padding: const EdgeInsets.only(right: 10),
                        child: Image.asset('assets/icons/search.png'),
                      ),
                      suffixIconConstraints: const BoxConstraints(
                        minWidth: 30,
                        minHeight: 30,
                        maxWidth: 30,
                        maxHeight: 30,
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 8),

                Expanded(
                  child: _loading
                      ? const Center(child: ProgressHud())
                      : (_all.isEmpty
                            ? const _EmptyState()
                            : ContactsList(
                                controller: controller,
                                grouped: _grouped(_filtered),
                              )),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

class _EmptyState extends StatelessWidget {
  const _EmptyState();

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Text(
        'No contacts on ChatShyld yet',
        style: TextStyle(color: Colors.grey),
      ),
    );
  }
}
