"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu as MenuIcon, Plane } from "lucide-react";
import { useState } from "react";
import { Menu, MenuItem } from "@/components/ui/navbar-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { navGroups } from "@/lib/navigation";
import { cn } from "@/lib/utils";

function Brand() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-black tracking-tight text-slate-900 transition hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800"
    >
      <Plane className="h-4 w-4 text-sky-600 dark:text-sky-400" />
      <span>
        Airflow<span className="text-sky-600">.</span>
      </span>
    </Link>
  );
}

export default function NavbarMenu() {
  const pathname = usePathname();
  const [active, setActive] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/70 backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-950/65">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 md:px-6">
        <div className="hidden w-full md:block">
          <Menu setActive={setActive}>
            <div className="flex w-44 shrink-0 items-center">
              <Brand />
            </div>
            <div className="flex flex-1 items-center justify-center gap-1">
              {navGroups.map((group) => {
                if (group.href) {
                  return (
                    <Link
                      key={group.label}
                      href={group.href}
                      className={cn(
                        "rounded-full px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white",
                        pathname === group.href &&
                        "bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
                      )}
                    >
                      {group.label}
                    </Link>
                  );
                }

                return (
                  <MenuItem
                    key={group.label}
                    setActive={(item) => setActive(item)}
                    active={active}
                    item={group.label}
                  >
                    <div className="flex min-w-48 flex-col gap-2">
                      {group.links?.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={cn(
                            "rounded-md px-2 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
                            pathname === link.href &&
                            "bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
                          )}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </MenuItem>
                );
              })}
            </div>
            <div className="flex w-44 shrink-0 items-center justify-end gap-1.5">
              <ThemeToggle />
              <Link
                href="/booking"
                className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
              >
                Book Now
              </Link>
            </div>
          </Menu>
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <Brand />
          <ThemeToggle />
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
        >
          <MenuIcon className="h-5 w-5" />
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-slate-200 bg-white/95 px-4 py-4 dark:border-slate-700 dark:bg-slate-900/95 md:hidden">
          <div className="flex flex-col gap-1">
            {navGroups.flatMap((group) =>
              group.href
                ? [{ label: group.label, href: group.href }]
                : (group.links ?? []),
            ).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800",
                  pathname === item.href &&
                  "bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
                )}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2">
              <ThemeToggle />
            </div>
            <Link
              href="/booking"
              className="mt-2 rounded-lg bg-sky-600 px-3 py-2 text-center text-sm font-semibold text-white transition hover:bg-sky-700"
              onClick={() => setMobileOpen(false)}
            >
              Book Now
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
