import 'package:chatshyld/features/navigation/pages/navigation_page.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter/widgets.dart';

import 'package:chatshyld/core/constants/app_routes.dart';
import 'package:chatshyld/core/auth/auth_state.dart';

import 'package:chatshyld/core/widgets/webview_page.dart';
import 'package:chatshyld/features/auth/pages/entry_page.dart';
import 'package:chatshyld/features/auth/pages/login_page.dart';
import 'package:chatshyld/features/auth/pages/verify_otp_page.dart';
import 'package:chatshyld/features/profile/pages/setup_profile_page.dart';
import 'package:chatshyld/features/welcome/pages/welcome_page.dart';

// ⬇️ turn the global router into a function that uses AuthState
GoRouter makeAppRouter(AuthState auth) {
  return GoRouter(
    initialLocation: AppRoutes.welcomePage,
    refreshListenable: auth, // <- rebuild redirects when auth/me changes
    redirect: (context, state) {
      // while bootstrapping, allow Welcome to show
      if (auth.status == AuthStatus.unknown) {
        return state.matchedLocation == AppRoutes.welcomePage
            ? null
            : AppRoutes.welcomePage;
      }

      final authed = auth.status == AuthStatus.authed;
      final needsProfile = auth.needsProfile;

      final onWelcome = state.matchedLocation == AppRoutes.welcomePage;
      final onEntry = state.matchedLocation == AppRoutes.entryPage;
      final onLogin = state.matchedLocation == AppRoutes.loginPage;
      final onVerify = state.matchedLocation == AppRoutes.verifyOtpPage;
      final onSetup = state.matchedLocation == AppRoutes.setupProfilePage;

      // Not logged in → allow only welcome/entry/login/verify
      if (!authed) {
        if (onWelcome || onEntry || onLogin || onVerify) return null;
        return AppRoutes.entryPage;
      }

      // Logged in but profile incomplete → force to setup
      if (needsProfile) {
        return onSetup ? null : AppRoutes.setupProfilePage;
      }

      // Logged in & complete → block auth screens
      if (onWelcome || onEntry || onLogin || onVerify || onSetup) {
        return AppRoutes.navigationBar;
      }

      return null;
    },
    routes: [
      GoRoute(
        path: AppRoutes.welcomePage,
        builder: (c, s) => const WelcomePage(),
      ),
      GoRoute(path: AppRoutes.entryPage, builder: (c, s) => const EntryPage()),
      GoRoute(path: AppRoutes.loginPage, builder: (c, s) => const LoginPage()),
      GoRoute(
        path: AppRoutes.verifyOtpPage,
        builder: (context, state) {
          final extra = state.extra as Map<String, String>?;
          final phone = extra?['phone'] ?? "phone_number";
          return VerifyOtpPage(fullPhoneNumber: phone);
        },
      ),
      GoRoute(
        path: AppRoutes.setupProfilePage,
        builder: (c, s) => const SetupProfilePage(),
      ),
      GoRoute(
        path: AppRoutes.navigationBar,
        builder: (c, s) => const NavigationPage(),
      ),
      GoRoute(
        path: AppRoutes.webView,
        builder: (c, s) {
          final extra = s.extra as Map<String, String>?;
          return WebViewPage(
            title: extra?['title'] ?? 'Web',
            url: extra?['url'] ?? '',
          );
        },
      ),
    ],
  );
}
