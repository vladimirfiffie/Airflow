import 'package:airflow/services/deep_links.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('DeepLinks.parse', () {
    test('custom scheme puts the first segment in the host', () {
      // airflow://flight/AF1001 parses as host=flight, path=/AF1001 — the
      // shape that trips up naive pathSegments-only parsing.
      final result = DeepLinks.parse(Uri.parse('airflow://flight/AF1001'));
      expect(result, isA<FlightDestination>());
      expect((result! as FlightDestination).flightId, 'AF1001');
    });

    test('https link uses path segments', () {
      final result =
          DeepLinks.parse(Uri.parse('https://airflow.app/flights/AF2204'));
      expect((result! as FlightDestination).flightId, 'AF2204');
    });

    test('flight ids are upper-cased', () {
      final result = DeepLinks.parse(Uri.parse('airflow://flight/af1001'));
      expect((result! as FlightDestination).flightId, 'AF1001');
    });

    test('booking reference', () {
      final result = DeepLinks.parse(Uri.parse('airflow://booking/ab12cd'));
      expect((result! as BookingDestination).ref, 'AB12CD');
    });

    test('search carries its query', () {
      final result = DeepLinks.parse(Uri.parse('airflow://search?q=JFK'));
      expect((result! as SearchDestination).query, 'JFK');
    });

    test('search without a query is still a search', () {
      final result = DeepLinks.parse(Uri.parse('airflow://search'));
      expect((result! as SearchDestination).query, '');
    });

    test('bare section links resolve to tabs', () {
      expect(
        (DeepLinks.parse(Uri.parse('airflow://schedule'))! as TabDestination)
            .name,
        'schedule',
      );
      // A section link with no id must not be read as an id-less flight.
      expect(
        (DeepLinks.parse(Uri.parse('airflow://flights'))! as TabDestination)
            .name,
        'flights',
      );
    });

    test('unknown and empty links resolve to nothing', () {
      expect(DeepLinks.parse(Uri.parse('airflow://nonsense')), isNull);
      expect(DeepLinks.parse(Uri.parse('https://airflow.app/')), isNull);
    });
  });
}
