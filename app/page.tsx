import Link from "next/link";
import { BookOpen, TrendingUp, GraduationCap, BrainCircuit, ShieldCheck, Guest, Gift, Chat, Users, Report, Compass } from "@/components/brand-icons";
import { Mascot } from "@/components/mascot";

const TRUST = [
  { icon: ShieldCheck, label: "Progres Tersimpan", note: "Login, aman & sinkron di cloud" },
  { icon: Guest, label: "Coba sebagai Tamu", note: "Gratis, langsung coba" },
  { icon: Gift, label: "100% Gratis", note: "Untuk semua pelajar" },
];

// Poin inti web (hasil sintesis 4 sudut pandang).
const POINTS = [
  {
    icon: GraduationCap,
    judul: "Anda yang memegang kendali kelas",
    isi: "Bukan sekadar mendengarkan, Andalah yang menjelaskan, dan murid AI menyimak sambil terus bertanya. Menjelaskan adalah ujian pemahaman paling jujur: tak bisa berpura-pura mengerti.",
  },
  {
    icon: BrainCircuit,
    judul: "Celah pemahaman Anda terungkap sendiri",
    isi: "Murid AI sesekali sengaja menjawab keliru. Justru saat membetulkannya, Anda sadar konsep mana yang belum benar-benar dikuasai.",
  },
  {
    icon: Report,
    judul: "Rapor yang menunjukkan akar masalah, bukan sekadar angka",
    isi: "Bukan sekadar nilai '80/100'. Ada peta pemahaman, konsep mana yang kokoh, mana yang rapuh, dan langkah berikutnya, lahir dari percakapan mengajar Anda.",
  },
  {
    icon: ShieldCheck,
    judul: "Coba terlebih dahulu, simpan bila perlu",
    isi: "Langsung coba sebagai tamu. Ingin progres tersimpan dan tersinkron lintas-perangkat? Cukup masuk dengan akun Google, sepenuhnya gratis.",
  },
];

const STEPS = [
  { icon: BookOpen, n: "1", title: "Belajar", desc: "Membaca materi singkat sesuai topik." },
  { icon: Chat, n: "2", title: "Ajari", desc: "Menjelaskan konsep kepada murid AI yang bertanya dan sesekali keliru." },
  { icon: TrendingUp, n: "3", title: "Naik Level", desc: "Kelemahan Anda terdeteksi, dan topik baru terbuka." },
];

const FITUR = [
  { icon: Chat, judul: "Ajari Murid AI", desc: "Interaksi utama: Anda mengajar, murid AI menyimak dan bertanya." },
  { icon: Users, judul: "Ruang Kelas", desc: "Setiap kategori memiliki murid berbeda, kelas Anda semakin berkembang." },
  { icon: Compass, judul: "Peta Petualangan", desc: "Naik level di setiap fase dan taklukkan Boss Quiz." },
  { icon: Report, judul: "Rapor Sesi", desc: "Peta pemahaman dan rekomendasi setiap selesai mengajar." },
];

