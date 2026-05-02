import { NextResponse } from "next/server";

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

// Deterministic-ish jitter so the numbers move but are coherent within a minute window.
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

export async function GET() {
  const now = new Date();
  // Bucket so values stay stable for ~5s, then shift.
  const tick = Math.floor(now.getTime() / 5000);

  // Hour-of-day shape: more flights & gates active midday, fewer overnight.
  const hour = now.getHours() + now.getMinutes() / 60;
  const dayShape = 0.55 + 0.45 * Math.sin(((hour - 6) / 24) * Math.PI * 2);

  const flightsTracked = Math.round(900 + dayShape * 600 + jitter(tick, 12));
  const onTimeRate = Math.max(78, Math.min(97, Math.round(91 + jitter(tick + 1, 6) - 3)));
  const avgDelayMin = Math.max(0, Math.round(7 + jitter(tick + 2, 6) - 3));
  const activeGates = Math.round(28 + dayShape * 14 + jitter(tick + 3, 4));
  const boardingNow = Math.max(0, Math.round(4 + jitter(tick + 4, 5)));

  const liveBoard: LiveBoardEntry[] = ROUTES.map((r, i) => {
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
  };

  return NextResponse.json(body, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
