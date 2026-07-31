// Memori belajar, disimpan di PERANGKAT siswa (localStorage), bukan di server.
// Tetap tanpa wajib login. Ringkasannya disuntik ke prompt tiap sesi supaya
// murid AI "ingat" kelemahan siswa & menyesuaikan pelajaran berikutnya.

// Tingkat penguasaan konsep (dipakai di memori & halaman Progres).
export type MasteryLevel = "good" | "mid" | "weak";

export type Profil = {
  updatedAt: string;
  sesi: number;
  mastery: Record<string, { level: MasteryLevel; pct: number }>;
  weakest?: { konsep: string; pct: number };
  trend?: number[]; // rata-rata penguasaan per sesi, indikator refleksi/kemajuan mandiri (skor dari penilaian LLM per-sesi, BUKAN asesmen tervalidasi)
};

// Memori GLOBAL (agregat lintas murid) di KEY_BASE; memori PER-MURID di `${KEY_BASE}:<muridId>`.
// Global tetap dipakai Progres/Beranda (gambaran menyeluruh); per-murid dipakai prompt tiap murid
// supaya "ingatan setiap kelas": Nara ingat sesinya sendiri, terpisah dari Kalvin.
const KEY_BASE = "ajari-aku:profil";
const keyFor = (muridId?: string) => (muridId ? `${KEY_BASE}:${muridId}` : KEY_BASE);

export function loadProfil(muridId?: string): Profil | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(keyFor(muridId));
    return raw ? (JSON.parse(raw) as Profil) : null;
  } catch {
    return null;
  }
}

export function saveProfil(p: Profil, muridId?: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(keyFor(muridId), JSON.stringify(p));
  } catch {
    /* storage penuh / diblokir: abaikan, memori bersifat opsional */
  }
}

export function clearProfil() {
  // Reset SEMUA memori: global + tiap murid (semua kunci berawalan KEY_BASE).
  if (typeof window === "undefined") return;
  try {
    const hapus: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && (k === KEY_BASE || k.startsWith(KEY_BASE + ":"))) hapus.push(k);
    }
    for (const k of hapus) window.localStorage.removeItem(k);
  } catch {
    /* abaikan */
  }
}

type RaporLike = {
  mastery: number;
  konsep: { label: string; level: MasteryLevel; pct: number }[];
};

// Perbarui memori dari hasil Rapor Sesi terbaru.
// Berapa konsep TERBARU yang disimpan di memori. Rapor Gemini memberi label bebas per-topik, jadi
// tanpa batas peta mastery menumpuk konsep lama yang tak pernah diulang → "weakest" & prompt jadi
// basi selamanya. Menyimpan hanya yang terbaru membuat memori mencerminkan penguasaan KINI.
const MASTERY_KEEP = 16;

function applyRapor(rapor: RaporLike, muridId?: string): Profil {
  const prev = loadProfil(muridId);
  const mastery = { ...(prev?.mastery ?? {}) };
  for (const k of rapor.konsep) {
    delete mastery[k.label]; // hapus dulu → entri yang diperbarui pindah ke posisi TERBARU (urutan sisip)
    mastery[k.label] = { level: k.level, pct: k.pct };
  }
  // Pangkas ke konsep paling baru (ekor urutan sisip) agar label lama luruh & tak menyetir 'weakest'.
  const keys = Object.keys(mastery);
  const recent: Profil["mastery"] = {};
  for (const key of keys.slice(-MASTERY_KEEP)) recent[key] = mastery[key];

  let weakest: Profil["weakest"];
  for (const [konsep, v] of Object.entries(recent)) {
    if (!weakest || v.pct < weakest.pct) weakest = { konsep, pct: v.pct };
  }

  // Rata-rata penguasaan saat ini → dicatat sebagai indikator refleksi antar-sesi (bukan learning-gain tervalidasi).
  const vals = Object.values(recent);
  const avg = vals.length ? Math.round(vals.reduce((s, v) => s + v.pct, 0) / vals.length) : 0;
  const trend = [...(prev?.trend ?? []), avg].slice(-12);

  const p: Profil = {
    updatedAt: new Date().toISOString(),
    sesi: (prev?.sesi ?? 0) + 1,
    mastery: recent,
    weakest,
    trend,
  };
  saveProfil(p, muridId);
  return p;
}

// Perbarui memori dari Rapor terbaru: SELALU global (agregat → dipakai Progres/Beranda) + (bila ada)
// memori murid ini. Balikan = memori relevan untuk UI (per-murid bila ada; jika tidak, global).
export function recordRapor(rapor: RaporLike, muridId?: string): Profil {
  const global = applyRapor(rapor);
  return muridId ? applyRapor(rapor, muridId) : global;
}

// Sapaan pembuka yang menyuarakan ingatan sesi lalu; null bila belum ada memori.
export function sapaanMemori(
  p: Profil | null,
  sap: string,
  soal: string,
): string | null {
  if (!p || p.sesi <= 0) return null;
  const sesiKe = p.sesi + 1;
  const w = p.weakest;
  const ingat = w
    ? `Aku masih ingat kemarin aku belum pede soal ${w.konsep}.`
    : "Aku udah nggak sabar diajari lagi.";
  return `Halo lagi, ${sap}! Ini sesi ke-${sesiKe} kita bareng 🦉 ${ingat} Sekarang bantu aku ${soal} ya, kalau aku keliru, betulkan sampai paham.`;
}

// Ringkasan untuk disuntik ke prompt AI (dan bisa dipakai di UI).
export function profilSummary(p: Profil | null): string {
  if (!p || Object.keys(p.mastery).length === 0) return "";
  const parts = Object.entries(p.mastery)
    .sort((a, b) => a[1].pct - b[1].pct)
    .map(([k, v]) => `${k}: ${v.pct}% (${v.level})`);
  const weak = p.weakest ? ` Prioritas perbaikan: ${p.weakest.konsep}.` : "";
  return `Siswa sudah menjalani ${p.sesi} sesi. Penguasaan konsep: ${parts.join(
    "; ",
  )}.${weak}`;
}
