class User {
  final String userId;
  final String phone;
  final String createdAt;
  final String? name;
  final String? photoKey;

  User({
    required this.userId,
    required this.phone,
    required this.createdAt,

    this.name,
    this.photoKey,
  });

  factory User.fromJson(Map<String, dynamic> j) => User(
    userId: j['userId'] as String,
    phone: j['phone'] as String,
    createdAt: j['createdAt'] as String,
    name: j['name'] as String?,
    photoKey: j['photoKey'] as String?,
  );
}
