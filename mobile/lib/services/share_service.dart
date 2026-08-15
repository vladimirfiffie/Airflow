import 'dart:ui';

import 'package:share_plus/share_plus.dart';

import '../models/flight.dart';
import '../models/saved_booking.dart';
import 'deep_links.dart';

/// Hands content to the Android share sheet (ACTION_SEND).
class ShareService {
  const ShareService._();

  static Future<void> booking(
    SavedBooking booking, {
    Rect? originRect,
  }) async {
    final f = booking.flight;
    final travelers = booking.passengers.map((p) => p.name).join(', ');
    final text = '''
Airflow booking ${booking.ref}

${f.flightNo} · ${f.airline}
${f.fromCode} → ${f.toCode}
${f.departTime} → ${f.arriveTime} (${f.duration})

Passengers: $travelers
Seats: ${booking.seatSummary}

${DeepLinks.bookingUrl(booking.ref)}''';

    await SharePlus.instance.share(
      ShareParams(
        text: text,
        subject: 'Airflow booking ${booking.ref} · '
            '${f.fromCode} → ${f.toCode}',
        title: 'Share booking',
        sharePositionOrigin: originRect,
      ),
    );
  }

  static Future<void> flight(FlightOffer flight, {Rect? originRect}) async {
    final text = '''
${flight.flightNo} · ${flight.airline}
${flight.fromCode} → ${flight.toCode}
${flight.departTime} → ${flight.arriveTime} (${flight.duration}, ${flight.stopsLabel.toLowerCase()})
From \$${flight.priceUsd}

${DeepLinks.flightUrl(flight.id)}''';

    await SharePlus.instance.share(
      ShareParams(
        text: text,
        subject: 'Airflow · ${flight.fromCode} → ${flight.toCode}',
        title: 'Share flight',
        sharePositionOrigin: originRect,
      ),
    );
  }
}
