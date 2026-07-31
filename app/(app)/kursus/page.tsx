"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { X, ArrowRight, RotateCcw, Heart, XCircle } from "lucide-react";
import { Flame, Star, CheckCircle2 } from "@/components/brand-icons";
import { MateriBg } from "@/components/play-bg";
import { Mascot } from "@/components/mascot";
import { Konfeti } from "@/components/confetti";
import { muridForTopik } from "@/lib/kelas-topik";
import { type AvatarSpec } from "@/lib/avatar";
import { prettyMath } from "@/lib/pretty-math";
import { Hitung } from "@/components/math-rich";
import { buildKursus, acakSeed, jawabInti, type Kartu } from "@/lib/kursus";
import { topikById } from "@/lib/bank-soal";
import { buildSesi } from "@/lib/sesi";
import { setSesi, loadProgress, completeLatihan, isLatihanDone, isMateriDone } from "@/lib/progress";
import { celebrateDelta } from "@/lib/celebrate";

type KKonsep = Extract<Kartu, { tipe: "konsep" }>;
type KSusun = Extract<Kartu, { tipe: "susun" }>;
type KNext = Extract<Kartu, { tipe: "nextstep" }>;
type KIsian = Extract<Kartu, { tipe: "isian" }>;
type KPilgan = Extract<Kartu, { tipe: "pilgan" }>;
type Fase = "main" | "feedback" | "ending";

export default function KursusPage() {
  return (
    <Suspense fallback={<div className="fixed inset-0 bg-bg" />}>
      <KursusInner />
    </Suspense>
  );
}

