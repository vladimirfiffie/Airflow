"use client";

import { use, useEffect, useState, useMemo, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, Lock, Shield } from "lucide-react";
import { useBookingState } from "@/lib/booking/state";
import { generateSeatLayout } from "@/lib/mock/seats";
import { FARE_BASE_TAX_RATE } from "@/lib/booking/types";
import StripePayment from "@/components/booking/stripe-payment";

const inputStyle =
  "w-full rounded-md border border-neutral-300 bg-white px-3 py-2.5 text-sm font-medium text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-orange-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white dark:placeholder-neutral-600";

const labelStyle = "block space-y-2 text-sm";
const labelText = "font-bold text-neutral-700 dark:text-neutral-300";

function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length < 3) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

const stripeConfigured = Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

type FlightLite = { priceUsd: number };

export default function PaymentPage({
  params,
}: {
  params: Promise<{ flightId: string }>;
}) {
  const { flightId } = use(params);
  const router = useRouter();
  const { state, hydrated, setPayment } = useBookingState(flightId);

  const [flight, setFlight] = useState<FlightLite | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Mock card form state (used when Stripe isn't configured)
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // Load flight for accurate pricing
  useEffect(() => {
    fetch(`/api/flights/${flightId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.flight) setFlight({ priceUsd: data.flight.priceUsd });
      });
  }, [flightId]);

  useEffect(() => {
    if (!hydrated) return;
    if (state.passengers.length === 0 || !state.passengers[0]?.firstName) {
      router.replace(`/booking/${flightId}`);
      return;
    }
    if (state.passengers.some((p) => !p.seatId)) {
      router.replace(`/booking/${flightId}/seats`);
      return;
    }
    setCardNumber(state.payment.cardNumber);
    setCardName(state.payment.cardName);
    setExpiry(state.payment.expiry);
    setCvv(state.payment.cvv);
    setPostalCode(state.payment.postalCode);
  }, [hydrated, state.passengers, state.payment, flightId, router]);

  // Compute total (kept in sync with API)
  const totalCents = useMemo(() => {
    if (!flight) return 0;
    const layout = generateSeatLayout();
    const baseFare = flight.priceUsd * state.passengers.length;
    const seatSurcharge = state.passengers.reduce((sum, p) => {
      if (!p.seatId) return sum;
      const seat = layout.find((s) => s.id === p.seatId);
      return sum + (seat?.surcharge ?? 0);
    }, 0);
    const subtotal = baseFare + seatSurcharge;
    const taxes = Math.round(subtotal * FARE_BASE_TAX_RATE);
    return (subtotal + taxes) * 100;
  }, [flight, state.passengers]);

  const finalize = async (paymentIntentId: string | null) => {
    setSubmitting(true);
    setErrors([]);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flightId,
          passengers: state.passengers.map((p) => ({
            firstName: p.firstName,
            lastName: p.lastName,
            dob: p.dob,
            seatId: p.seatId,
          })),
          contact: state.contact,
          paymentIntentId,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors([data.error ?? "Booking failed"]);
        setSubmitting(false);
        return;
      }
      router.push(`/booking/${flightId}/confirmation?ref=${data.ref}`);
    } catch (e) {
      setErrors([e instanceof Error ? e.message : "Network error"]);
      setSubmitting(false);
    }
  };

  // Mock submit (no Stripe)
  const onMockSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: string[] = [];
    if (cardNumber.replace(/\s/g, "").length < 15) next.push("Card number looks too short.");
    if (!cardName.trim()) next.push("Cardholder name required.");
    if (!/^\d{2}\/\d{2}$/.test(expiry)) next.push("Expiry must be MM/YY.");
    if (cvv.length < 3) next.push("CVV must be 3 or 4 digits.");
    if (!postalCode.trim()) next.push("Postal code required.");
    if (next.length) {
      setErrors(next);
      return;
    }
    setPayment({ cardNumber, cardName, expiry, cvv, postalCode });
    // Simulate processing delay so the spinner registers
    await new Promise((r) => setTimeout(r, 600));
    await finalize(null);
  };

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow">Step 3 of 4</p>
        <h1 className="display mt-3 text-4xl font-black text-neutral-950 md:text-5xl dark:text-white">
          Payment.
        </h1>
        <p className="mt-3 max-w-md text-neutral-600 dark:text-neutral-400">
          {stripeConfigured
            ? "Charged via Stripe in test mode. Use 4242 4242 4242 4242 with any future expiry and any CVC."
            : "Demo mode — no real charge. Add Stripe keys to enable real payments."}
        </p>
      </header>

      <div className="flex flex-wrap gap-3">
        <span className="inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs font-bold text-neutral-700 dark:border-neutral-900 dark:bg-neutral-950 dark:text-neutral-300">
          <Lock className="h-3.5 w-3.5 text-emerald-500" />
          256-bit SSL
        </span>
        <span className="inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs font-bold text-neutral-700 dark:border-neutral-900 dark:bg-neutral-950 dark:text-neutral-300">
          <Shield className="h-3.5 w-3.5 text-emerald-500" />
          PCI-DSS Compliant
        </span>
        <span className="inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs font-bold text-neutral-700 dark:border-neutral-900 dark:bg-neutral-950 dark:text-neutral-300">
          <CreditCard className="h-3.5 w-3.5 text-emerald-500" />
          {stripeConfigured ? "Stripe Test Mode" : "Demo Mode"}
        </span>
      </div>

      {stripeConfigured && totalCents > 0 ? (
        <StripePayment
          amountCents={totalCents}
          flightId={flightId}
          onPaymentReady={finalize}
          isProcessing={submitting}
        />
      ) : (
        <form onSubmit={onMockSubmit} className="space-y-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-900 dark:bg-neutral-950">
            <p className="eyebrow !text-neutral-500 dark:!text-neutral-400">Card details</p>
            <div className="mt-5 space-y-4">
              <label className={labelStyle}>
                <span className={labelText}>Card number</span>
                <input
                  className={`${inputStyle} mono tracking-widest`}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="4242 4242 4242 4242"
                  autoComplete="cc-number"
                  inputMode="numeric"
                />
              </label>
              <label className={labelStyle}>
                <span className={labelText}>Cardholder name</span>
                <input
                  className={inputStyle}
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                  placeholder="JANE DOE"
                  autoComplete="cc-name"
                />
              </label>
              <div className="grid gap-4 md:grid-cols-3">
                <label className={labelStyle}>
                  <span className={labelText}>Expiry</span>
                  <input
                    className={`${inputStyle} mono`}
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    placeholder="MM/YY"
                    autoComplete="cc-exp"
                    inputMode="numeric"
                  />
                </label>
                <label className={labelStyle}>
                  <span className={labelText}>CVV</span>
                  <input
                    className={`${inputStyle} mono`}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="123"
                    autoComplete="cc-csc"
                    inputMode="numeric"
                  />
                </label>
                <label className={labelStyle}>
                  <span className={labelText}>Postal code</span>
                  <input
                    className={`${inputStyle} mono`}
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value.toUpperCase())}
                    placeholder="10001"
                    autoComplete="postal-code"
                  />
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-wait disabled:opacity-70"
          >
            {submitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Processing…
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                Pay & confirm
              </>
            )}
          </button>
        </form>
      )}

      {errors.length > 0 && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          <p className="font-bold">Booking failed:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/booking/${flightId}/seats`}
          className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-5 py-3 text-sm font-bold text-neutral-900 transition hover:border-neutral-950 dark:border-neutral-800 dark:text-white dark:hover:border-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>
    </div>
  );
}
