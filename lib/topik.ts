// Resolusi topik lintas-sumber: Dunia Fase E (duniaNodes) + bank soal (bankSoal).
// Dipakai untuk menyiapkan sesi mengajar dari mana pun (Belajar, Kelas).

import { duniaNodes } from "./dunia";
import { bankSoal } from "./bank-soal";

export type MateriTopik = {
  id: string;
  judul: string;
  soal: string;
  xp: number;
};

export function resolveTopik(id: string): MateriTopik | null {
  const fe = duniaNodes.find((n) => n.id === id);
  if (fe) return { id: fe.id, judul: fe.judul, soal: fe.soal, xp: fe.xp };
  const bt = bankSoal.find((t) => t.id === id);
  if (bt) return { id: bt.id, judul: bt.judul, soal: bt.soal[0]?.soal ?? bt.topik, xp: bt.xp };
  return null;
}
