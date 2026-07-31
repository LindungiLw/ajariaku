"use client";

import { useEffect, useState } from "react";
import { Check, X, ArrowRight, RotateCcw, ChevronRight } from "lucide-react";
import { Crown, Trophy } from "@/components/brand-icons";
import { Konfeti } from "@/components/confetti";
import { PlayBg } from "@/components/play-bg";
import { bossNode, bossQuiz } from "@/lib/dunia";
import { loadProgress, completeTopic } from "@/lib/progress";
import { celebrateDelta } from "@/lib/celebrate";

// Jawaban kuis bergaya Kahoot: bentuk + warna per opsi.
const QOPT = [
  { shape: "tri", color: "#e21b3c" },
  { shape: "dia", color: "#1368ce" },
  { shape: "cir", color: "#d89400" },
  { shape: "sq", color: "#26890c" },
];
function QIcon({ shape }: { shape: string }) {
  if (shape === "tri")
    return <span className="flex-none" style={{ width: 0, height: 0, borderLeft: "11px solid transparent", borderRight: "11px solid transparent", borderBottom: "18px solid white" }} />;
  if (shape === "dia")
    return <span className="flex-none rotate-45 rounded-[3px] bg-white" style={{ width: 16, height: 16 }} />;
  if (shape === "cir")
    return <span className="flex-none rounded-full bg-white" style={{ width: 18, height: 18 }} />;
  return <span className="flex-none rounded-[3px] bg-white" style={{ width: 16, height: 16 }} />;
}

const QZ_TIME = 20; // detik per soal

