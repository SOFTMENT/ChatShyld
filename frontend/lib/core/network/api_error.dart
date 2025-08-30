class ApiError implements Exception {
  final int status;
  final String code;
  final String? message;
  ApiError(this.status, this.code, [this.message]);
  @override
  String toString() => "ApiError($status, $code, $message)";
}
