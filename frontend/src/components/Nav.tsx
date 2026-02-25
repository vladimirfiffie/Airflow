"use client";
import { useState } from "react";
import { Link } from "react-router-dom"; // react-router links
import { HoveredLink, Menu, MenuItem } from "@/components/ui/navbar-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

// Navbar component
export default function Nav() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="fixed top-14 inset-x-0 z-40 flex justify-center px-4 pt-3">
      <div className="w-full max-w-3xl flex items-center justify-between gap-4 px-5 py-2.5 rounded-2xl bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        {/* Logo */}
        <Link
          to="/"
          className="shrink-0 font-black text-lg tracking-tight text-foreground select-none"
        >
          Airflow<span className="text-primary">.</span>
        </Link>

        {/* Center menu */}
        <Menu setActive={setActive}>
          <MenuItem setActive={setActive} active={active} item="Flights">
            <div className="flex flex-col gap-2 text-sm min-w-[160px]">
              <HoveredLink as={Link} to="/search/nyc-lax">
                Search Flights
              </HoveredLink>
              <HoveredLink as={Link} to="/search/popular">
                Popular Routes
              </HoveredLink>
            </div>
          </MenuItem>

          <MenuItem setActive={setActive} active={active} item="Destinations">
            <div className="flex flex-col gap-2 text-sm min-w-[160px]">
              <HoveredLink as={Link} to="/search/americas">Americas</HoveredLink>
              <HoveredLink as={Link} to="/search/europe">Europe</HoveredLink>
              <HoveredLink as={Link} to="/search/asia">Asia Pacific</HoveredLink>
            </div>
          </MenuItem>

          <MenuItem setActive={setActive} active={active} item="Help">
            <div className="flex flex-col gap-2 text-sm min-w-[160px]">
              <HoveredLink as={Link} to="/help/manage-booking">Manage Booking</HoveredLink>
              <HoveredLink as={Link} to="/help/check-in">Check-in</HoveredLink>
              <HoveredLink as={Link} to="/help/faqs">FAQs</HoveredLink>
            </div>
          </MenuItem>
        </Menu>

        {/* Right side actions */}
        <div className="flex items-center gap-2 shrink-0">
          <ThemeToggle />
          <button className="px-4 py-2 rounded-full bg-primary text-white font-semibold hover:brightness-110 transition">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
