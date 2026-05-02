-- ============================================================================
-- AIRFLOW — Initial schema
-- Run this once on your Supabase project (SQL editor → paste → run).
-- All tables are accessed from the server via the service-role key, so RLS is
-- enabled but only the service_role bypass is used. Auth tables (auth.users)
-- are managed by Supabase itself.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- flights — inventory
-- ----------------------------------------------------------------------------
create table if not exists public.flights (
  id            text primary key,            -- e.g. AF1001
  flight_no     text not null,
  airline       text not null,
  from_code     text not null,
  to_code       text not null,
  depart_time   text not null,               -- "07:10"
  arrive_time   text not null,               -- "10:40"
  duration      text not null,               -- "5h 30m"
  stops         smallint not null default 0,
  price_usd     integer not null,
  total_seats   smallint not null default 180,
  aircraft      text,
  gate          text,
  status        text not null default 'ON_TIME',
  delay_min     integer not null default 0,
  scheduled_at  timestamptz,
  created_at    timestamptz not null default now()
);

create index if not exists flights_from_to_idx on public.flights (from_code, to_code);
create index if not exists flights_price_idx on public.flights (price_usd);

-- ----------------------------------------------------------------------------
-- bookings — confirmed (or cancelled) reservations
-- ----------------------------------------------------------------------------
create table if not exists public.bookings (
  id                       uuid primary key default gen_random_uuid(),
  ref                      text unique not null,                                 -- e.g. AB12CD
  flight_id                text not null references public.flights(id),
  user_id                  uuid references auth.users(id) on delete set null,
  contact_email            text not null,
  contact_phone            text not null,
  status                   text not null default 'CONFIRMED',                    -- CONFIRMED | CANCELLED
  total_cents              integer not null,
  stripe_payment_intent    text,
  created_at               timestamptz not null default now()
);

create index if not exists bookings_user_idx on public.bookings (user_id);
create index if not exists bookings_flight_idx on public.bookings (flight_id);
create index if not exists bookings_email_idx on public.bookings (contact_email);

-- ----------------------------------------------------------------------------
-- passengers — one row per traveler on a booking; carries seat assignment.
-- flight_id is denormalized so we can enforce a unique seat per flight at the
-- DB level (Postgres won't allow subqueries in unique index expressions).
-- The API enforces that passengers.flight_id matches bookings.flight_id.
-- ----------------------------------------------------------------------------
create table if not exists public.passengers (
  id          uuid primary key default gen_random_uuid(),
  booking_id  uuid not null references public.bookings(id) on delete cascade,
  flight_id   text not null references public.flights(id),
  first_name  text not null,
  last_name   text not null,
  dob         date not null,
  seat_id     text not null,                       -- e.g. "12A"
  position    smallint not null,                   -- 1..6 within the booking
  created_at  timestamptz not null default now(),
  unique (booking_id, position),
  unique (flight_id, seat_id)                      -- hard guard against double-booked seats
);

create index if not exists passengers_booking_idx on public.passengers (booking_id);
create index if not exists passengers_flight_seat_idx on public.passengers (flight_id, seat_id);

-- ----------------------------------------------------------------------------
-- RLS — locked down by default. The server uses the service_role which bypasses.
-- Public can read flights so the frontend can call directly if we ever want to.
-- ----------------------------------------------------------------------------
alter table public.flights    enable row level security;
alter table public.bookings   enable row level security;
alter table public.passengers enable row level security;

drop policy if exists "flights_public_read" on public.flights;
create policy "flights_public_read" on public.flights
  for select using (true);

-- bookings/passengers: no public policies → only service_role can access.
