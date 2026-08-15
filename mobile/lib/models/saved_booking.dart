import 'flight.dart';

/// A confirmed booking, flattened for storage.
///
/// Deliberately a snapshot rather than a reference: the flight and seat details
/// are copied in, so a saved booking still reads correctly even if the mock
/// inventory it came from changes underneath it.
class SavedBooking {
  const SavedBooking({
    required this.ref,
    required this.flight,
    required this.passengers,
    required this.contactEmail,
    required this.totalUsd,
    required this.bookedAt,
    required this.departsAt,
    required this.arrivesAt,
  });

  final String ref;
  final FlightOffer flight;
  final List<SavedPassenger> passengers;
  final String contactEmail;
  final int totalUsd;
  final DateTime bookedAt;

  /// Resolved wall-clock departure/arrival, so reminders and calendar entries
  /// don't have to re-derive them from the "07:10" display strings.
  final DateTime departsAt;
  final DateTime arrivesAt;

  bool get isPast => arrivesAt.isBefore(DateTime.now());

  String get seatSummary =>
      passengers.map((p) => p.seatId ?? '—').join(', ');

  /// Stable notification id derived from the reference — lets a reminder be
  /// cancelled later without storing the id separately. Kept inside 32-bit
  /// range because Android notification ids are ints.
  int get notificationId {
    var hash = 0;
    for (final unit in ref.codeUnits) {
      hash = (hash * 31 + unit) & 0x3FFFFFFF;
    }
    return hash;
  }

  Map<String, dynamic> toJson() => {
        'ref': ref,
        'flight': {
          'id': flight.id,
          'flightNo': flight.flightNo,
          'airline': flight.airline,
          'fromCode': flight.fromCode,
          'toCode': flight.toCode,
          'departTime': flight.departTime,
          'arriveTime': flight.arriveTime,
          'duration': flight.duration,
          'stops': flight.stops,
          'priceUsd': flight.priceUsd,
          'seatsLeft': flight.seatsLeft,
        },
        'passengers': passengers.map((p) => p.toJson()).toList(),
        'contactEmail': contactEmail,
        'totalUsd': totalUsd,
        'bookedAt': bookedAt.toIso8601String(),
        'departsAt': departsAt.toIso8601String(),
        'arrivesAt': arrivesAt.toIso8601String(),
      };

  factory SavedBooking.fromJson(Map<String, dynamic> json) => SavedBooking(
        ref: json['ref'] as String,
        flight: FlightOffer.fromJson(
          Map<String, dynamic>.from(json['flight'] as Map),
        ),
        passengers: (json['passengers'] as List)
            .map((p) => SavedPassenger.fromJson(
                  Map<String, dynamic>.from(p as Map),
                ))
            .toList(),
        contactEmail: json['contactEmail'] as String? ?? '',
        totalUsd: json['totalUsd'] as int,
        bookedAt: DateTime.parse(json['bookedAt'] as String),
        departsAt: DateTime.parse(json['departsAt'] as String),
        arrivesAt: DateTime.parse(json['arrivesAt'] as String),
      );
}

/// A traveler as stored on a confirmed booking.
class SavedPassenger {
  const SavedPassenger({
    required this.name,
    required this.seatId,
    required this.seatLabel,
  });

  final String name;
  final String? seatId;
  final String seatLabel;

  Map<String, dynamic> toJson() => {
        'name': name,
        'seatId': seatId,
        'seatLabel': seatLabel,
      };

  factory SavedPassenger.fromJson(Map<String, dynamic> json) => SavedPassenger(
        name: json['name'] as String,
        seatId: json['seatId'] as String?,
        seatLabel: json['seatLabel'] as String? ?? '',
      );
}
