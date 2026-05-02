"use client";

import { useLiveStats } from "./use-live-stats";

export default function LiveTicker() {
  const { stats } = useLiveStats(5000);
  const board = stats.liveBoard;

  return (
    <div className="relative border-t border-neutral-200 bg-neutral-950 py-3 text-white dark:border-neutral-900">
      <div className="flex overflow-hidden">
        <div className="marquee mono flex shrink-0 items-center gap-12 whitespace-nowrap pr-12 text-xs font-semibold">
          {[...board, ...board].map((row, i) => (
            <span key={i} className="inline-flex items-center gap-3">
              <span className="text-orange-400">{row.code}</span>
              <span>{row.route}</span>
              <span className="text-neutral-500">{row.time}</span>
              <span className="text-neutral-500">GATE {row.gate}</span>
              <span
                className={
                  row.status === "DELAYED"
                    ? "text-red-400"
                    : row.status === "BOARDING"
                      ? "text-emerald-400"
                      : row.status === "DEPARTED"
                        ? "text-neutral-500"
                        : "text-neutral-300"
                }
              >
                {row.status}
                {row.status === "DELAYED" && row.delayMin ? ` +${row.delayMin}m` : ""}
              </span>
              <span className="text-neutral-700">●</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
