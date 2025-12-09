"use client";

import { useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 bg-white dark:bg-gray-800 border-2 border-black dark:border-white text-black dark:text-white px-4 py-2 font-bold hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all rounded-none z-50"
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
    >
      {theme === "dark" ? <span>☀️</span> : <span>🌙</span>}
    </button>
  );
};

export default ThemeToggle;
