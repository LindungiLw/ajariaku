"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ChevronRight, PlayCircle } from "lucide-react";
import { BrainCircuit, Zap, Flame, Trophy, Award, BookOpen } from "@/components/brand-icons";
import { Mascot } from "@/components/mascot";
import dynamic from "next/dynamic";
import { useProfil } from "@/components/profil-pengajar";
import { sapaan, namaMurid } from "@/lib/profile";
import { loadProgress, setSesi, levelInfo, streakDays, type Progress } from "@/lib/progress";
import { tierOf, nextTier } from "@/lib/liga";
import { evalAchievements } from "@/lib/achievements";
import { loadMurid } from "@/lib/murid";
import { activeTopikFor } from "@/lib/next-topic";
import { buildSesi } from "@/lib/sesi";
import { loadProfil as loadMem, type Profil as MemProfil } from "@/lib/memory";

// Ikon & kartu statistik khas "Ajari Aku"
// Wadah ikon: squircle bergradien sewarna aksen (ikon SVG buatan sendiri).
function StatIcon({ icon: Icon, color, solid = false, size = 18 }: { icon: (props: { size?: number }) => ReactNode; color: string; solid?: boolean; size?: number }) {
  const style = solid
    ? { background: `linear-gradient(140deg, ${color}, color-mix(in srgb, ${color} 60%, #000))`, color: "#fff", boxShadow: `0 5px 12px -4px color-mix(in srgb, ${color} 60%, transparent)` }
    : { background: `linear-gradient(140deg, color-mix(in srgb, ${color} 24%, transparent), color-mix(in srgb, ${color} 8%, transparent))`, color, boxShadow: "inset 0 1px 0 color-mix(in srgb, #fff 45%, transparent)" };
  return (
    <span className="relative grid h-10 w-10 flex-none place-items-center rounded-[10px]" style={style}>
      <Icon size={size} />
    </span>
  );
}

// Kartu berciri khas: border ber-aksen + glow lembut sesuai warnanya (bukan border abu generik).
function StatCard({ color, className = "", children }: { color: string; className?: string; children: ReactNode }) {
  return (
    <div
      className={`group relative overflow-visible rounded-[var(--r-card)] border bg-surface p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${className}`}
      style={{ borderColor: `color-mix(in srgb, ${color} 34%, var(--line))`, boxShadow: `0 1px 3px color-mix(in srgb, ${color} 15%, transparent), 0 4px 12px -8px color-mix(in srgb, ${color} 32%, transparent)` }}
    >
      {/* Subtle glow on hover */}
      <div className="absolute inset-0 rounded-[var(--r-card)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ boxShadow: `0 8px 24px -8px color-mix(in srgb, ${color} 40%, transparent)` }} />
      <div className="relative z-10 flex h-full flex-col">
        {children}
      </div>
    </div>
  );
}

// DemoSesi (peraga) hanya muncul saat diklik → dipisah dari bundle awal (next/dynamic).
const DemoSesi = dynamic(() => import("@/components/demo-sesi").then((m) => m.DemoSesi), { ssr: false });

const SEED_P: Progress = { selesai: [], xp: 0, riwayat: [] };
// HANYA ambang yang benar-benar punya medali (achievements.ts: Rajin Belajar 7 hari, Konsisten 30
// hari), supaya teks "…ke medali N hari" tak menjanjikan lencana yang tak ada (mis. 3/14/60/100).
const MILESTONES = [7, 30];

