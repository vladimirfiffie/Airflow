"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

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
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">Manage</p>
          <h1 className="mt-4 text-3xl font-black text-white md:text-5xl">Manage Booking</h1>
          <p className="mt-3 max-w-xl text-neutral-400">
            Retrieve your itinerary to change seats, update passenger details, or review trip policies.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
          {/* Form */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6">
            <h2 className="text-lg font-bold text-white">Find Your Trip</h2>
            <form className="mt-6 space-y-4" onSubmit={onSubmit}>
              <label className="block space-y-2 text-sm">
                <span className="font-medium text-neutral-300">Booking Reference</span>
                <input
                  value={bookingRef}
                  onChange={(e) => setBookingRef(e.target.value.toUpperCase())}
                  placeholder="e.g. AF92KL"
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-white placeholder-neutral-600 outline-none transition focus:border-blue-500"
                />
              </label>
              <label className="block space-y-2 text-sm">
                <span className="font-medium text-neutral-300">Last Name</span>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Passenger surname"
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-white placeholder-neutral-600 outline-none transition focus:border-blue-500"
                />
              </label>
              <label className="block space-y-2 text-sm">
                <span className="font-medium text-neutral-300">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-white placeholder-neutral-600 outline-none transition focus:border-blue-500"
                />
              </label>
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Retrieve Booking
              </button>
            </form>

            {submitted && (
              <div className="mt-4 flex items-start gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <p className="text-sm text-emerald-400">
                  Booking request received for {bookingRef || "your reference"}. Connect to backend APIs
                  for live itinerary data.
                </p>
              </div>
            )}
          </div>

          {/* Info Cards */}
          <div className="space-y-4">
            {[
              {
                title: "What you can update",
                body: "Passenger names, seats, meal preferences, and contact details.",
              },
              {
                title: "Cancellation policy",
                body: "Refund eligibility depends on fare class and time to departure.",
              },
              {
                title: "Need help now?",
                body: "Call +1 (800) 555-0148 or visit our Help Center for live chat.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-xl border border-neutral-800 bg-neutral-950 p-5"
              >
                <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm text-neutral-300">{card.body}</p>
              </div>
            ))}
            <Link
              href="/help"
              className="block rounded-xl border border-neutral-800 bg-neutral-950 p-5 text-center text-sm font-medium text-blue-500 transition hover:bg-neutral-900"
            >
              Visit Help Center &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
