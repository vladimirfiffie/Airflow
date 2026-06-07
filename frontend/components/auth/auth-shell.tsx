"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import * as Label from "@radix-ui/react-label";
import { FaDiscord, FaGithub, FaGoogle } from "react-icons/fa";
import { CheckCircle2 } from "lucide-react";
import { getBrowserClient, isSupabaseConfiguredOnClient } from "@/lib/supabase/browser";

type Mode = "login" | "signup" | "forgot";

function formatName(value: string) {
  return value.replace(/[^a-zA-Z\s'-]/g, "").slice(0, 80);
}

type AuthShellProps = {
  mode: Mode;
  title: string;
  subtitle: string;
  footerText: string;
  footerLinkLabel: string;
  footerLinkHref: string;
};

const socialProviders = [
  { label: "GitHub", icon: FaGithub, provider: "github" as const },
  { label: "Discord", icon: FaDiscord, provider: "discord" as const },
  { label: "Google", icon: FaGoogle, provider: "google" as const },
];

const inputStyle =
  "w-full rounded-md border border-neutral-300 bg-white px-3 py-2.5 text-sm font-medium text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-orange-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white dark:placeholder-neutral-600";

export function AuthField({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autoComplete?: string;
}) {
  return (
    <div className="space-y-2">
      <Label.Root htmlFor={name} className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
        {label}
      </Label.Root>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputStyle}
      />
    </div>
  );
}

export default function AuthShell(props: AuthShellProps) {
  const router = useRouter();
  const supaConfigured = isSupabaseConfiguredOnClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!supaConfigured) {
      setError(
        "Auth not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.",
      );
      return;
    }
    const supa = getBrowserClient();
    if (!supa) {
      setError("Auth not available.");
      return;
    }

    setSubmitting(true);
    try {
      if (props.mode === "login") {
        const { error: err } = await supa.auth.signInWithPassword({ email, password });
        if (err) throw err;
        router.push("/");
        router.refresh();
      } else if (props.mode === "signup") {
        const { error: err } = await supa.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
            emailRedirectTo:
              typeof window !== "undefined" ? `${window.location.origin}/login` : undefined,
          },
        });
        if (err) throw err;
        setSuccess("Check your email to confirm the address, then log in.");
      } else if (props.mode === "forgot") {
        const { error: err } = await supa.auth.resetPasswordForEmail(email, {
          redirectTo:
            typeof window !== "undefined" ? `${window.location.origin}/login` : undefined,
        });
        if (err) throw err;
        setSuccess("Reset link sent. Check your inbox (and spam) for the next steps.");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const onSocial = async (provider: "github" | "discord" | "google") => {
    if (!supaConfigured) {
      setError("Auth not configured.");
      return;
    }
    const supa = getBrowserClient();
    if (!supa) return;
    const { error: err } = await supa.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo:
          typeof window !== "undefined" ? `${window.location.origin}/` : undefined,
      },
    });
    if (err) setError(err.message);
  };

  const submitLabel =
    props.mode === "login" ? "Log in" : props.mode === "signup" ? "Create account" : "Send reset link";

  return (
    <div className="grid min-h-[calc(100vh-4rem)] grid-cols-1 lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-16 md:px-12">
        <div className="w-full max-w-md">
          <p className="eyebrow">Airflow Account</p>
          <h1 className="display mt-4 text-4xl font-black text-neutral-950 md:text-5xl dark:text-white">
            {props.title}.
          </h1>
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">{props.subtitle}</p>

          {!supaConfigured && (
            <div className="mt-6 rounded-md border border-amber-300 bg-amber-50 px-3 py-2.5 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-500/[0.06] dark:text-amber-200">
              Demo mode — auth keys not configured. Form submissions will show a hint.
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-10 space-y-5">
            {props.mode === "signup" && (
              <AuthField
                label="Full name"
                type="text"
                name="name"
                value={name}
                onChange={(v) => setName(formatName(v))}
                placeholder="Jane Doe"
                autoComplete="name"
              />
            )}
            <AuthField
              label="Email"
              type="email"
              name="email"
              value={email}
              onChange={setEmail}
              placeholder="name@company.com"
              autoComplete="email"
            />
            {props.mode !== "forgot" && (
              <AuthField
                label="Password"
                type="password"
                name="password"
                value={password}
                onChange={setPassword}
                placeholder={
                  props.mode === "signup" ? "At least 6 characters" : "Enter your password"
                }
                autoComplete={
                  props.mode === "signup" ? "new-password" : "current-password"
                }
              />
            )}

            {props.mode === "login" && (
              <div className="flex items-center justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm font-bold text-neutral-700 transition hover:text-orange-500 dark:text-neutral-300"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            {props.mode === "signup" && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                By continuing, you agree to our{" "}
                <Link href="/help" className="font-bold underline hover:text-orange-500">
                  terms
                </Link>
                .
              </p>
            )}

            {props.mode === "forgot" && (
              <p className="rounded-md border border-orange-200 bg-orange-50 px-3 py-2.5 text-sm text-orange-800 dark:border-orange-900/40 dark:bg-orange-500/[0.06] dark:text-orange-300">
                Reset links expire after 30 minutes for security.
              </p>
            )}

            {error && (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                {error}
              </p>
            )}

            {success && (
              <p className="flex items-start gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-md bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-wait disabled:opacity-70"
            >
              {submitting ? "…" : submitLabel}
            </button>
          </form>

          {props.mode !== "forgot" && (
            <>
              <div className="my-8 flex items-center gap-3">
                <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-900" />
                <span className="mono text-[10px] font-semibold tracking-widest text-neutral-500 dark:text-neutral-400">
                  OR CONTINUE WITH
                </span>
                <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-900" />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {socialProviders.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => onSocial(p.provider)}
                    aria-label={`Continue with ${p.label}`}
                    className="flex h-11 items-center justify-center rounded-md border border-neutral-300 text-neutral-700 transition hover:border-neutral-950 hover:text-neutral-950 dark:border-neutral-800 dark:text-neutral-300 dark:hover:border-white dark:hover:text-white"
                  >
                    <p.icon className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </>
          )}

          <p className="mt-10 text-center text-sm text-neutral-600 dark:text-neutral-400">
            {props.footerText}{" "}
            <Link
              href={props.footerLinkHref}
              className="font-bold text-neutral-950 transition hover:text-orange-500 dark:text-white"
            >
              {props.footerLinkLabel}
            </Link>
          </p>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-neutral-950 lg:block">
        <div className="absolute inset-0 grid-lines opacity-40" aria-hidden />
        <div className="absolute -top-40 left-1/2 h-[500px] w-[80%] -translate-x-1/2 rounded-full bg-orange-500/30 blur-3xl" />

        <div className="relative flex h-full flex-col justify-between p-12">
          <div>
            <p className="mono text-xs text-neutral-400">
              <span className="inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-emerald-500" />{" "}
              LIVE · 1,284 flights tracked today
            </p>
          </div>

          <div>
            <p className="mono text-xs uppercase tracking-widest text-orange-400">Manifesto</p>
            <p className="display mt-6 text-5xl font-black leading-[1.05] tracking-tight text-white">
              Travel with <span className="text-orange-500">precision</span>, not friction.
            </p>
            <p className="mt-6 max-w-md text-neutral-400">
              The next-generation platform for seamless flight booking and trip management — built
              for people who actually fly.
            </p>
          </div>

          <div className="mono grid grid-cols-3 gap-6 border-t border-neutral-800 pt-8 text-xs text-neutral-400">
            <div>
              <p className="text-2xl font-black text-white">92%</p>
              <p className="mt-1">ON-TIME</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">130+</p>
              <p className="mt-1">ROUTES</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">24/7</p>
              <p className="mt-1">SUPPORT</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
