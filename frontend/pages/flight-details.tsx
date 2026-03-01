import Link from "next/link";

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
      <header className="rounded-3xl border border-slate-200/90 bg-white/85 p-6 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">Flight Details</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Structured flight data for number, times, and route locations.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Back Home
          </Link>
          <Link
            href="/search"
            className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            Search Flights
          </Link>
        </div>
      </header>

      <section className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white/90 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-sm">
            <thead className="bg-slate-100/80 dark:bg-slate-800/70">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-200">Flight Number</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-200">Departure Time</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-200">Arrival Time</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-200">Departure</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-200">Destination</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((flight) => (
                <tr key={flight.flightNumber} className="border-t border-slate-200/80 dark:border-slate-700/70">
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">{flight.flightNumber}</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{flight.departureTime}</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{flight.arrivalTime}</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{flight.departureLocation}</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{flight.destinationLocation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
