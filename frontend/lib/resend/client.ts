import { Resend } from "resend";

let cached: Resend | null = null;

export function getResend(): Resend | null {
  if (cached) return cached;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  cached = new Resend(key);
  return cached;
}

export function getResendFrom(): string {
  return process.env.RESEND_FROM_EMAIL || "Airflow <onboarding@resend.dev>";
}

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}
