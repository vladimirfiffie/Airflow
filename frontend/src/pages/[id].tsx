"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { HoveredLink, Menu, MenuItem } from "@/components/ui/navbar-menu";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
   MOCK DATA — keyed by flight id
   ─────────────────────────────────────────────────────────────────────────── */
const FLIGHTS: Record<string, {
  id: string; airline: string; airlineCode: string;
  fromCode: string; fromCity: string; fromAirport: string;
  toCode: string; toCity: string; toAirport: string;
  depart: string; arrive: string; duration: string; date: string;
  stops: number; price: number; taxes: number; seats: number;
  amenities: string[];
}> = {
  "flight-1": { id: "flight-1", airline: "American Airlines", airlineCode: "AA", fromCode: "JFK", fromCity: "New York", fromAirport: "John F. Kennedy Intl.", toCode: "LAX", toCity: "Los Angeles", toAirport: "Los Angeles Intl.", depart: "07:00", arrive: "10:30", duration: "5h 30m", date: "Jun 15, 2026", stops: 0, price: 189, taxes: 28, seats: 4, amenities: ["Wi-Fi", "In-flight entertainment", "USB charging", "Complimentary snacks"] },
  "flight-2": { id: "flight-2", airline: "United Airlines", airlineCode: "UA", fromCode: "JFK", fromCity: "New York", fromAirport: "John F. Kennedy Intl.", toCode: "LAX", toCity: "Los Angeles", toAirport: "Los Angeles Intl.", depart: "10:15", arrive: "14:20", duration: "6h 05m", date: "Jun 15, 2026", stops: 1, price: 142, taxes: 22, seats: 12, amenities: ["Wi-Fi", "USB charging"] },
  "flight-3": { id: "flight-3", airline: "Delta Airlines", airlineCode: "DL", fromCode: "JFK", fromCity: "New York", fromAirport: "John F. Kennedy Intl.", toCode: "LAX", toCity: "Los Angeles", toAirport: "Los Angeles Intl.", depart: "13:45", arrive: "17:05", duration: "5h 20m", date: "Jun 15, 2026", stops: 0, price: 224, taxes: 33, seats: 2, amenities: ["Wi-Fi", "In-flight entertainment", "USB charging", "Complimentary meals", "Extra legroom"] },
  "flight-4": { id: "flight-4", airline: "Southwest", airlineCode: "WN", fromCode: "JFK", fromCity: "New York", fromAirport: "John F. Kennedy Intl.", toCode: "LAX", toCity: "Los Angeles", toAirport: "Los Angeles Intl.", depart: "16:30", arrive: "20:55", duration: "6h 25m", date: "Jun 15, 2026", stops: 1, price: 119, taxes: 18, seats: 8, amenities: ["USB charging", "Snacks for purchase"] },
  "flight-5": { id: "flight-5", airline: "JetBlue", airlineCode: "B6", fromCode: "JFK", fromCity: "New York", fromAirport: "John F. Kennedy Intl.", toCode: "LAX", toCity: "Los Angeles", toAirport: "Los Angeles Intl.", depart: "19:00", arrive: "22:25", duration: "5h 25m", date: "Jun 15, 2026", stops: 0, price: 209, taxes: 31, seats: 6, amenities: ["Wi-Fi", "In-flight entertainment", "USB charging", "Complimentary snacks", "Extra legroom"] },
  "flight-6": { id: "flight-6", airline: "American Airlines", airlineCode: "AA", fromCode: "JFK", fromCity: "New York", fromAirport: "John F. Kennedy Intl.", toCode: "LAX", toCity: "Los Angeles", toAirport: "Los Angeles Intl.", depart: "21:55", arrive: "01:30+1", duration: "5h 35m", date: "Jun 15, 2026", stops: 0, price: 174, taxes: 26, seats: 9, amenities: ["Wi-Fi", "USB charging", "Complimentary snacks"] },
  "flight-7": { id: "flight-7", airline: "United Airlines", airlineCode: "UA", fromCode: "SFO", fromCity: "San Francisco", fromAirport: "San Francisco Intl.", toCode: "ORD", toCity: "Chicago", toAirport: "O'Hare Intl.", depart: "06:30", arrive: "12:40", duration: "4h 10m", date: "Jun 15, 2026", stops: 0, price: 214, taxes: 32, seats: 5, amenities: ["Wi-Fi", "In-flight entertainment", "USB charging"] },
  "flight-8": { id: "flight-8", airline: "Delta Airlines", airlineCode: "DL", fromCode: "MIA", fromCity: "Miami", fromAirport: "Miami Intl.", toCode: "JFK", toCity: "New York", toAirport: "John F. Kennedy Intl.", depart: "09:00", arrive: "12:05", duration: "3h 05m", date: "Jun 15, 2026", stops: 0, price: 99, taxes: 15, seats: 14, amenities: ["Wi-Fi", "USB charging", "Complimentary snacks"] },
  "flight-9": { id: "flight-9", airline: "Alaska Airlines", airlineCode: "AS", fromCode: "BOS", fromCity: "Boston", fromAirport: "Logan Intl.", toCode: "SEA", toCity: "Seattle", toAirport: "Seattle-Tacoma Intl.", depart: "07:45", arrive: "11:30", duration: "6h 45m", date: "Jun 15, 2026", stops: 1, price: 278, taxes: 41, seats: 3, amenities: ["Wi-Fi", "In-flight entertainment", "USB charging", "Complimentary meals"] },
};

