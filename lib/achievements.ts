// Achievements / lencana, sebagian besar kebuka dari PROGRES NYATA (progress store).
// current(p) mengembalikan progres menuju target; unlocked saat current >= target.

import type { ComponentType } from "react";
import { Star, Medal, Trophy, Crown, Compass, Award, Zap, Flame, Search, GraduationCap, CalendarCheck } from "@/components/brand-icons";
import { duniaNodes } from "./dunia";
import { bankSoal } from "./bank-soal";
import { type Progress, streakDays } from "./progress";

// Peta key ikon → komponen lucide. SATU sumber kebenaran, dipakai halaman Progres & CelebrationHost
// (sebelumnya diduplikasi & sempat melenceng: 'sparkles' salah dipetakan ke Star di Progres).
export const ACH_ICON: Record<string, ComponentType<{ size?: number }>> = {
  star: Star, medal: Medal, trophy: Trophy, crown: Crown,
  compass: Compass, award: Award, zap: Zap, flame: Flame,
  search: Search, graduation: GraduationCap, calendar: CalendarCheck,
};

// Peta id topik -> bidang (untuk hitung keragaman bidang yang sudah diajarkan).
const BIDANG: Record<string, string> = {};
for (const n of duniaNodes) BIDANG[n.id] = n.bidang;
for (const t of bankSoal) BIDANG[t.id] = t.bidang;

function distinctBidang(p: Progress): number {
  const set = new Set<string>();
  for (const id of p.selesai) {
    const b = BIDANG[id];
    if (b) set.add(b);
  }
  return set.size;
}

// Konteks tambahan di luar Progress (mis. jumlah murid Ruang Kelas yang naik level).
export type AchCtx = { muridNaikLevel: number };

export type Achievement = {
  id: string;
  nama: string;
  desc: string;
  ikon: string; // key ikon (dipetakan ke lucide di komponen)
  warna: string;
  target: number;
  current: (p: Progress, c: AchCtx) => number;
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first", nama: "Guru Pertama", desc: "Selesaikan 1 sesi mengajar", ikon: "star", warna: "#f5a524", target: 1, current: (p) => p.selesai.length },
  { id: "five", nama: "Lima Pelajaran", desc: "Tuntaskan 5 topik", ikon: "medal", warna: "#1591dc", target: 5, current: (p) => p.selesai.length },
  { id: "ten", nama: "Sepuluh Pelajaran", desc: "Tuntaskan 10 topik", ikon: "trophy", warna: "#f5a524", target: 10, current: (p) => p.selesai.length },
  { id: "master", nama: "Master Matematika", desc: "Tuntaskan 20 topik", ikon: "crown", warna: "#2c5ead", target: 20, current: (p) => p.selesai.length },
  { id: "explorer", nama: "Penjelajah", desc: "Ngajar di 3 bidang berbeda", ikon: "compass", warna: "#22a06b", target: 3, current: distinctBidang },
  { id: "allround", nama: "Serba Bisa", desc: "Ngajar di 5 bidang berbeda", ikon: "award", warna: "#e05299", target: 5, current: distinctBidang },
  { id: "xp500", nama: "Kolektor XP", desc: "Kumpulkan 500 XP", ikon: "zap", warna: "#e7b008", target: 500, current: (p) => p.xp },
  { id: "streak", nama: "Rajin Belajar", desc: "Belajar 7 hari beruntun", ikon: "flame", warna: "#e5484d", target: 7, current: (p) => streakDays(p.riwayat) },
  { id: "bossE", nama: "Juara Fase E", desc: "Lulus Ujian Fase E", ikon: "crown", warna: "#f5a524", target: 1, current: (p) => (p.selesai.includes("ujian-fase-e") ? 1 : 0) },
  // Lencana khas produk (protégé effect), hargai hal yang bikin app ini unik.
  { id: "detektif", nama: "Detektif Miskonsepsi", desc: "Koreksi 10 miskonsepsi murid AI", ikon: "search", warna: "#7c5cff", target: 10, current: (p) => p.koreksi ?? 0 },
  { id: "wali", nama: "Wali Kelas", desc: "Bimbing 5 murid naik level", ikon: "graduation", warna: "#22a06b", target: 5, current: (_p, c) => c.muridNaikLevel },
  { id: "konsisten", nama: "Konsisten", desc: "Belajar 30 hari beruntun", ikon: "calendar", warna: "#e05299", target: 30, current: (p) => streakDays(p.riwayat) },
];

export type EvaluatedAchievement = Achievement & {
  cur: number;
  unlocked: boolean;
  pct: number;
};

export function evalAchievements(p: Progress, ctx?: Partial<AchCtx>): EvaluatedAchievement[] {
  const c: AchCtx = { muridNaikLevel: ctx?.muridNaikLevel ?? 0 };
  return ACHIEVEMENTS.map((a) => {
    const cur = Math.min(a.current(p, c), a.target);
    return { ...a, cur, unlocked: cur >= a.target, pct: Math.round((cur / a.target) * 100) };
  });
}
