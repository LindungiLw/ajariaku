// Rapikan tampilan matematika untuk teks kurikulum & chat:
//   a^m → aᵐ, a^(m+n) → aᵐ⁺ⁿ, x^2 → x², r^(n-1) → rⁿ⁻¹
//   "2 log 8" → ²log 8, "a log b" → ᵃlog b (notasi logaritma gaya Indonesia)
//   <= → ≤, >= → ≥, != → ≠, -> → →, sqrt(/akar( → √(, " . " → " · "
//   " x " → " × " HANYA di antara operand angka/kurung/superscript (jaga variabel x utuh)
// Dipakai di halaman Belajar, /ajari, DemoSesi. Idempoten (aman dipanggil berkali-kali).

// Superscript: digit, tanda, dan huruf variabel yang punya bentuk Unicode superscript.
const SUP: Record<string, string> = {
  "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
  "+": "⁺", "-": "⁻", "(": "⁽", ")": "⁾", "=": "⁼",
  a: "ᵃ", b: "ᵇ", c: "ᶜ", d: "ᵈ", e: "ᵉ", i: "ⁱ", k: "ᵏ", l: "ˡ", m: "ᵐ", n: "ⁿ", o: "ᵒ",
  p: "ᵖ", r: "ʳ", s: "ˢ", t: "ᵗ", u: "ᵘ", v: "ᵛ", w: "ʷ", x: "ˣ", y: "ʸ",
};

function toSup(s: string): string {
  return s
    .split("")
    .map((c) => SUP[c] ?? SUP[c.toLowerCase()] ?? c)
    .join("");
}

export function prettyMath(t: string): string {
  return t
    // pangkat BERKURUNG: a^(m+n), 2^(-3), r^(n-1), makan kedua kurung, dukung tanda +/-
    .replace(/\^\(([0-9a-z+\-]+)\)/gi, (_, g: string) => toSup(g))
    // pangkat POLOS: a^m, x^2, (a^m)^n, hanya huruf/angka, berhenti di kurung/spasi (tak makan ')' luar)
    .replace(/\^([0-9a-z]+)/gi, (_, g: string) => toSup(g))
    // basis logaritma: "2 log 8" → ²log 8 ; "a log b" → ᵃlog b (base = token berdiri sendiri)
    .replace(/\b([0-9a-z])\s+log\b/gi, (_, b: string) => toSup(b) + "log")
    .replace(/<=/g, "≤")
    .replace(/>=/g, "≥")
    .replace(/!=/g, "≠")
    .replace(/->/g, "→")
    .replace(/\bsqrt\(/gi, "√(")
    .replace(/\bakar\(/gi, "√(")
    .replace(/ \. /g, " · ")
    // " x " (kali) → " × " HANYA jika diapit angka/kurung/superscript → variabel x tetap utuh.
    // Tangkap karakter kiri ($1) alih-alih lookbehind: lookbehind bikin SyntaxError parse-time di Safari/iOS < 16.4.
    .replace(/([0-9)²³⁰¹⁴⁵⁶⁷⁸⁹ⁿ⁾])\s*x\s*(?=[0-9(])/g, "$1 × ");
}

// Estimasi waktu baca (menit) dari jumlah kata (≈200 kata/menit), minimal 1.
export function estimasiMenit(teks: string): number {
  const kata = (teks || "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(kata / 200));
}
