import 'dart:async';

import 'package:chatshyld/core/auth/auth_state.dart';
import 'package:chatshyld/core/constants/app_colors.dart';

import 'package:chatshyld/core/constants/app_scaffold.dart';
import 'package:chatshyld/core/network/api_error.dart';
import 'package:chatshyld/core/network/dio_client.dart';
import 'package:chatshyld/core/services/country_picker_service.dart';

import 'package:chatshyld/core/widgets/app_button.dart';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:material_symbols_icons/symbols.dart';

import 'package:pinput/pinput.dart';
import 'package:provider/provider.dart';

class VerifyOtpPage extends StatefulWidget {
  final String fullPhoneNumber;
  const VerifyOtpPage({super.key, required this.fullPhoneNumber});

  @override
  State<VerifyOtpPage> createState() => _VerifyOtpState();
}

class _VerifyOtpState extends State<VerifyOtpPage> {
  final _pinCtrl = TextEditingController();
  final _focus = FocusNode();
  bool _isResending = false;
  var _isLoading = false;

  Timer? _timer;
  int _secondsLeft = 60;

  @override
  void initState() {
    super.initState();
    _startTimer();

    WidgetsBinding.instance.addPostFrameCallback((_) => _focus.requestFocus());
  }

  void _startTimer() {
    _timer?.cancel();
    setState(() => _secondsLeft = 60);
    _timer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (!mounted) {
        t.cancel();
        return;
      }
      if (_secondsLeft <= 1) {
        t.cancel();
        setState(() => _secondsLeft = 0);
      } else {
        setState(() => _secondsLeft--);
      }
    });
  }

  String _fmt(int s) {
    final m = (s ~/ 60).toString().padLeft(2, '0');
    final ss = (s % 60).toString().padLeft(2, '0');
    return '$m:$ss';
  }

  Future<void> _verify(String code) async {
    if (code.length != 6 || _isLoading) return;
    setState(() => _isLoading = true);

    final repo = DioClient().authRepo;
    try {
      final iso = await CountryPickerService.detectUserCountryCode();

      final res = await repo.verifyOtp(
        iso ?? 'AU',
        widget.fullPhoneNumber,
        code,
      );
      if (!mounted) return;
      res.when(
        ok: (data) async {
          await context.read<AuthState>().bootstrap();
        },
        err: (ApiError e) {
          final msg = switch (e.code) {
            'verification_failed' => 'Invalid code. Try again.',
            'invalid_input' => 'Please enter the 6-digit code.',
            _ => e.message ?? 'Verification failed (${e.status}).',
          };
          AppScaffoldMessenger.showScaffold(context, msg);
        },
      );
    } catch (e) {
      if (!mounted) return;
      AppScaffoldMessenger.showScaffold(context, 'Something went wrong.');
    }
  }

  Future<void> _resend() async {
    if (_isResending) return;
    setState(() => _isResending = true);
    final repo = DioClient().authRepo;
    try {
      final r = await repo.sendOtp(widget.fullPhoneNumber);
      if (!mounted) return;
      r.when(
        ok: (_) {
          AppScaffoldMessenger.showScaffold(context, 'Code sent again.');
          _startTimer();
        },

        err: (e) => AppScaffoldMessenger.showScaffold(
          context,
          e.code == 'rate_limited'
              ? 'Too many attempts. Try later.'
              : 'Failed to resend.',
        ),
      );
    } finally {
      if (mounted) setState(() => _isResending = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final defaultTheme = PinTheme(
      width: 48,
      height: 56,
      textStyle: const TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: Colors.black12),
      ),
    );

    final focusedTheme = defaultTheme.copyDecorationWith(
      border: Border.all(color: const Color(0XFfFC8E8A), width: 2),
    );

    final errorTheme = defaultTheme.copyDecorationWith(
      border: Border.all(color: Colors.redAccent, width: 2),
    );

    return Scaffold(
      body: SafeArea(
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
                'Verify your phone\nnumber',

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
              const SizedBox(height: 12),
              const Text(
                'Enter the 6-digit code sent to you at',

                style: TextStyle(color: AppColors.textLightGrey, fontSize: 14),
              ),
              const SizedBox(height: 3),
              Row(
                children: [
                  Text(
                    widget.fullPhoneNumber,

                    style: const TextStyle(color: Colors.black87, fontSize: 14),
                  ),
                  const SizedBox(width: 4),
                  GestureDetector(
                    onTap: context.pop,
                    child: const Icon(Symbols.edit_square, size: 16),
                  ),
                ],
              ),

              const SizedBox(height: 24),
              Expanded(
                child: Pinput(
                  controller: _pinCtrl,
                  focusNode: _focus,
                  length: 6,
                  autofocus: true,
                  enabled: !_isLoading,
                  defaultPinTheme: defaultTheme,
                  focusedPinTheme: focusedTheme,
                  errorPinTheme: errorTheme,
                  keyboardType: TextInputType.number,
                  inputFormatters: [FilteringTextInputFormatter.digitsOnly],

                  autofillHints: const [AutofillHints.oneTimeCode],
                  onCompleted: _verify, // auto verify when 6 digits entered
                ),
              ),
              const Spacer(),

              SizedBox(
                width: double.infinity,
                height: 50,
                child: AppButton(
                  label: 'Verify',
                  isLoading: _isLoading,
                  gradient: const LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [Color(0xFF05BDF8), Color(0xFF036F92)],
                  ),
                  onPressed: () {
                    _verify(_pinCtrl.text);
                  },
                ),
              ),

              const SizedBox(height: 12),

              Center(
                child: _secondsLeft > 0
                    ? Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Text(
                            'Resend Code : ',
                            style: TextStyle(color: Colors.black54),
                          ),

                          Text(
                            _fmt(_secondsLeft),
                            style: const TextStyle(
                              color: Colors.black,
                              fontWeight: FontWeight.bold,
                              fontSize: 13,
                            ),
                          ),
                        ],
                      )
                    : GestureDetector(
                        onTap: _isResending
                            ? null
                            : () {
                                _resend();
                              },
                        child: Text(
                          _isResending ? 'Resending...' : 'Resend code',
                          style: const TextStyle(
                            color: AppColors.primaryDark,
                            fontSize: 13,
                          ),
                        ),
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _timer?.cancel();
    _focus.dispose();
    _pinCtrl.dispose();
    super.dispose();
  }
}
