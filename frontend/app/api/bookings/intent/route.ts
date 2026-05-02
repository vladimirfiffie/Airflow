import { NextResponse } from "next/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe/server";

export const dynamic = "force-dynamic";

type IntentBody = {
  amountCents: number;
  flightId: string;
};

/**
 * Creates a Stripe PaymentIntent for the given amount. Returns null clientSecret
 * when Stripe isn't configured, signaling the client to skip payment.
 */
export async function POST(req: Request) {
  let body: IntentBody;
  try {
    body = (await req.json()) as IntentBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.amountCents || body.amountCents < 100) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  if (!isStripeConfigured()) {
    return NextResponse.json({ clientSecret: null, paymentIntentId: null, mode: "mock" });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ clientSecret: null, paymentIntentId: null, mode: "mock" });
  }

  try {
    const intent = await stripe.paymentIntents.create({
      amount: body.amountCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: { flightId: body.flightId },
    });
    return NextResponse.json({
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id,
      mode: "stripe",
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Stripe error" },
      { status: 500 },
    );
  }
}
