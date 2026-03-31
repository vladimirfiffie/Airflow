import Link from "next/link";
import { Plane } from "lucide-react";

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
    <footer className="border-t border-neutral-800/80 bg-black">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 text-lg font-black">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <Plane className="h-4 w-4 text-white" />
              </div>
              Airflow<span className="text-blue-500">.</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-neutral-500">
              Next-generation flight booking with seamless scheduling, real-time tracking, and effortless management.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Product</p>
            <nav className="mt-4 flex flex-col gap-2.5">
              {productLinks.map((item) => (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  className="text-sm text-neutral-400 transition hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Support</p>
            <nav className="mt-4 flex flex-col gap-2.5">
              {supportLinks.map((item) => (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  className="text-sm text-neutral-400 transition hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Legal</p>
            <nav className="mt-4 flex flex-col gap-2.5">
              {legalLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm text-neutral-400 transition hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-neutral-800/80 pt-8 md:flex-row">
          <p className="text-xs text-neutral-600">&copy; {year} Airflow. All rights reserved.</p>
          <p className="text-xs text-neutral-600">Built with Next.js &amp; Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
}
