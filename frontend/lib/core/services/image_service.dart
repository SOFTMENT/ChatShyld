import 'package:chatshyld/core/constants/api.dart';
import 'package:chatshyld/core/constants/app_colors.dart';
import 'package:chatshyld/features/permission/data/services/permission_service.dart';
import 'package:chatshyld/core/widgets/image_picker_dialog.dart';
import 'package:device_info_plus/device_info_plus.dart';
import 'package:flutter_image_compress/flutter_image_compress.dart';
import 'package:image_cropper/image_cropper.dart';

import 'package:image_picker/image_picker.dart';

import 'package:flutter/material.dart';
import 'package:path_provider/path_provider.dart';

import 'dart:io';

import 'package:permission_handler/permission_handler.dart';

class ImageService {
  /// Pick Image from Gallery or Camera
  static Future<File?> pickImage(
    BuildContext context,
    ImagePickerSource imagePickerSource, {
    double ratioX = 1,
    double ratioY = 1,
  }) async {
    final permissionService = PermissionService();

    var isGranted = false;

    if (imagePickerSource == ImagePickerSource.gallery) {
      isGranted = await requestGalleryPermission(context, permissionService);
    } else {
      isGranted = await requestCameraPermission(context, permissionService);
    }

    if (!isGranted || !context.mounted) return null;

    try {
      XFile? pickedFile;
      final ImagePicker picker = ImagePicker();
      if (imagePickerSource == ImagePickerSource.gallery) {
        pickedFile = await picker.pickImage(source: ImageSource.gallery);
      } else if (imagePickerSource == ImagePickerSource.camera) {
        pickedFile = await picker.pickImage(source: ImageSource.camera);
      }

      if (pickedFile != null) {
        File? cropFile = await cropImage(File(pickedFile.path), ratioX, ratioY);
        if (cropFile != null) {
          return compressAndConvertImage(imageFile: cropFile);
        }
      }

      return null;
    } catch (e) {
      return null;
    }
  }

  static Future<bool> requestGalleryPermission(
    BuildContext context,
    PermissionService permissionService,
  ) async {
    if (Platform.isAndroid) {
      final deviceInfo = DeviceInfoPlugin();

      final androidInfo = await deviceInfo.androidInfo;
      final sdkInt = androidInfo.version.sdkInt;

      if (!context.mounted) return false;

      return sdkInt <= 32
          ? await permissionService.request(
              context,
              permission: Permission.storage,
            )
          : await permissionService.request(
              context,
              permission: Permission.photos,
            );
    } else {
      if (!context.mounted) return false;
      return await permissionService.request(
        context,
        permission: Permission.photos,
      );
    }
  }

  static Future<bool> requestCameraPermission(
    BuildContext context,
    PermissionService permissionService,
  ) async {
    if (!context.mounted) return false;
    return await permissionService.request(
      context,
      permission: Permission.camera,
    );
  }

  /// Crop Image to Square
  static Future<File?> cropImage(
    File imageFile,
    double ratioX,
    double ratioY,
  ) async {
    try {
      CroppedFile? croppedFile = await ImageCropper().cropImage(
        sourcePath: imageFile.path,
        aspectRatio: CropAspectRatio(ratioX: ratioX, ratioY: ratioY),
        uiSettings: [
          AndroidUiSettings(
            toolbarTitle: 'Crop Image',
            toolbarColor: AppColors.black,
            toolbarWidgetColor: AppColors.white,
            hideBottomControls: true,
            lockAspectRatio: true,
          ),
          IOSUiSettings(title: 'Crop Image'),
        ],
      );

      if (croppedFile != null) {
        return File(croppedFile.path);
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  static Future<File?> compressAndConvertImage({
    required File imageFile,
    CompressFormat format = CompressFormat.jpeg,
  }) async {
    try {
      final tempDir = await getTemporaryDirectory();
      // Change the extension to .jpg for JPEG format
      final targetPath =
          '${tempDir.path}/${DateTime.now().millisecondsSinceEpoch}.jpg';

      final XFile? compressedXFile =
          await FlutterImageCompress.compressAndGetFile(
            imageFile.absolute.path,
            targetPath,
            quality: 65, // Lower quality for more compression
            format: format, // Use JPEG format
            keepExif: false,
          );

      if (compressedXFile != null) {
        return File(compressedXFile.path);
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  static String generateImageUrl({
    required String imagePath, // The path of the image in S3
  }) {
    const baseURL = Api.imageBaseUrl;

    // Build the complete URL
    return "$baseURL$imagePath";
  }
}
