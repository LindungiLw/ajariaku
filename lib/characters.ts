

export type CharId = "pio" | "nara" | "geo" | "tari" | "dita" | "kalvin";
export type Accessory = "antena" | "kilau" | "topi" | "pita" | "kacamata" | "toga";

export type CharDef = {
  id: CharId;
  nama: string;
  from: string; // gradien terang
  to: string; // gradien gelap
  accent: string; // aksen aksesori/cincin
  acc: Accessory;
};

export const CHARACTERS: CharDef[] = [
  { id: "pio", nama: "Pio", from: "#6cc4fb", to: "#1591dc", accent: "#2c5ead", acc: "antena" },
  { id: "nara", nama: "Nara", from: "#b39dfb", to: "#7c5cf5", accent: "#5b3fd4", acc: "kilau" },
  { id: "geo", nama: "Geo", from: "#57d9a3", to: "#16a06b", accent: "#0f7a50", acc: "topi" },
  { id: "tari", nama: "Tari", from: "#ffcf6b", to: "#f5a524", accent: "#c9760a", acc: "pita" },
  { id: "dita", nama: "Dita", from: "#5eead4", to: "#0ea5a4", accent: "#0d8f8e", acc: "kacamata" },
  { id: "kalvin", nama: "Kalvin", from: "#f7a8d3", to: "#e05299", accent: "#b83a7d", acc: "toga" },
];

export function charById(id: string | undefined): CharDef {
  return CHARACTERS.find((c) => c.id === id) ?? CHARACTERS[0];
}
