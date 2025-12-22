"use client";

import { useEffect, useState } from "react";

export type ITheme = "light" | "dark";

export const useTheme = () => {
  const [theme, setTheme] = useState<ITheme>("light");

  const toggleTheme = () =>
    theme === "light" ? setTheme("dark") : setTheme("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return { theme, toggleTheme };
};
