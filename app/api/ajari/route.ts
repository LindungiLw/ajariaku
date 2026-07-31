import { NextResponse } from "next/server";
import { retrieve } from "@/lib/kurikulum";
import { materiById } from "@/lib/materi";
import { topikById } from "@/lib/bank-soal";
import { DEFAULT_MURID_NAMA } from "@/lib/profile";

// Otak murid AI "Pio": Google Gemini (free tier).
// Satu API key milik tim, disimpan server-side (TIDAK pernah ke browser).
// Kalau key belum diisi / kuota habis / error → balas { fallback: true }
// supaya klien memakai skrip cadangan (demo tidak pernah mati).

// Rantai model: dicoba berurutan saat error sementara/kuota (tiap model punya bucket kuota terpisah).
const MODELS = (process.env.GEMINI_MODEL || "gemini-flash-latest,gemini-2.0-flash")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
// Beberapa API key Gemini → ROTASI otomatis: kuota key habis (429) atau key tak valid (400/401/403) → coba berikutnya.
// Isi via env: GEMINI_API_KEY (utama) + GEMINI_API_KEY_2..10, ATAU GEMINI_API_KEYS (banyak key dipisah koma).
const KEYS = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY_4,
  process.env.GEMINI_API_KEY_5,
  process.env.GEMINI_API_KEY_6,
  process.env.GEMINI_API_KEY_7,
  process.env.GEMINI_API_KEY_8,
  process.env.GEMINI_API_KEY_9,
  process.env.GEMINI_API_KEY_10,
  process.env.GEMINI_API_KEYS,
]
  // Dukung banyak key dipisah KOMA di variabel MANA PUN (key Gemini tak pernah memuat koma),
  // jadi menaruh "key1,key2" di GEMINI_API_KEY sekalipun tetap terbaca sebagai 2 key, bukan 1 key rusak.
  .flatMap((v) => (v ?? "").split(","))
  .map((k) => k.trim())
  .filter(Boolean)
  .filter((k, i, a) => a.indexOf(k) === i); // buang duplikat

// Batas durasi fungsi (Vercel): harus > timeout abort di callGemini (20s).
export const maxDuration = 30;

// Batas input untuk cegah penyalahgunaan biaya token & prompt raksasa.
const MAX_TURNS = 24; // ambil hanya giliran terakhir
const MAX_TEXT = 1000; // char per giliran
const MAX_FIELD = 400; // char untuk topic/soal/dll
const cap = (s: unknown, n = MAX_FIELD) => String(s ?? "").slice(0, n);

// Rate limit sederhana per-IP (best-effort; per instance serverless).
// RL_MAX agak longgar karena satu kelas/venue bisa berbagi 1 IP (NAT).
const RL_MAX = 40;
const RL_WIN = 60_000;
const rlHits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (rlHits.get(ip) ?? []).filter((t) => now - t < RL_WIN);
  if (arr.length >= RL_MAX) {
    rlHits.set(ip, arr);
    return true;
  }
  arr.push(now);
  rlHits.set(ip, arr);
  // Prune sesekali agar Map tak tumbuh tak terbatas (per instance).
  if (rlHits.size > 2000) {
    for (const [k, v] of rlHits) if (!v.some((t) => now - t < RL_WIN)) rlHits.delete(k);
  }
  return false;
}

// Hanya izinkan panggilan dari origin sendiri (localhost / domain produksi / *.vercel.app).
function allowedOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // same-origin / server-to-server (tanpa header Origin)
  try {
    const h = new URL(origin).hostname;
    if (h === "localhost" || h === "127.0.0.1") return true;
    // Same-origin: Origin cocok dengan host yang MELAYANI request → sah untuk domain produksi
    // (vercel.app maupun kustom) TANPA membuka pintu ke situs *.vercel.app milik pihak lain.
    const host = req.headers.get("host");
    if (host && h === host.split(":")[0]) return true;
    const site = process.env.NEXT_PUBLIC_SITE_URL;
    if (site && new URL(site).hostname === h) return true;
  } catch {
    /* origin tak valid → tolak */
  }
  return false;
}

type Turn = { role: "user" | "model"; text: string };
type GeminiContent = { role: "user" | "model"; parts: { text: string }[] };

