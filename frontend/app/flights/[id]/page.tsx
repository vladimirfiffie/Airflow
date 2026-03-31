import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { flightOffers } from "@/lib/mock/flights";

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
  const flight = flightOffers.find((item) => item.id === id);

  if (!flight) {
    notFound();
  }

  const rows = [
    { label: "Flight Number", value: flight.flightNo },
    { label: "Airline", value: flight.airline },
    { label: "Departure", value: `${flight.fromCode} at ${flight.departTime}` },
    { label: "Arrival", value: `${flight.toCode} at ${flight.arriveTime}` },
    { label: "Duration", value: flight.duration },
    { label: "Stops", value: flight.stops === 0 ? "Non-stop" : `${flight.stops}` },
    { label: "Gate", value: gateByFlight[flight.flightNo] ?? "TBD" },
    { label: "Aircraft", value: aircraftByFlight[flight.flightNo] ?? "TBD" },
    { label: "Seats Left", value: `${flight.seatsLeft}` },
  ];

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">Flight Details</p>
          <h1 className="mt-4 text-3xl font-black text-white md:text-5xl">
            {flight.fromCode}
            <span className="mx-4 text-neutral-600">&rarr;</span>
            {flight.toCode}
          </h1>
          <p className="mt-3 text-neutral-400">
            Flight {flight.flightNo} &middot; {flight.airline}
          </p>
        </div>

        {/* Price Banner */}
        <div className="mb-6 flex items-center justify-between rounded-xl border border-blue-500/20 bg-blue-500/5 p-6">
          <div>
            <p className="text-sm text-neutral-400">Starting from</p>
            <p className="text-4xl font-black text-blue-500">${flight.priceUsd}</p>
          </div>
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Book This Flight
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Flight Info Table */}
        <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950">
          {rows.map((row, i) => (
            <div
              key={row.label}
              className={`flex items-center justify-between px-6 py-4 ${
                i < rows.length - 1 ? "border-b border-neutral-800" : ""
              }`}
            >
              <span className="text-sm font-medium text-neutral-500">{row.label}</span>
              <span className="text-sm font-semibold text-white">{row.value}</span>
            </div>
          ))}
        </div>

        {/* Policy Cards */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { title: "Carry-on", value: "1 personal item + 1 cabin bag" },
            { title: "Checked Bag", value: "$35 each way (first bag)" },
            { title: "Changes", value: "Flexible changes up to 24h before" },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-neutral-800 bg-neutral-950 p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                {item.title}
              </p>
              <p className="mt-2 text-sm text-neutral-300">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-700 px-4 py-2.5 text-sm font-medium text-neutral-300 transition hover:border-neutral-500 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Search
          </Link>
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Continue to Booking
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
