-- Seed data — flight inventory mirroring lib/mock/flights.ts
insert into public.flights
  (id, flight_no, airline, from_code, to_code, depart_time, arrive_time, duration, stops, price_usd, total_seats, aircraft, gate, status)
values
  ('AF1001', 'AF1001', 'Airflow Atlantic', 'JFK', 'LAX', '07:10', '10:40', '5h 30m', 0, 189, 180, 'A321neo',  'A12', 'BOARDING'),
  ('AF2204', 'AF2204', 'Airflow Atlantic', 'JFK', 'SFO', '09:35', '13:10', '6h 35m', 1, 172, 180, 'B737-8',   'B4',  'ON_TIME'),
  ('AF3320', 'AF3320', 'SkyBridge',        'ORD', 'SEA', '11:50', '14:35', '4h 45m', 0, 211, 180, 'A220-300', 'C9',  'DELAYED'),
  ('AF4892', 'AF4892', 'JetNorth',         'MIA', 'BOS', '15:20', '18:25', '3h 05m', 0, 134, 180, 'B737-9',   'D2',  'ON_TIME'),
  ('AF5108', 'AF5108', 'Airflow Atlantic', 'DFW', 'PHX', '16:05', '17:30', '2h 25m', 0, 119, 180, 'A220-300', 'E7',  'ON_TIME'),
  ('AF6711', 'AF6711', 'SkyBridge',        'ATL', 'DEN', '18:40', '20:15', '3h 35m', 0, 156, 180, 'B737-8',   'F3',  'BOARDING')
on conflict (id) do update set
  flight_no    = excluded.flight_no,
  airline      = excluded.airline,
  from_code    = excluded.from_code,
  to_code      = excluded.to_code,
  depart_time  = excluded.depart_time,
  arrive_time  = excluded.arrive_time,
  duration     = excluded.duration,
  stops        = excluded.stops,
  price_usd    = excluded.price_usd,
  aircraft     = excluded.aircraft,
  gate         = excluded.gate,
  status       = excluded.status;