// Guardrail keamanan konten (app dipakai pelajar): blokir konten berbahaya.
const SAFETY = [
  { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
];

function materiBlock(materi: string, profil: string) {
  return `
MATERI ACUAN (jadikan SATU-SATUNYA sumber kebenaran; jangan menyimpang atau mengarang di luar ini):
${materi || "(tidak ada, jawab seadanya sesuai pengetahuan dasar matematika sesuai jenjang topik)"}

PROFIL SISWA (memori dari sesi sebelumnya, jika ada, pakai untuk menyesuaikan fokus):
${profil || "(belum ada, ini sesi awal)"}`;
}

function chatSystem(
  topic: string,
  soal: string,
  materi: string,
  profil: string,
  murid: string,
  karakter: string,
  sapaan: string,
  jenjang: string,
  gaya: string,
) {
  const gayaHint =
    gaya === "langkah"
      ? "Guru mengajar LANGKAH DEMI LANGKAH: fokuskan tanggapanmu pada SATU langkah yang barusan ia tulis; kalau langkah itu benar, dorong ia lanjut ke langkah berikutnya. Jaga balasan sangat singkat (1-2 kalimat)."
      : "Guru menjelaskan secara MENGALIR/bebas: tanggapi penjelasannya secara utuh dan ajukan satu pertanyaan lanjutan bila perlu.";
  // Gaya & PANJANG balasan menyesuaikan jenjang (SD paling pendek & sederhana; SMA lebih dewasa & ringkas).
  const jenjangHint =
    jenjang === "SD"
      ? "Kamu setara anak SD: pakai bahasa SANGAT sederhana dan ceria, kalimat PENDEK, MAKSIMAL 2 kalimat. Hindari istilah rumit; boleh pakai contoh benda sehari-hari."
      : jenjang === "SMP"
        ? "Kamu setara anak SMP: bahasa santai khas remaja, ringkas, MAKSIMAL 3 kalimat pendek."
        : "Kamu setara pelajar SMA: bahasa lebih dewasa, lugas, dan ringkas, MAKSIMAL 3 kalimat. Boleh pakai istilah matematika yang tepat; JANGAN kekanak-kanakan atau berlebihan emoji.";
  return `Kamu adalah "${murid}", seorang murid AI (setara jenjang ${jenjang}) yang ramah dan sedang BELAJAR Matematika dengan cara diajari oleh pengguna yang berperan sebagai guru.${karakter ? ` Watak khasmu: ${karakter}. Biarkan watak ini terasa halus di gaya bicaramu, tanpa melanggar aturan bermain di bawah.` : ""} ${jenjangHint} Panggil pengguna dengan sebutan "${sapaan}".
Topik: ${topic}. Soal yang sedang dipelajari: ${soal}.
Kamu SUDAH menyapa lebih dulu, jadi jangan mengulang salam.
${materiBlock(materi, profil)}

Aturan bermain:
- Berperan sebagai murid penasaran, sopan, pakai bahasa Indonesia santai sesuai jenjangmu. Emoji MAKSIMAL 1 dan HARUS sesuai suasana (bingung 😅 atau 🤔, senang 😊 atau 🎉). Balas SINGKAT seperti chat, patuhi batas jumlah kalimat jenjangmu di atas.
- ${gayaHint}
- Kamu diam-diam TAHU jawaban benar dari MATERI ACUAN, tapi tetap berperan sebagai murid, jangan langsung menggurui.
- Pada giliranmu yang PERTAMA menanggapi penjelasan guru, tunjukkan TEPAT SATU miskonsepsi umum yang relevan (utamakan dari "Kesalahan umum siswa" di MATERI ACUAN) yang SEDERHANA dan jelas (satu kesalahan saja, JANGAN berbelit-belit) sebagai tebakanmu sendiri: set mood "oops" dan understood=false. Guru HARUS punya kesempatan mengoreksimu, jadi JANGAN langsung benar di giliran pertama.
- Jika PROFIL SISWA menunjukkan kelemahan tertentu, arahkan pertanyaanmu ke konsep itu.
- Jangan menyebut jawaban akhir sebelum guru benar-benar menuntunmu ke sana.

PENTING, cara menyikapi penjelasan guru (pengguna):
- Kalau penjelasan guru BENAR: ikuti dengan antusias, boleh tanya lanjutan untuk memperdalam.
- Kalau penjelasan guru SALAH secara matematis: JANGAN menerimanya sebagai benar. Berperan bingung dan pancing lewat pertanyaan atau contoh tandingan agar guru sadar sendiri. Contoh: "Hmm, tapi kalau cara itu aku pakai ke [contoh kecil], kok hasilnya aneh ya Kak? Coba cek lagi?". mood: "curious" atau "oops".
- Kalau setelah 1-2 kali dipancing guru MASIH salah: koreksi dengan LEMBUT sambil tetap dalam karakter, seolah ingat dari catatan: "Oh aku baru inget dari catatan, kayaknya yang benar itu [konsep benar dari MATERI ACUAN], bener gitu ya Kak?". Jangan biarkan kesalahan menempel.
- Kalau input guru NGACO / tidak nyambung / bukan penjelasan matematika (kata acak, ngobrol di luar topik, kosong): jangan ikut melantur. Bingung dengan sopan dan arahkan balik ke soal: "Waduh Kak, itu kayaknya belum nyambung sama soal ${soal} 😅 Coba jelasin pelan-pelan langkahnya?". mood: "curious".
- Kalau guru bilang tidak tahu / menyerah: beri semangat + SATU petunjuk kecil, jangan langsung kasih jawaban penuh.
- JANGAN pernah set "understood": true kalau penjelasan guru belum benar dan lengkap. understood=true HANYA saat penjelasan guru sudah benar sesuai MATERI ACUAN dan menuntunmu ke jawaban yang tepat.
- Set "dikoreksi": true HANYA pada giliran di mana guru BARU SAJA membetulkan miskonsepsi yang tadi kamu buat (kamu jadi paham hal yang sebelumnya keliru). Di giliran lain, "dikoreksi": false.

Keluarkan HANYA JSON valid tanpa teks lain, bentuknya:
{"reply": string, "mood": "happy" | "curious" | "oops", "understood": boolean, "dikoreksi": boolean}`;
}

function raporSystem(topic: string, soal: string, materi: string, profil: string) {
  return `Kamu adalah penilai pembelajaran. Berdasarkan transkrip percakapan di mana PENGGUNA mengajari murid AI tentang ${topic} (soal: ${soal}), nilai kualitas MENGAJAR pengguna dan seberapa dalam pemahamannya.
Deteksi miskonsepsi / celah pemahaman dari CARA pengguna menjelaskan (bukan dari jawaban murid). Bandingkan penjelasan pengguna dengan MATERI ACUAN.
Jika pengguna menjelaskan sesuatu yang KELIRU, sebutkan SPESIFIK di "lemah" (apa yang salah dan apa yang benar menurut MATERI ACUAN) dan turunkan "mastery" sesuai tingkat kekeliruannya. Ini justru inti aplikasi: menemukan celah yang tersembunyi.
Jika ada PROFIL SISWA, perhatikan apakah konsep yang dulu lemah kini membaik.
Bahasa Indonesia, ringkas, membangun, tidak menghakimi.
${materiBlock(materi, profil)}

Keluarkan HANYA JSON valid tanpa teks lain, bentuknya:
{
  "mastery": number (0-100),
  "konsep": [ { "label": string, "level": "good" | "mid" | "weak", "pct": number (0-100) } ],  // 2-4 item
  "kuat": string,          // 1 kalimat: yang sudah baik
  "lemah": string,         // 1 kalimat: yang perlu diperkuat
  "rekomendasi": string    // 1 kalimat: langkah berikutnya
}`;
}

// Status HTTP yang layak dicoba-ulang (sementara/kuota), beda dari error auth (400/401/403).
const RETRYABLE = new Set([408, 429, 500, 502, 503, 504]);

// Satu kali panggilan ke satu model. Mengembalikan { status, data }.
async function generateOnce(
  key: string,
  model: string,
  system: string,
  contents: GeminiContent[],
  genCfg: Record<string, unknown>,
): Promise<{ status: number; data: unknown; err?: string }> {
  // Key dikirim via HEADER (bukan query string) agar tak bocor ke log perantara.
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  // Model "thinking" (2.5 / *-latest) memakai token untuk BERPIKIR sebelum menjawab, dan itu ikut
  // dihitung dalam maxOutputTokens → jatah 700 habis untuk berpikir sehingga JSON jawaban TERPOTONG
  // (SyntaxError saat parse). Untuk model ini: batasi budget berpikir + beri jatah token lebih besar.
  const thinking = /(?:-latest|2\.5)/.test(model);
  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), 15000);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": key },
      signal: ctrl.signal,
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents,
        safetySettings: SAFETY,
        generationConfig: {
          responseMimeType: "application/json",
          maxOutputTokens: thinking ? 2048 : 700,
          ...(thinking ? { thinkingConfig: { thinkingBudget: 512 } } : {}),
          ...genCfg,
        },
      }),
    });
    if (!res.ok) {
      const body = (await res.text().catch(() => "")).slice(0, 300);
      // Log status supaya bisa dibedakan: 400 key salah / 403 / 429 kuota / 500.
      console.error("[gemini]", model, "HTTP", res.status, body);
      return { status: res.status, data: null, err: body };
    }
    const data = await res.json();
    const text: string =
      data?.candidates?.[0]?.content?.parts
        ?.map((p: { text?: string }) => p.text ?? "")
        .join("") ?? "";
    if (!text) {
      console.error("[gemini]", model, "respons kosong (kemungkinan diblokir safety)");
      return { status: 200, data: null };
    }
    return { status: 200, data: JSON.parse(text) };
  } catch (e) {
    console.error("[gemini]", model, "gagal:", (e as Error)?.name ?? e);
    return { status: 0, data: null }; // jaringan/abort/parse
  } finally {
    clearTimeout(timeout);
  }
}

