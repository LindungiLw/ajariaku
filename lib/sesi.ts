import type { Sesi } from "@/lib/progress";
import type { AvatarSpec } from "@/lib/avatar";
import { resolveTopik } from "@/lib/topik";
import { topikById } from "@/lib/bank-soal";
import { muridForTopik } from "@/lib/kelas-topik";

type MuridLite = { id: string; nama: string; avatar: AvatarSpec };

// SATU sumber kebenaran untuk membangun objek Sesi Ajari (sebelumnya disalin di 6 halaman, dan sempat
// menyimpang → node Fase E menghasilkan sesi kosong). judul/soal/xp diambil dari resolveTopik (mencakup
// topik Fase E yang tak ada di bank soal); daftar soal lengkap dari bank bila tersedia, else soal tunggal.
//   murid === undefined → murid bidang topik otomatis (muridForTopik), dipakai Peta / Materi / Kursus
//   murid === null      → sesi SOLO tanpa muridId, dipakai Beranda / nav Ajari
//   murid = objek       → murid eksplisit (dari picker Ruang Kelas)
export function buildSesi(topikId: string, murid?: MuridLite | null): Sesi {
  const t = resolveTopik(topikId);
  const bt = topikById(topikId);
  const judul = t?.judul || bt?.judul || "";
  const soalList = bt && bt.soal.length ? bt.soal.map((s) => s.soal) : [t?.soal ?? ""];
  const m = murid === undefined ? muridForTopik(topikId) : murid;
  return {
    id: topikId,
    judul,
    soal: soalList[0] ?? "",
    soalList,
    topik: judul,
    xp: t?.xp ?? bt?.xp ?? 20,
    ...(m ? { muridId: m.id, muridNama: m.nama, muridAvatar: m.avatar } : {}),
  };
}
