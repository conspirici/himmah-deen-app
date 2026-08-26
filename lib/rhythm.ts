import { getLocalEntries } from "./localStore";
import { isActive, todayKey } from "./tracking";

const BEST_RHYTHM_KEY = "himmah_best_rhythm";

export function getBestRhythm(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(BEST_RHYTHM_KEY) || "0", 10);
}

export function saveBestRhythm(current: number) {
  if (typeof window === "undefined") return;
  const best = getBestRhythm();
  if (current > best) {
    localStorage.setItem(BEST_RHYTHM_KEY, current.toString());
  }
}

export function getCurrentRhythm(): number {
  const entries = getLocalEntries();
  let rhythm = 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check today first
  const todayStr = today.toISOString().slice(0, 10);
  const todayActive = isActive(entries[todayStr]);

  // If today is active, we start counting backwards from today.
  // If today is NOT active, we check if yesterday was active. If yesterday was active,
  // the rhythm is still alive (they just haven't tracked today yet). If yesterday was inactive,
  // rhythm is 0.
  
  let d = new Date(today);
  if (!todayActive) {
    d.setDate(today.getDate() - 1);
    const yesterdayStr = d.toISOString().slice(0, 10);
    if (!isActive(entries[yesterdayStr])) {
      return 0; // Rhythm broken
    }
  }

  // Count backwards
  while (true) {
    const key = d.toISOString().slice(0, 10);
    if (isActive(entries[key])) {
      rhythm++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }

  saveBestRhythm(rhythm);
  return rhythm;
}

export function getRhythmDots(days: number): ('active' | 'inactive')[] {
  const entries = getLocalEntries();
  const dots: ('active' | 'inactive')[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    dots.push(isActive(entries[key]) ? 'active' : 'inactive');
  }
  return dots;
}
