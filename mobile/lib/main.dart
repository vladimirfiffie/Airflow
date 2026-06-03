import 'package:flutter/material.dart';
import 'theme/app_theme.dart';
import 'screens/home_screen.dart';
import 'screens/search_screen.dart';
import 'screens/flights_screen.dart';
import 'screens/schedule_screen.dart';
import 'screens/help_screen.dart';

/// Global theme mode, toggled from the app bar.
final ValueNotifier<ThemeMode> themeMode =
    ValueNotifier<ThemeMode>(ThemeMode.system);

void main() => runApp(const AirflowApp());

class AirflowApp extends StatelessWidget {
  const AirflowApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<ThemeMode>(
      valueListenable: themeMode,
      builder: (context, mode, _) {
        return MaterialApp(
          title: 'Airflow',
          debugShowCheckedModeBanner: false,
          theme: AppTheme.lightTheme,
          darkTheme: AppTheme.darkTheme,
          themeMode: mode,
          initialRoute: '/',
          routes: {
            '/': (_) => const HomeScreen(),
            '/search': (_) => const SearchScreen(),
            '/flights': (_) => const FlightsScreen(),
            '/schedule': (_) => const ScheduleScreen(),
            '/help': (_) => const HelpScreen(),
          },
        );
      },
    );
  }
}
