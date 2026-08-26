"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("himmah_theme") as Theme;
    if (saved) {
      setThemeState(saved);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    let isDarkTheme = theme === "dark";

    if (theme === "system") {
      isDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    if (isDarkTheme) {
      root.classList.add("dark");
    } else {
      root.classList.add("light"); // We add light to ensure CSS variables are applied if needed
    }
    setIsDark(isDarkTheme);
  }, [theme, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("himmah_theme", newTheme);
  };

  // Prevent hydration mismatch by rendering invisible until mounted
  if (!mounted) {
    return <div className="invisible h-screen w-screen bg-surface" />;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
