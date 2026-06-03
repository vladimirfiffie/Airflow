import 'package:flutter/foundation.dart';
import '../models/flight.dart';
import '../models/passenger.dart';
import '../models/seat.dart';
import '../data/seat_map.dart';

/// Holds the in-progress booking for a single flight across the wizard steps.
class BookingController extends ChangeNotifier {
  BookingController(this.flight)
      : seats = generateSeatMap(flight.id),
        passengers = [Passenger()];

  final FlightOffer flight;
  final List<Seat> seats;

  List<Passenger> passengers;
  final ContactInfo contact = ContactInfo();
  final PaymentInfo payment = PaymentInfo();
  String? bookingRef;

  int get passengerCount => passengers.length;

  void addPassenger() {
    if (passengers.length >= 6) return;
    passengers.add(Passenger());
    notifyListeners();
  }

  void removePassenger(int i) {
    if (passengers.length <= 1) return;
    passengers.removeAt(i);
    notifyListeners();
  }

  void assignSeat(int passengerIndex, String? seatId) {
    // If another passenger holds this seat, release it first.
    if (seatId != null) {
      for (final p in passengers) {
        if (p.seatId == seatId) p.seatId = null;
      }
    }
    passengers[passengerIndex].seatId = seatId;
    notifyListeners();
  }

  int get seatSurcharge {
    var sum = 0;
    for (final p in passengers) {
      if (p.seatId == null) continue;
      sum += seatById(seats, p.seatId!)?.surcharge ?? 0;
    }
    return sum;
  }

  FareBreakdown get fare => computeFare(
        priceUsd: flight.priceUsd,
        passengerCount: passengerCount,
        seatSurcharge: seatSurcharge,
      );

  bool get allSeatsAssigned => passengers.every((p) => p.seatId != null);

  void touch() => notifyListeners();
}
