"use client";

import { useEffect, useState } from "react";
import type { StatsResponse } from "@/app/api/stats/route";

const FALLBACK: StatsResponse = {
  flightsTracked: 1284,
  onTimeRate: 92,
  avgDelayMin: 6,
  activeGates: 38,
  boardingNow: 5,
  serverTime: new Date().toISOString(),
  source: { flightsTracked: "simulated", metrics: "simulated", board: "simulated" },
  liveBoard: [
    { code: "AF1001", route: "JFK → LAX", time: "07:10", gate: "A12", status: "BOARDING" },
    { code: "AF2204", route: "JFK → SFO", time: "09:35", gate: "B4", status: "ON TIME" },
    { code: "AF3320", route: "ORD → SEA", time: "11:50", gate: "C9", status: "DELAYED", delayMin: 18 },
    { code: "AF4892", route: "MIA → BOS", time: "15:20", gate: "D2", status: "ON TIME" },
    { code: "AF5108", route: "DFW → PHX", time: "16:05", gate: "E7", status: "ON TIME" },
    { code: "AF6711", route: "ATL → DEN", time: "18:40", gate: "F3", status: "BOARDING" },
  ],
};

export function useLiveStats(intervalMs = 5000) {
  const [stats, setStats] = useState<StatsResponse>(FALLBACK);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch("/api/stats", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: StatsResponse = await res.json();
        if (!cancelled) {
          setStats(data);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load stats");
      }
    };

    load();
    const id = window.setInterval(load, intervalMs);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [intervalMs]);

  return { stats, error };
}
