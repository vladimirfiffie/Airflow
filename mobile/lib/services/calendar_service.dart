import 'package:add_2_calendar/add_2_calendar.dart' as cal;

import '../models/saved_booking.dart';

/// Writes a flight to the device calendar.
///
/// Uses Android's `Intent.ACTION_INSERT` against the calendar provider, so the
/// user lands in their own calendar app with the event pre-filled and presses
/// save themselves. That means no calendar permission is required and nothing
/// is written without them seeing it.
class CalendarService {
  const CalendarService._();

  static Future<bool> addFlight(SavedBooking booking) async {
    final f = booking.flight;

    final event = cal.Event(
      title: '${f.flightNo} · ${f.fromCode} → ${f.toCode}',
      description: [
        'Airflow booking ${booking.ref}',
        '${f.airline} · ${f.duration} · ${f.stopsLabel.toLowerCase()}',
        'Passengers: ${booking.passengers.map((p) => p.name).join(', ')}',
        'Seats: ${booking.seatSummary}',
      ].join('\n'),
      location: '${f.fromCode} Airport',
      startDate: booking.departsAt,
      endDate: booking.arrivesAt,
    );

    return cal.Add2Calendar.addEvent2Cal(event);
  }
}
