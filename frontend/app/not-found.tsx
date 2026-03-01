import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[55vh] flex-col items-center justify-center gap-4 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">404</p>
      <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100">Route Not Found</h1>
      <p className="max-w-md text-slate-600 dark:text-slate-300">
        The requested page does not exist. Use navigation to continue.
      </p>
      <Link
        href="/"
        className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
      >
        Back to Home
      </Link>
    </div>
  );
}