// Coba SATU key melintasi rantai model (1x retry-backoff untuk error sementara sebelum pindah model).
// Balikan: { data } bila sukses; { fatal } bila 400 (permintaan salah, key lain tak menolong);
// {} bila key ini habis/invalid di semua model → pemanggil rotasi ke key berikutnya.
async function tryWithKey(
  key: string,
  system: string,
  contents: GeminiContent[],
  genCfg: Record<string, unknown>,
): Promise<{ data?: unknown; fatal?: boolean }> {
  for (let i = 0; i < MODELS.length; i++) {
    const model = MODELS[i];
    let r = await generateOnce(key, model, system, contents, genCfg);
    if (r.data) return { data: r.data };
    if (RETRYABLE.has(r.status)) {
      await new Promise((res) => setTimeout(res, 450 + i * 300));
      r = await generateOnce(key, model, system, contents, genCfg);
      if (r.data) return { data: r.data };
    }
    if (r.status === 400) {
      // Google balas 400 untuk DUA hal: key tak valid (pesan "API key not valid" / API_KEY_INVALID)
      // atau permintaan cacat. Key tak valid → ROTASI ke key berikutnya (jangan sampai satu key
      // salah memblokir key lain); permintaan cacat → fatal (key lain tak menolong).
      if (/api[_ ]?key/i.test(r.err ?? "")) break;
      return { fatal: true };
    }
    if (r.status === 401 || r.status === 403) break; // key ini invalid → coba key berikutnya
    // 429 (kuota) / 5xx / 404 / jaringan → coba model berikutnya pada key yang sama
  }
  return {}; // semua model pada key ini gagal → rotasi ke key berikutnya
}

