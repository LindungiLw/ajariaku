// Murid AI LOKAL, deterministik, TANPA Gemini. Supaya app jalan penuh tanpa API key/kuota.
// Alur: murid mencoba lalu bikin 1 kesalahan khas (dari miskonsepsi topik) -> guru mengoreksi
// -> murid paham. Topik yang belum di-skrip pakai alur generik yang tetap punya momen koreksi.
// Kesalahan sengaja di level KONSEP (bukan angka spesifik) agar cocok untuk soal apa pun di topik.

import { looksLikeMath } from "./math-text";

export type MoodLokal = "happy" | "curious" | "oops";

type Skrip = {
  keliru: string; // ucapan murid saat mencoba lalu KELIRU (mood oops)
  koreksiKunci: string[]; // kata/simbol yang menandai guru mengoreksi dengan benar
  paham: string; // ucapan murid setelah dikoreksi benar (mood happy, understood)
};

export const skripMurid: Record<string, Skrip> = {
  "eksponen-logaritma": {
    keliru: "Ooh aku ikutin… tapi kalau basisnya sama terus DIBAGI, pangkatnya ikut dibagi juga kan Kak? Kayak 8 dibagi 4 gitu? 🤔",
    koreksiKunci: ["kurang", "dikurang", "minus", "-", "selisih"],
    paham: "Ahh iya! Kalau dibagi, pangkatnya DIKURANG bukan dibagi. Sekarang aku paham, makasih Kak! 🌟",
  },
  "barisan-deret": {
    keliru: "Berarti suku ke-10 itu a ditambah 10 kali beda ya Kak? (Un = a + n·b) 🤔",
    koreksiKunci: ["(n-1)", "n-1", "n - 1", "kurang 1", "9", "dikurang", "satu langkah", "langkah"],
    paham: "Ohh, dari suku ke-1 ke suku ke-10 cuma 9 langkah, jadi Un = a + (n-1)·b. Paham sekarang! 🌟",
  },
  "spltv": {
    keliru: "Aku udah dapat y = 3 nih Kak, berarti udah selesai dong jawabannya? 🤔",
    koreksiKunci: ["x", "z", "tiga", "3", "ketiga", "tripel", "belum", "substitusi", "lengkap"],
    paham: "Oh iya, jawaban SPLTV harus lengkap (x, y, z), belum selesai kalau baru satu variabel. Makasih Kak! 🌟",
  },
  "fungsi-kuadrat": {
    keliru: "Sumbu simetrinya x = b/(2a) kan Kak? 🤔",
    koreksiKunci: ["-b", "min b", "minus", "negatif", "-"],
    paham: "Ahh, ada tanda minusnya: x = -b/(2a). Sekarang jelas, makasih Kak! 🌟",
  },
  "perbandingan-trigonometri": {
    keliru: "Jadi sin itu sisi miring dibagi sisi depan ya Kak? 🤔",
    koreksiKunci: ["depan", "miring", "kebalik", "terbalik", "depan/miring", "depan per miring"],
    paham: "Ooh kebalik ya, sin = depan/miring. Makanya nilainya nggak mungkin lebih dari 1. Paham! 🌟",
  },
  "smp-d-bilangan": {
    keliru: "2³ × 2² itu 2⁶ kan Kak? (pangkatnya dikali) 🤔",
    koreksiKunci: ["jumlah", "tambah", "dijumlah", "+", "ditambah", "2⁵", "2^5", "lima", "5"],
    paham: "Ahh, basis sama kalau DIKALI pangkatnya DIJUMLAH, jadi 2⁵. Paham sekarang, makasih Kak! 🌟",
  },
  "smp-d-aljabar": {
    keliru: "5a + 3 itu bisa digabung jadi 8a kan Kak? 🤔",
    koreksiKunci: ["sejenis", "beda", "tidak", "nggak bisa", "variabel", "tetap", "5a + 3", "5a+3"],
    paham: "Oh iya, 5a dan 3 bukan suku sejenis, jadi tetap 5a + 3. Makasih Kak! 🌟",
  },
  "sd-a-bilangan-100": {
    keliru: "Berarti 19 lebih besar dari 21 ya Kak? Kan 9 lebih besar dari 1 🤔",
    koreksiKunci: ["puluhan", "puluh", "dua puluh", "lihat puluhan", "21", "2"],
    paham: "Ohh, lihat puluhannya dulu ya! 21 punya 2 puluhan, jadi 21 lebih besar. Paham Kak! 🌟",
  },
  "sd-a-penjumlahan": {
    keliru: "Kalau satuannya dijumlah lebih dari 9, misal 7 + 5 = 12, aku tulis 12 di kolom satuan aja ya Kak? 🤔",
    koreksiKunci: ["simpan", "simpanan", "puluhan", "satu angka", "naik", "1 ke"],
    paham: "Ahh, tulis 2 aja terus SIMPAN 1 ke puluhan ya! Sekarang aku paham, makasih Kak! 🌟",
  },
  "sd-a-pengurangan": {
    keliru: "Kalau 32 − 17, satuannya 2 dikurang 7 nggak bisa, jadi dibalik 7 − 2 = 5 aja ya Kak? 🤔",
    koreksiKunci: ["pinjam", "minjam", "meminjam", "puluhan", "12", "15", "nggak boleh", "tidak boleh"],
    paham: "Ahh, nggak boleh dibalik, harus MINJAM 1 puluhan dulu jadi 12 − 7 = 5. Hasilnya 15. Makasih Kak! 🌟",
  },
};

