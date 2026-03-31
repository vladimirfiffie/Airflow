import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { flightOffers } from "@/lib/mock/flights";

export default function FlightsPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Header */}
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">Overview</p>
            <h1 className="mt-4 text-3xl font-black text-white md:text-5xl">All Flights</h1>
            <p className="mt-3 text-neutral-400">Browse our current flight inventory and find your route.</p>
          </div>
          <Link
            href="/flights/schedule"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Open Schedule
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Flight Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {flightOffers.map((flight) => (
            <div
              key={flight.id}
              className="group rounded-xl border border-neutral-800 bg-neutral-950 p-6 transition hover:border-blue-500/30 hover:bg-neutral-900/80"
            >
              <p className="text-xs font-medium text-neutral-500">{flight.flightNo} &middot; {flight.airline}</p>
              <h2 className="mt-2 text-xl font-black text-white">
                {flight.fromCode}
                <span className="mx-3 text-neutral-600">&rarr;</span>
                {flight.toCode}
              </h2>
              <p className="mt-2 text-sm text-neutral-400">
                {flight.departTime} - {flight.arriveTime} &middot; {flight.duration}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-lg font-black text-blue-500">${flight.priceUsd}</p>
                <p className="text-xs text-neutral-500">{flight.seatsLeft} seats left</p>
              </div>
              <div className="mt-4 flex gap-2">
                <Link
                  href={`/flights/${flight.id}`}
                  className="rounded-lg border border-neutral-700 px-3 py-1.5 text-xs font-medium text-neutral-300 transition hover:border-neutral-500 hover:text-white"
                >
                  Details
                </Link>
                <Link
                  href="/booking"
                  className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-500"
                >
                  Book
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
