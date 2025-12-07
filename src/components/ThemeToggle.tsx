"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      const saved = (typeof window !== "undefined" ? localStorage.getItem("abc_theme") : null) as "light" | "dark" | null;
      return saved || (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    try {
      document.documentElement.setAttribute("data-theme", theme);
    } catch {}
  }, [theme]);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("abc_theme", next); } catch {}
  }

  return (
    <button
      aria-label="Toggle theme"
      onClick={toggle}
      className="h-9 w-9 rounded-full border flex items-center justify-center"
      title={theme === "dark" ? "Chuyển sang sáng" : "Chuyển sang tối"}
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}
