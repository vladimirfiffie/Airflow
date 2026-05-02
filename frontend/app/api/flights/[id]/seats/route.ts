import { NextResponse } from "next/server";
import { getFlight, getTakenSeats } from "@/lib/data/flights";
import { generateSeatLayout, generateSeatMap } from "@/lib/mock/seats";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const flight = await getFlight(id);
  if (!flight) {
    return NextResponse.json({ error: "Flight not found" }, { status: 404 });
  }
  // When DB is wired, start from a clean layout and overlay real bookings.
  // Otherwise use the synthetic mock pattern so the dev UI looks populated.
  const seats = isSupabaseConfigured()
    ? await (async () => {
        const taken = await getTakenSeats(id);
        return generateSeatLayout().map((s) => ({ ...s, taken: taken.has(s.id) }));
      })()
    : generateSeatMap(id);
  return NextResponse.json({ flightId: id, seats });
}
