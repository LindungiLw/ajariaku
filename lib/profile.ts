// Profil Pengajar, identitas pengguna sebagai "guru".
// Disimpan di perangkat (localStorage), tanpa wajib login. Dipakai agar murid AI
// memanggil pengguna dengan nama yang dipilih, dan agar nama murid AI bisa
// diganti sesuai selera siswa.

export type Pengajar = {
  nama: string;
  gelar: string; // Kak / Bu / Pak / Bu Guru / Pak Guru
  muridNama: string; // default "Pio"
  muridChar: string; // id karakter murid AI (lihat lib/characters), default "pio"
  jenjang?: string; // "SD" | "SMP" | "SMA", dari onboarding, menyetel dunia default di Belajar
};

export const GELAR_OPSI = ["Kak", "Bu", "Pak", "Bu Guru", "Pak Guru"];

// Default murid AI, SATU sumber kebenaran, dirujuk semua fallback `|| "..."` di seluruh app.
export const DEFAULT_MURID_NAMA = "Pio";
export const DEFAULT_MURID_CHAR = "pio";

export const DEFAULT_PENGAJAR: Pengajar = {
  nama: "",
  gelar: "Kak",
  muridNama: DEFAULT_MURID_NAMA,
  muridChar: DEFAULT_MURID_CHAR,
};

const KEY = "ajari-aku:pengajar";

export function loadPengajar(): Pengajar | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<Pengajar>;
    return {
      nama: p.nama ?? "",
      gelar: p.gelar || "Kak",
      muridNama: p.muridNama || DEFAULT_MURID_NAMA,
      muridChar: p.muridChar || DEFAULT_MURID_CHAR,
      jenjang: p.jenjang,
    };
  } catch {
    return null;
  }
}

export function savePengajar(p: Pengajar) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* abaikan bila storage diblokir */
  }
}

// "Bu Andi", "Kak Sinta", dst. Kalau nama kosong, pakai gelarnya saja.
export function sapaan(p: Pengajar | null | undefined): string {
  if (!p) return "Kak";
  const nama = p.nama?.trim();
  return nama ? `${p.gelar} ${nama}`.trim() : p.gelar || "Kak";
}

export function namaMurid(p: Pengajar | null | undefined): string {
  return p?.muridNama?.trim() || DEFAULT_MURID_NAMA;
}
