import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:haptic_kit/haptic_kit.dart' as kit;

/// Semantic haptic vocabulary for the app.
///
/// Callers say what happened, not which vibration to fire — that keeps the
/// feedback consistent across screens and leaves one place to retune it.
///
/// Backed by `haptic_kit`, which reaches the platform APIs Flutter's built-in
/// [HapticFeedback] cannot: real notification haptics (success / warning /
/// error) and amplitude-controlled waveforms. Named [AppHaptics] because
/// `haptic_kit` exports its own `Haptics`, which this wraps.
///
/// Every call is fire-and-forget. On a device with no actuator — or with
/// system haptics switched off — the platform ignores it, and any plugin-side
/// failure is swallowed rather than surfaced: a missing buzz is never worth
/// interrupting a booking over.
class AppHaptics {
  const AppHaptics._();

  /// Only Android and iOS have a haptics engine worth calling.
  static bool get _supported =>
      !kIsWeb &&
      (defaultTargetPlatform == TargetPlatform.android ||
          defaultTargetPlatform == TargetPlatform.iOS);

  static Future<void> _run(Future<void> Function() fn) async {
    if (!_supported) return;
    try {
      await fn();
    } on kit.VibrationException {
      // Device can't render this effect — nothing to recover from.
    } on PlatformException {
      // Plugin/channel failure. Same story.
    } on MissingPluginException {
      // Hot-restart or a platform without the plugin registered.
    }
  }

  /// Pre-warm the haptic engine so the first tap isn't late. No-op on Android.
  static Future<void> prepare() => _run(() => kit.Haptics.prepare());

  /// Moving through a set of choices — picking a seat, changing a tab.
  static Future<void> selection() => _run(kit.Haptics.selection);

  /// A light touch confirmation — a button that did something small.
  static Future<void> light() =>
      _run(() => kit.Haptics.impact(kit.HapticImpactStyle.light));

  /// A crisp, precise tap. Used when a seat is claimed.
  static Future<void> rigid() =>
      _run(() => kit.Haptics.impact(kit.HapticImpactStyle.rigid));

  /// Crossing a step boundary in a flow.
  static Future<void> step() =>
      _run(() => kit.Haptics.impact(kit.HapticImpactStyle.medium));

  /// A booking landed, a payment cleared.
  static Future<void> success() =>
      _run(() => kit.Haptics.notification(kit.HapticNotificationStyle.success));

  /// Something was rejected — a seat already taken, a form that won't submit.
  static Future<void> warning() =>
      _run(() => kit.Haptics.notification(kit.HapticNotificationStyle.warning));

  /// A hard failure — payment declined.
  static Future<void> error() =>
      _run(() => kit.Haptics.notification(kit.HapticNotificationStyle.error));

  /// What this device can actually render. Queried once and cached so screens
  /// can degrade gracefully (e.g. skip a waveform-based flourish).
  ///
  /// Falls back to "no hardware" rather than throwing, so a caller can treat
  /// the result as fact without wrapping it.
  static Future<kit.HapticCapabilities> capabilities() async {
    if (_capabilities != null) return _capabilities!;
    if (_supported) {
      try {
        return _capabilities = await kit.HapticCapabilities.query();
      } on kit.VibrationException {
        // Fall through to the inert default.
      } on PlatformException {
        // Ditto.
      } on MissingPluginException {
        // Ditto.
      }
    }
    return _capabilities = const kit.HapticCapabilities(
      hasVibrator: false,
      hasAmplitudeControl: false,
      supportsCustomPatterns: false,
      supportsPredefinedEffects: false,
      supportsImpactFeedback: false,
    );
  }

  static kit.HapticCapabilities? _capabilities;
}
