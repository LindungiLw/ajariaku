import { type ReactNode } from "react";
import { prettyMath } from "@/lib/pretty-math";

// Teks materi dengan RUMUS/PERSAMAAN inline disorot jadi "chip" halus (biar menonjol dari kalimat).
// Deteksi: run yang mengandung operator (= × · ÷ √ ≤ ≥ → pangkat) & BUKAN kata biasa (kecuali "log").
// Prosa tetap prosa; hanya persamaan yang dibungkus. Aman: run min 2 char → tak ada loop kosong.
export function MathRich({ children }: { children: string }) {
  const text = prettyMath(children ?? "");
  const CAND = /[0-9A-Za-z(√][0-9A-Za-z(√)⁰¹²³⁴⁵⁶⁷⁸⁹ⁿⁱᵃᵇᶜᵈᵉᵐˣᵗᵘᵛ⁺⁻⁽⁾.,/×·÷√+\-=<>≤≥≠→ ]*[0-9A-Za-z)⁰¹²³⁴⁵⁶⁷⁸⁹ⁿ=×·√]/g;
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  while ((m = CAND.exec(text)) !== null) {
    const s = m[0];
    const hasOp = /[=×·÷√≤≥≠→⁰¹²³⁴⁵⁶⁷⁸⁹ⁿ⁺⁻]/.test(s);
    const hasWord = /[a-zA-Z]{3,}/.test(s.replace(/log/gi, ""));
    if (!hasOp || hasWord || s.length < 2) continue;
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(
      <span key={key++} className="mx-[1px] rounded bg-[var(--tint)]/45 px-1 py-[1px] font-display text-[0.96em] font-bold text-[var(--primary-deep)] tnum">
        {s}
      </span>,
    );
    last = m.index + s.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}

// Satu kalimat langkah, sudah diklasifikasi hitungan vs prosa.
type Seg = { raw: string; label: string; body: string; hitung: boolean };

// Pecah teks langkah jadi kalimat, lalu tandai mana klausa HITUNGAN (mengandung "=").
// Pisah pada ". " atau baris baru, JANGAN pada titik ribuan "1.000" (itu tanpa spasi di belakang titik).
function pisahLangkah(text: string): Seg[] {
  return text
    .split(/\.\s+|\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((raw): Seg => {
      // Peel label pendek berakhiran ':' (mis. "Jumlahkan satuan:") supaya tak ikut masuk kotak.
      const mLabel = raw.match(/^([^:=]{1,26}):\s*/);
      const label = mLabel ? mLabel[1].trim() + ":" : "";
      const body = (mLabel ? raw.slice(mLabel[0].length) : raw).trim();
      // Klausa HITUNGAN yang layak dikotakkan: ada "=", diawali angka/kurung/akar/variabel (U,S,x,y dll)
      // BUKAN bullet "-" atau enumerasi "3) ", dan sedikit kata (anotasi seperti "maka", "jadi").
      const kata = (body.match(/[A-Za-zÀ-ſ]{2,}/g) || []).length;
      const hitung =
        /=/.test(body) &&
        /^[\d(√A-Zxyzf]/i.test(body) &&
        !/^\d{1,2}[).]\s/.test(body) &&
        body.length <= 85 &&
        kata <= 5;
      return { raw, label, body, hitung };
    });
}

// Tata langkah rapi: klausa HITUNGAN dikotakkan, lalu panah → menunjuk kalimat PENJELASANNYA.
// Supaya rumus tak bercampur dengan kalimat. Dipakai di contoh materi & pembahasan quiz.
// Kalau teks tak punya klausa hitungan sama sekali, jatuh balik ke render biasa (MathRich).
export function Hitung({ text }: { text: string }) {
  const segs = pisahLangkah(text ?? "");
  if (!segs.some((s) => s.hitung)) return <MathRich>{text ?? ""}</MathRich>;

  const rows: ReactNode[] = [];
  for (let i = 0; i < segs.length; i++) {
    const s = segs[i];
    if (!s.hitung) {
      rows.push(
        <p key={rows.length} className="text-[14px] leading-relaxed text-ink-soft">
          <MathRich>{s.raw}</MathRich>
        </p>,
      );
      continue;
    }
    // Klausa hitungan → kotak. Penjelasan = kalimat prosa TEPAT setelahnya (kalau ada) → panah.
    const next = segs[i + 1];
    const penjelasan = next && !next.hitung ? next : null;
    if (penjelasan) i++; // konsumsi penjelasan supaya tak dobel dirender
    rows.push(
      <div key={rows.length} className="flex flex-wrap items-start gap-x-2 gap-y-1">
        <span className="inline-flex items-center rounded-lg border border-[var(--primary)]/25 bg-[var(--tint)]/45 px-2.5 py-1 font-display text-[13.5px] font-bold leading-snug text-[var(--primary-deep)] tnum">
          {s.label && <span className="mr-1.5 font-sans text-[11px] font-semibold text-ink-soft">{s.label}</span>}
          {prettyMath(s.body)}
        </span>
        {penjelasan && (
          <>
            <span className="mt-0.5 flex-none select-none text-base font-bold text-[var(--primary)]" aria-hidden>
              →
            </span>
            <span className="flex-1 pt-0.5 text-[14px] leading-relaxed text-ink-soft">
              <MathRich>{penjelasan.raw}</MathRich>
            </span>
          </>
        )}
      </div>,
    );
  }
  return <div className="flex flex-col gap-1.5">{rows}</div>;
}

// Format blok teks panjang (Materi) menjadi struktur rapi: Heading (semua kapital), List, Paragraf.
export function ProseRich({ children }: { children: string }) {
  if (!children) return null;
  const lines = children.split("\n").filter((l) => l.trim().length > 0);
  
  return (
    <div className="flex flex-col gap-3">
      {lines.map((line, i) => {
        const t = line.trim();
        // Deteksi Heading: Jika huruf kapital semua dan bukan angka saja, min 4 char
        const isHeading = t === t.toUpperCase() && /[A-Z]{3,}/.test(t);
        // Deteksi List: dimulai dari "1. ", "1) ", atau "- "
        const isList = /^(\d+[.)]|-)\s/.test(t);

        if (isHeading) {
          return (
            <h3 key={i} className="mt-4 first:mt-0 font-display text-[15px] font-bold uppercase tracking-widest text-[var(--primary)]/90">
              {t}
            </h3>
          );
        }

        if (isList) {
          // Buat list item dengan indentasi gantung yang rapi
          const match = t.match(/^(\d+[.)]|-)\s(.*)/);
          if (match) {
            return (
              <div key={i} className="flex gap-2 text-[15px] leading-relaxed text-ink">
                <span className="flex-none font-bold text-ink-soft opacity-80">{match[1]}</span>
                <p className="min-w-0 flex-1"><MathRich>{match[2]}</MathRich></p>
              </div>
            );
          }
        }

        // Paragraf biasa
        return (
          <p key={i} className="text-[15px] leading-relaxed text-ink">
            <MathRich>{t}</MathRich>
          </p>
        );
      })}
    </div>
  );
}
