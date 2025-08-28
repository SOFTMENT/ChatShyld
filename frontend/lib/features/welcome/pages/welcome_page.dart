import 'package:chatshyld/core/constants/app_routes.dart';
import 'package:chatshyld/core/constants/app_text_styles.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class WelcomePage extends StatefulWidget {
  const WelcomePage({super.key});

  @override
  State<WelcomePage> createState() => _WelcomePageState();
}

class _WelcomePageState extends State<WelcomePage> {
  @override
  void initState() {
    super.initState();
    _goToHomeAfterDelay();
  }

  Future<void> _goToHomeAfterDelay() async {
    await Future.delayed(const Duration(microseconds: 1500));
    if (!mounted) return;
    context.go(AppRoutes.entryPage);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 60),
              child: SizedBox(
                height: 260,
                child: Image.asset('assets/images/wordlogo.png'),
              ),
            ),
            const SizedBox(height: 20),
            const Text('Secure, Private', style: AppTextStyles.subheading),
            const SizedBox(height: 6),

            const Text(
              'End-to-End Encrypted Messaging',
              style: AppTextStyles.subheading,
            ),
          ],
        ),
      ),
    );
  }
}
