/// A bookable flight offer. Mirrors `FlightOffer` in the web app.
class FlightOffer {
  const FlightOffer({
    required this.id,
    required this.flightNo,
    required this.airline,
    required this.fromCode,
    required this.toCode,
    required this.departTime,
    required this.arriveTime,
    required this.duration,
    required this.stops,
    required this.priceUsd,
    required this.seatsLeft,
  });

  final String id;
  final String flightNo;
  final String airline;
  final String fromCode;
  final String toCode;
  final String departTime;
  final String arriveTime;
  final String duration;
  final int stops;
  final int priceUsd;
  final int seatsLeft;

  String get stopsLabel =>
      stops == 0 ? 'NON-STOP' : '$stops STOP${stops > 1 ? 'S' : ''}';

  factory FlightOffer.fromJson(Map<String, dynamic> j) => FlightOffer(
        id: j['id'] as String,
        flightNo: j['flightNo'] as String,
        airline: j['airline'] as String,
        fromCode: j['fromCode'] as String,
        toCode: j['toCode'] as String,
        departTime: j['departTime'] as String,
        arriveTime: j['arriveTime'] as String,
        duration: j['duration'] as String,
        stops: j['stops'] as int,
        priceUsd: j['priceUsd'] as int,
        seatsLeft: j['seatsLeft'] as int,
      );
}

/// A scheduled flight event for the calendar/schedule view.
class FlightScheduleEvent {
  const FlightScheduleEvent({
    required this.id,
    required this.title,
    required this.start,
    required this.end,
    required this.gate,
    required this.aircraft,
    required this.status,
  });

  final String id;
  final String title;
  final DateTime start;
  final DateTime end;
  final String gate;
  final String aircraft;
  final String status; // On Time | Delayed | Boarding
}
