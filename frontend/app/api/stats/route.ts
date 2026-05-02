import { NextResponse } from "next/server";
import { fetchUSAircraft } from "@/lib/opensky/client";
import { getServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { FlightStatus } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type BoardStatus = "ON TIME" | "BOARDING" | "DELAYED" | "DEPARTED";

type LiveBoardEntry = {
  code: string;
  route: string;
  time: string;
  gate: string;
  status: BoardStatus;
  delayMin?: number;
};

export type StatsResponse = {
  flightsTracked: number;
  onTimeRate: number;
  avgDelayMin: number;
  activeGates: number;
  boardingNow: number;
  serverTime: string;
  liveBoard: LiveBoardEntry[];
  source: {
    flightsTracked: "opensky" | "simulated";
    metrics: "supabase" | "simulated";
    board: "supabase" | "simulated";
  };
};

const ROUTES = [
  { code: "AF1001", route: "JFK → LAX", baseTime: "07:10", gate: "A12" },
  { code: "AF2204", route: "JFK → SFO", baseTime: "09:35", gate: "B4" },
  { code: "AF3320", route: "ORD → SEA", baseTime: "11:50", gate: "C9" },
  { code: "AF4892", route: "MIA → BOS", baseTime: "15:20", gate: "D2" },
  { code: "AF5108", route: "DFW → PHX", baseTime: "16:05", gate: "E7" },
  { code: "AF6711", route: "ATL → DEN", baseTime: "18:40", gate: "F3" },
  { code: "AF7224", route: "BOS → DCA", baseTime: "08:25", gate: "A4" },
  { code: "AF8830", route: "SEA → DEN", baseTime: "13:15", gate: "C2" },
  { code: "AF9145", route: "LAX → JFK", baseTime: "21:00", gate: "B11" },
];

function jitter(seed: number, range: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return (x - Math.floor(x)) * range;
}

function rotateStatus(seed: number): BoardStatus {
  const r = Math.floor(jitter(seed, 100));
  if (r < 8) return "DEPARTED";
  if (r < 22) return "DELAYED";
  if (r < 38) return "BOARDING";
  return "ON TIME";
}

const STATUS_DISPLAY: Record<FlightStatus, BoardStatus> = {
  ON_TIME: "ON TIME",
  BOARDING: "BOARDING",
  DELAYED: "DELAYED",
  DEPARTED: "DEPARTED",
};

async function realBoard(): Promise<LiveBoardEntry[] | null> {
  if (!isSupabaseConfigured()) return null;
  const supa = getServiceClient();
  if (!supa) return null;
  const { data, error } = await supa
    .from("flights")
    .select("flight_no, from_code, to_code, depart_time, gate, status, delay_min")
    .order("depart_time")
    .limit(20);
  if (error || !data || data.length === 0) return null;
  return data.map((f) => ({
    code: f.flight_no,
    route: `${f.from_code} → ${f.to_code}`,
    time: f.depart_time,
    gate: f.gate ?? "—",
    status: STATUS_DISPLAY[f.status],
    delayMin: f.delay_min > 0 ? f.delay_min : undefined,
  }));
}

async function realMetrics() {
  if (!isSupabaseConfigured()) return null;
  const supa = getServiceClient();
  if (!supa) return null;
  const { data, error } = await supa
    .from("flights")
    .select("status, delay_min, gate");
  if (error || !data || data.length === 0) return null;

  const onTime = data.filter((f) => f.status === "ON_TIME" || f.delay_min === 0).length;
  const boarding = data.filter((f) => f.status === "BOARDING").length;
  const departed = data.filter((f) => f.status === "DEPARTED").length;
  const delayed = data.filter((f) => f.status === "DELAYED");
  const avgDelay =
    delayed.length === 0
      ? 0
      : Math.round(delayed.reduce((s, f) => s + f.delay_min, 0) / delayed.length);
  const gates = new Set(
    data.filter((f) => f.gate && f.status !== "DEPARTED").map((f) => f.gate),
  );

  return {
    onTimeRate: Math.round((onTime / data.length) * 100),
    avgDelayMin: avgDelay,
    activeGates: gates.size,
    boardingNow: boarding,
    departedToday: departed,
  };
}

export async function GET() {
  const now = new Date();
  const tick = Math.floor(now.getTime() / 5000);

  // ---- flightsTracked: real OpenSky if available -------------------------
  const aircraft = await fetchUSAircraft();
  const flightsTrackedSource: "opensky" | "simulated" = aircraft ? "opensky" : "simulated";
  const flightsTracked = aircraft
    ? aircraft.filter((a) => !a.on_ground).length
    : (() => {
        const hour = now.getHours() + now.getMinutes() / 60;
        const dayShape = 0.55 + 0.45 * Math.sin(((hour - 6) / 24) * Math.PI * 2);
        return Math.round(900 + dayShape * 600 + jitter(tick, 12));
      })();

  // ---- metrics: from DB if configured -----------------------------------
  const metrics = await realMetrics();
  const metricsSource: "supabase" | "simulated" = metrics ? "supabase" : "simulated";
  const onTimeRate =
    metrics?.onTimeRate ??
    Math.max(78, Math.min(97, Math.round(91 + jitter(tick + 1, 6) - 3)));
  const avgDelayMin = metrics?.avgDelayMin ?? Math.max(0, Math.round(7 + jitter(tick + 2, 6) - 3));
  const activeGates =
    metrics?.activeGates ??
    Math.round(28 + (aircraft ? 14 : 14) + jitter(tick + 3, 4));
  const boardingNow = metrics?.boardingNow ?? Math.max(0, Math.round(4 + jitter(tick + 4, 5)));

  // ---- live board: from DB or simulated ---------------------------------
  const board = await realBoard();
  const boardSource: "supabase" | "simulated" = board ? "supabase" : "simulated";
  const liveBoard: LiveBoardEntry[] =
    board ??
    ROUTES.map((r, i) => {
      const status = rotateStatus(tick + i);
      const delayMin =
        status === "DELAYED" ? Math.max(5, Math.round(10 + jitter(tick + i + 5, 30))) : undefined;
      return {
        code: r.code,
        route: r.route,
        time: r.baseTime,
        gate: r.gate,
        status,
        delayMin,
      };
    });

  const body: StatsResponse = {
    flightsTracked,
    onTimeRate,
    avgDelayMin,
    activeGates,
    boardingNow,
    serverTime: now.toISOString(),
    liveBoard,
    source: {
      flightsTracked: flightsTrackedSource,
      metrics: metricsSource,
      board: boardSource,
    },
  };

  return NextResponse.json(body, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
