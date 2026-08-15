import 'package:flutter/material.dart';

import '../main.dart' show themeMode;
import '../platform/adaptive.dart';
import '../platform/haptics.dart';
import '../theme/app_theme.dart';
import 'app_shell.dart';

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

/// Standard page chrome.
///
/// Navigation itself lives in [AppShell] — this only supplies the bar, the
/// scroll container and the platform-correct scroll physics. Screens pushed on
/// top of a tab get an automatic back affordance from the enclosing navigator.
class AppScaffold extends StatelessWidget {
  const AppScaffold({
    super.key,
    required this.body,
    this.title,
    this.scrollable = true,
    this.padded = true,
    this.actions = const [],
    this.onRefresh,
  });

  final Widget body;

  /// Shown instead of the wordmark — used by pushed screens.
  final String? title;

  final bool scrollable;
  final bool padded;
  final List<Widget> actions;

  /// When set, the body becomes pull-to-refreshable.
  final Future<void> Function()? onRefresh;

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    final shell = AppShellScope.maybeOf(context);

    final content = padded
        ? Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
            child: body,
          )
        : body;

    Widget child = scrollable
        ? SingleChildScrollView(
            physics: Adaptive.scrollPhysics(context),
            child: content,
          )
        : content;

    if (onRefresh != null) {
      child = Adaptive.refreshable(
        onRefresh: onRefresh!,
        color: c.accent,
        child: scrollable
            ? child
            // RefreshIndicator needs a scrollable to attach to.
            : SingleChildScrollView(
                physics: Adaptive.scrollPhysics(context),
                child: content,
              ),
      );
    }

    return Scaffold(
      backgroundColor: c.background,
      appBar: AppBar(
        backgroundColor: c.background,
        surfaceTintColor: Colors.transparent,
        elevation: 0,
        scrolledUnderElevation: 0,
        shape: Border(bottom: BorderSide(color: c.border)),
        centerTitle: isCupertino(context),
        title: title == null
            ? const AirflowLogo()
            : Text(
                title!,
                style: const TextStyle(
                  fontWeight: FontWeight.w900,
                  letterSpacing: -0.3,
                ),
              ),
        actions: [
          ...actions,
          const _ThemeToggleButton(),
          if (shell != null)
            IconButton(
              tooltip: 'Help',
              icon: const Icon(Icons.help_outline, size: 20),
              onPressed: () {
                AppHaptics.light();
                shell.openHelp();
              },
            ),
          const SizedBox(width: 4),
        ],
      ),
      body: SafeArea(child: child),
    );
  }
}

class _ThemeToggleButton extends StatelessWidget {
  const _ThemeToggleButton();

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<ThemeMode>(
      valueListenable: themeMode,
      builder: (context, mode, _) {
        final isDark = Theme.of(context).brightness == Brightness.dark;
        return IconButton(
          tooltip: isDark ? 'Switch to light' : 'Switch to dark',
          icon: Icon(isDark ? Icons.light_mode : Icons.dark_mode, size: 20),
          onPressed: () {
            AppHaptics.selection();
            themeMode.value = isDark ? ThemeMode.light : ThemeMode.dark;
          },
        );
      },
    );
  }
}
