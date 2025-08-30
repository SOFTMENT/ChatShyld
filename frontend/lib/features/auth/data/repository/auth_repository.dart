import 'package:chatshyld/core/network/api_error.dart';
import 'package:chatshyld/core/storage/token_storage.dart';
import 'package:chatshyld/features/auth/data/models/result.dart';
import 'package:chatshyld/features/auth/data/services/auth_api_service.dart';
import 'package:dio/dio.dart';

import '../models/auth_response.dart';

class AuthRepository {
  final AuthApi _api;
  final TokenStorage _storage;
  AuthRepository(Dio dio, this._storage) : _api = AuthApi(dio);

  Future<Result<void>> sendOtp(String phone) async {
    try {
      await _api.sendOtp(phone: phone);
      return const Ok(null);
    } on ApiError catch (e) {
      return Err(e);
    } catch (e) {
      return Err(ApiError(0, 'unknown_error', e.toString()));
    }
  }

  Future<Result<AuthResponse>> verifyOtp(String phone, String code) async {
    try {
      final r = await _api.verifyOtp(phone: phone, code: code);
      await _storage.save(r.tokens.token, r.tokens.refreshToken);

      return Ok(r);
    } on ApiError catch (e) {
      return Err(e);
    } catch (e) {
      return Err(ApiError(0, 'unknown_error', e.toString()));
    }
  }

  Future<Result<AuthResponse>> refresh() async {
    try {
      final rt = await _storage.refresh;
      if (rt == null) return Err(ApiError(401, 'no_refresh_token'));
      final r = await _api.refresh(refreshToken: rt);
      await _storage.save(r.tokens.token, r.tokens.refreshToken);
      return Ok(r);
    } on ApiError catch (e) {
      return Err(e);
    } catch (e) {
      return Err(ApiError(0, 'unknown_error', e.toString()));
    }
  }

  Future<void> logout() => _storage.clear();
}
