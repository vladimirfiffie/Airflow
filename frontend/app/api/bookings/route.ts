import { NextResponse } from "next/server";
import { getServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe/server";
import { getResend, getResendFrom, isResendConfigured } from "@/lib/resend/client";
import { generateBookingRef } from "@/lib/booking/state";
import { getFlight, getTakenSeats } from "@/lib/data/flights";
import { generateSeatLayout } from "@/lib/mock/seats";
import { FARE_BASE_TAX_RATE } from "@/lib/booking/types";
import { renderConfirmationEmail } from "@/lib/email/confirmation";

export const dynamic = "force-dynamic";

type CreateBody = {
  flightId: string;
  passengers: {
    firstName: string;
    lastName: string;
    dob: string;
    seatId: string;
  }[];
  contact: { email: string; phone: string };
  paymentIntentId?: string | null;
};

export async function POST(req: Request) {
  let body: CreateBody;
  try {
    body = (await req.json()) as CreateBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // ---- Validate input ------------------------------------------------------
  if (!body.flightId || !body.passengers?.length || !body.contact?.email) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (body.passengers.some((p) => !p.firstName || !p.lastName || !p.dob || !p.seatId)) {
    return NextResponse.json({ error: "Incomplete passenger info" }, { status: 400 });
  }

  // ---- Look up flight ------------------------------------------------------
  const flight = await getFlight(body.flightId);
  if (!flight) {
    return NextResponse.json({ error: "Flight not found" }, { status: 404 });
  }

  // ---- Verify seats are still available ------------------------------------
  const takenSeats = await getTakenSeats(body.flightId);
  const requestedSeats = body.passengers.map((p) => p.seatId);
  const conflicts = requestedSeats.filter((s) => takenSeats.has(s));
  if (conflicts.length > 0) {
    return NextResponse.json(
      { error: `Seats no longer available: ${conflicts.join(", ")}` },
      { status: 409 },
    );
  }
  // Also check duplicates within the request itself
  if (new Set(requestedSeats).size !== requestedSeats.length) {
    return NextResponse.json({ error: "Duplicate seats in request" }, { status: 400 });
  }

  // ---- Compute total -------------------------------------------------------
  const layout = generateSeatLayout();
  const baseFare = flight.priceUsd * body.passengers.length;
  const seatSurcharge = body.passengers.reduce((sum, p) => {
    const seat = layout.find((s) => s.id === p.seatId);
    return sum + (seat?.surcharge ?? 0);
  }, 0);
  const subtotal = baseFare + seatSurcharge;
  const taxes = Math.round(subtotal * FARE_BASE_TAX_RATE);
  const totalUsd = subtotal + taxes;
  const totalCents = totalUsd * 100;

  // ---- Verify payment with Stripe (if configured) --------------------------
  if (isStripeConfigured() && body.paymentIntentId) {
    const stripe = getStripe();
    if (stripe) {
      try {
        const intent = await stripe.paymentIntents.retrieve(body.paymentIntentId);
        if (intent.status !== "succeeded") {
          return NextResponse.json(
            { error: `Payment not completed (status: ${intent.status})` },
            { status: 402 },
          );
        }
        if (intent.amount !== totalCents) {
          return NextResponse.json(
            { error: "Payment amount mismatch" },
            { status: 400 },
          );
        }
      } catch (e) {
        return NextResponse.json(
          { error: e instanceof Error ? e.message : "Stripe lookup failed" },
          { status: 500 },
        );
      }
    }
  }

  // ---- Persist booking -----------------------------------------------------
  const ref = generateBookingRef();

  if (isSupabaseConfigured()) {
    const supa = getServiceClient();
    if (supa) {
      const { data: bookingRow, error: bookingErr } = await supa
        .from("bookings")
        .insert({
          ref,
          flight_id: body.flightId,
          contact_email: body.contact.email,
          contact_phone: body.contact.phone,
          status: "CONFIRMED",
          total_cents: totalCents,
          stripe_payment_intent: body.paymentIntentId ?? null,
        })
        .select("id, ref")
        .single();

      if (bookingErr || !bookingRow) {
        return NextResponse.json(
          { error: bookingErr?.message ?? "Failed to create booking" },
          { status: 500 },
        );
      }

      const { error: paxErr } = await supa.from("passengers").insert(
        body.passengers.map((p, i) => ({
          booking_id: bookingRow.id,
          flight_id: body.flightId,
          first_name: p.firstName,
          last_name: p.lastName,
          dob: p.dob,
          seat_id: p.seatId,
          position: i + 1,
        })),
      );

      if (paxErr) {
        // Roll back the booking on passenger insert failure (typically a unique
        // (flight_id, seat_id) collision from a race).
        await supa.from("bookings").delete().eq("id", bookingRow.id);
        return NextResponse.json(
          {
            error: paxErr.message.includes("unique")
              ? "One or more seats were just taken — please pick different seats."
              : paxErr.message,
          },
          { status: paxErr.message.includes("unique") ? 409 : 500 },
        );
      }
    }
  }

  // ---- Send confirmation email --------------------------------------------
  if (isResendConfigured()) {
    const resend = getResend();
    if (resend) {
      try {
        const { html, text, subject } = renderConfirmationEmail({
          ref,
          flight,
          passengers: body.passengers,
          totalUsd,
          appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "",
        });
        await resend.emails.send({
          from: getResendFrom(),
          to: body.contact.email,
          subject,
          html,
          text,
        });
      } catch {
        // Email is best-effort; don't fail the booking on email failure.
      }
    }
  }

  return NextResponse.json({ ref, totalCents });
}
