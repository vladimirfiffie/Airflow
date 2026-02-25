"use client";
import { useState } from "react";
import { motion } from "motion/react";
import Footer from "@/components/Footer";
import { StickyBanner } from "@/components/ui/sticky-banner";
import AnimatedTooltipPreview from "@/components/animated-tooltip-demo";
import FeaturesSectionDemo from "@/components/features-section-demo-3";
import { Globe } from "@/components/features-section-demo-3";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { HoveredLink, Menu, MenuItem } from "@/components/ui/navbar-menu";
import { cn } from "@/lib/utils";

// ─── Navbar using navbar-menu ─────────────────────────────────────────────────
function HomeNavbar() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="fixed top-14 inset-x-0 z-40 flex justify-center px-4">
      {/* Single floating pill */}
      <div className="w-full max-w-3xl flex items-center justify-between px-6 py-2.5 rounded-2xl bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] gap-6">

        {/* Logo */}
        <a
          href="/"
          className="shrink-0 font-black text-lg tracking-tight text-foreground select-none"
        >
          Airflow<span className="text-primary">.</span>
        </a>

        {/* Centered menu inside pill */}
        <Menu setActive={setActive} >
          <MenuItem setActive={setActive} active={active} item="Flights">
            <div className="flex flex-col gap-2 text-sm min-w-[160px]">
              <HoveredLink href="#flights">Search Flights</HoveredLink>
              <HoveredLink href="#flights">Popular Routes</HoveredLink>
              <HoveredLink href="#flights">Hot Deals</HoveredLink>
              <HoveredLink href="#flights">Multi-city</HoveredLink>
            </div>
          </MenuItem>

          <MenuItem setActive={setActive} active={active} item="Destinations">
            <div className="flex flex-col gap-2 text-sm min-w-[160px]">
              <HoveredLink href="#">Americas</HoveredLink>
              <HoveredLink href="#">Europe</HoveredLink>
              <HoveredLink href="#">Asia Pacific</HoveredLink>
              <HoveredLink href="#">Middle East</HoveredLink>
            </div>
          </MenuItem>

          <MenuItem setActive={setActive} active={active} item="Help">
            <div className="flex flex-col gap-2 text-sm min-w-[160px]">
              <HoveredLink href="#">Manage Booking</HoveredLink>
              <HoveredLink href="#">Check-in</HoveredLink>
              <HoveredLink href="#">Customer Support</HoveredLink>
              <HoveredLink href="#">FAQs</HoveredLink>
            </div>
          </MenuItem>
        </Menu>

        {/* Right actions inside same pill */}
        <div className="flex items-center gap-2 shrink-0">
          <ThemeToggle />
          <PillButton size="sm">Book Now</PillButton>
        </div>

      </div>
    </div>
  );
}


