import 'package:chatshyld/features/auth/data/models/user.dart';
import 'package:chatshyld/features/auth/data/repository/auth_repository.dart';
import 'package:chatshyld/features/profile/data/services/profile_api_service.dart';
import 'package:flutter/foundation.dart';
import 'package:jwt_decoder/jwt_decoder.dart';

import '../../core/storage/token_storage.dart';

enum AuthStatus { unknown, authed, anon }

class AuthState extends ChangeNotifier {
  final AuthRepository authRepo; // from your DioClient
  final TokenStorage storage; // from your DioClient
  final ProfileApi profileApi; // uses dio

  AuthStatus status = AuthStatus.unknown;
  User? me;

  AuthState(this.authRepo, this.storage, this.profileApi);

  bool get needsProfile =>
      status == AuthStatus.authed && ((me?.name ?? '').trim().isEmpty);

  Future<void> bootstrap() async {
    final access = await storage.access;
    final refresh = await storage.refresh;

    if (access == null || refresh == null) {
      status = AuthStatus.anon;
      notifyListeners();
      return;
    }

    // refresh if expired
    if (JwtDecoder.isExpired(access)) {
      final res = await authRepo
          .refresh(); // your repo returns Result or throws
      // if you throw, wrap in try/catch and clear on failure
      if (res.isErr) {
        await storage.clear();
        status = AuthStatus.anon;
        notifyListeners();
        return;
      }
    }

    try {
      me = await profileApi.getMe(); // GET /profile/me
      status = AuthStatus.authed;
    } catch (_) {
      await storage.clear();
      status = AuthStatus.anon;
    }
    notifyListeners();
  }

  Future<void> logout() async {
    await storage.clear();
    me = null;
    status = AuthStatus.anon;
    notifyListeners();
  }

  void setUser(User u) {
    me = u;
    notifyListeners();
  } // call after PATCH /profile/me
}
