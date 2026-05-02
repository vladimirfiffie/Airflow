"use client";

import { useLiveStats } from "./use-live-stats";
import LiveCounter from "./live-counter";

export default function LiveStats() {
  const { stats } = useLiveStats(5000);

  return (
    <section className="border-b border-neutral-200 dark:border-neutral-900">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex items-center justify-between py-6">
          <p className="mono text-xs text-neutral-500 dark:text-neutral-400">
            <span className="inline-block h-1.5 w-1.5 translate-y-[-1px] animate-pulse rounded-full bg-orange-500" />{" "}
            LIVE OPERATIONS · UPDATED EVERY 5s
          </p>
          <p className="mono text-xs text-neutral-500 dark:text-neutral-400">
            {new Date(stats.serverTime).toLocaleTimeString([], { hour12: false })}
          </p>
        </div>

        <div className="grid grid-cols-2 divide-neutral-200 border-t border-neutral-200 md:grid-cols-5 md:divide-x dark:divide-neutral-900 dark:border-neutral-900">
          <Cell
            label="Flights tracked"
            value={
              <LiveCounter
                value={stats.flightsTracked}
                format={(n) => Math.round(n).toLocaleString()}
              />
            }
          />
          <Cell
            label="On-time rate"
            value={
              <>
                <LiveCounter value={stats.onTimeRate} format={(n) => Math.round(n).toString()} />
                <span className="text-orange-500">%</span>
              </>
            }
          />
          <Cell
            label="Avg delay"
            value={
              <>
                <LiveCounter value={stats.avgDelayMin} format={(n) => Math.round(n).toString()} />
                <span className="text-neutral-400 dark:text-neutral-600">m</span>
              </>
            }
          />
          <Cell
            label="Active gates"
            value={
              <LiveCounter value={stats.activeGates} format={(n) => Math.round(n).toString()} />
            }
            border
          />
          <Cell
            label="Boarding now"
            value={
              <LiveCounter value={stats.boardingNow} format={(n) => Math.round(n).toString()} />
            }
            border
          />
        </div>
      </div>
    </section>
  );
}

function Cell({
  label,
  value,
  border,
}: {
  label: string;
  value: React.ReactNode;
  border?: boolean;
}) {
  return (
    <div
      className={`flex flex-col px-2 py-10 md:px-8 ${
        border ? "border-t border-neutral-200 md:border-t-0 dark:border-neutral-900" : ""
      }`}
    >
      <p className="display text-5xl font-black text-neutral-950 md:text-6xl dark:text-white">
        {value}
      </p>
      <p className="mt-3 mono text-[11px] tracking-widest text-neutral-500 dark:text-neutral-400">
        {label.toUpperCase()}
      </p>
    </div>
  );
}
