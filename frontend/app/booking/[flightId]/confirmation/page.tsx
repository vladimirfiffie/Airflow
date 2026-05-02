"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Download, Mail, Plane } from "lucide-react";
import { useBookingState } from "@/lib/booking/state";
import { generateSeatLayout } from "@/lib/mock/seats";
import { FARE_BASE_TAX_RATE, SEAT_CLASS_LABEL } from "@/lib/booking/types";
import type { FlightOffer } from "@/lib/mock/flights";

type APIBooking = {
  ref: string;
  contact_email: string;
  total_cents: number;
  stripe_payment_intent: string | null;
};

type APIPassenger = {
  first_name: string;
  last_name: string;
  seat_id: string;
};

type ResolvedBooking = {
  ref: string;
  email: string;
  totalUsd: number;
  passengers: { firstName: string; lastName: string; seatId: string }[];
  flight: FlightOffer;
};

export default function ConfirmationPage({
  params,
}: {
  params: Promise<{ flightId: string }>;
}) {
  const { flightId } = use(params);
  const router = useRouter();
  const search = useSearchParams();
  const ref = search?.get("ref") ?? null;

  const { state, hydrated } = useBookingState(flightId);
  const [resolved, setResolved] = useState<ResolvedBooking | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  // Try API lookup first when we have a ref
  useEffect(() => {
    if (!ref) {
      setLoadFailed(true);
      return;
    }
    let cancelled = false;
    fetch(`/api/bookings/${ref}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (!data?.booking || !data?.flight) {
          setLoadFailed(true);
          return;
        }
        const booking = data.booking as APIBooking;
        const passengers = (data.passengers as APIPassenger[]).map((p) => ({
          firstName: p.first_name,
          lastName: p.last_name,
          seatId: p.seat_id,
        }));
        setResolved({
          ref: booking.ref,
          email: booking.contact_email,
          totalUsd: Math.round(booking.total_cents / 100),
          passengers,
          flight: data.flight as FlightOffer,
        });
      })
      .catch(() => !cancelled && setLoadFailed(true));
    return () => {
      cancelled = true;
    };
  }, [ref]);

  // Fall back to sessionStorage state when API isn't available
  const fallback = useMemo<ResolvedBooking | null>(() => {
    if (!hydrated || !state.bookingRef || !state.passengers.length) return null;
    const layout = generateSeatLayout();
    return {
      ref: state.bookingRef,
      email: state.contact.email,
      totalUsd: 0, // computed below
      passengers: state.passengers.map((p) => ({
        firstName: p.firstName,
        lastName: p.lastName,
        seatId: p.seatId ?? "",
      })),
      flight: {
        // Minimal placeholder; fallback is best-effort.
        id: flightId,
        flightNo: flightId,
        airline: "Airflow",
        fromCode: "—",
        toCode: "—",
        departTime: "—",
        arriveTime: "—",
        duration: "—",
        stops: 0,
        priceUsd: 0,
        seatsLeft: 0,
      },
      _layout: layout,
    } as ResolvedBooking & { _layout: typeof layout };
  }, [hydrated, state, flightId]);

  // Try fetching flight to enrich fallback (if API/DB lookup failed)
  const [fallbackFlight, setFallbackFlight] = useState<FlightOffer | null>(null);
  useEffect(() => {
    if (!loadFailed || !fallback) return;
    fetch(`/api/flights/${flightId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d?.flight && setFallbackFlight(d.flight as FlightOffer))
      .catch(() => {});
  }, [loadFailed, fallback, flightId]);

  // Pick the resolved or computed-fallback booking
  const final: ResolvedBooking | null = useMemo(() => {
    if (resolved) return resolved;
    if (loadFailed && fallback) {
      const flight = fallbackFlight ?? fallback.flight;
      const layout = generateSeatLayout();
      const baseFare = flight.priceUsd * fallback.passengers.length;
      const seatSurcharge = fallback.passengers.reduce((sum, p) => {
        const seat = layout.find((s) => s.id === p.seatId);
        return sum + (seat?.surcharge ?? 0);
      }, 0);
      const subtotal = baseFare + seatSurcharge;
      const taxes = Math.round(subtotal * FARE_BASE_TAX_RATE);
      return { ...fallback, flight, totalUsd: subtotal + taxes };
    }
    return null;
  }, [resolved, loadFailed, fallback, fallbackFlight]);

  // Redirect to start if we truly have nothing
  useEffect(() => {
    if (!hydrated) return;
    if (!ref && !state.bookingRef) {
      router.replace(`/booking/${flightId}`);
    }
  }, [hydrated, ref, state.bookingRef, flightId, router]);

  if (!final) {
    return (
      <div className="py-20 text-center">
        <p className="mono text-sm text-neutral-500">Loading confirmation…</p>
      </div>
    );
  }

  const layout = generateSeatLayout();
  const passengerCount = final.passengers.length;
  const cardLast4 = state.payment.cardNumber.replace(/\s/g, "").slice(-4) || "----";

  return (
    <div className="space-y-8">
      <header>
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-emerald-500" />
          <p className="eyebrow !text-emerald-600 dark:!text-emerald-400">Booking confirmed</p>
        </div>
        <h1 className="display mt-4 text-4xl font-black text-neutral-950 md:text-5xl dark:text-white">
          You&apos;re all set.
        </h1>
        <p className="mt-3 max-w-md text-neutral-600 dark:text-neutral-400">
          A confirmation has been sent to{" "}
          <span className="font-bold text-neutral-950 dark:text-white">{final.email}</span>. Check
          in opens 24 hours before departure.
        </p>
      </header>

      {/* Boarding pass */}
      <div className="overflow-hidden rounded-2xl bg-neutral-950 text-white">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_240px]">
          <div className="p-8 md:p-10">
            <p className="mono text-xs text-neutral-400">BOARDING PASS</p>
            <p className="display mono mt-6 text-6xl font-black tracking-tight md:text-7xl">
              {final.flight.fromCode}
              <span className="mx-3 text-orange-500">→</span>
              {final.flight.toCode}
            </p>
            <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4">
              <Detail label="Flight" value={final.flight.flightNo} />
              <Detail label="Depart" value={final.flight.departTime} />
              <Detail label="Arrive" value={final.flight.arriveTime} />
              <Detail label="Duration" value={final.flight.duration} />
            </div>
            <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3">
              <Detail label="Booking ref" value={final.ref} highlight />
              <Detail label="Passengers" value={String(passengerCount)} />
              <Detail label="Total paid" value={`$${final.totalUsd}`} highlight />
            </div>
          </div>

          <div className="hidden flex-col items-center justify-center md:flex">
            <span className="h-3 w-3 rounded-full bg-white/10" />
            <span className="my-2 h-full w-px border-l-2 border-dashed border-white/20" />
            <span className="h-3 w-3 rounded-full bg-white/10" />
          </div>

          <div className="border-t border-white/10 p-8 md:border-l md:border-t-0 md:p-10">
            <p className="mono text-xs text-neutral-400">SEATS</p>
            <ul className="mt-5 space-y-3">
              {final.passengers.map((p, i) => {
                const seat = layout.find((s) => s.id === p.seatId);
                const name = `${p.firstName} ${p.lastName}`.trim() || `Passenger ${i + 1}`;
                return (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-3 border-b border-white/5 pb-3 last:border-b-0"
                  >
                    <span className="text-sm font-bold text-white">{name}</span>
                    <span className="text-right">
                      <span className="mono block text-lg font-black text-orange-500">
                        {p.seatId || "—"}
                      </span>
                      <span className="mono text-[10px] uppercase tracking-widest text-neutral-400">
                        {seat ? SEAT_CLASS_LABEL[seat.cls] : ""}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* Receipt + next steps */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-900 dark:bg-neutral-950">
          <p className="eyebrow !text-neutral-500 dark:!text-neutral-400">Receipt</p>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex items-center justify-between border-t border-neutral-200 pt-3 dark:border-neutral-900">
              <dt className="text-sm font-bold text-neutral-950 dark:text-white">Total charged</dt>
              <dd className="display mono text-2xl font-black text-orange-500">
                ${final.totalUsd}
              </dd>
            </div>
            <p className="mono pt-2 text-xs text-neutral-500 dark:text-neutral-400">
              VISA ···· {cardLast4}
            </p>
          </dl>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-900 dark:bg-neutral-950">
          <p className="eyebrow !text-neutral-500 dark:!text-neutral-400">What&apos;s next</p>
          <ul className="mt-5 space-y-4 text-sm">
            <Step n={1} text="Check email for booking confirmation and itinerary." />
            <Step n={2} text="Online check-in opens 24 hours before departure." />
            <Step n={3} text="Arrive 2 hours before for domestic, 3 hours for international." />
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
        >
          <Download className="h-4 w-4" />
          Download boarding pass
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-5 py-3 text-sm font-bold text-neutral-900 transition hover:border-neutral-950 dark:border-neutral-800 dark:text-white dark:hover:border-white"
        >
          <Mail className="h-4 w-4" />
          Email itinerary
        </button>
        <Link
          href="/flights"
          className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-5 py-3 text-sm font-bold text-neutral-900 transition hover:border-neutral-950 dark:border-neutral-800 dark:text-white dark:hover:border-white"
        >
          <Plane className="h-4 w-4" />
          Book another
        </Link>
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <p className="mono text-[10px] uppercase tracking-widest text-neutral-400">{label}</p>
      <p
        className={`mono mt-1 text-xl font-black ${highlight ? "text-orange-500" : "text-white"}`}
      >
        {value}
      </p>
    </div>
  );
}

function Step({ n, text }: { n: number; text: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mono mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500/10 text-[10px] font-bold text-orange-500">
        {n}
      </span>
      <span className="text-neutral-700 dark:text-neutral-300">{text}</span>
    </li>
  );
}
