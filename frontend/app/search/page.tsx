"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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
    <div className="space-y-6">
      <header className="rounded-3xl border border-slate-200/90 bg-white/85 p-6 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">Search Flights</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Filter by route and price, then open full flight details before booking.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200/90 bg-white/90 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
        <div className="grid gap-4 md:grid-cols-5">
          <label className="space-y-1 text-sm">
            <span className="font-semibold text-slate-700 dark:text-slate-200">From</span>
            <select
              value={from}
              onChange={(event) => setFrom(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none ring-sky-300 focus:ring dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="">Any</option>
              {airportOptions.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-semibold text-slate-700 dark:text-slate-200">To</span>
            <select
              value={to}
              onChange={(event) => setTo(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none ring-sky-300 focus:ring dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="">Any</option>
              {airportOptions.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-semibold text-slate-700 dark:text-slate-200">Max Price (${maxPrice})</span>
            <input
              type="range"
              min={100}
              max={500}
              step={10}
              value={maxPrice}
              onChange={(event) => setMaxPrice(Number(event.target.value))}
              className="w-full accent-sky-600"
            />
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-semibold text-slate-700 dark:text-slate-200">Sort By</span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as SortKey)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none ring-sky-300 focus:ring dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="price">Lowest Price</option>
              <option value="depart">Departure Time</option>
              <option value="duration">Shortest Duration</option>
            </select>
          </label>

          <label className="flex items-center justify-between rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600">
            <span className="font-semibold text-slate-700 dark:text-slate-200">Non-stop only</span>
            <input
              type="checkbox"
              checked={nonStopOnly}
              onChange={(event) => setNonStopOnly(event.target.checked)}
              className="h-4 w-4 accent-sky-600"
            />
          </label>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm text-slate-600 dark:text-slate-300">{results.length} flights available</p>
          <button
            type="button"
            onClick={() => {
              setFrom("");
              setTo("");
              setMaxPrice(400);
              setNonStopOnly(false);
              setSortBy("price");
            }}
            className="rounded-full border border-slate-300 px-3 py-1 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Reset Filters
          </button>
        </div>
      </section>

      <section className="grid gap-4">
        {results.map((flight) => (
          <article
            key={flight.id}
            className="rounded-2xl border border-slate-200/90 bg-white/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-lg hover:shadow-sky-100 dark:border-slate-700 dark:bg-slate-900/70 dark:hover:border-sky-500/45 dark:hover:shadow-sky-950/30"
          >
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  {flight.airline} · {flight.flightNo}
                </p>
                <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                  {flight.fromCode} {"->"} {flight.toCode}
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {flight.departTime} - {flight.arriveTime} · {flight.duration} ·{" "}
                  {flight.stops === 0 ? "Non-stop" : `${flight.stops} stop`}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">From</p>
                <p className="text-3xl font-black text-sky-700 dark:text-sky-300">${flight.priceUsd}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{flight.seatsLeft} seats left</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
              <Link
                href={`/flights/${flight.id}`}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                View Details
              </Link>
              <Link
                href="/booking"
                className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
              >
                Book Flight
              </Link>
            </div>
          </article>
        ))}

        {results.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-slate-600 dark:border-slate-600 dark:text-slate-300">
            No flights match your filters. Try widening your criteria.
          </div>
        ) : null}
      </section>
    </div>
  );
}
