"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { applyTema, isDark } from "@/lib/theme";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [dark, setDark] = useState(false);
  
  useEffect(() => {
    setDark(isDark());
  }, []);
  
  function toggle() {
    const next = !dark;
    applyTema(next ? "dark" : "light");
    setDark(next);
  }
  
  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Ganti ke tema terang" : "Ganti ke tema gelap"}
      title={dark ? "Tema terang" : "Tema gelap"}
      className={`grid h-10 w-10 flex-none place-items-center rounded-full border border-line bg-surface text-ink transition-all hover:-translate-y-0.5 hover:border-[var(--primary)] hover:text-[var(--primary)] shadow-sm ${className}`}
    >
      {dark ? <Sun size={20} strokeWidth={2.5} /> : <Moon size={20} strokeWidth={2.5} />}
    </button>
  );
}
