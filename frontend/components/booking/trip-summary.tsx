"use client";

import { useMemo } from "react";
import type { FlightOffer } from "@/lib/mock/flights";
import { useBookingState } from "@/lib/booking/state";
import { generateSeatMap } from "@/lib/mock/seats";
import { FARE_BASE_TAX_RATE, SEAT_CLASS_LABEL } from "@/lib/booking/types";

export default function TripSummary({ flight }: { flight: FlightOffer }) {
  const { state, hydrated } = useBookingState(flight.id);
  const seats = useMemo(() => generateSeatMap(flight.id), [flight.id]);

  const passengerCount = Math.max(state.passengers.length, 1);
  const baseFare = flight.priceUsd * passengerCount;

  const seatSurcharge = state.passengers.reduce((sum, p) => {
    if (!p.seatId) return sum;
    const seat = seats.find((s) => s.id === p.seatId);
    return sum + (seat?.surcharge ?? 0);
  }, 0);

  const subtotal = baseFare + seatSurcharge;
  const taxes = Math.round(subtotal * FARE_BASE_TAX_RATE);
  const total = subtotal + taxes;

  return (
    <aside className="lg:sticky lg:top-24">
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-900 dark:bg-neutral-950">
        {/* Flight banner */}
        <div className="border-b border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-900 dark:bg-neutral-900/40">
          <p className="mono text-[11px] tracking-widest text-neutral-500 dark:text-neutral-400">
            {flight.flightNo} · {flight.airline.toUpperCase()}
          </p>
          <p className="display mono mt-2 text-3xl font-black text-neutral-950 dark:text-white">
            {flight.fromCode}
            <span className="mx-2 text-orange-500">→</span>
            {flight.toCode}
          </p>
          <p className="mono mt-2 text-xs text-neutral-600 dark:text-neutral-400">
            {flight.departTime} → {flight.arriveTime} · {flight.duration}
          </p>
        </div>

        {/* Passengers + seats */}
        <div className="space-y-3 border-b border-neutral-200 p-5 dark:border-neutral-900">
          <p className="eyebrow !text-neutral-500 dark:!text-neutral-400">Trip</p>
          <Row
            label="Passengers"
            value={hydrated ? `${passengerCount}` : "—"}
          />
          {state.passengers.map((p, i) => {
            const seat = p.seatId ? seats.find((s) => s.id === p.seatId) : undefined;
            const name = `${p.firstName} ${p.lastName}`.trim() || `Passenger ${i + 1}`;
            return (
              <Row
                key={i}
                label={name}
                value={
                  seat ? (
                    <>
                      <span className="mono">{seat.id}</span>
                      <span className="ml-2 text-neutral-500">
                        {SEAT_CLASS_LABEL[seat.cls]}
                      </span>
                    </>
                  ) : (
                    <span className="text-neutral-400">No seat yet</span>
                  )
                }
              />
            );
          })}
        </div>

        {/* Pricing */}
        <div className="space-y-2.5 p-5">
          <p className="eyebrow !text-neutral-500 dark:!text-neutral-400">Fare</p>
          <Row
            label={`Base × ${passengerCount}`}
            value={<span className="mono">${baseFare}</span>}
          />
          <Row
            label="Seat upgrades"
            value={<span className="mono">${seatSurcharge}</span>}
          />
          <Row
            label="Taxes & fees"
            value={<span className="mono">${taxes}</span>}
          />
          <div className="mt-3 flex items-center justify-between border-t border-neutral-200 pt-4 dark:border-neutral-900">
            <span className="text-sm font-bold text-neutral-950 dark:text-white">Total</span>
            <span className="display mono text-2xl font-black text-orange-500">${total}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-neutral-600 dark:text-neutral-400">{label}</span>
      <span className="font-semibold text-neutral-950 dark:text-white">{value}</span>
    </div>
  );
}
