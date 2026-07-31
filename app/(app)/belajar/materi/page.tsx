"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Bookmark, ChevronDown, ChevronLeft, ChevronRight, Info, AlertTriangle, Lock } from "lucide-react";
import { BookOpen, GraduationCap, Gamepad2 } from "@/components/brand-icons";
import { Mascot } from "@/components/mascot";
import { materiById } from "@/lib/materi";
import { setSesi, completeMateri, completeLatihan, isMateriDone, isDone, isLatihanDone } from "@/lib/progress";
import { buildSesi } from "@/lib/sesi";
import { muridForTopik, baseMuridForTopik } from "@/lib/kelas-topik";
import { buildKursus, acakSeed, type Kartu } from "@/lib/kursus";
import { prettyMath } from "@/lib/pretty-math";
import { MathRich, Hitung } from "@/components/math-rich";
import { KeliruCard } from "@/components/keliru-card";
import { parseContoh, parseMiskonsepsi, type ContohSeg } from "@/lib/materi-parse";
import { resolveTopik } from "@/lib/topik";
import { MateriBg } from "@/components/play-bg";

// Langkah "Belajar" (loop Belajar → Ajari → Naik Level) sebagai HALAMAN penuh (bukan modal):
// briefing "bekal mengajar" kaya-kartu; materi lengkap bertab dibuka on-demand.
export default function MateriPage() {
  return (
    <Suspense fallback={null}>
      <MateriView />
    </Suspense>
  );
}