// Boss Quiz Fase E: 5 soal MC bergaya Kahoot; lulus >= 3/5 → tandai Fase E TUNTAS + lencana.
export function BossQuiz({ onClose }: { onClose: () => void }) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [time, setTime] = useState(QZ_TIME);

  const q = bossQuiz[idx];
  const answered = picked !== null;

  // Hitung mundur soal. Reset waktu dilakukan SATU BATCH bersama pindah soal (di next/restart),
  // BUKAN lewat effect [idx] terpisah, mencegah effect ini membaca `time` transien 0 dari soal
  // sebelumnya yang tadinya membuat soal BERIKUTNYA langsung ter-"Waktu habis".
  useEffect(() => {
    if (answered || finished) return;
    if (time <= 0) { setPicked(-1); return; } // -1 = waktu habis (tanpa skor)
    const t = setTimeout(() => setTime((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [time, answered, finished]);

  function choose(i: number) {
    if (answered) return;
    setPicked(i);
    if (i === q.jawaban) setScore((s) => s + 1);
  }
  function next() {
    if (idx + 1 < bossQuiz.length) { setIdx(idx + 1); setPicked(null); setTime(QZ_TIME); }
    else setFinished(true);
  }
  function restart() { setIdx(0); setPicked(null); setScore(0); setFinished(false); setTime(QZ_TIME); }

  const pass = score >= 3;

  // Kredit XP + buka lencana saat lulus (idempoten via id): reward NYATA, bukan sekadar klaim.
  useEffect(() => {
    if (finished && pass) {
      const before = loadProgress();
      completeTopic(bossNode.id, bossNode.xp, bossNode.judul);
      celebrateDelta(before, loadProgress()); // rayakan: +XP, naik liga, lencana "Juara Fase E"
    }
  }, [finished, pass]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal aria-label="Ujian Fase E">
      <PlayBg />
      <button
        onClick={onClose}
        aria-label="Tutup"
        className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/20 text-white backdrop-blur transition-colors hover:bg-white/30"
      >
        <X size={20} />
      </button>

      <div className="relative grid min-h-full place-items-center p-4">
        <div className="w-full max-w-lg">
          {!finished ? (
            <div className="flex flex-col gap-4">
              {/* header */}
              <div className="flex items-center justify-between text-white">
                <span className="flex items-center gap-2 font-display text-lg font-extrabold">
                  <Crown size={20} className="text-[var(--reward)]" /> Ujian Fase E
                </span>
                <span className="tnum rounded-full bg-white/15 px-3 py-1 text-sm font-bold">
                  Soal {idx + 1}/{bossQuiz.length}
                </span>
              </div>

              {/* bar waktu */}
              <div className="h-3 w-full overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full transition-[width] duration-1000 ease-linear"
                  style={{ width: `${(time / QZ_TIME) * 100}%`, background: time <= 5 ? "#ff5a6e" : "#ffd54a" }}
                />
              </div>

              {/* pertanyaan */}
              <div className="rounded-3xl bg-white p-5 text-center shadow-[0_20px_44px_-16px_rgba(0,0,0,.55)]">
                <p className="font-display text-lg font-extrabold leading-snug text-ink md:text-xl">{q.soal}</p>
              </div>

              {/* jawaban ala Kahoot */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {q.opsi.map((opt, i) => {
                  const o = QOPT[i % QOPT.length];
                  const isCorrect = i === q.jawaban;
                  const isPicked = picked === i;
                  const dim = answered && !isCorrect && !isPicked;
                  return (
                    <button
                      key={i}
                      onClick={() => choose(i)}
                      disabled={answered}
                      className={`aa-pop-big flex items-center gap-3 rounded-2xl px-4 py-4 text-left font-display text-[15px] font-extrabold text-white transition-all ${dim ? "opacity-40" : ""} ${!answered ? "hover:-translate-y-0.5 hover:brightness-110" : ""}`}
                      style={{
                        background: o.color,
                        animationDelay: `${i * 0.05}s`,
                        boxShadow: answered && isCorrect ? "0 0 0 4px #fff, 0 12px 24px -8px rgba(0,0,0,.5)" : "0 8px 18px -8px rgba(0,0,0,.45)",
                      }}
                    >
                      <QIcon shape={o.shape} />
                      <span className="flex-1">{opt}</span>
                      {answered && isCorrect && <Check size={20} />}
                      {answered && isPicked && !isCorrect && <X size={20} />}
                    </button>
                  );
                })}
              </div>

              {/* pembahasan */}
              {answered && (
                <div className="rounded-2xl bg-white p-4 text-sm shadow-[0_16px_34px_-14px_rgba(0,0,0,.5)]">
                  <p className={`mb-1 font-display font-extrabold ${picked === q.jawaban ? "text-[var(--node-good)]" : "text-[var(--node-weak)]"}`}>
                    {picked === q.jawaban ? "Benar! 🎉" : picked === -1 ? "Waktu habis! ⏰" : "Belum tepat"}
                  </p>
                  <p className="text-ink-soft">{q.pembahasan}</p>
                  <button onClick={next} className="aa-btn mt-3 w-full">
                    {idx + 1 < bossQuiz.length ? "Lanjut" : "Lihat Hasil"} <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="relative flex flex-col items-center gap-3 rounded-3xl bg-white/95 p-8 text-center shadow-[0_24px_50px_-16px_rgba(0,0,0,.5)]">
              {pass && (
                <Konfeti
                  count={30}
                  colors={["#e21b3c", "#1368ce", "#d89400", "#26890c", "#ffd54a", "#ffffff"]}
                  className="pointer-events-none absolute left-1/2 top-12 overflow-visible"
                />
              )}
              <span className={`aa-pop-big grid h-20 w-20 place-items-center rounded-3xl text-white ${pass ? "bg-[var(--node-good)]" : "bg-[var(--node-mid)]"}`}>
                {pass ? <Trophy size={40} /> : <RotateCcw size={34} />}
              </span>
              <p className="aa-pop-big font-display text-2xl font-extrabold">{pass ? "Fase E Tuntas! 🏆" : "Hampir!"}</p>
              <p className="aa-pop-big font-display text-4xl font-extrabold tnum" style={{ animationDelay: ".1s" }}>{score}/{bossQuiz.length}</p>
              <p className="max-w-xs text-sm text-ink-soft">
                {pass ? (
                  <>Kamu dapat <b className="text-[var(--reward-ink)]">+{bossNode.xp} XP</b> &amp; Lencana <b>Juara Fase E</b>. Fase E kamu tandai TUNTAS! 🏆</>
                ) : (
                  <>Butuh minimal 3 benar untuk lulus. Ulangi materinya lalu coba lagi ya.</>
                )}
              </p>
              <div className="mt-1 flex flex-wrap justify-center gap-3">
                {pass ? (
                  <button onClick={onClose} className="aa-btn">Selesai <ChevronRight size={18} /></button>
                ) : (
                  <button onClick={restart} className="aa-btn"><RotateCcw size={16} /> Coba Lagi</button>
                )}
                <button onClick={onClose} className="aa-btn-ghost">Tutup</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
