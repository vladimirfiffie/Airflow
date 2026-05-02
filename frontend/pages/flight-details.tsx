import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const flights = [
  {
    flightNumber: "AF-231",
    departureTime: "07:35",
    arrivalTime: "10:50",
    departureLocation: "Chicago (ORD)",
    destinationLocation: "New York (JFK)",
  },
  {
    flightNumber: "AF-774",
    departureTime: "11:20",
    arrivalTime: "14:05",
    departureLocation: "Dallas (DFW)",
    destinationLocation: "San Francisco (SFO)",
  },
  {
    flightNumber: "AF-912",
    departureTime: "17:10",
    arrivalTime: "19:40",
    departureLocation: "Seattle (SEA)",
    destinationLocation: "Los Angeles (LAX)",
  },
];

export default function FlightDetailsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-16 md:px-8 md:py-24">
      <div>
        <p className="eyebrow">Routes</p>
        <h1 className="display mt-4 text-5xl font-black text-neutral-950 md:text-7xl dark:text-white">
          Flight details.
        </h1>
        <p className="mt-4 max-w-md text-neutral-600 dark:text-neutral-400">
          Structured flight data with routes, times, and locations.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-5 py-3 text-sm font-bold text-neutral-900 transition hover:border-neutral-950 dark:border-neutral-800 dark:text-white dark:hover:border-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back home
          </Link>
          <Link
            href="/search"
            className="rounded-md bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            Search flights
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-900 dark:bg-neutral-950">
        <div className="overflow-x-auto">
          <table className="mono w-full min-w-[700px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-900">
                {["Flight", "Departure", "Arrival", "From", "To"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {flights.map((flight) => (
                <tr
                  key={flight.flightNumber}
                  className="border-t border-neutral-200 transition hover:bg-orange-50 dark:border-neutral-900 dark:hover:bg-orange-500/[0.04]"
                >
                  <td className="px-5 py-5 font-bold text-orange-500">{flight.flightNumber}</td>
                  <td className="px-5 py-5 text-neutral-700 dark:text-neutral-300">
                    {flight.departureTime}
                  </td>
                  <td className="px-5 py-5 text-neutral-700 dark:text-neutral-300">
                    {flight.arrivalTime}
                  </td>
                  <td className="px-5 py-5 text-neutral-700 dark:text-neutral-300">
                    {flight.departureLocation}
                  </td>
                  <td className="px-5 py-5 text-neutral-700 dark:text-neutral-300">
                    {flight.destinationLocation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
