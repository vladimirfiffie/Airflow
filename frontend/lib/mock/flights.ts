export type FlightOffer = {
  id: string;
  flightNo: string;
  airline: string;
  fromCode: string;
  toCode: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  stops: number;
  priceUsd: number;
  seatsLeft: number;
};

export type FlightScheduleEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  extendedProps: {
    gate: string;
    aircraft: string;
    status: "On Time" | "Delayed" | "Boarding";
  };
};

export const flightOffers: FlightOffer[] = [
  {
    id: "AF1001",
    flightNo: "AF1001",
    airline: "Airflow Atlantic",
    fromCode: "JFK",
    toCode: "LAX",
    departTime: "07:10",
    arriveTime: "10:40",
    duration: "5h 30m",
    stops: 0,
    priceUsd: 189,
    seatsLeft: 5,
  },
  {
    id: "AF2204",
    flightNo: "AF2204",
    airline: "Airflow Atlantic",
    fromCode: "JFK",
    toCode: "SFO",
    departTime: "09:35",
    arriveTime: "13:10",
    duration: "6h 35m",
    stops: 1,
    priceUsd: 172,
    seatsLeft: 12,
  },
  {
    id: "AF3320",
    flightNo: "AF3320",
    airline: "SkyBridge",
    fromCode: "ORD",
    toCode: "SEA",
    departTime: "11:50",
    arriveTime: "14:35",
    duration: "4h 45m",
    stops: 0,
    priceUsd: 211,
    seatsLeft: 4,
  },
  {
    id: "AF4892",
    flightNo: "AF4892",
    airline: "JetNorth",
    fromCode: "MIA",
    toCode: "BOS",
    departTime: "15:20",
    arriveTime: "18:25",
    duration: "3h 05m",
    stops: 0,
    priceUsd: 134,
    seatsLeft: 18,
  },
];

export const scheduleEvents: FlightScheduleEvent[] = [
  {
    id: "evt-1",
    title: "AF1001 JFK -> LAX",
    start: "2026-03-03T07:10:00",
    end: "2026-03-03T10:40:00",
    extendedProps: { gate: "A12", aircraft: "A321neo", status: "Boarding" },
  },
  {
    id: "evt-2",
    title: "AF2204 JFK -> SFO",
    start: "2026-03-04T09:35:00",
    end: "2026-03-04T13:10:00",
    extendedProps: { gate: "B4", aircraft: "B737-8", status: "On Time" },
  },
  {
    id: "evt-3",
    title: "AF3320 ORD -> SEA",
    start: "2026-03-05T11:50:00",
    end: "2026-03-05T14:35:00",
    extendedProps: { gate: "C9", aircraft: "A220-300", status: "Delayed" },
  },
  {
    id: "evt-4",
    title: "AF4892 MIA -> BOS",
    start: "2026-03-06T15:20:00",
    end: "2026-03-06T18:25:00",
    extendedProps: { gate: "D2", aircraft: "B737-9", status: "On Time" },
  },
];
