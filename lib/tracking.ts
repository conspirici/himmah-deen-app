export type ItemState = "done" | "late" | "missed" | "na";

export interface DailyEntry {
  id?: string;
  user_id?: string;
  entry_date: string;
  prayer_fajr: ItemState;
  prayer_dhuhr: ItemState;
  prayer_asr: ItemState;
  prayer_maghrib: ItemState;
  prayer_isha: ItemState;
  witr: ItemState;
  tahajjud: ItemState;
  quran_read: ItemState;
  quran_translation: ItemState;
  quran_reflect: ItemState;
  dhikr_morning: ItemState;
  dhikr_evening: ItemState;
  istighfar: ItemState;
  salawat: ItemState;
  dua: ItemState;
  knowledge_topic: string;
  knowledge_state: ItemState;
  knowledge_note: string;
  body: ItemState;
  work_intention: ItemState;
  reflections: Record<string, string>;
}

export function defaultEntry(dateKey: string): DailyEntry {
  return {
    entry_date: dateKey,
    prayer_fajr: "na", prayer_dhuhr: "na", prayer_asr: "na", prayer_maghrib: "na", prayer_isha: "na",
    witr: "na", tahajjud: "na",
    quran_read: "na", quran_translation: "na", quran_reflect: "na",
    dhikr_morning: "na", dhikr_evening: "na", istighfar: "na", salawat: "na", dua: "na",
    knowledge_topic: knowledgeForDate(dateKey),
    knowledge_state: "na", knowledge_note: "",
    body: "na", work_intention: "na",
    reflections: {},
  };
}

export const KNOWLEDGE_ROTATION = ["Tafsir", "Hadith", "Aqeedah", "Fiqh", "Seerah"];
export function knowledgeForDate(dateKey: string) {
  const epoch = new Date("2024-01-01T00:00:00").getTime();
  const days = Math.floor((new Date(dateKey + "T00:00:00").getTime() - epoch) / 86400000);
  return KNOWLEDGE_ROTATION[((days % 5) + 5) % 5];
}

export const REFLECTION_PROMPTS = [
  { pillar: "Tazkiyah", q: "Was I patient today, or did something break that?" },
  { pillar: "Tazkiyah", q: "Is there a sin I keep repeating?" },
  { pillar: "Tazkiyah", q: "Did I envy anyone today?" },
  { pillar: "Tazkiyah", q: "Did I forgive someone I was holding something against?" },
  { pillar: "Character", q: "Was I truthful today, even when it cost me something?" },
  { pillar: "Character", q: "Where was I generous today? Where could I have been?" },
  { pillar: "Reflection", q: "What did I notice about Allah's creation today?" },
  { pillar: "Reflection", q: "If today were my last, what would I regret?" },
  { pillar: "Reflection", q: "What blessing did I take for granted today?" },
];
export function promptsForDate(dateKey: string) {
  const epoch = new Date("2024-01-01T00:00:00").getTime();
  const days = Math.floor((new Date(dateKey + "T00:00:00").getTime() - epoch) / 86400000);
  const start = (((days * 3) % REFLECTION_PROMPTS.length) + REFLECTION_PROMPTS.length) % REFLECTION_PROMPTS.length;
  return [0, 1, 2].map((i) => REFLECTION_PROMPTS[(start + i) % REFLECTION_PROMPTS.length]);
}

export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function isActive(entry: DailyEntry | undefined | null): boolean {
  if (!entry) return false;
  const states = [
    entry.prayer_fajr, entry.prayer_dhuhr, entry.prayer_asr, entry.prayer_maghrib, entry.prayer_isha,
    entry.witr, entry.tahajjud, entry.quran_read, entry.quran_translation, entry.quran_reflect,
    entry.dhikr_morning, entry.dhikr_evening, entry.istighfar, entry.salawat, entry.dua,
    entry.knowledge_state, entry.body, entry.work_intention
  ];
  return states.some(s => s === 'done' || s === 'late');
}

export function countCompleted(entry: DailyEntry | undefined | null): { done: number, total: number } {
  if (!entry) return { done: 0, total: 0 };
  const states = [
    entry.prayer_fajr, entry.prayer_dhuhr, entry.prayer_asr, entry.prayer_maghrib, entry.prayer_isha,
    entry.quran_read, entry.dhikr_morning, entry.dhikr_evening, entry.knowledge_state, entry.body
  ];
  let done = 0;
  let total = 0;
  states.forEach(s => {
    if (s !== 'na') total++;
    if (s === 'done' || s === 'late') done++;
  });
  return { done, total };
}
