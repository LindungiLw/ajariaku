"use client";

// Peraga: memutar OTOMATIS satu contoh sesi mengajar (siswa jelaskan → murid AI keliru →
// dikoreksi → paham → Rapor). Ditandai jelas "Peraga" agar jujur (bukan data asli).
// Tujuannya: setiap pengunjung mengalami inti produk tanpa harus mengetik.

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, ArrowRight, BookCheck, PlayCircle } from "lucide-react";
import { CheckCircle2 } from "@/components/brand-icons";
import { Mascot } from "@/components/mascot";
import { useProfil } from "@/components/profil-pengajar";
import { sapaan, namaMurid, DEFAULT_MURID_CHAR } from "@/lib/profile";

type Baris = { from: "murid" | "kamu"; text: string; oops?: boolean };

const SCRIPT_LEN = 5;

// Skrip peraga memakai persona pengguna (sapaan + nama murid pilihannya), bukan "Kak Pio" tetap.
function buildScript(sap: string, murid: string): Baris[] {
  return [
    { from: "murid", text: `Halo ${sap}! Aku ${murid} 🦉 Bantu aku dong: gimana nyederhanain 2⁵ × 2³ : 2⁴?` },
    { from: "kamu", text: "Kalau basisnya sama, pas dikali pangkatnya dijumlah. Jadi 2⁵ × 2³ = 2⁸." },
    { from: "murid", text: `Ooh… berarti 2⁸ : 2⁴ = 2² ya ${sap}? (8 dibagi 4) 🤔`, oops: true },
    { from: "kamu", text: "Hampir! Pas dibagi, pangkatnya DIKURANG, bukan dibagi. Jadi 8 − 4 = 4." },
    { from: "murid", text: `Ahh iya! Jadi hasilnya 2⁴ = 16. Sekarang aku paham, makasih ${sap}! 🌟` },
  ];
}

const KONSEP = [
  { label: "Sifat eksponen", pct: 90, warna: "var(--node-good)" },
  { label: "Operasi pangkat (bagi)", pct: 82, warna: "var(--node-good)" },
  { label: "Ketelitian langkah", pct: 68, warna: "var(--node-mid)" },
];

