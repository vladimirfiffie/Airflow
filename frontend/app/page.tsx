import Link from "next/link";
import { ArrowRight, Clock3, ShieldCheck, Sparkles, Ticket } from "lucide-react";
import { flightOffers } from "@/lib/mock/flights";

const quickActions = [
  { title: "Search Flights", href: "/search", description: "Compare routes, fares, and seats in seconds." },
  { title: "Open Schedule", href: "/flights/schedule", description: "See departures and arrivals in calendar view." },
  { title: "Manage Booking", href: "/booking", description: "Update traveler details and trip preferences." },
];

const trustStats = [
  { label: "On-time departures", value: "92%" },
  { label: "Average support response", value: "3 min" },
  { label: "Routes available", value: "130+" },
];

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-sky-200/70 bg-white/85 p-8 shadow-lg shadow-sky-200/30 backdrop-blur md:p-10 dark:border-sky-500/25 dark:bg-slate-900/70 dark:shadow-sky-950/40">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(14,165,233,0.14),transparent_40%),radial-gradient(circle_at_85%_100%,rgba(56,189,248,0.14),transparent_45%)]" />
        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 dark:border-sky-400/30 dark:bg-sky-500/10 dark:text-sky-300">
            <Sparkles className="h-3.5 w-3.5" />
            Flight platform
          </div>
          <h1 className="max-w-3xl text-3xl font-black tracking-tight text-slate-900 md:text-5xl dark:text-slate-100">
            Book, manage, and track flights without jumping between tools.
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
            Airflow brings search, schedule visibility, and booking management into one clean journey for passengers.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              Search Flights
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Ticket className="h-4 w-4" />
              Manage Booking
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {trustStats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-2xl border border-slate-200/90 bg-white/90 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/70"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
              {stat.label}
            </p>
            <p className="mt-2 text-3xl font-black text-slate-900 dark:text-slate-100">{stat.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="group rounded-2xl border border-slate-200/90 bg-white/90 p-5 shadow-sm transition hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg hover:shadow-sky-100 dark:border-slate-700 dark:bg-slate-900/70 dark:hover:border-sky-500/40 dark:hover:shadow-sky-950/30"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{action.title}</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{action.description}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-sky-700 dark:text-sky-300">
              Open
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </section>

      <section className="rounded-3xl border border-slate-200/90 bg-white/90 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
        <div className="mb-4 flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-sky-600 dark:text-sky-300" />
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">Popular Flights Right Now</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {flightOffers.map((flight) => (
            <Link
              key={flight.id}
              href={`/flights/${flight.id}`}
              className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-sky-300 hover:bg-sky-50/40 dark:border-slate-700 dark:bg-slate-900/60 dark:hover:border-sky-500/40 dark:hover:bg-sky-500/5"
            >
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                {flight.flightNo} · {flight.airline}
              </p>
              <p className="mt-1 text-xl font-black text-slate-900 dark:text-slate-100">
                {flight.fromCode} {"->"} {flight.toCode}
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {flight.departTime} - {flight.arriveTime} · {flight.duration}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-200/90 bg-white/90 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
          <div className="inline-flex items-center gap-2 text-sky-700 dark:text-sky-300">
            <ShieldCheck className="h-4 w-4" />
            <p className="text-sm font-semibold">Reliable Operations</p>
          </div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Live-ready architecture with route-based pages, reusable components, and clean data boundaries for API
            integration.
          </p>
        </article>
        <article className="rounded-2xl border border-slate-200/90 bg-white/90 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Ready to plan your next trip?</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Start from search, compare options, and move directly into booking with saved filters.
          </p>
          <Link
            href="/search"
            className="mt-4 inline-flex rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            Explore Flights
          </Link>
        </article>
      </section>
    </div>
  );
}
