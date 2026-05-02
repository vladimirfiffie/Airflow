import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Plane } from "lucide-react";
import { getFlight } from "@/lib/data/flights";

// Static fallbacks when DB doesn't have these fields populated; harmless when
// real values are present.
const gateByFlight: Record<string, string> = {
  AF1001: "A12",
  AF2204: "B4",
  AF3320: "C9",
  AF4892: "D2",
};

const aircraftByFlight: Record<string, string> = {
  AF1001: "A321neo",
  AF2204: "B737-8",
  AF3320: "A220-300",
  AF4892: "B737-9",
};

export default async function FlightDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const flight = await getFlight(id);

  if (!flight) {
    notFound();
  }

  const rows = [
    { label: "Flight", value: flight.flightNo },
    { label: "Operator", value: flight.airline },
    { label: "Departure", value: `${flight.fromCode} · ${flight.departTime}` },
    { label: "Arrival", value: `${flight.toCode} · ${flight.arriveTime}` },
    { label: "Duration", value: flight.duration },
    { label: "Stops", value: flight.stops === 0 ? "Non-stop" : `${flight.stops}` },
    { label: "Gate", value: gateByFlight[flight.flightNo] ?? "TBD" },
    { label: "Aircraft", value: aircraftByFlight[flight.flightNo] ?? "TBD" },
    { label: "Seats left", value: `${flight.seatsLeft}` },
  ];

  return (
    <div>
      {/* Hero header — airline-info-screen feel */}
      <section className="relative overflow-hidden border-b border-neutral-200 dark:border-neutral-900">
        <div className="absolute inset-0 grid-lines opacity-50" aria-hidden />
        <div className="relative mx-auto max-w-5xl px-4 py-16 md:px-8 md:py-24">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 text-sm font-bold text-neutral-600 transition hover:text-orange-500 dark:text-neutral-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to search
          </Link>

          <p className="mono mt-10 text-xs text-neutral-500 dark:text-neutral-400">
            {flight.flightNo} · {flight.airline.toUpperCase()}
          </p>

          <h1 className="display mt-4 text-6xl font-black text-neutral-950 md:text-[120px] dark:text-white">
            <span className="mono">{flight.fromCode}</span>
            <span className="mx-3 text-orange-500 md:mx-6">→</span>
            <span className="mono">{flight.toCode}</span>
          </h1>

          <p className="mono mt-6 text-sm text-neutral-600 dark:text-neutral-400">
            {flight.departTime} → {flight.arriveTime} · {flight.duration} ·{" "}
            {flight.stops === 0 ? "NON-STOP" : `${flight.stops} STOP`}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 md:px-8">
        {/* Price banner */}
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-neutral-950 p-8 text-white md:flex-row md:items-center md:p-10">
          <div>
            <p className="mono text-xs text-neutral-400">FROM</p>
            <p className="display mono mt-1 text-6xl font-black text-orange-500 md:text-7xl">
              ${flight.priceUsd}
            </p>
            <p className="mt-2 mono text-xs text-neutral-400">
              {flight.seatsLeft} SEATS REMAINING
            </p>
          </div>
          <Link
            href={`/booking/${flight.id}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-orange-500 px-8 py-4 text-base font-bold text-white transition hover:bg-orange-600 md:w-auto"
          >
            Book this flight
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {/* Info table */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-900 dark:bg-neutral-950">
          {rows.map((row, i) => (
            <div
              key={row.label}
              className={`flex items-center justify-between px-6 py-5 ${
                i < rows.length - 1
                  ? "border-b border-neutral-200 dark:border-neutral-900"
                  : ""
              }`}
            >
              <span className="mono text-xs text-neutral-500 uppercase tracking-widest dark:text-neutral-400">
                {row.label}
              </span>
              <span className="mono text-sm font-bold text-neutral-950 dark:text-white">
                {row.value}
              </span>
            </div>
          ))}
        </div>

        {/* Policy cards */}
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {[
            { title: "Carry-on", value: "1 personal + 1 cabin bag" },
            { title: "Checked bag", value: "$35 first bag, each way" },
            { title: "Changes", value: "Flexible up to 24h before" },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-900 dark:bg-neutral-950"
            >
              <p className="eyebrow !text-neutral-500 dark:!text-neutral-400">{item.title}</p>
              <p className="mt-3 text-sm font-bold text-neutral-950 dark:text-white">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom actions */}
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-5 py-3 text-sm font-bold text-neutral-900 transition hover:border-neutral-950 dark:border-neutral-800 dark:text-white dark:hover:border-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to search
          </Link>
          <Link
            href={`/booking/${flight.id}`}
            className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            Continue to booking
            <Plane className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
