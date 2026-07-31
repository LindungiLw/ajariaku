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
    <div className="stagger flex flex-col gap-4">
      <h1 className="sr-only">Rapor Sesi · {topik}</h1>
      <section className="aa-card relative flex flex-col items-center gap-3 overflow-visible p-6 text-center">
        {data.mastery >= 70 && shown && (
          <Konfeti
            count={26}
            colors={["#e21b3c", "#1368ce", "#d89400", "#26890c", "#ffd54a"]}
            className="pointer-events-none absolute left-1/2 top-16 overflow-visible"
          />
        )}
        <div className="animate-float">
          <Mascot mood="happy" size={64} avatar={muridAvatar} char={muridChar} />
        </div>
        <span className="aa-pill-primary">Rapor Sesi · {topik}</span>
        {demo && (
          <span
            className="rounded-full px-2.5 py-0.5 text-[11px] font-bold"
            style={{ background: "color-mix(in srgb, var(--reward) 16%, transparent)", color: "var(--reward)" }}
          >
            Mode luring · analisis contoh
          </span>
        )}
        {sumber.length > 0 && !demo && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--tint)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--primary-deep)]">
            <BookCheck size={12} /> Sumber: Kurikulum Merdeka · {sumber.slice(0, 3).join(" · ")}
          </span>
        )}
        <div className="relative grid h-32 w-32 place-items-center">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle cx="60" cy="60" r="52" fill="none" stroke="var(--surface-3)" strokeWidth="12" />
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
              style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(.22,.9,.31,1)" }}
            />
          </svg>
          <div className="absolute text-center">
            <p className="aa-pop-big font-display text-3xl font-extrabold tnum">{count}</p>
            <p className="-mt-1 text-xs font-bold text-ink-soft">Skor Paham</p>
          </div>
        </div>
        <p className="text-sm text-ink-soft">
          {reteach ? (
            <>Kamu mengajari {murid} lagi, topik ini <b className="text-ink">sudah dikuasai</b> (XP tak ditambah).</>
          ) : (
            <>Kamu berhasil membuat {murid} paham &amp; dapat <b className="text-[var(--reward-ink)]">+{xp} XP</b></>
          )}
        </p>
      </section>

      {/* peta pemahaman */}
      <section className="aa-card p-5">
        <h2 className="mb-4 font-display text-lg font-extrabold">
          Peta Pemahaman
        </h2>
        <ul className="flex flex-col gap-4">
          {(data.konsep ?? []).map((k) => (
            <li key={k.label}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-semibold">{k.label}</span>
                <span className="font-bold tnum" style={{ color: LEVEL_COLOR[k.level] }}>
                  {k.pct}%
                </span>
              </div>
              <div className="aa-track">
                <div
                  className="aa-fill"
                  style={{
                    width: `${shown ? k.pct : 0}%`,
                    background: LEVEL_COLOR[k.level],
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* feedback */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="aa-card p-5">
          <p className="mb-2 flex items-center gap-2 font-display font-extrabold text-[var(--node-good)]">
            <CheckCircle2 size={18} /> Yang sudah kuat
          </p>
          <p className="text-sm text-ink-soft">{data.kuat}</p>
        </div>
        <div className="aa-card p-5">
          <p className="mb-2 flex items-center gap-2 font-display font-extrabold text-[var(--node-weak)]">
            <AlertTriangle size={18} /> Perlu diperkuat
          </p>
          <p className="text-sm text-ink-soft">{data.lemah}</p>
        </div>
      </section>

      {/* rekomendasi */}
      <section className="aa-card flex flex-col gap-3 p-5">
        <p className="flex items-center gap-2 font-display font-extrabold">
          <Lightbulb size={18} className="text-[var(--reward)]" /> Rekomendasi
        </p>
        <p className="text-sm text-ink-soft">{data.rekomendasi}</p>
        <div className="mt-1 flex flex-wrap gap-3">
          <Link href="/belajar" className="aa-btn">
            Perkuat Materi <ArrowRight size={18} />
          </Link>
          <button onClick={onRepeat} className="aa-btn-ghost">
            <RotateCcw size={16} /> Ajari Lagi
          </button>
        </div>
      </section>
    </div>
  );
}
