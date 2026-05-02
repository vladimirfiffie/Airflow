"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu as MenuIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

const navLinks = [
  { label: "Flights", href: "/flights" },
  { label: "Search", href: "/search" },
  { label: "Schedule", href: "/flights/schedule" },
  { label: "Booking", href: "/booking" },
  { label: "Help", href: "/help" },
];

function Brand() {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2.5 select-none"
      aria-label="Airflow home"
    >
      <span className="display-tight text-[22px] font-black tracking-tight text-neutral-950 dark:text-white">
        Airflow
      </span>
      <span className="h-2 w-2 rounded-full bg-orange-500 transition-transform group-hover:scale-125" />
    </Link>
  );
}

export default function NavbarMenu() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full border-b transition-colors",
          scrolled
            ? "border-neutral-200 bg-white/85 backdrop-blur-md dark:border-neutral-900 dark:bg-black/85"
            : "border-transparent bg-white dark:bg-black",
        )}
      >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-12">
            <Brand />
            <nav className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative rounded-md px-3 py-2 text-[13px] font-semibold tracking-tight transition-colors",
                      active
                        ? "text-neutral-950 dark:text-white"
                        : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white",
                    )}
                  >
                    {link.label}
                    {active && (
                      <span className="absolute -bottom-[17px] left-3 right-3 h-[2px] bg-orange-500" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            <div className="mx-1 h-6 w-px bg-neutral-200 dark:bg-neutral-800" />
            <Link
              href="/login"
              className="text-[13px] font-semibold text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
            >
              Log in
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-md bg-neutral-950 px-4 py-2 text-[13px] font-bold text-white transition-colors hover:bg-orange-500 dark:bg-white dark:text-neutral-950 dark:hover:bg-orange-500 dark:hover:text-white"
            >
              Get Started
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500 transition-colors group-hover:bg-white" />
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-900"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle navigation"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile fullscreen overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 top-16 z-40 flex flex-col bg-white px-6 py-8 md:hidden dark:bg-black">
          <nav className="flex flex-col">
            {navLinks.map((link, i) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center justify-between border-b border-neutral-200 py-5 text-3xl font-black tracking-tight transition-colors dark:border-neutral-900",
                    active
                      ? "text-orange-500"
                      : "text-neutral-950 hover:text-orange-500 dark:text-white",
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="display-tight">{link.label}</span>
                  <span className="mono text-xs text-neutral-400">
                    0{i + 1}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto flex flex-col gap-3">
            <Link
              href="/login"
              className="rounded-md border border-neutral-200 px-4 py-3 text-center text-sm font-bold text-neutral-900 transition hover:border-neutral-400 dark:border-neutral-800 dark:text-white dark:hover:border-neutral-600"
              onClick={() => setMobileOpen(false)}
            >
              Log in
            </Link>
            <Link
              href="/sign-up"
              className="rounded-md bg-orange-500 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-orange-600"
              onClick={() => setMobileOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
