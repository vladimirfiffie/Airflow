"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, User } from "lucide-react";
import { useBookingState } from "@/lib/booking/state";
import { generateSeatMap, FIRST_ROWS_LIST, EXIT_ROWS_LIST } from "@/lib/mock/seats";
import { SEAT_CLASS_LABEL, type Seat } from "@/lib/booking/types";
import { cn } from "@/lib/utils";

export default function SeatsPage({
  params,
}: {
  params: Promise<{ flightId: string }>;
}) {
  const { flightId } = use(params);
  const router = useRouter();
  const { state, hydrated, setPassengers } = useBookingState(flightId);

  const fallbackSeats = useMemo(() => generateSeatMap(flightId), [flightId]);
  const [seats, setSeats] = useState<Seat[]>(fallbackSeats);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/flights/${flightId}/seats`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data?.seats) setSeats(data.seats);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [flightId]);

  const [activePassenger, setActivePassenger] = useState(0);
  const [assignments, setAssignments] = useState<Record<number, string>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    const next: Record<number, string> = {};
    state.passengers.forEach((p, i) => {
      if (p.seatId) next[i] = p.seatId;
    });
    setAssignments(next);
  }, [hydrated, state.passengers]);

  useEffect(() => {
    if (!hydrated) return;
    if (state.passengers.length === 0 || !state.passengers[0]?.firstName) {
      router.replace(`/booking/${flightId}`);
    }
  }, [hydrated, state.passengers, flightId, router]);

  const passengers = state.passengers;
  const seatsByRow = useMemo(() => {
    const map = new Map<number, Seat[]>();
    seats.forEach((s) => {
      const arr = map.get(s.row) ?? [];
      arr.push(s);
      map.set(s.row, arr);
    });
    return map;
  }, [seats]);

  const selectedSet = new Set(Object.values(assignments));

  const onSeatClick = (seat: Seat) => {
    if (seat.taken) return;
    setError(null);
    setAssignments((prev) => {
      const next = { ...prev };
      // If seat already assigned to someone else, swap.
      const existingPassengerForSeat = Object.entries(next).find(
        ([, sid]) => sid === seat.id,
      );
      if (existingPassengerForSeat) {
        const [pid] = existingPassengerForSeat;
        delete next[Number(pid)];
      }
      // If active passenger had a different seat, clear it.
      if (next[activePassenger] === seat.id) {
        delete next[activePassenger];
      } else {
        next[activePassenger] = seat.id;
      }
      return next;
    });
    // Auto-advance to next unseated passenger
    const nextUnseated = passengers.findIndex((_, i) => i !== activePassenger && !assignments[i]);
    if (nextUnseated !== -1 && !assignments[activePassenger]) {
      setActivePassenger(nextUnseated);
    }
  };

  const onContinue = () => {
    const allAssigned = passengers.every((_, i) => assignments[i]);
    if (!allAssigned) {
      setError("Pick a seat for every passenger before continuing.");
      return;
    }
    setPassengers(
      passengers.map((p, i) => ({ ...p, seatId: assignments[i] })),
    );
    router.push(`/booking/${flightId}/payment`);
  };

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow">Step 2 of 4</p>
        <h1 className="display mt-3 text-4xl font-black text-neutral-950 md:text-5xl dark:text-white">
          Choose your seats.
        </h1>
        <p className="mt-3 max-w-md text-neutral-600 dark:text-neutral-400">
          Tap a seat to assign it to the active passenger. Exit rows and first class carry a
          surcharge.
        </p>
      </header>

      {/* Passenger picker */}
      <div className="flex flex-wrap gap-2">
        {passengers.map((p, i) => {
          const seatId = assignments[i];
          const seat = seatId ? seats.find((s) => s.id === seatId) : undefined;
          const active = i === activePassenger;
          const name = `${p.firstName} ${p.lastName}`.trim() || `Passenger ${i + 1}`;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setActivePassenger(i)}
              className={cn(
                "flex items-center gap-3 rounded-md border px-4 py-2.5 text-left transition",
                active
                  ? "border-orange-500 bg-orange-500/10"
                  : "border-neutral-200 bg-white hover:border-neutral-400 dark:border-neutral-900 dark:bg-neutral-950 dark:hover:border-neutral-700",
              )}
            >
              <User className={cn("h-4 w-4", active ? "text-orange-500" : "text-neutral-500")} />
              <div>
                <p className="text-sm font-bold text-neutral-950 dark:text-white">{name}</p>
                <p className="mono text-xs text-neutral-500 dark:text-neutral-400">
                  {seat ? `${seat.id} · ${SEAT_CLASS_LABEL[seat.cls]}` : "No seat"}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_240px]">
        {/* Seat map */}
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-900 dark:bg-neutral-950">
          <div className="mb-4 flex items-center justify-between">
            <p className="mono text-xs text-neutral-500 dark:text-neutral-400">
              CABIN VIEW · A321neo
            </p>
            <p className="mono text-xs text-neutral-500 dark:text-neutral-400">
              {selectedSet.size}/{passengers.length} ASSIGNED
            </p>
          </div>

          {/* Cabin nose */}
          <div className="mx-auto mb-2 h-8 w-32 rounded-t-full border border-b-0 border-neutral-300 dark:border-neutral-800" />

          <div className="mx-auto max-w-md space-y-1.5">
            {Array.from(seatsByRow.entries()).map(([row, rowSeats]) => {
              const isFirst = FIRST_ROWS_LIST.includes(row);
              const isExit = EXIT_ROWS_LIST.includes(row);
              return (
                <div key={row} className="flex items-center gap-2">
                  <span className="mono w-6 text-right text-[10px] font-bold text-neutral-400">
                    {row}
                  </span>
                  <div
                    className={cn(
                      "flex flex-1 gap-1",
                      isFirst ? "justify-around" : "",
                    )}
                  >
                    {rowSeats.map((seat, i) => {
                      const showAisle =
                        (isFirst && i === 1) || (!isFirst && i === 2);
                      const owner = Object.entries(assignments).find(
                        ([, sid]) => sid === seat.id,
                      );
                      const isMine = owner && Number(owner[0]) === activePassenger;
                      const isOther = owner && Number(owner[0]) !== activePassenger;

                      return (
                        <span key={seat.id} className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={seat.taken}
                            onClick={() => onSeatClick(seat)}
                            className={cn(
                              "mono flex h-7 w-7 items-center justify-center rounded text-[10px] font-bold transition-all",
                              seat.taken &&
                                "cursor-not-allowed bg-neutral-200 text-neutral-400 dark:bg-neutral-900 dark:text-neutral-700",
                              !seat.taken && !owner && seat.cls === "first" &&
                                "bg-amber-100 text-amber-900 hover:scale-110 hover:bg-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/20",
                              !seat.taken && !owner && seat.cls === "exit" &&
                                "bg-emerald-100 text-emerald-900 hover:scale-110 hover:bg-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/20",
                              !seat.taken && !owner && seat.cls === "standard" &&
                                "bg-neutral-100 text-neutral-700 hover:scale-110 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700",
                              isMine && "bg-orange-500 text-white ring-2 ring-orange-500/30",
                              isOther &&
                                "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950",
                            )}
                            aria-label={`Seat ${seat.id}, ${seat.taken ? "taken" : SEAT_CLASS_LABEL[seat.cls]}`}
                          >
                            {seat.col}
                          </button>
                          {showAisle && (
                            <span className="mx-1 text-[10px] font-bold text-neutral-300 dark:text-neutral-700">
                              {isExit ? "EXIT" : "·"}
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                  <span className="w-6" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <aside className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-900 dark:bg-neutral-950">
          <p className="eyebrow !text-neutral-500 dark:!text-neutral-400">Legend</p>
          <ul className="mt-4 space-y-3 text-sm">
            <Legend swatch="bg-orange-500" label="Your selection" />
            <Legend swatch="bg-neutral-950 dark:bg-white" label="Other passenger" />
            <Legend swatch="bg-amber-200 dark:bg-amber-500/30" label="First +$150" />
            <Legend swatch="bg-emerald-200 dark:bg-emerald-500/30" label="Exit row +$25" />
            <Legend swatch="bg-neutral-200 dark:bg-neutral-800" label="Standard" />
            <Legend swatch="bg-neutral-300 dark:bg-neutral-900" label="Taken" />
          </ul>
        </aside>
      </div>

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/booking/${flightId}`}
          className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-5 py-3 text-sm font-bold text-neutral-900 transition hover:border-neutral-950 dark:border-neutral-800 dark:text-white dark:hover:border-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <button
          type="button"
          onClick={onContinue}
          className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
        >
          Continue to payment
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <li className="flex items-center gap-3">
      <span className={cn("h-4 w-4 rounded", swatch)} />
      <span className="text-neutral-700 dark:text-neutral-300">{label}</span>
    </li>
  );
}
