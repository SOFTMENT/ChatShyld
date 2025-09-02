import 'dart:math';
import 'package:chatshyld/features/auth/data/models/user.dart';
import 'package:dio/dio.dart';
import 'package:chatshyld/core/network/api_error.dart';

class ContactsApi {
  final Dio _dio;
  ContactsApi(this._dio);

  Future<List<User>> lookupByPhones(List<String> phones) async {
    final uniques = phones.toSet().toList(); // de-dupe
    final out = <User>[];

    for (var i = 0; i < uniques.length; i += 500) {
      final chunk = uniques.sublist(i, min(i + 500, uniques.length));
      try {
        final res = await _dio.post(
          '/contacts/lookup',
          data: {'phones': chunk},
        );
        final users = (res.data['users'] as List)
            .map((j) => User.fromJson(Map<String, dynamic>.from(j)))
            .toList();
        out.addAll(users);
      } on DioException catch (e) {
        throw ApiError.fromDio(e);
      }
    }

    // ensure no duplicates by userId
    final byId = {for (final u in out) u.userId: u};
    return byId.values.toList();
  }
}
