# Airflow — web

Next.js 16 (App Router) · React 19 · Tailwind v4 · TypeScript.

For the project overview, including the Flutter port, see the [root README](../README.md).

## Running it

```bash
npm install
cp .env.example .env.local   # optional
npm run dev                  # http://localhost:3000
```

| Script | |
| --- | --- |
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

**No keys required.** Every external service is behind an `isXConfigured()` guard; when its env vars are absent the app falls back to mock data, so a fresh clone runs the full booking flow offline. See [`.env.example`](.env.example) for the variables and [`supabase/README.md`](supabase/README.md) for per-service setup.

## Structure

```
app/
  api/              Route handlers (flights, seats, stats, bookings)
  booking/[flightId]/   passengers → seats → payment → confirmation
  flights/          List, detail, schedule calendar
  search/  help/  login/  sign-up/  forgot-password/
components/
  booking/          Stepper, trip summary, Stripe payment form
  live/             Ticker, counters, stats polling hook
  navigation/       Navbar menu, user nav
  ui/               Reusable primitives (3D card, carousel, spotlight, …)
hooks/              Shared React hooks
lib/
  data/flights.ts   The data seam — Supabase when configured, mock otherwise
  booking/          Booking state helpers + shared types
  mock/             Mock flights and deterministic seat maps
  email/            Confirmation email template
  supabase/ stripe/ resend/ opensky/   Clients + configured-checks
supabase/           Migration, seed, service setup guide
pages/              Legacy Pages Router leftovers (`/flight-details`)
proxy.ts            Refreshes the Supabase session cookie on each request
```

## API

| Endpoint | Description |
| --- | --- |
| `GET /api/flights` | List flights |
| `GET /api/flights/[id]` | Single flight |
| `GET /api/flights/[id]/seats` | Seat map, with taken seats overlaid from confirmed bookings |
| `GET /api/stats` | Live stats + departure board; `source` marks each field `opensky`/`supabase` or `simulated` |
| `POST /api/bookings/intent` | Stripe PaymentIntent; returns `mode: "mock"` when Stripe is unset |
| `POST /api/bookings` | Creates a booking — see below |
| `GET /api/bookings/[ref]?email=` | Booking lookup (requires Supabase; 501 otherwise) |

`POST /api/bookings` recomputes the total server-side (base fare + seat surcharges + 8.5% tax), re-checks that every requested seat is still free, verifies the PaymentIntent has succeeded *and* matches the amount, then inserts the booking and passengers. A unique `(flight_id, seat_id)` index catches concurrent seat grabs; on that error the booking row is rolled back and the client gets a 409. The confirmation email is best-effort and never fails the booking.

## Notes

- Booking state lives in `sessionStorage` between steps (`lib/booking/state.ts`), so a booking can't be resumed across devices.
- `/signup` redirects to `/sign-up`.
- `next.config.ts` sets `allowedDevOrigins` for LAN testing — add your own machine's IP there if needed.
