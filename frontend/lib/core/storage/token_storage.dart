import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class TokenStorage {
  static const _kAccess = 'access_token';
  static const _kRefresh = 'refresh_token';
  final _ss = const FlutterSecureStorage();

  Future<void> save(String access, String refresh) async {
    await _ss.write(key: _kAccess, value: access);
    await _ss.write(key: _kRefresh, value: refresh);
  }

  Future<String?> get access async => _ss.read(key: _kAccess);
  Future<String?> get refresh async => _ss.read(key: _kRefresh);

  Future<void> setAccess(String t) => _ss.write(key: _kAccess, value: t);
  Future<void> setRefresh(String t) => _ss.write(key: _kRefresh, value: t);

  Future<void> clear() async {
    await _ss.delete(key: _kAccess);
    await _ss.delete(key: _kRefresh);
  }
}
