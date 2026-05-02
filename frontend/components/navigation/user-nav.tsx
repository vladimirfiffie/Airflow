"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LogOut, User } from "lucide-react";
import { getBrowserClient } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils";

type State =
  | { kind: "loading" }
  | { kind: "anon" }
  | { kind: "user"; email: string };

export default function UserNav({ compact = false }: { compact?: boolean }) {
  const [state, setState] = useState<State>({ kind: "loading" });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const supa = getBrowserClient();
    if (!supa) {
      setState({ kind: "anon" });
      return;
    }
    let cancelled = false;
    supa.auth.getUser().then(({ data }) => {
      if (cancelled) return;
      setState(data.user ? { kind: "user", email: data.user.email ?? "—" } : { kind: "anon" });
    });
    const { data: sub } = supa.auth.onAuthStateChange((_evt, session) => {
      setState(
        session?.user
          ? { kind: "user", email: session.user.email ?? "—" }
          : { kind: "anon" },
      );
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const onLogout = async () => {
    const supa = getBrowserClient();
    if (!supa) return;
    await supa.auth.signOut();
    setOpen(false);
  };

  if (state.kind === "loading") {
    return <div className={cn("h-9", compact ? "w-9" : "w-32")} aria-hidden />;
  }

  if (state.kind === "anon") {
    return (
      <>
        <Link
          href="/login"
          className="text-[13px] font-semibold text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
        >
          Log in
        </Link>
        <Link
          href="/sign-up"
          className="inline-flex items-center gap-2 rounded-md bg-neutral-950 px-4 py-2 text-[13px] font-bold text-white transition-colors hover:bg-orange-500 dark:bg-white dark:text-neutral-950 dark:hover:bg-orange-500 dark:hover:text-white"
        >
          Get Started
          <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
        </Link>
      </>
    );
  }

  const initials = state.email.charAt(0).toUpperCase();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-2 py-1.5 text-[13px] font-bold text-neutral-900 transition hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white dark:hover:border-neutral-600"
      >
        <span className="mono flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-[10px] font-black text-white">
          {initials}
        </span>
        {!compact && <span className="hidden md:inline">{state.email}</span>}
      </button>
      {open && (
        <div
          onMouseLeave={() => setOpen(false)}
          className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-md border border-neutral-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-950"
        >
          <div className="border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
            <p className="mono text-[10px] tracking-widest text-neutral-500 dark:text-neutral-400">
              SIGNED IN
            </p>
            <p className="mt-1 truncate text-sm font-bold text-neutral-950 dark:text-white">
              {state.email}
            </p>
          </div>
          <Link
            href="/booking"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900"
          >
            <User className="h-4 w-4" />
            My bookings
          </Link>
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-2 border-t border-neutral-200 px-4 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-neutral-800 dark:text-red-400 dark:hover:bg-red-950/30"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
