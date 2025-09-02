import 'dart:io';
import 'package:flutter/widgets.dart';
import 'package:flutter_contacts/flutter_contacts.dart';
import 'package:phone_numbers_parser/phone_numbers_parser.dart';

class DeviceContacts {
  static String? toE164(String raw, {IsoCode? contactsIso}) {
    try {
      final pn = raw.trim().startsWith('+')
          ? PhoneNumber.parse(raw)
          : (contactsIso != null
                ? PhoneNumber.parse(raw, callerCountry: contactsIso)
                : null);
      if (pn == null) return null;
      return '+${pn.countryCode}${pn.nsn}'; // STRICT E.164, no spaces
    } catch (_) {
      return null;
    }
  }

  static IsoCode? _isoFrom(String? cc) {
    if (cc == null || cc.length != 2) return null;
    try {
      return IsoCode.values.byName(cc.toUpperCase());
    } catch (_) {
      return null;
    }
  }

  static Future<List<Map<String, String>>> load({
    IsoCode? userIso,
    bool allNumbersPerContact = false,
  }) async {
    if (!Platform.isIOS && !Platform.isAndroid) return [];

    final granted = await FlutterContacts.requestPermission(readonly: true);
    if (!granted) return [];

    final iso =
        userIso ??
        _isoFrom(WidgetsBinding.instance.platformDispatcher.locale.countryCode);

    final contacts = await FlutterContacts.getContacts(withProperties: true);
    final out = <Map<String, String>>[];

    for (final c in contacts) {
      if (c.phones.isEmpty) continue;
      final list = allNumbersPerContact ? c.phones : [c.phones.first];

      for (final p in list) {
        final e164 = toE164(p.number, contactsIso: iso);
        if (e164 != null) {
          out.add({'name': c.displayName, 'phone': e164});
        }
      }
    }
    return out;
  }
}
