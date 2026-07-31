// Sumber tunggal "dunia/tingkat" belajar, dipakai peta (/belajar) & katalog (/belajar/pilih).
// Fase E (utama, hero) + semua fase lain (Kurikulum Merdeka) dari bank soal.
import { duniaMeta, duniaNodes, bossNode } from "@/lib/dunia";
import { bankByDunia } from "@/lib/bank-soal";

export type NodeStat = "done" | "active" | "open" | "locked";
export type MapNode = {
  id: string; // id simpul = topik + tahap (mis. "eksponen-logaritma::q")
  topicId: string; // id topik asal
  stage: "materi" | "quiz" | "ajari"; // tahap: baca+MC, kuis, atau ajari murid
  judul: string;
  blurb: string;
  bidang: string;
  xp: number;
  soal: string;
  status: NodeStat;
};
export type BossInfo = { judul: string; xp: number; open: boolean };

export type World = {
  key: string;
  jenjang: string;
  fase: string; // label panjang utk header
  faseShort: string; // label pendek (Fase A) sbg tag sekunder
  kelas: string; // label ramah-awam (Kelas 1-2)
  hint: string; // bocoran isi topik
  judul: string;
  hero: boolean;
  nodes: MapNode[];
  boss: BossInfo | null;
  total: number;
  done: number;
};

// Label ramah-awam: Fase Kurikulum Merdeka -> kelas + bocoran isi (biar tak sekadar "Fase A").
export const FASE_INFO: Record<string, { kelas: string; hint: string }> = {
  "Fase A": { kelas: "Kelas 1-2", hint: "Berhitung, bentuk & waktu" },
  "Fase B": { kelas: "Kelas 3-4", hint: "Perkalian, pecahan & ukur" },
  "Fase C": { kelas: "Kelas 5-6", hint: "Desimal, persen & bangun ruang" },
  "Fase D": { kelas: "Kelas 7-9", hint: "Aljabar, Pythagoras & data" },
  "Fase E": { kelas: "Kelas 10", hint: "Eksponen, SPLTV & trigonometri" },
  "Fase F": { kelas: "Kelas 11-12", hint: "Lingkaran, matriks & keuangan" },
  "Fase F+": { kelas: "Kelas 11-12 Lanjut", hint: "Kalkulus: limit, turunan & integral" },
};
export const faseInfo = (faseShort: string) =>
  FASE_INFO[faseShort] ?? { kelas: "", hint: "" };

export const JENJANG = [
  { key: "SD", sub: "Sekolah Dasar" },
  { key: "SMP", sub: "Sekolah Menengah Pertama" },
  { key: "SMA", sub: "Sekolah Menengah Atas" },
];

type TopikLite = { id: string; judul: string; blurb: string; bidang: string; xp: number; soal: string };

// Pecah tiap topik jadi 3 SIMPUL berurutan: MATERI (baca + pilihan ganda) → QUIZ (Latihan Kilat)
// → AJARI (ajari murid bidangnya: WAJIB, penutup topik). KUNCI PER-TOPIK (semua level):
// Materi selalu terbuka; Quiz terkunci sampai Materi tuntas; Ajari terkunci sampai Quiz tuntas.
// Topik dianggap TUNTAS hanya setelah Ajari. Antar-topik bebas. "active" = simpul terdekat yang
// belum tuntas & tak terkunci → dipakai fokus kamera + maskot "Kamu di sini".
function withStages(topics: TopikLite[], materiDone: string[], quizDone: string[], ajariDone: string[]): MapNode[] {
  const mDone = new Set(materiDone);
  const qDone = new Set(quizDone);
  const aDone = new Set(ajariDone);
  const flat: { t: TopikLite; stage: "materi" | "quiz" | "ajari"; done: boolean; locked: boolean }[] = [];
  for (const t of topics) {
    flat.push({ t, stage: "materi", done: mDone.has(t.id), locked: false }); // Materi: selalu terbuka
    flat.push({ t, stage: "quiz", done: qDone.has(t.id), locked: !mDone.has(t.id) }); // Quiz: terkunci sampai Materi tuntas
    flat.push({ t, stage: "ajari", done: aDone.has(t.id), locked: !qDone.has(t.id) }); // Ajari: terkunci sampai Quiz tuntas
  }
  let activeSet = false;
  return flat.map(({ t, stage, done, locked }) => {
    let status: NodeStat;
    if (done) status = "done";
    else if (locked) status = "locked";
    else if (!activeSet) { activeSet = true; status = "active"; }
    else status = "open";
    const suffix = stage === "materi" ? "m" : stage === "quiz" ? "q" : "a";
    const xp = stage === "materi" ? Math.max(8, Math.round(t.xp * 0.4)) : stage === "quiz" ? Math.max(10, Math.round(t.xp * 0.5)) : t.xp;
    return {
      id: `${t.id}::${suffix}`,
      topicId: t.id,
      stage,
      judul: t.judul,
      blurb: t.blurb,
      bidang: t.bidang,
      xp,
      soal: t.soal,
      status,
    };
  });
}

// Susun daftar DUNIA: Fase E (utama) + semua fase lain. Progres kini per-TAHAP:
// materiDone = topik yang tahap materinya tuntas; quizDone = topik yang kuisnya (Latihan Kilat) tuntas.
export function buildWorlds(materiDone: string[], quizDone: string[], ajariDone: string[]): World[] {
  const eTopics: TopikLite[] = duniaNodes.map((n) => ({ id: n.id, judul: n.judul, blurb: n.blurb, bidang: n.bidang, xp: n.xp, soal: n.soal }));
  const eDone = duniaNodes.filter((n) => ajariDone.includes(n.id)).length; // topik TUNTAS = sudah di-Ajari
  return [
    {
      key: "E",
      jenjang: duniaMeta.jenjang,
      fase: duniaMeta.fase,
      faseShort: "Fase E",
      kelas: faseInfo("Fase E").kelas,
      hint: faseInfo("Fase E").hint,
      judul: duniaMeta.judul,
      hero: true,
      nodes: withStages(eTopics, materiDone, quizDone, ajariDone),
      // Boss terbuka setelah SEMUA kuis Fase E tuntas.
      boss: {
        judul: bossNode.judul,
        xp: bossNode.xp,
        open: eDone >= duniaNodes.length,
      },
      total: duniaNodes.length,
      done: eDone,
    },
    ...bankByDunia().map((g) => {
      const topics: TopikLite[] = g.topik.map((t) => ({
        id: t.id,
        judul: t.judul,
        blurb: t.blurb,
        bidang: t.bidang,
        xp: t.xp,
        soal: t.soal[0]?.soal ?? t.topik,
      }));
      const info = faseInfo(g.fase);
      return {
        key: g.key,
        jenjang: g.jenjang,
        fase: g.fase,
        faseShort: g.fase,
        kelas: info.kelas,
        hint: info.hint,
        judul: `Petualangan ${info.kelas || g.fase}`,
        hero: false,
        nodes: withStages(topics, materiDone, quizDone, ajariDone),
        boss: null,
        total: topics.length,
        done: topics.filter((t) => ajariDone.includes(t.id)).length,
      } as World;
    }),
  ];
}
