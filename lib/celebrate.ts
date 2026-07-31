// Perayaan gamifikasi ("juice"), pub/sub kecil tanpa dependensi.
// Komponen <CelebrationHost/> berlangganan; halaman memicu saat XP / liga /
// level / lencana berubah. Semua LOKAL (baca progres di perangkat), jujur.

import { levelInfo, type Progress } from "./progress";
import { tierOf } from "./liga";
import { evalAchievements } from "./achievements";
import { pangkatMurid, type MuridKustom } from "./murid";

export type Celebration =
  | { kind: "xp"; label: string; sub: string }
  | { kind: "koreksi"; label: string; sub: string }
  | { kind: "level"; label: string; sub: string }
  | { kind: "tier"; label: string; sub: string; warna: string }
  | { kind: "badge"; label: string; sub: string; warna: string; ikon: string };

type Listener = (items: Celebration[]) => void;
const listeners = new Set<Listener>();

export function onCelebrate(fn: Listener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function celebrate(items: Celebration[]) {
  if (!items.length) return;
  for (const fn of listeners) fn(items);
}

type Ctx = { muridBefore?: MuridKustom[]; muridAfter?: MuridKustom[] };

function muridNaikLevel(list?: MuridKustom[]): number {
  return (list ?? []).filter((m) => levelInfo(m.xp ?? 0).level >= 2).length;
}

// Murid yang naik pangkat dari before ke after.
function pangkatUp(before?: MuridKustom[], after?: MuridKustom[]): Celebration[] {
  if (!before || !after) return [];
  const byId = new Map(before.map((m) => [m.id, m]));
  const out: Celebration[] = [];
  for (const a of after) {
    const b = byId.get(a.id);
    if (!b) continue;
    const pa = pangkatMurid(a.xp ?? 0);
    const pb = pangkatMurid(b.xp ?? 0);
    if (pa.tier > pb.tier) out.push({ kind: "level", label: `${a.nama} naik pangkat!`, sub: `Sekarang ${pa.nama}` });
  }
  return out;
}

// Lencana yang BARU terbuka dari kondisi before → after.
function newBadges(before: Progress, after: Progress, ctx?: Ctx): Celebration[] {
  const was = new Set(
    evalAchievements(before, { muridNaikLevel: muridNaikLevel(ctx?.muridBefore) })
      .filter((a) => a.unlocked)
      .map((a) => a.id),
  );
  return evalAchievements(after, { muridNaikLevel: muridNaikLevel(ctx?.muridAfter) })
    .filter((a) => a.unlocked && !was.has(a.id))
    .map((a) => ({ kind: "badge" as const, label: a.nama, sub: "Lencana baru!", warna: a.warna, ikon: a.ikon }));
}

// Perayaan penuh saat sesi tuntas: XP, naik liga, naik level, lencana baru.
export function celebrateDelta(before: Progress, after: Progress, ctx?: Ctx) {
  const items: Celebration[] = [];

  const gained = after.xp - before.xp;
  if (gained > 0) items.push({ kind: "xp", label: `+${gained} XP`, sub: "Mantap, lanjutkan!" });

  const tb = tierOf(before.xp);
  const ta = tierOf(after.xp);
  if (ta.min > tb.min) items.push({ kind: "tier", label: `Naik ke Liga ${ta.nama}!`, sub: "Peringkatmu naik", warna: ta.warna });

  const lb = levelInfo(before.xp).level;
  const la = levelInfo(after.xp).level;
  // Rayakan naik level hanya bila TIDAK naik liga (biar tidak dobel-heboh).
  if (la > lb && ta.min === tb.min) items.push({ kind: "level", label: `Level ${la}!`, sub: "Naik level" });

  items.push(...pangkatUp(ctx?.muridBefore, ctx?.muridAfter)); // murid naik pangkat (per-murid)
  items.push(...newBadges(before, after, ctx));
  celebrate(items);
}

// Hanya rayakan lencana baru, dipakai saat mengoreksi murid (XP-nya sudah
// dirayakan lewat toast koreksi tersendiri, jadi jangan dobel).
export function celebrateBadges(before: Progress, after: Progress, ctx?: Ctx) {
  celebrate(newBadges(before, after, ctx));
}
