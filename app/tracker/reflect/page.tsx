"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getLocalEntry, saveLocalEntry } from "@/lib/localStore";
import { promptsForDate, todayKey } from "@/lib/tracking";

const OBSTACLES = ["Time", "Tiredness", "Forgot", "Work / Study", "Family", "Travel"];

export default function ReflectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateKey = searchParams.get("date") || todayKey();

  const [step, setStep] = useState(1);
  const [mood, setMood] = useState("");
  const [obstacles, setObstacles] = useState<string[]>([]);
  const [reflectionText, setReflectionText] = useState("");
  const [gratitude, setGratitude] = useState("");
  const [prompt, setPrompt] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const entry = getLocalEntry(dateKey);
    if (entry.reflections?.mood) setMood(entry.reflections.mood);
    if (entry.reflections?.obstacle) setObstacles(entry.reflections.obstacle.split(",").filter(Boolean));
    if (entry.reflections?.reflection) setReflectionText(entry.reflections.reflection);
    if (entry.reflections?.note) setGratitude(entry.reflections.note);
    setPrompt(promptsForDate(dateKey)[0].q);
    setMounted(true);
  }, [dateKey]);

  if (!mounted) return <div className="min-h-screen bg-card" />;

  const save = (updates: Record<string, string>) => {
    const entry = getLocalEntry(dateKey);
    entry.reflections = { ...entry.reflections, ...updates };
    saveLocalEntry(dateKey, entry);
  };

  const selectMood = (m: string) => {
    setMood(m);
    save({ mood: m });
    // Happy → skip obstacles
    if (m === "😊") setStep(3);
    else setStep(2);
  };

  const toggleObstacle = (tag: string) => {
    const next = obstacles.includes(tag) ? obstacles.filter((t) => t !== tag) : [...obstacles, tag];
    setObstacles(next);
    save({ obstacle: next.join(",") });
  };

  const finish = () => {
    save({ reflection: reflectionText, note: gratitude });
    setStep(5);
    setTimeout(() => router.push("/tracker"), 2200);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-card text-primary flex flex-col">
      {/* Back button */}
      <div className="px-6 pt-8 pb-4">
        <button
          onClick={() => router.push("/tracker")}
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em] text-secondary"
        >
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      {/* Progress dots */}
      {step < 5 && (
        <div className="flex justify-center gap-2 pb-8">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s === step ? "w-8 bg-accent" : s < step ? "w-4 bg-accent/40" : "w-4 bg-ring-track"
              }`}
            />
          ))}
        </div>
      )}

      <div className="flex-1 flex flex-col justify-center px-8 pb-24">
        {/* Step 1: Mood */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h1 className="font-sans font-extrabold text-[32px] text-primary mb-12 leading-tight">
              How was today?
            </h1>
            <div className="flex justify-around max-w-[280px]">
              {["😔", "😐", "😊"].map((m) => (
                <button
                  key={m}
                  onClick={() => selectMood(m)}
                  className={`text-[56px] transition-all duration-200 active:scale-90 ${
                    mood === m ? "scale-110" : "grayscale opacity-50 hover:opacity-70"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Obstacles */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h1 className="font-sans font-extrabold text-[28px] text-primary mb-8 leading-tight">
              What got in the way?
            </h1>
            <div className="flex flex-wrap gap-3 mb-12">
              {OBSTACLES.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleObstacle(tag)}
                  className={`text-[13px] font-bold px-5 py-3 rounded-full border-2 transition-all active:scale-95 ${
                    obstacles.includes(tag)
                      ? "bg-accent border-accent text-[#F2E6DE]"
                      : "border-secondary/20 text-secondary"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setStep(3)}
                className="text-xs font-bold text-secondary uppercase tracking-widest"
              >
                Skip
              </button>
              <button
                onClick={() => setStep(3)}
                className="bg-accent text-[#F2E6DE] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Reflection prompt */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h1 className="font-sans font-extrabold text-[24px] text-primary mb-8 leading-snug">
              {prompt}
            </h1>
            <textarea
              autoFocus
              className="w-full text-[15px] rounded-2xl border-2 border-secondary/15 bg-surface p-5 text-primary outline-none focus:border-accent font-medium leading-relaxed resize-none h-40"
              placeholder="Your thoughts…"
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
            />
            <div className="flex justify-between mt-6">
              <button onClick={() => setStep(mood === "😊" ? 1 : 2)} className="text-xs font-bold text-secondary uppercase tracking-widest">Back</button>
              <button onClick={() => { save({ reflection: reflectionText }); setStep(4); }} className="bg-accent text-[#F2E6DE] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest">Continue</button>
            </div>
          </div>
        )}

        {/* Step 4: Gratitude */}
        {step === 4 && (
          <div className="animate-fade-in">
            <h1 className="font-sans font-extrabold text-[24px] text-primary mb-8 leading-snug">
              Anything you'd like to remember?
            </h1>
            <textarea
              autoFocus
              className="w-full text-[15px] rounded-2xl border-2 border-secondary/15 bg-surface p-5 text-primary outline-none focus:border-accent font-medium leading-relaxed resize-none h-32"
              placeholder="A blessing, a lesson, a quiet moment…"
              value={gratitude}
              onChange={(e) => setGratitude(e.target.value)}
            />
            <div className="flex justify-between mt-6">
              <button onClick={() => setStep(3)} className="text-xs font-bold text-secondary uppercase tracking-widest">Back</button>
              <button onClick={finish} className="bg-accent text-[#F2E6DE] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest">Done</button>
            </div>
          </div>
        )}

        {/* Step 5: Completion */}
        {step === 5 && (
          <div className="text-center animate-fade-in">
            <h1 className="font-arabic text-[48px] text-primary mb-4">جزاك الله خيرًا</h1>
            <p className="font-sans font-bold text-secondary">Your reflection is saved.</p>
          </div>
        )}
      </div>
    </div>
  );
}
