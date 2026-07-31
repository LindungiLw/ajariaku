// Mode "Course" / Latihan Kilat, merakit sesi latihan AKTIF dari data yang SUDAH ADA
// (materi.contoh → langkah, rumus, bank-soal.jawaban). Tanpa mengarang konten/distraktor.
// buildKursus(id) menghasilkan urutan Kartu; kartu yang datanya tak cukup dilewati (degradasi anggun).

import { materiById } from "./materi";
import { topikById } from "./bank-soal";
import { parseContoh, intiKalimat } from "./materi-parse";

export type Kartu =
  | { tipe: "konsep"; judul: string; rumus: string[]; inti: string }
  | { tipe: "susun"; soal: string; langkah: string[] } // langkah dalam urutan BENAR
  | { tipe: "nextstep"; sudah: string[]; benar: string; distraktor: string[] }
  | { tipe: "isian"; soal: string; jawaban: string; kunci: string; pembahasan: string }
  | { tipe: "pilgan"; soal: string; benar: string; distraktor: string[]; pembahasan: string };

type Blok = { soal: string; langkah: string[] };

// Kelompokkan langkah per blok "CONTOH N" (WAJIB, biar puzzle tak campur antar-contoh).
function blokContoh(contoh: string): Blok[] {
  const segs = parseContoh(contoh);
  if (!segs) return [];
  const bloks: Blok[] = [];
  let cur: Blok | null = null;
  for (const s of segs) {
    if (s.t === "contoh") {
      cur = { soal: s.text.replace(/^contoh\s*\d+\s*[:.)\-]?\s*/i, "").trim(), langkah: [] };
      bloks.push(cur);
    } else if (s.t === "soal") {
      if (cur && cur.langkah.length === 0) cur.soal = [cur.soal, s.text].filter(Boolean).join(" ");
      else {
        cur = { soal: s.text, langkah: [] };
        bloks.push(cur);
      }
    } else if (s.t === "langkah") {
      if (!cur) {
        cur = { soal: "", langkah: [] };
        bloks.push(cur);
      }
      cur.langkah.push(s.text);
    }
    // 'teks' (kesimpulan/catatan) diabaikan untuk puzzle
  }
  return bloks.filter((b) => b.langkah.length >= 2);
}

// Jawaban "isian-able": angka (opsional pecahan) + satuan kata pendek → bisa dicocokkan numerik.
function isianable(jawaban: string): boolean {
  const j = jawaban.trim();
  return /\d/.test(j) && j.length <= 16 && /^-?\d[\d.,/\s]*\s*[a-zA-Z]{0,10}$/.test(j);
}
// Inti jawaban untuk pencocokan longgar (buang spasi/satuan, samakan koma→titik).
export function jawabInti(s: string): string {
  const m = s.replace(/\s+/g, "").toLowerCase().match(/-?\d+([.,/]\d+)?/);
  return m ? m[0].replace(",", ".") : s.replace(/\s+/g, "").toLowerCase();
}

export function buildKursus(id: string): Kartu[] {
  const m = materiById(id);
  if (!m) return [];
  const bt = topikById(id);
  const kartu: Kartu[] = [];

  // 1) Konsep kilat (pemanasan, bukan dinding teks)
  kartu.push({ tipe: "konsep", judul: bt?.judul ?? "", rumus: m.rumus ?? [], inti: intiKalimat(m.konten) });

  const bloks = blokContoh(m.contoh);

  // 2) Susun langkah, sampai 2 blok (panjang 2-6 langkah)
  for (const b of bloks.filter((x) => x.langkah.length >= 2 && x.langkah.length <= 6).slice(0, 2)) {
    kartu.push({ tipe: "susun", soal: b.soal, langkah: b.langkah });
  }

  // 3) Pilih langkah berikutnya, dari blok ≥3 langkah (distraktor = langkah lain yang NYATA)
  const ns = bloks.find((b) => b.langkah.length >= 3);
  if (ns) {
    const k = Math.min(2, ns.langkah.length - 2); // tampil langkah 0..k-1, tanya langkah ke-k
    const benar = ns.langkah[k];
    // Distraktor = langkah SETELAH k (belum ditampilkan). Jangan pakai langkah 0..k-1 yang sudah
    // tampil sebagai "selesai", itu bikin jawaban benar jadi satu-satunya opsi baru (soal trivial).
    const distraktor = ns.langkah.filter((_, i) => i > k).slice(0, 2);
    if (distraktor.length >= 1) kartu.push({ tipe: "nextstep", sudah: ns.langkah.slice(0, k), benar, distraktor });
  }

  // 4) Isian singkat, jawaban numerik dari bank-soal (maks 1; sisanya lewat pilihan ganda)
  const dipakai = new Set<string>();
  if (bt) {
    for (const s of bt.soal.filter((so) => isianable(so.jawaban)).slice(0, 1)) {
      dipakai.add(s.soal);
      kartu.push({ tipe: "isian", soal: s.soal, jawaban: s.jawaban, kunci: jawabInti(s.jawaban), pembahasan: s.pembahasan });
    }
  }

  // 5) Pilihan ganda, soal + distraktor = jawaban soal LAIN di topik ini (NYATA, bukan dikarang).
  if (bt) {
    const pool = [...new Set(bt.soal.map((s) => s.jawaban.trim()))].filter((j) => j.length >= 1 && j.length <= 22);
    const kandidat = bt.soal.filter((s) => !dipakai.has(s.soal) && s.jawaban.trim().length <= 22);
    kandidat.slice(0, 2).forEach((s, ci) => {
      const benar = s.jawaban.trim();
      const others = pool.filter((x) => jawabInti(x) !== jawabInti(benar));
      const rot = [...others.slice(ci), ...others.slice(0, ci)]; // geser mulai → distraktor beda tiap kartu
      const distraktor = rot.slice(0, 3);
      if (distraktor.length >= 2) {
        kartu.push({ tipe: "pilgan", soal: s.soal, benar, distraktor, pembahasan: s.pembahasan });
      }
    });
  }

  return kartu;
}

// Acak DETERMINISTIK (Fisher-Yates) dari seed string → urutan stabil: server === client.
// WAJIB untuk komponen yang bisa ter-SSR (opsi pilihan ganda, susun langkah). acak(Math.random)
// yang lama bikin hydration mismatch karena server & client mengocok beda. Beda seed → beda urutan.
export function acakSeed<T>(arr: T[], seed: string): T[] {
  const a = [...arr];
  let h = 2166136261 >>> 0; // FNV-1a hash → uint32
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  const rand = () => {
    // mulberry32 PRNG, deterministik dari h
    h += 0x6d2b79f5;
    let t = h >>> 0;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
