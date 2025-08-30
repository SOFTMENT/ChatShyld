import 'dart:async';
import 'package:chatshyld/features/auth/data/repository/auth_repository.dart';
import 'package:dio/dio.dart';
import '../../storage/token_storage.dart';

class AuthInterceptor extends Interceptor {
  final TokenStorage _storage;
  final AuthRepository _repo;

  AuthInterceptor(this._storage, this._repo);

  bool _refreshing = false;
  Completer<void>? _refreshCompleter;

  bool _isAuthPath(RequestOptions o) {
    final p = o.path;
    return p.startsWith('/auth/');
  }

  @override
  void onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    final t = await _storage.access;
    if (t != null && !_isAuthPath(options)) {
      options.headers['Authorization'] = 'Bearer $t';
    }
    handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    final res = err.response;
    final original = err.requestOptions;

    final is401 = res?.statusCode == 401;
    final isRefreshCall = original.path == '/auth/refresh';
    //final isAuthCall = _isAuthPath(original);

    if (!is401 || isRefreshCall) {
      // Not a candidate for refresh (or refresh itself failed) → pass through
      return handler.next(err);
    }

    try {
      // If already refreshing, wait
      if (_refreshing) {
        await _refreshCompleter?.future;
      } else {
        _refreshing = true;
        _refreshCompleter = Completer<void>();
        try {
          await _repo.refresh(); // saves new tokens internally
          _refreshCompleter!.complete();
        } catch (e) {
          _refreshCompleter!.completeError(e);
          rethrow;
        } finally {
          _refreshing = false;
        }
      }

      // Retry original request once with new token
      final dio =
          err.requestOptions.cancelToken?.requestOptions?.extra['dio'] as Dio?;
      final client =
          dio ?? Dio(BaseOptions(baseUrl: original.baseUrl)); // fallback
      final newAccess = await _storage.access;
      final opts = Options(
        method: original.method,
        headers: {
          ...original.headers,
          if (newAccess != null) 'Authorization': 'Bearer $newAccess',
        },
        responseType: original.responseType,
        contentType: original.contentType,
        sendTimeout: original.sendTimeout,
        receiveTimeout: original.receiveTimeout,
        followRedirects: original.followRedirects,
        validateStatus: original.validateStatus,
      );

      final retry = await client.request(
        original.path,
        data: original.data,
        queryParameters: original.queryParameters,
        options: opts,
      );
      return handler.resolve(retry);
    } catch (_) {
      // Refresh failed → clear tokens and bubble up 401
      await _storage.clear();
      return handler.next(err);
    }
  }
}
