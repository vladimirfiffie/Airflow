"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { CheckCircle, Phone } from "lucide-react";

const inputStyle =
  "w-full rounded-md border border-neutral-300 bg-white px-3 py-2.5 text-sm font-medium text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-orange-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white dark:placeholder-neutral-600";

type LookupResult = {
  ref: string;
  flight: { id: string; fromCode: string; toCode: string; departTime: string; arriveTime: string; flightNo: string };
  passengers: { firstName: string; lastName: string; seatId: string }[];
  totalUsd: number;
};

export default function BookingLookupPage() {
  const [bookingRef, setBookingRef] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LookupResult | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setResult(null);
    if (!bookingRef.trim() || !email.trim()) {
      setError("Booking reference and email are required.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(
        `/api/bookings/${encodeURIComponent(bookingRef.trim().toUpperCase())}?email=${encodeURIComponent(email.trim())}`,
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Booking not found.");
        return;
      }
      setResult({
        ref: data.booking.ref,
        flight: {
          id: data.flight.id,
          fromCode: data.flight.fromCode,
          toCode: data.flight.toCode,
          departTime: data.flight.departTime,
          arriveTime: data.flight.arriveTime,
          flightNo: data.flight.flightNo,
        },
        passengers: (data.passengers as Array<{
          first_name: string;
          last_name: string;
          seat_id: string;
        }>).map((p) => ({
          firstName: p.first_name,
          lastName: p.last_name,
          seatId: p.seat_id,
        })),
        totalUsd: Math.round(data.booking.total_cents / 100),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <section className="border-b border-neutral-200 dark:border-neutral-900">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
          <p className="eyebrow">Manage</p>
          <h1 className="display mt-4 text-5xl font-black text-neutral-950 md:text-7xl dark:text-white">
            Manage booking.
          </h1>
          <p className="mt-4 max-w-md text-neutral-600 dark:text-neutral-400">
            Retrieve your itinerary to change seats, update passenger details, or review trip
            policies.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
          {/* Form */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 dark:border-neutral-900 dark:bg-neutral-950">
            <p className="eyebrow !text-neutral-500 dark:!text-neutral-400">Lookup</p>
            <h2 className="display mt-3 text-3xl font-black text-neutral-950 dark:text-white">
              Find your trip.
            </h2>
            <form className="mt-8 space-y-5" onSubmit={onSubmit}>
              <label className="block space-y-2 text-sm">
                <span className="font-bold text-neutral-700 dark:text-neutral-300">
                  Booking reference
                </span>
                <input
                  value={bookingRef}
                  onChange={(e) => setBookingRef(e.target.value.toUpperCase())}
                  placeholder="AB12CD"
                  className={`${inputStyle} mono uppercase tracking-widest`}
                />
              </label>
              <label className="block space-y-2 text-sm">
                <span className="font-bold text-neutral-700 dark:text-neutral-300">
                  Email used at booking
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputStyle}
                />
              </label>
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-md bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-wait disabled:opacity-70"
              >
                {submitting ? "Looking up…" : "Retrieve booking"}
              </button>
            </form>

            {error && (
              <p className="mt-5 rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                {error}
              </p>
            )}

            {result && (
              <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900/50 dark:bg-emerald-950/30">
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <div className="flex-1">
                    <p className="mono text-xs uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                      Booking · {result.ref}
                    </p>
                    <p className="display mono mt-3 text-3xl font-black text-neutral-950 dark:text-white">
                      {result.flight.fromCode}
                      <span className="mx-3 text-orange-500">→</span>
                      {result.flight.toCode}
                    </p>
                    <p className="mt-2 mono text-sm text-neutral-700 dark:text-neutral-300">
                      {result.flight.flightNo} · {result.flight.departTime} →{" "}
                      {result.flight.arriveTime}
                    </p>
                    <ul className="mt-4 space-y-1 text-sm">
                      {result.passengers.map((p, i) => (
                        <li
                          key={i}
                          className="flex items-center justify-between text-neutral-700 dark:text-neutral-300"
                        >
                          <span>
                            {p.firstName} {p.lastName}
                          </span>
                          <span className="mono font-bold text-orange-500">{p.seatId}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 border-t border-emerald-200 pt-3 text-sm dark:border-emerald-900/50">
                      <span className="text-neutral-700 dark:text-neutral-300">Total paid: </span>
                      <span className="mono font-black text-orange-500">${result.totalUsd}</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Info Cards */}
          <div className="space-y-3">
            {[
              {
                title: "What you can update",
                body: "Passenger names, seats, meal preferences, and contact details.",
              },
              {
                title: "Cancellation policy",
                body: "Refund eligibility depends on fare class and time to departure.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-900 dark:bg-neutral-950"
              >
                <p className="eyebrow !text-neutral-500 dark:!text-neutral-400">{card.title}</p>
                <p className="mt-3 text-sm text-neutral-700 dark:text-neutral-300">{card.body}</p>
              </div>
            ))}

            <div className="rounded-2xl border border-orange-200 bg-orange-50 p-6 dark:border-orange-900/40 dark:bg-orange-500/[0.06]">
              <Phone className="h-5 w-5 text-orange-500" />
              <p className="eyebrow !text-orange-600 mt-3 dark:!text-orange-400">Need help now?</p>
              <p className="mono mt-2 text-lg font-bold text-neutral-950 dark:text-white">
                +1 (800) 555-0148
              </p>
              <Link
                href="/help"
                className="mt-3 inline-flex items-center text-sm font-bold text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
              >
                Visit Help Center →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
