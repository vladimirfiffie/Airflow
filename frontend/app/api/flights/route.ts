import { NextResponse } from "next/server";
import { listFlights } from "@/lib/data/flights";

export const dynamic = "force-dynamic";

export async function GET() {
  const flights = await listFlights();
  return NextResponse.json({ flights });
}