export type MuridState = { salahSudah: boolean; nudge: number; selesai: boolean };
export function newMuridState(): MuridState {
  return { salahSudah: false, nudge: 0, selesai: false };
}

export type HasilLokal = { reply: string; mood: MoodLokal; understood: boolean; dikoreksi: boolean };

// Cocokkan kata kunci koreksi (longgar): case-insensitive substring.
function kenaKoreksi(teks: string, kunci: string[]): boolean {
  const t = teks.toLowerCase();
  return kunci.some((k) => t.includes(k.toLowerCase()));
}

// Suara khas tiap murid untuk mode luring (tanpa Gemini); kunci = id murid.
// Baris miskonsepsi topik tetap dari skripMurid.
type Persona = {
  keliru: string; // percobaan pertama keliru (topik tanpa skrip)
  nudge: string; // masih bingung, minta diulang
  paham: string; // setelah dikoreksi benar (topik tanpa skrip)
  ngaco: string; // input guru bukan matematika
};
const PERSONA_LOKAL: Record<string, Persona> = {
  pio: {
    keliru: "Ooh aku ikutin… tapi kayaknya ada satu pola yang aku salah tangkap deh Kak, coba cek lagi? 🤔",
    nudge: "Hmm, polanya masih belum ketemu nih Kak, tunjukin lagi pelan-pelan? 🤔",
    paham: "Ahh, ketemu polanya sekarang! Aku paham, makasih Kak! 🌟",
    ngaco: "Waduh, itu belum kayak petunjuk soalnya Kak 😅 Coba pakai angka biar aku bisa cari polanya?",
  },
  nara: {
    keliru: "Aku udah coba, tapi pas kuhitung ulang kok hasilnya masih ganjil ya Kak? Kayaknya ada yang keliru 🤔",
    nudge: "Aku hitung ulang kok masih beda ya Kak, coba kita cek bareng pelan-pelan? 😅",
    paham: "Oke, sekarang hitunganku udah pas dan cocok. Makasih Kak, aku paham! 🌟",
    ngaco: "Hmm, aku belum bisa menghitungnya dari situ Kak 😅 Boleh pakai angka yang jelas?",
  },
  geo: {
    keliru: "Aku coba gambar dulu… tapi bentuknya kok jadi aneh ya Kak, kayaknya ada yang salah kubayangin 🤔",
    nudge: "Gambarannya masih belum pas di kepalaku Kak, bantu jelasin bentuknya lagi? 🤔",
    paham: "Ooh, sekarang kebayang jelas gambarannya! Paham aku, makasih Kak! 🌟",
    ngaco: "Aku belum bisa membayangkannya dari itu Kak 😅 Coba tunjukin langkahnya ya?",
  },
  tari: {
    keliru: "Aku hampir dapat iramanya… eh tapi kayaknya satu langkah tadi meleset deh Kak? 🤔",
    nudge: "Dikit lagi ketemu iramanya Kak, satu langkah lagi tunjukin ya! 😄",
    paham: "Yes, ketemu polanya! Sekarang aku paham, makasih Kak! 🌟",
    ngaco: "Wah itu belum nyambung sama soalnya Kak 😅 Kasih langkah berangka dong?",
  },
  dita: {
    keliru: "Aku ikutin sih Kak, tapi kenapa hasilnya bisa gitu ya? Aku ngerasa ada yang belum pas 🤔",
    nudge: "Tapi kenapa begitu ya Kak? Aku masih penasaran, jelasin bagian itu lagi? 🤔",
    paham: "Ohh, jadi begitu alasannya! Sekarang aku paham, makasih Kak! 🌟",
    ngaco: "Hmm, itu belum menjawab soalnya Kak 😅 Coba pakai contoh berangka ya?",
  },
  kalvin: {
    keliru: "Aku pecah jadi langkah-langkah… tapi ada satu langkah yang belum klop nih Kak, coba cek? 🤔",
    nudge: "Kalau kuurutkan langkahnya, satu bagian masih belum masuk akal Kak, cek lagi ya?",
    paham: "Baik, sekarang tiap langkahnya rapi dan masuk akal. Aku paham, makasih Kak! 🌟",
    ngaco: "Langkah itu belum bisa kuurutkan jadi penyelesaian Kak 😅 Boleh pelan-pelan pakai angka?",
  },
};
function persona(muridId?: string): Persona {
  return PERSONA_LOKAL[muridId ?? ""] ?? PERSONA_LOKAL.pio;
}

