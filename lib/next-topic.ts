// Topik aktif untuk "mulai cepat" (Beranda hero & /ajari tanpa sesi).
// Menghormati jenjang onboarding: jenjang non-SMA → dunia pertama jenjang itu;
// SMA / tak dipilih → Fase E (dunia showcase). Menghindari anak SD disodori materi SMA.

import { faseEStatus, duniaMeta } from "./dunia";
import { bankByDunia } from "./bank-soal";

export type ActiveTopik = { id: string; judul: string; soal: string; xp: number };

export function activeTopikFor(jenjang: string | undefined, selesai: string[]): ActiveTopik {
  if (jenjang && jenjang !== "SMA" && jenjang !== duniaMeta.jenjang) {
    // Gabung SEMUA fase jenjang ini (A→B→C, dst) supaya quick-start MAJU lintas fase,
    // bukan mentok di fase pertama.
    const topics = bankByDunia()
      .filter((x) => x.jenjang === jenjang)
      .flatMap((g) => g.topik)
      .map((t) => ({ id: t.id, judul: t.judul, soal: t.soal[0]?.soal ?? t.topik, xp: t.xp }));
    if (topics.length) {
      // topik pertama yang belum tuntas; kalau semua tuntas → topik terakhir (paling maju).
      return topics.find((t) => !selesai.includes(t.id)) ?? topics[topics.length - 1];
    }
  }
  const nodes = faseEStatus(selesai);
  const active = nodes.find((n) => n.status === "active") ?? nodes[0];
  return { id: active.id, judul: active.judul, soal: active.soal, xp: active.xp };
}
