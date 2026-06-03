import '../models/seat.dart';

const List<int> kFirstRows = [1, 2, 3];
const List<int> kExitRows = [12, 13];
const int kTotalRows = 30;
const List<String> kFirstCols = ['A', 'C', 'D', 'F'];
const List<String> kEconCols = ['A', 'B', 'C', 'D', 'E', 'F'];

SeatClass _classOf(int row) {
  if (kFirstRows.contains(row)) return SeatClass.first;
  if (kExitRows.contains(row)) return SeatClass.exit;
  return SeatClass.standard;
}

int _surchargeOf(SeatClass cls) => switch (cls) {
      SeatClass.first => 150,
      SeatClass.exit => 25,
      SeatClass.standard => 0,
    };

/// Deterministic "taken" pattern derived from flight id + seat id, matching the
/// web app's hash so the cabin layout is stable across runs.
bool _isTaken(String flightId, String seatId) {
  int hash = 0;
  final input = '$flightId-$seatId';
  for (int i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.codeUnitAt(i)) & 0xFFFFFFFF;
  }
  return hash % 7 < 2;
}

/// Pure cabin layout — every seat available.
List<Seat> generateSeatLayout() {
  final seats = <Seat>[];
  for (int row = 1; row <= kTotalRows; row++) {
    final cls = _classOf(row);
    final cols = cls == SeatClass.first ? kFirstCols : kEconCols;
    for (final col in cols) {
      seats.add(Seat(
        id: '$row$col',
        row: row,
        col: col,
        cls: cls,
        taken: false,
        surcharge: _surchargeOf(cls),
      ));
    }
  }
  return seats;
}

/// Layout with the synthetic "taken" pattern overlaid for a flight.
List<Seat> generateSeatMap(String flightId) {
  return generateSeatLayout()
      .map((s) => Seat(
            id: s.id,
            row: s.row,
            col: s.col,
            cls: s.cls,
            taken: _isTaken(flightId, s.id),
            surcharge: s.surcharge,
          ))
      .toList();
}

Seat? seatById(List<Seat> seats, String id) {
  for (final s in seats) {
    if (s.id == id) return s;
  }
  return null;
}

/// Fare breakdown used by the trip summary and payment step.
class FareBreakdown {
  const FareBreakdown({
    required this.baseFare,
    required this.seatSurcharge,
    required this.taxes,
    required this.total,
  });
  final int baseFare;
  final int seatSurcharge;
  final int taxes;
  final int total;
  int get subtotal => baseFare + seatSurcharge;
}

FareBreakdown computeFare({
  required int priceUsd,
  required int passengerCount,
  required int seatSurcharge,
}) {
  final base = priceUsd * passengerCount;
  final subtotal = base + seatSurcharge;
  final taxes = (subtotal * kFareBaseTaxRate).round();
  return FareBreakdown(
    baseFare: base,
    seatSurcharge: seatSurcharge,
    taxes: taxes,
    total: subtotal + taxes,
  );
}

/// Generates a 6-char booking ref like AB12CD (web: generateBookingRef).
String generateBookingRef() {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const digits = '0123456789';
  final now = DateTime.now().microsecondsSinceEpoch;
  var seed = now;
  String pick(String set, int n) {
    final sb = StringBuffer();
    for (int i = 0; i < n; i++) {
      seed = (seed * 1103515245 + 12345) & 0x7FFFFFFF;
      sb.write(set[seed % set.length]);
    }
    return sb.toString();
  }

  return '${pick(letters, 2)}${pick(digits, 2)}${pick(letters, 2)}';
}
