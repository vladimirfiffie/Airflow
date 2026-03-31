"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { flightOffers } from "@/lib/mock/flights";

const airportOptions = Array.from(
  new Set(flightOffers.flatMap((flight) => [flight.fromCode, flight.toCode])),
).sort();

type SortKey = "price" | "depart" | "duration";

function toMinutes(duration: string) {
  const [hoursPart, minsPart] = duration.split(" ");
  const hours = Number(hoursPart.replace("h", ""));
  const mins = Number(minsPart.replace("m", ""));
  return hours * 60 + mins;
}

export default function SearchPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [maxPrice, setMaxPrice] = useState(400);
  const [nonStopOnly, setNonStopOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>("price");

  const results = useMemo(() => {
    const filtered = flightOffers.filter((flight) => {
      if (from && flight.fromCode !== from) return false;
      if (to && flight.toCode !== to) return false;
      if (flight.priceUsd > maxPrice) return false;
      if (nonStopOnly && flight.stops > 0) return false;
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "price") return a.priceUsd - b.priceUsd;
      if (sortBy === "depart") return a.departTime.localeCompare(b.departTime);
      return toMinutes(a.duration) - toMinutes(b.duration);
    });
  }, [from, maxPrice, nonStopOnly, sortBy, to]);

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">Discover</p>
          <h1 className="mt-4 text-3xl font-black text-white md:text-5xl">Search Flights</h1>
          <p className="mt-3 max-w-xl text-neutral-400">
            Filter by route and price, compare options, and book your next trip.
          </p>
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6">
          <div className="grid gap-4 md:grid-cols-5">
            <label className="space-y-2 text-sm">
              <span className="font-medium text-neutral-300">From</span>
              <select
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-white outline-none transition focus:border-blue-500"
              >
                <option value="">Any</option>
                {airportOptions.map((code) => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm">
              <span className="font-medium text-neutral-300">To</span>
              <select
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-white outline-none transition focus:border-blue-500"
              >
                <option value="">Any</option>
                {airportOptions.map((code) => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm">
              <span className="font-medium text-neutral-300">Max Price (${maxPrice})</span>
              <input
                type="range"
                min={100}
                max={500}
                step={10}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="mt-1 w-full accent-blue-500"
              />
            </label>

            <label className="space-y-2 text-sm">
              <span className="font-medium text-neutral-300">Sort By</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-white outline-none transition focus:border-blue-500"
              >
                <option value="price">Lowest Price</option>
                <option value="depart">Departure Time</option>
                <option value="duration">Shortest Duration</option>
              </select>
            </label>

            <label className="flex items-end gap-3 pb-1">
              <input
                type="checkbox"
                checked={nonStopOnly}
                onChange={(e) => setNonStopOnly(e.target.checked)}
                className="h-4 w-4 rounded accent-blue-500"
              />
              <span className="text-sm font-medium text-neutral-300">Non-stop only</span>
            </label>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-neutral-800 pt-4">
            <p className="text-sm text-neutral-500">{results.length} flights found</p>
            <button
              type="button"
              onClick={() => { setFrom(""); setTo(""); setMaxPrice(400); setNonStopOnly(false); setSortBy("price"); }}
              className="text-sm font-medium text-neutral-400 transition hover:text-white"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="mt-6 space-y-4">
          {results.map((flight) => (
            <div
              key={flight.id}
              className="group rounded-xl border border-neutral-800 bg-neutral-950 p-6 transition hover:border-blue-500/30 hover:bg-neutral-900/80"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <p className="text-xs font-medium text-neutral-500">
                    {flight.airline} &middot; {flight.flightNo}
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-white">
                    {flight.fromCode}
                    <span className="mx-3 text-neutral-600">&rarr;</span>
                    {flight.toCode}
                  </h2>
                  <p className="mt-1 text-sm text-neutral-400">
                    {flight.departTime} - {flight.arriveTime} &middot; {flight.duration} &middot;{" "}
                    {flight.stops === 0 ? "Non-stop" : `${flight.stops} stop`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-blue-500">${flight.priceUsd}</p>
                  <p className="mt-1 text-xs text-neutral-500">{flight.seatsLeft} seats left</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
                <Link
                  href={`/flights/${flight.id}`}
                  className="rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-300 transition hover:border-neutral-500 hover:text-white"
                >
                  View Details
                </Link>
                <Link
                  href="/booking"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
                >
                  Book Flight
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}

          {results.length === 0 && (
            <div className="rounded-xl border border-dashed border-neutral-700 p-12 text-center">
              <p className="text-neutral-500">No flights match your filters. Try widening your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
