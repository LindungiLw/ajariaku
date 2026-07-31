// Roster murid AI, TETAP, satu murid per bidang (buatan app). User HANYA edit nama & muka;
// tak bisa buat/hapus. localStorage menyimpan edit (nama/avatar) + progres (xp/selesai) per id.
import { CHAR_PRESET, type AvatarSpec } from "./avatar";

export type MuridKustom = {
  id: string;
  nama: string;
  avatar: AvatarSpec;
  kategori: string; // id kategori (lihat KATEGORI di lib/avatar)
  xp?: number; // progres murid ini sendiri
  selesai?: string[]; // topik yang sudah kamu ajarkan ke murid ini
};

const KEY = "ajari-aku:murid";

// ROSTER TETAP: 1 murid per bidang. Urutan = urutan tampil di Kelas. char = preset di lib/avatar.
// `karakter` = watak khas (untuk diselipkan ke prompt AI). Melekat ke slot/id, TAK diedit user.
export const ROSTER: { id: string; nama: string; kategori: string; char: string; karakter: string }[] = [
  { id: "pio", nama: "Pio", kategori: "aljabar", char: "pio", karakter: "ceria dan penasaran; suka menganggap soal seperti teka-teki dan mencari 'pola rahasia'-nya" },
  { id: "nara", nama: "Nara", kategori: "bilangan", char: "nara", karakter: "teliti dan hati-hati; suka menghitung ulang dan sering memastikan 'bener nggak ya hitunganku?'" },
  { id: "geo", nama: "Geo", kategori: "geometri", char: "geo", karakter: "visual dan imajinatif; suka membayangkan atau menggambar bentuknya dulu sebelum menghitung" },
  { id: "tari", nama: "Tari", kategori: "trigonometri", char: "tari", karakter: "energik dan ceria; suka pola berulang, sudut, dan hal yang berirama" },
  { id: "dita", nama: "Dita", kategori: "data", char: "dita", karakter: "rasa ingin tahunya besar; suka contoh nyata sehari-hari dan bertanya 'kenapa' serta 'berapa banyak'" },
  { id: "kalvin", nama: "Kalvin", kategori: "kalkulus", char: "kalvin", karakter: "tenang dan analitis; suka memecah masalah jadi langkah-langkah kecil yang rapi" },
];

export const UTAMA_ID = "pio"; // murid utama (dari Profil Pengajar) = Pio (bidang Aljabar)

// Watak khas murid untuk prompt AI. Melekat ke id (bukan state per-instance). Default → Pio.
export function karakterForMurid(id?: string): string {
  return (ROSTER.find((x) => x.id === id) ?? ROSTER[0]).karakter;
}

function presetOf(char: string): AvatarSpec {
  return CHAR_PRESET[char as keyof typeof CHAR_PRESET] ?? CHAR_PRESET.pio;
}

// Murid dasar untuk satu kategori, DETERMINISTIK (tanpa localStorage) → aman dipakai di render/SSR.
export function baseMuridForKategori(kat: string): MuridKustom {
  const r = ROSTER.find((x) => x.kategori === kat) ?? ROSTER[0];
  return { id: r.id, nama: r.nama, kategori: r.kategori, avatar: presetOf(r.char) };
}

function baseRoster(): MuridKustom[] {
  return ROSTER.map((r) => ({ id: r.id, nama: r.nama, kategori: r.kategori, avatar: presetOf(r.char) }));
}

// Roster tetap + timpa edit user (nama/avatar) & progres (xp/selesai) per id.
export function loadMurid(): MuridKustom[] {
  const base = baseRoster();
  if (typeof window === "undefined") return base;
  const saved: Record<string, Partial<MuridKustom>> = {};
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const arr = JSON.parse(raw) as MuridKustom[];
      if (Array.isArray(arr)) for (const m of arr) if (m && m.id) saved[m.id] = m;
    }
  } catch {
    /* abaikan bila storage diblokir */
  }
  return base.map((b) => {
    const s = saved[b.id];
    if (!s) return b;
    return {
      ...b,
      nama: (s.nama ?? "").trim() || b.nama,
      avatar: s.avatar ?? b.avatar,
      xp: s.xp ?? b.xp,
      selesai: s.selesai ?? b.selesai,
    };
  });
}

export function saveMurid(list: MuridKustom[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* abaikan */
  }
}

// Edit satu murid, HANYA nama & avatar (roster tetap: kategori/id tak berubah).
export function updateMurid(id: string, patch: { nama?: string; avatar?: AvatarSpec }): MuridKustom[] {
  const next = loadMurid().map((m) =>
    m.id === id
      ? { ...m, nama: patch.nama !== undefined ? patch.nama.trim() || m.nama : m.nama, avatar: patch.avatar ?? m.avatar }
      : m,
  );
  saveMurid(next);
  return next;
}

// Sinkron murid utama (Pio) dari Profil Pengajar → update nama & avatar si "pio".
export function syncMuridUtama(nama: string, char: string) {
  updateMurid(UTAMA_ID, { nama: nama.trim() || "Pio", avatar: presetOf(char) });
}

// Murid yang mengampu satu bidang/kategori (baca localStorage → pakai di effect/handler, bukan render awal).
export function muridForKategori(kat: string): MuridKustom {
  const list = loadMurid();
  return list.find((m) => m.kategori === kat) ?? list[0];
}

// Kreditkan hasil sesi ke SATU murid (saat Ajari topik tuntas). Idempoten per (murid, topik).
export function creditMurid(id: string, topikId: string, xp: number) {
  const list = loadMurid();
  let changed = false;
  const next = list.map((m) => {
    if (m.id !== id) return m;
    const selesai = m.selesai ?? [];
    if (selesai.includes(topikId)) return m;
    changed = true;
    return { ...m, selesai: [...selesai, topikId], xp: (m.xp ?? 0) + (xp || 0) };
  });
  if (changed) saveMurid(next);
}

// Pangkat/gelar murid dari XP (level = floor(xp/50)+1, sama seperti levelInfo). Ambang sengaja jarang.
const PANGKAT: { min: number; nama: string }[] = [
  { min: 1, nama: "Murid Baru" },
  { min: 3, nama: "Murid Rajin" },
  { min: 5, nama: "Murid Cerdas" },
  { min: 8, nama: "Murid Teladan" },
  { min: 12, nama: "Murid Bintang" },
];

export function pangkatMurid(xp: number): { nama: string; level: number; tier: number } {
  const level = Math.floor((xp || 0) / 50) + 1;
  let tier = 0;
  for (let i = 0; i < PANGKAT.length; i++) if (level >= PANGKAT[i].min) tier = i;
  return { nama: PANGKAT[tier].nama, level, tier };
}

// Tambah XP ke satu murid TANPA menandai topik selesai, kredit per-TAHAPAN.
export function creditMuridXp(id: string, xp: number) {
  if (!xp) return;
  const list = loadMurid();
  let changed = false;
  const next = list.map((m) => {
    if (m.id !== id) return m;
    changed = true;
    return { ...m, xp: (m.xp ?? 0) + xp };
  });
  if (changed) saveMurid(next);
}
