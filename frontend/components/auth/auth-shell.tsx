"use client";

import Link from "next/link";
import { Plane } from "lucide-react";
import * as Label from "@radix-ui/react-label";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { ReactNode } from "react";
import { FaGoogle } from "react-icons/fa";

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
      <Label.Root className="text-sm font-medium text-neutral-300">{label}</Label.Root>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-sm text-white placeholder-neutral-600 outline-none transition focus:border-blue-500"
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
    <div className="flex min-h-screen items-center justify-center px-4 py-24">
      <div className="w-full max-w-6xl overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950">
        <div className="grid min-h-[620px] lg:grid-cols-2">
          {/* Form Side */}
          <div className="flex flex-col justify-between p-8 md:p-10">
            <div>
              <Link href="/" className="flex items-center gap-2 text-sm font-black">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600">
                  <Plane className="h-3.5 w-3.5 text-white" />
                </div>
                AIRFLOW
              </Link>

              <h1 className="mt-8 text-3xl font-black text-white">{title}</h1>
              <p className="mt-2 max-w-md text-sm text-neutral-400">{subtitle}</p>

              <form className="mt-8 space-y-5">
                {children}
                <button
                  type="submit"
                  className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
                >
                  Continue
                </button>
              </form>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-neutral-800" />
                <span className="text-xs font-medium text-neutral-500">or continue with</span>
                <div className="h-px flex-1 bg-neutral-800" />
              </div>

              <div className="flex items-center gap-2">
                {socialProviders.map((provider) => (
                  <a
                    key={provider.label}
                    href={provider.href}
                    aria-label={`Continue with ${provider.label}`}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-700 text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
                  >
                    <provider.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-neutral-500">
              {footerText}{" "}
              <Link href={footerLinkHref} className="font-bold text-white transition hover:text-blue-400">
                {footerLinkLabel}
              </Link>
            </p>
          </div>

          {/* Decorative Side */}
          <div className="relative hidden overflow-hidden lg:block">
            <div className="absolute inset-0 bg-neutral-900" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(59,130,246,0.15),transparent_50%),radial-gradient(circle_at_70%_70%,rgba(139,92,246,0.1),transparent_50%)]" />
            <div className="absolute inset-0 dot-grid opacity-40" />
            <div className="relative flex h-full flex-col items-center justify-center p-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/20">
                <Plane className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-white">Welcome to Airflow</h3>
              <p className="mt-2 max-w-xs text-center text-sm text-neutral-400">
                The next-generation platform for seamless flight booking and trip management.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
