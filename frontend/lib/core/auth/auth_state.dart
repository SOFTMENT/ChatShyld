import 'package:chatshyld/core/constants/api.dart';
import 'package:chatshyld/features/auth/data/models/user.dart';
import 'package:chatshyld/features/auth/data/repository/auth_repository.dart';
import 'package:chatshyld/features/chat/data/models/chat_message.dart';
import 'package:chatshyld/features/chat/data/services/chat_socket.dart';
import 'package:chatshyld/features/profile/data/services/profile_api_service.dart';
import 'package:flutter/foundation.dart';
import 'package:jwt_decoder/jwt_decoder.dart';

import '../../core/storage/token_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';

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

  Future<bool> get hasPermission async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool('permission') ?? false;
  }

  Future<void> bootstrap() async {
    final access = await storage.access;
    print(access);
    final refresh = await storage.refresh;

    if (access == null || refresh == null) {
      status = AuthStatus.anon;
      notifyListeners();
      return;
    }

    // refresh if expired
    if (JwtDecoder.isExpired(access)) {
      final res = await authRepo.refresh();

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

      ChatMessage.meId = me!.userId;
      final token = await storage.access; // non-null now
      await ChatSocket.I.connect(wsBaseUrl: Api.wsUrl, accessToken: token!);
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

    await ChatSocket.I.disconnect();
    ChatMessage.meId = '';
    notifyListeners();
  }

  void setUser(User u) {
    me = u;
    notifyListeners();
  }

  void notify() {
    notifyListeners();
  }
}
