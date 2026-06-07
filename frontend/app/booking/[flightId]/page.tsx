"use client";

import { use, useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Plus, X } from "lucide-react";
import { useBookingState } from "@/lib/booking/state";
import type { Passenger } from "@/lib/booking/types";

const inputStyle =
  "w-full rounded-md border border-neutral-300 bg-white px-3 py-2.5 text-sm font-medium text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-orange-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white dark:placeholder-neutral-600";

const labelStyle = "block space-y-2 text-sm";
const labelText = "font-bold text-neutral-700 dark:text-neutral-300";

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length === 0) return "";
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

function formatName(value: string) {
  return value.replace(/[^a-zA-Z\s'-]/g, "").slice(0, 50);
}

export default function PassengersPage({
  params,
}: {
  params: Promise<{ flightId: string }>;
}) {
  const { flightId } = use(params);
  const router = useRouter();
  const { state, hydrated, setPassengers, setContact } = useBookingState(flightId);
  const [errors, setErrors] = useState<string[]>([]);

  const [localPassengers, setLocalPassengers] = useState<Passenger[]>([
    { firstName: "", lastName: "", dob: "" },
  ]);
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [maxDob, setMaxDob] = useState("");

  useEffect(() => {
    setMaxDob(new Date().toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (state.passengers.length > 0) setLocalPassengers(state.passengers);
    setContactEmail(state.contact.email);
    setContactPhone(state.contact.phone);
  }, [hydrated, state.passengers, state.contact.email, state.contact.phone]);

  const updatePassenger = (i: number, patch: Partial<Passenger>) => {
    setLocalPassengers((prev) =>
      prev.map((p, idx) => (idx === i ? { ...p, ...patch } : p)),
    );
  };

  const addPassenger = () => {
    if (localPassengers.length >= 6) return;
    setLocalPassengers((prev) => [...prev, { firstName: "", lastName: "", dob: "" }]);
  };

  const removePassenger = (i: number) => {
    if (localPassengers.length <= 1) return;
    setLocalPassengers((prev) => prev.filter((_, idx) => idx !== i));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: string[] = [];
    localPassengers.forEach((p, i) => {
      if (!p.firstName.trim()) next.push(`Passenger ${i + 1}: first name required.`);
      if (!p.lastName.trim()) next.push(`Passenger ${i + 1}: last name required.`);
      if (!p.dob) next.push(`Passenger ${i + 1}: date of birth required.`);
    });
    if (!contactEmail.trim()) next.push("Contact email required.");
    if (!contactPhone.trim()) next.push("Contact phone required.");
    else if (contactPhone.replace(/\D/g, "").length < 10)
      next.push("Contact phone must be at least 10 digits.");

    if (next.length) {
      setErrors(next);
      return;
    }

    setPassengers(
      localPassengers.map((p) => ({
        ...p,
        seatId: state.passengers.find(
          (existing) => existing.firstName === p.firstName && existing.lastName === p.lastName,
        )?.seatId,
      })),
    );
    setContact({ email: contactEmail, phone: contactPhone });
    router.push(`/booking/${flightId}/seats`);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <header>
        <p className="eyebrow">Step 1 of 4</p>
        <h1 className="display mt-3 text-4xl font-black text-neutral-950 md:text-5xl dark:text-white">
          Who&apos;s flying?
        </h1>
        <p className="mt-3 max-w-md text-neutral-600 dark:text-neutral-400">
          Names must match government-issued ID exactly. Up to 6 passengers per booking.
        </p>
      </header>

      {/* Passengers */}
      <div className="space-y-4">
        {localPassengers.map((p, i) => (
          <div
            key={i}
            className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-900 dark:bg-neutral-950"
          >
            <div className="mb-5 flex items-center justify-between">
              <p className="eyebrow !text-neutral-500 dark:!text-neutral-400">
                Passenger {String(i + 1).padStart(2, "0")}
              </p>
              {localPassengers.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePassenger(i)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-neutral-500 transition hover:text-orange-500"
                >
                  <X className="h-3.5 w-3.5" />
                  Remove
                </button>
              )}
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <label className={labelStyle}>
                <span className={labelText}>First name</span>
                <input
                  className={inputStyle}
                  value={p.firstName}
                  onChange={(e) => updatePassenger(i, { firstName: formatName(e.target.value) })}
                  placeholder="Jane"
                  autoComplete="given-name"
                />
              </label>
              <label className={labelStyle}>
                <span className={labelText}>Last name</span>
                <input
                  className={inputStyle}
                  value={p.lastName}
                  onChange={(e) => updatePassenger(i, { lastName: formatName(e.target.value) })}
                  placeholder="Doe"
                  autoComplete="family-name"
                />
              </label>
              <label className={labelStyle}>
                <span className={labelText}>Date of birth</span>
                <input
                  type="date"
                  className={inputStyle}
                  value={p.dob}
                  max={maxDob || undefined}
                  onChange={(e) => updatePassenger(i, { dob: e.target.value })}
                  autoComplete="bday"
                />
              </label>
            </div>
          </div>
        ))}

        {localPassengers.length < 6 && (
          <button
            type="button"
            onClick={addPassenger}
            className="inline-flex items-center gap-2 rounded-md border-2 border-dashed border-neutral-300 px-4 py-3 text-sm font-bold text-neutral-700 transition hover:border-orange-500 hover:text-orange-500 dark:border-neutral-800 dark:text-neutral-300"
          >
            <Plus className="h-4 w-4" />
            Add passenger
          </button>
        )}
      </div>

      {/* Contact */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-900 dark:bg-neutral-950">
        <p className="eyebrow !text-neutral-500 dark:!text-neutral-400">Contact</p>
        <h2 className="mt-3 text-xl font-bold text-neutral-950 dark:text-white">
          Where should we send updates?
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className={labelStyle}>
            <span className={labelText}>Email</span>
            <input
              type="email"
              className={inputStyle}
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              inputMode="email"
            />
          </label>
          <label className={labelStyle}>
            <span className={labelText}>Phone</span>
            <input
              type="tel"
              className={inputStyle}
              value={contactPhone}
              onChange={(e) => setContactPhone(formatPhone(e.target.value))}
              placeholder="(555) 000-0000"
              autoComplete="tel"
              inputMode="tel"
              maxLength={20}
            />
          </label>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          <p className="font-bold">Please fix the following:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
        >
          Continue to seats
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
