"use client";

import { useEffect, useState } from "react";
import { Copy, Check, Lock, RotateCcw, CalendarDays } from "lucide-react";
import { Star, Flame, Trophy, Award, BookOpen, Target, BrainCircuit, TrendingUp, Search } from "@/components/brand-icons";
import { Mascot } from "@/components/mascot";
import { useProfil } from "@/components/profil-pengajar";
import { sapaan, namaMurid } from "@/lib/profile";
import { loadMurid } from "@/lib/murid";
import { loadProgress, levelInfo, activityByDay, streakDays, type Progress } from "@/lib/progress";
import { tierOf } from "@/lib/liga";
import { evalAchievements, ACH_ICON } from "@/lib/achievements";
import { loadProfil as loadMem, clearProfil, type Profil as MemProfil, type MasteryLevel } from "@/lib/memory";
import { Leaderboard } from "@/components/leaderboard";

const SEED_P: Progress = { selesai: [], xp: 0, riwayat: [] };

const LEVEL_COLOR: Record<MasteryLevel, string> = {
  good: "var(--node-good)", mid: "var(--node-mid)", weak: "var(--node-weak)",
};
const LEVEL_LABEL: Record<MasteryLevel, string> = {
  good: "Kuat", mid: "Sedang", weak: "Perlu latihan",
};

const HEAT = [
  "var(--surface-3)",
  "color-mix(in srgb, var(--primary) 28%, var(--surface-3))",
  "color-mix(in srgb, var(--primary) 55%, transparent)",
  "color-mix(in srgb, var(--primary) 78%, transparent)",
  "var(--primary)",
];
const DAY = 86400000;
const HEAT_DAYS = 14; // 2 minggu terakhir, satu baris, bersih

type TabId = "ringkasan" | "peringkat" | "medali";

