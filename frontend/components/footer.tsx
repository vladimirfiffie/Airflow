import Link from "next/link";

const productLinks = [
  { label: "Search Flights", href: "/search" },
  { label: "Schedule", href: "/flights/schedule" },
  { label: "Flight Details", href: "/flight-details" },
];

const supportLinks = [
  { label: "Manage Booking", href: "/booking" },
  { label: "Help Center", href: "/help" },
  { label: "Status Updates", href: "/flights" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t border-slate-200/80 bg-white/70 dark:border-slate-700/70 dark:bg-slate-950/65">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-lg font-black text-slate-900 dark:text-slate-100">
              Airflow<span className="text-sky-600">.</span>
            </p>
            <p className="mt-2 max-w-xs text-sm text-slate-600 dark:text-slate-300">
              Modern flight booking and trip management with clear scheduling and passenger support.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Product</p>
            <nav className="mt-3 grid gap-2 text-sm">
              {productLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-slate-700 transition hover:text-sky-700 dark:text-slate-200 dark:hover:text-sky-300"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Support</p>
            <nav className="mt-3 grid gap-2 text-sm">
              {supportLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-slate-700 transition hover:text-sky-700 dark:text-slate-200 dark:hover:text-sky-300"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">Support: +1 (800) 555-0148</p>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200/80 pt-4 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
          © {year} Airflow. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
