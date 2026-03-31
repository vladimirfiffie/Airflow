import Link from "next/link";
import { ArrowRight, Globe, Shield, Zap, Clock, Plane, Search } from "lucide-react";
import { flightOffers } from "@/lib/mock/flights";
import HeroParallaxDemo from "@/components/hero-parallax-demo";
import AppleCardsCarouselDemo from "@/components/apple-cards-carousel-demo";

const stats = [
  { value: "92%", label: "On-time Rate" },
  { value: "130+", label: "Global Routes" },
  { value: "3 min", label: "Avg Response" },
  { value: "24/7", label: "Live Support" },
];

const features = [
  {
    icon: Search,
    title: "Smart Search",
    description: "Filter by route, price, and stops. Compare options side-by-side with real-time availability.",
  },
  {
    icon: Globe,
    title: "Global Coverage",
    description: "Access 130+ routes across major airports. From coast-to-coast to international destinations.",
  },
  {
    icon: Zap,
    title: "Instant Booking",
    description: "Book in seconds with streamlined checkout. No hidden fees, no surprises.",
  },
  {
    icon: Shield,
    title: "Flexible Changes",
    description: "Change or cancel with ease. Flexible fare options for stress-free travel.",
  },
  {
    icon: Clock,
    title: "Real-time Updates",
    description: "Live schedule tracking with gate info, delays, and boarding status at your fingertips.",
  },
  {
    icon: Plane,
    title: "Trip Management",
    description: "Manage all bookings in one place. Update details, check policies, track flights.",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Parallax */}
      <HeroParallaxDemo />

      {/* Stats Section */}
      <section className="relative border-t border-neutral-800/80">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-black gradient-text md:text-5xl">{stat.value}</p>
                <p className="mt-2 text-sm text-neutral-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative border-t border-neutral-800/80 dot-grid">
        <div className="mx-auto max-w-7xl px-4 py-24 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">Everything you need</p>
            <h2 className="mt-4 text-3xl font-black text-white md:text-5xl">
              One platform for your <span className="gradient-text">entire journey</span>
            </h2>
            <p className="mt-4 text-neutral-400">
              From search to boarding, Airflow handles every step with precision and style.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-neutral-800 bg-neutral-950 p-6 transition hover:border-neutral-700 hover:bg-neutral-900/80"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/10 text-blue-500">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm text-neutral-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Carousel */}
      <section className="border-t border-neutral-800/80">
        <AppleCardsCarouselDemo />
      </section>

      {/* Popular Flights */}
      <section className="border-t border-neutral-800/80">
        <div className="mx-auto max-w-7xl px-4 py-24 md:px-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">Trending</p>
              <h2 className="mt-4 text-3xl font-black text-white md:text-4xl">Popular Flights</h2>
            </div>
            <Link
              href="/search"
              className="hidden items-center gap-2 text-sm font-medium text-neutral-400 transition hover:text-white md:flex"
            >
              View all flights
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {flightOffers.map((flight) => (
              <Link
                key={flight.id}
                href={`/flights/${flight.id}`}
                className="group rounded-xl border border-neutral-800 bg-neutral-950 p-6 transition hover:border-blue-500/30 hover:bg-neutral-900/80"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-neutral-500">
                      {flight.flightNo} &middot; {flight.airline}
                    </p>
                    <p className="mt-2 text-2xl font-black text-white">
                      {flight.fromCode}
                      <span className="mx-3 text-neutral-600">&rarr;</span>
                      {flight.toCode}
                    </p>
                    <p className="mt-1 text-sm text-neutral-400">
                      {flight.departTime} - {flight.arriveTime} &middot; {flight.duration}
                      {flight.stops === 0 ? " &middot; Non-stop" : ` &middot; ${flight.stops} stop`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-blue-500">${flight.priceUsd}</p>
                    <p className="mt-1 text-xs text-neutral-500">{flight.seatsLeft} seats left</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs font-medium text-neutral-500 transition group-hover:text-blue-400">
                  View details
                  <ArrowRight className="h-3 w-3 transition group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-neutral-800/80">
        <div className="mx-auto max-w-7xl px-4 py-24 md:px-6">
          <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 p-12 text-center md:p-20">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.15),transparent_50%)]" />
            <div className="relative">
              <h2 className="text-3xl font-black text-white md:text-5xl">
                Ready to <span className="gradient-text">take off</span>?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-neutral-400">
                Join thousands of travelers who book smarter with Airflow. Find the best routes, prices, and schedules.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/search"
                  className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
                >
                  Search Flights
                </Link>
                <Link
                  href="/sign-up"
                  className="rounded-lg border border-neutral-700 px-6 py-3 text-sm font-semibold text-neutral-300 transition hover:border-neutral-500 hover:text-white"
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
