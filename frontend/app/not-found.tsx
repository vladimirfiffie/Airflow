import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="text-8xl font-black gradient-text">404</p>
      <h1 className="text-3xl font-black text-white">Page Not Found</h1>
      <p className="max-w-md text-neutral-400">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
      >
        Back to Home
      </Link>
    </div>
  );
}
