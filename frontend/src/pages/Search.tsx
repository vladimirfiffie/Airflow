"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Menu, MenuItem, HoveredLink, ProductItem } from "@/components/ui/navbar-menu";
import { cn } from "@/lib/utils";

/* ─── Types ──────────────────────────────────────────────────────────────────── */
interface Flight {
  id: string; from: string; fromCode: string; to: string; toCode: string;
  depart: string; arrive: string; duration: string; durationMins: number;
  stops: number; airline: string; airlineCode: string;
  price: number; seats: number; badge?: string;
}

/* ─── Mock data ──────────────────────────────────────────────────────────────── */
const ALL_FLIGHTS: Flight[] = [
  { id: "flight-1", from: "New York", fromCode: "JFK", to: "Los Angeles", toCode: "LAX", depart: "07:00", arrive: "10:30", duration: "5h 30m", durationMins: 330, stops: 0, airline: "American Airlines", airlineCode: "AA", price: 189, seats: 4, badge: "Non-stop" },
  { id: "flight-2", from: "New York", fromCode: "JFK", to: "Los Angeles", toCode: "LAX", depart: "10:15", arrive: "14:20", duration: "6h 05m", durationMins: 365, stops: 1, airline: "United Airlines", airlineCode: "UA", price: 142, seats: 12 },
  { id: "flight-3", from: "New York", fromCode: "JFK", to: "Los Angeles", toCode: "LAX", depart: "13:45", arrive: "17:05", duration: "5h 20m", durationMins: 320, stops: 0, airline: "Delta Airlines", airlineCode: "DL", price: 224, seats: 2, badge: "Almost full" },
  { id: "flight-4", from: "New York", fromCode: "JFK", to: "Los Angeles", toCode: "LAX", depart: "16:30", arrive: "20:55", duration: "6h 25m", durationMins: 385, stops: 1, airline: "Southwest", airlineCode: "WN", price: 119, seats: 8, badge: "Best value" },
  { id: "flight-5", from: "New York", fromCode: "JFK", to: "Los Angeles", toCode: "LAX", depart: "19:00", arrive: "22:25", duration: "5h 25m", durationMins: 325, stops: 0, airline: "JetBlue", airlineCode: "B6", price: 209, seats: 6 },
  { id: "flight-6", from: "New York", fromCode: "JFK", to: "Los Angeles", toCode: "LAX", depart: "21:55", arrive: "01:30", duration: "5h 35m", durationMins: 335, stops: 0, airline: "American Airlines", airlineCode: "AA", price: 174, seats: 9 },
];

/* ─── Enhanced Navbar Component ─────────────────────────────────────────────── */
function PageNavbar() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="fixed top-6 inset-x-0 max-w-2xl mx-auto z-50 px-4 md:px-0">
      <Menu setActive={setActive}>
        <div className="flex items-center mr-2 md:mr-4">
          <a href="/" className="font-black text-lg tracking-tighter text-foreground select-none">
            Airflow<span className="text-primary">.</span>
          </a>
        </div>

        <MenuItem setActive={setActive} active={active} item="Explore">
          <div className="grid grid-cols-2 gap-10 p-4">
            <ProductItem
              title="Global Routes"
              href="/destinations"
              src="https://images.unsplash.com/photo-1436491865332-7a61a109c0f2?q=80&w=140&h=70&auto=format&fit=crop"
              description="Direct flights to over 200 cities worldwide."
            />
            <ProductItem
              title="First Class"
              href="/experience"
              src="https://images.unsplash.com/photo-1540339832862-4745a9805ad0?q=80&w=140&h=70&auto=format&fit=crop"
              description="Redefining luxury in the clouds."
            />
          </div>
        </MenuItem>

        <MenuItem setActive={setActive} active={active} item="Services">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/search">Book Flights</HoveredLink>
            <HoveredLink href="/hotels">Partner Hotels</HoveredLink>
            <HoveredLink href="/cars">Car Rentals</HoveredLink>
            <HoveredLink href="/lounge">Airport Lounges</HoveredLink>
          </div>
        </MenuItem>

        <div className="flex items-center gap-3 pl-4 border-l border-border/50">
          <ThemeToggle />
          <PillButton size="sm" className="hidden md:flex">Check-in</PillButton>
        </div>
      </Menu>
    </div>
  );
}