// Coba tiap KEY berurutan → ROTASI saat kuota habis (429) / key invalid. Kembali null → klien pakai fallback lokal.
// Suhu dipisah per-mode: rapor RENDAH (reproducible → klaim "diagnostik" konsisten), chat SEDANG.
async function callGemini(system: string, contents: GeminiContent[], mode: string) {
  const isRapor = mode === "rapor";
  const genCfg: Record<string, unknown> = isRapor
    ? { temperature: 0.2, topP: 0.8, topK: 20 }
    : { temperature: 0.55 };

  // Mulai dari key ACAK lalu berputar melewati SEMUA key → beban tersebar rata ke seluruh key
  // (tak selalu menghajar key #1), jadi batas per-menit tiap key jarang kena saat banyak pengguna
  // barengan. Tetap mencoba semua key sebelum menyerah ke fallback lokal.
  const start = KEYS.length > 1 ? Math.floor(Math.random() * KEYS.length) : 0;
  for (let n = 0; n < KEYS.length; n++) {
    const key = KEYS[(start + n) % KEYS.length];
    const r = await tryWithKey(key, system, contents, genCfg);
    if (r.data) return r.data;
    if (r.fatal) return null; // 400 → jangan buang-buang key lain
  }
  return null;
}

export async function POST(req: Request) {
  if (!KEYS.length) return NextResponse.json({ fallback: true });

  if (!allowedOrigin(req)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  // Rate-limit per-IP nyata; kalau tak ada X-Forwarded-For (dev/self-host), lewati saja
  // daripada menaruh semua orang di satu bucket global 'anon'.
  const xff = req.headers.get("x-forwarded-for");
  const ip = xff ? xff.split(",")[0].trim() : "";
  if (ip && rateLimited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: {
    mode?: string;
    gaya?: string;
    topic?: string;
    topikId?: string;
    soal?: string;
    profil?: string;
    murid?: string;
    karakter?: string;
    sapaan?: string;
    history?: Turn[];
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ fallback: true });
  }

  const {
    mode = "chat",
    gaya = "langkah",
    topic = "",
    topikId = "",
    soal = "",
    profil = "",
    murid = DEFAULT_MURID_NAMA,
    karakter = "",
    sapaan = "Kak",
    history = [],
  } = body;

  const contents: GeminiContent[] = (Array.isArray(history) ? history : [])
    .filter((t) => t && t.text)
    .slice(-MAX_TURNS) // hanya giliran terakhir → batasi ukuran prompt
    .map((t) => ({
      role: t.role === "user" ? "user" : "model",
      parts: [{ text: String(t.text).slice(0, MAX_TEXT) }],
    }));

  if (contents.length === 0) return NextResponse.json({ fallback: true });

  if (mode === "rapor") {
    // pastikan diakhiri giliran "user" yang meminta rapor
    contents.push({
      role: "user",
      parts: [{ text: "Sekarang buatkan rapor sesi dalam format JSON yang diminta." }],
    });
  }

  // Grounding: pakai materi EKSAK per-topik bila topikId dikenal (deterministik & sesuai
  // jenjang SD sampai SMA), bukan pencarian fuzzy yang bisa nyasar ke materi SMA untuk topik SD.
  const exact = topikId ? materiById(topikId) : undefined;
  const jenjang = (topikId ? topikById(topikId)?.jenjang : "") || "SMA";

  let materi: string;
  let sumber: string[]; // untuk chip "grounding terlihat"
  if (exact) {
    materi =
      `- [${topic}] ${cap(exact.konten, 1400)}\nContoh: ${cap(exact.contoh, 900)}` +
      (exact.miskonsepsi ? `\nKesalahan umum siswa: ${cap(exact.miskonsepsi, 900)}` : "");
    sumber = topic ? [topic] : [];
  } else {
    // Fallback (topik tanpa materi eksak): pencarian RAG dari korpus kurikulum.
    const lastUser = [...(history ?? [])].reverse().find((t) => t.role === "user")?.text ?? topic;
    const hits = retrieve(String(lastUser), topic, 3);
    materi = hits
      .map(
        (m) =>
          `- [${m.konsep}] ${m.konten} Contoh: ${m.contoh}` +
          (m.miskonsepsi ? ` Kesalahan umum siswa: ${m.miskonsepsi}` : ""),
      )
      .join("\n");
    sumber = [...new Set(hits.map((h) => h.konsep))].slice(0, 3);
  }

  const system =
    mode === "rapor"
      ? raporSystem(cap(topic), cap(soal), materi, cap(profil, 800))
      : chatSystem(cap(topic), cap(soal), materi, cap(profil, 800), cap(murid, 40) || DEFAULT_MURID_NAMA, cap(karakter, 200), cap(sapaan, 20) || "Kak", jenjang, gaya === "chat" ? "chat" : "langkah");
  const out = await callGemini(system, contents, mode);
  if (!out) return NextResponse.json({ fallback: true });
  return NextResponse.json({ ...out, sumber });
}
