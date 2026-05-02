"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { CheckCircle, Phone } from "lucide-react";

const inputStyle =
  "w-full rounded-md border border-neutral-300 bg-white px-3 py-2.5 text-sm font-medium text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-orange-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white dark:placeholder-neutral-600";

export default function BookingPage() {
  const [submitted, setSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
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
                  placeholder="AF92KL"
                  className={`${inputStyle} mono uppercase tracking-widest`}
                />
              </label>
              <label className="block space-y-2 text-sm">
                <span className="font-bold text-neutral-700 dark:text-neutral-300">Last name</span>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Passenger surname"
                  className={inputStyle}
                />
              </label>
              <label className="block space-y-2 text-sm">
                <span className="font-bold text-neutral-700 dark:text-neutral-300">Email</span>
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
                className="w-full rounded-md bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
              >
                Retrieve booking
              </button>
            </form>

            {submitted && (
              <div className="mt-5 flex items-start gap-3 rounded-md border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/30">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <p className="text-sm text-emerald-800 dark:text-emerald-300">
                  Booking request received for{" "}
                  <span className="mono font-bold">{bookingRef || "your reference"}</span>. Connect
                  to backend APIs for live itinerary data.
                </p>
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
