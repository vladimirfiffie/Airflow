"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { id: "passengers", label: "Passengers", path: "" },
  { id: "seats", label: "Seats", path: "/seats" },
  { id: "payment", label: "Payment", path: "/payment" },
  { id: "confirmation", label: "Confirmation", path: "/confirmation" },
] as const;

export default function BookingStepper({ flightId }: { flightId: string }) {
  const pathname = usePathname() ?? "";
  const base = `/booking/${flightId}`;

  const currentIndex = (() => {
    if (pathname.endsWith("/confirmation")) return 3;
    if (pathname.endsWith("/payment")) return 2;
    if (pathname.endsWith("/seats")) return 1;
    return 0;
  })();

  return (
    <nav aria-label="Booking progress" className="border-b border-neutral-200 dark:border-neutral-900">
      <ol className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-5 md:px-8 md:gap-3">
        {steps.map((step, i) => {
          const done = i < currentIndex;
          const current = i === currentIndex;
          const reachable = i <= currentIndex && currentIndex < 3;
          const href = `${base}${step.path}`;

          const inner = (
            <span
              className={cn(
                "flex shrink-0 items-center gap-3 rounded-full border px-3 py-1.5 transition-colors",
                current
                  ? "border-orange-500 bg-orange-500/10"
                  : done
                    ? "border-neutral-300 dark:border-neutral-700"
                    : "border-neutral-200 dark:border-neutral-900",
              )}
            >
              <span
                className={cn(
                  "mono flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold",
                  current
                    ? "bg-orange-500 text-white"
                    : done
                      ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950"
                      : "bg-neutral-200 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-500",
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span
                className={cn(
                  "text-sm font-bold",
                  current
                    ? "text-orange-600 dark:text-orange-400"
                    : done
                      ? "text-neutral-950 dark:text-white"
                      : "text-neutral-500",
                )}
              >
                {step.label}
              </span>
            </span>
          );

          return (
            <li key={step.id} className="flex shrink-0 items-center gap-2">
              {reachable && !current ? (
                <Link href={href} className="hover:opacity-80">
                  {inner}
                </Link>
              ) : (
                inner
              )}
              {i < steps.length - 1 && (
                <span
                  className={cn(
                    "h-px w-6 md:w-10",
                    done ? "bg-neutral-400 dark:bg-neutral-600" : "bg-neutral-200 dark:bg-neutral-900",
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