export default function BerandaPage() {
  const router = useRouter();
  const { profil: pengajar } = useProfil();
  const [prog, setProg] = useState<Progress | null>(null);
  const [mem, setMem] = useState<MemProfil | null>(null);
  const [medali, setMedali] = useState({ on: 0, tot: 12, baru: "" });
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    const pp = loadProgress();
    setProg(pp);
    setMem(loadMem());
    // Medali bergantung localStorage murid → hitung di klien (cegah mismatch hydration).
    const naik = loadMurid().filter((m) => levelInfo(m.xp ?? 0).level >= 2).length;
    const ach = evalAchievements(pp, { muridNaikLevel: naik });
    const on = ach.filter((a) => a.unlocked);
    setMedali({ on: on.length, tot: ach.length, baru: on[on.length - 1]?.nama ?? "" });
  }, []);

  const p = prog ?? SEED_P;
  const active = activeTopikFor(pengajar.jenjang, p.selesai); // hormati jenjang onboarding
  const murid = namaMurid(pengajar);
  const jenjang = pengajar.jenjang || "SMA";

  // Ringkasan gamifikasi (dari progres nyata).
  const { level, into, need, pct } = levelInfo(p.xp);
  const streak = streakDays(p.riwayat);
  const tier = tierOf(p.xp);
  const nxt = nextTier(p.xp);
  const nm = MILESTONES.find((m) => m > streak) ?? null;
  const konsep = p.selesai.filter((id) => id !== "ujian-fase-e").length;
  const koreksi = p.koreksi ?? 0;

  function mulai() {
    setSesi(buildSesi(active.id, null)); // sesi solo (tanpa murid) dari Beranda
    router.push("/ajari");
  }

  return (
    <div className="stagger flex flex-col gap-4">
      <h1 className="sr-only">Beranda Ajari Aku</h1>

      {/* HERO: murid AI menunggu diajari (protégé effect) */}
      <section className="relative overflow-hidden aa-card p-5 md:p-6">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(75% 95% at 8% 15%, color-mix(in srgb, var(--primary) 22%, transparent), transparent 60%)," +
              "radial-gradient(70% 90% at 105% 110%, color-mix(in srgb, #7c5cff 20%, transparent), transparent 62%)",
          }}
        />
        <div className="relative">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--primary)]">Murid AI-mu menunggu diajari</p>
          <div className="mt-3 flex flex-col items-start gap-4 sm:flex-row">
            {/* maskot dalam lingkaran menyala (maskot KITA, Pio) */}
            <div className="relative flex-none">
              <div
                className="pointer-events-none absolute inset-0 rounded-full blur-2xl"
                style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--primary) 60%, transparent), transparent 70%)" }}
              />
              <div className="relative grid h-[86px] w-[86px] place-items-center rounded-full ring-1 ring-[var(--primary)]/30" style={{ background: "color-mix(in srgb, var(--primary) 12%, var(--surface-2))" }}>
                <Mascot mood="curious" size={68} char={pengajar.muridChar} className="animate-float" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              {/* gelembung obrolan murid */}
              <div className="relative rounded-2xl rounded-bl-sm border border-[var(--primary)]/20 bg-gradient-to-br from-surface to-surface-2 px-4 py-3 text-[14px] leading-relaxed shadow-[0_8px_30px_-12px_rgba(21,145,220,0.2)]">
                Halo, <b>{sapaan(pengajar)}</b>! Aku <b>{murid}</b> 👋 Aku lagi bingung soal{" "}
                <b className="text-[var(--primary-deep)]">{active.judul}</b>, bantu aku paham dong!
              </div>
              {/* aksi */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button onClick={mulai} className="aa-btn">
                  Ajari Sekarang <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => setShowDemo(true)}
                  className="flex items-center gap-1.5 rounded-full border border-line bg-surface px-4 py-2.5 text-sm font-bold text-ink-soft transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
                >
                  <PlayCircle size={15} /> Lihat contoh sesi
                </button>
              </div>
              {/* konteks topik */}
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--tint)] px-3 py-1 text-[11px] font-bold text-[var(--primary-deep)]">
                🎓 {jenjang} · {active.judul}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4 kartu ringkas: XP · Hari Beruntun · Liga · Medali */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* XP */}
        <StatCard color="var(--primary)" className="flex flex-col gap-2">
          <StatIcon icon={Zap} color="var(--primary)" size={17} />
          <div>
            <p className="font-display text-2xl font-extrabold leading-none tnum">{p.xp}</p>
            <p className="mt-1 text-[11px] font-bold text-ink-soft">Total XP</p>
          </div>
          <div className="mt-auto">
            <div className="aa-track" style={{ height: 5 }}>
              <div className="aa-fill" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-1 text-[10px] text-ink-soft tnum">{into}/{need} menuju Lv {level + 1}</p>
          </div>
        </StatCard>

        {/* Hari Beruntun */}
        <StatCard color="var(--reward)" className="flex flex-col gap-2">
          <StatIcon icon={(pr) => <Flame {...pr} style={{ fill: streak > 0 ? "var(--reward)" : "transparent" }} />} color="var(--reward)" size={17} />
          <div>
            <p className="font-display text-2xl font-extrabold leading-none tnum">{streak}</p>
            <p className="mt-1 text-[11px] font-bold text-ink-soft">Hari beruntun</p>
          </div>
          <p className="mt-auto text-[10px] leading-tight text-ink-soft tnum">
            {nm ? `${nm - streak} hari lagi ke medali ${nm} hari 🔥` : "streak-mu mantap! 🔥"}
          </p>
        </StatCard>

        {/* Liga */}
        <StatCard color={tier.warna} className="flex flex-col gap-2">
          <StatIcon icon={Trophy} color={tier.warna} solid size={16} />
          <div>
            <p className="font-display text-lg font-extrabold leading-tight" style={{ color: tier.warna }}>{tier.nama}</p>
            <p className="mt-1 text-[11px] font-bold text-ink-soft">Liga mingguan</p>
          </div>
          <p className="mt-auto text-[10px] leading-tight text-ink-soft tnum">
            {nxt ? `${nxt.min - p.xp} XP untuk naik ke ${nxt.nama}` : "liga tertinggi 🏆"}
          </p>
        </StatCard>

        {/* Medali */}
        <StatCard color="var(--reward)" className="flex flex-col gap-2">
          <StatIcon icon={Award} color="var(--reward)" solid size={16} />
          <div>
            <p className="font-display text-2xl font-extrabold leading-none tnum">
              {medali.on}
              <span className="text-sm font-bold text-ink-soft">/{medali.tot}</span>
            </p>
            <p className="mt-1 text-[11px] font-bold text-ink-soft">Medali terbuka</p>
          </div>
          <p className="mt-auto truncate text-[10px] leading-tight text-ink-soft">
            {medali.baru ? `Medali teratas: ${medali.baru} ✓` : "ajari 1 konsep untuk mulai"}
          </p>
        </StatCard>
      </div>

      {/* 2 kartu metrik USP: konsep dikuasai · miskonsepsi dibongkar */}
      <div className="grid gap-3 sm:grid-cols-2">
        <StatCard color="var(--primary)" className="flex items-center gap-3">
          <StatIcon icon={BookOpen} color="var(--primary)" size={19} />
          <div className="min-w-0">
            <p className="font-display text-2xl font-extrabold leading-none tnum">{konsep}</p>
            <p className="mt-1 text-[12px] text-ink-soft">konsep dikuasai lewat mengajar</p>
          </div>
        </StatCard>
        <StatCard color="var(--node-good)" className="flex items-center gap-3">
          <StatIcon icon={BrainCircuit} color="var(--node-good)" size={19} />
          <div className="min-w-0">
            <p className="font-display text-2xl font-extrabold leading-none tnum">{koreksi}</p>
            <p className="mt-1 text-[12px] text-ink-soft">miskonsepsi {murid} berhasil kamu bongkar</p>
          </div>
        </StatCard>
      </div>

      {/* Fokusmu: deteksi celah adaptif (USP) */}
      <section className="aa-card p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="flex items-center gap-2 font-display text-sm font-extrabold text-ink-soft">
            <BrainCircuit size={16} className="text-[var(--primary)]" /> Fokusmu
          </p>
          {!mem?.weakest && (
            <button onClick={mulai} className="flex flex-none items-center gap-1 rounded-full bg-[var(--tint)] px-3 py-1.5 text-xs font-bold text-[var(--primary-deep)] transition-colors hover:brightness-105">
              Mulai sesi <ArrowRight size={13} />
            </button>
          )}
        </div>
        {mem?.weakest ? (
          <>
            <p className="mt-2 font-display text-lg font-extrabold">{mem.weakest.konsep}</p>
            <div className="aa-track mt-2">
              <div className="aa-fill" style={{ width: `${mem.weakest.pct}%`, background: "var(--node-mid)" }} />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-ink-soft tnum">Penguasaan {mem.weakest.pct}%</span>
              <Link href="/belajar" className="flex items-center gap-1 text-sm font-bold text-[var(--primary)]">
                Perkuat <ChevronRight size={14} />
              </Link>
            </div>
          </>
        ) : (
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Belum ada celah terdeteksi. Ajari {murid} satu konsep, di titik kamu kesulitan menjelaskan, peta pemahamanmu muncul otomatis di sini. 👆
          </p>
        )}
      </section>

      {showDemo && <DemoSesi onClose={() => setShowDemo(false)} />}
    </div>
  );
}
