// Sistem avatar berlapis (SVG): bentuk wajah + warna + rambut + kacamata + aksesori.
// Dipakai <Mascot avatar={spec} /> (baru) atau <Mascot char="pio" /> (lama → preset).

export type HeadShape = "bulat" | "oval" | "kotak";
export type HairId = "none" | "poni" | "jambul" | "keriting" | "kucir" | "mohawk";
export type GlassesId = "none" | "bulat" | "kotak" | "keren";
export type AccId = "none" | "topi" | "pita" | "toga" | "antena";

export type AvatarSpec = {
  shape: HeadShape;
  color: string; // id warna badan
  hair: HairId;
  hairColor: string; // id warna rambut
  glasses: GlassesId;
  acc: AccId;
};

export const COLORS = [
  { id: "biru", label: "Biru", base: "#37a6ef", dark: "#1976c9" },
  { id: "ungu", label: "Ungu", base: "#9b7bf7", dark: "#6f4fe0" },
  { id: "hijau", label: "Hijau", base: "#34c98b", dark: "#199e68" },
  { id: "kuning", label: "Kuning", base: "#f5b942", dark: "#d99209" },
  { id: "merah", label: "Merah", base: "#f2617a", dark: "#d63b5a" },
  { id: "teal", label: "Teal", base: "#3ec9c0", dark: "#17a49b" },
  { id: "pink", label: "Pink", base: "#f28ec5", dark: "#d95fa3" },
  { id: "coklat", label: "Coklat", base: "#d29a6e", dark: "#a2683f" },
];

export const HAIR_COLORS = [
  { id: "hitam", label: "Hitam", val: "#2b2420" },
  { id: "coklat", label: "Coklat", val: "#6b4a2f" },
  { id: "pirang", label: "Pirang", val: "#e0b352" },
  { id: "merah", label: "Merah", val: "#b8503a" },
];

export const SHAPES: { id: HeadShape; label: string }[] = [
  { id: "bulat", label: "Bulat" },
  { id: "oval", label: "Oval" },
  { id: "kotak", label: "Kotak" },
];
export const HAIRS: { id: HairId; label: string }[] = [
  { id: "none", label: "Botak" },
  { id: "poni", label: "Poni" },
  { id: "jambul", label: "Jambul" },
  { id: "keriting", label: "Keriting" },
  { id: "kucir", label: "Kucir" },
  { id: "mohawk", label: "Mohawk" },
];
export const GLASSES: { id: GlassesId; label: string }[] = [
  { id: "none", label: "Tanpa" },
  { id: "bulat", label: "Bulat" },
  { id: "kotak", label: "Kotak" },
  { id: "keren", label: "Keren" },
];
export const ACCS: { id: AccId; label: string }[] = [
  { id: "none", label: "Tanpa" },
  { id: "topi", label: "Topi" },
  { id: "pita", label: "Pita" },
  { id: "toga", label: "Toga" },
  { id: "antena", label: "Antena" },
];

// Kategori/kelas pembelajaran untuk penempatan murid.
export const KATEGORI = [
  { id: "bilangan", label: "Bilangan & Penjumlahan", short: "Bilangan" },
  { id: "aljabar", label: "Aljabar", short: "Aljabar" },
  { id: "geometri", label: "Geometri", short: "Geometri" },
  { id: "trigonometri", label: "Trigonometri", short: "Trigono." },
  { id: "data", label: "Data & Peluang", short: "Data" },
  { id: "kalkulus", label: "Kalkulus", short: "Kalkulus" },
];

export function colorById(id: string) {
  return COLORS.find((c) => c.id === id) ?? COLORS[0];
}
export function hairColorById(id: string) {
  return HAIR_COLORS.find((c) => c.id === id) ?? HAIR_COLORS[0];
}
export function kategoriLabel(id: string) {
  return KATEGORI.find((k) => k.id === id)?.label ?? id;
}

export const DEFAULT_AVATAR: AvatarSpec = {
  shape: "bulat",
  color: "biru",
  hair: "poni",
  hairColor: "coklat",
  glasses: "none",
  acc: "none",
};

// Preset lama (CharId) → AvatarSpec agar <Mascot char="pio" /> tetap jalan.
export const CHAR_PRESET: Record<string, AvatarSpec> = {
  pio: { shape: "bulat", color: "biru", hair: "none", hairColor: "hitam", glasses: "none", acc: "antena" },
  nara: { shape: "bulat", color: "ungu", hair: "jambul", hairColor: "hitam", glasses: "none", acc: "none" },
  geo: { shape: "kotak", color: "hijau", hair: "none", hairColor: "hitam", glasses: "none", acc: "topi" },
  tari: { shape: "oval", color: "kuning", hair: "kucir", hairColor: "coklat", glasses: "none", acc: "pita" },
  dita: { shape: "bulat", color: "teal", hair: "poni", hairColor: "hitam", glasses: "kotak", acc: "none" },
  kalvin: { shape: "bulat", color: "pink", hair: "keriting", hairColor: "hitam", glasses: "none", acc: "toga" },
};
export function presetAvatar(char: string | undefined): AvatarSpec {
  return CHAR_PRESET[char ?? "pio"] ?? CHAR_PRESET.pio;
}
