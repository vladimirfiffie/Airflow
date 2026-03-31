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
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">Routes</p>
        <h1 className="mt-4 text-3xl font-black text-white md:text-5xl">Flight Details</h1>
        <p className="mt-3 text-neutral-400">
          Structured flight data with routes, times, and locations.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-700 px-4 py-2.5 text-sm font-medium text-neutral-300 transition hover:border-neutral-500 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back Home
          </Link>
          <Link
            href="/search"
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Search Flights
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-neutral-800">
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-neutral-500">Flight</th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-neutral-500">Departure</th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-neutral-500">Arrival</th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-neutral-500">From</th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-neutral-500">To</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((flight) => (
                <tr key={flight.flightNumber} className="border-t border-neutral-800/50">
                  <td className="px-5 py-4 font-semibold text-white">{flight.flightNumber}</td>
                  <td className="px-5 py-4 text-neutral-300">{flight.departureTime}</td>
                  <td className="px-5 py-4 text-neutral-300">{flight.arrivalTime}</td>
                  <td className="px-5 py-4 text-neutral-300">{flight.departureLocation}</td>
                  <td className="px-5 py-4 text-neutral-300">{flight.destinationLocation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
