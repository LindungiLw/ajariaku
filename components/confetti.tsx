import type { CSSProperties } from "react";

const PALETTE = ["#1591dc", "#4bb8fa", "#f5a524", "#22a06b", "#2c5ead", "#e21b3c"];

// Ledakan konfeti perayaan (sebaran polar). SATU komponen, sebelumnya diduplikasi 4× di
// /ajari (chat & Rapor), /belajar (Boss Quiz), /kursus. Atur jumlah/palet/posisi via props.
export function Konfeti({
  count = 24,
  colors = PALETTE,
  className = "pointer-events-none absolute inset-0 overflow-visible",
}: {
  count?: number;
  colors?: string[];
  className?: string;
}) {
  return (
    <span className={className} aria-hidden>
      {Array.from({ length: count }).map((_, i) => {
        const a = (i / count) * Math.PI * 2;
        const d = 90 + (i % 4) * 32;
        const cx = Math.round(Math.cos(a) * d);
        const cy = Math.round(Math.sin(a) * d - 20);
        const cr = (i % 2 ? 1 : -1) * (120 + i * 8);
        const delay = (i % 6) * 28;
        return (
          <span
            key={i}
            className="aa-confetti-piece"
            style={
              {
                background: colors[i % colors.length],
                animationDelay: `${delay}ms`,
                "--cx": `${cx}px`,
                "--cy": `${cy}px`,
                "--cr": `${cr}deg`,
              } as CSSProperties
            }
          />
        );
      })}
    </span>
  );
}
