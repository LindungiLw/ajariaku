"use client";

import { useEffect, useState } from "react";
import { Mascot } from "@/components/mascot";
import { sapaan, DEFAULT_MURID_CHAR, type Pengajar } from "@/lib/profile";

// Splash "Selamat datang" singkat saat masuk app (setelah onboarding/login), lalu memudar sendiri.
export function WelcomeSplash({ profil, onDone }: { profil: Pengajar; onDone: () => void }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const hold = reduce ? 800 : 1700;
    const fade = reduce ? 220 : 480;
    const t1 = setTimeout(() => setLeaving(true), hold); // mulai fade-out
    const t2 = setTimeout(onDone, hold + fade); // lepas overlay setelah fade selesai
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone]);

  const SYM = [
    { c: "π", cls: "left-[16%] top-[24%] text-[var(--primary)]", d: ".2s", s: "text-3xl" },
    { c: "√", cls: "right-[18%] top-[30%] text-[var(--primary-bright)]", d: ".7s", s: "text-2xl" },
    { c: "∑", cls: "left-[22%] bottom-[26%] text-[var(--reward)]", d: "1.1s", s: "text-xl" },
    { c: "a²", cls: "right-[20%] bottom-[28%] text-[var(--primary-deep)]", d: ".9s", s: "text-2xl" },
  ];

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-[var(--bg)] transition-opacity duration-[480ms] ease-out ${leaving ? "opacity-0" : "opacity-100"}`}
      style={{
        background:
          "radial-gradient(90% 60% at 50% 8%, color-mix(in srgb, var(--primary-bright) 16%, transparent), transparent 60%), var(--bg)",
      }}
    >
      {/* simbol mengambang (dekoratif) */}
      {SYM.map((y) => (
        <span
          key={y.c}
          aria-hidden
          className={`animate-float pointer-events-none absolute font-display font-extrabold ${y.cls} ${y.s}`}
          style={{ animationDelay: y.d }}
        >
          {y.c}
        </span>
      ))}

      <div className="relative flex flex-col items-center gap-3 px-6 text-center">
        <div className="animate-pop">
          <div className="animate-float">
            <Mascot char={profil.muridChar || DEFAULT_MURID_CHAR} mood="happy" size={112} />
          </div>
        </div>
        <h1 className="animate-rise font-display text-2xl font-extrabold tracking-tight md:text-3xl" style={{ animationDelay: ".12s" }}>
          Selamat datang, {sapaan(profil)}! 🌟
        </h1>
        <p className="animate-rise max-w-xs text-ink-soft" style={{ animationDelay: ".24s" }}>
          Ayo mulai mengajari murid AImu.
        </p>
      </div>
    </div>
  );
}