function KursusInner() {
  const router = useRouter();
  const id = useSearchParams().get("topik") ?? "";
  const bt = topikById(id);
  const mu = muridForTopik(id); // murid = murid bidang topik ini (render Quiz sudah di-gate `allowed`)
  const murid = mu.nama;

  const [kartu, setKartu] = useState<Kartu[]>(() => buildKursus(id));
  const [idx, setIdx] = useState(0);
  const [skor, setSkor] = useState(0);
  const [combo, setCombo] = useState(0);
  const [nyawa, setNyawa] = useState(3);
  const [benarCount, setBenarCount] = useState(0);
  const [fase, setFase] = useState<Fase>("main");
  const [fb, setFb] = useState<{ benar: boolean; teks: string }>({ benar: true, teks: "" });
  const [attempt, setAttempt] = useState(0);
  const credited = useRef(false);
  // Gerbang akses: menahan render Quiz sampai lolos cek (mulai false → server & client sama, aman hydration).
  const [allowed, setAllowed] = useState(false);

  const xpLatihan = Math.max(10, Math.round((bt?.xp ?? 20) * 0.5));
  // Kartu "konsep" (indeks 0) tak bisa dijawab → ambang & tampilan skor dihitung atas kartu SOAL saja.
  const soalCount = kartu.filter((k) => k.tipe !== "konsep").length;
  // AMBANG LULUS: minimal ~60% soal benar (dan >=1) untuk membuka mode Ajari. "Selesai" != "Lulus".
  const lulus = benarCount >= Math.max(1, Math.ceil(soalCount * 0.6));

  // Gerbang: topik tak dikenal / data kurang → peta. KUNCI SUNGGUHAN: Quiz terkunci sampai Materi
  // topik ini tuntas → lempar ke halaman Materi (bukan cuma di peta, jadi tak bisa ditembus URL/refresh).
  // Pengecualian: Quiz yang SUDAH pernah tuntas tetap boleh diulang (jangan halangi pengguna lama).
  useEffect(() => {
    if (!id || kartu.length < 2) { router.replace("/belajar"); return; }
    if (!isMateriDone(id) && !isLatihanDone(id)) {
      router.replace(`/belajar/materi?topik=${encodeURIComponent(id)}`);
      return;
    }
    setAllowed(true);
  }, [id, kartu.length, router]);

  // Kreditkan latihan & buka mode Ajari HANYA bila LULUS (bukan sekadar selesai). Gagal → Quiz tak
  // dihijaukan, Ajari tetap terkunci. XP porsi, TIDAK menghijaukan node, mastery milik Ajari.
  useEffect(() => {
    if (fase === "ending" && !credited.current && lulus) {
      credited.current = true;
      const before = loadProgress();
      completeLatihan(id, xpLatihan, bt?.judul ?? "");
      celebrateDelta(before, loadProgress());
    }
  }, [fase, id, xpLatihan, bt, lulus]);

  function jawab(benar: boolean, teks: string) {
    if (fase !== "main") return;
    if (benar) {
      setSkor((s) => s + 10);
      setCombo((c) => c + 1);
      setBenarCount((n) => n + 1);
    } else {
      setCombo(0);
      setNyawa((n) => Math.max(0, n - 1));
    }
    setFb({ benar, teks });
    setFase("feedback");
  }
  function lanjut() {
    if (idx + 1 >= kartu.length) setFase("ending");
    else {
      setIdx((i) => i + 1);
      setFase("main");
    }
  }
  function ulangi() {
    setKartu(buildKursus(id));
    setIdx(0);
    setSkor(0);
    setCombo(0);
    setNyawa(3);
    setBenarCount(0);
    setFase("main");
    setAttempt((a) => a + 1);
    credited.current = false;
  }
  function mulaiAjari() {
    setSesi(buildSesi(id, mu)); // mu = murid bidang topik (sudah dihitung di atas)
    router.push("/ajari");
  }

  if (!allowed || !id || kartu.length < 2) return <div className="fixed inset-0 bg-bg" />;

  const k = kartu[Math.min(idx, kartu.length - 1)];
  const akhir = idx + 1 >= kartu.length;

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden">
      <MateriBg />

      {/* HUD */}
      <div className="relative z-10 flex flex-none items-center gap-2.5 px-4 py-3 text-white sm:gap-3">
        <Link href="/belajar" aria-label="Tutup latihan" className="grid h-9 w-9 flex-none place-items-center rounded-full bg-white/20 backdrop-blur transition-colors hover:bg-white/30">
          <X size={18} />
        </Link>
        <div className="flex flex-1 gap-1">
          {kartu.map((_, i) => (
            <span key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i < idx || fase === "ending" ? "bg-white" : i === idx ? "bg-white/70" : "bg-white/25"}`} />
          ))}
        </div>
        <span className="flex flex-none items-center gap-1 text-sm font-bold tnum">
          <Flame size={15} className={combo > 0 ? "text-[var(--reward)]" : "opacity-40"} />
          {combo}
        </span>
        <span className="flex flex-none items-center gap-0.5">
          {[0, 1, 2].map((i) => (
            <Heart key={i} size={14} className={i < nyawa ? "fill-white text-white" : "text-white/30"} />
          ))}
        </span>
        <span className="flex flex-none items-center gap-1 font-display text-sm font-extrabold tnum">
          <Star size={15} className="fill-[var(--reward)] text-[var(--reward)]" />
          {skor}
        </span>
      </div>

      {/* AREA */}
      <div className="relative z-10 flex flex-1 items-start justify-center overflow-y-auto px-4 pb-24 pt-2">
        <div className="w-full max-w-lg">
          {fase === "ending" ? (
            <Ending lulus={lulus} benarCount={benarCount} total={soalCount} xp={lulus && !isLatihanDone(id) ? xpLatihan : 0} combo={combo} murid={murid} muridAvatar={mu.avatar} onAjari={mulaiAjari} onUlangi={ulangi} />
          ) : fase === "feedback" ? (
            <FeedbackPanel fb={fb} akhir={akhir} murid={murid} onLanjut={lanjut} />
          ) : (
            <div key={attempt + "-" + idx} className="aa-card p-5">
              <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-ink-soft">
                <Mascot avatar={mu.avatar} size={22} /> {bt?.judul} · Latihan Kilat
              </p>
              {k.tipe === "konsep" && <KartuKonsep k={k} onMulai={lanjut} />}
              {k.tipe === "susun" && <KartuSusun k={k} onJawab={jawab} seed={`${idx}-${attempt}`} />}
              {k.tipe === "nextstep" && <KartuNextStep k={k} onJawab={jawab} seed={`${idx}-${attempt}`} />}
              {k.tipe === "isian" && <KartuIsian k={k} onJawab={jawab} />}
              {k.tipe === "pilgan" && <KartuPilgan k={k} onJawab={jawab} seed={`${idx}-${attempt}`} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* Kartu */

function KartuKonsep({ k, onMulai }: { k: KKonsep; onMulai: () => void }) {
  return (
    <div className="flex flex-col gap-3 text-center">
      <p className="font-display text-lg font-extrabold">Pemanasan 🔥</p>
      {k.rumus.length > 0 && (
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-0.5">
          {k.rumus.map((r, i) => (
            <span key={i} className="flex-none rounded-xl border border-[var(--primary)]/25 bg-[var(--tint)]/30 px-3 py-2 font-display text-sm font-bold text-[var(--primary-deep)] tnum">
              {prettyMath(r)}
            </span>
          ))}
        </div>
      )}
      <p className="text-[15px] leading-relaxed text-ink">{prettyMath(k.inti)}</p>
      <button onClick={onMulai} className="aa-btn mt-1 w-full justify-center">
        Mulai <ArrowRight size={18} />
      </button>
    </div>
  );
}

function KartuSusun({ k, onJawab, seed }: { k: KSusun; onJawab: (b: boolean, t: string) => void; seed: string }) {
  const [tray, setTray] = useState<number[]>(() => acakSeed(k.langkah.map((_, i) => i), seed));
  const [slot, setSlot] = useState<number[]>([]);
  const cek = () => {
    const benar = slot.every((v, pos) => v === pos);
    onJawab(benar, benar ? "Urutannya tepat! 🎯" : "Urutan yang benar:\n" + k.langkah.map((l, i) => `${i + 1}. ${l}`).join("\n"));
  };
  return (
    <div className="flex flex-col gap-3">
      <p className="font-display font-extrabold">Susun langkahnya berurutan</p>
      {k.soal && <p className="rounded-lg bg-surface-2 px-3 py-2 text-sm font-bold text-ink">{prettyMath(k.soal)}</p>}
      <div className="flex min-h-[3rem] flex-col gap-2 rounded-xl border-2 border-dashed border-line p-2">
        {slot.length === 0 && <p className="py-2 text-center text-[13px] text-ink-soft">Ketuk kartu langkah di bawah ↓</p>}
        {slot.map((i, pos) => (
          <button key={i} onClick={() => { setSlot((s) => s.filter((x) => x !== i)); setTray((t) => [...t, i]); }} className="flex items-start gap-2 rounded-lg bg-[var(--tint)]/40 px-3 py-2 text-left text-[14px] leading-relaxed">
            <span className="grid h-5 w-5 flex-none place-items-center rounded-full bg-[var(--primary)] text-[11px] font-bold text-white">{pos + 1}</span>
            {prettyMath(k.langkah[i])}
          </button>
        ))}
      </div>
      {tray.length > 0 && (
        <div className="flex flex-col gap-2">
          {tray.map((i) => (
            <button key={i} onClick={() => { setTray((t) => t.filter((x) => x !== i)); setSlot((s) => [...s, i]); }} className="rounded-lg border border-line bg-surface px-3 py-2 text-left text-[14px] leading-relaxed transition-colors hover:border-[var(--primary)]">
              {prettyMath(k.langkah[i])}
            </button>
          ))}
        </div>
      )}
      <button onClick={cek} disabled={slot.length !== k.langkah.length} className="aa-btn w-full justify-center disabled:opacity-40">
        Cek Urutan <ArrowRight size={18} />
      </button>
    </div>
  );
}

function KartuNextStep({ k, onJawab, seed }: { k: KNext; onJawab: (b: boolean, t: string) => void; seed: string }) {
  const [opsi] = useState<string[]>(() => acakSeed([k.benar, ...k.distraktor], seed));
  return (
    <div className="flex flex-col gap-3">
      <p className="font-display font-extrabold">Langkah berikutnya yang benar?</p>
      {k.sudah.length > 0 && (
        <div className="flex flex-col gap-1 rounded-lg bg-surface-2 p-2.5 text-[13px] leading-relaxed text-ink-soft">
          {k.sudah.map((s, i) => (
            <span key={i}>✓ {prettyMath(s)}</span>
          ))}
        </div>
      )}
      <div className="flex flex-col gap-2">
        {opsi.map((o, i) => (
          <button key={i} onClick={() => onJawab(o === k.benar, o === k.benar ? "Tepat! 🎯" : "Langkah yang benar:\n" + k.benar)} className="rounded-xl border border-line bg-surface px-3.5 py-2.5 text-left text-[14px] leading-relaxed transition-colors hover:border-[var(--primary)]">
            {prettyMath(o)}
          </button>
        ))}
      </div>
    </div>
  );
}

function KartuIsian({ k, onJawab }: { k: KIsian; onJawab: (b: boolean, t: string) => void }) {
  const [val, setVal] = useState("");
  const cek = () => {
    const benar = val.trim() !== "" && jawabInti(val) === k.kunci;
    onJawab(benar, (benar ? "Betul! " : `Jawaban: ${k.jawaban}. `) + k.pembahasan);
  };
  return (
    <form onSubmit={(e) => { e.preventDefault(); cek(); }} className="flex flex-col gap-3">
      <p className="font-display font-extrabold">Isi jawabannya</p>
      <p className="rounded-lg bg-surface-2 px-3 py-2 text-[15px] leading-relaxed text-ink">{prettyMath(k.soal)}</p>
      <input value={val} onChange={(e) => setVal(e.target.value)} placeholder="Ketik jawaban…" inputMode="text" className="rounded-full border border-line bg-surface px-5 py-3 text-[15px] outline-none transition-colors focus:border-[var(--primary)]" />
      <button type="submit" disabled={!val.trim()} className="aa-btn w-full justify-center disabled:opacity-40">
        Cek <ArrowRight size={18} />
      </button>
    </form>
  );
}

function KartuPilgan({ k, onJawab, seed }: { k: KPilgan; onJawab: (b: boolean, t: string) => void; seed: string }) {
  const [opsi] = useState<string[]>(() => acakSeed([k.benar, ...k.distraktor], seed));
  return (
    <div className="flex flex-col gap-3">
      <p className="font-display font-extrabold">Pilih jawaban yang benar</p>
      <p className="rounded-lg bg-surface-2 px-3 py-2 text-[15px] leading-relaxed text-ink">{prettyMath(k.soal)}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {opsi.map((o, i) => (
          <button
            key={i}
            onClick={() => onJawab(o === k.benar, (o === k.benar ? "Betul! " : `Jawaban: ${k.benar}. `) + k.pembahasan)}
            className="rounded-xl border border-line bg-surface px-3.5 py-3 text-left text-[14px] font-semibold leading-relaxed transition-colors hover:border-[var(--primary)]"
          >
            {prettyMath(o)}
          </button>
        ))}
      </div>
    </div>
  );
}

/* Feedback & Ending */

function FeedbackPanel({ fb, akhir, murid, onLanjut }: { fb: { benar: boolean; teks: string }; akhir: boolean; murid: string; onLanjut: () => void }) {
  return (
    <div className={`aa-card border-2 p-5 ${fb.benar ? "border-[var(--node-good)]" : "border-[var(--node-weak)]"}`}>
      <p className={`flex items-center gap-2 font-display text-lg font-extrabold ${fb.benar ? "text-[var(--node-good)]" : "text-[var(--node-weak)]"}`}>
        {fb.benar ? (
          <>
            <CheckCircle2 size={22} /> Tepat! +10 ⭐
          </>
        ) : (
          <>
            <XCircle size={22} /> Belum tepat
          </>
        )}
      </p>
      {fb.teks && <div className="mt-2 text-[14px] leading-relaxed text-ink-soft"><Hitung text={fb.teks} /></div>}
      {!fb.benar && <p className="mt-2 text-[13px] italic text-ink-soft">{murid} juga sering keliru di sini, nanti kamu yang ajari dia ya 😉</p>}
      <button onClick={onLanjut} className="aa-btn mt-4 w-full justify-center">
        {akhir ? "Lihat Hasil" : "Lanjut"} <ArrowRight size={18} />
      </button>
    </div>
  );
}

function Ending({ lulus, benarCount, total, xp, combo, murid, muridAvatar, onAjari, onUlangi }: { lulus: boolean; benarCount: number; total: number; xp: number; combo: number; murid: string; muridAvatar: AvatarSpec; onAjari: () => void; onUlangi: () => void }) {
  const perlu = Math.max(1, Math.ceil(total * 0.6));
  return (
    <div className="aa-card relative flex flex-col items-center gap-3 overflow-visible p-6 text-center">
      {lulus && (
        <Konfeti count={22} colors={["#1591dc", "#4bb8fa", "#f5a524", "#22a06b", "#e05299"]} className="pointer-events-none absolute left-1/2 top-14 overflow-visible" />
      )}
      <div className="animate-float">
        <Mascot mood={lulus ? "happy" : "curious"} size={64} avatar={muridAvatar} />
      </div>
      <p className="font-display text-xl font-extrabold">{lulus ? "Latihan selesai! 🎉" : "Belum lulus 😅"}</p>
      <p className="text-sm text-ink-soft tnum">
        ⭐ {benarCount}/{total} benar{xp > 0 ? ` · +${xp} XP` : lulus ? " · sudah dihitung" : ""}{combo > 1 ? ` · 🔥 ×${combo}` : ""}
      </p>
      {lulus ? (
        <div className="mt-1 w-full rounded-2xl border border-[var(--primary)]/30 bg-[var(--tint)]/25 p-4 text-left">
          <p className="flex items-start gap-2 text-sm leading-relaxed">
            <span className="flex-none">
              <Mascot size={30} avatar={muridAvatar} />
            </span>
            <span>
              <b>{murid}:</b> &ldquo;Kamu jago alurnya! Sekarang giliranku, <b>ajari aku</b> biar aku benar-benar paham.&rdquo;
            </span>
          </p>
          <p className="mt-2 text-[12px] text-ink-soft">
            Topik ditandai <b className="text-ink">DIKUASAI</b> setelah kamu mengajarkannya ke {murid}.
          </p>
          <button onClick={onAjari} className="aa-btn mt-3 w-full justify-center">
            Ajari {murid} Sekarang <ArrowRight size={18} />
          </button>
        </div>
      ) : (
        <div className="mt-1 w-full rounded-2xl border p-4 text-left" style={{ borderColor: "color-mix(in srgb, var(--node-weak) 35%, transparent)", background: "color-mix(in srgb, var(--node-weak) 8%, transparent)" }}>
          <p className="text-sm leading-relaxed text-ink">
            Perlu <b>minimal {perlu} dari {total} benar</b> untuk lulus dan membuka mode Ajari. Ulangi ya, kamu pasti bisa! 💪
          </p>
        </div>
      )}
      <div className="flex w-full flex-wrap justify-center gap-3">
        <button onClick={onUlangi} className={lulus ? "aa-btn-ghost" : "aa-btn"}>
          <RotateCcw size={16} /> Ulangi
        </button>
        <Link href="/belajar" className="aa-btn-ghost">
          Kembali ke Peta
        </Link>
      </div>
    </div>
  );
}

