import Link from "next/link";
import { ArrowRight, PlaneTakeoff } from "lucide-react";

const quickActions = [
  { title: "Search Flights", href: "/search", description: "Compare prices and seats." },
  { title: "Open Schedule", href: "/flights/schedule", description: "Track weekly departures." },
  { title: "Manage Booking", href: "/booking", description: "Edit traveler details quickly." },
];

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
          <PlaneTakeoff className="h-3.5 w-3.5" />
          Airport Operations Dashboard
        </div>
        <h1 className="max-w-3xl text-3xl font-black tracking-tight text-slate-900 md:text-5xl">
          Production-ready frontend foundation for flights and scheduling.
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Navigation and routing are centralized with Next.js App Router so backend integration can plug in without
          rewriting UI structure.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <h2 className="text-lg font-semibold text-slate-900">{action.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{action.description}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-sky-700">
              Open
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}
