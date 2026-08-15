/// Release notes, as data.
///
/// The single source for what ships in a release: `tool/generate_release_notes.dart`
/// renders these into the GitHub release body, so the published notes can't
/// drift from what's in the repo. Add an entry here in the same commit that
/// bumps `version:` in pubspec.yaml.
class ReleaseNote {
  const ReleaseNote({
    required this.version,
    required this.headline,
    required this.changes,
  });

  /// Without the leading `v` and without the `+build` suffix — `1.0.0`.
  final String version;

  /// One line for the top of the release body.
  final String headline;

  /// Bullets, most user-visible first.
  final List<String> changes;

  /// Same rule the release workflow uses to decide the prerelease flag.
  bool get isPrerelease => version.contains('-');
}

/// Newest first.
const List<ReleaseNote> releaseNotes = [
  ReleaseNote(
    version: '1.0.0-beta.1',
    headline: 'First beta of the Airflow Android app — adaptive UI and '
        'native integrations.',
    changes: [
      'Five-tab navigation with per-tab history, so switching tabs never loses your place. Adapts to a side rail on tablets and unfolded foldables.',
      'Bookings are saved on the device and survive a restart, with an optional fingerprint or face unlock in front of them.',
      'Check-in and boarding reminders, scheduled in your device\'s real timezone and re-armed after a reboot.',
      'Share a booking or flight to any app, and add a flight to your calendar in one tap.',
      'Deep links: airflow:// and https://airflow.app links open straight to a flight, booking or search.',
      'Haptic feedback throughout — distinct responses for claiming a seat, hitting a sold-out one, crossing a booking step, and confirming payment.',
      'Payment is now a deliberate slide-to-confirm rather than a tap.',
      'Platform-correct dialogs, pickers, sheets, transitions and scroll physics throughout.',
      'Beta scope: Android only, and flight data is still the built-in sample set — nothing talks to a server yet.',
    ],
  ),
];

/// The note for [version], or null when none is recorded.
///
/// Accepts `v1.0.0`, `1.0.0` and `1.0.0+3` alike.
ReleaseNote? noteForVersion(String version) {
  final normalized = normalizeVersion(version);
  for (final note in releaseNotes) {
    if (note.version == normalized) return note;
  }
  return null;
}

/// Strips a leading `v` and any `+build` suffix.
String normalizeVersion(String version) {
  var result = version.trim();
  if (result.startsWith('v') || result.startsWith('V')) {
    result = result.substring(1);
  }
  final plus = result.indexOf('+');
  return plus == -1 ? result : result.substring(0, plus);
}
