import type { Metadata } from "next";
import NavbarMenu from "@/components/navigation/navbar-menu";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Airflow",
  description: "Next-generation flight booking platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-white text-neutral-900 antialiased dark:bg-black dark:text-neutral-100">
        <ThemeProvider>
          <NavbarMenu />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
