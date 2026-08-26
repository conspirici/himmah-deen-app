import { DailyEntry } from "./tracking";
import { getLocalEntries } from "./localStore";
import { getCurrentRhythm, getBestRhythm, getRhythmDots } from "./rhythm";

export interface EngineOutput {
  consistency: number;
  trend: number;
  rhythm: { current: number; best: number; dots: ('active'|'inactive')[] };
  pillarStats: { label: string; pct: number }[];
  insights: { type: 'strength' | 'nurture' | 'milestone' | 'pattern'; text: string }[];
  suggestion: string;
  nudge: string | null;
}

interface InsightData {
  thisWeek: DailyEntry[];
  lastWeek: DailyEntry[];
  today: DailyEntry | undefined;
  rhythm: number;
  counts: Record<string, { total: number, done: number, late: number, missed: number }>;
  currentConsistency: number;
  prevConsistency: number;
}

interface InsightRule {
  id: string;
  priority: number;
  evaluate: (data: InsightData) => { type: 'strength' | 'nurture' | 'milestone' | 'pattern'; text: string } | null;
}

const rules: InsightRule[] = [
  // Consistency
  {
    id: "fajr_champion", priority: 1,
    evaluate: (d) => {
      let count = 0;
      d.thisWeek.forEach(e => { if (e.prayer_fajr === 'done' || e.prayer_fajr === 'late') count++; });
      return count === 7 ? { type: 'strength', text: "Fajr every single day this week. SubhanAllah." } : null;
    }
  },
  {
    id: "fajr_needs_attention", priority: 2,
    evaluate: (d) => {
      let missed = 0;
      d.thisWeek.forEach(e => { if (e.prayer_fajr === 'missed' || e.prayer_fajr === 'na') missed++; });
      return missed >= 3 && d.thisWeek.length >= 3 ? { type: 'nurture', text: `Fajr was missed ${missed} times this week. Consider preparing the night before.` } : null;
    }
  },
  {
    id: "quran_consistent", priority: 3,
    evaluate: (d) => {
      if (d.counts["Qur'an"].total === 0) return null;
      const pct = d.counts["Qur'an"].done / d.counts["Qur'an"].total;
      return pct >= 0.7 ? { type: 'strength', text: "Consistent Qur'an reading this week — beautiful." } : null;
    }
  },
  {
    id: "quran_absent", priority: 4,
    evaluate: (d) => {
      return d.thisWeek.length >= 5 && d.counts["Qur'an"].done === 0 ? { type: 'nurture', text: "No Qur'an this week. Even 3 lines after Fajr counts." } : null;
    }
  },
  // Patterns
  {
    id: "improving", priority: 5,
    evaluate: (d) => {
      if (d.lastWeek.length < 3 || d.thisWeek.length < 3) return null;
      return d.currentConsistency - d.prevConsistency >= 10 ? { type: 'pattern', text: "Your consistency improved compared with last week." } : null;
    }
  },
  {
    id: "declining", priority: 6,
    evaluate: (d) => {
      if (d.lastWeek.length < 3 || d.thisWeek.length < 3) return null;
      return d.prevConsistency - d.currentConsistency >= 10 ? { type: 'pattern', text: "Your rhythm shifted this week — that's okay. Focus on one thing tomorrow." } : null;
    }
  },
  {
    id: "late_pattern", priority: 7,
    evaluate: (d) => {
      return d.counts["Salah"].late >= 3 ? { type: 'pattern', text: `You completed prayers but marked them late ${d.counts["Salah"].late} times. Consider what's delaying you.` } : null;
    }
  },
  // Milestones
  {
    id: "rhythm_7", priority: 10,
    evaluate: (d) => d.rhythm === 7 ? { type: 'milestone', text: "A full week of rhythm 🌙" } : null
  },
  {
    id: "rhythm_30", priority: 10,
    evaluate: (d) => d.rhythm === 30 ? { type: 'milestone', text: "30 days. This is becoming part of who you are." } : null
  }
];

