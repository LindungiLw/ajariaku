// Menautkan "kelas/kategori" murid ke materi NYATA (Fase E + bank soal SD-SMA).
// Dipakai di Ruang Kelas: tap murid → daftar topik di kelasnya untuk diajarkan.
import { duniaNodes } from "./dunia";
import { bankSoal, topikById } from "./bank-soal";
import { muridForKategori, baseMuridForKategori, type MuridKustom } from "./murid";

export type KelasTopik = { id: string; judul: string; sub: string; xp: number };

// Peta kategori murid → nilai "bidang" topik. Cocokkan HANYA via bidang (bukan judul/id) supaya
// tiap murid hanya menampilkan topik BIDANGNYA, tak bocor ke bidang lain (mis. Aljabar ≠ Data).
const KAT_BIDANG: Record<string, string[]> = {
  bilangan: ["bilangan"],
  aljabar: ["aljabar", "fungsi"], // "Aljabar", "Aljabar dan Fungsi"
  geometri: ["geometri", "pengukuran"], // "Geometri", "Pengukuran"
  trigonometri: ["trigonometri"],
  data: ["data", "peluang"], // "Data & Peluang"
  kalkulus: ["kalkulus"],
};

export function topicsForKategori(kat: string): KelasTopik[] {
  const kws = KAT_BIDANG[kat] ?? [kat];
  const cocok = (bidang: string) => {
    const b = bidang.toLowerCase();
    return kws.some((k) => b.includes(k));
  };
  // Urutkan SD → SMA: Fase A(1) B(2) C(3) · SMP D(4) · SMA E(5) F(6). duniaNodes = SMA Fase E.
  const FASE_RANK: Record<string, number> = { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6 };
  const rankFase = (fase: string) => {
    const m = /Fase\s*([A-F])/i.exec(fase);
    return m ? FASE_RANK[m[1].toUpperCase()] ?? 9 : 9;
  };
  const seen = new Set<string>();
  const out: (KelasTopik & { _rank: number })[] = [];
  const add = (t: KelasTopik, rank: number) => {
    if (seen.has(t.id)) return; // dedup bila topik ada di dua sumber
    seen.add(t.id);
    out.push({ ...t, _rank: rank });
  };
  for (const t of bankSoal) {
    if (cocok(t.bidang)) add({ id: t.id, judul: t.judul, sub: `${t.jenjang} · ${t.fase}`, xp: t.xp }, rankFase(t.fase));
  }
  for (const n of duniaNodes) {
    if (cocok(n.bidang)) add({ id: n.id, judul: n.judul, sub: "SMA · Fase E", xp: n.xp }, 5);
  }
  out.sort((a, b) => a._rank - b._rank); // stabil → urutan asli terjaga dalam fase yang sama
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- _rank sengaja dibuang dari hasil
  return out.map(({ _rank, ...rest }) => rest);
}

// Kategori murid untuk sebuah BIDANG topik (kebalikan KAT_BIDANG).
export function kategoriForBidang(bidang: string): string {
  const b = (bidang || "").toLowerCase();
  for (const kat of Object.keys(KAT_BIDANG)) {
    if (KAT_BIDANG[kat].some((k) => b.includes(k))) return kat;
  }
  return "aljabar";
}

// Kategori murid untuk sebuah TOPIK (dari bidang-nya di bank soal / Fase E).
export function kategoriForTopik(topikId: string): string {
  const bidang = topikById(topikId)?.bidang ?? duniaNodes.find((n) => n.id === topikId)?.bidang ?? "";
  return kategoriForBidang(bidang);
}

// Murid yang mengajar topik ini (baca localStorage → untuk effect/handler, BUKAN render awal).
export function muridForTopik(topikId: string): MuridKustom {
  return muridForKategori(kategoriForTopik(topikId));
}

// Versi DETERMINISTIK (roster dasar, tanpa localStorage) → aman untuk render awal/SSR.
export function baseMuridForTopik(topikId: string): MuridKustom {
  return baseMuridForKategori(kategoriForTopik(topikId));
}
