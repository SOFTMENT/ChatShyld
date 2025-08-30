import 'package:chatshyld/core/network/api_error.dart';
import 'package:dio/dio.dart';

import '../models/auth_response.dart';

class AuthApi {
  final Dio _dio;
  AuthApi(this._dio);

  Future<void> sendOtp({required String phone}) async {
    try {
      await _dio.post('/auth/send-otp', data: {'phone': phone});
    } on DioException catch (e) {
      final status = e.response?.statusCode ?? 0;
      final code =
          (e.response?.data is Map && e.response?.data['error'] is String)
          ? e.response!.data['error'] as String
          : 'unknown_error';
      throw ApiError(status, code, e.message);
    }
  }

  Future<AuthResponse> verifyOtp({
    required String phone,
    required String code,
  }) async {
    try {
      final res = await _dio.post(
        '/auth/verify-otp',
        data: {'phone': phone, 'code': code},
      );
      return AuthResponse.fromJson(res.data as Map<String, dynamic>);
    } on DioException catch (e) {
      final status = e.response?.statusCode ?? 0;
      final code =
          (e.response?.data is Map && e.response?.data['error'] is String)
          ? e.response!.data['error'] as String
          : 'unknown_error';
      throw ApiError(status, code, e.message);
    }
  }

  Future<AuthResponse> refresh({required String refreshToken}) async {
    try {
      final res = await _dio.post(
        '/auth/refresh',
        data: {'refreshToken': refreshToken},
      );
      return AuthResponse.fromJson(res.data as Map<String, dynamic>);
    } on DioException catch (e) {
      final status = e.response?.statusCode ?? 0;
      final code =
          (e.response?.data is Map && e.response?.data['error'] is String)
          ? e.response!.data['error'] as String
          : 'unknown_error';
      throw ApiError(status, code, e.message);
    }
  }
}
