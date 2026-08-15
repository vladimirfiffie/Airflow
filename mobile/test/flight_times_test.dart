import 'package:airflow/data/flight_times.dart';
import 'package:airflow/models/flight.dart';
import 'package:flutter_test/flutter_test.dart';

FlightOffer flightAt(String depart, String arrive) => FlightOffer(
      id: 'AF1001',
      flightNo: 'AF1001',
      airline: 'Airflow',
      fromCode: 'JFK',
      toCode: 'LAX',
      departTime: depart,
      arriveTime: arrive,
      duration: '5h 30m',
      stops: 0,
      priceUsd: 199,
      seatsLeft: 12,
    );

void main() {
  group('FlightTimes.departure', () {
    test('uses today when the departure is still ahead', () {
      final now = DateTime(2026, 8, 15, 6, 0);
      final departs = FlightTimes.departure(flightAt('07:10', '10:40'), now: now);
      expect(departs, DateTime(2026, 8, 15, 7, 10));
    });

    test('rolls to tomorrow once the time has passed', () {
      final now = DateTime(2026, 8, 15, 9, 0);
      final departs = FlightTimes.departure(flightAt('07:10', '10:40'), now: now);
      expect(departs, DateTime(2026, 8, 16, 7, 10));
    });

    test('a departure exactly now counts as passed', () {
      final now = DateTime(2026, 8, 15, 7, 10);
      final departs = FlightTimes.departure(flightAt('07:10', '10:40'), now: now);
      expect(departs, DateTime(2026, 8, 16, 7, 10));
    });

    test('an unparseable time lands in the future, never the past', () {
      final now = DateTime(2026, 8, 15, 9, 0);
      final departs = FlightTimes.departure(flightAt('nope', '10:40'), now: now);
      expect(departs.isAfter(now), isTrue);
    });
  });

  group('FlightTimes.arrival', () {
    test('same day when the flight lands before midnight', () {
      final now = DateTime(2026, 8, 15, 6, 0);
      final arrives = FlightTimes.arrival(flightAt('07:10', '10:40'), now: now);
      expect(arrives, DateTime(2026, 8, 15, 10, 40));
    });

    test('rolls over midnight when arrival reads earlier than departure', () {
      final now = DateTime(2026, 8, 15, 6, 0);
      final arrives = FlightTimes.arrival(flightAt('21:00', '05:30'), now: now);
      expect(arrives, DateTime(2026, 8, 16, 5, 30));
      // And the leg must not be inverted.
      final departs = FlightTimes.departure(flightAt('21:00', '05:30'), now: now);
      expect(arrives.isAfter(departs), isTrue);
    });
  });
}
