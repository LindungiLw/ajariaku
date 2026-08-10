"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, RotateCcw, AlertTriangle, Lightbulb, BookCheck } from "lucide-react";
import { CheckCircle2 } from "@/components/brand-icons";
import { Mascot } from "@/components/mascot";
import { Konfeti } from "@/components/confetti";
import { useProfil } from "@/components/profil-pengajar";
import { loadProfil, profilSummary, recordRapor } from "@/lib/memory";
import { sapaan } from "@/lib/profile";
import { PAKAI_GEMINI, fallbackRapor, toHistory, type Msg, type RaporData } from "@/lib/ajari-fallback";
import { geminiAllowed, noteGeminiCall } from "@/lib/gemini-guard";
import type { AvatarSpec } from "@/lib/avatar";

const LEVEL_COLOR: Record<"good" | "mid" | "weak", string> = {
  good: "var(--node-good)",
  mid: "var(--node-mid)",
  weak: "var(--node-weak)",
};

function Dot() {
  return <span className="h-2 w-2 animate-bounce rounded-full bg-ink-soft [animation-duration:1s]" />;
}

export function Rapor({
  xp,
  reteach = false,
  messages,
  topik,
  topikId,
  muridId,
  soal,
  muridNama,
  muridAvatar,
  onRepeat,
}: {
  xp: number;
  reteach?: boolean; // sesi ULANG topik tuntas → XP tak dikreditkan; jangan klaim/rekam metrik baru
  messages: Msg[];
  topik: string;
  topikId?: string;
  muridId?: string;
  soal: string;
  muridNama: string;
  muridAvatar?: AvatarSpec;
  onRepeat: () => void;
}) {
  const { profil: pengajar } = useProfil();
  const murid = muridNama;
  const [data, setData] = useState<RaporData | null>(null);
  const [demo, setDemo] = useState(false);
  const [sumber, setSumber] = useState<string[]>([]);

  useEffect(() => {
    let ok = true;
    (async () => {
      // Mode LOKAL: Rapor dihitung dari transkrip (sadar-konten), tanpa panggil Gemini.
      if (!PAKAI_GEMINI) {
        const local = fallbackRapor(messages);
        if (!ok) return;
        setData(local);
        setDemo(false);
        setSumber([topik]);
        if (!reteach) recordRapor(local, muridId); // re-teach topik tuntas → jangan gelembungkan hitung sesi/tren
        return;
      }
      let result: RaporData = fallbackRapor(messages);
      let fell = true;
      let hits: string[] = [];
      const boleh = geminiAllowed();
      if (boleh) noteGeminiCall(); // rapor juga dihitung terhadap batas harian per-perangkat
      try {
        if (!boleh) throw new Error("cap-harian"); // batas harian Gemini tercapai → rapor lokal
        const res = await fetch("/api/ajari", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            mode: "rapor",
            topic: topik,
            topikId,
            soal: soal,
            profil: profilSummary(loadProfil(muridId)),
            murid,
            sapaan: sapaan(pengajar),
            history: toHistory(messages),
          }),
        });
        const d = await res.json();
        // Validasi BENTUK tiap elemen konsep (level ∈ good|mid|weak, pct number) sebelum cast,
        // cegah crash/recordRapor tercemar bila LLM balas konsep malformed.
        const konsepValid =
          Array.isArray(d.konsep) &&
          d.konsep.every(
            (k: unknown): k is RaporData["konsep"][number] =>
              !!k &&
              typeof (k as { label?: unknown }).label === "string" &&
              typeof (k as { pct?: unknown }).pct === "number" &&
              ["good", "mid", "weak"].includes((k as { level?: unknown }).level as string),
          );
        if (!res.ok || d.fallback || typeof d.mastery !== "number" || !konsepValid)
          throw new Error("fallback");
        result = d as RaporData;
        fell = false;
        if (Array.isArray(d.sumber)) hits = d.sumber as string[];
      } catch {
        result = fallbackRapor(messages);
      }
      if (!ok) return;
      setData(result);
      setDemo(fell);
      setSumber(hits);
      if (!fell && !reteach) recordRapor(result, muridId); // rapor NYATA saja (bukan luring, bukan re-teach)
    })();
    return () => {
      ok = false;
    };
  }, [messages]);

  if (!data) return <RaporSkeleton muridAvatar={muridAvatar} muridChar={pengajar.muridChar} />;
  return <RaporView data={data} xp={xp} reteach={reteach} murid={murid} muridChar={pengajar.muridChar} muridAvatar={muridAvatar} topik={topik} demo={demo} sumber={sumber} onRepeat={onRepeat} />;
}

