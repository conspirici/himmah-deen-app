"use client";

import { AppLock } from "@/components/AppLock";
import { BottomNav } from "@/components/BottomNav";

export default function TrackerLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLock>
      <div className="min-h-screen bg-surface pb-24 font-sans text-primary">
        {children}
        <BottomNav />
      </div>
    </AppLock>
  );
}
