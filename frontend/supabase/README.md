# Backend setup

The frontend wires to four free services. Each is independent — set up only the ones you want; missing env vars fall back to mock data automatically.

## 1. Supabase (DB + Auth) — required for booking persistence

1. Create a project at <https://supabase.com> (free tier).
2. Settings → API. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` secret → `SUPABASE_SERVICE_ROLE_KEY` (server-only, never expose)
3. SQL editor → paste `supabase/migrations/0001_init.sql` → Run.
4. SQL editor → paste `supabase/seed.sql` → Run. (Re-runnable; uses ON CONFLICT.)

## 2. Stripe (Payments) — required for the payment step to charge

1. Sign up at <https://stripe.com> (free, test mode).
2. Dashboard → Developers → API keys. Copy:
   - Publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Secret key → `STRIPE_SECRET_KEY`
3. Test cards: `4242 4242 4242 4242`, any future expiry, any CVC.

## 3. Resend (Confirmation emails) — optional

1. Sign up at <https://resend.com> (3k emails/month free).
2. API keys → create → `RESEND_API_KEY`.
3. Verify a sending domain or use `onboarding@resend.dev` for testing.
4. Set `RESEND_FROM_EMAIL` (e.g. `Airflow <bookings@yourdomain.com>`).

## 4. OpenSky Network (Real live aircraft) — optional, no signup

The public endpoint is rate-limited (~10 req/min). For higher limits, register at <https://opensky-network.org> and set `OPENSKY_USERNAME` / `OPENSKY_PASSWORD`.

---

## Without any keys

Everything still works against mocks: flights from `lib/mock/flights.ts`, simulated stats, the payment step skips Stripe and just generates a fake booking ref. This means you can `npm run dev` immediately after cloning.
