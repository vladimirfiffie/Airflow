import { flightOffers as mockFlights, type FlightOffer } from "@/lib/mock/flights";
import { getServiceClient } from "@/lib/supabase/server";
import type { FlightRow } from "@/lib/supabase/types";

function rowToFlight(row: FlightRow, takenCount: number): FlightOffer {
  return {
    id: row.id,
    flightNo: row.flight_no,
    airline: row.airline,
    fromCode: row.from_code,
    toCode: row.to_code,
    departTime: row.depart_time,
    arriveTime: row.arrive_time,
    duration: row.duration,
    stops: row.stops,
    priceUsd: row.price_usd,
    seatsLeft: Math.max(0, row.total_seats - takenCount),
  };
}

async function takenSeatCountsByFlight(): Promise<Map<string, number>> {
  const supa = getServiceClient();
  if (!supa) return new Map();
  const { data: confirmed } = await supa
    .from("bookings")
    .select("id")
    .eq("status", "CONFIRMED");
  const ids = confirmed?.map((b) => b.id) ?? [];
  if (ids.length === 0) return new Map();
  const { data: passengers } = await supa
    .from("passengers")
    .select("flight_id")
    .in("booking_id", ids);
  const counts = new Map<string, number>();
  passengers?.forEach((p) => {
    counts.set(p.flight_id, (counts.get(p.flight_id) ?? 0) + 1);
  });
  return counts;
}

export async function listFlights(): Promise<FlightOffer[]> {
  const supa = getServiceClient();
  if (!supa) return mockFlights;
  const { data: rows, error } = await supa
    .from("flights")
    .select("*")
    .order("depart_time", { ascending: true });
  if (error || !rows) return mockFlights;
  const counts = await takenSeatCountsByFlight();
  return rows.map((row) => rowToFlight(row, counts.get(row.id) ?? 0));
}

export async function getFlight(id: string): Promise<FlightOffer | null> {
  const supa = getServiceClient();
  if (!supa) {
    return mockFlights.find((f) => f.id === id) ?? null;
  }
  const { data: row, error } = await supa
    .from("flights")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !row) return mockFlights.find((f) => f.id === id) ?? null;
  const counts = await takenSeatCountsByFlight();
  return rowToFlight(row, counts.get(row.id) ?? 0);
}

/**
 * Returns the set of seat IDs already claimed for a given flight.
 * When Supabase isn't configured, returns the deterministic mock pattern from
 * lib/mock/seats.ts so dev experience stays consistent.
 */
export async function getTakenSeats(flightId: string): Promise<Set<string>> {
  const supa = getServiceClient();
  if (!supa) {
    const { generateSeatMap } = await import("@/lib/mock/seats");
    return new Set(
      generateSeatMap(flightId)
        .filter((s) => s.taken)
        .map((s) => s.id),
    );
  }
  const { data: confirmed } = await supa
    .from("bookings")
    .select("id")
    .eq("flight_id", flightId)
    .eq("status", "CONFIRMED");
  const bookingIds = confirmed?.map((b) => b.id) ?? [];
  if (bookingIds.length === 0) return new Set();
  const { data: passengers } = await supa
    .from("passengers")
    .select("seat_id")
    .in("booking_id", bookingIds);
  return new Set(passengers?.map((p) => p.seat_id) ?? []);
}
