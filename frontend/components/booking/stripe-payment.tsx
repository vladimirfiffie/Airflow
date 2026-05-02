"use client";

import { useEffect, useState, FormEvent } from "react";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { Lock } from "lucide-react";

let stripePromise: Promise<Stripe | null> | null = null;
function getStripePromise() {
  if (stripePromise) return stripePromise;
  const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!pk) return null;
  stripePromise = loadStripe(pk);
  return stripePromise;
}

type StripePaymentProps = {
  amountCents: number;
  flightId: string;
  onPaymentReady: (paymentIntentId: string) => void | Promise<void>;
  isProcessing: boolean;
};

export default function StripePayment(props: StripePaymentProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [intentId, setIntentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/bookings/intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amountCents: props.amountCents, flightId: props.flightId }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) setError(data.error);
        else {
          setClientSecret(data.clientSecret);
          setIntentId(data.paymentIntentId);
        }
      })
      .catch((e) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [props.amountCents, props.flightId]);

  const stripe = getStripePromise();

  if (!stripe || !clientSecret || !intentId) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-900 dark:bg-neutral-950">
        {error ? (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : (
          <p className="mono text-xs text-neutral-500">LOADING SECURE PAYMENT…</p>
        )}
      </div>
    );
  }

  return (
    <Elements
      stripe={stripe}
      options={{
        clientSecret,
        appearance: {
          theme: "flat",
          variables: {
            colorPrimary: "#f97316",
            colorBackground: "#ffffff",
            colorText: "#0a0a0a",
            colorDanger: "#dc2626",
            fontFamily: "Plus Jakarta Sans, system-ui, sans-serif",
            borderRadius: "8px",
          },
        },
      }}
    >
      <StripeForm
        intentId={intentId}
        onPaymentReady={props.onPaymentReady}
        isProcessing={props.isProcessing}
      />
    </Elements>
  );
}

function StripeForm({
  intentId,
  onPaymentReady,
  isProcessing,
}: {
  intentId: string;
  onPaymentReady: (intentId: string) => void | Promise<void>;
  isProcessing: boolean;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError(null);

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (confirmError) {
      setError(confirmError.message ?? "Payment failed");
      setSubmitting(false);
      return;
    }

    await onPaymentReady(intentId);
    // Parent handles redirect
  };

  const disabled = submitting || isProcessing;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-900 dark:bg-neutral-950">
        <p className="eyebrow !text-neutral-500 dark:!text-neutral-400">Card details</p>
        <div className="mt-5">
          <PaymentElement />
        </div>
      </div>

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={disabled}
        className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-wait disabled:opacity-70"
      >
        {disabled ? (
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
  );
}