const AIRLINE_STYLES: Record<string, { bg: string; text: string }> = {
  AA: { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400" },
  UA: { bg: "bg-indigo-500/10", text: "text-indigo-600 dark:text-indigo-400" },
  DL: { bg: "bg-red-500/10", text: "text-red-600 dark:text-red-400" },
  WN: { bg: "bg-orange-500/10", text: "text-orange-500 dark:text-orange-400" },
  B6: { bg: "bg-cyan-500/10", text: "text-cyan-600 dark:text-cyan-400" },
  AS: { bg: "bg-teal-500/10", text: "text-teal-600 dark:text-teal-400" },
};

/* ─────────────────────────────────────────────────────────────────────────────
   SHARED UI
   ─────────────────────────────────────────────────────────────────────────── */
function PillButton({
  children, href, onClick,
  variant = "primary", size = "md", className, fullWidth, disabled,
}: {
  children: React.ReactNode; href?: string; onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "dark"; size?: "sm" | "md" | "lg";
  className?: string; fullWidth?: boolean; disabled?: boolean;
}) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none";
  const sizes = { sm: "px-4 py-1.5 text-[13px]", md: "px-5 py-2.5 text-sm", lg: "px-7 py-3.5 text-[15px]" };
  const variants = {
    primary: "bg-primary text-white shadow-[0_1px_3px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.15)] hover:brightness-110 hover:shadow-[0_4px_20px_rgba(1,124,238,0.5)]",
    secondary: "bg-foreground/6 dark:bg-white/10 text-foreground border border-foreground/10 dark:border-white/10 hover:bg-foreground/10",
    ghost: "bg-transparent text-foreground/60 hover:text-foreground hover:bg-foreground/6 dark:hover:bg-white/8",
    dark: "bg-white/12 text-white border border-white/20 hover:bg-white/22 backdrop-blur-sm",
  };
  const cls = cn(base, sizes[size], variants[variant], fullWidth && "w-full", className);
  if (href) return <a href={href} className={cls}>{children}</a>;
  return <button onClick={onClick} disabled={disabled} className={cls}>{children}</button>;
}

function Field({
  label, ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/38 pl-1">{label}</label>
      <input {...props}
        className="bg-foreground/[0.04] dark:bg-white/6 rounded-2xl px-4 py-3 text-sm font-medium text-foreground placeholder:text-foreground/22 border border-transparent focus:border-primary/40 focus:bg-primary/[0.04] outline-none transition-all duration-200" />
    </div>
  );
}

