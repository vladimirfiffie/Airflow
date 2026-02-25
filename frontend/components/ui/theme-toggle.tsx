"use client";
import { useState, useEffect } from "react";
import { FiSun, FiMoon, FiMonitor } from "react-icons/fi";
import { motion, AnimatePresence } from "motion/react";

type Theme = "light" | "dark" | "system";

function applyTheme(theme: Theme) {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const shouldBeDark = theme === "dark" || (theme === "system" && prefersDark);
  document.documentElement.classList.toggle("dark", shouldBeDark);
}

const ICONS = {
  light: {
    icon: FiSun,
    label: "Light mode",
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.15)",
  },
  dark: {
    icon: FiMoon,
    label: "Dark mode",
    color: "#818cf8",
    glow: "rgba(129,140,248,0.15)",
  },
  system: {
    icon: FiMonitor,
    label: "System theme",
    color: "#7dd3fc",
    glow: "rgba(125,211,252,0.15)",
  },
} as const;

const CYCLE: Theme[] = ["light", "dark", "system"];

const bounceVariants = {
  initial: {
    scale: 0.3,
    opacity: 0,
    y: 8,
  },
  animate: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 500,
      damping: 18,
      mass: 0.8,
    },
  },
  exit: {
    scale: 0.3,
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.1,
      ease: "easeIn" as const,
    },
  },
};

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const saved = (localStorage.getItem("theme") ?? "system") as Theme;
    setTheme(saved);
    applyTheme(saved);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (theme === "system") applyTheme("system");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const cycleTheme = () => {
    const next = CYCLE[(CYCLE.indexOf(theme) + 1) % CYCLE.length];
    setTheme(next);
    localStorage.setItem("theme", next);
    applyTheme(next);
  };

  const { icon: Icon, label, color, glow } = ICONS[theme];

  return (
    <motion.button
      onClick={cycleTheme}
      whileTap={{ scale: 0.85 }}
      className="relative flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200"
      style={{ color, background: glow }}
      aria-label={`Current: ${label}. Click to cycle theme.`}
      title={label}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          variants={bounceVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex items-center justify-center"
        >
          <Icon size={18} strokeWidth={2.2} />
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
};
