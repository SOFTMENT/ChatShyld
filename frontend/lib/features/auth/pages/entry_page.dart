import 'package:chatshyld/core/constants/app_colors.dart';
import 'package:chatshyld/core/constants/app_routes.dart';

import 'package:chatshyld/core/widgets/app_button.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class EntryPage extends StatelessWidget {
  const EntryPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF05C0FC), Color(0xFF037296)],
            stops: [0.0, 1.0],
          ),
        ),
        child: SafeArea(
          child: LayoutBuilder(
            builder: (context, c) {
              final h = c.maxHeight;
              return SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 25),
                child: ConstrainedBox(
                  constraints: BoxConstraints(minHeight: h),
                  child: IntrinsicHeight(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        const SizedBox(height: 20),
                        const Text(
                          'Welcome to ChatShyld',
                          style: TextStyle(
                            color: Colors.black,
                            fontSize: 20,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 32),
                        // cap the image height so it never forces overflow
                        SizedBox(
                          height: h * 0.35,
                          child: Image.asset(
                            'assets/images/entryheadimage.png',
                            fit: BoxFit.contain,
                          ),
                        ),
                        const Spacer(),
                        const Text(
                          'Chating,\nMade Simple',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 36,
                            fontWeight: FontWeight.bold,
                            color: Colors.black,
                          ),
                        ),
                        const SizedBox(height: 12),
                        const Text(
                          'Connect instantly with family and friends using AI-powered, end-to-end encrypted communication. Fast, secure, and effortless',
                          textAlign: TextAlign.center,
                          style: TextStyle(fontSize: 16, color: Colors.white),
                        ),
                        const SizedBox(height: 60),
                        SizedBox(
                          width: double.infinity,
                          height: 50,
                          child: AppButton(
                            label: 'Get started',
                            bgColor: AppColors.lightBlue,
                            labelColor: AppColors.black,
                            onPressed: () => context.go(AppRoutes.loginPage),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}
