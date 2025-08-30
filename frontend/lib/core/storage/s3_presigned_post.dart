import 'dart:io';
import 'package:dio/dio.dart';

Future<void> uploadToS3PresignedPost(
  String url,
  Map<String, dynamic> fields,
  File file,
  void Function(int sent, int total) onProgress,
) async {
  final form = FormData();
  fields.forEach((k, v) => form.fields.add(MapEntry(k, v.toString())));
  form.files.add(
    MapEntry(
      'file',
      await MultipartFile.fromFile(file.path, filename: 'avatar.jpg'),
    ),
  );

  final resp = await Dio().post(url, data: form, onSendProgress: onProgress);
  if (resp.statusCode != 204) {
    throw Exception('Upload failed: ${resp.statusCode}');
  }
}
