import 'package:chatshyld/core/constants/app_colors.dart';
import 'package:chatshyld/core/constants/app_routes.dart';
import 'package:chatshyld/core/constants/app_scaffold.dart';

import 'package:chatshyld/core/services/country_picker_service.dart';
import 'package:chatshyld/core/widgets/app_button.dart';
import 'package:chatshyld/core/widgets/country_picker.dart';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  String _selectedCountryCode = '+61'; // Default country code
  String _selectedFlag = "🇦🇺";

  final _numberCtrl = TextEditingController();
  @override
  void initState() {
    getUserCountryDetails();
    super.initState();
  }

  void _getOTP() {
    final raw = _numberCtrl.text.trim();
    if (raw.isEmpty) {
      AppScaffoldMessenger.showScaffold(context, 'Enter phone number.');
      return;
    }
    final fullNumber = '$_selectedCountryCode$raw';
    print('Requesting OTP for: $fullNumber');
  }

  void getUserCountryDetails() async {
    final country = await CountryPickerService.detectUserCountry();
    if (country == null) return;

    setState(() {
      _selectedCountryCode = country['dial_code'] ?? "+61";
      _selectedFlag = country['flag'] ?? "🇦🇺";
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsetsGeometry.symmetric(
            vertical: 20,
            horizontal: 25,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'What\'s your\nPhone number?',

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
              Row(
                children: [
                  Expanded(
                    flex: 5,

                    child: GestureDetector(
                      behavior: HitTestBehavior.opaque,
                      onTap: () {
                        CountryPicker.show(context, (selectedCode, flag) {
                          setState(() {
                            _selectedFlag = flag;
                            _selectedCountryCode = selectedCode;
                          });
                        });
                      },
                      child: SizedBox(
                        height: 68,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Code',
                              style: TextStyle(
                                color: AppColors.textSecondary,
                                fontSize: 13,
                              ),
                            ),
                            const Spacer(),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.start,
                              crossAxisAlignment: CrossAxisAlignment.center,
                              children: [
                                Text(
                                  _selectedFlag,
                                  style: const TextStyle(fontSize: 25),
                                ),
                                const SizedBox(width: 6),
                                Text(
                                  _selectedCountryCode,
                                  style: const TextStyle(
                                    fontSize: 22,
                                    fontWeight: FontWeight.w600,
                                    color: AppColors.black,
                                  ),
                                ),
                                const Spacer(),
                                const Icon(
                                  Icons.keyboard_arrow_down,
                                  color: AppColors.textLightGrey,
                                  size: 32,
                                ),
                              ],
                            ),
                            const SizedBox(height: 6),
                            Container(height: 1, color: Colors.grey.shade300),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 20),
                  Expanded(
                    flex: 8,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Number',
                          style: TextStyle(
                            color: AppColors.textSecondary,
                            fontSize: 13,
                          ),
                        ),

                        TextField(
                          controller: _numberCtrl,
                          autofocus: true,
                          keyboardType: TextInputType.phone,
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
                              borderSide: BorderSide(
                                color: Colors.grey.shade300,
                              ),
                            ),
                            focusedBorder: UnderlineInputBorder(
                              borderSide: BorderSide(
                                color: Colors.grey.shade300,
                              ),
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
                  ),
                ],
              ),
              const SizedBox(height: 10),
              const Text(
                'ChatShyld will send you a SMS with a verification code.',
                style: TextStyle(color: AppColors.textLightGrey, fontSize: 11),
              ),
              const Spacer(),

              SizedBox(
                width: double.infinity,
                height: 50,
                child: AppButton(
                  label: 'Get OTP',
                  gradient: const LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [Color(0xFF05BDF8), Color(0xFF036F92)],
                  ),
                  onPressed: _getOTP,
                ),
              ),
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text(
                    'By signing up for ChatShyld, you agree to',
                    style: TextStyle(
                      color: AppColors.textLightGrey,
                      fontSize: 10,
                    ),
                  ),
                  const SizedBox(width: 4),
                  GestureDetector(
                    onTap: () {
                      context.push(
                        AppRoutes.webView,
                        extra: {
                          'title': 'Terms of Service',
                          'url': 'https://chatshyld.com/terms_of_service.html',
                        },
                      );
                    },
                    child: const Text(
                      'Terms of Service.',
                      style: TextStyle(
                        color: AppColors.black,
                        fontSize: 10,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text(
                    'Learn how we process your data in our',
                    style: TextStyle(
                      color: AppColors.textLightGrey,
                      fontSize: 10,
                    ),
                  ),
                  const SizedBox(width: 4),
                  GestureDetector(
                    onTap: () {
                      context.push(
                        AppRoutes.webView,
                        extra: {
                          'title': 'Privacy Policy',
                          'url': 'https://chatshyld.com/privacy_policy.html',
                        },
                      );
                    },
                    child: const Text(
                      'Privacy Policy.',
                      style: TextStyle(
                        color: AppColors.black,
                        fontSize: 10,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 5),
            ],
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _numberCtrl.dispose();
    super.dispose();
  }
}
