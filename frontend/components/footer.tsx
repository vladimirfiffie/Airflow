import Link from "next/link";

const productLinks = [
  { label: "Search Flights", href: "/search" },
  { label: "Flights Overview", href: "/flights" },
  { label: "Schedule", href: "/flights/schedule" },
];

const supportLinks = [
  { label: "Manage Booking", href: "/booking" },
  { label: "Help Center", href: "/help" },
  { label: "Contact Support", href: "/help" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Cookie Policy", href: "#" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 bg-white dark:border-neutral-900 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        {/* Massive wordmark */}
        <div className="border-b border-neutral-200 pb-12 dark:border-neutral-900">
          <p className="display text-[18vw] font-black leading-none tracking-tight text-neutral-950 md:text-[160px] dark:text-white">
            Airflow<span className="text-orange-500">.</span>
          </p>
          <p className="mt-6 max-w-md text-sm text-neutral-500 dark:text-neutral-400">
            Next-generation flight booking with seamless scheduling, real-time tracking, and effortless management.
          </p>
        </div>

        <div className="grid gap-10 pt-12 md:grid-cols-4">
          <div>
            <p className="eyebrow">Direct</p>
            <p className="mt-4 mono text-sm text-neutral-700 dark:text-neutral-300">
              +1 (800) 555-0148
            </p>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              support@airflow.example
            </p>
          </div>

          <div>
            <p className="eyebrow">Product</p>
            <nav className="mt-4 flex flex-col gap-2.5">
              {productLinks.map((item) => (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  className="text-sm text-neutral-700 transition hover:text-orange-500 dark:text-neutral-300 dark:hover:text-orange-400"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="eyebrow">Support</p>
            <nav className="mt-4 flex flex-col gap-2.5">
              {supportLinks.map((item) => (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  className="text-sm text-neutral-700 transition hover:text-orange-500 dark:text-neutral-300 dark:hover:text-orange-400"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="eyebrow">Legal</p>
            <nav className="mt-4 flex flex-col gap-2.5">
              {legalLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm text-neutral-700 transition hover:text-orange-500 dark:text-neutral-300 dark:hover:text-orange-400"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-3 border-t border-neutral-200 pt-8 md:flex-row md:items-center dark:border-neutral-900">
          <p className="mono text-xs text-neutral-500 dark:text-neutral-500">
            &copy; {year} AIRFLOW &middot; ALL RIGHTS RESERVED
          </p>
          <p className="mono text-xs text-neutral-500 dark:text-neutral-500">
            STATUS: ALL SYSTEMS OPERATIONAL
            <span className="ml-2 inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-emerald-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
