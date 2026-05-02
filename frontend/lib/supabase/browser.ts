"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

let cached: SupabaseClient<Database> | null = null;

/**
 * Browser singleton for Supabase Auth (signup/login/session).
 * Returns null when env vars are missing — callers should treat that as
 * "auth not configured yet" and surface a helpful message.
 */
export function getBrowserClient(): SupabaseClient<Database> | null {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  cached = createBrowserClient<Database>(url, anon);
  return cached;
}

export function isSupabaseConfiguredOnClient(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
