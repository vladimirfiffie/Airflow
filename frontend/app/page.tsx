import Link from "next/link";
import { ArrowRight, Globe, Shield, Zap, Clock, Plane, Search } from "lucide-react";
import { flightOffers } from "@/lib/mock/flights";
import AppleCardsCarouselDemo from "@/components/apple-cards-carousel-demo";
import LiveTicker from "@/components/live/live-ticker";
import LiveStats from "@/components/live/live-stats";
import LiveBadge from "@/components/live/live-badge";

export default function HomePage() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-neutral-200 dark:border-neutral-900">
        <div className="absolute inset-0 grid-lines opacity-60" aria-hidden />
        <div className="absolute inset-x-0 top-0 h-[60%] bg-gradient-to-b from-orange-50/40 to-transparent dark:from-orange-500/[0.03]" aria-hidden />

        <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-24 md:px-8 md:pt-28 md:pb-32">
          <LiveBadge />

          <h1 className="display mt-6 text-[15vw] font-black leading-[0.9] tracking-tight text-neutral-950 md:text-[140px] dark:text-white">
            Fly
            <span className="text-orange-500">.</span>
            <br />
            <span className="text-neutral-400 dark:text-neutral-600">Smarter.</span>
          </h1>

          <p className="mt-8 max-w-xl text-lg text-neutral-600 md:text-xl dark:text-neutral-300">
            Real-time schedules, transparent pricing, and effortless booking across 130+ routes.
            One platform from search to gate.
          </p>

          {/* Search bar */}
          <form
            action="/search"
            className="mt-10 flex max-w-2xl items-center gap-2 rounded-xl border-2 border-neutral-950 bg-white p-2 shadow-[6px_6px_0_0_#f97316] transition-shadow hover:shadow-[8px_8px_0_0_#f97316] dark:border-white dark:bg-neutral-950"
          >
            <Search className="ml-3 h-5 w-5 shrink-0 text-neutral-500 dark:text-neutral-400" />
            <input
              name="q"
              type="text"
              placeholder="From JFK to anywhere..."
              className="flex-1 bg-transparent px-2 py-2 text-base font-medium text-neutral-900 placeholder-neutral-400 outline-none dark:text-white dark:placeholder-neutral-500"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-orange-600"
            >
              Search
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs">
            <span className="mono text-neutral-500 dark:text-neutral-400">POPULAR:</span>
            {["JFK → LAX", "ORD → SEA", "MIA → BOS", "DFW → PHX"].map((route) => (
              <Link
                key={route}
                href="/search"
                className="mono rounded border border-neutral-200 px-2 py-1 font-semibold text-neutral-700 transition hover:border-orange-500 hover:text-orange-500 dark:border-neutral-800 dark:text-neutral-300"
              >
                {route}
              </Link>
            ))}
          </div>
        </div>

        {/* Live ticker — pulls /api/stats every 5s */}
        <LiveTicker />
      </section>

      {/* LIVE STATS */}
      <LiveStats />

      {/* BENTO FEATURES */}
      <section className="border-b border-neutral-200 dark:border-neutral-900">
        <div className="mx-auto max-w-7xl px-4 py-24 md:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow">Why Airflow</p>
              <h2 className="display mt-4 text-4xl font-black text-neutral-950 md:text-6xl dark:text-white">
                One platform. <br />
                <span className="text-orange-500">Every step.</span>
              </h2>
            </div>
            <p className="max-w-md text-neutral-600 dark:text-neutral-400">
              From the first search to boarding pass, every detail handled with precision.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-3 md:grid-cols-4 md:grid-rows-2">
            {/* Big feature */}
            <div className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 p-8 md:col-span-2 md:row-span-2 md:p-10 dark:border-neutral-900 dark:bg-neutral-950">
              <div className="absolute inset-0 grid-lines opacity-50" aria-hidden />
              <div className="relative flex h-full flex-col">
                <Search className="h-8 w-8 text-orange-500" />
                <h3 className="display mt-6 text-3xl font-black text-neutral-950 md:text-4xl dark:text-white">
                  Smart search across 130+ routes.
                </h3>
                <p className="mt-4 max-w-md text-neutral-600 dark:text-neutral-400">
                  Filter by route, price, and stops. Compare options side-by-side with real-time
                  availability — no hidden fees, no padding.
                </p>
                <Link
                  href="/search"
                  className="mt-auto inline-flex w-fit items-center gap-2 pt-10 text-sm font-bold text-neutral-950 transition group-hover:gap-3 group-hover:text-orange-500 dark:text-white"
                >
                  Try smart search
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <FeatureCell icon={Globe} title="Global Coverage" body="130+ routes across major airports, coast-to-coast and beyond." />
            <FeatureCell icon={Zap} title="Instant Booking" body="Streamlined checkout. Confirmed in seconds, not minutes." />
            <FeatureCell icon={Shield} title="Flexible Changes" body="Change or cancel with ease. Fare options for any plan." />
            <FeatureCell icon={Clock} title="Live Tracking" body="Gate info, delays, and boarding status in real time." />
          </div>
        </div>
      </section>

      {/* DESTINATIONS — keep carousel, restyled wrapper */}
      <section className="border-b border-neutral-200 bg-white dark:border-neutral-900 dark:bg-black">
        <AppleCardsCarouselDemo />
      </section>

      {/* POPULAR FLIGHTS */}
      <section className="border-b border-neutral-200 dark:border-neutral-900">
        <div className="mx-auto max-w-7xl px-4 py-24 md:px-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="eyebrow">Trending now</p>
              <h2 className="display mt-4 text-4xl font-black text-neutral-950 md:text-6xl dark:text-white">
                Popular flights.
              </h2>
            </div>
            <Link
              href="/search"
              className="hidden items-center gap-2 text-sm font-bold text-neutral-950 transition hover:text-orange-500 md:flex dark:text-white"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-200 md:grid-cols-2 dark:border-neutral-900 dark:bg-neutral-900">
            {flightOffers.map((flight) => (
              <Link
                key={flight.id}
                href={`/flights/${flight.id}`}
                className="group flex flex-col gap-6 bg-white p-8 transition-colors hover:bg-orange-50 dark:bg-black dark:hover:bg-orange-500/[0.04]"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="mono text-xs text-neutral-500 dark:text-neutral-400">
                      {flight.flightNo} &middot; {flight.airline.toUpperCase()}
                    </p>
                    <p className="display mt-3 text-5xl font-black text-neutral-950 dark:text-white">
                      <span className="mono">{flight.fromCode}</span>
                      <span className="mx-3 text-orange-500">→</span>
                      <span className="mono">{flight.toCode}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="mono text-xs text-neutral-500 dark:text-neutral-400">FROM</p>
                    <p className="display mono mt-1 text-3xl font-black text-orange-500">
                      ${flight.priceUsd}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <p className="mono text-neutral-600 dark:text-neutral-400">
                    {flight.departTime} → {flight.arriveTime} &middot; {flight.duration}
                    {flight.stops === 0 ? " · NON-STOP" : ` · ${flight.stops} STOP`}
                  </p>
                  <p className="mono text-xs text-neutral-500 dark:text-neutral-400">
                    {flight.seatsLeft} SEATS
                  </p>
                </div>

                <div className="flex items-center gap-2 border-t border-neutral-200 pt-5 text-sm font-bold text-neutral-950 transition group-hover:gap-3 group-hover:text-orange-500 dark:border-neutral-900 dark:text-white">
                  View details
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-32">
          <div className="relative overflow-hidden rounded-3xl bg-neutral-950 px-8 py-20 text-center md:px-16 md:py-28 dark:bg-neutral-950">
            <div className="absolute inset-0 grid-lines opacity-30" aria-hidden />
            <div className="pointer-events-none absolute -top-20 left-1/2 h-64 w-[60%] -translate-x-1/2 rounded-full bg-orange-500/30 blur-3xl" />
            <div className="relative">
              <Plane className="mx-auto h-10 w-10 text-orange-500" />
              <h2 className="display mt-8 text-5xl font-black tracking-tight text-white md:text-7xl">
                Ready to <span className="text-orange-500">take off</span>?
              </h2>
              <p className="mx-auto mt-6 max-w-lg text-neutral-300">
                Join thousands of travelers who book smarter with Airflow.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/search"
                  className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
                >
                  Search Flights
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/sign-up"
                  className="rounded-lg border border-neutral-700 px-6 py-3 text-sm font-bold text-white transition hover:border-white"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCell({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Globe;
  title: string;
  body: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 transition-colors hover:border-orange-500 dark:border-neutral-900 dark:bg-neutral-950 dark:hover:border-orange-500">
      <Icon className="h-6 w-6 text-orange-500" />
      <h3 className="mt-5 text-lg font-bold text-neutral-950 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{body}</p>
    </div>
  );
}
