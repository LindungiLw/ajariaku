# Ajari Aku — Belajar dengan Mengajar

> **Bukan AI yang mengajarimu. Kamu yang mengajari AI-nya.**

Aplikasi web belajar Matematika berbasis **protégé effect** (efek mengajar): alih-alih pasif membaca atau bertanya ke chatbot, siswa **berperan sebagai guru** dan menjelaskan konsep kepada seorang **murid AI** bernama _Pio_. Saat Pio sengaja membuat kekeliruan umum, siswa harus mengoreksinya — dan justru di momen itulah celah pemahaman siswa sendiri ikut terungkap dan diperbaiki.

Dibuat oleh **POWERRANGERS** untuk **TIC 9.0** — subtema **"Pendidikan Berkualitas"** (selaras **SDG 4 – Quality Education**).

---

## Daftar Isi

- [Latar Belakang](#latar-belakang)
- [Solusi & Keunggulan (USP)](#solusi--keunggulan-usp)
- [Fitur Utama](#fitur-utama)
- [Cuplikan Layar](#cuplikan-layar)
- [Arsitektur & Cara Kerja](#arsitektur--cara-kerja)
- [Teknologi](#teknologi)
- [Konten & Kurikulum](#konten--kurikulum)
- [Privasi & Keamanan](#privasi--keamanan)
- [Menjalankan Secara Lokal](#menjalankan-secara-lokal)
- [Variabel Lingkungan](#variabel-lingkungan)
- [Deploy](#deploy)
- [Struktur Proyek](#struktur-proyek)
- [Aksesibilitas & Performa](#aksesibilitas--performa)
- [Batasan & Rencana Lanjutan](#batasan--rencana-lanjutan)
- [Tim](#tim)
- [Kredit & Sumber](#kredit--sumber)

---

## Latar Belakang

Kemampuan matematika siswa Indonesia masih menjadi tantangan besar. Berdasarkan **PISA 2022 (OECD)**:

| Indikator                                   | Angka     |
| ------------------------------------------- | --------- |
| Skor matematika Indonesia                   | **366**   |
| Rata-rata OECD                              | **472**   |
| Siswa di bawah kompetensi minimum (Level 2) | **± 80%** |

Akar masalahnya sering bukan sekadar "belum hafal rumus", melainkan **miskonsepsi** yang tidak pernah ketahuan karena cara belajar yang pasif. Ajari Aku menyerang tepat titik itu: memaksa siswa **mengartikulasikan** pemahaman lalu menghadapkannya pada kesalahan yang harus dikoreksi.

## Solusi & Keunggulan (USP)

Ajari Aku membalik peran belajar dan menjalankannya sebagai satu putaran singkat yang bisa diulang:

```
   ┌─────────────┐        ┌─────────────┐        ┌───────────────┐
   │  1. BELAJAR │  ───▶  │  2. AJARI   │  ───▶  │ 3. NAIK LEVEL │
   │ baca materi │        │ jelaskan ke │        │ celah terdeteksi
   │  singkat    │        │ murid AI &  │        │  → topik baru │
   │             │        │ koreksi ia  │        │    terbuka    │
   └─────────────┘        └─────────────┘        └───────────────┘
          ▲                                               │
          └───────────────────────────────────────────────┘
```

Landasan ilmiah yang dipakai:

- **Protégé Effect** — orang belajar lebih dalam ketika menyiapkan materi dan mengajari "murid" dibanding belajar untuk diri sendiri.
- **Teknik Feynman** — bila kamu bisa menjelaskan sesuatu sesederhana mungkin, berarti kamu benar-benar paham.
- **Diagnostik dari cara mengajar** — murid AI melempar miskonsepsi umum; respons pengajar mengungkap di mana pemahamannya masih bolong.

> Rujukan: Chase, Chin, Oppezzo & Schwartz (2009), _"Teachable Agents and the Protégé Effect"_, Journal of Science Education and Technology.

## Fitur Utama

| Area                           | Ringkasan                                                                                                                                                                                                               |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ajari (layar inti)**         | Ruang mengajar murid AI "Pio". Pio bertanya, sengaja keliru satu kali, lalu bisa dikoreksi. Setiap koreksi miskonsepsi memicu poin & perayaan. Diakhiri **Rapor Sesi** (skor paham, peta pemahaman, rekomendasi topik). |
| **Peta Petualangan (Belajar)** | Peta konsep vertikal bergaya _board game_ per fase Kurikulum Merdeka. Maskot melompat naik tiap konsep dituntaskan, ada **Boss Quiz** di puncak Fase E.                                                                 |
| **Katalog Tingkat**            | Halaman pemilih kelas (SD/SMP/SMA) yang lega dan jelas per jenjang; pilihan tersimpan di perangkat sehingga "lengket" antar-kunjungan, lalu langsung membuka petanya.                                                   |
| **Latihan Kilat (Kursus)**     | Mode latihan gamifikasi bergaya kartu (konsep / susun langkah / pilih langkah berikutnya / isian) dengan nyawa, combo, dan skor — untuk pemanasan sebelum mengajar.                                                     |
| **Ruang Kelas**                | Buat beberapa murid AI kustom (nama + avatar), masing-masing naik level sendiri; pilih materi yang mau diajarkan ke murid tertentu.                                                                                     |
| **Gamifikasi**                 | XP & level (50 XP/level), **api streak** kehadiran beruntun, **liga** peringkat XP, dan **12 medali/lencana** yang terbuka dari progres nyata (jumlah topik, bidang, koreksi miskonsepsi, murid naik level, streak).    |
| **Progres**                    | Level & XP, ringkasan hasil belajar (siap disalin untuk laporan), galeri lencana, liga, heatmap aktivitas, dan peta pemahaman dari memori belajar.                                                                      |
| **Profil & Pengaturan**        | Ubah identitas pengajar & murid, ganti tema **terang/gelap**, akun Google opsional (bila cloud sync diaktifkan), serta kontrol **reset progres** dan **hapus semua data**.                                              |
| **Tentang & Privasi**          | Halaman metodologi (dasar ilmiah, sumber, statistik) dan kebijakan privasi yang selaras **UU PDP No. 27/2022**.                                                                                                         |

Fitur pendukung: **PWA installable** (bisa "Add to Home Screen"), toggle tema cepat di navbar, dan animasi ringan tanpa mematikan performa.

## Cuplikan Layar

> Letakkan gambar/GIF demo di folder `docs/screenshots/` lalu tautkan di sini sebelum submit.

| Beranda                          | Ajari (mengajar Pio)           | Peta Petualangan                 |
| -------------------------------- | ------------------------------ | -------------------------------- |
| _`docs/screenshots/beranda.png`_ | _`docs/screenshots/ajari.png`_ | _`docs/screenshots/belajar.png`_ |

## Arsitektur & Cara Kerja

Aplikasi ini **local-first** dan bisa dipakai penuh **sebagai tamu (tanpa perlu login)**. Semua progres tersimpan di `localStorage` perangkat; **login Google tersedia sebagai opsi** untuk menyimpan dan menyinkronkan progres antar-perangkat.

### Otak murid AI — dua tingkat

Murid AI "Pio" bisa digerakkan oleh dua mesin dengan **bentuk keluaran identik** (`reply`, `mood`, `understood`, `dikoreksi`), sehingga antarmuka tidak peduli sumbernya dan demo tidak pernah "mati":

```
                         ┌──────────────────────────────────────────┐
   Pengguna mengetik ──▶ │  Layar Ajari  (PAKAI_GEMINI: true|false) │
   penjelasan            └───────────────┬──────────────┬───────────┘
                                         │              │
                    flag = false         │              │  flag = true
               (fallback otomatis)       ▼              ▼   ← default
                 ┌───────────────────────────┐   ┌────────────────────────────┐
                 │  Mesin murid LOKAL         │   │  POST /api/ajari (server)  │
                 │  deterministik (skrip)     │   │  → Google Gemini + RAG     │
                 │  tanpa API key / offline   │   │  grounding Kurikulum Merdeka
                 └───────────────────────────┘   └──────────────┬─────────────┘
                                                                │ bila key kosong/kuota habis
                                                                ▼  → {fallback:true}
                                                        (UI jatuh ke skrip lokal)
```

- **Mode Gemini (utama, `PAKAI_GEMINI = true`).** Route server `POST /api/ajari` memanggil **Google Gemini** dengan **rotasi banyak API key** (kuota satu key habis → otomatis lompat ke key berikutnya) dan rantai model berjenjang (`gemini-flash-latest` → `gemini-2.0-flash`). Suhu dipisah per mode (percakapan lebih natural, penilaian lebih reproducible), dengan _safety settings_ untuk konteks pelajar.
- **Mode lokal (cadangan otomatis).** Bila semua key gagal / kuota habis / offline, route membalas `{fallback:true}` dan klien jatuh ke _state machine_ deterministik ("murid mencoba → keliru → dikoreksi → paham") tanpa API key — sehingga **demo tidak pernah mati** saat penjurian.

### RAG grounding ke Kurikulum Merdeka

Jawaban Pio **di-grounding** ke bank materi terverifikasi: materi eksak per-topik diambil langsung bila topik dikenal (bukan pencarian fuzzy, agar topik SD tidak nyasar ke materi SMA); jika tidak, dipakai retrieval berbasis kata kunci atas korpus kurikulum. Materi disuntik ke prompt sebagai satu-satunya sumber kebenaran untuk menekan halusinasi, dan label sumber ditampilkan sebagai chip _"Sumber: Kurikulum Merdeka"_.

### Aliran data

```
Browser (React) ──localStorage── data pengguna (sumber kebenaran)
      │
      ├─(opsional)─ /api/ajari ─── Google Gemini      (kunci di server saja)
      └─(opsional)─ Firebase Auth + Firestore ─────── sinkron antar-perangkat
```

## Teknologi

| Kategori         | Teknologi                                                                                             |
| ---------------- | ----------------------------------------------------------------------------------------------------- |
| Framework        | **Next.js 16.2.10** (App Router)                                                                      |
| UI               | **React 19.2.4**, **TypeScript**                                                                      |
| Styling          | **Tailwind CSS v4** (CSS-first `@theme`, tanpa `tailwind.config`), tema terang/gelap via `data-theme` |
| Ikon             | lucide-react                                                                                          |
| AI               | **Google Gemini** (via route server), dengan mesin murid lokal deterministik sebagai fallback         |
| Cloud (opsional) | **Firebase** 12 — Auth (Google) + Firestore                                                           |
| Lain-lain        | PWA (manifest + ikon `next/og`), header keamanan HTTP di `next.config.ts`, ESLint 9 (flat config)     |

> Node.js 20+ disarankan (Next.js 16 + React 19). Versi Node belum dipatok di `package.json`.

## Konten & Kurikulum

Materi disusun mengikuti **Kurikulum Merdeka (Kemendikbudristek)** dan diverifikasi tim lewat alur _tulis → guru pemeriksa_.

| Aspek            | Jumlah                                                                                   |
| ---------------- | ---------------------------------------------------------------------------------------- |
| Jenjang          | **3** — SD, SMP, SMA                                                                     |
| Dunia / fase     | **7** peta — Fase A–F Kurikulum Merdeka (+ tier lanjutan Kelas 11–12)                    |
| Topik terajarkan | **49** — 41 topik bank soal (SD–SMA) + 8 topik showcase **Fase E**                       |
| Materi ringkas   | **49** — satu materi per topik (konsep, contoh, miskonsepsi umum, cara mengajar)         |
| Soal latihan     | **200+** — 205 soal di bank (41 topik × 5) + soal latihan tiap simpul & Boss Quiz Fase E |
| Medali / lencana | **12**                                                                                   |

Fokus etalase demo adalah **SMA Fase E (Kelas 10)** — Eksponen, SPLTV & Trigonometri — sedangkan cakupan konten membentang **SD hingga SMA, Fase A–F** (Kurikulum Merdeka).

## Privasi & Keamanan

Dirancang dengan prinsip **minim data** dan selaras **UU PDP No. 27/2022**:

- **Sebagai tamu secara default.** Seluruh fitur bisa langsung dipakai sebagai tamu tanpa perlu mendaftar; login tidak dipaksakan. Login Google tetap tersedia sebagai opsi (lihat poin berikut).
- **Data di perangkat.** Progres, memori belajar, profil, dan tema tersimpan di `localStorage` (prefix `ajari-aku:`). Aplikasi adalah _source of truth_ di sisi klien.
- **Cloud sync opsional.** Firebase Auth (Google) + Firestore hanya aktif bila variabel `NEXT_PUBLIC_FIREBASE_*` diisi; jika tidak, aplikasi berjalan penuh dalam mode tamu dan tombol Google disembunyikan.
- **Minimisasi PII.** Saat sinkron, hanya **progres belajar** yang ditulis ke Firestore — **bukan** email/nama/foto.
- **Keamanan basis data = aturan, bukan kerahasiaan kunci.** Kunci `NEXT_PUBLIC_FIREBASE_*` memang publik _by design_ (identifier proyek, bukan rahasia); pengamanannya ada di **Firestore rules**: tiap pengguna hanya bisa membaca/menulis dokumennya sendiri, selebihnya _default deny_.
- **Kunci Gemini hanya di server.** `GEMINI_API_KEY` (opsional `GEMINI_API_KEY_2`…`_5`, atau `GEMINI_API_KEYS` dipisah koma, untuk **rotasi kuota**) dibaca di route server `/api/ajari` dan **tidak pernah** masuk ke bundle browser (tanpa prefix `NEXT_PUBLIC`).
- **Pengerasan endpoint AI.** Rate-limit per-IP, pengecekan origin, batas panjang input & jumlah giliran, serta timeout — untuk mencegah penyalahgunaan dan membatasi biaya token.
- **Hak hapus data.** Pengguna dapat _reset progres_ atau _hapus semua data_ (termasuk salinan cloud bila login) langsung dari halaman Profil.

> **Catatan jujur:** Firebase **App Check belum dipasang** di kode saat ini — pengamanan endpoint Firebase bertumpu pada Firestore rules. App Check dapat ditambahkan sebagai pengerasan lanjutan.

## Struktur Proyek

```
ajari-aku/
├─ app/
│  ├─ page.tsx                 # landing publik
│  ├─ layout.tsx               # metadata & font global
│  ├─ (app)/                   # route group (tak muncul di URL) — shell + navbar
│  │  ├─ beranda/              # dashboard
│  │  ├─ belajar/              # peta petualangan
│  │  │  └─ pilih/             # katalog tingkat
│  │  ├─ ajari/                # layar inti mengajar murid AI
│  │  ├─ kelas/                # ruang kelas murid AI kustom
│  │  ├─ kursus/               # latihan kilat
│  │  ├─ progres/              # progres & pencapaian
│  │  ├─ profil/               # profil & pengaturan
│  │  ├─ tentang/  privasi/    # metodologi & kebijakan data
│  ├─ api/ajari/               # route server → Gemini (satu-satunya API)
│  ├─ manifest.ts, icon.tsx, opengraph-image.tsx, robots.ts, sitemap.ts
│  └─ globals.css              # token desain Tailwind v4
├─ components/                 # app-shell, mascot, auth, gamifikasi, dll.
├─ lib/                        # data & logika: bank-soal, materi, dunia, progress,
│                              # memory, kursus, murid-lokal, achievements, celebrate, ...
├─ firestore.rules             # aturan keamanan database
└─ next.config.ts              # header keamanan HTTP
```

## Aksesibilitas & Performa

- **Responsif** — tata letak menyesuaikan ponsel hingga desktop (navbar atas + bottom-nav mobile).
- **Tema terang & gelap** dengan anti-kedip saat memuat.
- **Ringan** — tanpa gambar berat; ikon dirender sebagai vektor, animasi hemat.
- **Dapat dipasang (PWA)** dan tetap berguna pada koneksi terbatas (mode lokal tanpa panggilan jaringan).

## Batasan & Rencana Lanjutan

Untuk transparansi penilaian:

- **Murid AI ditenagai Google Gemini** (`PAKAI_GEMINI = true`) dengan rotasi banyak API key; bila semua key kehabisan kuota, otomatis jatuh ke mesin lokal deterministik agar demo tetap jalan.
- **Skor "paham" pada Rapor Sesi** adalah indikator refleksi/kemajuan, **bukan asesmen tervalidasi**.
- **App Check belum dipasang** (lihat catatan di [Privasi & Keamanan](#privasi--keamanan)).
- Rencana lanjutan: memperbanyak topik ber-skrip pada mode lokal, dan menambah katalog kursus.

## Tim

**POWERRANGERS** — TIC 9.0, subtema Pendidikan Berkualitas.

| Nama                     | Peran                    |
| ------------------------ | ------------------------ |
| _Rahma Lindungi Laowo_   | Ketua - Pengembang Web   |
| _Dyah Ayu Kusuma Wibawa_ | Member - Konsep & Produk |

## Kredit & Sumber

- **Kurikulum Merdeka** — Kemendikbudristek (acuan materi & fase).
- **OECD, PISA 2022** — data latar belakang kemampuan matematika.
- Chase, Chin, Oppezzo & Schwartz (2009) — dasar ilmiah _protégé effect_.
- Dibangun dengan Next.js, React, Tailwind CSS, dan Firebase.

---

<p align="center"><em>Ajari Aku — karena cara terbaik memahami sesuatu adalah dengan mengajarkannya.</em></p>
