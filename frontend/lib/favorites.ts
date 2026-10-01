export const FAVORITES_KEY = "airflow:favorites";

export function getSavedFlightIds(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const saved = window.localStorage.getItem(FAVORITES_KEY);
    if (!saved) return [];

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((value): value is string => typeof value === "string");
  } catch {
    return [];
  }
}

export function toggleSavedFlight(flightId: string): string[] {
  const current = getSavedFlightIds();
  const updated = current.includes(flightId)
    ? current.filter((id) => id !== flightId)
    : [...current, flightId];

  if (typeof window !== "undefined") {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  }

  return updated;
}

export function isFlightSaved(flightId: string): boolean {
  return getSavedFlightIds().includes(flightId);
}
