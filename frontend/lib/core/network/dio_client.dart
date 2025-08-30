import 'package:chatshyld/core/constants/api.dart';
import 'package:chatshyld/features/auth/data/repository/auth_repository.dart';
import 'package:dio/dio.dart';

import '../storage/token_storage.dart';

import 'interceptors/auth_interceptor.dart';

class DioClient {
  late final Dio dio;
  late final TokenStorage storage;
  late final AuthRepository authRepo;

  DioClient() {
    storage = TokenStorage();
    dio = Dio(
      BaseOptions(
        baseUrl: Api.baseUrl,
        connectTimeout: const Duration(seconds: 10),
        receiveTimeout: const Duration(seconds: 20),
      ),
    );

    authRepo = AuthRepository(dio, storage);

    // Attach our auth interceptor (order matters)
    dio.interceptors.add(AuthInterceptor(storage, authRepo));

    // Put dio into request extras so interceptor can reuse for retry (optional)
    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (o, h) {
          o.extra['dio'] = dio;
          h.next(o);
        },
      ),
    );
  }
}
