"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { Star, Target, TrendingUp, Trophy } from "@/components/brand-icons";
import { onCelebrate, type Celebration } from "@/lib/celebrate";
import { ACH_ICON } from "@/lib/achievements";

type Toast = Celebration & { key: number };

function visual(t: Toast): { Icon: ComponentType<{ size?: number }>; warna: string } {
  if (t.kind === "xp") return { Icon: Star, warna: "var(--reward)" };
  if (t.kind === "koreksi") return { Icon: Target, warna: "var(--node-good)" };
  if (t.kind === "level") return { Icon: TrendingUp, warna: "var(--primary)" };
  if (t.kind === "tier") return { Icon: Trophy, warna: t.warna };
  return { Icon: ACH_ICON[t.ikon] ?? Star, warna: t.warna };
}

// Menumpuk toast perayaan di tengah-atas (di bawah navbar). Auto-hilang.
export function CelebrationHost() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    return onCelebrate((items) => {
      const added = items.map((it) => ({ ...it, key: ++idRef.current }));
      setToasts((cur) => [...cur, ...added].slice(-4)); // maksimal 4 tampil sekaligus
      // Jadwalkan auto-hilang SEKALI per toast saat dibuat → menambah/menghapus toast lain TIDAK
      // me-reset hitung mundur 3 dtk toast yang sudah tampil (dulu semua timer dijadwalkan ulang).
      added.forEach((t) =>
        setTimeout(() => setToasts((c) => c.filter((x) => x.key !== t.key)), 3000),
      );
    });
  }, []);

  // Region aria-live SELALU ada di DOM (walau kosong) supaya screen reader mengumumkan toast yang
  // disisipkan belakangan: live region yang di-mount bersamaan isinya sering tak terbaca.
  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-16 z-50 flex flex-col items-center gap-2 px-4"
      aria-live="polite"
    >
      {toasts.map((t) => {
        const { Icon, warna } = visual(t);
        return (
          <div
            key={t.key}
            className="animate-pop flex w-fit max-w-[92%] items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-2.5 shadow-[var(--shadow-2)]"
          >
            <span
              className="grid h-9 w-9 flex-none place-items-center rounded-xl text-white"
              style={{ background: `linear-gradient(140deg, ${warna}, color-mix(in srgb, ${warna} 68%, #000))` }}
            >
              <Icon size={18} />
            </span>
            <span className="min-w-0">
              <span className="block font-display text-sm font-extrabold leading-tight text-ink">{t.label}</span>
              <span className="block text-[11px] font-semibold text-ink-soft">{t.sub}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
