"use client";

import type { ItemState } from "@/lib/tracking";

export function StateToggle({
  label,
  state,
  onChange,
  allowLate = false,
}: {
  label: string;
  state: ItemState;
  onChange: (s: ItemState) => void;
  allowLate?: boolean;
}) {
  const tap = (target: ItemState) => {
    onChange(state === target ? "na" : target);
  };

  const pill = (target: ItemState, activeClass: string, content: React.ReactNode) => {
    const isActive = state === target;
    return (
      <button
        type="button"
        onClick={() => tap(target)}
        className={`h-7 rounded-full flex items-center justify-center text-[11px] font-bold tracking-wide transition-all duration-200 active:scale-90 ${
          isActive
            ? `${activeClass} text-white shadow-sm animate-pill-pop px-3.5`
            : "bg-transparent text-secondary/50 border border-secondary/15 px-3"
        }`}
      >
        {content}
      </button>
    );
  };

  return (
    <div className="flex items-center justify-between w-full py-2">
      <span className="text-[14px] font-semibold text-primary">{label}</span>
      <div className="flex items-center gap-1.5">
        {pill("done", "bg-done", "✓")}
        {allowLate && pill("late", "bg-late", "Late")}
        {pill("missed", "bg-missed", "✗")}
      </div>
    </div>
  );
}
