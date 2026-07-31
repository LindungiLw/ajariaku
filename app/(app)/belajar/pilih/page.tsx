"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ArrowRight } from "lucide-react";
import { Compass, Star } from "@/components/brand-icons";
import { useProfil } from "@/components/profil-pengajar";
import { loadProgress } from "@/lib/progress";
import { buildWorlds, JENJANG } from "@/lib/dunia-worlds";

// Sama dengan kunci di /belajar, pilihan tingkat "lengket" antar-kunjungan.
const TINGKAT_KEY = "ajari-aku:tingkat";

export default function PilihTingkatPage() {
  const router = useRouter();
  const { profil } = useProfil();
  const [prog, setProg] = useState<{ materi: string[]; latihan: string[]; selesai: string[] }>({ materi: [], latihan: [], selesai: [] });
  useEffect(() => { const p = loadProgress(); setProg({ materi: p.materi ?? [], latihan: p.latihan ?? [], selesai: p.selesai ?? [] }); }, []);

  const worlds = buildWorlds(prog.materi, prog.latihan, prog.selesai);

  // Rekomendasi sesuai jenjang onboarding (SMA/kosong → Fase E showcase).
  const rekom =
    worlds.find((w) => {
      const j = profil.jenjang;
      if (!j || j === "SMA") return w.hero;
      return w.jenjang === j && !w.hero;
    }) ?? worlds[0];
  const rLabel =
    rekom.done === 0 ? "Mulai belajar" : rekom.done >= rekom.total ? "Ulangi lagi" : "Lanjutkan";

  // Simpan pilihan → kembali ke peta; /belajar memulihkannya dari localStorage.
  function pilih(key: string) {
    try {
      window.localStorage.setItem(TINGKAT_KEY, key);
    } catch {
      /* storage diblokir, abaikan */
    }
    router.push("/belajar");
  }

  return (
    <div className="flex flex-col gap-5">
      <section className="aa-card p-5">
        <button
          onClick={() => router.push("/belajar")}
          className="mb-3 inline-flex items-center gap-1 text-xs font-bold text-ink-soft transition-colors hover:text-[var(--primary)]"
        >
          <ChevronLeft size={15} /> Kembali ke peta
        </button>
        <span className="aa-pill-primary">
          <Compass size={14} /> Katalog Tingkat
        </span>
        <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight">
          Pilih tingkat belajarmu
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          Pilih <b className="text-ink">Fase</b> yang sesuai kelasmu, atau bebas jelajahi mana pun.
        </p>
      </section>

      {/* Rekomendasi: satu ketuk langsung ke petanya */}
      <button
        onClick={() => pilih(rekom.key)}
        aria-label={`${rLabel}: ${rekom.kelas}`}
        className="group relative overflow-hidden rounded-[var(--r-card)] p-5 text-left text-white shadow-[var(--shadow-2)] transition-transform hover:-translate-y-0.5"
        style={{ background: "linear-gradient(135deg, var(--primary-bright), var(--cta-1) 40%, var(--cta-2))" }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-extrabold">
              <Star size={12} className="flex-none" /> Direkomendasikan untukmu
            </span>
            <p className="mt-2 font-display text-xl font-extrabold leading-tight">{rekom.faseShort} · {rekom.kelas}</p>
            <p className="mt-0.5 text-sm text-white/85">{rekom.hint}</p>
          </div>
          <span className="grid h-12 w-12 flex-none place-items-center rounded-full bg-white/20 transition-transform group-hover:translate-x-0.5">
            <ArrowRight size={22} />
          </span>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="aa-track flex-1" style={{ height: 7, background: "rgba(255,255,255,.3)" }}>
            <div
              className="aa-fill"
              style={{ width: `${rekom.total ? (rekom.done / rekom.total) * 100 : 0}%`, background: "#fff" }}
            />
          </div>
          <span className="tnum flex-none text-xs font-extrabold">
            {rekom.done}/{rekom.total} · {rLabel}
          </span>
        </div>
      </button>

      {/* Semua tingkat: grid mengisi lebar, dikelompokkan per jenjang */}
      {JENJANG.map((j) => {
        const group = worlds.filter((w) => w.jenjang === j.key);
        if (!group.length) return null;
        return (
          <section key={j.key}>
            <p className="mb-2.5 flex items-center gap-2 text-sm font-extrabold">
              <span className="grid h-6 place-items-center rounded-md bg-[var(--tint)] px-2 text-[11px] font-extrabold text-[var(--primary-deep)]">
                {j.key}
              </span>
              {j.sub}
            </p>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {group.map((w) => (
                <button
                  key={w.key}
                  onClick={() => pilih(w.key)}
                  className="flex flex-col gap-2.5 rounded-xl border border-line bg-surface p-3.5 text-left transition-all hover:-translate-y-0.5 hover:border-[var(--primary)] hover:shadow-[var(--shadow-1)]"
                >
                  {/* Fase = unit Kurikulum Merdeka (identitas utama) → menjawab "kenapa kelas dikelompokkan begini" */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-lg bg-[var(--tint)] px-2 py-1 text-[11px] font-extrabold text-[var(--primary-deep)]">
                      {w.faseShort}
                    </span>
                    {w.hero ? (
                      <span className="flex-none text-[var(--primary)]" title="Dunia utama"><Star size={16} /></span>
                    ) : (
                      <ArrowRight size={16} className="flex-none text-ink-soft" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-base font-extrabold leading-tight">{w.kelas}</p>
                    <p className="mt-0.5 text-xs leading-snug text-ink-soft">{w.hint}</p>
                  </div>
                  <div className="mt-auto">
                    <div className="aa-track" style={{ height: 6 }}>
                      <div className="aa-fill" style={{ width: `${w.total ? (w.done / w.total) * 100 : 0}%` }} />
                    </div>
                    <p className="mt-1 text-[11px] font-bold tnum text-ink-soft">{w.done}/{w.total} tuntas</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
