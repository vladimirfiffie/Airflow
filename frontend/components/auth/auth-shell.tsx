"use client";

import Link from "next/link";
import * as Label from "@radix-ui/react-label";
import { FaDiscord, FaGithub, FaGoogle } from "react-icons/fa";
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
  { label: "Google", icon: FaGoogle, href: "#" },
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
    <div className="space-y-2">
      <Label.Root className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
        {label}
      </Label.Root>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2.5 text-sm font-medium text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-orange-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white dark:placeholder-neutral-600"
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
    <div className="grid min-h-[calc(100vh-4rem)] grid-cols-1 lg:grid-cols-2">
      {/* Form Side */}
      <div className="flex items-center justify-center px-6 py-16 md:px-12">
        <div className="w-full max-w-md">
          <p className="eyebrow">Airflow Account</p>
          <h1 className="display mt-4 text-4xl font-black text-neutral-950 md:text-5xl dark:text-white">
            {title}.
          </h1>
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">{subtitle}</p>

          <form className="mt-10 space-y-5">
            {children}
            <button
              type="submit"
              className="w-full rounded-md bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
            >
              Continue
            </button>
          </form>

          <div className="my-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-900" />
            <span className="mono text-[10px] font-semibold tracking-widest text-neutral-500 dark:text-neutral-400">
              OR CONTINUE WITH
            </span>
            <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-900" />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {socialProviders.map((provider) => (
              <a
                key={provider.label}
                href={provider.href}
                aria-label={`Continue with ${provider.label}`}
                className="flex h-11 items-center justify-center rounded-md border border-neutral-300 text-neutral-700 transition hover:border-neutral-950 hover:text-neutral-950 dark:border-neutral-800 dark:text-neutral-300 dark:hover:border-white dark:hover:text-white"
              >
                <provider.icon className="h-4 w-4" />
              </a>
            ))}
          </div>

          <p className="mt-10 text-center text-sm text-neutral-600 dark:text-neutral-400">
            {footerText}{" "}
            <Link
              href={footerLinkHref}
              className="font-bold text-neutral-950 transition hover:text-orange-500 dark:text-white"
            >
              {footerLinkLabel}
            </Link>
          </p>
        </div>
      </div>

      {/* Decorative side */}
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
