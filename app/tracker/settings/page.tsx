"use client";

import { useEffect, useState } from "react";
import { useTheme, Theme } from "@/lib/theme";
import Link from "next/link";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  useEffect(() => {}, []);

  return (
    <main className="px-4 pt-10 pb-12 max-w-lg mx-auto space-y-6 animate-fade-in">
      <h1 className="font-sans font-extrabold text-[28px] text-primary tracking-tight mb-2">Settings</h1>

      {/* ── Appearance ── */}
      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-secondary mb-2 px-1">Appearance</p>
        <div className="bg-card rounded-card p-1.5 flex gap-1">
          {(["light", "dark", "system"] as Theme[]).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`flex-1 py-3 text-[13px] font-bold capitalize rounded-xl transition-all ${
                theme === t
                  ? "bg-surface text-primary shadow-sm"
                  : "text-secondary"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>



      {/* ── App Lock ── */}
      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-secondary mb-2 px-1">Security</p>
        <div className="bg-card rounded-card p-5 flex justify-between items-center">
          <span className="font-bold text-[14px] text-primary">App Passcode</span>
          <button
            onClick={() => {
              if (confirm("Remove your passcode?")) {
                localStorage.removeItem("himmah_pin");
                window.location.reload();
              }
            }}
            className="text-[11px] font-bold text-missed uppercase tracking-widest"
          >
            Reset
          </button>
        </div>
      </div>

      {/* ── Feedback ── */}
      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-secondary mb-2 px-1">Feedback</p>
        <div className="bg-card rounded-card p-5">
          <p className="text-[14px] font-bold text-primary mb-1">Have an idea?</p>
          <p className="text-[11px] text-secondary font-semibold mb-4">Suggestions, bugs, or feature requests.</p>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const input = (e.target as HTMLFormElement).elements.namedItem("feedback") as HTMLTextAreaElement;
              if (!input.value.trim()) return;
              await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input.value }),
              });
              input.value = "";
              alert("Feedback sent. Jazakallah khair!");
            }}
          >
            <textarea
              name="feedback"
              className="w-full text-[14px] rounded-xl border-2 border-secondary/15 bg-surface p-4 text-primary outline-none focus:border-accent font-medium leading-relaxed resize-none mb-3"
              rows={3}
              placeholder="Your message…"
              required
            />
            <button
              type="submit"
              className="w-full bg-accent text-[#F2E6DE] py-3 rounded-xl text-[12px] font-bold uppercase tracking-[0.15em]"
            >
              Send Feedback
            </button>
          </form>
        </div>
      </div>

      {/* ── Links ── */}
      <div>
        <Link
          href="/privacy"
          className="block bg-card rounded-card px-5 py-4 font-bold text-[14px] text-primary active:bg-primary/5 transition-colors"
        >
          Privacy Policy →
        </Link>
      </div>

      {/* ── Footer ── */}
      <footer className="text-center pt-6 pb-4">
        <p className="font-arabic text-2xl text-accent mb-1">همة</p>
        <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-secondary">Small actions · Steady deen</p>
        <p className="text-[10px] text-secondary/50 mt-3">v2.0</p>
      </footer>
    </main>
  );
}
