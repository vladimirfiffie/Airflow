"use client";

import { use, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Download, Mail, Plane } from "lucide-react";
import { useBookingState } from "@/lib/booking/state";
import { flightOffers } from "@/lib/mock/flights";
import { generateSeatMap } from "@/lib/mock/seats";
import { FARE_BASE_TAX_RATE, SEAT_CLASS_LABEL } from "@/lib/booking/types";

export default function ConfirmationPage({
  params,
}: {
  params: Promise<{ flightId: string }>;
}) {
  const { flightId } = use(params);
  const router = useRouter();
  const { state, hydrated } = useBookingState(flightId);
  const flight = flightOffers.find((f) => f.id === flightId);
  const seats = useMemo(() => generateSeatMap(flightId), [flightId]);

  useEffect(() => {
    if (!hydrated) return;
    if (!state.bookingRef) {
      router.replace(`/booking/${flightId}`);
    }
  }, [hydrated, state.bookingRef, flightId, router]);

  if (!flight || !hydrated || !state.bookingRef) {
    return (
      <div className="py-20 text-center">
        <p className="mono text-sm text-neutral-500">Loading…</p>
      </div>
    );
  }

  const passengerCount = state.passengers.length;
  const baseFare = flight.priceUsd * passengerCount;
  const seatSurcharge = state.passengers.reduce((sum, p) => {
    if (!p.seatId) return sum;
    const seat = seats.find((s) => s.id === p.seatId);
    return sum + (seat?.surcharge ?? 0);
  }, 0);
  const subtotal = baseFare + seatSurcharge;
  const taxes = Math.round(subtotal * FARE_BASE_TAX_RATE);
  const total = subtotal + taxes;
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
          <span className="font-bold text-neutral-950 dark:text-white">{state.contact.email}</span>.
          Check in opens 24 hours before departure.
        </p>
      </header>

      {/* Boarding pass — bold airline-ticket vibe */}
      <div className="overflow-hidden rounded-2xl bg-neutral-950 text-white">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_240px]">
          <div className="p-8 md:p-10">
            <p className="mono text-xs text-neutral-400">BOARDING PASS</p>
            <p className="display mono mt-6 text-6xl font-black tracking-tight md:text-7xl">
              {flight.fromCode}
              <span className="mx-3 text-orange-500">→</span>
              {flight.toCode}
            </p>
            <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4">
              <Detail label="Flight" value={flight.flightNo} />
              <Detail label="Depart" value={flight.departTime} />
              <Detail label="Arrive" value={flight.arriveTime} />
              <Detail label="Duration" value={flight.duration} />
            </div>
            <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3">
              <Detail label="Booking ref" value={state.bookingRef} highlight />
              <Detail label="Passengers" value={String(passengerCount)} />
              <Detail label="Total paid" value={`$${total}`} highlight />
            </div>
          </div>

          {/* Perforation */}
          <div className="hidden flex-col items-center justify-center md:flex">
            <span className="h-3 w-3 rounded-full bg-white/10" />
            <span className="my-2 h-full w-px border-l-2 border-dashed border-white/20" />
            <span className="h-3 w-3 rounded-full bg-white/10" />
          </div>

          <div className="border-t border-white/10 p-8 md:border-l md:border-t-0 md:p-10">
            <p className="mono text-xs text-neutral-400">SEATS</p>
            <ul className="mt-5 space-y-3">
              {state.passengers.map((p, i) => {
                const seat = p.seatId ? seats.find((s) => s.id === p.seatId) : undefined;
                const name = `${p.firstName} ${p.lastName}`.trim() || `Passenger ${i + 1}`;
                return (
                  <li key={i} className="flex items-center justify-between gap-3 border-b border-white/5 pb-3 last:border-b-0">
                    <span className="text-sm font-bold text-white">{name}</span>
                    <span className="text-right">
                      <span className="mono block text-lg font-black text-orange-500">
                        {seat?.id ?? "—"}
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

      {/* Receipt */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-900 dark:bg-neutral-950">
          <p className="eyebrow !text-neutral-500 dark:!text-neutral-400">Receipt</p>
          <dl className="mt-5 space-y-3 text-sm">
            <ReceiptRow label={`Base fare × ${passengerCount}`} value={`$${baseFare}`} />
            <ReceiptRow label="Seat upgrades" value={`$${seatSurcharge}`} />
            <ReceiptRow label="Taxes & fees" value={`$${taxes}`} />
            <div className="flex items-center justify-between border-t border-neutral-200 pt-3 dark:border-neutral-900">
              <dt className="text-sm font-bold text-neutral-950 dark:text-white">Total charged</dt>
              <dd className="display mono text-2xl font-black text-orange-500">${total}</dd>
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

      {/* Actions */}
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

function ReceiptRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <dt className="text-neutral-600 dark:text-neutral-400">{label}</dt>
      <dd className="mono font-semibold text-neutral-950 dark:text-white">{value}</dd>
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
