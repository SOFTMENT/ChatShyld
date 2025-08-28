import 'package:chatshyld/core/constants/countries_list.dart';
import 'package:devicelocale/devicelocale.dart';

class CountryPickerService {
  static Future<Map<String, String>?> detectUserCountry() async {
    try {
      // Get the current locale as a String (e.g., "en-US")
      final localeString = await Devicelocale.currentLocale;

      if (localeString != null) {
        // Split the string to extract the country code
        final parts = localeString.split('-');
        if (parts.length >= 2) {
          final countryCode = parts[1]; // The country code is the second part
          var country = countryList.firstWhere(
            (element) => element['code'] == countryCode,
            orElse: () => {
              "dial_code": "+61",
              "flag": "🇦🇺",
            }, // Default to Australia if not found
          );

          return country;
        }
      }
      // If localeString was null, or parts < 2, fall through and return null
      return null;
    } catch (e) {
      // On any error, also return null
      return null;
    }
  }
}
