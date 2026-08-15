import 'dart:convert';

import 'package:airflow/models/flight.dart';
import 'package:airflow/models/saved_booking.dart';
import 'package:flutter_test/flutter_test.dart';

SavedBooking sample({String ref = 'AB12CD'}) => SavedBooking(
      ref: ref,
      flight: const FlightOffer(
        id: 'AF1001',
        flightNo: 'AF1001',
        airline: 'Airflow',
        fromCode: 'JFK',
        toCode: 'LAX',
        departTime: '07:10',
        arriveTime: '10:40',
        duration: '5h 30m',
        stops: 0,
        priceUsd: 199,
        seatsLeft: 12,
      ),
      passengers: const [
        SavedPassenger(name: 'Jane Doe', seatId: '12A', seatLabel: 'Exit row'),
        SavedPassenger(name: 'John Doe', seatId: '12B', seatLabel: 'Exit row'),
      ],
      contactEmail: 'jane@example.com',
      totalUsd: 465,
      bookedAt: DateTime(2026, 8, 15, 9, 30),
      departsAt: DateTime(2026, 8, 16, 7, 10),
      arrivesAt: DateTime(2026, 8, 16, 10, 40),
    );

void main() {
  test('survives a JSON round trip', () {
    final restored =
        SavedBooking.fromJson(jsonDecode(jsonEncode(sample().toJson())));

    expect(restored.ref, 'AB12CD');
    expect(restored.flight.flightNo, 'AF1001');
    expect(restored.passengers.length, 2);
    expect(restored.passengers.first.seatId, '12A');
    expect(restored.contactEmail, 'jane@example.com');
    expect(restored.totalUsd, 465);
    expect(restored.departsAt, DateTime(2026, 8, 16, 7, 10));
    expect(restored.arrivesAt, DateTime(2026, 8, 16, 10, 40));
  });

  test('seat summary lists every passenger seat', () {
    expect(sample().seatSummary, '12A, 12B');
  });

  test('notification id is stable, positive and reference-specific', () {
    // Reminders are cancelled by re-deriving this id, so it has to be
    // reproducible across launches — and inside Android's int range.
    expect(sample().notificationId, sample().notificationId);
    expect(sample().notificationId, isNot(sample(ref: 'ZZ99YY').notificationId));
    expect(sample().notificationId, greaterThanOrEqualTo(0));
    // +1 is used for the second reminder, so leave headroom.
    expect(sample().notificationId, lessThan(0x3FFFFFFF));
  });

  test('isPast keys off arrival, not departure', () {
    final landed = SavedBooking(
      ref: 'OLD123',
      flight: sample().flight,
      passengers: const [],
      contactEmail: '',
      totalUsd: 0,
      bookedAt: DateTime(2020),
      departsAt: DateTime(2020, 1, 1, 7, 10),
      arrivesAt: DateTime(2020, 1, 1, 10, 40),
    );
    expect(landed.isPast, isTrue);
    expect(
      SavedBooking(
        ref: 'NEW123',
        flight: sample().flight,
        passengers: const [],
        contactEmail: '',
        totalUsd: 0,
        bookedAt: DateTime.now(),
        departsAt: DateTime.now().add(const Duration(days: 1)),
        arrivesAt: DateTime.now().add(const Duration(days: 1, hours: 3)),
      ).isPast,
      isFalse,
    );
  });
}
