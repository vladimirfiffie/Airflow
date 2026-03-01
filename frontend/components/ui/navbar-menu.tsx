"use client";

import { motion } from "motion/react";
import React from "react";

const transition = {
  type: "spring" as const,
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export function MenuItem({
  setActive,
  active,
  item,
  children,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
}) {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <motion.p
        transition={{ duration: 0.2 }}
        className="cursor-pointer text-sm font-semibold text-slate-700 transition hover:text-slate-950 dark:text-slate-200 dark:hover:text-white"
      >
        {item}
      </motion.p>
      {active !== null ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item ? (
            <div className="absolute left-1/2 top-[calc(100%_+_0.9rem)] -translate-x-1/2 pt-2">
              <motion.div
                transition={transition}
                layoutId="active"
                className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/95"
              >
                <motion.div layout className="h-full w-max p-4">
                  {children}
                </motion.div>
              </motion.div>
            </div>
          ) : null}
        </motion.div>
      ) : null}
    </div>
  );
}

export function Menu({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}) {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className="relative flex w-full items-center gap-2 rounded-full border border-slate-200/80 bg-white/90 px-3 py-2.5 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/85"
    >
      {children}
    </nav>
  );
}

export function ProductItem({
  title,
  description,
  href,
  src,
}: {
  title: string;
  description: string;
  href: string;
  src: string;
}) {
  return (
    <a href={href} className="flex space-x-2">
      <img
        src={src}
        width={140}
        height={70}
        alt={title}
        className="shrink-0 rounded-md shadow-2xl"
      />
      <div>
        <h4 className="mb-1 text-xl font-bold text-slate-900 dark:text-slate-100">{title}</h4>
        <p className="max-w-[10rem] text-sm text-slate-600 dark:text-slate-300">{description}</p>
      </div>
    </a>
  );
}

export function HoveredLink({
  children,
  className,
  ...rest
}: React.ComponentPropsWithoutRef<"a">) {
  return (
    <a
      {...rest}
      className={[
        "text-sm text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </a>
  );
}
