"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Lock, Play, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { Crown, Flame, Star, Compass, GraduationCap } from "@/components/brand-icons";
import { Mascot } from "@/components/mascot";
import { useProfil } from "@/components/profil-pengajar";
import { loadProgress, levelInfo, streakDays, setSesi, type Progress } from "@/lib/progress";
import { buildWorlds, type MapNode, type BossInfo } from "@/lib/dunia-worlds";
import { buildSesi } from "@/lib/sesi";
import { BossQuiz } from "@/components/boss-quiz";

// Tingkat yang sedang dilihat disimpan di perangkat → pilihan "lengket" antar-kunjungan.
const TINGKAT_KEY = "ajari-aku:tingkat";

// Geometri peta vertikal menaik (ala Candy Crush): dari bawah mendaki ke atas
const ROW = 118; // jarak antar simpul (cukup renggang agar label di samping tak bertabrakan)
const NODE = 54; // ukuran simpul
const BOSS = 74;
const PAD_TOP = 100; // ruang napas di puncak agar boss/label tak mepet baris legenda
const PAD_BOT = 72;
const VIEW = 560; // tinggi jendela peta (~5 simpul); sisanya di-scroll
const OFF_PATTERN = [-0.45, 0.75, -0.8, 0.6, -0.65, 0.82, -0.7, 0.72]; // zig-zag kiri-kanan bergantian
const off = (i: number) => OFF_PATTERN[((i % OFF_PATTERN.length) + OFF_PATTERN.length) % OFF_PATTERN.length];

// Semesta Matematika: bintang & simbol ambient (posisi fraksi, statis di latar).
const SYMS = ["π", "Σ", "√", "∫", "∞", "θ", "Δ", "∂", "×", "φ", "≈", "Ω"];
const STARS = Array.from({ length: 40 }, (_, i) => ({
  fx: ((i * 61 + 13) % 100) / 100,
  fy: ((i * 97 + 29) % 100) / 100,
  r: i % 7 === 0 ? 1.8 : 1,
  o: 0.28 + (i % 4) * 0.16,
  d: (i % 6) * 0.5,
}));
const FLOATERS = Array.from({ length: 12 }, (_, i) => ({
  ch: SYMS[i % SYMS.length],
  fx: (6 + ((i * 83 + 20) % 88)) / 100,
  fy: (6 + ((i * 151 + 40) % 84)) / 100,
  s: 15 + (i % 4) * 8,
  d: (i % 6) * 0.7,
  dur: 6 + (i % 4),
}));
// Ambient tambahan: partikel naik & bintang jatuh (posisi fraksi statis → aman hydration).
const SPARKS = Array.from({ length: 11 }, (_, i) => ({
  fx: ((i * 37 + 11) % 100) / 100,
  d: (i % 5) * 0.9,
  dur: 3 + (i % 4),
}));
const SHOOTERS = [
  { l: "8%", t: "10%", w: 58, d: "0.8s" },
  { l: "52%", t: "5%", w: 42, d: "3.6s" },
  { l: "72%", t: "22%", w: 50, d: "6.2s" },
];

// Tipe & data dunia (World, MapNode, BossInfo, buildWorlds) dipindah ke
// @/lib/dunia-worlds supaya peta ini & katalog /belajar/pilih pakai satu sumber.

