import 'package:chatshyld/core/network/api_error.dart';

sealed class Result<T> {
  const Result();
  R when<R>({required R Function(T) ok, required R Function(ApiError) err});
  bool get isOk => this is Ok<T>;
  bool get isErr => this is Err<T>;
}

class Ok<T> extends Result<T> {
  final T value;
  const Ok(this.value);
  @override
  R when<R>({required R Function(T) ok, required R Function(ApiError) err}) =>
      ok(value);
}

class Err<T> extends Result<T> {
  final ApiError error;
  const Err(this.error);
  @override
  R when<R>({required R Function(T) ok, required R Function(ApiError) err}) =>
      err(error);
}
