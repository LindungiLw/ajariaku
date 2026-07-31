// Tema terang/gelap, SATU sumber kebenaran: atribut data-theme di <html> + localStorage.
// Dipakai ThemeToggle (navbar) & pengaturan Profil supaya tak ada logika tema yang tersebar/bercabang.
// Catatan: skrip anti-FOUC di app/layout.tsx sengaja berdiri sendiri (jalan SEBELUM hydrate).
const KEY = "ajari-aku:tema";
export type Tema = "light" | "dark";

export function isDark(): boolean {
  return typeof document !== "undefined" && document.documentElement.getAttribute("data-theme") === "dark";
}

export function applyTema(t: Tema) {
  if (typeof document !== "undefined") document.documentElement.setAttribute("data-theme", t);
  try {
    window.localStorage.setItem(KEY, t);
  } catch {
    /* storage diblokir, abaikan */
  }
}

// Terapkan tema tersimpan ke <html> saat mount (jaring pengaman; skrip anti-FOUC di layout
// sudah melakukannya sebelum hydrate). Aman bila storage kosong/diblokir.
export function restoreTema() {
  try {
    const t = window.localStorage.getItem(KEY);
    if (t === "dark" || t === "light") document.documentElement.setAttribute("data-theme", t);
  } catch {
    /* abaikan */
  }
}
