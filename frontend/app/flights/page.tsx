import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { flightOffers } from "@/lib/mock/flights";

export default function FlightsPage() {
  return (
    <div>
      {/* Page header */}
      <section className="border-b border-neutral-200 dark:border-neutral-900">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Inventory</p>
              <h1 className="display mt-4 text-5xl font-black text-neutral-950 md:text-7xl dark:text-white">
                All flights.
              </h1>
              <p className="mt-4 max-w-md text-neutral-600 dark:text-neutral-400">
                Browse the live inventory across our network. Tap any route for full details.
              </p>
            </div>
            <Link
              href="/flights/schedule"
              className="inline-flex w-fit items-center gap-2 rounded-md bg-neutral-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-500 dark:bg-white dark:text-neutral-950 dark:hover:bg-orange-500 dark:hover:text-white"
            >
              <CalendarDays className="h-4 w-4" />
              Open schedule
            </Link>
          </div>
        </div>
      </section>

      {/* Flight grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="mb-6 flex items-center justify-between text-sm">
          <p className="mono text-neutral-500 dark:text-neutral-400">
            {flightOffers.length} ROUTES &middot; UPDATED LIVE
          </p>
          <p className="mono text-neutral-500 dark:text-neutral-400">
            <span className="inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-emerald-500" />{" "}
            ALL OPERATIONAL
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-200 md:grid-cols-2 dark:border-neutral-900 dark:bg-neutral-900">
          {flightOffers.map((flight) => (
            <article
              key={flight.id}
              className="group flex flex-col gap-6 bg-white p-8 transition-colors hover:bg-orange-50 dark:bg-black dark:hover:bg-orange-500/[0.04]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="mono text-xs text-neutral-500 dark:text-neutral-400">
                    {flight.flightNo} · {flight.airline.toUpperCase()}
                  </p>
                  <h2 className="display mt-3 text-4xl font-black text-neutral-950 md:text-5xl dark:text-white">
                    <span className="mono">{flight.fromCode}</span>
                    <span className="mx-3 text-orange-500">→</span>
                    <span className="mono">{flight.toCode}</span>
                  </h2>
                  <p className="mt-3 mono text-sm text-neutral-600 dark:text-neutral-400">
                    {flight.departTime} → {flight.arriveTime} · {flight.duration}
                  </p>
                </div>
                <div className="text-right">
                  <p className="mono text-xs text-neutral-500 dark:text-neutral-400">FROM</p>
                  <p className="display mono mt-1 text-3xl font-black text-orange-500">
                    ${flight.priceUsd}
                  </p>
                  <p className="mt-1 mono text-xs text-neutral-500 dark:text-neutral-400">
                    {flight.seatsLeft} SEATS
                  </p>
                </div>
              </div>

              <div className="flex gap-2 border-t border-neutral-200 pt-5 dark:border-neutral-900">
                <Link
                  href={`/flights/${flight.id}`}
                  className="flex-1 rounded-md border border-neutral-300 px-4 py-2.5 text-center text-sm font-bold text-neutral-900 transition hover:border-neutral-950 dark:border-neutral-800 dark:text-white dark:hover:border-white"
                >
                  Details
                </Link>
                <Link
                  href={`/booking/${flight.id}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-orange-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600"
                >
                  Book
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