const BEDA = [
  {
    judul: "Peran yang benar-benar dibalik",
    isi: "Pada kebanyakan aplikasi lain, AI yang berpikir dan Anda hanya membaca hasilnya. Di sini, Andalah yang menjelaskan sehingga pemahaman Anda yang terasah. Pendekatan ini langka di antara banyaknya chatbot tutor.",
  },
  {
    judul: "Diagnostik miskonsepsi, bukan sekadar benar-salah",
    isi: "Murid AI sengaja memunculkan miskonsepsi umum dari bank materi terverifikasi, dan cara Anda meresponsnya menunjukkan seberapa dalam pemahaman Anda. Deteksi celah muncul dari aktivitas mengajar, bukan dari kuis terpisah.",
  },
  {
    judul: "Akurat, personal, dan andal secara teknis",
    isi: "Jawaban di-grounding ke Kurikulum Merdeka melalui bank materi terverifikasi (RAG) sehingga bukan halusinasi. Murid AI mengingat Anda dari sesi ke sesi, dan tetap berfungsi meskipun kuota habis.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
        <div className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-[14px] bg-white shadow-[0_8px_18px_-8px_rgba(21,145,220,.7)] ring-1 ring-line">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Ajari Aku" width={30} height={30} className="h-7 w-7" />
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight">
            Ajari Aku
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 md:px-8">
        {/* hero */}
        <section className="grid items-center gap-8 py-8 md:grid-cols-2 md:py-14">
          <div className="order-2 md:order-1">
            <span className="aa-pill-primary">Matematika SD sampai SMA · Kurikulum Merdeka (Fase A sampai F)</span>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.08] tracking-tight md:text-[2.9rem]">
              Bukan AI yang mengajarimu.{" "}
              <span className="aa-shine">Kamu yang mengajari AI-nya.</span>
            </h1>
            <p className="mt-4 max-w-md text-lg text-ink-soft">
              Ajari Aku membalik posisi: Anda menjadi guru, dan murid AI yang
              belajar. Cara tercepat untuk benar-benar memahami Matematika
              adalah dengan menjelaskannya kepada orang lain.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="/beranda" className="aa-btn text-base">
                Coba sekarang
              </Link>
              <Link href="#cara" className="aa-btn-ghost text-base">
                Lihat cara kerjanya
              </Link>
            </div>
          </div>

          <div className="order-1 grid place-items-center md:order-2">
            <div className="relative grid h-64 w-64 place-items-center rounded-[40px] bg-gradient-to-br from-[var(--tint)] to-transparent md:h-80 md:w-80">
              <div className="animate-float">
                <Mascot mood="happy" size={150} />
              </div>
              <span className="animate-float absolute left-4 top-6 font-display text-2xl font-extrabold text-[var(--primary)] [animation-delay:.6s]">
                π
              </span>
              <span className="animate-float absolute bottom-8 right-5 font-display text-xl font-extrabold text-[var(--primary-deep)] [animation-delay:1.2s]">
                a²+b²
              </span>
              <span className="animate-float absolute right-7 top-9 font-display text-lg font-extrabold text-[var(--primary-bright)] [animation-delay:.9s]">
                √
              </span>
              <span className="animate-float absolute bottom-12 left-7 font-display text-base font-extrabold text-[var(--reward)] [animation-delay:1.5s]">
                ∑
              </span>
            </div>
          </div>
        </section>

        {/* trust chips */}
        <section className="stagger grid gap-3 sm:grid-cols-3">
          {TRUST.map(({ icon: Icon, label, note }) => (
            <div key={label} className="aa-card aa-lift flex items-center gap-3 p-4">
              <span className="grid h-11 w-11 flex-none place-items-center rounded-2xl bg-[var(--tint)] text-[var(--primary-deep)]">
                <Icon size={20} />
              </span>
              <div>
                <p className="font-display font-extrabold">{label}</p>
                <p className="text-sm text-ink-soft">{note}</p>
              </div>
            </div>
          ))}
        </section>


        {/* poin inti */}
        <section className="py-14">
          <div className="text-center">
            <span className="aa-chip">Kenapa Ajari Aku</span>
            <h2 className="mt-3 font-display text-2xl font-extrabold md:text-3xl">
              Belajar yang benar-benar melekat
            </h2>
          </div>
          <div className="stagger mt-8 grid gap-4 md:grid-cols-2">
            {POINTS.map(({ icon: Icon, judul, isi }) => (
              <div key={judul} className="aa-card aa-lift p-6 text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[var(--cta-1)] to-[var(--cta-2)] text-white">
                  <Icon size={22} />
                </span>
                <h3 className="mt-4 font-display text-lg font-extrabold">
                  {judul}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                  {isi}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* cara kerjanya */}
        <section id="cara" className="scroll-mt-20 py-4">
          <h2 className="text-center font-display text-2xl font-extrabold md:text-3xl">
            Cara kerjanya
          </h2>
          <p className="mx-auto mt-2 max-w-md text-center text-ink-soft">
            Satu siklus belajar yang membuat Anda benar-benar memahami.
          </p>
          <div className="stagger mt-8 grid gap-4 md:grid-cols-3">
            {STEPS.map(({ icon: Icon, n, title, desc }) => (
              <div key={n} className="aa-card aa-lift p-6 text-center">
                <div className="flex items-center justify-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[var(--cta-1)] to-[var(--cta-2)] text-white">
                    <Icon size={20} />
                  </span>
                  <span className="font-display text-sm font-extrabold text-ink-soft tnum">
                    Langkah {n}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-xl font-extrabold">
                  {title}
                </h3>
                <p className="mt-1 text-ink-soft">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* preview produk: TUNJUKKAN momen inti (keliru → dikoreksi → paham), bukan cuma cerita */}
        <section className="py-14">
          <div className="text-center">
            <span className="aa-chip">Sekilas di dalam</span>
            <h2 className="mt-3 font-display text-2xl font-extrabold md:text-3xl">
              Seperti inilah pengalaman mengajari Pio
            </h2>
          </div>
          <div className="mx-auto mt-8 max-w-lg">
            <div className="aa-card overflow-hidden">
              {/* papan tulis soal */}
              <div className="border-b border-line bg-surface-2 px-5 py-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-ink-soft">Papan Tulis · Eksponen</p>
                <p className="mt-0.5 font-display text-lg font-extrabold tnum">Sederhanakan 2⁵ × 2³</p>
              </div>
              {/* percakapan */}
              <div className="flex flex-col gap-3 p-5">
                <div className="flex items-end gap-2">
                  <span className="flex-none"><Mascot mood="oops" size={34} /></span>
                  <p className="max-w-[80%] rounded-2xl rounded-bl-sm bg-surface-2 px-3.5 py-2 text-sm leading-snug">
                    Berarti pangkatnya dikali jadi <b className="tnum">2¹⁵</b> ya Kak? 🤔
                  </p>
                </div>
                <div className="flex justify-end">
                  <p className="max-w-[82%] rounded-2xl rounded-br-sm bg-gradient-to-br from-[var(--cta-1)] to-[var(--cta-2)] px-3.5 py-2 text-sm leading-snug text-white">
                    Bukan, basisnya sama, jadi pangkatnya <b>DIJUMLAH</b>: <span className="tnum">2⁸</span>
                  </p>
                </div>
                <div className="flex items-end gap-2">
                  <span className="flex-none"><Mascot mood="happy" size={34} /></span>
                  <p className="rounded-2xl rounded-bl-sm bg-surface-2 px-3.5 py-2 text-sm leading-snug">
                    Ahh paham! Jadi <b className="tnum">2⁵ × 2³ = 2⁸</b> 🌟
                  </p>
                  <span className="flex-none rounded-full bg-[var(--tint)] px-2 py-0.5 text-[11px] font-extrabold text-[var(--primary-deep)] tnum">+15 XP</span>
                </div>
              </div>
              {/* teaser rapor */}
              <div className="border-t border-line px-5 py-3 text-center text-xs text-ink-soft">
                Setelah sesi selesai, <b className="text-ink">Rapor Sesi</b> menunjukkan konsep yang masih lemah.
              </div>
            </div>
            <p className="mt-3 text-center text-sm text-ink-soft">
              Andalah yang mengoreksi miskonsepsi Pio, di sanalah pemahaman Anda sendiri terbentuk.
            </p>
          </div>
        </section>

        {/* cuplikan fitur */}
        <section className="py-14">
          <div className="text-center">
            <span className="aa-chip">Yang dapat Anda lakukan</span>
            <h2 className="mt-3 font-display text-2xl font-extrabold md:text-3xl">
              Satu kelas, banyak petualangan
            </h2>
          </div>
          <div className="stagger mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {FITUR.map(({ icon: Icon, judul, desc }) => (
              <div key={judul} className="aa-card aa-lift p-5 text-center">
                <span className="mx-auto grid h-11 w-11 place-items-center rounded-2xl bg-[var(--tint)] text-[var(--primary-deep)]">
                  <Icon size={20} />
                </span>
                <h3 className="mt-3 font-display font-extrabold">{judul}</h3>
                <p className="mt-1 text-sm text-ink-soft">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* kenapa beda */}
        <section className="py-4">
          <div className="text-center">
            <span className="aa-chip">Beda dari yang lain</span>
            <h2 className="mt-3 font-display text-2xl font-extrabold md:text-3xl">
              Kenapa bukan sekadar chatbot tutor
            </h2>
          </div>
          <div className="stagger mt-8 grid gap-4 md:grid-cols-3">
            {BEDA.map(({ judul, isi }, i) => (
              <div key={judul} className="aa-card aa-lift p-6 text-center">
                <span className="font-display text-3xl font-extrabold text-[var(--primary)]/30 tnum">
                  0{i + 1}
                </span>
                <h3 className="mt-2 font-display text-lg font-extrabold">
                  {judul}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                  {isi}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* penutup */}
        <section className="py-14">
          <div className="aa-card relative overflow-hidden p-8 text-center md:p-10">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(90% 60% at 50% 0%, color-mix(in srgb, var(--primary-bright) 12%, transparent), transparent 60%)",
              }}
            />
            <div className="relative flex flex-col items-center gap-4">
              <div className="animate-float">
                <Mascot mood="happy" size={64} />
              </div>
              <p className="mx-auto max-w-lg font-display text-xl font-extrabold leading-snug md:text-2xl">
                Jika Anda benar-benar memahami, buktikan dengan mengajarkannya,
                dan biarkan kelas Anda tumbuh bersama Anda.
              </p>
              <p className="mx-auto max-w-md text-sm text-ink-soft">
                Gratis &amp; terbuka untuk semua pelajar SD sampai SMA, selaras dengan{" "}
                <b className="text-ink">SDG 4: Pendidikan Berkualitas</b>.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* footer */}
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-5 py-6 text-center text-sm text-ink-soft md:px-8">
          <p className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-[var(--node-good)]" />
            Login untuk simpan · Coba sebagai tamu · Gratis
          </p>
          <p className="flex flex-wrap items-center justify-center gap-2">
            <Link href="/tentang" className="font-bold hover:text-[var(--primary)]">Tentang</Link>
            <span className="opacity-50">·</span>
            <Link href="/privasi" className="font-bold hover:text-[var(--primary)]">Privasi &amp; Data</Link>
          </p>
          <p>Ajari Aku · Belajar dengan mengajar</p>
        </div>
      </footer>
    </div>
  );
}