/* ─── Main Page Component ─────────────────────────────────────────────────────── */
export default function SearchPage() {
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(true);
  const [sort, setSort] = useState("Cheapest");
  const [stops, setStops] = useState("Any");

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setSearched(true); }, 800);
  };

  const results = useMemo(() => {
    let list = [...ALL_FLIGHTS];
    if (stops === "Direct") list = list.filter(f => f.stops === 0);
    if (stops === "1 Stop") list = list.filter(f => f.stops === 1);
    if (sort === "Cheapest") list.sort((a, b) => a.price - b.price);
    if (sort === "Fastest") list.sort((a, b) => a.durationMins - b.durationMins);
    return list;
  }, [sort, stops]);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white">
      <PageNavbar />

      <header className="pt-40 pb-16 px-6 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/10 blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">Where to next?</h1>
            <p className="text-slate-400 font-medium">Find the best deals on global destinations.</p>
          </motion.div>
          <SearchForm onSearch={handleSearch} />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-border/50">
              <div>
                <h2 className="text-xl font-bold tracking-tight">{results.length} Flights Available</h2>
                <p className="text-sm text-muted-foreground">New York (JFK) → Los Angeles (LAX) • Jun 15, 2026</p>
              </div>
              <FilterBar sort={sort} setSort={setSort} stops={stops} setStops={setStops} />
            </div>

            <div className="grid gap-4">
              <AnimatePresence mode="popLayout">
                {results.map((flight, i) => (
                  <FlightCard key={flight.id} flight={flight} index={i} />
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

/* ─── UI Helper Components ─────────────────────────────────────────────────── */

function PillButton({ children, href, onClick, variant = "primary", size = "md", className, fullWidth }: any) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 active:scale-[0.97]";
  const sizes = { sm: "px-4 py-1.5 text-[13px]", md: "px-5 py-2.5 text-sm", lg: "px-7 py-3.5 text-[15px]" };
  const variants = {
    primary: "bg-primary text-white shadow-md hover:brightness-110",
    secondary: "bg-muted text-muted-foreground border border-border hover:bg-accent",
    ghost: "bg-transparent text-foreground/60 hover:text-foreground hover:bg-accent",
  };
  const cls = cn(base, sizes[size as keyof typeof sizes], variants[variant as keyof typeof variants], fullWidth && "w-full", className);
  return href ? <a href={href} className={cls}>{children}</a> : <button onClick={onClick} className={cls}>{children}</button>;
}

function SearchForm({ onSearch }: { onSearch: () => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-white/10">
      <div className="flex flex-col gap-1 px-5 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl">
        <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">From</label>
        <input className="bg-transparent outline-none text-sm font-bold text-foreground" defaultValue="New York (JFK)" />
      </div>
      <div className="flex flex-col gap-1 px-5 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl">
        <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">To</label>
        <input className="bg-transparent outline-none text-sm font-bold text-foreground" defaultValue="Los Angeles (LAX)" />
      </div>
      <div className="flex flex-col gap-1 px-5 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl">
        <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Date</label>
        <input type="date" className="bg-transparent outline-none text-sm font-bold text-foreground" defaultValue="2026-06-15" />
      </div>
      <PillButton onClick={onSearch} className="h-full rounded-2xl text-base">Search Flights</PillButton>
    </div>
  );
}

function FlightCard({ flight, index }: { flight: Flight; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
      className="p-6 bg-card border border-border rounded-[2rem] flex flex-col md:flex-row items-center gap-8 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all"
    >
      <div className="w-14 h-14 bg-primary/10 text-primary flex items-center justify-center rounded-2xl font-black text-lg">
        {flight.airlineCode}
      </div>
      <div className="flex-1 flex items-center justify-between w-full">
        <div className="text-center md:text-left">
          <div className="text-2xl font-black tracking-tighter tabular-nums">{flight.depart}</div>
          <div className="text-xs text-muted-foreground font-bold">{flight.fromCode}</div>
        </div>
        <div className="flex-1 px-4 md:px-12 flex flex-col items-center">
          <div className="text-[10px] font-bold text-muted-foreground mb-2 uppercase tracking-tighter">{flight.duration}</div>
          <div className="w-full h-[1.5px] bg-border relative">
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
          </div>
          <div className="text-[10px] font-bold text-primary mt-2 uppercase tracking-widest">{flight.stops === 0 ? "Non-stop" : "1 Stop"}</div>
        </div>
        <div className="text-center md:text-right">
          <div className="text-2xl font-black tracking-tighter tabular-nums">{flight.arrive}</div>
          <div className="text-xs text-muted-foreground font-bold">{flight.toCode}</div>
        </div>
      </div>
      <div className="flex items-center gap-6 w-full md:w-auto border-t md:border-t-0 md:border-l border-border pt-6 md:pt-0 md:pl-8">
        <div className="text-right">
          <div className="text-3xl font-black text-primary tracking-tighter">${flight.price}</div>
          <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Per Traveler</div>
        </div>
        <PillButton size="md" className="px-8">Select</PillButton>
      </div>
    </motion.div>
  );
}

function FilterBar({ sort, setSort, stops, setStops }: any) {
  return (
    <div className="flex gap-2 bg-muted p-1.5 rounded-full overflow-x-auto">
      {["Cheapest", "Fastest"].map(s => (
        <button
          key={s}
          onClick={() => setSort(s)}
          className={cn(
            "px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap",
            sort === s ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {s}
        </button>
      ))}
    </div>
  );
}

function SkeletonCard() {
  return <div className="h-32 w-full bg-muted/50 animate-pulse rounded-[2rem]" />;
}
