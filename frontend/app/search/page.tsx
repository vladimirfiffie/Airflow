"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, SlidersHorizontal } from "lucide-react";
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

const inputStyle =
  "w-full rounded-md border border-neutral-300 bg-white px-3 py-2.5 text-sm font-medium text-neutral-900 outline-none transition focus:border-orange-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white";

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
    <div>
      {/* Header */}
      <section className="border-b border-neutral-200 dark:border-neutral-900">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
          <p className="eyebrow">Discover</p>
          <h1 className="display mt-4 text-5xl font-black text-neutral-950 md:text-7xl dark:text-white">
            Search flights.
          </h1>
          <p className="mt-4 max-w-md text-neutral-600 dark:text-neutral-400">
            Filter by route and price, compare options, book your next trip.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        {/* Filters */}
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-900 dark:bg-neutral-950">
          <div className="mb-5 flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-orange-500" />
            <p className="eyebrow !text-neutral-500 dark:!text-neutral-400">Filters</p>
          </div>

          <div className="grid gap-4 md:grid-cols-5">
            <label className="space-y-2 text-sm">
              <span className="font-bold text-neutral-700 dark:text-neutral-300">From</span>
              <select value={from} onChange={(e) => setFrom(e.target.value)} className={inputStyle}>
                <option value="">Any airport</option>
                {airportOptions.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm">
              <span className="font-bold text-neutral-700 dark:text-neutral-300">To</span>
              <select value={to} onChange={(e) => setTo(e.target.value)} className={inputStyle}>
                <option value="">Any airport</option>
                {airportOptions.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm">
              <span className="font-bold text-neutral-700 dark:text-neutral-300">
                Max price <span className="mono text-orange-500">${maxPrice}</span>
              </span>
              <input
                type="range"
                min={100}
                max={500}
                step={10}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="mt-3 w-full accent-orange-500"
              />
            </label>

            <label className="space-y-2 text-sm">
              <span className="font-bold text-neutral-700 dark:text-neutral-300">Sort by</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                className={inputStyle}
              >
                <option value="price">Lowest price</option>
                <option value="depart">Departure time</option>
                <option value="duration">Shortest duration</option>
              </select>
            </label>

            <label className="flex items-end gap-3 pb-2">
              <input
                type="checkbox"
                checked={nonStopOnly}
                onChange={(e) => setNonStopOnly(e.target.checked)}
                className="h-4 w-4 rounded accent-orange-500"
              />
              <span className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                Non-stop only
              </span>
            </label>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-neutral-200 pt-5 dark:border-neutral-900">
            <p className="mono text-xs text-neutral-500 dark:text-neutral-400">
              {results.length} {results.length === 1 ? "FLIGHT" : "FLIGHTS"} FOUND
            </p>
            <button
              type="button"
              onClick={() => {
                setFrom("");
                setTo("");
                setMaxPrice(400);
                setNonStopOnly(false);
                setSortBy("price");
              }}
              className="text-sm font-bold text-neutral-600 transition hover:text-orange-500 dark:text-neutral-400"
            >
              Reset filters
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="mt-8 space-y-3">
          {results.map((flight) => (
            <article
              key={flight.id}
              className="group flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-6 transition-colors hover:border-orange-500 md:flex-row md:items-center md:justify-between md:gap-8 dark:border-neutral-900 dark:bg-neutral-950 dark:hover:border-orange-500"
            >
              <div className="flex-1">
                <p className="mono text-xs text-neutral-500 dark:text-neutral-400">
                  {flight.airline.toUpperCase()} · {flight.flightNo}
                </p>
                <h2 className="display mt-2 text-3xl font-black text-neutral-950 md:text-4xl dark:text-white">
                  <span className="mono">{flight.fromCode}</span>
                  <span className="mx-3 text-orange-500">→</span>
                  <span className="mono">{flight.toCode}</span>
                </h2>
                <p className="mt-2 mono text-sm text-neutral-600 dark:text-neutral-400">
                  {flight.departTime} → {flight.arriveTime} · {flight.duration} ·{" "}
                  {flight.stops === 0 ? "NON-STOP" : `${flight.stops} STOP`}
                </p>
              </div>

              <div className="flex items-end justify-between gap-6 md:flex-col md:items-end">
                <div className="text-left md:text-right">
                  <p className="mono text-xs text-neutral-500 dark:text-neutral-400">FROM</p>
                  <p className="display mono text-3xl font-black text-orange-500 md:text-4xl">
                    ${flight.priceUsd}
                  </p>
                  <p className="mt-1 mono text-xs text-neutral-500 dark:text-neutral-400">
                    {flight.seatsLeft} SEATS LEFT
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/flights/${flight.id}`}
                    className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-bold text-neutral-900 transition hover:border-neutral-950 dark:border-neutral-800 dark:text-white dark:hover:border-white"
                  >
                    Details
                  </Link>
                  <Link
                    href={`/booking/${flight.id}`}
                    className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-orange-600"
                  >
                    Book
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}

          {results.length === 0 && (
            <div className="rounded-2xl border-2 border-dashed border-neutral-300 p-16 text-center dark:border-neutral-800">
              <p className="display text-3xl font-black text-neutral-950 dark:text-white">
                No flights match.
              </p>
              <p className="mt-3 text-neutral-600 dark:text-neutral-400">
                Try widening your criteria or resetting filters.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
