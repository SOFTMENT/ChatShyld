import 'user.dart';
import 'auth_tokens.dart';

class AuthResponse {
  final User user;
  final AuthTokens tokens;

  AuthResponse({required this.user, required this.tokens});

  factory AuthResponse.fromJson(Map<String, dynamic> j) => AuthResponse(
    user: User.fromJson(j['user'] as Map<String, dynamic>),
    tokens: AuthTokens(
      token: j['token'] as String,
      refreshToken: j['refreshToken'] as String,
      refreshExpiresAt: j['refreshExpiresAt'] as int?,
    ),
  );
}