// ─── Modern Pill Button ───────────────────────────────────────────────────────
// Rounded, glassy, with a subtle glow on hover. Used everywhere on the page.
function PillButton({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className,
  fullWidth,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "outline" | "dark";
  size?: "sm" | "md" | "lg";
  className?: string;
  fullWidth?: boolean;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 active:scale-[0.97]";

  const sizes: Record<string, string> = {
    sm: "px-4 py-1.5 text-[13px]",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-[15px]",
  };

  const variants: Record<string, string> = {
    primary:
      "bg-primary text-white shadow-[0_1px_3px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.15)] hover:brightness-110 hover:shadow-[0_4px_20px_rgba(1,124,238,0.45)]",
    secondary:
      "bg-foreground/6 dark:bg-white/10 text-foreground border border-foreground/10 dark:border-white/10 hover:bg-foreground/10 dark:hover:bg-white/15",
    ghost:
      "bg-transparent text-foreground/70 hover:text-foreground hover:bg-foreground/6 dark:hover:bg-white/8",
    outline:
      "bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white",
    dark:
      "bg-white/10 text-white border border-white/15 hover:bg-white/20 backdrop-blur-sm",
  };

  const cls = cn(base, sizes[size], variants[variant], fullWidth && "w-full", className);
  if (href) return <a href={href} className={cls}>{children}</a>;
  return <button onClick={onClick} className={cls}>{children}</button>;
}

// ─── Hero Search ──────────────────────────────────────────────────────────────
function HeroSearch() {
  const [tripType, setTripType] = useState<"round" | "one-way">("round");

  return (
    <div className="w-full max-w-4xl mx-auto mt-12">
      {/* Pill tab toggle */}
      <div className="inline-flex p-1 rounded-2xl bg-foreground/5 dark:bg-white/8 mb-5 gap-1">
        {(["round", "one-way"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTripType(t)}
            className={cn(
              "px-4 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer",
              tripType === t
                ? "bg-white dark:bg-zinc-800 text-foreground shadow-sm"
                : "text-foreground/50 hover:text-foreground/80"
            )}
          >
            {t === "round" ? "Round Trip" : "One Way"}
          </button>
        ))}
      </div>

      {/* Search card */}
      <div className="bg-white/90 dark:bg-black/60 backdrop-blur-2xl rounded-3xl border border-black/[0.06] dark:border-white/[0.08] shadow-[0_8px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.4)] p-5 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          {[
            { label: "From", placeholder: "New York (JFK)", type: "text" },
            { label: "To", placeholder: "Los Angeles (LAX)", type: "text" },
            { label: "Depart", placeholder: "", type: "date" },
            tripType === "round"
              ? { label: "Return", placeholder: "", type: "date" }
              : { label: "Passengers", placeholder: "1", type: "number" },
          ].map((f) => (
            <div key={f.label} className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 pl-1">
                {f.label}
              </label>
              <input
                type={f.type}
                placeholder={f.placeholder}
                defaultValue={f.type === "number" ? 1 : undefined}
                min={f.type === "number" ? 1 : undefined}
                max={f.type === "number" ? 9 : undefined}
                className="bg-foreground/4 dark:bg-white/6 rounded-2xl px-4 py-2.5 text-sm font-medium text-foreground placeholder:text-foreground/25 border border-transparent focus:border-primary/40 focus:bg-primary/4 outline-none transition-all duration-200"
              />
            </div>
          ))}
        </div>

        <PillButton variant="primary" size="lg" fullWidth>
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          Search Flights
        </PillButton>
      </div>
    </div>
  );
}

// ─── Stats Row ────────────────────────────────────────────────────────────────
const STATS = [
  { value: "500+", label: "Destinations" },
  { value: "2M+", label: "Happy Flyers" },
  { value: "99.2%", label: "On-time Rate" },
  { value: "24/7", label: "Support" },
];

function StatsRow() {
  return (
    <div className="w-full max-w-4xl mx-auto mt-14 grid grid-cols-2 md:grid-cols-4 gap-3">
      {STATS.map(({ value, label }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.07 }}
          className="bg-white/60 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-black/[0.06] dark:border-white/[0.07] flex flex-col items-center justify-center py-7 px-4"
        >
          <span className="text-3xl font-black text-primary tracking-tight">{value}</span>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-foreground/40 mt-1">{label}</span>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Popular Routes ───────────────────────────────────────────────────────────
const ROUTES = [
  { from: "NYC", to: "LAX", price: "$189", time: "5h 30m", airline: "AA" },
  { from: "SFO", to: "ORD", price: "$214", time: "4h 10m", airline: "UA" },
  { from: "MIA", to: "JFK", price: "$99", time: "3h 05m", airline: "DL" },
  { from: "BOS", to: "SEA", price: "$278", time: "6h 45m", airline: "AS" },
];

function PopularRoutes() {
  return (
    <section id="flights" className="max-w-7xl mx-auto px-6 md:px-12 py-24">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-2">Hot Deals</p>
          <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-none">
            Popular Routes
          </h2>
        </div>
        <PillButton variant="ghost" size="sm">View All →</PillButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {ROUTES.map((route, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: 0.4 }}
            className="group flex items-center justify-between bg-white dark:bg-white/[0.04] rounded-2xl border border-black/[0.07] dark:border-white/[0.08] p-5 hover:border-primary/40 hover:shadow-[0_4px_24px_rgba(1,124,238,0.1)] dark:hover:shadow-[0_4px_24px_rgba(1,124,238,0.18)] transition-all duration-300 text-left w-full cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black text-xs shrink-0">
                {route.airline}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-lg font-black text-foreground">{route.from}</span>
                  <span className="text-foreground/25">→</span>
                  <span className="text-lg font-black text-foreground">{route.to}</span>
                </div>
                <span className="text-[11px] text-foreground/40 font-medium">{route.time}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-primary">{route.price}</div>
              <div className="text-[10px] text-foreground/35 mt-0.5">per person</div>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}

// ─── Globe CTA ────────────────────────────────────────────────────────────────
function GlobeCTA() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-airflow-navy)] py-24 px-6 md:px-12">
      <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-airflow-navy)] to-[var(--color-airflow-blue)]/20 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 z-10">
        <div className="flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-4">Fly Anywhere</p>
          <h2 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-tight mb-6">
            The Whole<br />World Awaits
          </h2>
          <p className="text-white/50 text-sm leading-relaxed max-w-sm mb-8">
            With over 500 destinations across 6 continents, Airflow connects you to every corner of the globe.
          </p>
          <div className="flex gap-3 flex-wrap">
            <PillButton
              variant="primary"
              size="lg"
              className="shadow-[0_4px_20px_rgba(1,124,238,0.5)]"
            >
              Explore Destinations
            </PillButton>
            <PillButton variant="dark" size="lg">
              Learn More →
            </PillButton>
          </div>
        </div>
        <div className="flex-1 flex justify-center relative h-80 w-full">
          <Globe className="absolute -right-20 -bottom-40 opacity-80" />
        </div>
      </div>
    </section>
  );
}

