import 'dart:io';

import 'package:chatshyld/core/auth/auth_state.dart';
import 'package:chatshyld/core/constants/app_colors.dart';
import 'package:chatshyld/core/constants/app_scaffold.dart';
import 'package:chatshyld/core/network/dio_client.dart';
import 'package:chatshyld/core/services/image_service.dart';
import 'package:chatshyld/core/storage/s3_presigned_post.dart';
import 'package:chatshyld/core/widgets/app_button.dart';
import 'package:chatshyld/core/widgets/image_picker_dialog.dart';
import 'package:chatshyld/core/widgets/progress_hud.dart';
import 'package:chatshyld/features/profile/data/services/profile_api_service.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:material_symbols_icons/symbols.dart';

import 'package:provider/provider.dart';

class SetupProfilePage extends StatefulWidget {
  const SetupProfilePage({super.key});

  @override
  State<SetupProfilePage> createState() => _SetupProfilePageState();
}

class _SetupProfilePageState extends State<SetupProfilePage> {
  final _focus = FocusNode();
  final _nameCtrl = TextEditingController();
  File? _image;
  String? _url;
  String? _key;
  Map<String, dynamic>? _fields;
  var _isLoading = false;
  String? _loadingMessage;
  late Dio dio;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _focus.requestFocus());
    dio = DioClient().dio;
  }

  void _updateProfile() async {
    final name = _nameCtrl.text.trim();
    if (name.isEmpty) {
      AppScaffoldMessenger.showScaffold(context, 'Enter full name.');
      return;
    }

    setState(() {
      _isLoading = true;
    });

    if (_url == null || _fields == null || _image == null) return;

    await uploadToS3PresignedPost(_url!, _fields!, _image!, (sent, total) {
      final pct = (sent / (total == 0 ? 1 : total) * 100).toStringAsFixed(0);
      setState(() {
        _loadingMessage = '$pct%';
      });
    });

    setState(() {
      _loadingMessage = null;
    });

    final user = await ProfileApi(dio).updateMe(name: name, photoKey: _key);

    if (!mounted) return;
    context.read<AuthState>().setUser(user);

    setState(() {
      _isLoading = false;
    });
  }

  void _selectImage() async {
    final imageSource = await ImagePickerDialog.show(context);
    if (imageSource == null || !mounted) return;

    final selectedImage = await ImageService.pickImage(context, imageSource);

    setState(() {
      _image = selectedImage;
    });

    setState(() {
      _isLoading = true;
    });

    final data = await getPresigndPost();
    if (data != null) {
      _url = data['url'] as String;
      _fields = Map<String, dynamic>.from(data['fields']);
      _key = data['key'] as String;
    }
    setState(() {
      _isLoading = false;
    });
  }

  Future<Map<String, dynamic>?> getPresigndPost() async {
    if (_image == null) return null;
    final contentType = "image/jpeg";
    final size = await _image!.length();

    final presign = await dio.post(
      '/profile/avatar/presign',
      data: {'contentType': contentType, 'fileSize': size},
    );
    final data = presign.data as Map<String, dynamic>;
    return data;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          SafeArea(
            child: Padding(
              padding: const EdgeInsetsGeometry.only(
                left: 25,
                right: 25,
                top: 20,
                bottom: 10,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Setup your profile',

                    style: TextStyle(
                      color: AppColors.black,
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                      height: 1.2,
                    ),
                    textHeightBehavior: TextHeightBehavior(
                      applyHeightToFirstAscent: false,
                      applyHeightToLastDescent: false,
                    ),
                  ),
                  const SizedBox(height: 20),

                  Align(
                    alignment: Alignment.topCenter,
                    child: GestureDetector(
                      onTap: _selectImage,
                      child: Stack(
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(1000),
                            child: SizedBox(
                              height: 160,
                              width: 160,
                              child: _image != null
                                  ? Image.file(_image!, fit: BoxFit.cover)
                                  : Image.asset(
                                      'assets/images/profile-placeholder.png',
                                      fit: BoxFit.contain,
                                    ),
                            ),
                          ),
                          const Positioned(
                            bottom: 12,
                            right: 12,
                            child: Icon(
                              Symbols.photo_camera,
                              fill: 1,
                              color: AppColors.pinkLight,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 32),

                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Full name',
                        style: TextStyle(
                          color: AppColors.textSecondary,
                          fontSize: 13,
                        ),
                      ),

                      TextField(
                        focusNode: _focus,
                        controller: _nameCtrl,
                        autofocus: true,

                        textCapitalization: TextCapitalization.words,
                        decoration: InputDecoration(
                          labelStyle: const TextStyle(
                            color: Colors.grey,
                            fontSize: 14,
                          ),
                          isDense: false, // allow more height
                          contentPadding: const EdgeInsets.symmetric(
                            vertical: 8,
                          ),
                          enabledBorder: UnderlineInputBorder(
                            borderSide: BorderSide(color: Colors.grey.shade300),
                          ),
                          focusedBorder: UnderlineInputBorder(
                            borderSide: BorderSide(color: Colors.grey.shade300),
                          ),
                        ),
                        style: const TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.w600,
                          color: Colors.black,
                        ),
                      ),
                    ],
                  ),

                  const Spacer(),

                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: AppButton(
                      label: 'Save',
                      gradient: const LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [Color(0xFF05BDF8), Color(0xFF036F92)],
                      ),
                      onPressed: _updateProfile,
                    ),
                  ),
                ],
              ),
            ),
          ),
          if (_isLoading) Center(child: ProgressHud(message: _loadingMessage)),
        ],
      ),
    );
  }
}
