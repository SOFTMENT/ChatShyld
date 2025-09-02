// lib/core/network/api_error.dart
import 'package:dio/dio.dart';

class ApiError implements Exception {
  final int status;
  final String code; // server "error" or local code
  final String? message; // user-facing
  ApiError(this.status, this.code, this.message);

  factory ApiError.fromDio(DioException e) {
    // no internet / timeout
    if (e.type == DioExceptionType.connectionTimeout ||
        e.type == DioExceptionType.receiveTimeout ||
        e.type == DioExceptionType.sendTimeout ||
        e.type == DioExceptionType.connectionError) {
      return ApiError(0, 'network_error', 'Check your internet connection.');
    }

    final status = e.response?.statusCode ?? 0;
    final data = e.response?.data;

    // pull backend error code if present
    final serverCode = (data is Map && data['error'] is String)
        ? data['error'] as String
        : null;

    switch (status) {
      case 400:
        return ApiError(
          status,
          serverCode ?? 'bad_request',
          'Please try again.',
        );
      case 401:
        return ApiError(
          status,
          serverCode ?? 'unauthorized',
          'Session expired. Please log in.',
        );
      case 403:
        return ApiError(
          status,
          serverCode ?? 'forbidden',
          'You don’t have access.',
        );
      case 404:
        return ApiError(
          status,
          serverCode ?? 'not_found',
          'Service not available. Try later.',
        );
      case 429:
        return ApiError(
          status,
          serverCode ?? 'rate_limited',
          'Too many attempts. Try again soon.',
        );
      case 500:
      case 502:
      case 503:
      case 504:
        return ApiError(
          status,
          serverCode ?? 'server_error',
          'Server error. Please try again.',
        );
    }
    return ApiError(
      status,
      serverCode ?? 'unknown_error',
      'Something went wrong.',
    );
  }
}
