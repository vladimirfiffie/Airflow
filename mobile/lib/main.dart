import 'package:flutter/material.dart';

import 'services/bookings_repository.dart';
import 'services/notifications_service.dart';
import 'theme/app_theme.dart';
import 'widgets/app_shell.dart';

/// Global theme mode, toggled from the app bar.
final ValueNotifier<ThemeMode> themeMode =
    ValueNotifier<ThemeMode>(ThemeMode.system);

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Both are needed before the first frame can be truthful: the notification
  // plugin has to be initialised to report what launched the app, and the
  // Bookings tab should render its real contents rather than flashing an
  // empty state first.
  await Future.wait([
    NotificationsService.instance.init(),
    BookingsRepository.instance.load(),
  ]);

  runApp(const AirflowApp());
}

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
          home: const AppShell(),
        );
      },
    );
  }
}
