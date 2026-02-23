"use client";
import { motion } from "motion/react";
import { LinkPreview } from "@/components/ui/link-preview";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const coreStack = [
    { name: "Next.js", url: "https://nextjs.org" },
    { name: "React", url: "https://react.dev" },
    { name: "TypeScript", url: "https://www.typescriptlang.org" },
    { name: "TailwindCSS", url: "https://tailwindcss.com" },
    { name: "Stripe", url: "https://stripe.com" },
    { name: "Framer Motion", url: "https://www.framer.com/motion" },
  ];

  return (
    <footer className="relative w-full bg-background pt-14 sm:pt-20 md:pt-24 pb-8 sm:pb-10 md:pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Main row */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-8 md:gap-10">

          {/* Left — Branding */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center md:items-start space-y-1.5"
          >
            <h2
              className="font-black text-foreground tracking-tighter text-center md:text-left uppercase leading-none"
              style={{ fontSize: "clamp(1.8rem, 5vw, 3rem)" }}
            >
              Airflow<span className="text-primary">.</span>
            </h2>
            <p className="text-foreground text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-black text-center md:text-left">
              Your airport booking platform
            </p>
          </motion.div>

          {/* Center — Core stack (desktop) */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="flex items-center gap-6 xl:gap-8 whitespace-nowrap">
              {coreStack.map((tech) => (
                <LinkPreview
                  key={tech.name}
                  url={tech.url}
                  className="inline-block text-foreground text-[10px] font-black uppercase tracking-[0.2em] transition-colors border-b border-primary/0 hover:border-primary hover:text-primary"
                >
                  {tech.name}
                </LinkPreview>
              ))}
            </div>
          </div>

          {/* Mobile stack */}
          <div className="flex lg:hidden flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {coreStack.map((tech) => (
              <a
                key={tech.name}
                href={tech.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60 hover:text-primary transition-colors"
              >
                {tech.name}
              </a>
            ))}
          </div>

          {/* Right — Customer support badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center md:items-end"
          >
            <div className="flex items-center gap-2.5 px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-primary bg-background shadow-[4px_4px_0px_0px_var(--primary)]">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 bg-primary" />
              </span>
              <span className="text-primary text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] whitespace-nowrap">
                Customer Support Available
              </span>
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 sm:mt-16 md:mt-20 pt-6 sm:pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-foreground text-[10px] uppercase tracking-[0.2em] font-black text-center sm:text-left">
            © {currentYear} Airflow<span className="text-primary">.</span> All rights reserved.
          </p>
          <p className="text-foreground/40 text-[9px] uppercase tracking-[0.15em] font-bold text-center sm:text-right">
            Book smarter. Fly easier. 2026
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
