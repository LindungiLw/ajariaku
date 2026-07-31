// "Dunia" = satu Fase pada peta petualangan. Fokus demo: SMA · Fase E (Kelas 10).
// Struktur ini siap-perluas ke Dunia lain (SD Fase A-C, SMP Fase D, SMA Fase F).
// Simpul & Boss Quiz disusun + diverifikasi kebenarannya lewat pipeline multi-agen.

export type NodeStatus = "done" | "active" | "locked";

export type DuniaNode = {
  id: string;
  judul: string;
  blurb: string;
  bidang: string;
  xp: number;
  status: NodeStatus;
  progress?: number; // 0..1 untuk yang aktif
  soal: string; // soal yang diajarkan saat topik ini dibuka
};

export const duniaMeta = {
  jenjang: "SMA",
  fase: "Fase E · Kelas 10",
  judul: "Petualangan Matematika",
};

export const duniaNodes: DuniaNode[] = [
  { id: "eksponen-logaritma", judul: "Eksponen & Logaritma", blurb: "Kuasai kekuatan angka berpangkat dan kebalikannya.", bidang: "Bilangan", xp: 45, status: "done", soal: "Sederhanakan 2^5 × 2^3 : 2^4" },
  { id: "barisan-deret", judul: "Barisan & Deret", blurb: "Temukan pola tersembunyi di balik deretan angka.", bidang: "Bilangan", xp: 50, status: "done", soal: "Barisan aritmetika 3, 7, 11, 15, ... Tentukan suku ke-10 (U₁₀)." },
  { id: "spltv", judul: "SPLTV", blurb: "Pecahkan tiga misteri sekaligus lewat tiga persamaan.", bidang: "Aljabar dan Fungsi", xp: 58, status: "done", soal: "Selesaikan SPLTV: x + y = 5, y + z = 7, x + z = 6. Cari x, y, z." },
  { id: "sptldv", judul: "SPtLDV", blurb: "Gambar daerah rahasia dengan sistem pertidaksamaan.", bidang: "Aljabar dan Fungsi", xp: 64, status: "active", progress: 0.4, soal: "Selesaikan pertidaksamaan linear: 3x − 5 < 10." },
  { id: "fungsi-kuadrat", judul: "Fungsi Kuadrat", blurb: "Naiki lengkung parabola dan taklukkan titik puncaknya.", bidang: "Aljabar dan Fungsi", xp: 70, status: "locked", soal: "Tentukan titik puncak fungsi f(x) = x² − 4x + 3." },
  { id: "perbandingan-trigonometri", judul: "Perbandingan Trigonometri", blurb: "Ukur sudut & sisi segitiga dengan sin, cos, tan.", bidang: "Trigonometri", xp: 76, status: "locked", soal: "Segitiga siku-siku: sisi depan sudut A = 3, sisi samping = 4. Tentukan sin A, cos A, tan A." },
  { id: "statistika-data-kelompok", judul: "Statistika Data Kelompok", blurb: "Baca cerita di balik tumpukan data.", bidang: "Data & Peluang", xp: 82, status: "locked", soal: "Data nilai: 4, 5, 6, 7, 8. Tentukan rata-rata (mean)-nya." },
  { id: "peluang", judul: "Peluang", blurb: "Hitung kemungkinan kejadian saling lepas & bebas.", bidang: "Data & Peluang", xp: 88, status: "locked", soal: "Dua dadu dilempar bersamaan. Berapa peluang jumlah kedua mata dadu = 7?" },
];

export const bossNode = {
  id: "ujian-fase-e",
  judul: "Ujian Fase E",
  xp: 200,
  open: true, // untuk demo: boss bisa dicoba (produksi: terbuka setelah 8/8)
};

export type QuizItem = {
  soal: string;
  opsi: string[];
  jawaban: number; // index opsi benar
  pembahasan: string;
};

export const bossQuiz: QuizItem[] = [
  {
    soal: "Nilai dari log 81 dengan basis 3 (ditulis ³log 81) adalah ...",
    opsi: ["3", "4", "5", "27"],
    jawaban: 1,
    pembahasan: "³log 81 menanyakan pangkat berapa dari 3 yang menghasilkan 81. Karena 3⁴ = 81, maka ³log 81 = 4.",
  },
  {
    soal: "Barisan aritmetika 3, 7, 11, 15, ... Suku ke-10 barisan tersebut adalah ...",
    opsi: ["36", "39", "40", "43"],
    jawaban: 1,
    pembahasan: "a = 3 dan beda b = 4. Un = a + (n−1)b, maka U₁₀ = 3 + 9(4) = 39.",
  },
  {
    soal: "Koordinat titik puncak dari fungsi kuadrat f(x) = x² − 4x + 3 adalah ...",
    opsi: ["(2, −1)", "(−2, −1)", "(2, 1)", "(−2, 1)"],
    jawaban: 0,
    pembahasan: "x = −b/(2a) = 4/2 = 2; f(2) = 4 − 8 + 3 = −1. Jadi puncaknya (2, −1).",
  },
  {
    soal: "Nilai dari sin 60° adalah ...",
    opsi: ["½√2", "½√3", "½", "⅓√3"],
    jawaban: 1,
    pembahasan: "Sudut istimewa: sin 60° = ½√3. (Bandingkan: cos 60° = ½, sin 45° = ½√2.)",
  },
  {
    soal: "Dua dadu dilempar sekali. Peluang jumlah kedua mata dadu = 7 adalah ...",
    opsi: ["1/6", "1/9", "5/36", "7/36"],
    jawaban: 0,
    pembahasan: "Titik sampel = 36. Jumlah 7: (1,6)(2,5)(3,4)(4,3)(5,2)(6,1) = 6 kejadian. Peluang = 6/36 = 1/6.",
  },
];

export function faseEStatus(selesai: string[]): DuniaNode[] {
  let activeSet = false;
  return duniaNodes.map((n) => {
    if (selesai.includes(n.id)) return { ...n, status: "done" as NodeStatus };
    if (!activeSet) {
      activeSet = true;
      return {
        ...n,
        status: "active" as NodeStatus,
        progress: n.progress ?? 0.15,
      };
    }
    return { ...n, status: "locked" as NodeStatus };
  });
}
