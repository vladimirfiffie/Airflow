import 'package:flutter/services.dart';
import 'package:local_auth/local_auth.dart';
// Android-specific prompt strings live in the platform package.
import 'package:local_auth_android/local_auth_android.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Optional fingerprint / face unlock in front of saved bookings.
///
/// Off by default and entirely the user's choice — the data behind it is a
/// booking reference and passenger names, not something worth blocking access
/// to unless the user says their phone is shared.
class BiometricsService {
  BiometricsService._();

  static final BiometricsService instance = BiometricsService._();

  static const _prefKey = 'airflow.biometric_lock.enabled';

  final LocalAuthentication _auth = LocalAuthentication();

  /// Whether this device can do a biometric (or device-credential) check.
  Future<bool> isAvailable() async {
    try {
      final supported = await _auth.isDeviceSupported();
      if (!supported) return false;
      return await _auth.canCheckBiometrics;
    } on PlatformException {
      return false;
    }
  }

  /// Which sensors exist, for labelling the setting ("Use fingerprint" vs
  /// "Use face unlock").
  Future<List<BiometricType>> enrolledTypes() async {
    try {
      return await _auth.getAvailableBiometrics();
    } on PlatformException {
      return const [];
    }
  }

  Future<bool> isLockEnabled() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_prefKey) ?? false;
  }

  /// Turning the lock *on* requires passing a check first, so a user can't
  /// enable a gate they then can't get through.
  Future<bool> setLockEnabled(bool enabled) async {
    if (enabled) {
      final passed = await authenticate(
        reason: 'Confirm it\'s you to lock your bookings',
      );
      if (!passed) return false;
    }
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_prefKey, enabled);
    return true;
  }

  /// Prompts for biometrics, falling back to the device PIN/pattern.
  ///
  /// Returns false on any failure — cancelled, locked out, no hardware — so
  /// callers get a single "did they get in" answer.
  Future<bool> authenticate({required String reason}) async {
    try {
      return await _auth.authenticate(
        localizedReason: reason,
        // Device credential is allowed as a fallback: locking someone out of
        // their own booking because a sensor is dirty would be worse than the
        // marginal security a biometric-only gate buys here.
        biometricOnly: false,
        // Keeps the prompt alive if the user tabs away to accept a call.
        persistAcrossBackgrounding: true,
        authMessages: const [
          AndroidAuthMessages(
            signInTitle: 'Unlock your bookings',
            signInHint: 'Use your fingerprint, face or screen lock',
            cancelButton: 'Cancel',
          ),
        ],
      );
    } on PlatformException {
      return false;
    }
  }
}
