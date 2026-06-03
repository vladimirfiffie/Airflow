enum SeatClass { first, exit, standard }

extension SeatClassLabel on SeatClass {
  String get label => switch (this) {
        SeatClass.first => 'First',
        SeatClass.exit => 'Exit row',
        SeatClass.standard => 'Standard',
      };
}

/// A single cabin seat. Mirrors `Seat` in the web app.
class Seat {
  Seat({
    required this.id,
    required this.row,
    required this.col,
    required this.cls,
    required this.taken,
    required this.surcharge,
  });

  final String id;
  final int row;
  final String col;
  final SeatClass cls;
  final bool taken;
  final int surcharge;
}

/// Base tax rate applied to fare subtotal (web: FARE_BASE_TAX_RATE).
const double kFareBaseTaxRate = 0.085;
