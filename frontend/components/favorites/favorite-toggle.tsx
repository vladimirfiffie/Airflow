"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { isFlightSaved, toggleSavedFlight } from "@/lib/favorites";

type FavoriteToggleProps = {
  flightId: string;
  compact?: boolean;
  className?: string;
  onToggle?: (saved: boolean) => void;
};

export default function FavoriteToggle({
  flightId,
  compact = false,
  className,
  onToggle,
}: FavoriteToggleProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isFlightSaved(flightId));
  }, [flightId]);

  const handleClick = () => {
    const next = toggleSavedFlight(flightId);
    const isSaved = next.includes(flightId);
    setSaved(isSaved);
    onToggle?.(isSaved);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={saved ? "Remove flight from saved list" : "Save flight"}
      className={cn(
        "inline-flex items-center justify-center rounded-md border transition-colors",
        saved
          ? "border-orange-200 bg-orange-50 text-orange-600 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-300"
          : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:border-white dark:hover:text-white",
        compact ? "h-10 w-10" : "gap-2 px-3 py-2 text-sm font-bold",
        className,
      )}
    >
      <Heart
        className={cn("h-4 w-4", saved && "fill-current")}
        aria-hidden="true"
      />
      {!compact && <span>{saved ? "Saved" : "Save"}</span>}
    </button>
  );
}
