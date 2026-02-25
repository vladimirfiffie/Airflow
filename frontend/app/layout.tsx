import type { Metadata } from "next";
import NavbarMenu from "@/components/navigation/navbar-menu";
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
    <html lang="en">
      <body>
        <NavbarMenu />
        <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">{children}</main>
      </body>
    </html>
  );
}
