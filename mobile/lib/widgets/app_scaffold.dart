import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../main.dart' show themeMode;

class _NavItem {
  const _NavItem(this.label, this.route, this.icon);
  final String label;
  final String route;
  final IconData icon;
}

const _navItems = [
  _NavItem('Home', '/', Icons.home_outlined),
  _NavItem('Search', '/search', Icons.search),
  _NavItem('Flights', '/flights', Icons.flight_outlined),
  _NavItem('Schedule', '/schedule', Icons.calendar_today_outlined),
  _NavItem('Help', '/help', Icons.help_outline),
];

/// Brand wordmark used in the app bar and footer.
class AirflowLogo extends StatelessWidget {
  const AirflowLogo({super.key, this.size = 20});
  final double size;
  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(Icons.flight_takeoff_rounded, color: c.accent, size: size + 2),
        const SizedBox(width: 8),
        Text.rich(
          TextSpan(
            style: TextStyle(
              fontSize: size,
              fontWeight: FontWeight.w900,
              letterSpacing: -0.5,
              color: c.foreground,
            ),
            children: [
              const TextSpan(text: 'Airflow'),
              TextSpan(text: '.', style: TextStyle(color: c.accent)),
            ],
          ),
        ),
      ],
    );
  }
}

/// Standard page chrome: app bar with brand + theme toggle and a nav drawer.
class AppScaffold extends StatelessWidget {
  const AppScaffold({
    super.key,
    required this.body,
    this.currentRoute,
    this.scrollable = true,
    this.padded = true,
  });

  final Widget body;
  final String? currentRoute;
  final bool scrollable;
  final bool padded;

  void _go(BuildContext context, String route) {
    Navigator.pop(context); // close drawer
    if (route == currentRoute) return;
    if (route == '/') {
      Navigator.popUntil(context, (r) => r.isFirst);
    } else {
      Navigator.pushNamed(context, route);
    }
  }

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    final content = padded
        ? Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
            child: body,
          )
        : body;

    return Scaffold(
      backgroundColor: c.background,
      appBar: AppBar(
        backgroundColor: c.background,
        surfaceTintColor: Colors.transparent,
        elevation: 0,
        scrolledUnderElevation: 0,
        shape: Border(bottom: BorderSide(color: c.border)),
        title: const AirflowLogo(),
        actions: [
          ValueListenableBuilder<ThemeMode>(
            valueListenable: themeMode,
            builder: (_, mode, _) {
              final isDark = Theme.of(context).brightness == Brightness.dark;
              return IconButton(
                tooltip: 'Toggle theme',
                icon: Icon(isDark ? Icons.light_mode : Icons.dark_mode,
                    size: 20),
                onPressed: () => themeMode.value =
                    isDark ? ThemeMode.light : ThemeMode.dark,
              );
            },
          ),
          const SizedBox(width: 4),
        ],
      ),
      drawer: Drawer(
        backgroundColor: c.background,
        shape: Border(right: BorderSide(color: c.border)),
        child: SafeArea(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Padding(
                padding: EdgeInsets.fromLTRB(20, 20, 20, 12),
                child: AirflowLogo(size: 22),
              ),
              Divider(color: c.border, height: 1),
              const SizedBox(height: 8),
              for (final item in _navItems)
                ListTile(
                  leading: Icon(item.icon,
                      color: item.route == currentRoute
                          ? c.accent
                          : c.muted),
                  title: Text(
                    item.label,
                    style: TextStyle(
                      fontWeight: FontWeight.w800,
                      color: item.route == currentRoute
                          ? c.accent
                          : c.foreground,
                    ),
                  ),
                  onTap: () => _go(context, item.route),
                ),
              const Spacer(),
              Padding(
                padding: const EdgeInsets.all(20),
                child: Text(
                  '© 2026 Airflow — Fly. Smarter.',
                  style: TextStyle(fontSize: 12, color: c.muted),
                ),
              ),
            ],
          ),
        ),
      ),
      body: scrollable
          ? SafeArea(child: SingleChildScrollView(child: content))
          : SafeArea(child: content),
    );
  }
}
