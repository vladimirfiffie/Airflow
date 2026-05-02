import { NextResponse } from "next/server";
import { getFlight } from "@/lib/data/flights";

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
  return NextResponse.json({ flight });
}
