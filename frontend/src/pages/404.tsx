"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion"; // Changed to standard framer-motion import
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Menu, MenuItem, HoveredLink } from "@/components/ui/navbar-menu";
import { cn } from "@/lib/utils";

/* ─── PageNavbar (Integrated with navbar-menu) ─────────────────────────────── */
function PageNavbar() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="fixed top-10 inset-x-0 max-w-2xl mx-auto z-50">
      <Menu setActive={setActive}>
        {/* Logo Section */}
        <div className="flex items-center mr-4">
          <a href="/" className="font-black text-[17px] tracking-tight text-foreground select-none">
            Airflow<span className="text-primary">.</span>
          </a>
        </div>

        <MenuItem setActive={setActive} active={active} item="Services">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/search">Flight Search</HoveredLink>
            <HoveredLink href="/check-in">Online Check-in</HoveredLink>
            <HoveredLink href="/status">Flight Status</HoveredLink>
            <HoveredLink href="/lounge">Lounges</HoveredLink>
          </div>
        </MenuItem>

        <MenuItem setActive={setActive} active={active} item="Destinations">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/europe">Europe</HoveredLink>
            <HoveredLink href="/asia">Asia</HoveredLink>
            <HoveredLink href="/americas">Americas</HoveredLink>
          </div>
        </MenuItem>

        <MenuItem setActive={setActive} active={active} item="Help">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/support">Support Center</HoveredLink>
            <HoveredLink href="/faq">FAQs</HoveredLink>
          </div>
        </MenuItem>

        {/* Action Items */}
        <div className="flex items-center gap-4 pl-4 border-l border-border/50">
          <ThemeToggle />
          <PillButton size="sm" href="/search">Book Now</PillButton>
        </div>
      </Menu>
    </div>
  );
}

/* ─── PillButton ─────────────────────────────────────────────────────────────── */
function PillButton({ children, href, onClick, variant = "primary", size = "md", className }: {
  children: React.ReactNode; href?: string; onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost"; size?: "sm" | "md" | "lg"; className?: string;
}) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 active:scale-[0.97]";
  const sizes = { sm: "px-4 py-1.5 text-[13px]", md: "px-5 py-2.5 text-sm", lg: "px-7 py-3.5 text-[15px]" };
  const variants = {
    primary: "bg-primary text-white shadow-sm hover:brightness-110",
    secondary: "bg-foreground/5 text-foreground border border-foreground/10 hover:bg-foreground/10",
    ghost: "bg-transparent text-foreground/60 hover:text-foreground hover:bg-foreground/6",
  };
  const cls = cn(base, sizes[size as keyof typeof sizes], variants[variant as keyof typeof variants], className);
  if (href) return <a href={href} className={cls}>{children}</a>;
  return <button onClick={onClick} className={cls}>{children}</button>;
}

/* ─── Animated plane ─────────────────────────────────────────────────────────── */
function FloatingPlane() {
  return (
    <motion.div
      animate={{ y: [-8, 8, -8], rotate: [-2, 2, -2] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="text-8xl select-none"
    >
      ✈️
    </motion.div>
  );
}

/* ─── Countdown redirect ─────────────────────────────────────────────────────── */
function useCountdown(from: number) {
  const [count, setCount] = useState(from);
  useEffect(() => {
    if (count <= 0) { window.location.href = "/"; return; }
    const id = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(id);
  }, [count]);
  return count;
}

/* ─── Main 404 Component ─────────────────────────────────────────────────────── */
export default function NotFound() {
  const count = useCountdown(15);

  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary selection:text-white">
      <PageNavbar />

      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <main className="flex-1 flex items-center justify-center px-6 pt-32 pb-20">
        <motion.div
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          animate="show"
          className="text-center max-w-lg"
        >
          <motion.div variants={item} className="mb-12 flex justify-center">
            <FloatingPlane />
          </motion.div>

          <motion.div variants={item} className="mb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Error 404</span>
          </motion.div>

          <motion.h1 variants={item}
            className="text-6xl md:text-7xl font-black text-foreground tracking-tighter leading-none mb-6">
            Lost in<br />
            <span className="text-primary">Airspace</span>.
          </motion.h1>

          <motion.p variants={item}
            className="text-muted-foreground text-base md:text-lg leading-relaxed mb-10 max-w-xs mx-auto font-medium">
            This page doesn't appear to exist. Let's get you back on course.
          </motion.p>

          <motion.div variants={item} className="flex items-center justify-center gap-3 flex-wrap mb-12">
            <PillButton variant="primary" size="lg" href="/">Take Me Home</PillButton>
            <PillButton variant="secondary" size="lg" href="/search">Search Flights</PillButton>
          </motion.div>

          {/* Countdown Indicator */}
          <motion.div variants={item}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-secondary/50 backdrop-blur-md border border-border">
            <div className="relative w-6 h-6">
              <svg className="w-6 h-6 -rotate-90" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" className="fill-none stroke-foreground/10" strokeWidth="2.5" />
                <motion.circle
                  cx="12" cy="12" r="10"
                  className="fill-none stroke-primary"
                  strokeWidth="2.5"
                  strokeDasharray="62.83"
                  initial={{ strokeDashoffset: 0 }}
                  animate={{ strokeDashoffset: 62.83 }}
                  transition={{ duration: 15, ease: "linear" }}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[8px] font-black">{count}</span>
            </div>
            <span className="text-xs font-semibold text-muted-foreground">
              Rerouting to home in <span className="text-foreground">{count}s</span>
            </span>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
