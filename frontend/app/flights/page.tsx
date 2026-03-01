import Link from "next/link";
import { flightOffers } from "@/lib/mock/flights";

export default function FlightsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200/90 bg-white/85 p-6 shadow-sm backdrop-blur md:flex-row md:items-end dark:border-slate-700 dark:bg-slate-900/70">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">Flights Overview</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Operational snapshot from mock inventory.</p>
        </div>
        <Link
          href="/flights/schedule"
          className="inline-flex rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
        >
          Open Schedule
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {flightOffers.map((flight) => (
          <div
            key={flight.id}
            className="rounded-2xl border border-slate-200/90 bg-white/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/70 dark:hover:border-sky-500/40"
          >
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{flight.flightNo}</p>
            <h2 className="mt-1 text-xl font-black text-slate-900 dark:text-slate-100">
              {flight.fromCode} {"->"} {flight.toCode}
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {flight.departTime} - {flight.arriveTime} ({flight.duration})
            </p>
            <p className="mt-3 text-sm text-slate-700 dark:text-slate-200">
              ${flight.priceUsd} base fare · {flight.seatsLeft} seats left.
            </p>
            <div className="mt-4 flex gap-2">
              <Link
                href={`/flights/${flight.id}`}
                className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                View Details
              </Link>
              <Link
                href="/booking"
                className="rounded-full bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-sky-700"
              >
                Book
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
