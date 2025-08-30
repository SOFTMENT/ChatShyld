import 'package:chatshyld/features/profile/data/services/profile_api_service.dart';
import 'package:flutter/material.dart';

import 'package:chatshyld/core/constants/app_colors.dart';
import 'package:chatshyld/routers/app_router.dart';
import 'package:chatshyld/core/auth/auth_state.dart';

// wire up your networking
import 'package:chatshyld/core/network/dio_client.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final client = DioClient(); // has dio + interceptor + storage + authRepo
  final auth = AuthState(
    client.authRepo,
    client.storage,
    ProfileApi(client.dio),
  );

  auth.bootstrap();

  final router = makeAppRouter(auth);

  runApp(ChangeNotifierProvider.value(value: auth, child: App(router)));
}

class App extends StatelessWidget {
  const App(this.router, {super.key});
  final GoRouter router;

  ThemeData get theme {
    final base = ThemeData.light().textTheme.apply(fontFamily: 'inter');
    return ThemeData.light().copyWith(
      textTheme: base.copyWith(
        bodyLarge: base.bodyLarge?.copyWith(fontSize: 14.0),
        bodyMedium: base.bodyMedium?.copyWith(fontSize: 14.0),
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
      routerConfig: router,
    );
  }
}
