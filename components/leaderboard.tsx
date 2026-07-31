"use client";

import { useEffect, useState } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { Trophy, Crown, Medal } from "@/components/brand-icons";
import { useAuth, GoogleG } from "@/components/auth";
import { useProfil } from "@/components/profil-pengajar";
import { sapaan } from "@/lib/profile";
import { loadProgress } from "@/lib/progress";
import { tierOf } from "@/lib/liga";
import {
  loadLbPref,
  joinLeaderboard,
  leaveLeaderboard,
  syncLeaderboardXp,
  fetchTop,
  myUid,
  type LbEntry,
  type LbPref,
} from "@/lib/leaderboard";

// Papan peringkat global OPSIONAL & anonim (nickname, bukan nama asli). Guest tetap main tanpa
// login; hanya yang login & setuju yang tampil. Mengurus sendiri: login → pilih nickname → ikut.
export function Leaderboard() {
  const { user, enabled, signInGoogle } = useAuth();
  const { profil } = useProfil();
  const [pref, setPref] = useState<LbPref>({ on: false, nick: "" });
  const [top, setTop] = useState<LbEntry[] | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const [nick, setNick] = useState("");
  const [busy, setBusy] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [peek, setPeek] = useState(false);
  const [myXp, setMyXp] = useState(0);

  useEffect(() => {
    const pr = loadLbPref();
    setPref(pr);
    setNick(pr.nick || sapaan(profil).replace(/^(Pak|Bu|Kak)\s+/i, "").trim() || "Guru");
    setMyXp(loadProgress().xp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Muat papan: untuk pengguna login, atau guest yang menekan "Lihat papan".
  useEffect(() => {
    if (!enabled || (!user && !peek)) return;
    let alive = true;
    (async () => {
      if (user && pref.on) await syncLeaderboardXp();
      const [t, u] = await Promise.all([fetchTop(50), myUid()]);
      if (!alive) return;
      setTop(t);
      setUid(u);
    })();
    return () => {
      alive = false;
    };
  }, [enabled, user, pref.on, peek]);

  async function refreshBoard() {
    setTop(await fetchTop(50));
  }
  async function join() {
    setBusy(true);
    const ok = await joinLeaderboard(nick);
    if (ok) {
      setPref(loadLbPref());
      await refreshBoard();
    }
    setBusy(false);
  }
  async function leave() {
    setBusy(true);
    await leaveLeaderboard();
    setPref(loadLbPref());
    await refreshBoard();
    setBusy(false);
  }
  async function login() {
    setBusy(true);
    try {
      await signInGoogle();
    } catch {
      /* dialog error ditangani di tempat lain */
    }
    setBusy(false);
  }

  if (!enabled) return null; // sinkron cloud belum dikonfigurasi → sembunyikan fitur ini

  const tier = tierOf(myXp);
  const list = top ? (expanded ? top : top.slice(0, 5)) : [];
  const akuIkutTampil = !!(user && pref.on && uid && top?.some((e) => e.uid === uid));

  return (
    <section className="aa-card p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 font-display text-lg font-extrabold">
          <Trophy size={18} className="text-[var(--reward)]" /> Peringkat Global
        </h2>
        <span className="aa-chip tnum" style={{ color: tier.warna }}>
          {tier.nama}
        </span>
      </div>

      {/* daftar peringkat */}
      {top === null ? (
        user || peek ? (
          <div className="grid place-items-center py-6 text-ink-soft">
            <Loader2 size={22} className="animate-spin" />
          </div>
        ) : null
      ) : top.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line bg-surface-2 px-4 py-5 text-center text-sm text-ink-soft">
          Belum ada yang ikut. Jadilah <b className="text-ink">yang pertama</b> di papan! 🏆
        </p>
      ) : (
        <ol className="flex flex-col gap-1.5">
          {list.map((e, i) => {
            const rank = i + 1;
            const me = e.uid === uid;
            return (
              <li
                key={e.uid}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 ${
                  me ? "bg-[var(--tint)]/50 ring-1 ring-[var(--primary)]/40" : "bg-surface-2"
                }`}
              >
                <RankBadge rank={rank} />
                <span className="min-w-0 flex-1 truncate font-semibold">
                  {e.nick} {me && <span className="text-[11px] font-bold text-[var(--primary)]">(kamu)</span>}
                </span>
                <span className="flex-none font-display text-sm font-extrabold tnum text-[var(--reward-ink)]">
                  {e.xp} XP
                </span>
              </li>
            );
          })}
        </ol>
      )}

      {/* ikut tapi belum masuk daftar tampil (papan penuh 50) */}
      {user && pref.on && top && top.length > 0 && !akuIkutTampil && (
        <p className="mt-2 text-center text-[11px] text-ink-soft tnum">
          Kamu ikut sebagai <b>{pref.nick}</b> · {myXp} XP, teruslah mengajar untuk naik ke 50 besar.
        </p>
      )}

      {top && top.length > 5 && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-2.5 w-full rounded-full border border-line py-2 text-xs font-bold text-ink-soft transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
        >
          {expanded ? "Ringkas" : `Lihat semua (${top.length})`}
        </button>
      )}

      {/* kontrol sesuai status */}
      <div className="mt-3 border-t border-line pt-3">
        {!user ? (
          <div className="flex flex-col gap-2">
            <p className="text-xs leading-relaxed text-ink-soft">
              Ikut peringkat global pakai <b className="text-ink">nickname</b> (bukan nama asli). Guest tetap bisa main tanpa ini.
            </p>
            <button
              onClick={login}
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-line bg-surface py-2.5 text-sm font-bold transition-colors hover:border-[var(--primary)] disabled:opacity-60"
            >
              <GoogleG size={16} /> {busy ? "Menghubungkan…" : "Masuk & ikut peringkat"}
            </button>
            {!peek && top === null && (
              <button onClick={() => setPeek(true)} className="text-center text-xs font-bold text-ink-soft hover:text-[var(--primary)]">
                Lihat papan dulu →
              </button>
            )}
          </div>
        ) : !pref.on ? (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-ink-soft">Nickname (tampil publik di papan)</label>
            <div className="flex gap-2">
              <input
                value={nick}
                onChange={(e) => setNick(e.target.value)}
                maxLength={24}
                placeholder="mis. GuruHebat"
                className="min-w-0 flex-1 rounded-full border border-line bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--primary)]"
              />
              <button onClick={join} disabled={busy || !nick.trim()} className="aa-btn flex-none px-4 text-sm disabled:opacity-50">
                {busy ? "…" : "Ikut"}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="min-w-0 truncate text-ink-soft">
              Ikut sebagai <b className="text-ink">{pref.nick}</b>
            </span>
            <button
              onClick={leave}
              disabled={busy}
              className="flex flex-none items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-ink-soft transition-colors hover:bg-surface-2 hover:text-[var(--node-weak)] disabled:opacity-60"
            >
              <LogOut size={14} /> Keluar
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return (
      <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-[#e7b008] text-white">
        <Crown size={15} />
      </span>
    );
  if (rank === 2 || rank === 3)
    return (
      <span
        className="grid h-7 w-7 flex-none place-items-center rounded-full text-white"
        style={{ background: rank === 2 ? "#8a97a8" : "#b06a3b" }}
      >
        <Medal size={15} />
      </span>
    );
  return (
    <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-surface-3 font-display text-xs font-extrabold text-ink-soft tnum">
      {rank}
    </span>
  );
}
