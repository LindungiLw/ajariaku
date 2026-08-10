import Link from "next/link";
import { Lightbulb, BookCheck, Globe, Cpu, ArrowRight, Quote, ShieldCheck, ClipboardCheck } from "lucide-react";
import { BrainCircuit } from "@/components/brand-icons";
import { Mascot } from "@/components/mascot";
import { BackButton } from "@/components/back-button";

const LANDASAN = [
  {
    icon: BrainCircuit,
    judul: "Protégé Effect",
    isi: "Seseorang belajar lebih dalam saat menyiapkan materi untuk diajarkan dan mengajari 'murid', bahkan lebih baik daripada belajar untuk diri sendiri. Ajari Aku mewujudkannya melalui murid AI yang benar-benar dapat Anda ajari.",
  },
  {
    icon: Lightbulb,
    judul: "Teknik Feynman",
    isi: "Jika Anda dapat menjelaskan sebuah konsep dengan bahasa sederhana, berarti Anda benar-benar memahaminya. Ketika penjelasan tersendat, di situlah celah pemahaman tampak, dan dapat diperbaiki.",
  },
  {
    icon: BookCheck,
    judul: "Diagnostik dari cara mengajar",
    isi: "Murid AI sesekali menampilkan miskonsepsi umum. Cara Anda meresponsnya mengungkap seberapa dalam pemahaman Anda, deteksi celah lahir dari aktivitas mengajar, bukan kuis terpisah.",
  },
];

export default function TentangPage() {
  return (
    <div className="stagger flex flex-col gap-4">
      <h1 className="sr-only">Tentang Ajari Aku</h1>
      <BackButton />

      {/* hero misi */}
      <section className="aa-card relative overflow-hidden p-6 text-center md:p-8">
        <span
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(90% 60% at 50% 0%, color-mix(in srgb, var(--primary-bright) 14%, transparent), transparent 62%)",
          }}
        />
        <div className="relative flex flex-col items-center gap-3">
          <div className="animate-float">
            <Mascot mood="happy" size={72} />
          </div>
          <span className="aa-pill-primary">Pendidikan Berkualitas · SDG 4</span>
          <h2 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">
            Membalik peran belajar agar benar-benar paham
          </h2>
          <p className="max-w-xl text-ink-soft">
            Ajari Aku adalah aplikasi belajar Matematika tempat{" "}
            <b className="text-ink">Anda yang mengajari murid AI</b>, cara paling
            jujur untuk menguji dan memperdalam pemahaman.
          </p>
        </div>
      </section>

      {/* landasan ilmiah */}
      <section className="aa-card p-5 md:p-6">
        <h2 className="flex items-center gap-2 font-display text-lg font-extrabold">
          <BrainCircuit size={18} className="text-[var(--primary)]" /> Landasan ilmiah
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {LANDASAN.map(({ icon: Icon, judul, isi }) => (
            <div key={judul} className="rounded-2xl border border-line bg-surface-2 p-4">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[var(--cta-1)] to-[var(--cta-2)] text-white">
                <Icon size={18} />
              </span>
              <h3 className="mt-3 font-display font-extrabold">{judul}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{isi}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 flex items-start gap-2 rounded-2xl border border-line bg-surface px-4 py-3 text-xs leading-relaxed text-ink-soft">
          <Quote size={14} className="mt-0.5 flex-none text-[var(--primary)]" />
          <span>
            Rujukan: Chase, Chin, Oppezzo &amp; Schwartz (2009), <i>“Teachable Agents and the
            Protégé Effect”</i>, Journal of Science Education and Technology · Teknik Feynman
            (belajar dengan menjelaskan sesederhana mungkin).
          </span>
        </p>
      </section>

      {/* sumber & kredibilitas konten */}
      <section className="aa-card p-5 md:p-6">
        <h2 className="flex items-center gap-2 font-display text-lg font-extrabold">
          <BookCheck size={18} className="text-[var(--node-good)]" /> Sumber &amp; kredibilitas konten
        </h2>
        <ul className="mt-3 flex flex-col gap-3 text-sm leading-relaxed text-ink-soft">
          <li className="flex gap-2.5">
            <span className="mt-1 h-2 w-2 flex-none rounded-full bg-[var(--primary)]" />
            <span>
              Materi selaras <b className="text-ink">Kurikulum Merdeka</b> (Kemendikbudristek),
              Capaian Pembelajaran <b className="text-ink">Fase A sampai F</b>, dari SD sampai SMA.
            </span>
          </li>
          <li className="flex gap-2.5">
            <span className="mt-1 h-2 w-2 flex-none rounded-full bg-[var(--primary)]" />
            <span>
              Bank materi &amp; soal disusun dan <b className="text-ink">diverifikasi tim</b>,
              lengkap dengan miskonsepsi umum untuk melatih deteksi celah.
            </span>
          </li>
          <li className="flex gap-2.5">
            <span className="mt-1 h-2 w-2 flex-none rounded-full bg-[var(--primary)]" />
            <span>
              Jawaban murid AI <b className="text-ink">di-grounding</b> ke bank materi terverifikasi
              (RAG), sehingga menekan risiko halusinasi AI.
            </span>
          </li>
        </ul>
        <p className="mt-3 rounded-2xl border border-dashed border-line bg-surface-2 px-4 py-3 text-xs leading-relaxed text-ink-soft">
          Catatan: murid AI merupakan alat bantu belajar dan sesekali dapat keliru. Selalu
          cocokkan dengan materi dan guru Anda apabila ragu.
        </p>
      </section>

      {/* metodologi & cakupan konten */}
      <section className="aa-card p-5 md:p-6">
        <h2 className="flex items-center gap-2 font-display text-lg font-extrabold">
          <ClipboardCheck size={18} className="text-[var(--node-good)]" /> Bagaimana materi disusun &amp; diperiksa
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Setiap materi &amp; soal ditulis lalu <b className="text-ink">diperiksa ulang</b> lewat alur{" "}
          <b className="text-ink">tulis → guru pemeriksa</b>, dilengkapi daftar miskonsepsi umum, dan
          di-<b className="text-ink">grounding</b> ke murid AI (RAG) agar jawabannya tetap sesuai kurikulum.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
          {[
            { v: "49", l: "Topik" },
            { v: "200+", l: "Soal latihan" },
            { v: "49", l: "Materi ringkas" },
            { v: "A sampai F", l: "Fase (SD sampai SMA)" },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl border border-line bg-surface-2 p-3">
              <p className="font-display text-2xl font-extrabold tnum">{s.v}</p>
              <p className="mt-1 text-[11px] leading-tight text-ink-soft">{s.l}</p>
            </div>
          ))}
        </div>
      </section>


      {/* inklusivitas / SDG 4 */}
      <section className="aa-card p-5 md:p-6">
        <h2 className="flex items-center gap-2 font-display text-lg font-extrabold">
          <Globe size={18} className="text-[var(--node-good)]" /> Pendidikan untuk semua
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Sejalan dengan <b className="text-ink">SDG 4 (Pendidikan Berkualitas)</b>, kami menekan
          hambatan akses: <b className="text-ink">gratis</b>, <b className="text-ink">minim data pribadi</b>, <b className="text-ink">ringan</b> untuk perangkat sederhana,
          dan <b className="text-ink">tetap berjalan pada koneksi terbatas</b>. Satu aplikasi
          menjangkau semua jenjang, dari SD hingga SMA, tanpa biaya, tanpa guru pendamping wajib.
        </p>
      </section>

      <div className="flex justify-center pb-2">
        <Link href="/beranda" className="aa-btn">
          Mulai Belajar <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}

