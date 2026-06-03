import '../models/flight.dart';

/// Static flight inventory. Mirrors `flightOffers` in lib/mock/flights.ts.
const List<FlightOffer> kFlightOffers = [
  FlightOffer(
    id: 'AF1001',
    flightNo: 'AF1001',
    airline: 'Airflow Atlantic',
    fromCode: 'JFK',
    toCode: 'LAX',
    departTime: '07:10',
    arriveTime: '10:40',
    duration: '5h 30m',
    stops: 0,
    priceUsd: 189,
    seatsLeft: 5,
  ),
  FlightOffer(
    id: 'AF2204',
    flightNo: 'AF2204',
    airline: 'Airflow Atlantic',
    fromCode: 'JFK',
    toCode: 'SFO',
    departTime: '09:35',
    arriveTime: '13:10',
    duration: '6h 35m',
    stops: 1,
    priceUsd: 172,
    seatsLeft: 12,
  ),
  FlightOffer(
    id: 'AF3320',
    flightNo: 'AF3320',
    airline: 'SkyBridge',
    fromCode: 'ORD',
    toCode: 'SEA',
    departTime: '11:50',
    arriveTime: '14:35',
    duration: '4h 45m',
    stops: 0,
    priceUsd: 211,
    seatsLeft: 4,
  ),
  FlightOffer(
    id: 'AF4892',
    flightNo: 'AF4892',
    airline: 'JetNorth',
    fromCode: 'MIA',
    toCode: 'BOS',
    departTime: '15:20',
    arriveTime: '18:25',
    duration: '3h 05m',
    stops: 0,
    priceUsd: 134,
    seatsLeft: 18,
  ),
  FlightOffer(
    id: 'AF5108',
    flightNo: 'AF5108',
    airline: 'SkyBridge',
    fromCode: 'DFW',
    toCode: 'PHX',
    departTime: '16:05',
    arriveTime: '17:35',
    duration: '2h 30m',
    stops: 0,
    priceUsd: 119,
    seatsLeft: 22,
  ),
  FlightOffer(
    id: 'AF6711',
    flightNo: 'AF6711',
    airline: 'JetNorth',
    fromCode: 'ATL',
    toCode: 'DEN',
    departTime: '18:40',
    arriveTime: '20:05',
    duration: '3h 25m',
    stops: 0,
    priceUsd: 158,
    seatsLeft: 9,
  ),
];

FlightOffer? findFlight(String id) {
  for (final f in kFlightOffers) {
    if (f.id == id) return f;
  }
  return null;
}

/// Featured destinations for the home carousel.
class Destination {
  const Destination({
    required this.code,
    required this.city,
    required this.country,
    required this.tagline,
    required this.color,
  });
  final String code;
  final String city;
  final String country;
  final String tagline;
  final int color; // ARGB
}

const List<Destination> kDestinations = [
  Destination(
    code: 'LAX',
    city: 'Los Angeles',
    country: 'United States',
    tagline: 'Endless coastline, golden light.',
    color: 0xFFEA580C,
  ),
  Destination(
    code: 'SFO',
    city: 'San Francisco',
    country: 'United States',
    tagline: 'Fog, hills, and the bay.',
    color: 0xFF0F766E,
  ),
  Destination(
    code: 'SEA',
    city: 'Seattle',
    country: 'United States',
    tagline: 'Evergreen and espresso.',
    color: 0xFF1E3A8A,
  ),
  Destination(
    code: 'BOS',
    city: 'Boston',
    country: 'United States',
    tagline: 'History on every corner.',
    color: 0xFF7C2D12,
  ),
  Destination(
    code: 'DEN',
    city: 'Denver',
    country: 'United States',
    tagline: 'A mile high, peaks in view.',
    color: 0xFF4338CA,
  ),
];
