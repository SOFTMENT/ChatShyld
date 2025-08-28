import 'package:chatshyld/core/constants/app_colors.dart';
import 'package:chatshyld/routers/app_router.dart';
import 'package:flutter/material.dart';

final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  runApp(const App());
}

class App extends StatelessWidget {
  const App({super.key});

  ThemeData get theme {
    // Create a base text theme with your desired font family.
    final baseTextTheme = ThemeData.light().textTheme.apply(
      fontFamily: 'Poppins',
    );
    // Override the subtitle1 style to have a fontSize of 14.
    return ThemeData.light().copyWith(
      textTheme: baseTextTheme.copyWith(
        bodyLarge: baseTextTheme.bodyLarge?.copyWith(fontSize: 14.0),
        bodyMedium: baseTextTheme.bodyMedium?.copyWith(fontSize: 14.0),
      ),

      colorScheme: ColorScheme.fromSeed(seedColor: Colors.white),
      scaffoldBackgroundColor: AppColors.background,
    );
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      debugShowCheckedModeBanner: false,
      title: "ChatShyld",
      theme: theme,
      routerConfig: appRouter,
    );
  }
}
