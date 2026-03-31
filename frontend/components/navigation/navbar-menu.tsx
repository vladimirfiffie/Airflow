"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu as MenuIcon, Plane, X } from "lucide-react";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Menu, MenuItem, HoveredLink } from "@/components/ui/navbar-menu";
import { GooeyInput } from "@/components/ui/gooey-input";
import { ThemeToggle } from "@/components/theme-toggle";

const mobileLinks = [
  { label: "Flights", href: "/flights" },
  { label: "Search", href: "/search" },
  { label: "Schedule", href: "/flights/schedule" },
  { label: "Booking", href: "/booking" },
  { label: "Help", href: "/help" },
];

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2 text-lg font-black tracking-tight">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
        <Plane className="h-4 w-4 text-white" />
      </div>
      <span className="text-neutral-900 dark:text-white">
        Airflow<span className="text-blue-500">.</span>
      </span>
    </Link>
  );
}

export default function NavbarMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = useCallback(
    (value: string) => {
      setSearchValue(value);
      if (value.trim()) {
        router.push(`/search?q=${encodeURIComponent(value.trim())}`);
      }
    },
    [router],
  );

  return (
    <header className="fixed top-0 z-50 w-full px-4 pt-4 md:px-6">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between rounded-2xl border border-neutral-200/80 bg-white/80 px-4 shadow-lg shadow-black/[0.03] backdrop-blur-xl dark:border-neutral-700/80 dark:bg-black/70 dark:shadow-black/20 md:px-5">
        <Brand />

        {/* Desktop nav using aceternity Menu */}
        <div className="hidden md:block">
          <Menu setActive={setActive}>
            <MenuItem setActive={setActive} active={active} item="Flights">
              <div className="flex flex-col space-y-3 text-sm">
                <HoveredLink href="/flights">Browse Flights</HoveredLink>
                <HoveredLink href="/search">Search Flights</HoveredLink>
                <HoveredLink href="/flights/schedule">Flight Schedule</HoveredLink>
              </div>
            </MenuItem>
            <MenuItem setActive={setActive} active={active} item="Booking">
              <div className="flex flex-col space-y-3 text-sm">
                <HoveredLink href="/booking">Book a Flight</HoveredLink>
                <HoveredLink href="/booking">Manage Booking</HoveredLink>
              </div>
            </MenuItem>
            <MenuItem setActive={setActive} active={active} item="Help">
              <div className="flex flex-col space-y-3 text-sm">
                <HoveredLink href="/help">Support Center</HoveredLink>
                <HoveredLink href="/help">FAQs</HoveredLink>
                <HoveredLink href="/help">Contact Us</HoveredLink>
              </div>
            </MenuItem>
          </Menu>
        </div>

        {/* Search + Theme + Auth */}
        <div className="hidden items-center gap-3 md:flex">
          <GooeyInput
            placeholder="Search flights..."
            value={searchValue}
            onValueChange={handleSearch}
            collapsedWidth={110}
            expandedWidth={220}
            expandedOffset={40}
          />
          <ThemeToggle />
          <Link
            href="/login"
            className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          >
            Log in
          </Link>
          <Link
            href="/sign-up"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mx-auto mt-2 max-w-5xl overflow-hidden rounded-2xl border border-neutral-200/80 bg-white/95 shadow-lg backdrop-blur-xl dark:border-neutral-700/80 dark:bg-black/95 md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {mobileLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white",
                    pathname === link.href &&
                      "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white",
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 flex flex-col gap-2">
                <Link
                  href="/login"
                  className="rounded-lg border border-neutral-200 px-3 py-2.5 text-center text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  onClick={() => setMobileOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/sign-up"
                  className="rounded-lg bg-blue-600 px-3 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-500"
                  onClick={() => setMobileOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
