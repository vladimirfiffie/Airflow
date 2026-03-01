import type { Metadata } from "next";
import NavbarMenu from "@/components/navigation/navbar-menu";
import Footer from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Airflow Airport",
  description: "Frontend-first airport app built with Next.js App Router",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col text-slate-900 antialiased dark:text-slate-100">
        <NavbarMenu />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-6 md:py-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
