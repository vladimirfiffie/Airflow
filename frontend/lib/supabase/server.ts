import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";

/**
 * Service-role client — bypasses RLS. Use for admin reads/writes from API
 * routes (booking creation, etc.). Returns null when env vars are missing so
 * callers can fall back to mocks.
 */
export function getServiceClient(): SupabaseClient<Database> | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Auth-aware server client — reads/writes the user's auth cookie. Use for
 * any flow tied to the signed-in user (profile, "my bookings"). Falls back to
 * a non-functional shim (returns null) when env vars are missing.
 */
export async function getAuthClient(): Promise<SupabaseClient<Database> | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  const store = await cookies();
  return createServerClient<Database>(url, anon, {
    cookies: {
      getAll() {
        return store.getAll();
      },
      setAll(values: { name: string; value: string; options: CookieOptions }[]) {
        try {
          for (const { name, value, options } of values) {
            store.set(name, value, options);
          }
        } catch {
          // Read-only contexts (e.g. middleware-less RSC) — ignore.
        }
      },
    },
  });
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}
