"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type ThemeId = "black" | "blue" | "white" | "logo";

export const themes: { id: ThemeId; label: { en: string; ru: string; uz: string }; swatch: string }[] = [
  { id: "black", label: { en: "Gold", ru: "Gold", uz: "Gold" }, swatch: "#d4a853" },
  { id: "blue", label: { en: "Blue", ru: "Синий", uz: "Moviy" }, swatch: "#3b82f6" },
  { id: "white", label: { en: "White", ru: "Светлый", uz: "Oq" }, swatch: "#faf9f7" },
  { id: "logo", label: { en: "Logo", ru: "Лого", uz: "Logo" }, swatch: "linear-gradient(135deg,#ffffff 40%,#002040 40%,#002040 70%,#B08040 70%)" },
];

type ThemeContextValue = {
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "tourfix-theme";

function applyTheme(theme: ThemeId) {
  document.documentElement.setAttribute("data-theme", theme);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>("black");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeId | null;
    const initial = saved && themes.some((t) => t.id === saved) ? saved : "black";
    setThemeState(initial);
    applyTheme(initial);
  }, []);

  const setTheme = useCallback((t: ThemeId) => {
    setThemeState(t);
    applyTheme(t);
    localStorage.setItem(STORAGE_KEY, t);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
