"use client";

import { useEffect, useState } from "react";
import { generateMonthInsights, MonthData } from "@/lib/monthInsights";

export default function MonthPage() {
  const [data, setData] = useState<MonthData | null>(null);

  useEffect(() => {
    setData(generateMonthInsights());
  }, []);

  if (!data) return <div className="min-h-screen bg-surface" />;

  const intensityClass = (val: number) => {
    switch (val) {
      case 3: return "bg-accent";
      case 2: return "bg-accent/50";
      case 1: return "bg-accent/25";
      default: return "bg-ring-track";
    }
  };

  return (
    <main className="px-4 pt-10 pb-12 max-w-lg mx-auto space-y-6 animate-fade-in">
      <header>
        <h1 className="font-sans font-extrabold text-[28px] text-primary tracking-tight mb-1">Your Month</h1>
        <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-secondary">Last 30 days</p>
      </header>

      {/* ── Heatmap ── */}
      <div className="bg-card rounded-card p-6">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-secondary mb-4">Activity</p>
        <div className="grid grid-cols-7 gap-[6px] mb-4">
          {data.days.map((d, i) => (
            <div
              key={i}
              className={`aspect-square rounded-lg transition-colors ${intensityClass(d.intensity)}`}
              title={d.date}
            />
          ))}
        </div>
        <div className="flex justify-end items-center gap-1.5 text-[9px] font-bold text-secondary">
          <span>Less</span>
          {[0, 1, 2, 3].map((v) => (
            <div key={v} className={`w-3 h-3 rounded-sm ${intensityClass(v)}`} />
          ))}
          <span>More</span>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card rounded-card p-4 text-center">
          <p className="font-sans font-extrabold text-[28px] text-primary leading-none mb-1">{data.consistency}%</p>
          <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-secondary">Consistency</p>
        </div>
        <div className="bg-card rounded-card p-4 text-center">
          <p className="font-sans font-extrabold text-[28px] text-primary leading-none mb-1">{data.activeDays}</p>
          <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-secondary">Active days</p>
        </div>
        <div className="bg-card rounded-card p-4 text-center">
          <p className="font-sans font-extrabold text-[28px] text-primary leading-none mb-1">{data.bestRhythm}</p>
          <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-secondary">Best rhythm</p>
        </div>
      </div>
    </main>
  );
}