export default function ProgresPage() {
  const { profil: pengajar } = useProfil();
  const [prog, setProg] = useState<Progress | null>(null);
  const [mem, setMem] = useState<MemProfil | null>(null);
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<TabId>("ringkasan");

  useEffect(() => {
    setProg(loadProgress());
    setMem(loadMem());
  }, []);

  const p = prog ?? SEED_P;
  const { level, into, need, pct } = levelInfo(p.xp);
  const tier = tierOf(p.xp);
  // Ujian/Boss bukan "konsep diajar" → jangan diikutkan dalam hitungan pelajaran.
  const lessons = p.selesai.filter((id) => id !== "ujian-fase-e").length;
  const muridCount = prog ? loadMurid().length : 0;
  // Murid Ruang Kelas yang sudah naik level (≥ Lv 2) → syarat lencana "Wali Kelas".
  const muridNaik = prog ? loadMurid().filter((m) => levelInfo(m.xp ?? 0).level >= 2).length : 0;
  const ach = evalAchievements(p, { muridNaikLevel: muridNaik });
  const unlocked = ach.filter((a) => a.unlocked).length;

  // Metrik ringkasan (bukti dampak produk)
  const streak = streakDays(p.riwayat);
  const koreksi = p.koreksi ?? 0; // miskonsepsi murid AI yang berhasil dikoreksi (USP)
  const celah = mem ? Object.values(mem.mastery).filter((m) => m.level !== "good").length : 0;
  const murid = namaMurid(pengajar);

  // peta pemahaman: MURNI dari memori nyata (kosong sampai ada sesi mengajar)
  type MasteryRow = { konsep: string; level: MasteryLevel; pct: number };
  const mastery: MasteryRow[] = mem
    ? Object.entries(mem.mastery)
        .map(([konsep, v]) => ({ konsep, level: v.level, pct: v.pct }))
        .sort((a, b) => a.pct - b.pct)
    : [];

  // peta aktivitas NYATA: jumlah sesi per hari, 14 hari terakhir
  const act = activityByDay(p.riwayat);
  // today0/heatCells dihitung HANYA setelah mount (prog !== null): new Date() di server (UTC/waktu
  // build) berbeda dari klien (WIB), yang tanpa guard memicu hydration mismatch pada atribut title sel.
  const today0 = prog ? (() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); })() : 0;
  const heatCells = Array.from({ length: HEAT_DAYS }, (_, i) => {
    const day = today0 - (HEAT_DAYS - 1 - i) * DAY;
    const cnt = prog ? (act.get(day) ?? 0) : 0;
    return { day, cnt, lvl: cnt === 0 ? 0 : Math.min(4, cnt) };
  });
  const hariAktif = heatCells.filter((c) => c.cnt > 0).length;

  const ringkasanText =
    `Ringkasan Belajar, Ajari Aku\n` +
    `Guru: ${sapaan(pengajar)} · Level ${level} · ${p.xp} XP\n` +
    `Konsep diajarkan: ${lessons}\n` +
    `Miskonsepsi dikoreksi: ${koreksi}\n` +
    `Celah terdeteksi: ${celah}\n` +
    `Hari beruntun: ${streak}` +
    (mem?.weakest ? `\nFokus berikutnya: ${mem.weakest.konsep} (${mem.weakest.pct}%)` : "");
  function salinRingkasan() {
    navigator.clipboard?.writeText(ringkasanText).then(
      () => { setCopied(true); setTimeout(() => setCopied(false), 1600); },
      () => {},
    );
  }
  function resetMem() { clearProfil(); setMem(null); }

  const TABS: { id: TabId; label: string; icon: typeof Trophy }[] = [
    { id: "ringkasan", label: "Ringkasan", icon: TrendingUp },
    { id: "peringkat", label: "Peringkat", icon: Trophy },
    { id: "medali", label: "Medali", icon: Award },
  ];

  return (
    <div className="flex flex-col gap-4">
      <h1 className="sr-only">Progres Belajar</h1>

      {/* Kartu profil (tetap tampil di tiap tab) */}
      <section className="aa-card p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <div className="grid h-16 w-16 flex-none place-items-center rounded-full bg-[var(--tint)] ring-4 ring-[var(--primary)]/15">
            <Mascot mood="happy" size={44} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-ink-soft">Profil Pengajar</p>
            <p className="font-display text-2xl font-extrabold leading-tight">{sapaan(pengajar)}</p>
            <p className="text-sm text-ink-soft">
              Guru dari {murid}{muridCount > 0 ? ` & ${muridCount} murid lainnya` : ""} · Level {level}
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              <Chip icon={Trophy} color={tier.warna}>Liga {tier.nama}</Chip>
              <Chip icon={Flame} color="var(--reward-ink)">{streak} hari beruntun</Chip>
              <Chip icon={Award} color="var(--reward-ink)">{unlocked}/{ach.length} medali</Chip>
            </div>
          </div>
          <div className="ml-auto text-right">
            <p className="font-display text-3xl font-extrabold tnum text-[var(--primary)]">{p.xp}</p>
            <p className="text-[11px] text-ink-soft tnum">TOTAL XP · {into}/{need} ke Lv {level + 1}</p>
            <div className="mt-1.5 h-2 w-32 overflow-hidden rounded-full bg-surface-3">
              <div className="h-full rounded-full bg-gradient-to-r from-[var(--cta-1)] to-[var(--cta-2)]" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
      </section>

      {/* Tab bar */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-1 rounded-full border border-line bg-surface-2 p-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              aria-pressed={tab === id}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                tab === id
                  ? "bg-gradient-to-r from-[var(--cta-1)] to-[var(--cta-2)] text-white shadow-[0_8px_16px_-10px_rgba(21,145,220,.9)]"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              <Icon size={15} className="flex-none" />
              {label}
              {id === "medali" && (
                <span className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-extrabold tnum ${tab === id ? "bg-white/25" : "bg-surface-3 text-ink-soft"}`}>
                  {unlocked}/{ach.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Isi tab */}
      {tab === "ringkasan" && (
        <div className="flex flex-col gap-4">
          {/* Ringkasan hasil belajar */}
          <section className="aa-card p-4 md:p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 font-display text-lg font-extrabold">
                <Target size={18} className="text-[var(--primary)]" /> Ringkasan Hasil Belajar
              </h2>
              <button
                onClick={salinRingkasan}
                className="flex flex-none items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-bold text-ink-soft transition-colors hover:border-[var(--primary)]"
              >
                {copied ? <><Check size={13} className="text-[var(--node-good)]" /> Tersalin</> : <><Copy size={13} /> Salin</>}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <MetricCard icon={BookOpen} color="var(--primary)" value={lessons} label="Konsep diajarkan" sub="materi yang kamu ajarkan" />
              <MetricCard icon={Search} color="var(--node-good)" value={koreksi} label="Miskonsepsi dikoreksi" sub={`kamu jeli mengoreksi ${murid}`} />
              <MetricCard icon={Target} color="var(--node-mid)" value={celah} label="Celah terdeteksi" sub="otomatis dari caramu menjelaskan" />
              <MetricCard icon={Flame} color="var(--reward-ink)" value={streak} label="Hari beruntun" sub={streak > 0 ? "jaga terus tiap hari" : "ajari 1 konsep hari ini"} />
            </div>
            {mem?.weakest ? (
              <p className="mt-3 flex items-center gap-2 rounded-2xl bg-[var(--tint)]/40 px-4 py-2.5 text-sm">
                <BrainCircuit size={15} className="flex-none text-[var(--primary-deep)]" />
                <span>Fokus berikutnya: <b>{mem.weakest.konsep}</b> <span className="text-ink-soft tnum">({mem.weakest.pct}%)</span></span>
              </p>
            ) : (
              <p className="mt-3 text-xs leading-relaxed text-ink-soft">
                Ajari murid AI untuk mulai mengungkap celah pemahamanmu, inti dari Ajari Aku.
              </p>
            )}
          </section>

          {/* Peta pemahaman (USP) */}
          <section className="aa-card p-4 md:p-5">
            <h2 className="flex items-center gap-2 font-display text-lg font-extrabold">
              <BrainCircuit size={18} className="text-[var(--primary)]" /> Peta Pemahaman
            </h2>
            <p className="mb-3 mt-0.5 text-sm text-ink-soft">Terbaca otomatis dari cara kamu menjelaskan ke murid AI.</p>
            {mastery.length > 0 ? (
              <ul className="flex flex-col gap-3.5">
                {mastery.map((m) => (
                  <li key={m.konsep}>
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <span className="min-w-0 truncate font-semibold">{m.konsep}</span>
                      <span className="flex flex-none items-center gap-1.5 text-sm font-bold" style={{ color: LEVEL_COLOR[m.level] }}>
                        <span className="h-2 w-2 rounded-full" style={{ background: LEVEL_COLOR[m.level] }} />
                        {LEVEL_LABEL[m.level]}
                      </span>
                    </div>
                    <div className="aa-track">
                      <div className="aa-fill" style={{ width: `${m.pct}%`, background: LEVEL_COLOR[m.level] }} />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-2xl border border-dashed border-line bg-surface-2 px-4 py-6 text-center">
                <BrainCircuit size={26} className="mx-auto text-[var(--primary)]/50" />
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  Ajari 1 konsep ke murid AI, lalu peta pemahamanmu muncul otomatis di sini.
                </p>
              </div>
            )}
            {mem && (
              <button onClick={resetMem} className="mt-4 flex items-center gap-1.5 text-sm font-bold text-ink-soft transition-colors hover:text-[var(--node-weak)]">
                <RotateCcw size={14} /> Hapus memori belajar
              </button>
            )}
          </section>

          {/* Aktivitas mengajar (heatmap) */}
          <section className="aa-card p-4 md:p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 font-display text-lg font-extrabold">
                <CalendarDays size={18} className="text-[var(--primary)]" /> Aktivitas Mengajar
              </h2>
              <span className="flex items-center gap-1 text-[10px] font-bold text-ink-soft">
                Sedikit
                {HEAT.map((c, i) => <span key={i} className="h-2.5 w-2.5 rounded-[3px]" style={{ background: c }} />)}
                Banyak
              </span>
            </div>
            <div className="flex gap-1.5">
              {heatCells.map((c) => (
                <span
                  key={c.day}
                  className="h-6 flex-1 rounded-[5px]"
                  style={{ background: HEAT[c.lvl] }}
                  title={prog ? `${new Date(c.day).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}${c.cnt ? ` · ${c.cnt} sesi` : " · belum ada"}` : undefined}
                />
              ))}
            </div>
            <p className="mt-2.5 text-[11px] text-ink-soft">
              {hariAktif > 0
                ? `${hariAktif} hari aktif dalam 2 minggu terakhir.`
                : "Belum ada aktivitas, mulai mengajar untuk mengisi petamu."}
            </p>
          </section>
        </div>
      )}

      {tab === "peringkat" && (
        <div className="flex flex-col gap-2">
          <Leaderboard />
          <p className="px-1 text-center text-[11px] text-ink-soft">
            Ikut leaderboard itu <b>opsional</b>, kamu tetap bisa belajar penuh tanpanya. 🔒
          </p>
        </div>
      )}

      {tab === "medali" && (
        <section className="aa-card p-4 md:p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-lg font-extrabold">
              <Award size={18} className="text-[var(--reward)]" /> Achievement
            </h2>
            <span className="aa-chip tnum">{unlocked}/{ach.length} terbuka</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {ach.map((a) => {
              const Icon = ACH_ICON[a.ikon] ?? Star;
              return (
                <div
                  key={a.id}
                  className={`rounded-2xl border p-3 text-center transition ${
                    a.unlocked ? "border-line bg-surface" : "border-line bg-surface-2 opacity-70"
                  }`}
                >
                  <span
                    className="mx-auto grid h-12 w-12 place-items-center rounded-2xl text-white"
                    style={{ background: a.unlocked ? a.warna : "var(--surface-3)" }}
                  >
                    {a.unlocked ? <Icon size={22} /> : <Lock size={18} />}
                  </span>
                  <p className="mt-2 font-display text-sm font-extrabold leading-tight">{a.nama}</p>
                  {a.unlocked ? (
                    <p className="mt-0.5 text-[11px] font-bold text-[var(--node-good)]">Terbuka ✓</p>
                  ) : (
                    <>
                      <div className="mx-auto mt-1.5 h-1.5 w-14 overflow-hidden rounded-full bg-surface-3">
                        <div className="h-full rounded-full" style={{ width: `${a.pct}%`, background: a.warna }} />
                      </div>
                      <p className="mt-1 text-[10px] text-ink-soft tnum">{a.cur}/{a.target}</p>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

// Chip kecil di kartu profil (liga / streak / medali).
function Chip({ icon: Icon, color, children }: { icon: typeof Trophy; color: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-3 py-1 text-xs font-bold tnum">
      <Icon size={13} className="flex-none" style={{ color }} />
      {children}
    </span>
  );
}

// Kartu metrik ber-ikon warna untuk Ringkasan Hasil Belajar.
function MetricCard({ icon: Icon, color, value, label, sub }: { icon: typeof Trophy; color: string; value: number; label: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-line bg-surface-2 p-4">
      <span className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: `color-mix(in srgb, ${color} 15%, transparent)`, color }}>
        <Icon size={18} />
      </span>
      <p className="mt-2.5 font-display text-2xl font-extrabold tnum">{value}</p>
      <p className="text-sm font-bold leading-tight">{label}</p>
      <p className="mt-0.5 text-[11px] leading-snug text-ink-soft">{sub}</p>
    </div>
  );
}