export function generateInsights(): EngineOutput {
  const entries = getLocalEntries();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const thisWeek: DailyEntry[] = [];
  const lastWeek: DailyEntry[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (entries[key]) thisWeek.push(entries[key]);
  }
  for (let i = 7; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (entries[key]) lastWeek.push(entries[key]);
  }

  const calcC = (list: DailyEntry[]) => {
    if (list.length === 0) return 0;
    let t = 0, d = 0;
    list.forEach(e => {
      [e.prayer_fajr, e.prayer_dhuhr, e.prayer_asr, e.prayer_maghrib, e.prayer_isha, e.quran_read, e.dhikr_morning, e.dhikr_evening].forEach(f => {
        if (f !== "na") t++;
        if (f === "done" || f === "late") d++;
      });
    });
    return t === 0 ? 0 : Math.round((d / t) * 100);
  };

  const currentConsistency = calcC(thisWeek);
  const prevConsistency = calcC(lastWeek);

  const counts: Record<string, { total: number, done: number, late: number, missed: number }> = {
    "Salah": { total: 0, done: 0, late: 0, missed: 0 },
    "Qur'an": { total: 0, done: 0, late: 0, missed: 0 },
    "Dhikr": { total: 0, done: 0, late: 0, missed: 0 },
    "Knowledge": { total: 0, done: 0, late: 0, missed: 0 }
  };

  const addCount = (k: string, v: string) => {
    if (v !== "na") counts[k].total++;
    if (v === "done") counts[k].done++;
    if (v === "late") { counts[k].done++; counts[k].late++; }
    if (v === "missed") counts[k].missed++;
  };

  thisWeek.forEach(e => {
    [e.prayer_fajr, e.prayer_dhuhr, e.prayer_asr, e.prayer_maghrib, e.prayer_isha].forEach(f => addCount("Salah", f));
    [e.quran_read, e.quran_translation, e.quran_reflect].forEach(f => addCount("Qur'an", f));
    [e.dhikr_morning, e.dhikr_evening, e.istighfar, e.salawat, e.dua].forEach(f => addCount("Dhikr", f));
    if (e.knowledge_state) addCount("Knowledge", e.knowledge_state);
  });

  const getPct = (k: string) => counts[k].total === 0 ? 0 : Math.round((counts[k].done / counts[k].total) * 100);
  let weakest = "Knowledge";
  let min = 101;
  Object.keys(counts).forEach(k => {
    const p = getPct(k);
    if (counts[k].total > 0 && p < min) { min = p; weakest = k; }
  });

  let suggestion = "Try attaching a small habit to something you already do every day.";
  if (weakest === "Qur'an") suggestion = "Try reading just 3 lines of Qur'an immediately after a prayer.";
  if (weakest === "Dhikr") suggestion = "Try playing morning adhkar audio while getting ready for the day.";
  if (weakest === "Knowledge") suggestion = "Try reading one short hadith or tafsir snippet before sleeping.";
  if (weakest === "Salah") suggestion = "Try preparing for the next prayer as soon as the current one finishes.";

  const data: InsightData = {
    thisWeek, lastWeek, 
    today: entries[today.toISOString().slice(0,10)], 
    rhythm: getCurrentRhythm(), 
    counts, currentConsistency, prevConsistency
  };

  const activeInsights = rules
    .map(r => r.evaluate(data))
    .filter(Boolean) as { type: any, text: string }[];
  
  // Sort logic handled implicitly by array order if we assume rules array is sorted, 
  // but let's just take top 3 safely if it was sorted by priority.
  // We'll just slice first 3 since rules array is ordered by priority manually.
  const finalInsights = activeInsights.slice(0, 3);

  // Fallback insight
  if (finalInsights.length === 0) {
    if (thisWeek.length === 0) {
      finalInsights.push({ type: 'nurture', text: "Track your first day to start seeing insights." });
    } else {
      finalInsights.push({ type: 'strength', text: "Keep tracking to build a clear picture of your rhythm." });
    }
  }

  // Nudge logic
  let nudge = null;
  const h = new Date().getHours();
  if (h >= 19 && data.today && !data.today.reflections?.mood) {
    nudge = "🌙 Before you rest... Take a moment to look back on today.";
  }

  return {
    consistency: currentConsistency,
    trend: currentConsistency - prevConsistency,
    rhythm: { current: data.rhythm, best: getBestRhythm(), dots: getRhythmDots(7) },
    pillarStats: [
      { label: "Salah", pct: getPct("Salah") },
      { label: "Qur'an", pct: getPct("Qur'an") },
      { label: "Dhikr", pct: getPct("Dhikr") },
      { label: "Knowledge", pct: getPct("Knowledge") },
    ],
    insights: finalInsights,
    suggestion,
    nudge
  };
}
