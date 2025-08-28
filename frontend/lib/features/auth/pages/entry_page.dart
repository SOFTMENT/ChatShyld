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
            colors: [
              Color(0xFF05C0FC), // 0% stop
              Color(0xFF037296), // 100% stop
            ],
            stops: [0.0, 1.0],
          ),
        ),
        child: SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.max,

            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 20),
              const Text(
                'Welcome to ChatShyld',
                style: TextStyle(
                  color: AppColors.black,
                  fontSize: 20,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 32),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 50),
                child: Image.asset(
                  'assets/images/entryheadimage.png',
                  fit: BoxFit.cover,
                ),
              ),
              const Spacer(),
              const Text(
                'Chating,\nMade Simple',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 36,
                  fontWeight: FontWeight.bold,
                  color: AppColors.black,
                ),
              ),

              const SizedBox(height: 12),
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 25),
                child: Text(
                  'Connect instantly with family and friends using AI-powered, end-to-end encrypted communication. Fast, secure, and effortless',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 16, color: AppColors.white),
                ),
              ),
              const SizedBox(height: 60),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 25),
                child: SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: AppButton(
                    label: 'Get started',
                    bgColor: AppColors.lightBlue,
                    labelColor: AppColors.black,
                    onPressed: () {
                      context.go(AppRoutes.loginPage);
                    },
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
