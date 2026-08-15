import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../models/saved_booking.dart';

/// On-device store for confirmed bookings.
///
/// Before this, a booking existed only in the [BookingController] that created
/// it and died with the route. Bookings now outlive the process, which is what
/// makes the Bookings tab, boarding reminders and deep links worth having.
///
/// Backed by `shared_preferences` (Android: SharedPreferences). The payload is
/// a booking reference and passenger names — not card data, which is never
/// stored — so plain app-private storage is the right level here; the optional
/// biometric gate in [BiometricsService] guards *viewing* it on a shared phone.
class BookingsRepository extends ChangeNotifier {
  BookingsRepository._();

  static final BookingsRepository instance = BookingsRepository._();

  static const _key = 'airflow.bookings.v1';

  List<SavedBooking> _bookings = const [];
  bool _loaded = false;

  /// Newest first.
  List<SavedBooking> get bookings => List.unmodifiable(_bookings);

  bool get isLoaded => _loaded;

  List<SavedBooking> get upcoming =>
      _bookings.where((b) => !b.isPast).toList(growable: false);

  List<SavedBooking> get past =>
      _bookings.where((b) => b.isPast).toList(growable: false);

  Future<void> load() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getStringList(_key) ?? const <String>[];
    final parsed = <SavedBooking>[];
    for (final entry in raw) {
      try {
        parsed.add(
          SavedBooking.fromJson(jsonDecode(entry) as Map<String, dynamic>),
        );
      } on FormatException {
        // Skip a corrupt record rather than losing the whole list to it.
      } on TypeError {
        // Same for a record written by an incompatible older shape.
      }
    }
    parsed.sort((a, b) => b.bookedAt.compareTo(a.bookedAt));
    _bookings = parsed;
    _loaded = true;
    notifyListeners();
  }

  Future<void> add(SavedBooking booking) async {
    // A re-save of the same reference replaces rather than duplicates.
    final next = [
      booking,
      ..._bookings.where((b) => b.ref != booking.ref),
    ]..sort((a, b) => b.bookedAt.compareTo(a.bookedAt));
    _bookings = next;
    notifyListeners();
    await _persist();
  }

  Future<void> remove(String ref) async {
    _bookings = _bookings.where((b) => b.ref != ref).toList(growable: false);
    notifyListeners();
    await _persist();
  }

  Future<void> clear() async {
    _bookings = const [];
    notifyListeners();
    await _persist();
  }

  SavedBooking? byRef(String ref) {
    final normalized = ref.trim().toUpperCase();
    for (final booking in _bookings) {
      if (booking.ref.toUpperCase() == normalized) return booking;
    }
    return null;
  }

  Future<void> _persist() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setStringList(
      _key,
      _bookings.map((b) => jsonEncode(b.toJson())).toList(),
    );
  }
}
