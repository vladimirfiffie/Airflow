"use client";

import { FormEvent, useState } from "react";

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
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200/90 bg-white/85 p-8 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">Manage Booking</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Retrieve your itinerary to change seats, update passenger details, or review trip policies.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border border-slate-200/90 bg-white/90 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Find Your Trip</h2>
          <form className="mt-4 grid gap-3" onSubmit={onSubmit}>
            <label className="space-y-1 text-sm">
              <span className="font-semibold text-slate-700 dark:text-slate-200">Booking Reference</span>
              <input
                value={bookingRef}
                onChange={(event) => setBookingRef(event.target.value.toUpperCase())}
                placeholder="e.g. AF92KL"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none ring-sky-300 focus:ring dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-semibold text-slate-700 dark:text-slate-200">Last Name</span>
              <input
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                placeholder="Passenger surname"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none ring-sky-300 focus:ring dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-semibold text-slate-700 dark:text-slate-200">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none ring-sky-300 focus:ring dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              />
            </label>
            <button
              type="submit"
              className="mt-1 rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              Retrieve Booking
            </button>
          </form>

          {submitted ? (
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200">
              Booking request received for {bookingRef || "your reference"}. Connect this form to backend booking APIs to
              return live itinerary data.
            </div>
          ) : null}
        </section>

        <section className="space-y-4">
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
              title: "Need support now?",
              body: "Call +1 (800) 555-0148 or use live chat from Help Center.",
            },
          ].map((card) => (
            <article
              key={card.title}
              className="rounded-2xl border border-slate-200/90 bg-white/90 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/70"
            >
              <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-slate-600 dark:text-slate-300">
                {card.title}
              </h3>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{card.body}</p>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
