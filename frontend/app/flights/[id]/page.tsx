import Link from "next/link";
import { notFound } from "next/navigation";
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
    <div className="space-y-6">
      <header className="rounded-3xl border border-slate-200/90 bg-white/85 p-6 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 dark:text-sky-300">Flight Details</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
          {flight.fromCode} {"->"} {flight.toCode}
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          All key trip information for flight {flight.flightNo} before checkout.
        </p>
      </header>

      <section className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white/90 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
        <table className="w-full border-collapse text-sm">
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-slate-200/80 last:border-b-0 dark:border-slate-700/70">
                <th className="w-56 bg-slate-50 px-4 py-3 text-left font-semibold text-slate-700 dark:bg-slate-800/60 dark:text-slate-200">
                  {row.label}
                </th>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { title: "Carry-on", value: "1 personal item + 1 cabin bag" },
          { title: "Checked Bag", value: "$35 each way (first bag)" },
          { title: "Changes", value: "Flexible fare changes up to 24h before" },
        ].map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-slate-200/90 bg-white/90 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/70"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
              {item.title}
            </p>
            <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-200">{item.value}</p>
          </article>
        ))}
      </section>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/search"
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Back To Results
        </Link>
        <Link
          href="/booking"
          className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
        >
          Continue To Booking
        </Link>
      </div>
    </div>
  );
}
