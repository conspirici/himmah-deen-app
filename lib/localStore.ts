import { DailyEntry, defaultEntry } from "./tracking";

const ENTRIES_KEY = "himmah_entries";
const SKIPS_KEY = "himmah_skips";

export function getLocalEntries(): Record<string, DailyEntry> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(ENTRIES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveLocalEntry(dateKey: string, entry: DailyEntry) {
  if (typeof window === "undefined") return;
  const entries = getLocalEntries();
  entries[dateKey] = entry;
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
}

export function getLocalEntry(dateKey: string): DailyEntry {
  const entries = getLocalEntries();
  return entries[dateKey] || defaultEntry(dateKey);
}

// Skips (formerly skip_logs table)
export interface SkipNote {
  date: string;
  pillar: string;
  note: string;
}

export function getLocalSkips(): SkipNote[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SKIPS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalSkip(skip: SkipNote) {
  if (typeof window === "undefined") return;
  const skips = getLocalSkips();
  skips.push(skip);
  localStorage.setItem(SKIPS_KEY, JSON.stringify(skips));
}