// Respon murid lokal; st dimutasi per sesi. muridId memilih suara persona (null/solo -> Pio).
export function responLokal(topikId: string, teacherText: string, st: MuridState, muridId?: string): HasilLokal {
  const skrip = skripMurid[topikId];
  const p = persona(muridId);

  if (!skrip) {
    // Alur generik untuk topik yang belum di-skrip: tetap ada momen "murid keliru -> dikoreksi".
    if (!looksLikeMath(teacherText, 8)) {
      return { reply: p.ngaco, mood: "curious", understood: false, dikoreksi: false };
    }
    if (!st.salahSudah) {
      st.salahSudah = true;
      return { reply: p.keliru, mood: "oops", understood: false, dikoreksi: false };
    }
    if (!st.selesai) {
      st.selesai = true;
      return { reply: p.paham, mood: "happy", understood: true, dikoreksi: true };
    }
    return { reply: "Makasih Kak, udah jelas banget!", mood: "happy", understood: true, dikoreksi: false };
  }

  // Topik ber-skrip: miskonsepsi & "paham" spesifik topik (akurat); nada nudge ikut watak murid.
  if (!st.salahSudah) {
    st.salahSudah = true;
    return { reply: skrip.keliru, mood: "oops", understood: false, dikoreksi: false };
  }
  if (!st.selesai) {
    if (kenaKoreksi(teacherText, skrip.koreksiKunci) || st.nudge >= 2) {
      st.selesai = true;
      return { reply: skrip.paham, mood: "happy", understood: true, dikoreksi: true };
    }
    st.nudge += 1;
    return { reply: p.nudge, mood: "curious", understood: false, dikoreksi: false };
  }
  return { reply: "Makasih Kak, aku udah paham! 🌟", mood: "happy", understood: true, dikoreksi: false };
}
