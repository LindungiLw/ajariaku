// Heuristik tunggal: apakah teks guru terlihat seperti LANGKAH matematika nyata?
// Dipakai murid AI lokal (murid-lokal.ts) & balasan cadangan API (ajari-fallback.ts) agar
// murid tak pernah "paham" atas input acak. Satu sumber → ambang & kata kunci konsisten.
const OP_SIMBOL = /[0-9+\-×÷*/=^√]/;
const OP_KATA = /(bagi|kali|tambah|kurang|pangkat|akar|pindah|ruas|jumlah|faktor|sederhana|langkah)/;

export function looksLikeMath(text: string, minLen = 10): boolean {
  const t = text.toLowerCase();
  return (OP_SIMBOL.test(text) || OP_KATA.test(t)) && text.trim().length >= minLen;
}
