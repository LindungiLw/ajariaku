// Parser display-only untuk materi (dipakai halaman Belajar /belajar/materi & mode Course /kursus).
// Hanya MEMISAH teks yang sudah ada, tidak mengarang konten.

// Miskonsepsi bernomor → array butir; null bila pola tak terdeteksi (fallback teks utuh).
export function parseMiskonsepsi(str: string): string[] | null {
  const parts = str
    .split(/(?:^|\n)\s*(?:\d+[).]\s|Miskonsepsi\s*\d+[^:\n]*:\s*|Skenario\s*\d+[^:\n]*:\s*)/i)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length >= 2 ? parts : null;
}

// Pecah satu butir miskonsepsi jadi 3 bagian agar mudah dibaca:
//   salah = klaim keliru, koreksi = kenapa keliru/yang benar, contoh = contoh penyangkal/uji angka.
// Display-only & robust: bila penanda tak ada, seluruh teks jatuh ke `salah` (koreksi/contoh kosong).
export function pisahKeliru(text: string): { salah: string; koreksi: string; contoh: string } {
  const t = text.trim();
  const cM = t.match(/\b(Contoh penyangkal|Contoh|Uji cepat dengan angka|Uji cepat|Uji dengan angka|Cek dengan angka|Pemeriksaan)\s*:/i);
  let head = t;
  let contoh = "";
  if (cM && cM.index != null && cM.index > 20) {
    head = t.slice(0, cM.index).trim().replace(/[.,;\s]+$/, "");
    contoh = t.slice(cM.index + cM[0].length).trim();
  }
  const kM = head.match(/\b(Ini salah|Padahal|Justru|Yang benar|Seharusnya|Faktanya)\b[,:.]?\s+/i);
  let salah = head;
  let koreksi = "";
  if (kM && kM.index != null && kM.index > 10) {
    salah = head.slice(0, kM.index).trim().replace(/[.,;\s]+$/, "");
    koreksi = head.slice(kM.index + kM[0].length).trim();
  } else {
    // Tanpa penanda koreksi → KALIMAT PERTAMA jadi judul kesalahan (singkat, mudah dipindai),
    // sisanya jadi detail. Judul singkat jauh lebih enak dibaca daripada satu paragraf panjang.
    const dot = head.search(/\.\s+\S/);
    if (dot > 12 && dot < head.length - 15) {
      salah = head.slice(0, dot + 1).trim();
      koreksi = head.slice(dot + 1).trim();
    }
  }
  return { salah, koreksi, contoh };
}

// Contoh → segmen berstruktur (header contoh, soal, langkah, teks).
export type ContohSeg =
  | { t: "contoh"; text: string }
  | { t: "soal"; text: string }
  | { t: "langkah"; n: string; label: string; text: string }
  | { t: "teks"; text: string };

export function parseContoh(str: string): ContohSeg[] | null {
  const lines = str.split("\n").map((l) => l.trim()).filter(Boolean);
  const segs: ContohSeg[] = [];
  let seenLangkah = false;
  for (const line of lines) {
    if (/^contoh\s*\d+/i.test(line)) {
      segs.push({ t: "contoh", text: line });
      seenLangkah = false;
      continue;
    }
    const mL = line.match(/^langkah\s*(\d+)\s*(\([^)]*\))?\s*[:.]?\s*(.*)$/i);
    if (mL) {
      seenLangkah = true;
      segs.push({ t: "langkah", n: mL[1], label: mL[2] ?? "", text: mL[3] });
      continue;
    }
    segs.push({ t: seenLangkah ? "teks" : "soal", text: line });
  }
  return segs.some((s) => s.t === "langkah") ? segs : null;
}

// Kalimat inti (kalimat pertama konten) untuk briefing/kartu Konsep.
export function intiKalimat(konten: string): string {
  return (konten.match(/^[\s\S]*?\.(?=\s|$)/)?.[0] ?? konten).trim();
}
