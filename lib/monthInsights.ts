import { getLocalEntries } from "./localStore";
import { countCompleted } from "./tracking";

export interface MonthData {
  days: { date: string; intensity: 0 | 1 | 2 | 3 }[];
  activeDays: number;
  consistency: number;
  bestRhythm: number;
}

export function generateMonthInsights(): MonthData {
  const entries = getLocalEntries();
  const today = new Date();
  
  // Go back 30 days
  const days = [];
  let activeDays = 0;
  let totalItems = 0;
  let completedItems = 0;
  
  let currentRhythm = 0;
  let bestRhythm = 0;

  // We loop from 29 days ago to today
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    
    const entry = entries[key];
    const { done, total } = countCompleted(entry);
    
    let intensity: 0 | 1 | 2 | 3 = 0;
    
    if (total > 0) {
      const pct = done / total;
      if (pct > 0.7) intensity = 3;
      else if (pct > 0.4) intensity = 2;
      else if (pct > 0) intensity = 1;
    }

    if (intensity > 0) {
      activeDays++;
      currentRhythm++;
      if (currentRhythm > bestRhythm) bestRhythm = currentRhythm;
    } else {
      currentRhythm = 0;
    }

    totalItems += total;
    completedItems += done;

    days.push({ date: key, intensity });
  }

  const consistency = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

  return {
    days,
    activeDays,
    consistency,
    bestRhythm
  };
}
