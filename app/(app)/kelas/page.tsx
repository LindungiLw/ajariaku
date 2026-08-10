"use client";

import { useEffect, useState } from "react";
import { Users, Pencil } from "lucide-react";
import { Mascot } from "@/components/mascot";
import dynamic from "next/dynamic";
import { useProfil } from "@/components/profil-pengajar";
import { sapaan } from "@/lib/profile";
import { KATEGORI } from "@/lib/avatar";
import { loadMurid, saveMurid, pangkatMurid, type MuridKustom } from "@/lib/murid";
import { levelInfo } from "@/lib/progress";
import { loadProfil, type Profil } from "@/lib/memory";

// AvatarBuilder (edit murid) hanya dibuka saat diklik → dipisah dari bundle awal.
const AvatarBuilder = dynamic(() => import("@/components/avatar-builder").then((m) => m.AvatarBuilder), { ssr: false });

const catShort = (id: string) => KATEGORI.find((k) => k.id === id)?.short ?? id;

export default function KelasPage() {
  const { profil } = useProfil();
  const sap = sapaan(profil);

  const [list, setList] = useState<MuridKustom[]>([]);
  const [mems, setMems] = useState<Record<string, Profil | null>>({}); // ingatan per murid
  useEffect(() => {
    const l = loadMurid();
    setList(l);
    const m: Record<string, Profil | null> = {};
    for (const mu of l) m[mu.id] = loadProfil(mu.id);
    setMems(m);
  }, []);

  const [filter, setFilter] = useState<string>("all");
  const [editTarget, setEditTarget] = useState<MuridKustom | null>(null);

  function onSave(m: MuridKustom) {
    const next = list.map((x) => (x.id === m.id ? m : x));
    setList(next);
    saveMurid(next);
    setEditTarget(null);
  }

  const presentCats = KATEGORI.filter((k) => list.some((m) => m.kategori === k.id));
  const shown = filter === "all" ? list : list.filter((m) => m.kategori === filter);

  return (
    <div className="flex flex-col gap-5">
      {/* header */}
      <section className="aa-card overflow-hidden p-4">
        <div className="flex items-center gap-1.5 text-[12px] font-bold text-ink-soft">
          <Users size={14} className="text-[var(--primary)]" /> Ruang Kelas
        </div>
        <h1 className="mt-0.5 font-display text-lg font-extrabold leading-tight">Kelas {sap}</h1>
        <p className="mt-0.5 text-[13px] text-ink-soft">
          {list.length} murid AI, tiap murid pegang <b className="text-ink">satu bidang</b> dengan <b className="text-ink">watak &amp; ingatan sendiri</b>. Pangkatnya naik seiring kamu mengajari. 🎓
        </p>
      </section>

      {/* filter bidang */}
      {presentCats.length > 1 && (
        <div className="-mt-1 flex flex-wrap gap-2">
          <FilterChip on={filter === "all"} onClick={() => setFilter("all")}>
            Semua ({list.length})
          </FilterChip>
          {presentCats.map((k) => (
            <FilterChip key={k.id} on={filter === k.id} onClick={() => setFilter(k.id)}>
              {k.short} ({list.filter((m) => m.kategori === k.id).length})
            </FilterChip>
          ))}
        </div>
      )}

      {/* grid murid, lihat + edit (klik pensil) */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {shown.map((m) => (
          <div key={m.id} className="aa-card aa-lift relative flex flex-col items-center gap-1 p-3 text-center">
            <button
              onClick={() => setEditTarget(m)}
              aria-label={`Ubah ${m.nama}`}
              className="absolute right-0.5 top-0.5 grid h-9 w-9 place-items-center rounded-lg text-ink-soft hover:bg-surface-2"
            >
              <Pencil size={14} />
            </button>
            <div className="flex w-full flex-col items-center gap-1 pt-1">
              <Mascot avatar={m.avatar} size={46} />
              <p className="font-display text-[13px] font-extrabold leading-tight">{m.nama}</p>
              <span className="rounded-full bg-[var(--tint)] px-1.5 py-0.5 text-[9px] font-bold text-[var(--primary-deep)]">
                {catShort(m.kategori)}
              </span>
              <span className="mt-0.5 flex items-center gap-1 text-[9px] font-bold text-ink-soft tnum">
                Lv {levelInfo(m.xp ?? 0).level} · {m.selesai?.length ?? 0} materi
              </span>
              <span
                className="mt-0.5 max-w-full truncate rounded-full px-1.5 py-0.5 text-[8.5px] font-extrabold"
                style={{ background: "color-mix(in srgb, var(--reward) 16%, transparent)", color: "var(--reward-ink)" }}
                title={`Pangkat ${m.nama}: ${pangkatMurid(m.xp ?? 0).nama}. Naik seiring kamu mengajarinya: Murid Baru → Rajin → Cerdas → Teladan → Bintang.`}
              >
                {pangkatMurid(m.xp ?? 0).nama}
              </span>
              
              {/* Student Stat: XP Progress Bar */}
              <div className="mt-2.5 w-full px-1">
                <div className="flex w-full items-center justify-between px-0.5 text-[8px] font-bold text-ink-soft tnum">
                  <span title={`Total: ${m.xp ?? 0} XP. Progres ke level berikutnya`}>{levelInfo(m.xp ?? 0).into} / {levelInfo(m.xp ?? 0).need} XP</span>
                  <span title={`Sisa ${levelInfo(m.xp ?? 0).need - levelInfo(m.xp ?? 0).into} XP ke Lv ${levelInfo(m.xp ?? 0).level + 1}`}>ke Lv {levelInfo(m.xp ?? 0).level + 1}</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-line" title={`${levelInfo(m.xp ?? 0).pct}% menuju level berikutnya`}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${levelInfo(m.xp ?? 0).pct}%`, background: "var(--reward)" }} />
                </div>
              </div>

              <div className="mt-1 w-full"><IngatanBadge mem={mems[m.id]} nama={m.nama} /></div>
            </div>
          </div>
        ))}
      </div>

      {editTarget && <AvatarBuilder initial={editTarget} onSave={onSave} onClose={() => setEditTarget(null)} />}
    </div>
  );
}

function FilterChip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
        on ? "border-transparent bg-gradient-to-br from-[var(--cta-1)] to-[var(--cta-2)] text-white" : "border-line bg-surface text-ink-soft hover:border-[var(--primary)]"
      }`}
    >
      {children}
    </button>
  );
}

// Badge ingatan per murid, bikin fitur "ingatan setiap kelas" terlihat langsung di kartu.
function IngatanBadge({ mem, nama }: { mem: Profil | null | undefined; nama: string }) {
  if (!mem || mem.sesi <= 0) return null;
  const w = mem.weakest;
  return (
    <span
      className="mt-0.5 inline-block max-w-full truncate rounded-full bg-[var(--tint)]/70 px-1.5 py-0.5 text-[8.5px] font-bold text-[var(--primary-deep)]"
      title={`${nama} ingat ${mem.sesi} sesi bersamamu${w ? ` · masih perlu ${w.konsep}` : ""}`}
    >
      🧠 {w ? `perlu: ${w.konsep}` : `ingat ${mem.sesi} sesi`}
    </span>
  );
}
