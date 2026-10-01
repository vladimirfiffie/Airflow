# Airflow

A full-featured flight booking platform designed to feel modern and intuitive, from search through final confirmation.

> **Prerelease:** This is a demo build. Payment is simulated and no real payment data is collected or stored.

---

## At a Glance

Airflow is a complete flight booking experience designed to look and feel like a modern, top-tier travel platform.

- **Complete Booking Flow:** Search live flights, filter by route and price, review detailed itineraries, select seats, enter traveler details, and complete checkout with a validated payment flow.
- **Smart Comparison:** Compare fares across multiple options, view schedule alternatives, track historical price trends, and find the best deal for your journey.
- **Seamless Experience:** Receive instant booking confirmations, track your reservation status, look up existing bookings, and manage all your travel in one place.
- **Reliable Checkout:** Secure payment processing with Stripe, address and card validation, delivery speed options, and instant confirmation emails.

---

## Features

| Area | Details |
| --- | --- |
| **Discovery** | Live departure board, featured routes, and quick search results |
| **Search** | Filter by date, time, price range, and cabin class to find your ideal flight |
| **Flight Details** | Complete fare breakdown, available schedules, and historical pricing |
| **Seat Selection** | Interactive seat map with real-time availability |
| **Passenger Info** | Enter traveler details and contact information |
| **Checkout** | Secure payment, address validation, and booking confirmation |
| **Bookings** | Look up reservations, view itineraries, and manage your trips |
| **Support** | Comprehensive help section with common questions |

---

## Quick Start

```bash
cd frontend
npm install
cp .env.example .env.local   # optional
npm run dev                  # http://localhost:3000
```

Scripts: `npm run dev` · `npm run build` · `npm run start` · `npm run lint`

---

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Home with live ticker, featured flights, and stats |
| `/search` | Search results with filters and sorting |
| `/flights` | All available flight offers |
| `/flights/[id]` | Flight details and fares |
| `/flights/schedule` | Calendar view of available flights |
| `/booking/[flightId]` | Passenger information (step 1) |
| `/booking/[flightId]/seats` | Seat selection (step 2) |
| `/booking/[flightId]/payment` | Payment processing (step 3) |
| `/booking/[flightId]/confirmation` | Booking confirmation |
| `/booking` | Booking lookup |
| `/login`, `/sign-up`, `/forgot-password` | Account management |
| `/help` | FAQ and support |

---

## API

| Endpoint | Description |
| --- | --- |
| `GET /api/flights` | List flights |
| `GET /api/flights/[id]` | Single flight details |
| `GET /api/flights/[id]/seats` | Seat availability map |
| `GET /api/stats` | Live travel statistics |
| `POST /api/bookings/intent` | Create payment intent |
| `POST /api/bookings` | Complete a booking |
| `GET /api/bookings/[ref]?email=` | Look up a booking |

---

## Services

Airflow works with optional services that enhance the experience. If not configured, the platform gracefully falls back to demo data.

| Service | Purpose | Without it |
| --- | --- | --- |
| **Supabase** | Flights, bookings, passengers, auth | Flights use demo data; bookings aren't saved |
| **Stripe** | Payment processing | Booking completes without real payment |
| **Resend** | Confirmation emails | No email is sent |
| **OpenSky** | Live flight statistics | Stats are simulated |

To set up the database, run the SQL files in Supabase:

```bash
frontend/supabase/migrations/0001_init.sql
frontend/supabase/seed.sql
```

**Test payment card:**

```
4242 4242 4242 4242
```

Any future expiry date and any valid CVC work in test mode.

---

## Tech Stack

- **Next.js 16** with React 19
- **Tailwind v4** for styling
- **TypeScript** for type safety
- **Supabase** for backend and auth
- **Stripe** for secure payments
- **Resend** for email delivery
- **OpenSky** for live flight data

---

## Project Structure

```
frontend/
├── app/                 Pages and API routes
├── components/          Booking flow and UI components
├── hooks/               Shared React hooks
├── lib/
│   ├── booking/         Booking state and types
│   ├── data/            Flight data and service integration
│   ├── mock/            Demo flights and seat maps
│   ├── email/           Email templates
│   ├── supabase/        Database client
│   ├── stripe/          Payment client
│   ├── resend/          Email client
│   └── opensky/         Stats integration
├── supabase/            Database migrations and setup
└── proxy.ts             Session management
```

---

## Notes

- The platform is fully functional with demo data—no external services required to get started.
- All bookings and user data remain local during development and testing.
- Payment processing is secure in production and safely simulated in demo mode.

