import '../models/flight.dart';

/// Turns the mock inventory's display times ("07:10") into real timestamps.
///
/// The mock flights carry a time of day but no date — fine for a listing, not
/// enough to schedule a reminder or write a calendar entry against. These
/// helpers resolve the next occurrence of that departure, which is what a user
/// booking "the 07:10" actually means.
class FlightTimes {
  const FlightTimes._();

  /// Parses "HH:mm" into (hour, minute); returns null on anything unexpected.
  static (int, int)? _parse(String hhmm) {
    final parts = hhmm.split(':');
    if (parts.length != 2) return null;
    final hour = int.tryParse(parts[0]);
    final minute = int.tryParse(parts[1]);
    if (hour == null || minute == null) return null;
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
    return (hour, minute);
  }

  /// The next time this flight departs: today if that hasn't passed yet,
  /// otherwise tomorrow.
  static DateTime departure(FlightOffer flight, {DateTime? now}) {
    final reference = now ?? DateTime.now();
    final parsed = _parse(flight.departTime);
    if (parsed == null) {
      // Unparseable time — put it a day out rather than in the past, so
      // downstream reminder scheduling simply no-ops instead of misfiring.
      return reference.add(const Duration(days: 1));
    }
    final (hour, minute) = parsed;
    final today = DateTime(
      reference.year,
      reference.month,
      reference.day,
      hour,
      minute,
    );
    return today.isAfter(reference)
        ? today
        : today.add(const Duration(days: 1));
  }

  /// Arrival for the same leg, rolled to the next day when the flight lands
  /// after midnight (arrive time earlier than depart time).
  static DateTime arrival(FlightOffer flight, {DateTime? now}) {
    final departsAt = departure(flight, now: now);
    final parsed = _parse(flight.arriveTime);
    if (parsed == null) return departsAt.add(const Duration(hours: 3));
    final (hour, minute) = parsed;
    final sameDay = DateTime(
      departsAt.year,
      departsAt.month,
      departsAt.day,
      hour,
      minute,
    );
    return sameDay.isAfter(departsAt)
        ? sameDay
        : sameDay.add(const Duration(days: 1));
  }
}
