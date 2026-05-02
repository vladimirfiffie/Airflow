import type { AppProps } from "next/app";
import "@/app/globals.css";
import Footer from "@/components/footer";

export default function PagesApp({ Component, pageProps }: AppProps) {
  return (
    <div className="flex min-h-screen flex-col bg-black text-neutral-100">
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-24 md:px-6">
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}
