import type { Seat, SeatClass } from "@/lib/booking/types";

const FIRST_ROWS = [1, 2, 3];
const EXIT_ROWS = [12, 13];
const TOTAL_ROWS = 30;
const FIRST_COLS = ["A", "C", "D", "F"];
const ECON_COLS = ["A", "B", "C", "D", "E", "F"];

function classOf(row: number): SeatClass {
  if (FIRST_ROWS.includes(row)) return "first";
  if (EXIT_ROWS.includes(row)) return "exit";
  return "standard";
}

function surchargeOf(cls: SeatClass): number {
  if (cls === "first") return 150;
  if (cls === "exit") return 25;
  return 0;
}

// Deterministic "taken" pattern derived from flight id + seat id so the layout is
// stable across renders without persisting server state.
function isTaken(flightId: string, seatId: string): boolean {
  let hash = 0;
  const input = `${flightId}-${seatId}`;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash % 7 < 2;
}

export function generateSeatMap(flightId: string): Seat[] {
  const seats: Seat[] = [];
  for (let row = 1; row <= TOTAL_ROWS; row++) {
    const cls = classOf(row);
    const cols = cls === "first" ? FIRST_COLS : ECON_COLS;
    for (const col of cols) {
      const id = `${row}${col}`;
      seats.push({
        id,
        row,
        col,
        cls,
        taken: isTaken(flightId, id),
        surcharge: surchargeOf(cls),
      });
    }
  }
  return seats;
}

export const TOTAL_ROWS_COUNT = TOTAL_ROWS;
export const FIRST_ROWS_LIST = FIRST_ROWS;
export const EXIT_ROWS_LIST = EXIT_ROWS;
