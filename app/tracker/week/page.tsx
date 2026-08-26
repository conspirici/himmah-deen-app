"use client";

import { useEffect, useState } from "react";
import { generateInsights, EngineOutput } from "@/lib/insights";

export default function WeekPage() {
  const [insights, setInsights] = useState<EngineOutput | null>(null);

  useEffect(() => {
    setInsights(generateInsights());
  }, []);

  if (!insights) return <div className="min-h-screen bg-surface" />;

  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - 6);
  const fmt = (d: Date) => d.toLocaleDateString(undefined, { month: "short", day: "numeric" });

  return (
    <main className="px-4 pt-10 pb-12 max-w-lg mx-auto space-y-6 animate-fade-in">
      <header>
        <h1 className="font-sans font-extrabold text-[28px] text-primary tracking-tight mb-1">Your Week</h1>
        <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-secondary">
          {fmt(weekStart)} — {fmt(today)}
        </p>
      </header>

      {/* ── Consistency ── */}
      <div className="bg-card rounded-card p-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-secondary mb-1">Consistency</p>
            <p className="font-sans font-extrabold text-[48px] text-primary leading-none">{insights.consistency}%</p>
          </div>
          <p className={`text-[13px] font-bold ${insights.trend > 0 ? "text-done" : insights.trend < 0 ? "text-missed" : "text-secondary"}`}>
            {insights.trend > 0 ? "↑" : insights.trend < 0 ? "↓" : ""}
            {insights.trend !== 0 && ` ${Math.abs(insights.trend)}%`}
            {insights.trend === 0 ? "Steady" : " vs last week"}
          </p>
        </div>

        {/* Rhythm bar */}
        <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-secondary mb-3">7-Day Rhythm</p>
        <div className="flex gap-2 mb-6">
          {insights.rhythm.dots.map((s, i) => (
            <div key={i} className={`flex-1 h-2.5 rounded-full ${s === "active" ? "bg-accent" : "bg-ring-track"}`} />
          ))}
        </div>

        {/* Pillar bars */}
        <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-secondary mb-4">Pillars</p>
        <div className="space-y-3.5">
          {insights.pillarStats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <p className="w-20 text-[13px] font-bold text-primary">{stat.label}</p>
              <div className="flex-1 h-2.5 bg-ring-track rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-1000"
                  style={{ width: `${stat.pct}%` }}
                />
              </div>
              <p className="w-9 text-right text-[12px] font-bold text-secondary">{stat.pct}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Insights ── */}
      {insights.insights.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-secondary px-1">Insights</p>
          {insights.insights.map((insight, i) => (
            <div key={i} className="bg-card rounded-card px-5 py-4 flex gap-3 items-start">
              <span className="text-xl mt-0.5">
                {insight.type === "strength" && "🌟"}
                {insight.type === "nurture" && "🌱"}
                {insight.type === "pattern" && "📊"}
                {insight.type === "milestone" && "🏆"}
              </span>
              <p className="font-semibold text-[13px] text-primary leading-relaxed pt-0.5">{insight.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Suggestion ── */}
      <div className="bg-card border-2 border-accent/15 rounded-card p-5">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-accent mb-2">One thing for next week</p>
        <p className="font-bold text-[14px] text-primary leading-relaxed">{insights.suggestion}</p>
      </div>
    </main>
  );
}