export function DemoSesi({ onClose }: { onClose: () => void }) {
  const { profil } = useProfil();
  const sap = sapaan(profil);
  const murid = namaMurid(profil);
  const muridChar = profil.muridChar || DEFAULT_MURID_CHAR;
  const SCRIPT = buildScript(sap, murid);
  const [step, setStep] = useState(0);
  const [rapor, setRapor] = useState(false);

  useEffect(() => {
    if (step >= SCRIPT_LEN) {
      const t = setTimeout(() => setRapor(true), 900);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep((s) => s + 1), step === 0 ? 500 : 1700);
    return () => clearTimeout(t);
  }, [step]);

  const shown = SCRIPT.slice(0, step);
  const typingMurid = step < SCRIPT.length && SCRIPT[step].from === "murid";

  return (
    <div className="fixed inset-0 z-[60] grid place-items-end bg-black/50 backdrop-blur-sm sm:place-items-center sm:p-4" onClick={onClose}>
      <div
        className="aa-card flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-b-none sm:rounded-b-[var(--r-card)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center gap-3 border-b border-line p-4">
          <span className="grid h-9 w-9 flex-none place-items-center rounded-2xl bg-gradient-to-br from-[var(--cta-1)] to-[var(--cta-2)] text-white">
            <PlayCircle size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display font-extrabold leading-tight">Contoh Sesi Mengajar</p>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--reward-ink)]">Peraga · bukan data asli</p>
          </div>
          <button onClick={onClose} aria-label="Tutup" className="grid h-10 w-10 flex-none place-items-center rounded-lg text-ink-soft hover:bg-surface-2">
            <X size={18} />
          </button>
        </div>

        {/* papan tulis */}
        <div className="border-b border-line bg-surface-2 px-4 py-2.5 text-center">
          <p className="text-[11px] font-bold uppercase tracking-wider text-ink-soft">Papan Tulis · Eksponen</p>
          <p className="font-display text-lg font-extrabold">2⁵ × 2³ : 2⁴</p>
        </div>

        {/* isi */}
        <div className="flex-1 overflow-y-auto p-4">
          {!rapor ? (
            <div className="flex flex-col gap-3">
              {shown.map((m, i) =>
                m.from === "murid" ? (
                  <div key={i} className="animate-rise flex items-end gap-2 self-start">
                    <Mascot mood={m.oops ? "oops" : "curious"} size={28} char={muridChar} className="mb-1" />
                    <p className="max-w-[82%] rounded-[18px] rounded-bl-md border border-line bg-surface px-3.5 py-2 text-sm leading-relaxed">
                      {m.text}
                    </p>
                  </div>
                ) : (
                  <div key={i} className="animate-rise flex flex-col items-end self-end">
                    <p className="max-w-[82%] rounded-[18px] rounded-br-md bg-gradient-to-br from-[var(--cta-1)] to-[var(--cta-2)] px-3.5 py-2 text-sm leading-relaxed text-white">
                      {m.text}
                    </p>
                  </div>
                ),
              )}
              {typingMurid && (
                <div className="flex items-end gap-2 self-start">
                  <Mascot mood="curious" size={28} char={muridChar} className="mb-1" />
                  <span className="flex gap-1 rounded-[18px] rounded-bl-md border border-line bg-surface px-3.5 py-2.5">
                    <Dot /> <Dot /> <Dot />
                  </span>
                </div>
              )}
              {/* momen koreksi disorot setelah baris ke-4 tampil */}
              {step >= 4 && (
                <div className="animate-rise mx-auto w-fit rounded-full bg-[var(--node-good)] px-3 py-1 text-xs font-extrabold text-white">
                  Kamu mengoreksi {murid}! 🎯 +15 XP
                </div>
              )}
            </div>
          ) : (
            <div className="stagger flex flex-col items-center gap-3 text-center">
              <div className="animate-float">
                <Mascot mood="happy" size={56} char={muridChar} />
              </div>
              <span className="aa-pill-primary">Rapor Sesi · Eksponen</span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--tint)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--primary-deep)]">
                  <BookCheck size={12} /> Sumber: Kurikulum Merdeka · Eksponen
                </span>
                <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold" style={{ background: "color-mix(in srgb, var(--node-good) 16%, transparent)", color: "var(--node-good)" }}>
                  <CheckCircle2 size={12} /> 1 miskonsepsi dikoreksi
                </span>
              </div>
              <div className="relative my-1 grid h-24 w-24 place-items-center">
                <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="var(--surface-3)" strokeWidth="12" />
                  <circle cx="60" cy="60" r="52" fill="none" stroke="var(--primary)" strokeWidth="12" strokeLinecap="round" strokeDasharray={2 * Math.PI * 52} strokeDashoffset={2 * Math.PI * 52 * (1 - 0.88)} />
                </svg>
                <div className="absolute text-center">
                  <p className="font-display text-2xl font-extrabold tnum">88</p>
                  <p className="-mt-1 text-[10px] font-bold text-ink-soft">Skor Paham</p>
                </div>
              </div>
              <ul className="w-full max-w-xs space-y-2.5">
                {KONSEP.map((k) => (
                  <li key={k.label}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="font-semibold">{k.label}</span>
                      <span className="font-bold tnum" style={{ color: k.warna }}>{k.pct}%</span>
                    </div>
                    <div className="aa-track">
                      <div className="aa-fill" style={{ width: `${k.pct}%`, background: k.warna }} />
                    </div>
                  </li>
                ))}
              </ul>
              <p className="max-w-xs text-xs leading-relaxed text-ink-soft">
                Celah muncul dari <b className="text-ink">cara {murid} menjelaskan</b>, kamu menangkap
                salah operasi pangkat dan membetulkannya. Itulah inti Ajari Aku.
              </p>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="flex gap-2 border-t border-line p-3">
          <button onClick={onClose} className="aa-btn-ghost flex-1 justify-center">Tutup</button>
          <Link href="/ajari" className="aa-btn flex-1 justify-center" onClick={onClose}>
            Coba sendiri <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function Dot() {
  return <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-soft [animation-duration:1s]" />;
}
