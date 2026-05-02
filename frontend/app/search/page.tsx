import { listFlights } from "@/lib/data/flights";
import SearchClient from "@/components/search/search-client";

export default async function SearchPage() {
  const flights = await listFlights();

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
        <SearchClient flights={flights} />
      </section>
    </div>
  );
}
