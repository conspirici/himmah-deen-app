"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, BarChart2, CalendarDays, Settings } from "lucide-react";

const navItems = [
  { label: "Today", href: "/tracker", icon: Moon, exact: true },
  { label: "Week", href: "/tracker/week", icon: BarChart2, exact: false },
  { label: "Month", href: "/tracker/month", icon: CalendarDays, exact: false },
  { label: "Settings", href: "/tracker/settings", icon: Settings, exact: false },
];

export function BottomNav() {
  const pathname = usePathname();
  if (pathname === "/tracker/reflect") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--nav-bg)] backdrop-blur-xl border-t border-primary/5">
      <div className="max-w-md mx-auto flex justify-around items-center pt-2 pb-safe">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 py-1 min-w-[56px] transition-colors ${
                isActive ? "text-accent" : "text-secondary"
              }`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className={`text-[10px] tracking-wide ${isActive ? "font-extrabold" : "font-semibold"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