function MateriView() {
  const router = useRouter();
  const id = useSearchParams().get("topik") ?? "";
  const topik = resolveTopik(id);
  // Murid = murid BIDANG topik ini (otomatis). Awal render pakai versi DETERMINISTIK (aman hydration),
  // lalu useEffect menimpanya dengan edit user (nama/muka) dari localStorage.
  const [mu, setMu] = useState(() => baseMuridForTopik(id));

  const [lengkap, setLengkap] = useState(false); // false = briefing, true = materi lengkap bertab
  const [tab, setTab] = useState<"konsep" | "contoh" | "keliru">("konsep");
  const [perdalam, setPerdalam] = useState(false);
  const [bekal, setBekal] = useState(false);
  // Tahap MATERI (baca + Cek Pemahaman) → QUIZ → AJARI (wajib). Lacak ketiganya untuk peta langkah.
  const [mDone, setMDone] = useState(false);
  const [qDone, setQDone] = useState(false); // Quiz topik ini lulus?
  const [aDone, setADone] = useState(false); // sudah di-Ajari (topik DIKUASAI)?
  useEffect(() => {
    setMu(muridForTopik(id));
    setMDone(isMateriDone(id));
    setQDone(isLatihanDone(id));
    setADone(isDone(id));
  }, [id]);

  if (!topik) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        <button onClick={() => router.push("/belajar")} className="inline-flex w-fit items-center gap-1 text-xs font-bold text-ink-soft transition-colors hover:text-[var(--primary)]">
          <ChevronLeft size={15} /> Kembali ke peta
        </button>
        <div className="aa-card grid place-items-center p-8 text-center">
          <div>
            <BookOpen size={28} className="mx-auto text-ink-soft" />
            <p className="mt-2 font-display font-extrabold">Topik tak ditemukan</p>
            <button onClick={() => router.push("/belajar")} className="aa-btn mt-3">Kembali ke peta</button>
          </div>
        </div>
      </div>
    );
  }

  const m = materiById(topik.id);
  const paras = m ? m.konten.split(/\n\n+/) : [];
  const konsepIntro = paras[0] ?? "";
  const adaLanjut = paras.length > 1;
  const keliruList = m ? parseMiskonsepsi(m.miskonsepsi) : null;
  const contohSegs = m ? parseContoh(m.contoh) : null;
  const namaKonsep = topik.judul.replace(/^Mengenal\s+/i, ""); // buang prefix biar "Apa itu…" tak dobel
  // Tahap MATERI: baca + "Cek Pemahaman" (pilihan ganda) → tuntas → lanjut ke QUIZ.
  const materiXp = Math.max(8, Math.round((topik.xp ?? 20) * 0.4));
  const cekCards: MCItem[] = (m ? buildKursus(topik.id) : [])
    .map(toMC)
    .filter((x): x is MCItem => x !== null)
    .slice(0, 3);
  // Dua titik cek: mini-cek (1 soal, di tengah bacaan) + Cek Pemahaman (sisanya, di akhir).
  const miniCard = cekCards.length >= 2 ? cekCards[0] : null;
  const cekAkhir = cekCards.length >= 2 ? cekCards.slice(1) : cekCards;
  const tId = topik.id;
  const tJudul = topik.judul;
  function selesaikanMateri() {
    completeMateri(tId, materiXp, tJudul);
    setMDone(true);
    // Topik tanpa Quiz yang bisa dibangun (mis. node demo Fase E "Peluang", soalnya tak terparse
    // jadi kartu) → tandai Quiz lulus otomatis agar alur lanjut ke Ajari (tak buntu di simpul Quiz).
    if (buildKursus(tId).length < 2) { completeLatihan(tId, 0, tJudul); setQDone(true); }
  }

  const TABS = [
    { key: "konsep", label: "Konsep" },
    { key: "contoh", label: "Contoh" },
    { key: "keliru", label: "Sering Keliru" },
  ] as const;

  function ajari() {
    setSesi(buildSesi(topik!.id)); // murid otomatis = murid bidang topik
    router.push("/ajari");
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <MateriBg />
      <div className="relative h-full overflow-y-auto">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 pb-28 pt-5">
      <h1 className="sr-only">Materi: {topik.judul}</h1>

      {/* kembali: ke ringkasan (kalau sedang materi lengkap) atau ke peta */}
      {lengkap ? (
        <button onClick={() => setLengkap(false)} className="inline-flex w-fit items-center gap-1 text-xs font-bold text-white/75 transition-colors hover:text-white">
          <ChevronLeft size={15} /> Kembali ke ringkasan
        </button>
      ) : (
        <button onClick={() => router.push("/belajar")} className="inline-flex w-fit items-center gap-1 text-xs font-bold text-white/75 transition-colors hover:text-white">
          <ChevronLeft size={15} /> Kembali ke peta
        </button>
      )}

      {!m ? (
        <div className="flex flex-col gap-3">
          <div className="relative overflow-hidden rounded-2xl px-4 py-4 text-white shadow-[var(--shadow-1)]" style={{ background: "linear-gradient(140deg, var(--primary-bright), var(--cta-1) 45%, var(--cta-2))" }}>
            <p className="text-[11px] font-bold uppercase tracking-wider text-white/80">Materi</p>
            <h2 className="font-display text-2xl font-extrabold leading-tight">{topik.judul}</h2>
          </div>
          <div className="aa-card grid place-items-center p-8 text-center">
            <div>
              <BookOpen size={28} className="mx-auto text-ink-soft" />
              <p className="mt-2 font-display font-extrabold">Langsung ke mode mengajar</p>
              <p className="mt-1 text-sm text-ink-soft">Kamu tetap bisa langsung mengajari topik ini.</p>
            </div>
          </div>
        </div>
      ) : !lengkap ? (
        /* Briefing (bekal mengajar): hero Pio + peta langkah + kartu konsep */
        <div className="flex flex-col gap-3">
          {/* HERO: badge + judul + Pio bergelembung + peta 4 langkah (sesuai mockup) */}
          <div className="relative overflow-hidden rounded-2xl px-4 py-4 text-white shadow-[var(--shadow-1)]" style={{ background: "linear-gradient(140deg, var(--primary-bright), var(--cta-1) 45%, var(--cta-2))" }}>
            <div className="relative flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <span className="inline-flex items-center gap-1 rounded-full bg-black/25 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white/95">
                  <Bookmark size={11} className="fill-[var(--reward)] text-[var(--reward)]" /> Bekal sebelum mengajar
                </span>
                <h2 className="mt-2 font-display text-2xl font-extrabold leading-tight">{topik.judul}</h2>
                <p className="mt-1 text-[13px] leading-snug text-white/85">
                  Pahami intinya, lalu kamu yang ajari {mu.nama}.
                </p>
              </div>
              <div className="flex-none pt-0.5">
                <Mascot avatar={mu.avatar} mood="happy" size={56} />
              </div>
            </div>
            <LangkahTrack mDone={mDone} qDone={qDone} ajariDone={aDone} murid={mu.nama} />
          </div>

          {/* BELAJAR BERTAHAP: baca (konsep → mini-cek → contoh) lalu Cek Pemahaman → tuntas */}
          {!mDone ? (
            <BacaMateri
              namaKonsep={namaKonsep}
              konten={m.konten}
              rumus={m.rumus ?? []}
              keliru={keliruList && keliruList.length > 0 ? keliruList[0] : null}
              contohSegs={contohSegs}
              contohRaw={m.contoh}
              miniCard={miniCard}
              cekCards={cekAkhir}
              onSelesai={selesaikanMateri}
            />
          ) : (
            <div className="rounded-2xl border p-3 text-center text-[13px] font-bold text-[var(--node-good)]" style={{ borderColor: "color-mix(in srgb, var(--node-good) 35%, transparent)", background: "color-mix(in srgb, var(--node-good) 8%, transparent)" }}>
              Tahap Materi selesai ✅, lanjut ke Quiz di bawah.
            </div>
          )}

          {/* aksi sekunder, frosted putih biar terbaca di latar gelap */}
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setLengkap(true)} className="flex min-w-[130px] flex-1 items-center justify-center gap-1.5 rounded-full border border-white/25 bg-white/5 py-2.5 text-[13px] font-bold text-white/90 backdrop-blur transition-colors hover:bg-white/10">
              <BookOpen size={15} /> Materi lengkap
            </button>
            {qDone ? (
              <button onClick={ajari} className="flex min-w-[130px] flex-1 items-center justify-center gap-1.5 rounded-full border border-white/25 bg-white/5 py-2.5 text-[13px] font-bold text-white/90 backdrop-blur transition-colors hover:bg-white/10">
                <GraduationCap size={15} /> Ajari {mu.nama}
              </button>
            ) : (
              <button disabled title="Lulus Quiz dulu untuk mengajari" className="flex min-w-[130px] flex-1 cursor-not-allowed items-center justify-center gap-1.5 rounded-full border border-white/15 bg-white/5 py-2.5 text-[13px] font-bold text-white/45 backdrop-blur">
                <Lock size={14} /> Ajari {mu.nama}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Materi lengkap (bertab) */
        <div className="flex flex-col gap-3">
          {/* HERO: anchor visual konsisten dgn briefing */}
          <div className="relative overflow-hidden rounded-2xl px-4 py-3.5 text-white shadow-[var(--shadow-1)]" style={{ background: "linear-gradient(140deg, var(--primary-bright), var(--cta-1) 45%, var(--cta-2))" }}>
            <span className="pointer-events-none absolute -right-1 -top-3 select-none font-display text-6xl font-black text-white/10">π</span>
            <p className="text-[11px] font-bold uppercase tracking-wider text-white/80">Perdalam pemahaman</p>
            <p className="font-display text-xl font-extrabold leading-tight">{topik.judul}</p>
            <p className="mt-0.5 text-[12.5px] leading-snug text-white/90">Teori &amp; contoh selengkapnya, buka bab yang kamu perlu di bawah. 📚</p>
          </div>

          {/* RUMUS KUNCI: kartu bersih (sama gaya dgn briefing) */}
          {m.rumus && m.rumus.length > 0 && (
            <div className="rounded-2xl border border-line bg-surface p-4">
              <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-ink-soft">Rumus kunci</p>
              <div className="flex flex-wrap gap-1.5">
                {m.rumus.map((r, i) => (
                  <span key={i} className="rounded-lg border border-[var(--primary)]/20 bg-[var(--tint)]/40 px-2.5 py-1.5 font-display text-[13px] font-bold text-[var(--primary-deep)] tnum">
                    {prettyMath(r)}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div role="tablist" aria-label="Bagian materi">
            <div className="flex gap-1 rounded-xl bg-surface-2 p-1">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={tab === t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-[13px] font-bold transition-colors ${
                    tab === t.key ? "bg-surface text-[var(--primary-deep)] shadow-[var(--shadow-1)]" : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {t.label}
                  {t.key === "keliru" && keliruList && (
                    <span className="rounded-full bg-[var(--node-weak)]/15 px-1.5 text-[10px] font-bold text-[var(--node-weak)]">{keliruList.length}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div role="tabpanel" className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
            {tab === "konsep" && (
              <div className="flex flex-col gap-3">
                <p className="whitespace-pre-line text-base leading-relaxed text-ink"><MathRich>{konsepIntro}</MathRich></p>
                {adaLanjut && (
                  <div className="overflow-hidden rounded-xl border border-line">
                    <button
                      onClick={() => setPerdalam((v) => !v)}
                      aria-expanded={perdalam}
                      className="flex w-full items-center gap-1.5 px-3 py-2 text-left text-[13px] font-bold text-[var(--primary-deep)] hover:bg-surface-2"
                    >
                      <ChevronDown size={15} className={`flex-none transition-transform ${perdalam ? "rotate-180" : ""}`} />
                      Perdalam: teori lengkap
                    </button>
                    {perdalam && (
                      <p className="whitespace-pre-line border-t border-line px-3 py-3 text-[14px] leading-relaxed text-ink-soft"><MathRich>{m.konten}</MathRich></p>
                    )}
                  </div>
                )}
              </div>
            )}

            {tab === "contoh" && <ContohBlok contohSegs={contohSegs} contohRaw={m.contoh} />}

            {tab === "keliru" &&
              (keliruList ? (
                <div className="flex flex-col gap-2.5">
                  {keliruList.map((k, i) => (
                    <KeliruCard key={i} text={k} />
                  ))}
                </div>
              ) : (
                <p className="whitespace-pre-line text-[15px] leading-relaxed text-ink-soft">{prettyMath(m.miskonsepsi)}</p>
              ))}
          </div>

          {/* bekal mengajar (caraAjari) */}
          {m.caraAjari && (
            <div>
              <button
                onClick={() => setBekal((v) => !v)}
                aria-expanded={bekal}
                className="flex w-full items-center gap-1.5 rounded-xl border px-3 py-2 text-[13px] font-bold"
                style={{ borderColor: "color-mix(in srgb, var(--reward) 32%, transparent)", background: "color-mix(in srgb, var(--reward) 9%, transparent)", color: "var(--reward)" }}
              >
                <GraduationCap size={15} className="flex-none" /> Bekal mengajar
                <ChevronDown size={15} className={`ml-auto flex-none transition-transform ${bekal ? "rotate-180" : ""}`} />
              </button>
              {bekal && (
                <p className="mt-2 whitespace-pre-line px-1 text-[13px] leading-relaxed text-ink">{prettyMath(m.caraAjari)}</p>
              )}
            </div>
          )}
        </div>
      )}

      </div>
      </div>

      {/* CTA bar: FIXED penuh-lebar, frosted (blend dgn latar, tak ada kotak gelap kaku saat scroll) */}
      <div className="fixed inset-x-0 bottom-0 z-[51] border-t border-white/10 bg-[#0f1e45]/75 backdrop-blur-md">
        <div className="mx-auto max-w-3xl px-4 py-3">
          {mDone ? (
            <>
              <button onClick={() => router.push(`/kursus?topik=${topik.id}`)} className="aa-btn w-full text-base">
                <Gamepad2 size={18} /> Lanjut ke Quiz <ArrowRight size={18} />
              </button>
              <p className="mt-1.5 text-center text-[11px] text-white/70">Materi beres, sekarang uji di Quiz ❓</p>
            </>
          ) : cekCards.length > 0 ? (
            <>
              <button disabled className="aa-btn w-full cursor-not-allowed text-base opacity-50">
                <Lock size={16} /> Lanjut ke Quiz
              </button>
              <p className="mt-1.5 flex items-center justify-center gap-1 text-center text-[11px] text-white/70">
                <Lock size={11} className="flex-none" /> Jawab <b className="text-white">Cek Pemahaman</b> dulu untuk lanjut
              </p>
            </>
          ) : (
            <>
              <button onClick={() => { selesaikanMateri(); router.push(`/kursus?topik=${topik.id}`); }} className="aa-btn w-full text-base">
                Sudah paham, lanjut ke Quiz <ArrowRight size={18} />
              </button>
              <p className="mt-1.5 text-center text-[11px] text-white/70">Belajar paling nempel saat kamu yang mengajarkannya 👆</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* Cek Pemahaman (pilihan ganda, tahap Materi) */

// Peta 4 langkah perjalanan topik (dipakai di hero briefing), tunjukkan posisi & kunci Quiz.
function LangkahTrack({ mDone, qDone, ajariDone, murid }: { mDone: boolean; qDone: boolean; ajariDone: boolean; murid: string }) {
  const steps = [
    { n: 1, label: "Baca materi", state: mDone ? "done" : "now" },
    { n: 2, label: "Cek Pemahaman", state: mDone ? "done" : "next" },
    { n: 3, label: "Quiz", state: qDone ? "done" : mDone ? "now" : "lock" },
    { n: 4, label: `Ajari ${murid}`, state: ajariDone ? "done" : qDone ? "now" : "lock" },
  ];
  return (
    <div className="relative -mx-1 mt-3 flex items-center gap-1 overflow-x-auto px-1 pb-1">
      {steps.map((s, i) => (
        <div key={s.n} className="flex flex-none items-center gap-1">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
              s.state === "now"
                ? "bg-white text-[var(--primary-deep)] shadow-[var(--shadow-1)]"
                : s.state === "done"
                  ? "bg-white/90 text-[var(--node-good)]"
                  : s.state === "opt"
                    ? "border border-dashed border-white/45 text-white/75"
                    : "bg-white/15 text-white/75"
            }`}
          >
            <span className="whitespace-nowrap">{s.state === "done" ? `✓ ${s.label}` : `${s.n} · ${s.label}`}</span>
            {s.state === "lock" && <Lock size={11} className="opacity-80" />}
          </span>
          {i < steps.length - 1 && <ChevronRight size={13} className="flex-none text-white/35" />}
        </div>
      ))}
    </div>
  );
}

// MathRich & Hitung dipindah ke @/components/math-rich (dipakai ulang di materi & kursus).

// Contoh dikerjakan, dipakai ulang (langkah "Contoh" di belajar bertahap & tab Contoh materi lengkap).
function ContohBlok({ contohSegs, contohRaw }: { contohSegs: ContohSeg[] | null; contohRaw: string }) {
  if (!contohSegs)
    return (
      <div className="rounded-2xl border border-[var(--primary)]/20 bg-[var(--tint)]/20 p-4">
        <p className="whitespace-pre-line text-[15px] leading-relaxed text-ink">{prettyMath(contohRaw)}</p>
      </div>
    );
  return (
    <div className="flex flex-col gap-2.5">
      {contohSegs.map((s, i) => {
        if (s.t === "contoh")
          return (
            <div key={i} className="mt-1 flex items-center gap-2 font-display text-sm font-extrabold text-[var(--primary-deep)]">
              <span className="h-4 w-1 flex-none rounded bg-[var(--primary)]" />
              <MathRich>{s.text}</MathRich>
            </div>
          );
        if (s.t === "soal")
          return (
            <div key={i} className="rounded-xl bg-[var(--tint)]/30 px-3 py-2 font-display text-[15px] font-bold text-ink">
              <MathRich>{s.text}</MathRich>
            </div>
          );
        if (s.t === "langkah")
          return (
            <div key={i} className="flex gap-2.5">
              <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-[var(--primary)] text-[12px] font-bold text-white tnum">
                {s.n}
              </span>
              <div className="min-w-0 flex-1 text-[15px] leading-relaxed text-ink">
                {s.label && <b className="text-ink-soft">{s.label} </b>}
                <Hitung text={s.text} />
              </div>
            </div>
          );
        const isJadi = /^jadi\b/i.test(s.text);
        return (
          <div key={i} className={`flex gap-2 ${isJadi ? "" : "pl-[2.1rem]"}`}>
            {isJadi && (
              <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-[var(--node-good)] text-[12px] text-white">✓</span>
            )}
            <div className={`min-w-0 flex-1 text-[14px] leading-relaxed ${isJadi ? "font-bold text-ink" : "text-ink-soft"}`}><Hitung text={s.text} /></div>
          </div>
        );
      })}
    </div>
  );
}

// Belajar BERTAHAP: baca konsep → mini-cek (1 soal) → contoh → Cek Pemahaman → tuntas.
// Materi diambil dari data yang sudah ada (konsep + rumus + contoh), disusun jadi langkah "Lanjut".
function BacaMateri({
  namaKonsep, konten, rumus, keliru, contohSegs, contohRaw, miniCard, cekCards, onSelesai,
}: {
  namaKonsep: string;
  konten: string;
  rumus: string[];
  keliru: string | null;
  contohSegs: ContohSeg[] | null;
  contohRaw: string;
  miniCard: MCItem | null;
  cekCards: MCItem[];
  onSelesai: () => void;
}) {
  const steps: Array<"konsep" | "minicek" | "contoh" | "cek" | "selesai"> = ["konsep"];
  if (miniCard) steps.push("minicek");
  if (contohSegs || contohRaw) steps.push("contoh");
  steps.push(cekCards.length > 0 ? "cek" : "selesai");

  const [i, setI] = useState(0);
  const [miniOk, setMiniOk] = useState(false);
  const idx = Math.min(i, steps.length - 1);
  const cur = steps[idx];
  const canNext = cur !== "minicek" || miniOk;

  return (
    <div className="flex flex-col gap-3">
      {/* progres langkah baca */}
      <div className="flex items-center gap-2">
        <div className="flex flex-1 gap-1">
          {steps.map((_, k) => (
            <span key={k} className={`h-1.5 flex-1 rounded-full ${k < idx ? "bg-[var(--node-good)]" : k === idx ? "bg-white" : "bg-white/25"}`} />
          ))}
        </div>
        <span className="tnum text-[11px] font-bold text-white/70">{idx + 1}/{steps.length}</span>
      </div>

      <div className="rounded-2xl border border-line bg-surface p-4">
        {cur === "konsep" && (
          <>
            <p className="flex items-center gap-1.5 text-[13px] font-extrabold text-[var(--primary-deep)]"><Info size={15} className="flex-none" /> Apa itu {namaKonsep}?</p>
            <p className="mt-2 whitespace-pre-line text-[14.5px] leading-relaxed text-ink"><MathRich>{konten}</MathRich></p>
            {rumus.length > 0 && (
              <>
                <p className="mb-1.5 mt-3 text-[11px] font-bold uppercase tracking-wider text-ink-soft">Rumus kunci</p>
                <div className="flex flex-wrap gap-1.5">
                  {rumus.map((r, k) => (
                    <span key={k} className="rounded-lg border border-[var(--primary)]/20 bg-[var(--tint)]/40 px-2.5 py-1.5 font-display text-[13px] font-bold text-[var(--primary-deep)] tnum">{prettyMath(r)}</span>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {cur === "minicek" && miniCard && (
          <>
            <p className="text-[13px] font-extrabold text-[var(--primary-deep)]">⚡ Cek cepat</p>
            <p className="mt-0.5 text-[12px] text-ink-soft">Pastikan paham dulu sebelum lihat contoh.</p>
            <div className="mt-2"><MCQuestion item={miniCard} onAnswer={() => setMiniOk(true)} /></div>
          </>
        )}

        {cur === "contoh" && (
          <>
            <p className="text-[13px] font-extrabold text-[var(--primary-deep)]">Contoh dikerjakan</p>
            <div className="mt-2"><ContohBlok contohSegs={contohSegs} contohRaw={contohRaw} /></div>
            {keliru && (
              <div className="mt-3">
                <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wide text-[var(--node-weak)]">
                  <AlertTriangle size={13} className="flex-none" /> Sering keliru
                </p>
                <KeliruCard text={keliru} />
              </div>
            )}
          </>
        )}

        {cur === "cek" && <CekPemahaman cards={cekCards} onComplete={onSelesai} />}

        {cur === "selesai" && (
          <div className="text-center">
            <p className="font-display text-sm font-extrabold text-ink">Sudah paham materinya?</p>
            <p className="mt-1 text-[12px] text-ink-soft">Tandai selesai untuk membuka Quiz.</p>
            <button onClick={onSelesai} className="aa-btn mt-3 w-full justify-center">Selesai membaca <ArrowRight size={16} /></button>
          </div>
        )}
      </div>

      {/* navigasi langkah */}
      {cur === "konsep" || cur === "minicek" || cur === "contoh" ? (
        <div className="flex items-center gap-2">
          {idx > 0 && (
            <button onClick={() => setI(idx - 1)} className="flex items-center gap-1 rounded-full border border-white/25 bg-white/5 px-4 py-2 text-[13px] font-bold text-white/85 backdrop-blur transition-colors hover:bg-white/10">
              <ChevronLeft size={15} /> Kembali
            </button>
          )}
          <button onClick={() => canNext && setI(idx + 1)} disabled={!canNext} className="aa-btn flex-1 justify-center disabled:opacity-40">
            Lanjut <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        idx > 0 && (
          <button onClick={() => setI(idx - 1)} className="mx-auto flex w-fit items-center gap-1 text-[12px] font-bold text-white/70 transition-colors hover:text-white">
            <ChevronLeft size={14} /> Kembali baca materi
          </button>
        )
      )}
    </div>
  );
}

type MCItem = { q: string; sudah?: string[]; benar: string; distraktor: string[]; hint?: string };

// Ubah kartu latihan (pilgan / nextstep) jadi 1 soal pilihan ganda ringkas. Opsi NYATA, tak dikarang.
function toMC(k: Kartu): MCItem | null {
  if (k.tipe === "pilgan") return { q: k.soal, benar: k.benar, distraktor: k.distraktor, hint: k.pembahasan };
  if (k.tipe === "nextstep") return { q: "Pilih langkah berikutnya yang benar", sudah: k.sudah, benar: k.benar, distraktor: k.distraktor };
  return null;
}

function CekPemahaman({ cards, onComplete }: { cards: MCItem[]; onComplete: () => void }) {
  const [answered, setAnswered] = useState<Record<number, boolean>>({});
  const semua = Object.keys(answered).length >= cards.length;
  useEffect(() => {
    if (semua) onComplete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [semua]);
  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <p className="font-display text-sm font-extrabold">Cek Pemahaman</p>
      <p className="text-[12px] text-ink-soft">Jawab dulu untuk lanjut ke Quiz.</p>
      <div className="mt-2 flex flex-col gap-4">
        {cards.map((c, i) => (
          <MCQuestion key={i} item={c} onAnswer={(ok) => setAnswered((a) => ({ ...a, [i]: ok }))} />
        ))}
      </div>
      {semua && <p className="mt-3 text-[13px] font-bold text-[var(--node-good)]">Materi selesai, lanjut ke Quiz di bawah. ✅</p>}
    </div>
  );
}

function MCQuestion({ item, onAnswer }: { item: MCItem; onAnswer: (correct: boolean) => void }) {
  const [opsi] = useState<string[]>(() => acakSeed([item.benar, ...item.distraktor], `${item.q}|${item.benar}`));
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <div>
      {item.sudah && item.sudah.length > 0 && (
        <div className="mb-2 flex flex-col gap-0.5 rounded-xl bg-surface-2 p-2.5 text-[12px] text-ink-soft">
          {item.sudah.map((s, i) => (
            <span key={i}>✓ {prettyMath(s)}</span>
          ))}
        </div>
      )}
      <p className="text-[14px] font-semibold leading-snug text-ink">{prettyMath(item.q)}</p>
      <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
        {opsi.map((o, i) => {
          const show = picked !== null;
          const benar = o === item.benar;
          const dipilih = picked === o;
          const cls = show
            ? benar
              ? "border-[var(--node-good)] bg-[var(--node-good)]/10 text-[var(--node-good)]"
              : dipilih
                ? "border-[var(--node-weak)] bg-[var(--node-weak)]/10 text-[var(--node-weak)]"
                : "border-line bg-surface-2/40 opacity-50"
            : "border-line bg-surface-2/60 hover:border-[var(--primary)] hover:bg-[var(--tint)]/30";
          return (
            <button
              key={i}
              disabled={show}
              onClick={() => { setPicked(o); onAnswer(benar); }}
              className={`rounded-xl border px-3.5 py-2.5 text-left text-[13px] font-semibold leading-snug transition-colors ${cls}`}
            >
              {prettyMath(o)}
            </button>
          );
        })}
      </div>
      {picked !== null && picked !== item.benar && (
        <p className="mt-1.5 text-[11.5px] leading-snug text-ink-soft">
          Jawaban: <b className="text-ink">{prettyMath(item.benar)}</b>. {item.hint ? prettyMath(item.hint) : ""}
        </p>
      )}
    </div>
  );
}
