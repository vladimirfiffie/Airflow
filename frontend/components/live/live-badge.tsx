"use client";

import { useLiveStats } from "./use-live-stats";
import LiveCounter from "./live-counter";

export default function LiveBadge() {
  const { stats } = useLiveStats(5000);

  return (
    <div className="flex items-center gap-3">
      <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-orange-500" />
      <p className="eyebrow !text-neutral-500 dark:!text-neutral-400">
        <span className="text-orange-500">LIVE</span> ·{" "}
        <LiveCounter
          value={stats.flightsTracked}
          format={(n) => Math.round(n).toLocaleString()}
        />{" "}
        flights tracked today
      </p>
    </div>
  );
}
