import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden px-4 text-center">
      <div className="absolute inset-0 grid-lines opacity-50" aria-hidden />
      <div className="relative">
        <p className="mono text-xs text-neutral-500 dark:text-neutral-400">
          ERROR · STATUS 404
        </p>
        <p className="display mt-6 text-[28vw] font-black leading-none tracking-tight text-neutral-950 md:text-[260px] dark:text-white">
          4<span className="text-orange-500">0</span>4
        </p>
        <h1 className="display mt-4 text-3xl font-black text-neutral-950 md:text-5xl dark:text-white">
          Lost in transit.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-neutral-600 dark:text-neutral-400">
          The page you&apos;re looking for has been rerouted or never existed.
          Let&apos;s get you back on course.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            Back to home
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/search"
            className="rounded-md border border-neutral-300 px-6 py-3 text-sm font-bold text-neutral-900 transition hover:border-neutral-950 dark:border-neutral-800 dark:text-white dark:hover:border-white"
          >
            Search flights
          </Link>
        </div>
      </div>
    </div>
  );
}
