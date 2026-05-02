"use client";

import { useCallback, useEffect, useState } from "react";
import type { BookingState, ContactInfo, Passenger, PaymentInfo } from "./types";

const KEY_PREFIX = "airflow:booking:";

function emptyState(flightId: string): BookingState {
  return {
    flightId,
    passengers: [{ firstName: "", lastName: "", dob: "" }],
    contact: { email: "", phone: "" },
    payment: { cardNumber: "", cardName: "", expiry: "", cvv: "", postalCode: "" },
  };
}

function read(flightId: string): BookingState {
  if (typeof window === "undefined") return emptyState(flightId);
  try {
    const raw = window.sessionStorage.getItem(KEY_PREFIX + flightId);
    if (!raw) return emptyState(flightId);
    const parsed = JSON.parse(raw) as BookingState;
    if (parsed.flightId !== flightId) return emptyState(flightId);
    return parsed;
  } catch {
    return emptyState(flightId);
  }
}

function write(state: BookingState) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(KEY_PREFIX + state.flightId, JSON.stringify(state));
}

export function useBookingState(flightId: string) {
  const [state, setState] = useState<BookingState>(() => emptyState(flightId));
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(read(flightId));
    setHydrated(true);
  }, [flightId]);

  const update = useCallback((next: BookingState) => {
    setState(next);
    write(next);
  }, []);

  const setPassengers = useCallback(
    (passengers: Passenger[]) => update({ ...state, passengers }),
    [state, update],
  );

  const setContact = useCallback(
    (contact: ContactInfo) => update({ ...state, contact }),
    [state, update],
  );

  const setPayment = useCallback(
    (payment: PaymentInfo) => update({ ...state, payment }),
    [state, update],
  );

  const setBookingRef = useCallback(
    (bookingRef: string) => update({ ...state, bookingRef }),
    [state, update],
  );

  const reset = useCallback(() => {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(KEY_PREFIX + flightId);
    }
    setState(emptyState(flightId));
  }, [flightId]);

  return { state, hydrated, setPassengers, setContact, setPayment, setBookingRef, reset };
}

export function generateBookingRef(): string {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const digits = "0123456789";
  const pick = (set: string, n: number) =>
    Array.from({ length: n }, () => set[Math.floor(Math.random() * set.length)]).join("");
  return `${pick(letters, 2)}${pick(digits, 2)}${pick(letters, 2)}`;
}
