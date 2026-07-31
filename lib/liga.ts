// Liga/Tier: peringkat berbasis XP milikmu sendiri (LOKAL, jujur, tanpa backend).
// Bukan membandingkan dengan user lain (itu butuh server & melanggar prinsip tanpa wajib login).
// Leaderboard global antar-pengguna = roadmap opsional & anonim (lihat proposal).

export type Tier = { nama: string; min: number; warna: string };

export const TIERS: Tier[] = [
  { nama: "Perunggu", min: 0, warna: "#b06a3b" },
  { nama: "Perak", min: 200, warna: "#8a97a8" },
  { nama: "Emas", min: 400, warna: "#e7b008" },
  { nama: "Platina", min: 700, warna: "#2bb6c9" },
  { nama: "Berlian", min: 1000, warna: "#4bb8fa" },
];

export function tierOf(xp: number): Tier {
  let t = TIERS[0];
  for (const x of TIERS) if (xp >= x.min) t = x;
  return t;
}

export function nextTier(xp: number): Tier | null {
  return TIERS.find((t) => t.min > xp) ?? null;
}