/* ─── Navbar ─────────────────────────────────────────────────────────────────── */
const NAV = [{ name: "Home", link: "/" }, { name: "Search", link: "/search" }];
function PageNavbar() {
  const [open, setOpen] = useState(false);
  return (
    <Navbar>
      <NavBody>
        <a href="/" className="flex items-center font-black text-[17px] tracking-tight text-foreground shrink-0 px-1 select-none">Airflow<span className="text-primary">.</span></a>
        <NavItems items={NAV} />
        <span className="w-px h-4 bg-border mx-1 shrink-0" aria-hidden />
        <ThemeToggle />
        <PillButton size="sm" href="/search">Book Now</PillButton>
      </NavBody>
      <MobileNav>
        <MobileNavHeader>
          <a href="/" className="flex items-center font-black text-[17px] tracking-tight text-foreground shrink-0 px-1 select-none">Airflow<span className="text-primary">.</span></a>
          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <MobileNavToggle isOpen={open} onClick={() => setOpen(v => !v)} />
          </div>
        </MobileNavHeader>
        <MobileNavMenu isOpen={open} onClose={() => setOpen(false)}>
          {NAV.map((item, i) => (
            <a key={i} href={item.link} onClick={() => setOpen(false)}
              className="w-full px-6 py-3.5 text-sm font-black uppercase tracking-widest text-muted-foreground hover:bg-foreground hover:text-background transition-colors duration-150 last:rounded-b-3xl">{item.name}</a>
          ))}
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   STEP INDICATOR
   ─────────────────────────────────────────────────────────────────────────── */
const STEPS = ["Details", "Passenger", "Payment", "Confirmed"];

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center mb-10">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1.5 shrink-0">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 shrink-0",
              i < current ? "bg-primary text-white" :
                i === current ? "bg-primary text-white ring-4 ring-primary/20" :
                  "bg-foreground/8 text-foreground/28"
            )}>
              {i < current
                ? <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                : i + 1}
            </div>
            <span className={cn("text-[10px] font-bold uppercase tracking-wider hidden sm:block",
              i === current ? "text-primary" : i < current ? "text-foreground/50" : "text-foreground/25")}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={cn("flex-1 h-px mx-2 mt-[-14px] transition-all duration-500",
              i < current ? "bg-primary" : "bg-foreground/10")} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FLIGHT SUMMARY CARD  (sidebar + header)
   ─────────────────────────────────────────────────────────────────────────── */
