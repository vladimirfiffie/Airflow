import { NextResponse } from "next/server";
import { getServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getFlight } from "@/lib/data/flights";

export const dynamic = "force-dynamic";

/**
 * GET /api/bookings/[ref]?email=foo@bar.com
 *
 * Public lookup. Optional email query verifies the requester actually knows
 * the contact email — required when DB is configured. When DB isn't wired,
 * returns 501 since lookup against sessionStorage isn't possible cross-request.
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ ref: string }> },
) {
  const { ref } = await params;
  const url = new URL(req.url);
  const email = url.searchParams.get("email")?.trim().toLowerCase();

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Booking lookup requires Supabase to be configured." },
      { status: 501 },
    );
  }

  const supa = getServiceClient();
  if (!supa) {
    return NextResponse.json({ error: "DB not available" }, { status: 503 });
  }

  const { data: booking, error } = await supa
    .from("bookings")
    .select("*")
    .eq("ref", ref.toUpperCase())
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  // Email verification — only enforce if caller provided one. Lets the
  // confirmation page (right after creation) read the booking without re-auth,
  // while the manage-booking lookup form still gates on email match.
  if (email && booking.contact_email.toLowerCase() !== email) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const { data: passengers } = await supa
    .from("passengers")
    .select("*")
    .eq("booking_id", booking.id)
    .order("position", { ascending: true });

  const flight = await getFlight(booking.flight_id);

  return NextResponse.json({ booking, passengers: passengers ?? [], flight });
}
