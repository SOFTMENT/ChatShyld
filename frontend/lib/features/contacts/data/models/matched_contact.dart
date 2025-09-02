class MatchedContact {
  final String userId;
  final String phone; // E.164
  final String? photoKey; // S3 key (optional)
  final String localName; // device contact name (preferred display name)
  final String createdAt;

  const MatchedContact({
    required this.userId,
    required this.phone,
    required this.localName,
    required this.createdAt,
    this.photoKey,
  });
}
