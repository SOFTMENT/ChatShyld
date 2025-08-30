class AuthTokens {
  final String token; // access JWT
  final String refreshToken;
  final int? refreshExpiresAt; // epoch seconds

  AuthTokens({
    required this.token,
    required this.refreshToken,
    this.refreshExpiresAt,
  });
}
