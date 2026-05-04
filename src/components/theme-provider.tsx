"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getThemeVars, type ThemeName, type ThemeMode } from "@/app/theme";

type ThemeContextType = {
  mode: ThemeMode;
  toggleMode: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  mode: "light",
  toggleMode: () => undefined,
});

export function useTheme() {
  return useContext(ThemeContext);
}

const THEME: ThemeName = "honeybee";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme-mode") as ThemeMode | null;
    if (saved === "light" || saved === "dark") {
      setMode(saved);
    }
  }, []);

  useEffect(() => {
    const vars = getThemeVars(THEME, mode);
    for (const [key, value] of Object.entries(vars)) {
      document.body.style.setProperty(key, value);
    }
    localStorage.setItem("theme-mode", mode);
  }, [mode]);

  const toggleMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
