// Progres belajar NYATA, disimpan di perangkat (localStorage), tanpa wajib login.
// Bikin menu Belajar tidak lagi statik: topik yang tuntas tersimpan, XP nambah,
// node berikutnya kebuka, dan lanjut lagi tiap dibuka.

import type { AvatarSpec } from "./avatar";

export type RiwayatItem = { id: string; judul: string; at: number };
export type Progress = {
  selesai: string[];
  xp: number;
  riwayat?: RiwayatItem[];
  koreksi?: number; // jumlah miskonsepsi murid AI yang berhasil kamu koreksi (metrik USP)
  latihan?: string[]; // topik yang sudah dilatih via mode Course (BUKAN dikuasai, mastery tetap milik Ajari)
  materi?: string[]; // topik yang tahap MATERI-nya (baca + pilihan ganda) sudah tuntas di peta petualangan
};

// Mulai dari awal (belum ada topik yang tuntas). Progres tersimpan saat kamu mengajar.
const SEED: Progress = { selesai: [], xp: 0, riwayat: [], koreksi: 0, latihan: [], materi: [] };

const KEY = "ajari-aku:progress";

export function loadProgress(): Progress {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return SEED;
    const p = JSON.parse(raw) as Partial<Progress>;
    return { selesai: p.selesai ?? [], xp: p.xp ?? 0, riwayat: p.riwayat ?? [], koreksi: p.koreksi ?? 0, latihan: p.latihan ?? [], materi: p.materi ?? [] };
  } catch {
    return SEED;
  }
}

function save(p: Progress) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* abaikan */
  }
}

// Tandai satu topik tuntas + tambah XP (idempoten: tidak dobel).
export function completeTopic(id: string, xp: number, judul = ""): Progress {
  const p = loadProgress();
  if (p.selesai.includes(id)) return p;
  const item: RiwayatItem = { id, judul: judul || id, at: Date.now() };
  // Spread ...p supaya field lain (koreksi, latihan) TIDAK ikut ter-reset saat topik tuntas.
  const next: Progress = {
    ...p,
    selesai: [...p.selesai, id],
    xp: p.xp + (xp || 0),
    riwayat: [item, ...(p.riwayat ?? [])].slice(0, 20),
  };
  save(next);
  return next;
}

export function isDone(id: string): boolean {
  return loadProgress().selesai.includes(id);
}

// Tandai topik sudah DILATIH (mode Course): beri XP (porsi kecil, < Ajari) + riwayat (nyalakan streak),
// TAPI JANGAN sentuh selesai[] (mastery tetap milik Ajari) atau koreksi. Idempoten per id.
export function completeLatihan(id: string, xp: number, judul = ""): Progress {
  const p = loadProgress();
  if ((p.latihan ?? []).includes(id)) return p;
  const item: RiwayatItem = { id: "latihan:" + id, judul: "Latihan: " + (judul || id), at: Date.now() };
  const next: Progress = {
    ...p,
    xp: p.xp + (xp || 0),
    riwayat: [item, ...(p.riwayat ?? [])].slice(0, 20),
    latihan: [...(p.latihan ?? []), id],
  };
  save(next);
  return next;
}

export function isLatihanDone(id: string): boolean {
  return (loadProgress().latihan ?? []).includes(id);
}

// Tahap MATERI (baca + pilihan ganda) tuntas di peta, kredit XP porsi, idempoten per topik.
export function completeMateri(id: string, xp: number, judul = ""): Progress {
  const p = loadProgress();
  if ((p.materi ?? []).includes(id)) return p;
  const item: RiwayatItem = { id: "materi:" + id, judul: "Materi: " + (judul || id), at: Date.now() };
  const next: Progress = {
    ...p,
    xp: p.xp + (xp || 0),
    riwayat: [item, ...(p.riwayat ?? [])].slice(0, 20),
    materi: [...(p.materi ?? []), id],
  };
  save(next);
  return next;
}
export function isMateriDone(id: string): boolean {
  return (loadProgress().materi ?? []).includes(id);
}

// Tambah 1 ke penghitung "miskonsepsi dikoreksi" (dipakai saat murid AI yang tadi keliru
// akhirnya paham setelah dikoreksi guru). Mengembalikan total terbaru.
export function bumpKoreksi(): number {
  const p = loadProgress();
  const total = (p.koreksi ?? 0) + 1;
  save({ ...p, koreksi: total });
  return total;
}

// Tambah XP ke total TANPA menandai topik selesai, dipakai untuk kredit XP per-TAHAPAN
// (biar berhenti di tengah sesi tetap dapat XP tahapan yang sudah tuntas). "Dikuasai" tetap
// di-set oleh completeTopic saat semua tahapan beres.
export function addXp(xp: number): Progress {
  const p = loadProgress();
  const next: Progress = { ...p, xp: p.xp + (xp || 0) };
  save(next);
  return next;
}

// Level dari XP (50 XP = 1 level).
export function levelInfo(xp: number) {
  const per = 50;
  const level = Math.floor(xp / per) + 1;
  const into = xp % per;
  return { level, into, need: per, pct: Math.round((into / per) * 100) };
}

export function lessonsDone(): number {
  return loadProgress().selesai.length;
}

export function recentActivities(): RiwayatItem[] {
  return (loadProgress().riwayat ?? []).slice(0, 6);
}

const DAY = 86400000;

// Streak NYATA: jumlah hari beruntun mengajar (toleransi 1 hari kalau belum ngajar hari ini).
export function streakDays(riwayat: Progress["riwayat"]): number {
  if (!riwayat || !riwayat.length) return 0;
  const days = new Set(
    riwayat.map((r) => {
      const d = new Date(r.at);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    }),
  );
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let anchor = today.getTime();
  if (!days.has(anchor)) anchor -= DAY; // belum ngajar hari ini → hitung dari kemarin
  let s = 0;
  while (days.has(anchor)) {
    s++;
    anchor -= DAY;
  }
  return s;
}

// Aktivitas per hari (untuk peta/heatmap NYATA): jumlah sesi tuntas per tanggal.
export function activityByDay(riwayat: Progress["riwayat"]): Map<number, number> {
  const m = new Map<number, number>();
  for (const r of riwayat ?? []) {
    const d = new Date(r.at);
    d.setHours(0, 0, 0, 0);
    const k = d.getTime();
    m.set(k, (m.get(k) ?? 0) + 1);
  }
  return m;
}

// Sesi aktif: topik yang sedang diajarkan (Belajar → Ajari)

export type Sesi = {
  id: string;
  judul: string;
  soal: string;
  soalList?: string[]; // 5 soal topik (kalau ada di bank soal) → diajarkan berurutan
  topik: string;
  xp: number;
  muridId?: string; // id murid Ruang Kelas (untuk kreditkan progres per-murid)
  muridNama?: string; // identitas murid dari Ruang Kelas (kalau sesi dimulai dari sana)
  muridAvatar?: AvatarSpec;
};

const SESI_KEY = "ajari-aku:sesi";

export function setSesi(s: Sesi) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SESI_KEY, JSON.stringify(s));
  } catch {
    /* abaikan */
  }
}

export function getSesi(): Sesi | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESI_KEY);
    return raw ? (JSON.parse(raw) as Sesi) : null;
  } catch {
    return null;
  }
}

// Bersihkan sesi tersimpan (dipanggil setelah sesi tuntas) supaya kunjungan /ajari
// berikutnya lewat nav tidak me-resume topik yang sudah selesai.
export function clearSesi() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(SESI_KEY);
  } catch {
    /* abaikan */
  }
}