// ─── Team Section ─────────────────────────────────────────────────────────────
function TeamSection() {
  return (
    <section id="team" className="max-w-7xl mx-auto px-6 md:px-12 py-24 text-center">
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-3">The Crew</p>
      <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight mb-4">
        Meet Our Team
      </h2>
      <p className="text-foreground/45 text-sm max-w-md mx-auto mb-12 leading-relaxed">
        A passionate crew of aviation and tech enthusiasts dedicated to making your travel seamless.
      </p>
      <AnimatedTooltipPreview />
    </section>
  );
}

// ─── Main Home Page ───────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Promo banner */}
      <StickyBanner className="bg-gradient-to-r from-[var(--color-airflow-navy)] to-[var(--color-airflow-blue)]">
        <p className="mx-0 max-w-[90%] text-white text-xs font-medium drop-shadow-md">
          ✈️ Summer Sale — Up to 40% off international flights.{" "}
          <a href="#flights" className="font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity">
            Book before June 30 →
          </a>
        </p>
      </StickyBanner>

      {/* Floating navbar-menu bar */}
      <HomeNavbar />

      <main className="flex-1">
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-48 pb-24 overflow-hidden">
          {/* Ambient blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/6 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-0 w-80 h-80 bg-[var(--color-airflow-orange)]/6 rounded-full blur-3xl" />
            <div className="absolute top-24 left-0 w-64 h-64 bg-primary/4 rounded-full blur-3xl" />
          </div>

          {/* Subtle grid texture */}
          <div
            className="absolute inset-0 opacity-[0.025] pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg,transparent,transparent 39px,currentColor 39px,currentColor 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,currentColor 39px,currentColor 40px)",
            }}
          />

          {/* Hero copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 text-center max-w-5xl"
          >
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 dark:bg-primary/15 border border-primary/20 mb-8 text-[11px] font-semibold text-primary">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full bg-primary opacity-75 rounded-full" />
                <span className="relative inline-flex h-1.5 w-1.5 bg-primary rounded-full" />
              </span>
              Now booking 2026 flights
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-[100px] font-black text-foreground tracking-tight leading-[0.95] mb-6">
              Fly<span className="text-primary">.</span>
              <br />
              <span className="text-foreground/80">Smarter</span>
              <span className="text-[var(--color-airflow-orange)]">.</span>
            </h1>

            <p className="text-foreground/55 text-base md:text-lg font-normal max-w-md mx-auto mb-10 leading-relaxed">
              Airflow finds you the best flights at the lowest prices — instantly. No hidden fees, no surprises.
            </p>

            <div className="flex items-center justify-center gap-3 flex-wrap">
              <PillButton variant="primary" size="lg" href="#flights">
                Find Flights
              </PillButton>
              <PillButton variant="secondary" size="lg" href="#features">
                See How It Works
              </PillButton>
            </div>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full"
          >
            <HeroSearch />
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="relative z-10 w-full"
          >
            <StatsRow />
          </motion.div>
        </section>

        {/* ── Popular Routes ────────────────────────────────────── */}
        <PopularRoutes />

        {/* ── Features ──────────────────────────────────────────── */}
        <section id="features" className="bg-background border-t border-border/50">
          <FeaturesSectionDemo />
        </section>

        {/* ── Globe CTA ─────────────────────────────────────────── */}
        <GlobeCTA />

        {/* ── Team ──────────────────────────────────────────────── */}
        <TeamSection />
      </main>

      <Footer />
    </div>
  );
}