function RaporSkeleton({ muridAvatar, muridChar }: { muridAvatar?: AvatarSpec; muridChar?: string }) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <div className="animate-float">
        <Mascot mood="curious" size={56} avatar={muridAvatar} char={muridChar} />
      </div>
      <div className="flex gap-1.5">
        <Dot /> <Dot /> <Dot />
      </div>
      <p className="text-sm text-ink-soft">Menyusun Rapor Sesi…</p>
    </div>
  );
}

function RaporView({
  data,
  xp,
  reteach,
  murid,
  muridChar,
  muridAvatar,
  topik,
  demo,
  sumber,
  onRepeat,
}: {
  data: RaporData;
  xp: number;
  reteach: boolean;
  murid: string;
  muridChar: string;
  muridAvatar?: AvatarSpec;
  topik: string;
  demo: boolean;
  sumber: string[];
  onRepeat: () => void;
}) {
  const C = 2 * Math.PI * 52;
  const [shown, setShown] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setShown(true), 90);
    const target = Math.round(data.mastery);
    let n = 0;
    const iv = setInterval(() => {
      n += 2;
      if (n >= target) {
        n = target;
        clearInterval(iv);
      }
      setCount(n);
    }, 22);
    return () => {
      clearTimeout(t);
      clearInterval(iv);
    };
  }, [data.mastery]);

  return (
    <div className="stagger mx-auto flex w-full max-w-2xl flex-col gap-5 sm:gap-6">
      <h1 className="sr-only">Rapor Sesi · {topik}</h1>
      
      {/* Hero Section */}
      <section className="relative flex flex-col items-center gap-4 overflow-hidden rounded-3xl border border-[var(--primary)]/20 bg-gradient-to-b from-surface to-[var(--primary)]/5 p-6 text-center shadow-sm sm:p-8">
        {data.mastery >= 70 && shown && (
          <Konfeti
            count={30}
            colors={["#1591dc", "#4bb8fa", "#f5a524", "#22a06b", "#ffd54a"]}
            className="pointer-events-none absolute left-1/2 top-20 overflow-visible"
          />
        )}
        
        {/* Header Tags */}
        <div className="flex flex-col items-center gap-2">
          <div className="animate-float">
            <Mascot mood="happy" size={72} avatar={muridAvatar} char={muridChar} />
          </div>
          <span className="rounded-full bg-[var(--primary)]/10 px-3 py-1 text-[11px] font-bold text-[var(--primary-deep)] shadow-sm ring-1 ring-inset ring-[var(--primary)]/20">
            Rapor Sesi · {topik}
          </span>
          {demo && (
            <span className="rounded-full bg-[var(--reward)]/10 px-2.5 py-0.5 text-[10px] font-bold text-[var(--reward-ink)] ring-1 ring-inset ring-[var(--reward)]/20">
              Mode Luring · Analisis Contoh
            </span>
          )}
          {sumber.length > 0 && !demo && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-[10px] font-bold text-ink-soft shadow-sm ring-1 ring-line">
              <BookCheck size={12} className="text-[var(--primary)]" />
              Kurikulum Merdeka · {sumber.slice(0, 3).join(" · ")}
            </span>
          )}
        </div>

        {/* Circular Progress */}
        <div className="relative mt-2 grid h-40 w-40 place-items-center">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90 drop-shadow-md">
            <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" className="text-[var(--primary)]/10" strokeWidth="12" />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={shown ? C * (1 - data.mastery / 100) : C}
              style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.22,.9,.31,1)" }}
            />
          </svg>
          <div className="absolute text-center">
            <p className="font-display text-4xl font-black tracking-tight text-ink tnum">{count}</p>
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-ink-soft">Skor Paham</p>
          </div>
        </div>

        <p className="mt-2 text-[14px] font-medium text-ink-soft sm:text-[15px]">
          {reteach ? (
            <>Kamu mengajari {murid} lagi, topik ini <b className="text-ink">sudah dikuasai</b> (XP tak ditambah).</>
          ) : (
            <>Kamu berhasil membuat {murid} paham &amp; dapat <span className="inline-flex items-center gap-0.5 rounded border border-[var(--reward)]/20 bg-[var(--reward)]/10 px-1.5 py-0.5 font-bold text-[var(--reward-ink)]"><Star size={12} className="fill-[var(--reward)]" /> +{xp} XP</span></>
          )}
        </p>
      </section>

      {/* peta pemahaman */}
      <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm sm:p-8">
        <h2 className="mb-5 font-display text-xl font-extrabold text-ink">
          Peta Pemahaman
        </h2>
        <ul className="flex flex-col gap-5">
          {(data.konsep ?? []).map((k) => (
            <li key={k.label}>
              <div className="mb-2 flex items-center justify-between text-[14px]">
                <span className="font-bold text-ink">{k.label}</span>
                <span className="rounded-md bg-surface-2 px-2 py-0.5 font-display text-[13px] font-bold tnum" style={{ color: LEVEL_COLOR[k.level] }}>
                  {k.pct}%
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-line/50">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${shown ? k.pct : 0}%`,
                    background: LEVEL_COLOR[k.level],
                    boxShadow: `0 0 10px ${LEVEL_COLOR[k.level]}80`,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* feedback */}
      <section className="grid gap-4 sm:gap-5 md:grid-cols-2">
        <div className="rounded-3xl border border-[var(--node-good)]/20 bg-[var(--node-good)]/5 p-6 shadow-sm">
          <p className="mb-3 flex items-center gap-2 font-display text-[16px] font-black text-[var(--node-good)]">
            <CheckCircle2 size={20} className="fill-[var(--node-good)]/20" /> Yang sudah kuat
          </p>
          <p className="text-[14px] font-medium leading-relaxed text-ink-soft">{data.kuat}</p>
        </div>
        <div className="rounded-3xl border border-[var(--node-weak)]/20 bg-[var(--node-weak)]/5 p-6 shadow-sm">
          <p className="mb-3 flex items-center gap-2 font-display text-[16px] font-black text-[var(--node-weak)]">
            <AlertTriangle size={20} className="fill-[var(--node-weak)]/20" /> Perlu diperkuat
          </p>
          <p className="text-[14px] font-medium leading-relaxed text-ink-soft">{data.lemah}</p>
        </div>
      </section>

      {/* rekomendasi */}
      <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm sm:p-8">
        <p className="mb-3 flex items-center gap-2 font-display text-lg font-black text-ink">
          <Lightbulb size={22} className="fill-[var(--reward)] text-[var(--reward)] drop-shadow-sm" /> Rekomendasi
        </p>
        <p className="text-[14px] font-medium leading-relaxed text-ink-soft sm:text-[15px]">{data.rekomendasi}</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href="/belajar" className="aa-btn w-full justify-center sm:w-auto sm:px-8">
            Perkuat Materi <ArrowRight size={18} />
          </Link>
          <button onClick={onRepeat} className="aa-btn-ghost w-full justify-center sm:w-auto sm:px-6">
            <RotateCcw size={16} /> Ajari Lagi
          </button>
        </div>
      </section>
    </div>
  );
}
