import Link from "next/link";
import { ShieldCheck, UserX, HardDrive, LogIn, Trash2, ScrollText, ArrowRight } from "lucide-react";
import { Trophy } from "@/components/brand-icons";
import { BackButton } from "@/components/back-button";

const POIN = [
  {
    icon: UserX,
    judul: "Langsung belajar",
    isi: "Kamu bisa langsung mulai belajar; profil & progres tersimpan di perangkat ini. Masuk (opsional) kalau ingin progres aman & tersinkron antar-perangkat.",
  },
  {
    icon: HardDrive,
    judul: "Data di perangkatmu",
    isi: "Profil, level, XP, dan peta pemahaman disimpan di browser perangkat ini (localStorage), bukan di server kami.",
  },
  {
    icon: LogIn,
    judul: "Login Google itu opsional",
    isi: "Hanya jika kamu memilih masuk dengan Google. Identitas akun (nama, email, foto) dikelola Google Firebase Authentication untuk proses login; yang kami simpan di database (Firestore) hanya progres belajarmu, bukan email atau foto, demi sinkronisasi antar-perangkat.",
  },
  {
    icon: Trophy,
    judul: "Peringkat global itu pilihan",
    isi: "Papan peringkat antar-pengguna hanya muncul bila kamu login DAN setuju ikut. Yang tampil publik hanya nickname pilihanmu + XP, bukan nama asli, email, atau foto. Kamu bisa keluar kapan saja dan entrimu langsung dihapus.",
  },
  {
    icon: Trash2,
    judul: "Hapus kapan saja",
    isi: "Di halaman Profil kamu bisa menghapus data di perangkat. Jika login, tombol Hapus juga menghapus salinan tersinkron di cloud.",
  },
  {
    icon: ScrollText,
    judul: "Prinsip UU PDP",
    isi: "Mengikuti prinsip UU No. 27 Tahun 2022: kumpulkan seminim mungkin, tujuan jelas (sinkronisasi), dan hak pengguna untuk menghapus dihormati.",
  },
];

export default function PrivasiPage() {
  return (
    <div className="flex flex-col gap-4">
      <BackButton />
      {/* header */}
      <section className="aa-card flex flex-col items-center gap-3 p-6 text-center md:p-8">
        <span className="grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-[var(--cta-1)] to-[var(--cta-2)] text-white shadow-[0_14px_28px_-14px_rgba(21,145,220,.9)]">
          <ShieldCheck size={30} />
        </span>
        <h1 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">
          Privasi & Keamanan Data
        </h1>
        <p className="max-w-md text-ink-soft">
          Belajar dengan tenang. Ajari Aku dirancang aman untuk pelajar sejak awal,
          dan jujur soal data apa yang disimpan.
        </p>
      </section>

      {/* poin */}
      <section className="stagger grid gap-3 md:grid-cols-2">
        {POIN.map(({ icon: Icon, judul, isi }) => (
          <div key={judul} className="aa-card aa-lift flex gap-4 p-5">
            <span className="grid h-11 w-11 flex-none place-items-center rounded-2xl bg-[var(--tint)] text-[var(--primary-deep)]">
              <Icon size={20} />
            </span>
            <div>
              <p className="font-display font-extrabold">{judul}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{isi}</p>
            </div>
          </div>
        ))}
      </section>

      {/* catatan AI */}
      <section className="aa-card p-5 md:p-6">
        <p className="font-display font-extrabold">Bagaimana murid AI bekerja?</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Penjelasan yang kamu ketik dikirim ke layanan AI (Google Gemini) melalui koneksi
          terenkripsi untuk menghasilkan respons murid AI, lalu jawabannya dikembalikan.
          Sebaiknya <b className="text-ink">jangan membagikan data pribadi atau sensitif</b> di
          dalam obrolan. Dalam mode tamu, percakapan tidak ditautkan ke identitas apa pun.
        </p>
      </section>

      {/* catatan pelajar di bawah umur */}
      <p className="px-1 text-center text-xs leading-relaxed text-ink-soft">
        Untuk pengguna di bawah umur, sebaiknya gunakan Ajari Aku dengan pendampingan orang tua atau guru.
      </p>

      <div className="flex justify-center">
        <Link href="/beranda" className="aa-btn">
          Mulai Belajar dengan Aman <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
