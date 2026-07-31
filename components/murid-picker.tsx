"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, BookCheck, ArrowRight, Lock } from "lucide-react";
import { Mascot } from "@/components/mascot";
import { levelInfo, isLatihanDone } from "@/lib/progress";
import { topicsForKategori } from "@/lib/kelas-topik";
import { kategoriLabel } from "@/lib/avatar";
import type { MuridKustom } from "@/lib/murid";

// Pemilih materi saat GANTI MURID dari panel kiri (desktop), pola sama dgn Ruang Kelas:
// pilih murid → daftar materi kategorinya → mulai sesi chat dengan murid itu.
export function MuridPicker({ murid, taken, onClose, onPick }: { murid: MuridKustom; taken: Set<string>; onClose: () => void; onPick: (id: string) => void }) {
  // Hanya topik yang Materi+Quiz-nya selesai (teachable). taken menyingkirkan yang dipegang murid lain.
  const semua = topicsForKategori(murid.kategori).filter((t) => !taken.has(t.id));
  const topics = semua.filter((t) => isLatihanDone(t.id));
  const adaTerkunci = topics.length < semua.length; // masih ada topik bidang ini yang belum dibuka di Peta
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/50 backdrop-blur-sm sm:place-items-center sm:p-4" onClick={onClose}>
      <div className="aa-card flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-b-none sm:rounded-b-[var(--r-card)]" onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto mt-2 h-1.5 w-10 flex-none rounded-full bg-line sm:hidden" aria-hidden />
        <div className="flex flex-none items-center gap-3 border-b border-line p-4 sm:p-5">
          <Mascot avatar={murid.avatar} size={44} />
          <div className="min-w-0 flex-1">
            <p className="font-display font-extrabold leading-tight">{murid.nama}</p>
            <p className="text-xs text-ink-soft">{kategoriLabel(murid.kategori)} · Lv {levelInfo(murid.xp ?? 0).level} · {murid.selesai?.length ?? 0} diajari</p>
          </div>
          <button onClick={onClose} aria-label="Tutup" className="grid h-10 w-10 flex-none place-items-center rounded-lg text-ink-soft hover:bg-surface-2">
            <X size={18} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
          <p className="px-1 pb-2.5 text-xs text-ink-soft">
            Pilih materi untuk diajarkan ke {murid.nama}, yang <b className="text-ink">Materi &amp; Quiz</b>-nya sudah kamu selesaikan.
          </p>
          {semua.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line px-4 py-8 text-center text-sm text-ink-soft">
              Semua topik <b className="text-ink">{kategoriLabel(murid.kategori)}</b> sudah diambil murid lain. Buat murid di bidang lain, atau ubah fokus murid ini. 🎓
            </div>
          ) : topics.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line px-4 py-8 text-center text-sm text-ink-soft">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-surface-2 text-ink-soft"><Lock size={20} /></span>
              <p>Belum ada topik yang bisa diajari ke <b className="text-ink">{murid.nama}</b>. Selesaikan <b className="text-ink">Materi &amp; Quiz</b> bidang <b className="text-ink">{kategoriLabel(murid.kategori)}</b> dulu, muridnya terbuka seiring kamu belajar. 🎓</p>
              <Link href="/belajar" onClick={onClose} className="aa-btn">
                Belajar di Peta <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {topics.map((t) => (
                  <li key={t.id}>
                    <button onClick={() => onPick(t.id)} className="flex h-full w-full items-center gap-3 rounded-2xl border border-line px-3.5 py-3 text-left transition-colors hover:border-[var(--primary)] hover:bg-surface-2">
                      <span className="grid h-8 w-8 flex-none place-items-center rounded-xl bg-[var(--tint)] text-[var(--primary-deep)]"><BookCheck size={15} /></span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">{t.judul}</span>
                        <span className="block truncate text-[11px] text-ink-soft">{t.sub}</span>
                      </span>
                      <span className="flex-none text-[11px] font-bold text-[var(--reward-ink)] tnum">+{t.xp} XP</span>
                      <ArrowRight size={15} className="flex-none text-ink-soft" />
                    </button>
                  </li>
                ))}
              </ul>
              {adaTerkunci && (
                <Link href="/belajar" onClick={onClose} className="mt-3 flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-line px-3 py-2.5 text-[12px] font-bold text-ink-soft transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]">
                  Buka lebih banyak topik dengan belajar di Peta <ArrowRight size={14} />
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
