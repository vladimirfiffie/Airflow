import { flightOffers } from "@/lib/mock/flights";

export default function SearchPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Search Flights</h1>
        <p className="mt-2 text-slate-600">Mock offers now, backend API integration later.</p>
      </header>

      <section className="grid gap-4">
        {flightOffers.map((flight) => (
          <article
            key={flight.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  {flight.airline} · {flight.flightNo}
                </p>
                <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
                  {flight.fromCode} {"->"} {flight.toCode}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {flight.departTime} - {flight.arriveTime} · {flight.duration} ·{" "}
                  {flight.stops === 0 ? "Non-stop" : `${flight.stops} stop`}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-slate-500">From</p>
                <p className="text-3xl font-black text-sky-700">${flight.priceUsd}</p>
                <p className="text-xs text-slate-500">{flight.seatsLeft} seats left</p>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
