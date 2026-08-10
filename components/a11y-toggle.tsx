"use client";

import { useEffect, useState, useRef } from "react";
import { Accessibility, Type, Space, Zap, Link as LinkIcon, X } from "lucide-react";

export function A11yToggle({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  
  // 4 States for our A11y features
  const [text, setText] = useState(false);
  const [space, setSpace] = useState(false);
  const [motion, setMotion] = useState(false);
  const [links, setLinks] = useState(false);
  
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const initText = localStorage.getItem("ajari-aku:a11y-text") === "true";
      const initSpace = localStorage.getItem("ajari-aku:a11y-spacing") === "true";
      const initMotion = localStorage.getItem("ajari-aku:a11y-motion") === "true";
      const initLinks = localStorage.getItem("ajari-aku:a11y-links") === "true";
      
      setText(initText);
      setSpace(initSpace);
      setMotion(initMotion);
      setLinks(initLinks);
      
      if (initText) document.documentElement.setAttribute("data-a11y-text", "true");
      if (initSpace) document.documentElement.setAttribute("data-a11y-spacing", "true");
      if (initMotion) document.documentElement.setAttribute("data-a11y-motion", "true");
      if (initLinks) document.documentElement.setAttribute("data-a11y-links", "true");
    } catch {}
  }, []);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  const toggle = (key: string, state: boolean, setter: (v: boolean) => void) => {
    const next = !state;
    setter(next);
    if (next) {
      document.documentElement.setAttribute(`data-a11y-${key}`, "true");
      localStorage.setItem(`ajari-aku:a11y-${key}`, "true");
    } else {
      document.documentElement.removeAttribute(`data-a11y-${key}`);
      localStorage.removeItem(`ajari-aku:a11y-${key}`);
    }
  };

  const OPTIONS = [
    { id: "text", state: text, setter: setText, icon: Type, label: "Perbesar Teks" },
    { id: "spacing", state: space, setter: setSpace, icon: Space, label: "Jarak Teks Luas" },
    { id: "motion", state: motion, setter: setMotion, icon: Zap, label: "Kurangi Animasi" },
    { id: "links", state: links, setter: setLinks, icon: LinkIcon, label: "Sorot Tautan" },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Pengaturan Aksesibilitas"
        title="Aksesibilitas"
        className={`grid h-10 w-10 flex-none place-items-center rounded-full border border-line bg-surface text-ink transition-all hover:-translate-y-0.5 hover:border-[var(--primary)] hover:text-[var(--primary)] shadow-sm ${className} ${open ? "border-[var(--primary)] text-[var(--primary)]" : ""}`}
      >
        <Accessibility size={20} strokeWidth={2.5} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-line bg-surface p-2 shadow-lg z-50">
          <div className="flex items-center justify-between px-2 pb-2 pt-1 border-b border-line mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-soft">Aksesibilitas</span>
            <button onClick={() => setOpen(false)} className="text-ink-soft hover:text-ink"><X size={14} /></button>
          </div>
          
          <div className="flex flex-col">
            {OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => toggle(opt.id, opt.state, opt.setter)}
                className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-surface-2"
              >
                <div className={`grid h-8 w-8 flex-none place-items-center rounded-lg transition-colors ${opt.state ? "bg-[var(--primary)] text-white" : "bg-surface-3 text-ink-soft"}`}>
                  <opt.icon size={16} strokeWidth={opt.state ? 3 : 2} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[13px] font-bold text-ink">{opt.label}</p>
                </div>
                <div className={`relative h-4 w-7 flex-none rounded-full transition-colors ${opt.state ? "bg-[var(--primary)]" : "bg-line"}`}>
                  <div className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all ${opt.state ? "left-[14px]" : "left-0.5"}`} />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
