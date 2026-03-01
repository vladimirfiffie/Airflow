import type { AppProps } from "next/app";
import "@/app/globals.css";
import Footer from "@/components/footer";

export default function PagesApp({ Component, pageProps }: AppProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-6 md:py-10">
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}