export default function BelajarPage() {
  const { profil, ready: profilReady } = useProfil();
  const router = useRouter();
  const jenjangApplied = useRef(false);
  const [prog, setProg] = useState<Progress>({ selesai: [], xp: 0, riwayat: [] });
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setProg(loadProgress());
    setReady(true);
  }, []);
  const { level } = levelInfo(prog.xp);
  const streak = streakDays(prog.riwayat);

  const [duniaKey, setDuniaKey] = useState("E");
  const [quizOpen, setQuizOpen] = useState(false);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  useEffect(() => () => void (toastTimer.current && clearTimeout(toastTimer.current)), []);

  // Pulihkan tingkat terakhir yang dipilih di katalog → menang atas default jenjang.
  useEffect(() => {
    try {
      const t = window.localStorage.getItem(TINGKAT_KEY);
      if (t) {
        setDuniaKey(t);
        jenjangApplied.current = true;
      }
    } catch {
      /* storage diblokir, abaikan, pakai default */
    }
  }, []);

  // Dunia/tingkat dari sumber bersama (Fase E hero + fase lain Kurikulum Merdeka).
  const worlds = buildWorlds(prog.materi ?? [], prog.latihan ?? [], prog.selesai ?? []);
  const world = worlds.find((w) => w.key === duniaKey) ?? worlds[0];

  // Set dunia default sesuai jenjang onboarding (sekali; pilihan manual berikutnya menang).
  useEffect(() => {
    if (jenjangApplied.current || !profilReady) return;
    jenjangApplied.current = true;
    const j = profil.jenjang;
    if (!j || j === "SMA") return; // SMA → Fase E (sudah default & jadi showcase)
    const w = worlds.find((x) => x.jenjang === j && !x.hero);
    if (w) setDuniaKey(w.key);
  }, [profilReady, profil.jenjang, worlds]);

  function showToast(msg: string) {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 1800);
  }

  // Mulai sesi Ajari untuk sebuah topik → muridnya = murid bidang topik itu (otomatis).
  function mulaiAjari(topikId: string) {
    setSesi(buildSesi(topikId)); // murid otomatis = murid bidang topik
    router.push("/ajari");
  }

  function openNode(n: MapNode) {
    if (n.stage === "quiz") { router.push(`/kursus?topik=${encodeURIComponent(n.topicId)}`); return; }
    if (n.stage === "ajari") { mulaiAjari(n.topicId); return; }
    router.push(`/belajar/materi?topik=${encodeURIComponent(n.topicId)}`);
  }

  return (
    <div className="flex flex-col gap-5">
      {/* header + peta tingkat aktif, mendarat LANGSUNG di petualangan (satu tingkat tampil) */}
      <section ref={headerRef} className="aa-card overflow-hidden p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="aa-pill-primary">
              {world.jenjang} · {world.kelas} · {world.faseShort}
            </span>
            <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight">
              {world.judul}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="aa-chip tnum">Lv {level}</span>
            <span
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold"
              style={{ background: "color-mix(in srgb, var(--reward) 16%, transparent)", color: "var(--reward)" }}
            >
              <Flame size={15} /> {streak} hari
            </span>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-1 flex items-center justify-between text-xs font-bold text-ink-soft">
            <span className="flex items-center gap-1">
              <Star size={12} className="text-[var(--reward)]" /> Konsep tuntas di dunia ini
            </span>
            <span className="tnum">{world.done}/{world.total}</span>
          </div>
          <div className="aa-track">
            <div className="aa-fill" style={{ width: `${world.total ? (world.done / world.total) * 100 : 0}%` }} />
          </div>
        </div>

        {/* Ganti tingkat → buka katalog di halaman terpisah (jelas per jenjang, tak sesak) */}
        <button
          onClick={() => router.push("/belajar/pilih")}
          className="mt-4 flex w-full items-center gap-3 rounded-xl bg-surface-2 px-4 py-3 text-left transition-colors hover:bg-[var(--tint)]/45"
        >
          <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-[var(--tint)] text-[var(--primary-deep)]">
            <Compass size={17} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-extrabold">Ganti tingkat</span>
            <span className="block truncate text-xs text-ink-soft">
              Jelajahi katalog semua kelas
            </span>
          </span>
          <ChevronRight size={18} className="flex-none text-ink-soft" />
        </button>
      </section>

      {/* PETA: satu komponen, dipakai ulang utk setiap dunia (remount saat ganti dunia) */}
      <AdventureMap
        key={world.key}
        ready={ready}
        nodes={world.nodes}
        boss={world.boss}
        puncakLabel={world.hero ? "🚀 Puncak Fase E" : `🏁 Tuntaskan ${world.faseShort}`}
        onOpenNode={openNode}
        onToast={showToast}
        onBoss={() =>
          world.boss?.open ? setQuizOpen(true) : showToast("Daki semua konsep Fase E dulu 💪")
        }
      />

      {toast && (
        <div className="fixed inset-x-0 bottom-24 z-40 mx-auto w-fit max-w-[90%] animate-rise rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-[var(--bg)] shadow-[var(--shadow-2)] md:bottom-8">
          {toast}
        </div>
      )}

      {quizOpen && <BossQuiz onClose={() => { setQuizOpen(false); setProg(loadProgress()); }} />}
    </div>
  );
}

