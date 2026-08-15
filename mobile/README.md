# Airflow — mobile

A Flutter port of the Airflow flight-booking app. **Android is the active target**; the code is written platform-adaptively so iOS is a configuration job rather than a rewrite (see [iOS status](#ios-status)).

For the project overview, see the [root README](../README.md).

## Running it

```bash
flutter pub get
flutter run
```

Requires the Flutter SDK with Dart `^3.12.0`, and an Android SDK for device builds. `flutter analyze --fatal-infos` and `flutter test` both pass clean.

Flights, seat maps and live stats come from in-app data in `lib/data/` — there's no backend and no API keys. Bookings you make are stored on the device.

## Design approach: one look, platform behaviour

The brutalist identity — orange accent, hard borders, offset shadows, the `Display`/`Mono` type — is identical on every platform. What adapts is how the app *behaves*, which is the part users read as native:

| | Android | iOS |
| --- | --- | --- |
| Page transitions | Material + predictive back | Cupertino + edge swipe-back |
| Scroll overscroll | Stretch | Rubber-band |
| Date entry | Calendar dialog | Wheel picker in a popup |
| Choice lists | Bottom sheet | Action sheet |
| Alerts | `AlertDialog` | `CupertinoAlertDialog` |
| Transient messages | Snack bar | Top banner |
| Bottom navigation | M3 `NavigationBar` | `CupertinoTabBar` |

All of it routes through `lib/platform/adaptive.dart`, so screens call `Adaptive.confirm(...)` / `Adaptive.pickDate(...)` and never branch on platform themselves. `isCupertino()` reads the ambient `Theme`, not `Platform.isIOS`, so tests and `debugDefaultTargetPlatformOverride` can flip it.

## Navigation

Five persistent tabs — Home, Search, Flights, Schedule, Bookings — each owning its own `Navigator`, so drilling into a flight from Search and switching tabs doesn't reset where you were. Help opens over the current tab from the app bar rather than taking a tab slot. At ≥720dp (tablets, unfolded foldables, landscape phones) the bottom bar is replaced by a `NavigationRail`.

Back unwinds the current tab's stack, then falls back to Home, and only then leaves the app. Re-tapping the active tab pops it to its root.

## Native capabilities

All via pub.dev plugins — no hand-written platform channels.

| Feature | Plugin | Notes |
| --- | --- | --- |
| Haptics | `haptic_kit` | Semantic wrapper in `lib/platform/haptics.dart` (`AppHaptics`). Real notification haptics and waveforms, which Flutter's built-in `HapticFeedback` can't do. Seat taps, step boundaries, rejected actions and the payment confirm all have distinct feedback. |
| Share sheet | `share_plus` | Share a booking or a flight; the payload carries an `https://airflow.app` link that the web app also serves. |
| Persistence | `shared_preferences` | Confirmed bookings survive restarts. Corrupt records are skipped individually rather than dropping the whole list. |
| Biometric lock | `local_auth` | Opt-in gate on the Bookings tab. Falls back to device PIN — a dirty sensor shouldn't lock you out of your own booking. Enabling it requires passing a check first. |
| Reminders | `flutter_local_notifications` + `flutter_timezone` | Check-in (24h) and boarding (45m) notifications, scheduled in the device's real timezone. Inexact scheduling, deliberately — that avoids `SCHEDULE_EXACT_ALARM`, which Android only grants alarm-grade apps. |
| Calendar | `add_2_calendar` | Opens the user's calendar app with the flight pre-filled; no calendar permission needed. |
| Deep links | `app_links` | `airflow://flight/AF1001`, `airflow://booking/AB12CD`, `airflow://search?q=JFK`, plus `https://airflow.app/...` App Links. |

Payment card details are never stored — only the reference, flight snapshot, passenger names and seats.

## Structure

```
lib/
├── main.dart       Entry; initialises notifications + booking store pre-first-frame
├── platform/
│   ├── adaptive.dart   Platform-correct dialogs, sheets, pickers, routes, physics
│   └── haptics.dart    AppHaptics — the semantic haptic vocabulary
├── services/
│   ├── bookings_repository.dart   On-device booking store (ChangeNotifier)
│   ├── notifications_service.dart Boarding/check-in reminders
│   ├── biometrics_service.dart    Optional unlock gate
│   ├── share_service.dart         Share sheet payloads
│   ├── calendar_service.dart      Add-to-calendar intent
│   └── deep_links.dart            URI → AppDestination parsing
├── data/           Mock flights, seat map, simulated stats, flight-time resolution
├── models/         Flight, Passenger, Seat, Stats, SavedBooking
├── screens/
│   ├── bookings_screen.dart  Saved trips, lock toggle, per-booking actions
│   └── booking/    Passengers → seats → payment → confirmation
├── state/          BookingController
├── theme/          AppTheme + AppColors theme extension
└── widgets/
    ├── app_shell.dart     Tabs, per-tab navigators, rail, deep-link routing
    ├── app_scaffold.dart  Page chrome
    ├── brutal.dart        Brand primitives
    └── live_stats.dart
```

## Android configuration

Changes that live outside Dart and are easy to lose in a regen:

- **`MainActivity.kt` extends `FlutterFragmentActivity`** — `local_auth`'s BiometricPrompt needs a `FragmentActivity` host; with plain `FlutterActivity` the unlock prompt throws at runtime.
- **Core library desugaring** enabled in `app/build.gradle.kts`, required by `flutter_local_notifications` v10+. `minSdk` is pinned to at least 24 for the same reason.
- **Manifest**: deep-link intent filters, `RECEIVE_BOOT_COMPLETED` plus the two `flutter_local_notifications` receivers (so reminders survive a reboot), and a `<queries>` entry for the calendar insert intent — without it Android 11+ reports no calendar handler and the action fails silently.
- **Adaptive launcher icon** as vector XML (`mipmap-anydpi-v26/ic_launcher.xml`), including a `monochrome` layer for themed icons. No bitmap assets needed.
- **Launch screen** uses `?android:colorBackground` so it follows the system light/dark setting.

App Links (`https://airflow.app/...`) are declared with `autoVerify`, but they only bypass the browser once `https://airflow.app/.well-known/assetlinks.json` is published with the release signing certificate's fingerprint. Until then, use the `airflow://` scheme, which always resolves here.

## Testing

```bash
flutter test
```

Covers the logic that's wrong-able without a device: deep-link URI parsing (custom-scheme URIs put the first segment in the *host*, not the path), departure/arrival resolution including the past-time roll-forward and after-midnight arrival, and `SavedBooking` JSON round-tripping plus notification-id stability.

## Releases

`.github/workflows/release.yml` builds and publishes Android APKs. Three ways in, all ending in the same place:

1. **Bump `version:` in `pubspec.yaml` and push to main.** If no release exists for that version, one is published. No tag push needed, so it works without git credentials.
2. **Push a tag** — `git tag v1.0.0 && git push origin v1.0.0`.
3. **Run it manually** from the Actions tab with a `tag` input.

A hyphen marks a prerelease: `v1.0.0-beta.1` yes, `v1.0.0` no. A push to main that doesn't change the version costs about ten seconds — the `decide` job checks first, so no Gradle build runs.

Each release ships four APKs: `arm64-v8a`, `armeabi-v7a` and `x86_64` split builds, plus a universal one for anyone who doesn't know their device's ABI.

### Release notes

Add an entry to [`lib/release_notes.dart`](lib/release_notes.dart) in the same commit that bumps the version. `tool/generate_release_notes.dart` renders it into the release body, so the published notes can't drift from the repo:

```bash
dart run tool/generate_release_notes.dart v1.0.0
```

A version with no entry warns and falls back to GitHub's auto-generated commit list rather than discarding a finished build — change the `stderr.writeln` in the generator to `exit(1)` if you'd rather no release ship without written notes.

### Signing

Release builds are currently signed with the **Android debug key** (`buildTypes.release` in `app/build.gradle.kts` still points at `signingConfigs.debug`). That makes them installable test artifacts, not Play Store uploads — users need "install from unknown sources", and the key changes if the build host does, so an install can't be upgraded in place. Add a real keystore and a `signingConfigs.release` before shipping to anyone.

## iOS status

Not wired up yet. The Dart side already branches for it — Cupertino routes, action sheets, wheel pickers, tab bar, banners. What's outstanding is iOS-side configuration only: `Info.plist` entries (`NSFaceIDUsageDescription`, `CFBundleURLTypes` for the `airflow` scheme), an associated-domains entitlement for universal links, `DarwinInitializationSettings` for notifications, and an app icon set.

## Parity with the web app

- `theme/app_theme.dart` mirrors the CSS custom properties in the web app's `globals.css` via an `AppColors` theme extension, resolved per brightness.
- `widgets/brutal.dart` ports the web app's typographic primitives — `Eyebrow` is `.eyebrow`, `Display` is `.display`.
- `data/seat_map.dart` uses the same flight-id hash as the web mock seat map, so a given flight shows the same taken seats in both. Layout matches too: rows 1–3 first class, 12–13 exit rows, 30 rows, `$150`/`$25`/`$0` surcharges.
- `data/stats_service.dart` reuses the web app's deterministic `jitter()`.
