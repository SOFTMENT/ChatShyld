import 'package:chatshyld/core/constants/app_routes.dart';
import 'package:chatshyld/core/widgets/webview_page.dart';
import 'package:chatshyld/features/auth/pages/entry_page.dart';
import 'package:chatshyld/features/auth/pages/login_page.dart';
import 'package:chatshyld/features/welcome/pages/welcome_page.dart';

import 'package:go_router/go_router.dart';

final GoRouter appRouter = GoRouter(
  routes: [
    GoRoute(
      path: AppRoutes.welcomePage,
      builder: (context, state) => const WelcomePage(),
    ),

    GoRoute(
      path: AppRoutes.entryPage,
      builder: (context, state) => const EntryPage(),
    ),

    GoRoute(
      path: AppRoutes.loginPage,
      builder: (context, state) => const LoginPage(),
    ),

    GoRoute(
      path: AppRoutes.webView,
      builder: (context, state) {
        final extra = state.extra as Map<String, String>;
        final title = extra['title'] ?? 'Web';
        final url = extra['url'] ?? '';

        return WebViewPage(title: title, url: url);
      },
    ),
  ],
);