function FlightSummaryCard({ flight }: { flight: (typeof FLIGHTS)[string] }) {
  const style = AIRLINE_STYLES[flight.airlineCode] ?? { bg: "bg-primary/10", text: "text-primary" };
  const total = flight.price + flight.taxes;
  return (
    <div className="bg-white dark:bg-white/[0.04] rounded-3xl border border-black/[0.07] dark:border-white/[0.08] p-5 sticky top-24">
      {/* Airline */}
      <div className="flex items-center gap-3 mb-5 pb-5 border-b border-border/60">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0", style.bg, style.text)}>
          {flight.airlineCode}
        </div>
        <div>
          <p className="text-sm font-black text-foreground leading-tight">{flight.airline}</p>
          <p className="text-xs text-foreground/40 mt-0.5">{flight.date} · Economy</p>
        </div>
      </div>

      {/* Route */}
      <div className="flex items-center gap-3 mb-5">
        <div className="text-center shrink-0">
          <p className="text-xl font-black text-foreground tabular-nums">{flight.depart}</p>
          <p className="text-xs font-bold text-foreground/45">{flight.fromCode}</p>
        </div>
        <div className="flex-1 flex flex-col items-center gap-1">
          <p className="text-[10px] font-semibold text-foreground/35 uppercase tracking-wide">{flight.duration}</p>
          <div className="relative w-full h-px bg-foreground/12">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-foreground/25" />
          </div>
          <p className="text-[10px] font-semibold text-foreground/35">{flight.stops === 0 ? "Non-stop" : `${flight.stops} stop`}</p>
        </div>
        <div className="text-center shrink-0">
          <p className="text-xl font-black text-foreground tabular-nums">{flight.arrive}</p>
          <p className="text-xs font-bold text-foreground/45">{flight.toCode}</p>
        </div>
      </div>

      {/* Price breakdown */}
      <div className="space-y-2.5 mb-4 pt-4 border-t border-border/60">
        <div className="flex justify-between text-sm">
          <span className="text-foreground/45">Base fare</span>
          <span className="font-semibold text-foreground">${flight.price}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-foreground/45">Taxes & fees</span>
          <span className="font-semibold text-foreground">${flight.taxes}</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-border/60">
          <span className="font-black text-foreground">Total</span>
          <span className="font-black text-xl text-primary">${total}</span>
        </div>
      </div>

      {/* Trust signals */}
      <div className="space-y-2 pt-3 border-t border-border/60">
        <div className="flex items-center gap-2 text-[11px] text-foreground/38">
          <svg className="w-3.5 h-3.5 shrink-0 text-green-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          256-bit SSL encryption
        </div>
        <div className="flex items-center gap-2 text-[11px] text-foreground/38">
          <svg className="w-3.5 h-3.5 shrink-0 text-green-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Free cancellation within 24 hrs
        </div>
        <div className="flex items-center gap-2 text-[11px] text-foreground/38">
          <svg className="w-3.5 h-3.5 shrink-0 text-green-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
          No hidden charges
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   STEP 0 — Flight Details
   ─────────────────────────────────────────────────────────────────────────── */
function StepDetails({ flight, onNext }: { flight: (typeof FLIGHTS)[string]; onNext: () => void }) {
  const style = AIRLINE_STYLES[flight.airlineCode] ?? { bg: "bg-primary/10", text: "text-primary" };
  return (
    <div>
      <div className="bg-white dark:bg-white/[0.04] rounded-3xl border border-black/[0.07] dark:border-white/[0.08] p-6 mb-4">
        <h2 className="text-lg font-black text-foreground mb-6">Flight Details</h2>

        {/* Route visual */}
        <div className="flex items-start gap-4 mb-7">
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm shrink-0 mt-1", style.bg, style.text)}>
            {flight.airlineCode}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <div>
                <p className="text-3xl font-black text-foreground tabular-nums">{flight.depart}</p>
                <p className="text-sm font-bold text-foreground/50">{flight.fromCode}</p>
                <p className="text-xs text-foreground/35 mt-0.5 leading-tight max-w-[130px]">{flight.fromAirport}</p>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1.5 pb-2">
                <p className="text-xs font-semibold text-foreground/35 uppercase tracking-wider">{flight.duration}</p>
                <div className="relative w-full h-px bg-foreground/12">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-foreground/25" />
                </div>
                <p className="text-xs font-semibold text-foreground/35">{flight.stops === 0 ? "Non-stop" : `${flight.stops} stop`}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-foreground tabular-nums">{flight.arrive}</p>
                <p className="text-sm font-bold text-foreground/50">{flight.toCode}</p>
                <p className="text-xs text-foreground/35 mt-0.5 leading-tight max-w-[130px] text-right">{flight.toAirport}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Meta chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
          {[
            { label: "Airline", value: flight.airline },
            { label: "Date", value: flight.date },
            { label: "Class", value: "Economy" },
            { label: "Seats left", value: String(flight.seats) },
          ].map(({ label, value }) => (
            <div key={label} className="bg-foreground/[0.03] dark:bg-white/[0.04] rounded-2xl px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/35 mb-1">{label}</p>
              <p className="text-sm font-semibold text-foreground leading-tight">{value}</p>
            </div>
          ))}
        </div>

        {/* Amenities */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/35 mb-3">Included</p>
          <div className="flex flex-wrap gap-2">
            {flight.amenities.map((a) => (
              <span key={a} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/8 dark:bg-primary/12 text-primary text-xs font-semibold">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                {a}
              </span>
            ))}
          </div>
        </div>
      </div>
      <PillButton variant="primary" size="lg" fullWidth onClick={onNext}>
        Continue to Passenger Info →
      </PillButton>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   STEP 1 — Passenger Info
   ─────────────────────────────────────────────────────────────────────────── */
function StepPassenger({
  data, setData, onNext, onBack,
}: {
  data: Record<string, string>;
  setData: (k: string, v: string) => void;
  onNext: () => void; onBack: () => void;
}) {
  const valid = data.first && data.last && data.email && data.phone;
  return (
    <div>
      <div className="bg-white dark:bg-white/[0.04] rounded-3xl border border-black/[0.07] dark:border-white/[0.08] p-6 mb-4">
        <h2 className="text-lg font-black text-foreground mb-1">Passenger Information</h2>
        <p className="text-sm text-foreground/40 mb-6">Enter details exactly as they appear on your passport or ID.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="First Name" value={data.first} onChange={e => setData("first", e.target.value)} placeholder="Jane" />
          <Field label="Last Name" value={data.last} onChange={e => setData("last", e.target.value)} placeholder="Smith" />
          <Field label="Email Address" type="email" value={data.email} onChange={e => setData("email", e.target.value)} placeholder="jane@example.com" />
          <Field label="Phone Number" type="tel" value={data.phone} onChange={e => setData("phone", e.target.value)} placeholder="+1 (555) 000-0000" />
          <Field label="Date of Birth" type="date" value={data.dob} onChange={e => setData("dob", e.target.value)} />
          <Field label="Passport / ID" value={data.passport} onChange={e => setData("passport", e.target.value)} placeholder="A12345678" />
        </div>
      </div>
      <div className="flex gap-3">
        <PillButton variant="secondary" size="lg" onClick={onBack}>← Back</PillButton>
        <PillButton variant="primary" size="lg" fullWidth onClick={onNext} disabled={!valid}>
          Continue to Payment →
        </PillButton>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   STEP 2 — Payment
   ─────────────────────────────────────────────────────────────────────────── */
function StepPayment({
  flight, data, setData, onNext, onBack,
}: {
  flight: (typeof FLIGHTS)[string];
  data: Record<string, string>;
  setData: (k: string, v: string) => void;
  onNext: () => void; onBack: () => void;
}) {
  const [agreed, setAgreed] = useState(false);
  const valid = data.card && data.name && data.expiry && data.cvv && agreed;
  const total = flight.price + flight.taxes;

  // Format card number with spaces
  const handleCard = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 16);
    setData("card", digits.replace(/(.{4})/g, "$1 ").trim());
  };
  // Format expiry as MM / YY
  const handleExpiry = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    setData("expiry", digits.length > 2 ? `${digits.slice(0, 2)} / ${digits.slice(2)}` : digits);
  };

  return (
    <div>
      <div className="bg-white dark:bg-white/[0.04] rounded-3xl border border-black/[0.07] dark:border-white/[0.08] p-6 mb-4">
        <h2 className="text-lg font-black text-foreground mb-1">Payment Details</h2>
        <p className="text-sm text-foreground/40 mb-6">Mock checkout — no real payment is processed.</p>

        {/* Card preview */}
        <div className="relative h-36 rounded-2xl bg-gradient-to-br from-[var(--color-airflow-navy)] to-[var(--color-airflow-blue)] p-5 mb-6 overflow-hidden select-none">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(45deg,transparent,transparent 20px,rgba(255,255,255,0.5) 20px,rgba(255,255,255,0.5) 21px)" }} />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Airflow Pay</p>
              <div className="flex gap-1.5">
                <div className="w-7 h-5 rounded-full bg-white/30" />
                <div className="w-7 h-5 rounded-full bg-white/20 -ml-3" />
              </div>
            </div>
            <div>
              <p className="text-white font-black tracking-[0.2em] text-sm mb-1">{data.card || "•••• •••• •••• ••••"}</p>
              <div className="flex gap-6">
                <div><p className="text-white/40 text-[10px] uppercase tracking-wider">Cardholder</p><p className="text-white text-xs font-semibold">{data.name || "Your Name"}</p></div>
                <div><p className="text-white/40 text-[10px] uppercase tracking-wider">Expiry</p><p className="text-white text-xs font-semibold">{data.expiry || "MM / YY"}</p></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-5">
          <Field label="Card Number" value={data.card} onChange={e => handleCard(e.target.value)} placeholder="4242 4242 4242 4242" maxLength={19} />
          <Field label="Name on Card" value={data.name} onChange={e => setData("name", e.target.value)} placeholder="Jane Smith" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Expiry" value={data.expiry} onChange={e => handleExpiry(e.target.value)} placeholder="MM / YY" maxLength={7} />
            <Field label="CVV" value={data.cvv} onChange={e => setData("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="•••" maxLength={4} />
          </div>
        </div>

        <label className="flex items-start gap-3 cursor-pointer group">
          <div className={cn("mt-0.5 w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all duration-150",
            agreed ? "bg-primary border-primary" : "border-foreground/20 group-hover:border-primary/50")}>
            {agreed && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
          </div>
          <input type="checkbox" className="sr-only" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
          <span className="text-sm text-foreground/50 leading-relaxed">
            I agree to Airflow's <a href="#" className="text-primary underline underline-offset-2 hover:opacity-80">Terms of Service</a> and <a href="#" className="text-primary underline underline-offset-2 hover:opacity-80">Privacy Policy</a>.
          </span>
        </label>
      </div>

      <div className="flex gap-3">
        <PillButton variant="secondary" size="lg" onClick={onBack}>← Back</PillButton>
        <PillButton variant="primary" size="lg" fullWidth onClick={onNext} disabled={!valid}>
          Confirm &amp; Pay ${total} →
        </PillButton>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   STEP 3 — Confirmed
   ─────────────────────────────────────────────────────────────────────────── */
function StepConfirmed({
  flight, email,
}: {
  flight: (typeof FLIGHTS)[string]; email: string;
}) {
  const ref = `AF${Math.random().toString(36).toUpperCase().slice(2, 8)}`;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white dark:bg-white/[0.04] rounded-3xl border border-black/[0.07] dark:border-white/[0.08] p-10 text-center"
    >
      {/* Animated check */}
      <motion.div
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
        className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </motion.div>

      <h2 className="text-2xl font-black text-foreground mb-2">Booking Confirmed!</h2>
      <p className="text-foreground/50 text-sm mb-1">
        Your flight from <strong className="text-foreground">{flight.fromCode}</strong> → <strong className="text-foreground">{flight.toCode}</strong> on <strong className="text-foreground">{flight.date}</strong> is booked.
      </p>
      <p className="text-foreground/35 text-xs mb-8">Confirmation sent to <strong className="text-foreground">{email || "your email"}</strong></p>

      {/* Booking ref */}
      <div className="inline-flex items-center gap-3 px-6 py-3 bg-foreground/[0.04] dark:bg-white/5 rounded-2xl mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-foreground/35">Booking ref.</span>
        <span className="font-black text-lg text-foreground tracking-widest">{ref}</span>
      </div>

      {/* Itinerary summary */}
      <div className="flex items-center justify-center gap-4 text-center mb-10 p-5 bg-foreground/[0.02] dark:bg-white/[0.02] rounded-2xl">
        <div>
          <p className="text-2xl font-black text-foreground">{flight.depart}</p>
          <p className="text-sm font-bold text-foreground/45">{flight.fromCode}</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-[10px] font-semibold text-foreground/30 uppercase tracking-wider">{flight.duration}</p>
          <div className="w-16 h-px bg-foreground/12 my-1" />
          <p className="text-[10px] font-semibold text-foreground/30">{flight.stops === 0 ? "Non-stop" : `${flight.stops} stop`}</p>
        </div>
        <div>
          <p className="text-2xl font-black text-foreground">{flight.arrive}</p>
          <p className="text-sm font-bold text-foreground/45">{flight.toCode}</p>
        </div>
      </div>

      <div className="flex justify-center gap-3 flex-wrap">
        <PillButton variant="secondary" href="/">Back to Home</PillButton>
        <PillButton variant="primary" href="/search">Search More Flights</PillButton>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE
   ─────────────────────────────────────────────────────────────────────────── */
export default function FlightDetailPage({ params }: { params?: { id?: string } }) {
  // In real Next.js: const { id } = useParams() or passed via params
  const flightId = (params?.id as string) ?? "flight-1";
  const flight = FLIGHTS[flightId] ?? FLIGHTS["flight-1"];

  const [step, setStep] = useState(0);
  const [passenger, setPassenger] = useState<Record<string, string>>({ first: "", last: "", email: "", phone: "", dob: "", passport: "" });
  const [payment, setPayment] = useState<Record<string, string>>({ card: "", name: "", expiry: "", cvv: "" });

  const setP = (k: string, v: string) => setPassenger(p => ({ ...p, [k]: v }));
  const setPay = (k: string, v: string) => setPayment(p => ({ ...p, [k]: v }));

  const slideVariants = {
    enter: { opacity: 0, x: 24 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -24 },
  };

  return (
    <div className="min-h-screen bg-background">
      <PageNavbar />

      {/* Header */}
      <div className="bg-gradient-to-b from-[var(--color-airflow-navy)] via-[var(--color-airflow-blue)]/70 to-background pt-28 pb-0 px-6">
        <div className="max-w-5xl mx-auto pb-6 flex items-center gap-3">
          <PillButton variant="dark" size="sm" href="/search">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            All Flights
          </PillButton>
          <div>
            <p className="text-white/50 text-xs font-semibold uppercase tracking-widest">Book your flight</p>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {flight.fromCity} <span className="text-white/40 font-normal">→</span> {flight.toCity}
              <span className="ml-2 text-white/40 text-base font-semibold">{flight.date}</span>
            </h1>
          </div>
        </div>
        <div className="h-8 bg-gradient-to-b from-transparent to-background" />
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {step < 3 && <StepBar current={step} />}

        <div className={cn("grid gap-6", step < 3 ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1")}>
          {/* Main */}
          <div className={step < 3 ? "lg:col-span-2" : ""}>
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="details" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.22 }}>
                  <StepDetails flight={flight} onNext={() => setStep(1)} />
                </motion.div>
              )}
              {step === 1 && (
                <motion.div key="passenger" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.22 }}>
                  <StepPassenger data={passenger} setData={setP} onNext={() => setStep(2)} onBack={() => setStep(0)} />
                </motion.div>
              )}
              {step === 2 && (
                <motion.div key="payment" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.22 }}>
                  <StepPayment flight={flight} data={payment} setData={setPay} onNext={() => setStep(3)} onBack={() => setStep(1)} />
                </motion.div>
              )}
              {step === 3 && (
                <motion.div key="confirmed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                  <StepConfirmed flight={flight} email={passenger.email} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar price summary */}
          {step < 3 && (
            <div className="lg:col-span-1">
              <FlightSummaryCard flight={flight} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
