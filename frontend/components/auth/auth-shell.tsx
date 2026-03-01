"use client";

import Link from "next/link";
import * as Label from "@radix-ui/react-label";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { SiMicrosoftazure } from "react-icons/si";
import { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footerText: string;
  footerLinkLabel: string;
  footerLinkHref: string;
};

const socialProviders = [
  { label: "GitHub", icon: FaGithub, href: "#" },
  { label: "Discord", icon: FaDiscord, href: "#" },
  { label: "Microsoft Azure", icon: SiMicrosoftazure, href: "#" },
];

export function AuthField({
  label,
  type,
  name,
  placeholder,
}: {
  label: string;
  type: string;
  name: string;
  placeholder: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label.Root className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</Label.Root>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.05)] outline-none transition focus:ring-2 focus:ring-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-slate-500"
      />
    </div>
  );
}

export default function AuthShell({
  title,
  subtitle,
  children,
  footerText,
  footerLinkLabel,
  footerLinkHref,
}: AuthShellProps) {
  return (
    <section className="mx-auto w-full max-w-6xl overflow-hidden rounded-xl border border-slate-200/90 bg-white/85 shadow-lg shadow-slate-300/25 backdrop-blur dark:border-slate-700 dark:bg-slate-950/75 dark:shadow-slate-950/40">
      <div className="grid min-h-[620px] lg:grid-cols-2">
        <div className="flex flex-col justify-between p-8 md:p-10">
          <div>
            <Link
              href="/"
              className="inline-flex items-center rounded-md border border-slate-300 px-2.5 py-1 text-xs font-bold tracking-[0.18em] text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              AIRFLOW
            </Link>
            <h1 className="mt-8 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">{title}</h1>
            <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-300">{subtitle}</p>

            <form className="mt-8 space-y-5">
              {children}
              <button
                type="submit"
                className="w-full rounded-md border border-slate-400 bg-transparent px-4 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-slate-100 dark:border-slate-500 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                Continue
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                or sign in with
              </span>
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            </div>

            <div className="flex items-center gap-2">
              {socialProviders.map((provider) => (
                <a
                  key={provider.label}
                  href={provider.href}
                  aria-label={`Continue with ${provider.label}`}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-300 text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <provider.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-300">
            {footerText}{" "}
            <Link href={footerLinkHref} className="font-black text-slate-900 dark:text-slate-100">
              {footerLinkLabel}
            </Link>
          </p>
        </div>

        <div className="relative hidden overflow-hidden lg:block">
          <div className="absolute inset-0 bg-[#0d1b20]" />
          <div className="absolute inset-0 animate-[mesh_16s_ease-in-out_infinite] bg-[radial-gradient(circle_at_20%_30%,rgba(13,148,136,0.28),transparent_45%),radial-gradient(circle_at_75%_25%,rgba(20,184,166,0.22),transparent_50%),radial-gradient(circle_at_60%_80%,rgba(15,23,42,0.8),transparent_55%),linear-gradient(160deg,#111827_10%,#0f172a_60%,#1f2937_100%)]" />
          <svg
            viewBox="0 0 800 800"
            className="absolute inset-0 h-full w-full opacity-60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M0 180 C150 260, 250 60, 400 140 C550 220, 640 120, 800 200" stroke="rgba(148,163,184,0.22)" />
            <path d="M0 360 C140 420, 260 260, 400 320 C540 380, 650 260, 800 340" stroke="rgba(45,212,191,0.22)" />
            <path d="M0 540 C180 600, 260 440, 420 500 C580 560, 690 470, 800 540" stroke="rgba(148,163,184,0.22)" />
            <path d="M0 680 C160 740, 280 620, 420 660 C560 700, 700 630, 800 690" stroke="rgba(45,212,191,0.24)" />
          </svg>
        </div>
      </div>
    </section>
  );
}
