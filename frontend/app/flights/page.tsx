import Link from "next/link";
import { flightOffers } from "@/lib/mock/flights";

export default function FlightsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Flights Overview</h1>
          <p className="mt-2 text-slate-600">Operational snapshot from mock inventory.</p>
        </div>
        <Link
          href="/flights/schedule"
          className="inline-flex rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
        >
          Open Schedule
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {flightOffers.map((flight) => (
          <div key={flight.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">{flight.flightNo}</p>
            <h2 className="mt-1 text-xl font-black text-slate-900">
              {flight.fromCode} -> {flight.toCode}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {flight.departTime} - {flight.arriveTime} ({flight.duration})
            </p>
            <p className="mt-3 text-sm text-slate-700">
              Status-ready fields: seats, pricing, stop count and times are isolated in `lib/mock/flights.ts`.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
