import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "var(--bg-surface)",
        card: "var(--bg-card)",
        primary: "var(--text-primary)",
        secondary: "var(--text-secondary)",
        accent: "var(--accent)",
        "accent-soft": "var(--accent-soft)",
        "nav-bg": "var(--nav-bg)",
        done: "var(--state-done)",
        late: "var(--state-late)",
        missed: "var(--state-missed)",
        "ring-track": "var(--ring-track)",
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "sans-serif"],
        arabic: ["var(--font-noto-naskh)", "serif"],
      },
      borderRadius: {
        card: "16px",
      },
      animation: {
        "pill-pop": "pill-pop 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
        "fade-in": "fade-in 0.3s ease forwards",
        "slide-up": "slide-up 0.4s ease forwards",
      },
      keyframes: {
        "pill-pop": {
          "0%": { transform: "scale(0.85)" },
          "60%": { transform: "scale(1.08)" },
          "100%": { transform: "scale(1)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};
export default config;
