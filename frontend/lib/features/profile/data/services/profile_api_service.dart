import 'package:chatshyld/features/auth/data/models/user.dart';
import 'package:dio/dio.dart';
import 'package:chatshyld/core/network/api_error.dart';

class ProfileApi {
  final Dio _dio;
  ProfileApi(this._dio);

  Future<User> getMe() async {
    try {
      final res = await _dio.get('/profile/me');
      // backend returns the user object directly (not wrapped)
      final data = res.data;
      if (data is! Map) {
        throw ApiError(
          res.statusCode ?? 0,
          'invalid_response',
          'Expected JSON object',
        );
      }
      return User.fromJson(Map<String, dynamic>.from(data));
    } on DioException catch (e) {
      final status = e.response?.statusCode ?? 0;
      final body = e.response?.data;
      final code = (body is Map && body['error'] is String)
          ? body['error'] as String
          : 'unknown_error';
      throw ApiError(status, code, e.message);
    }
  }

  /// Update current user's profile. Pass at least one field.
  Future<User> updateMe({String? name, String? photoKey}) async {
    // guard: at least one field
    if ((name == null || name.trim().isEmpty) &&
        (photoKey == null || photoKey.isEmpty)) {
      throw ApiError(400, 'empty_patch', 'Provide name and/or photoKey');
    }

    // build payload with only provided fields
    final payload = <String, dynamic>{};
    if (name != null) payload['name'] = name.trim();
    if (photoKey != null) payload['photoKey'] = photoKey;

    try {
      final res = await _dio.patch('/profile/me', data: payload);

      final data = res.data;
      if (data is! Map) {
        throw ApiError(
          res.statusCode ?? 0,
          'invalid_response',
          'Expected JSON object',
        );
      }

      final userJson = data['user'];

      if (userJson is! Map) {
        throw ApiError(
          res.statusCode ?? 0,
          'invalid_response',
          'Missing "user" in response',
        );
      }

      return User.fromJson(Map<String, dynamic>.from(userJson));
    } on DioException catch (e) {
      final status = e.response?.statusCode ?? 0;
      final body = e.response?.data;
      final code = (body is Map && body['error'] is String)
          ? body['error'] as String
          : 'unknown_error';
      throw ApiError(status, code, e.message);
    }
  }
}
