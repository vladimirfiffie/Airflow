import 'package:flutter/material.dart';

/// Semantic color palette for Airflow, resolved per-brightness.
/// Mirrors the CSS custom properties in the web app's globals.css.
@immutable
class AppColors extends ThemeExtension<AppColors> {
  const AppColors({
    required this.background,
    required this.surface,
    required this.surface2,
    required this.foreground,
    required this.muted,
    required this.border,
    required this.borderStrong,
    required this.accent,
    required this.accentHover,
    required this.accentSoft,
  });

  final Color background;
  final Color surface;
  final Color surface2;
  final Color foreground;
  final Color muted;
  final Color border;
  final Color borderStrong;
  final Color accent;
  final Color accentHover;
  final Color accentSoft;

  static const light = AppColors(
    background: Color(0xFFFFFFFF),
    surface: Color(0xFFFAFAFA),
    surface2: Color(0xFFF4F4F5),
    foreground: Color(0xFF0A0A0A),
    muted: Color(0xFF6B7280),
    border: Color(0xFFE5E5E5),
    borderStrong: Color(0xFFD4D4D8),
    accent: Color(0xFFF97316),
    accentHover: Color(0xFFEA580C),
    accentSoft: Color(0x1AF97316),
  );

  static const dark = AppColors(
    background: Color(0xFF0A0A0A),
    surface: Color(0xFF111111),
    surface2: Color(0xFF171717),
    foreground: Color(0xFFFAFAFA),
    muted: Color(0xFFA1A1AA),
    border: Color(0xFF1F1F23),
    borderStrong: Color(0xFF2A2A2E),
    accent: Color(0xFFFB923C),
    accentHover: Color(0xFFF97316),
    accentSoft: Color(0x1FFB923C),
  );

  static AppColors of(BuildContext context) =>
      Theme.of(context).extension<AppColors>()!;

  @override
  AppColors copyWith({
    Color? background,
    Color? surface,
    Color? surface2,
    Color? foreground,
    Color? muted,
    Color? border,
    Color? borderStrong,
    Color? accent,
    Color? accentHover,
    Color? accentSoft,
  }) {
    return AppColors(
      background: background ?? this.background,
      surface: surface ?? this.surface,
      surface2: surface2 ?? this.surface2,
      foreground: foreground ?? this.foreground,
      muted: muted ?? this.muted,
      border: border ?? this.border,
      borderStrong: borderStrong ?? this.borderStrong,
      accent: accent ?? this.accent,
      accentHover: accentHover ?? this.accentHover,
      accentSoft: accentSoft ?? this.accentSoft,
    );
  }

  @override
  AppColors lerp(ThemeExtension<AppColors>? other, double t) {
    if (other is! AppColors) return this;
    return AppColors(
      background: Color.lerp(background, other.background, t)!,
      surface: Color.lerp(surface, other.surface, t)!,
      surface2: Color.lerp(surface2, other.surface2, t)!,
      foreground: Color.lerp(foreground, other.foreground, t)!,
      muted: Color.lerp(muted, other.muted, t)!,
      border: Color.lerp(border, other.border, t)!,
      borderStrong: Color.lerp(borderStrong, other.borderStrong, t)!,
      accent: Color.lerp(accent, other.accent, t)!,
      accentHover: Color.lerp(accentHover, other.accentHover, t)!,
      accentSoft: Color.lerp(accentSoft, other.accentSoft, t)!,
    );
  }
}

/// Monospace family used for flight codes, prices and numeric data.
const String kMono = 'monospace';

class AppTheme {
  static ThemeData _base(AppColors c, Brightness brightness) {
    final scheme = ColorScheme.fromSeed(
      seedColor: c.accent,
      brightness: brightness,
    ).copyWith(
      primary: c.accent,
      surface: c.background,
    );

    return ThemeData(
      useMaterial3: true,
      brightness: brightness,
      colorScheme: scheme,
      scaffoldBackgroundColor: c.background,
      canvasColor: c.background,
      splashFactory: InkRipple.splashFactory,
      extensions: [c],
      textTheme: Typography.material2021(platform: TargetPlatform.android)
          .black
          .apply(
            bodyColor: c.foreground,
            displayColor: c.foreground,
          )
          .copyWith(
            displayLarge: TextStyle(
              color: c.foreground,
              fontWeight: FontWeight.w900,
              letterSpacing: -2,
              height: 0.92,
            ),
          ),
      dividerColor: c.border,
      iconTheme: IconThemeData(color: c.foreground),
    );
  }

  static ThemeData get lightTheme =>
      _base(AppColors.light, Brightness.light);
  static ThemeData get darkTheme => _base(AppColors.dark, Brightness.dark);
}
