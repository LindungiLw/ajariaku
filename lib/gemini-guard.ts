// Batas harian PER-PERANGKAT untuk panggilan Gemini: cegah satu orang memboroskan kuota tim.
// Client-side (localStorage), tanpa wajib login. Lewat batas → app pakai mode lokal (gratis, skrip).
// Reset otomatis tiap hari. Angka CAP gampang disetel.

const KEY = "ajari-aku:gemini-harian";
const CAP = 40; // maksimum panggilan Gemini per hari per perangkat (chat + rapor digabung)

function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function load(): { date: string; count: number } {
  if (typeof window === "undefined") return { date: today(), count: 0 };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw) as { date: string; count: number };
      if (p && p.date === today() && typeof p.count === "number") return p;
    }
  } catch {
    /* storage diblokir → anggap 0 (biar tetap bisa dipakai) */
  }
  return { date: today(), count: 0 };
}

// Masih boleh memanggil Gemini hari ini di perangkat ini?
export function geminiAllowed(): boolean {
  return load().count < CAP;
}

// Catat satu panggilan Gemini yang benar-benar dilakukan (menambah hitungan hari ini).
export function noteGeminiCall(): void {
  if (typeof window === "undefined") return;
  try {
    const cur = load();
    window.localStorage.setItem(KEY, JSON.stringify({ date: cur.date, count: cur.count + 1 }));
  } catch {
    /* abaikan */
  }
}

// Sisa jatah hari ini (untuk info UI bila perlu).
export function geminiSisa(): number {
  return Math.max(0, CAP - load().count);
}
