// Otak murid AI mode CADANGAN (luring / API belum aktif) + tipe inti sesi Ajari.
// Dipisah dari app/(app)/ajari/page.tsx agar halaman fokus ke UI chat. Rapor & balasan
// diturunkan dari transkrip (bukan angka tetap) supaya tak terlihat dibuat-buat saat offline.
import { looksLikeMath } from "./math-text";

export type Mood = "happy" | "curious" | "oops";
export type Msg = { from: "murid" | "kamu"; text: string };

export type RaporData = {
  mastery: number;
  konsep: { label: string; level: "good" | "mid" | "weak"; pct: number }[];
  kuat: string;
  lemah: string;
  rekomendasi: string;
};

// Murid AI: pakai Gemini atau engine LOKAL deterministik (tanpa API/kuota)?
// true = Gemini (butuh GEMINI_API_KEY aktif di server). Bila semua key gagal/kuota habis,
// route balas {fallback:true} → klien otomatis jatuh ke engine lokal, jadi demo tetap aman.
export const PAKAI_GEMINI: boolean = true;

// Balasan cadangan murid (kalau API belum aktif / kuota habis / offline). Sadar-konten: hanya
// "paham" bila penjelasan guru terlihat seperti langkah matematika nyata, tak memaksa understood.
export function fallbackReply(
  teacherText: string,
  kamuTurns: number,
): { text: string; mood: Mood; understood: boolean } {
  if (!looksLikeMath(teacherText)) {
    return { text: "Hmm, itu kayaknya belum nyambung sama soalnya 😅 Coba jelaskan langkahnya pakai angka ya?", mood: "curious", understood: false };
  }
  if (kamuTurns >= 3) {
    return { text: "Ahh, sekarang aku paham alurnya! Makasih ya 🌟", mood: "happy", understood: true };
  }
  if (kamuTurns === 2) {
    return { text: "Oke mulai kebayang… lanjut ke langkah berikutnya gimana?", mood: "curious", understood: false };
  }
  return { text: "Ooh gitu, aku ikuti dulu langkahmu… terus habis itu apa?", mood: "curious", understood: false };
}

// Rapor cadangan (mode luring): DITURUNKAN dari transkrip, bukan angka tetap.
export function fallbackRapor(messages: Msg[]): RaporData {
  const teacher = messages.filter((m) => m.from === "kamu");
  const turns = teacher.length;
  const joined = teacher.map((m) => m.text).join(" ").toLowerCase();
  const hasNum = /[0-9]/.test(joined);
  const hasOp =
    /[+\-×÷*/=^√]/.test(joined) ||
    /(bagi|kali|tambah|kurang|pangkat|akar|pindah|ruas|jumlah|faktor|sederhana|langkah)/.test(joined);
  const richness = (hasNum ? 1 : 0) + (hasOp ? 1 : 0); // 0..2
  const substantive = turns && joined.length / turns >= 12 ? 1 : 0;
  // Skor dari ISI, bukan sekadar jumlah giliran: teks acak ("asdf") mendarat di zona lemah.
  const mastery = Math.max(28, Math.min(90, Math.round(28 + richness * 18 + substantive * 6 + Math.min(turns, 3) * 3)));
  const rendah = mastery < 50;
  const lv = (n: number): "good" | "mid" | "weak" => (n >= 75 ? "good" : n >= 55 ? "mid" : "weak");
  return {
    mastery,
    konsep: [
      { label: "Pemahaman konsep", level: lv(mastery + 6), pct: Math.min(95, mastery + 6) },
      { label: "Ketepatan langkah", level: lv(mastery - 10), pct: Math.max(20, mastery - 10) },
      { label: "Verifikasi jawaban", level: lv(mastery), pct: Math.min(92, mastery + 2) },
    ],
    kuat: rendah
      ? "Kamu sudah mau mencoba menjelaskan, itu langkah awal yang bagus."
      : "Kamu menuntun murid dengan langkah yang cukup runtut.",
    lemah: rendah
      ? "Penjelasannya belum terlihat sebagai langkah matematika yang jelas, coba pakai angka & operasi yang konkret."
      : "Beberapa langkah masih bisa dijelaskan lebih detail agar murid makin yakin.",
    rekomendasi: "Ulangi bagian yang tadi kurang jelas, lalu coba ajarkan lagi.",
  };
}

export function toHistory(messages: Msg[]) {
  // buang sapaan pembuka (index 0) agar transkrip diawali giliran "user"
  return messages.slice(1).map((m) => ({
    role: m.from === "kamu" ? ("user" as const) : ("model" as const),
    text: m.text,
  }));
}