// Peta petualangan, komponen dipakai ulang untuk setiap dunia

function AdventureMap({
  ready,
  nodes,
  boss,
  puncakLabel,
  onOpenNode,
  onToast,
  onBoss,
}: {
  ready: boolean;
  nodes: MapNode[];
  boss: BossInfo | null;
  puncakLabel: string;
  onOpenNode: (n: MapNode) => void;
  onToast: (msg: string) => void;
  onBoss: () => void;
}) {
  // Lebar panggung ikut layar → peta MELEBAR di desktop.
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageW, setStageW] = useState(320);
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = () => setStageW(Math.max(280, Math.min(el.clientWidth, 640)));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Geometri diturunkan dari JUMLAH simpul (tiap dunia bisa beda panjang).
  const bossI = nodes.length;
  const total = nodes.length + (boss ? 1 : 0);
  const H = PAD_TOP + (total - 1) * ROW + PAD_BOT;
  const py = (i: number) => H - PAD_BOT - i * ROW;
  const amp = stageW * 0.32;
  const xAt = (i: number) =>
    boss && i === nodes.length ? stageW / 2 : stageW / 2 + off(i) * amp; // boss di puncak tetap di tengah
  const activeIndex = nodes.findIndex((n) => n.status === "active");

  // Jendela scroll ~5 simpul. Saat dibuka, gulir sekali agar node aktif di tengah.
  const didScroll = useRef(false);
  useEffect(() => {
    if (didScroll.current || !ready || activeIndex < 0) return;
    const el = stageRef.current;
    if (!el) return;
    didScroll.current = true;
    const t = setTimeout(() => {
      el.scrollTop = Math.max(0, py(activeIndex) - VIEW / 2 + NODE / 2);
    }, 60);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, activeIndex]);

  // Pantau posisi scroll → tampilkan panah atas/bawah seperlunya.
  const [scrollHint, setScrollHint] = useState({ up: false, down: false });
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const check = () => {
      const up = el.scrollTop > 8;
      const down = el.scrollTop + el.clientHeight < el.scrollHeight - 8;
      setScrollHint((s) => (s.up === up && s.down === down ? s : { up, down }));
    };
    check();
    el.addEventListener("scroll", check, { passive: true });
    const ro = new ResizeObserver(check); // ukuran/isi berubah → hitung ulang
    ro.observe(el);
    return () => { el.removeEventListener("scroll", check); ro.disconnect(); };
  }, []);

  // Klik panah → gulir jendela ~satu layar (mulus).
  const nudge = (dir: number) => {
    const el = stageRef.current;
    if (el) el.scrollBy({ top: dir * el.clientHeight * 0.8, behavior: "smooth" });
  };

  // Maskot MELOMPAT dari simpul sebelumnya ke simpul aktif (kesan naik level).
  const [avPos, setAvPos] = useState(activeIndex);
  const [arc, setArc] = useState(false);
  const hopped = useRef(false);
  useEffect(() => {
    if (!ready || activeIndex < 0 || hopped.current) return;
    hopped.current = true;
    if (activeIndex >= 1) {
      setAvPos(activeIndex - 1); // mulai di simpul sebelumnya
      const t1 = setTimeout(() => { setAvPos(activeIndex); setArc(true); }, 120);
      const t2 = setTimeout(() => setArc(false), 950);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
    setAvPos(activeIndex);
  }, [ready, activeIndex]);

  const paved = (i: number) => {
    const j = i + 1;
    if (boss && j === bossI) return boss.open;
    const nx = nodes[j];
    return nx ? nx.status !== "locked" : false;
  };

  const clickNode = (n: MapNode) => {
    if (n.status === "locked") {
      onToast(n.stage === "ajari" ? "Lulus ❓ Quiz topik ini dulu, baru bisa Ajari muridnya 🙂" : "Selesaikan 📖 Materi topik ini dulu, Quiz-nya baru terbuka 🙂");
      return;
    }
    onOpenNode(n);
  };

  return (
    <section className="relative overflow-hidden rounded-[var(--r-card)]" style={{ height: Math.min(VIEW, H) }}>
      {/* jendela scroll native (~5 simpul); di ujung, halaman ikut scroll */}
      <div ref={stageRef} className="h-full overflow-y-auto overflow-x-hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="relative w-full" style={{ height: H }}>
        {/* Backdrop kosmik berlapis */}
        <div className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(180deg, var(--map-top) 0%, var(--map-bot) 100%)" }} />
        <div className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(50% 42% at 80% 10%, var(--map-neb-2), transparent 70%)," +
              "radial-gradient(46% 38% at 16% 44%, var(--map-neb-1), transparent 72%)," +
              "radial-gradient(38% 32% at 38% 22%, var(--map-neb-3), transparent 70%)," +
              "radial-gradient(60% 46% at 66% 86%, var(--map-neb-2), transparent 72%)",
          }} />

        {/* FAR: planet, bulan & bintang (statis, tersebar sepanjang peta) */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute rounded-full"
            style={{
              left: "58%", top: "9%", width: 132, height: 132, opacity: 0.5,
              background: "radial-gradient(circle at 34% 30%, var(--map-path), transparent 66%), radial-gradient(circle at 66% 70%, var(--map-neb-2), transparent 72%)",
            }} />
          <div className="absolute rounded-full"
            style={{
              left: "13%", top: "42%", width: 46, height: 46, opacity: 0.45,
              background: "radial-gradient(circle at 36% 32%, var(--map-star), transparent 74%)",
            }} />
          {STARS.map((s, i) => (
            <span key={i} className="aa-twinkle absolute rounded-full"
              style={{ left: `${s.fx * 100}%`, top: `${s.fy * 100}%`, width: s.r * 2, height: s.r * 2, background: "var(--map-star)", opacity: s.o * 0.85, animationDelay: `${s.d}s` }} />
          ))}
        </div>

        {/* MID: simbol matematika mengambang (statis) */}
        <div className="pointer-events-none absolute inset-0 select-none font-display font-extrabold">
          {FLOATERS.map((f, i) => (
            <span key={i} className="aa-drift absolute"
              style={{ left: `${f.fx * 100}%`, top: `${f.fy * 100}%`, fontSize: f.s, color: "var(--map-symbol)", animationDelay: `${f.d}s`, animationDuration: `${f.dur}s` }}>
              {f.ch}
            </span>
          ))}
        </div>

        {/* glow horizon di dasar (statis) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28"
          style={{ background: "radial-gradient(120% 100% at 50% 100%, var(--map-horizon), transparent 72%)" }} />

        {/* ambient: partikel naik + bintang jatuh (independen kamera) */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {SPARKS.map((s, i) => (
            <span key={`sp${i}`} className="aa-spark absolute bottom-1 h-1.5 w-1.5 rounded-full"
              style={{ left: `${s.fx * 100}%`, background: "var(--map-star)", boxShadow: "0 0 6px var(--map-star)", animationDelay: `${s.d}s`, animationDuration: `${s.dur}s` }} />
          ))}
          {SHOOTERS.map((s, i) => (
            <span key={`sh${i}`} className="aa-shoot absolute h-[2px] rounded-full"
              style={{ left: s.l, top: s.t, width: s.w, background: "linear-gradient(90deg, transparent, var(--map-star))", animationDelay: s.d }} />
          ))}
        </div>

        {/* panggung terpusat: jalur + simpul */}
        <div className="absolute left-0 right-0 top-0 mx-auto" style={{ width: stageW, height: H }}>
          {/* cahaya puncak */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-44"
            style={{ background: "radial-gradient(80% 100% at 50% 0%, var(--map-neb-2), transparent 74%)" }} />

          {/* label puncak */}
          <div className="absolute left-1/2 z-10 -translate-x-1/2 text-center" style={{ top: 44 }}>
            <span className="rounded-full bg-surface/80 px-3 py-1 text-[11px] font-extrabold text-ink-soft backdrop-blur">
              {puncakLabel}
            </span>
          </div>

          {/* jalur menyala (neon) */}
          <svg className="absolute inset-0 z-0" width={stageW} height={H} fill="none" aria-hidden>
            {Array.from({ length: total - 1 }).map((_, i) => {
              const x0 = xAt(i), y0 = py(i), x1 = xAt(i + 1), y1 = py(i + 1), ym = (y0 + y1) / 2;
              const d = `M ${x0} ${y0} C ${x0} ${ym}, ${x1} ${ym}, ${x1} ${y1}`;
              if (!paved(i)) {
                return (
                  <path key={i} d={d} stroke="var(--map-symbol)" strokeWidth={5}
                    strokeLinecap="round" strokeDasharray="1 13" opacity={0.9} />
                );
              }
              const drawDelay = `${i * 0.08}s`;
              return (
                <g key={i}>
                  <path d={d} pathLength={1} className="aa-pathdraw" style={{ animationDelay: drawDelay }} stroke="var(--map-path)" strokeWidth={16} strokeLinecap="round" opacity={0.28} />
                  <path d={d} pathLength={1} className="aa-pathdraw" style={{ animationDelay: drawDelay }} stroke="var(--map-path)" strokeWidth={5} strokeLinecap="round" />
                  <path d={d} pathLength={1} className="aa-pathdraw" style={{ animationDelay: drawDelay }} stroke="var(--map-path-core)" strokeWidth={1.8} strokeLinecap="round" />
                  {/* kilau energi mengalir ke atas (menuju level berikutnya) */}
                  <path d={d} className="aa-pathflow" style={{ animationDelay: `${0.4 + i * 0.08}s` }} stroke="var(--map-path-core)" strokeWidth={3} strokeLinecap="round" opacity={0.85} />
                </g>
              );
            })}
          </svg>

          {/* simpul topik */}
          {nodes.map((n, i) => (
            <TopicNode key={n.id} node={n} x={xAt(i)} y={py(i)} stageW={stageW} delay={i * 0.05} onClick={() => clickNode(n)} />
          ))}

          {/* Pio MELOMPAT dari simpul sebelumnya ke simpul aktif */}
          {activeIndex >= 0 && (
            <div
              className="absolute z-20 flex flex-col items-center"
              style={{
                left: xAt(avPos),
                top: py(avPos) - NODE / 2 - 44,
                transform: "translateX(-50%)",
                transition: arc
                  ? "left 0.72s cubic-bezier(.3,0,.25,1), top 0.72s cubic-bezier(.3,0,.25,1)"
                  : "none",
              }}
            >
              <span className="aa-pill-primary mb-1 whitespace-nowrap shadow-[var(--shadow-1)]">Kamu di sini</span>
              <div className={arc ? "aa-hoparc" : "aa-hop"}>
                <Mascot mood="happy" size={30} />
              </div>
            </div>
          )}

          {/* boss di puncak (hanya dunia yg punya boss) */}
          {boss && (
            <>
              <button
                onClick={() => onBoss()}
                className="absolute z-10 grid place-items-center rounded-[24px] transition-transform hover:-translate-y-0.5"
                style={{
                  left: xAt(bossI), top: py(bossI),
                  width: BOSS, height: BOSS,
                  transform: "translate(-50%, -50%)",
                  background: boss.open
                    ? "linear-gradient(140deg, var(--primary-deep), var(--primary))"
                    : "var(--surface-3)",
                  boxShadow: boss.open ? "0 0 30px -4px var(--map-path), var(--shadow-2)" : "none",
                }}
                aria-label={`Boss: ${boss.judul}`}
              >
                {boss.open && <span className="absolute inset-0 animate-pulse rounded-[24px] ring-4 ring-[var(--tint)]" />}
                <Crown size={30} className={boss.open ? "text-[var(--reward)]" : "text-ink-soft"} />
              </button>
              <div className="absolute z-10 w-[150px] text-center"
                style={{ left: xAt(bossI), top: py(bossI) + BOSS / 2 + 6, transform: "translateX(-50%)" }}>
                <span className="rounded-full px-2.5 py-0.5 font-display text-[11px] font-extrabold"
                  style={{ background: "color-mix(in srgb, var(--reward) 18%, transparent)", color: "var(--reward)" }}>
                  +{boss.xp} XP
                </span>
              </div>
            </>
          )}
        </div>
        </div>
      </div>

        {/* fade tepi jendela (overlay tetap, di balik legenda) */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[15] h-14"
          style={{ background: "linear-gradient(180deg, var(--map-top), transparent)" }} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[15] h-12"
          style={{ background: "linear-gradient(0deg, var(--map-bot), transparent)" }} />

        {/* legenda status simpul, bantu pemain paham arti tiap simpul */}
        <div className="pointer-events-none absolute inset-x-0 top-2 z-20 flex flex-wrap items-center justify-center gap-1.5 px-2">
          {[
            { ic: <Check size={11} />, t: "Tuntas", c: "#2bbd82" },
            { ic: <Play size={10} />, t: "Aktif", c: "#4bb8fa" },
            { ic: <Star size={11} />, t: "Terbuka", c: "var(--ink-soft)" },
            { ic: <Lock size={10} />, t: "Terkunci", c: "var(--ink-soft)" },
            { ic: <Crown size={11} />, t: "Boss quiz", c: "var(--reward)" },
            { ic: "🎓", t: "Ajari", c: "var(--reward)" },
          ].map((l) => (
            <span key={l.t} className="flex items-center gap-1 rounded-full bg-surface/85 px-2 py-0.5 text-[10px] font-bold text-ink-soft backdrop-blur">
              <span className="flex" style={{ color: l.c }}>{l.ic}</span>{l.t}
            </span>
          ))}
        </div>

        {/* petunjuk gulir, pengganti scrollbar kaku: panah muncul hanya bila masih bisa digulir */}
        {scrollHint.up && (
          <button
            type="button"
            onClick={() => nudge(-1)}
            aria-label="Gulir ke atas menuju boss dan tantangan berikutnya"
            className="absolute left-1/2 top-10 z-20 grid h-7 w-7 -translate-x-1/2 place-items-center rounded-full bg-surface/85 text-ink-soft shadow-[var(--shadow-1)] ring-1 ring-line backdrop-blur transition-colors hover:text-[var(--primary)]"
          >
            <ChevronUp size={16} />
          </button>
        )}
        {scrollHint.down && (
          <div className="absolute bottom-2.5 left-1/2 z-20 -translate-x-1/2">
            <button
              type="button"
              onClick={() => nudge(1)}
              aria-label="Gulir ke bawah menuju materi yang sudah selesai"
              className="grid h-8 w-8 animate-bounce place-items-center rounded-full bg-surface/90 text-[var(--primary-deep)] shadow-[var(--shadow-1)] ring-1 ring-line backdrop-blur transition-colors [animation-duration:1.6s] hover:text-[var(--primary)]"
            >
              <ChevronDown size={18} />
            </button>
          </div>
        )}

    </section>
  );
}

function TopicNode({
  node, x, y, stageW, delay, onClick,
}: {
  node: MapNode; x: number; y: number; stageW: number; delay: number; onClick: () => void;
}) {
  // Warna & "ketebalan" token per status (tepi = kesan 3D).
  let bg = "var(--surface-3)";
  let edge = "color-mix(in srgb, var(--ink) 18%, transparent)";
  let glow = "0 3px 9px -4px rgba(20,40,80,.22)"; // bayangan halus → terkunci pun terangkat dari latar terang
  let edgeH = "3px";
  let inner: React.ReactNode = <Lock size={17} className="text-ink-soft" />;
  if (node.status === "done") {
    bg = "linear-gradient(150deg, #2bbd82, #16764c)";
    edge = "#0f5f3c"; edgeH = "5px";
    glow = "0 0 0 2px rgba(255,255,255,.85), 0 7px 15px -5px rgba(0,0,0,.32)";
    inner = node.stage === "ajari" ? <GraduationCap size={20} className="text-white" /> : <Check size={22} className="text-white" />;
  } else if (node.status === "active") {
    bg = "linear-gradient(150deg, var(--primary-bright), var(--cta-1) 45%, var(--cta-2))";
    edge = "#1c568f"; edgeH = "5px";
    glow = "0 0 0 4px var(--tint), 0 0 26px -2px var(--map-path), 0 9px 17px -5px rgba(0,0,0,.4)";
    inner = <Play size={20} className="text-white" />;
  } else if (node.status === "open") {
    bg = "var(--surface)";
    edge = "color-mix(in srgb, var(--primary) 32%, #8593a8)"; edgeH = "5px";
    glow = "0 6px 13px -6px rgba(0,0,0,.24)";
    inner = <Star size={18} className="text-[var(--primary-deep)]" />;
  }
  const tokenStyle = {
    background: bg,
    "--edge-c": edge,
    "--edge-h": edgeH,
    "--tok-glow": glow,
  } as React.CSSProperties;

  return (
    <>
      <button
        onClick={onClick}
        className="aa-tokbtn absolute z-10 grid animate-rise place-items-center"
        style={{ left: x, top: y, width: NODE, height: NODE, transform: "translate(-50%, -50%)", background: "transparent", border: 0, animationDelay: `${delay}s` }}
        aria-label={`${node.judul}, ${node.status === "done" ? "selesai" : node.status === "locked" ? "terkunci" : "buka"}`}
      >
        {node.status === "active" && (
          <span className="aa-halo pointer-events-none absolute -inset-2 rounded-full" aria-hidden
            style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--map-path) 60%, transparent), transparent 68%)" }} />
        )}
        <span className="aa-token grid h-full w-full place-items-center rounded-full" style={tokenStyle}>
          {inner}
        </span>
      </button>
      {/* label DI SAMPING node (sisi dalam), sejajar tinggi node → rapi, tak menumpuk ke bawah,
          tak nabrak jalur maupun pil "Kamu di sini". Node kiri → label ke kanan; node kanan → ke kiri. */}
      <div
        className="pointer-events-none absolute z-10"
        style={
          x < stageW / 2
            ? { left: x + NODE / 2 + 8, top: y, maxWidth: stageW - x - NODE / 2 - 14, transform: "translateY(-50%)" }
            : { right: stageW - x + NODE / 2 + 8, top: y, maxWidth: x - NODE / 2 - 14, transform: "translateY(-50%)" }
        }
      >
        <span className="inline-block rounded-xl bg-surface/92 px-2.5 py-1 align-middle shadow-[0_2px_10px_rgba(20,40,80,.14)] ring-1 ring-black/5 backdrop-blur">
          <span className={`block font-display text-[11px] font-extrabold leading-[1.2] ${node.status === "locked" ? "text-ink-soft" : "text-ink"}`}>
            {node.judul}
          </span>
          <span className="mt-0.5 block text-[9.5px] font-bold tnum">
            {node.status === "locked" ? (
              <span className="text-ink-soft">{node.stage === "materi" ? "📖 Materi" : node.stage === "quiz" ? "❓ Quiz" : "🎓 Ajari"} · Terkunci</span>
            ) : (
              <span className="text-[var(--reward-ink)]">{node.stage === "materi" ? "📖 Materi" : node.stage === "quiz" ? "❓ Quiz" : "🎓 Ajari"} · +{node.xp} XP</span>
            )}
          </span>
        </span>
      </div>
    </>
  );
}

