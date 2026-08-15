# Airflow

A flight search and booking app, built twice: a **Next.js 16 web app** and a **Flutter port** that mirrors its screens and design language.

The web app runs end to end — search → flight details → seat map → passengers → payment → confirmation — and wires up to four external services (Supabase, Stripe, Resend, OpenSky). Every one of them is optional: if the env vars for a service are missing, that part of the app falls back to mock data automatically, so `npm run dev` works immediately after cloning with no keys at all.

```
Airflow/
├── frontend/   Next.js 16 · React 19 · Tailwind v4 · TypeScript
└── mobile/     Flutter port (iOS + Android)
```

---

## Quick start — web

```bash
cd frontend
npm install
cp .env.example .env.local   # optional — see "Services" below
npm run dev                  # http://localhost:3000
```

Scripts: `npm run dev` · `npm run build` · `npm run start` · `npm run lint`

## Quick start — mobile

```bash
cd mobile
flutter pub get
flutter run
```

The Flutter app is self-contained: flights, seat maps, and live stats come from in-app mock data (`lib/data/`), using the same deterministic jitter function as the web app so both show comparable numbers. It does not talk to the Next.js API.

---

## Web app

### Routes

| Route | What it does |
| --- | --- |
| `/` | Landing page — live ticker, live stats, featured flights |
| `/search` | Search results with filters |
| `/flights` | All flight offers |
| `/flights/[id]` | Flight detail |
| `/flights/schedule` | FullCalendar schedule view |
| `/booking/[flightId]` | Passenger details (step 1) |
| `/booking/[flightId]/seats` | Seat map selection (step 2) |
| `/booking/[flightId]/payment` | Stripe payment (step 3) |
| `/booking/[flightId]/confirmation` | Booking reference + email receipt |
| `/booking` | Manage / look up an existing booking by reference |
| `/login`, `/sign-up`, `/forgot-password` | Supabase auth |
| `/help` | FAQ |

### API

| Endpoint | Description |
| --- | --- |
| `GET /api/flights` | List flights (Supabase, else mock) |
| `GET /api/flights/[id]` | Single flight |
| `GET /api/flights/[id]/seats` | Seat map with taken seats overlaid from real bookings |
| `GET /api/stats` | Live stats + departure board; per-field `source` says `opensky`/`supabase` vs `simulated` |
| `POST /api/bookings/intent` | Creates a Stripe PaymentIntent; returns `mode: "mock"` when Stripe is unset |
| `POST /api/bookings` | Validates seats, verifies payment, persists booking + passengers, emails confirmation |
| `GET /api/bookings/[ref]?email=` | Booking lookup (requires Supabase; 501 otherwise) |

Booking creation re-checks seat availability, verifies the PaymentIntent status *and* amount against a server-side recomputed total, and rolls the booking back if a passenger insert hits the unique `(flight_id, seat_id)` constraint from a race.

### Layout

```
frontend/
├── app/                 App Router pages + route handlers
├── components/
│   ├── booking/         Stepper, trip summary, Stripe payment form
│   ├── live/            Live ticker, counters, stats polling hook
│   ├── navigation/      Navbar, user menu
│   └── ui/              Reusable primitives (3D card, carousel, spotlight, …)
├── lib/
│   ├── data/flights.ts  Single data seam: Supabase when configured, mock otherwise
│   ├── booking/         Booking state + shared types
│   ├── mock/            Mock flights and deterministic seat maps
│   ├── supabase/ stripe/ resend/ opensky/   Service clients + `isXConfigured()` guards
│   └── email/           Confirmation email template
├── supabase/            Schema migration, seed data, setup guide
└── proxy.ts             Refreshes the Supabase session cookie per request
```

---

## Services

All four are free-tier and independent — set up only the ones you want. Full step-by-step setup lives in [`frontend/supabase/README.md`](frontend/supabase/README.md); the variables themselves are documented in [`frontend/.env.example`](frontend/.env.example).

| Service | Used for | Without it |
| --- | --- | --- |
| **Supabase** | Flights, bookings, passengers, auth | Mock flights; bookings aren't persisted and lookup returns 501 |
| **Stripe** | Payment step (test mode) | Payment step is skipped and a booking ref is generated directly |
| **Resend** | Confirmation emails | No email sent (best-effort either way — it never fails a booking) |
| **OpenSky** | Real live aircraft count | Stats are simulated on a time-of-day curve |

To wire up the database: run `frontend/supabase/migrations/0001_init.sql` then `frontend/supabase/seed.sql` in the Supabase SQL editor. Both are re-runnable.

Tables: `flights` (inventory) · `bookings` (ref, contact, total, PaymentIntent) · `passengers` (one row per traveler, carries the seat and a unique seat-per-flight index).

Stripe test card: `4242 4242 4242 4242`, any future expiry, any CVC.

---

## Mobile app

```
mobile/lib/
├── data/       Mock flights, seat map, simulated stats service
├── models/     Flight, Passenger, Seat, Stats
├── screens/    Home, search, flights, schedule, details, help
│   └── booking/  Passengers → seats → payment → confirmation
├── state/      Booking controller
├── theme/      Light/dark theme (system-mode toggle in the app bar)
└── widgets/    App scaffold, brutalist primitives, live stats
```

Requires the Flutter SDK (Dart `^3.12.0`).
