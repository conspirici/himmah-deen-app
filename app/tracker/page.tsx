"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Sun, Sunrise, Sunset, Moon, BookOpen, Heart, GraduationCap, Sparkles,
  Dumbbell, ChevronDown, Calendar, Leaf
} from "lucide-react";
import { StateToggle } from "@/components/StateToggle";
import { type DailyEntry, type ItemState, defaultEntry, todayKey, countCompleted } from "@/lib/tracking";
import { getLocalEntry, saveLocalEntry } from "@/lib/localStore";
import { generateInsights, EngineOutput } from "@/lib/insights";

const PRAYERS: { key: keyof DailyEntry; label: string }[] = [
  { key: "prayer_fajr", label: "Fajr" },
  { key: "prayer_dhuhr", label: "Dhuhr" },
  { key: "prayer_asr", label: "Asr" },
  { key: "prayer_maghrib", label: "Maghrib" },
  { key: "prayer_isha", label: "Isha" },
];

const SECTIONS = ["salah", "quran", "dhikr", "knowledge", "body"] as const;
type SectionId = typeof SECTIONS[number];

/* ─── Accordion Card ─── */
function Section({
  id,
  openId,
  onToggle,
  icon: Icon,
  title,
  count,
  children,
}: {
  id: SectionId;
  openId: SectionId | null;
  onToggle: (id: SectionId) => void;
  icon: any;
  title: string;
  count?: string;
  children: React.ReactNode;
}) {
  const open = openId === id;

  return (
    <section className="bg-card rounded-card overflow-hidden">
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between px-5 py-4 active:bg-primary/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
            <Icon size={16} strokeWidth={2.5} />
          </div>
          <span className="font-sans font-bold text-[15px] text-primary">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {count && <span className="text-xs font-bold text-secondary">{count}</span>}
          <ChevronDown
            size={16}
            className={`text-secondary transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>
      {open && (
        <div className="px-5 pb-4 animate-fade-in">
          <div className="h-px bg-primary/5 mb-2" />
          {children}
        </div>
      )}
    </section>
  );
}

export default function TrackerPage() {
  const router = useRouter();
  const [dateKey, setDateKey] = useState(todayKey());
  const [entry, setEntry] = useState<DailyEntry | null>(null);
  const [insights, setInsights] = useState<EngineOutput | null>(null);
  const [openSection, setOpenSection] = useState<SectionId | null>("salah");

  useEffect(() => {
    setEntry(getLocalEntry(dateKey));
    setInsights(generateInsights());
  }, [dateKey]);

  const persist = useCallback(
    (next: DailyEntry) => {
      setEntry(next);
      saveLocalEntry(next.entry_date, next);
      setInsights(generateInsights());
    },
    []
  );

  const setField = (key: keyof DailyEntry, value: ItemState) => {
    if (!entry) return;
    persist({ ...entry, [key]: value });
  };

  const toggleSection = (id: SectionId) => {
    setOpenSection(prev => prev === id ? null : id);
  };

  if (!entry || !insights) return <div className="min-h-screen bg-surface" />;

  const isToday = dateKey === todayKey();
  const d = new Date(dateKey + "T00:00:00");
  const completed = countCompleted(entry);
  const hasReflected = !!(entry.reflections && entry.reflections.mood);

  /* Rhythm ring math */
  const circumference = 2 * Math.PI * 42;
  const pct = Math.min(insights.rhythm.current / 7, 1);
  const offset = circumference - pct * circumference;

  /* Greeting */
  const h = new Date().getHours();
  let greeting = "Assalamu alaikum";
  if (h >= 4 && h < 12) greeting = "Good morning";
  else if (h >= 12 && h < 17) greeting = "Good afternoon";
  else if (h >= 17 && h < 20) greeting = "Good evening";

  /* Salah count */
  const salahDone = PRAYERS.filter(
    (p) => (entry[p.key] as ItemState) === "done" || (entry[p.key] as ItemState) === "late"
  ).length;

  /* Wind-down nudge */
  const showWindDown = h >= 19 && isToday && !hasReflected;

  return (
    <main className="px-4 pt-8 max-w-lg mx-auto animate-fade-in">
      {/* ── Header ── */}
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-secondary mb-1">
          {d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
        </p>
        <div className="flex items-center justify-between">
          <h1 className="font-sans font-extrabold text-[28px] text-primary tracking-tight leading-tight">
            {isToday ? greeting : "History"}
          </h1>
          <div className="relative">
            <input
              type="date"
              className="absolute inset-0 opacity-0 cursor-pointer w-8 h-8"
              onChange={(e) => e.target.value && setDateKey(e.target.value)}
            />
            <Calendar size={18} className="text-secondary" />
          </div>
        </div>
      </header>

      {/* ── Rhythm Ring ── */}
      <div className="flex items-center gap-6 bg-card rounded-card px-6 py-5 mb-6">
        <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r="42" fill="none" stroke="var(--ring-track)" strokeWidth="6" />
            <circle
              cx="48" cy="48" r="42"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="text-center">
            <span className="font-sans font-extrabold text-[32px] leading-none text-primary">
              {insights.rhythm.current}
            </span>
          </div>
        </div>

        <div className="flex-1">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-secondary mb-1">Rhythm</p>
          <p className="font-sans font-bold text-primary text-sm mb-3">
            {insights.rhythm.current === 0
              ? "Your first day starts now"
              : `${insights.rhythm.current} day${insights.rhythm.current > 1 ? "s" : ""} going`}
          </p>
          <div className="flex gap-1.5 mb-1">
            {insights.rhythm.dots.map((s, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${s === "active" ? "bg-accent" : "bg-ring-track"}`}
              />
            ))}
          </div>
          <p className="text-[10px] font-bold text-secondary">Best: {insights.rhythm.best}</p>
        </div>
      </div>

      {/* ── Today progress ── */}
      <div className="flex items-center justify-between px-1 mb-4">
        <p className="text-xs font-bold text-secondary uppercase tracking-widest">Today</p>
        <p className="text-xs font-extrabold text-accent">
          {completed.done} / {completed.total}
        </p>
      </div>

      {/* ── Wind-down nudge ── */}
      {showWindDown && (
        <button
          onClick={() => router.push(`/tracker/reflect?date=${dateKey}`)}
          className="w-full bg-card border-2 border-accent/20 rounded-card px-5 py-5 mb-4 text-left active:scale-[0.98] transition-transform animate-slide-up"
        >
          <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-accent mb-1">
            🌙 Before you rest…
          </p>
          <p className="text-sm font-semibold text-primary">
            Take a moment to look back on today.
          </p>
        </button>
      )}

      {/* ── Accordion Sections (only one open at a time) ── */}
      <div className="space-y-3 mb-8">
        <Section id="salah" openId={openSection} onToggle={toggleSection} icon={Heart} title="Salah" count={`${salahDone}/5`}>
          {PRAYERS.map((p) => (
            <StateToggle key={p.key} label={p.label} state={entry[p.key] as ItemState} allowLate onChange={(s) => setField(p.key, s)} />
          ))}
          <div className="h-px bg-primary/5 my-1" />
          <StateToggle label="Witr" state={entry.witr} onChange={(s) => setField("witr", s)} />
          <StateToggle label="Tahajjud" state={entry.tahajjud} onChange={(s) => setField("tahajjud", s)} />
        </Section>

        <Section id="quran" openId={openSection} onToggle={toggleSection} icon={BookOpen} title="Qur'an">
          <StateToggle label="Read" state={entry.quran_read} onChange={(s) => setField("quran_read", s)} />
          <StateToggle label="Translation" state={entry.quran_translation} onChange={(s) => setField("quran_translation", s)} />
          <StateToggle label="Reflected on a verse" state={entry.quran_reflect} onChange={(s) => setField("quran_reflect", s)} />
        </Section>

        <Section id="dhikr" openId={openSection} onToggle={toggleSection} icon={Sparkles} title="Dhikr & Du'a">
          <StateToggle label="Morning adhkar" state={entry.dhikr_morning} onChange={(s) => setField("dhikr_morning", s)} />
          <StateToggle label="Evening adhkar" state={entry.dhikr_evening} onChange={(s) => setField("dhikr_evening", s)} />
          <StateToggle label="Istighfar" state={entry.istighfar} onChange={(s) => setField("istighfar", s)} />
          <StateToggle label="Salawat" state={entry.salawat} onChange={(s) => setField("salawat", s)} />
          <StateToggle label="Personal du'a" state={entry.dua} onChange={(s) => setField("dua", s)} />
        </Section>

        <Section id="knowledge" openId={openSection} onToggle={toggleSection} icon={GraduationCap} title="Knowledge">
          <div className="flex justify-between items-center bg-surface rounded-lg px-3 py-2 mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-secondary">Focus</span>
            <span className="font-sans font-bold text-sm text-primary">{entry.knowledge_topic}</span>
          </div>
          <StateToggle label={`Studied ${entry.knowledge_topic.toLowerCase()}`} state={entry.knowledge_state} onChange={(s) => setField("knowledge_state", s)} />
        </Section>

        <Section id="body" openId={openSection} onToggle={toggleSection} icon={Dumbbell} title="Body & Work">
          <StateToggle label="Cared for my body" state={entry.body} onChange={(s) => setField("body", s)} />
          <StateToggle label="Worked with ihsan" state={entry.work_intention} onChange={(s) => setField("work_intention", s)} />
        </Section>
      </div>

      {/* ── Reflect CTA ── */}
      <button
        onClick={() => router.push(`/tracker/reflect?date=${dateKey}`)}
        className={`w-full flex items-center justify-center gap-2 rounded-card py-4 text-sm font-bold transition-all active:scale-[0.97] mb-8 ${
          hasReflected
            ? "bg-done/10 text-done border border-done/20"
            : "bg-accent text-[#F2E6DE] shadow-sm"
        }`}
      >
        {hasReflected ? (
          <>✓ Reflected today</>
        ) : (
          <><Leaf size={16} /> A moment to reflect</>
        )}
      </button>
    </main>
  );
}
