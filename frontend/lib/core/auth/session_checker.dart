import 'package:chatshyld/core/network/dio_client.dart';

import 'package:jwt_decoder/jwt_decoder.dart';

class SessionChecker {
  final client = DioClient(); // or inject via DI
  /// Returns true if we have a valid access token (or we could refresh it).
  Future<bool> ensureSession() async {
    final access = await client.storage.access;
    final refresh = await client.storage.refresh;
    if (access == null || refresh == null) return false;

    final expired = JwtDecoder.isExpired(access);
    if (!expired) return true;

    // try to refresh once
    final res = await client.authRepo.refresh();
    return res
        .isOk; // using Result<T> pattern from earlier; or catch errors if you throw
  }

  /// Extracts userId (sub) from the current access token, if any.
  Future<String?> currentUserId() async {
    final t = await client.storage.access;
    if (t == null || JwtDecoder.isExpired(t)) return null;
    final payload = JwtDecoder.decode(t);
    return payload['sub'] as String?;
  }
}
