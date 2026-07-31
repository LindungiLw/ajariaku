"use client";

import { useState, type ReactNode } from "react";
import { X, Check } from "lucide-react";
import { Mascot } from "@/components/mascot";
import {
  SHAPES,
  COLORS,
  HAIRS,
  HAIR_COLORS,
  GLASSES,
  ACCS,
  kategoriLabel,
  DEFAULT_AVATAR,
  type AvatarSpec,
} from "@/lib/avatar";
import { type MuridKustom } from "@/lib/murid";

// Editor murid: HANYA ubah NAMA & MUKA (roster tetap: tak buat/hapus, bidang tak berubah).
export function AvatarBuilder({
  initial,
  onSave,
  onClose,
}: {
  initial: MuridKustom;
  onSave: (m: MuridKustom) => void;
  onClose: () => void;
}) {
  const [nama, setNama] = useState(initial.nama ?? "");
  const [av, setAv] = useState<AvatarSpec>(initial.avatar ?? DEFAULT_AVATAR);
  const set = (patch: Partial<AvatarSpec>) => setAv((s) => ({ ...s, ...patch }));

  function submit() {
    onSave({ ...initial, nama: nama.trim() || initial.nama, avatar: av });
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-end bg-black/50 backdrop-blur-sm sm:place-items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="aa-card flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-b-none sm:rounded-b-[var(--r-card)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center justify-between border-b border-line p-4">
          <div className="min-w-0">
            <h2 className="font-display text-lg font-extrabold leading-tight">Ubah Murid</h2>
            <p className="text-[12px] text-ink-soft">
              Bidang <b className="text-ink">{kategoriLabel(initial.kategori)}</b> · ubah nama & muka
            </p>
          </div>
          <button onClick={onClose} aria-label="Tutup" className="grid h-10 w-10 flex-none place-items-center rounded-lg text-ink-soft hover:bg-surface-2">
            <X size={18} />
          </button>
        </div>

        {/* body */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* preview besar */}
          <div className="mb-4 grid place-items-center rounded-2xl border border-line bg-surface-2 py-5">
            <Mascot avatar={av} size={120} />
          </div>

          <label className="block text-sm font-bold">Nama murid</label>
          <input
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            maxLength={16}
            placeholder="mis. Bima"
            className="mt-1.5 w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-[15px] outline-none transition-colors focus:border-[var(--primary)]"
          />

          <Slot label="Bentuk wajah">
            {SHAPES.map((s) => (
              <Opt key={s.id} on={av.shape === s.id} onClick={() => set({ shape: s.id })}>
                <Mascot avatar={{ ...av, shape: s.id }} size={38} />
              </Opt>
            ))}
          </Slot>

          <Slot label="Warna">
            {COLORS.map((c) => (
              <Opt key={c.id} on={av.color === c.id} onClick={() => set({ color: c.id })}>
                <span className="h-8 w-8 rounded-full" style={{ background: c.base }} />
              </Opt>
            ))}
          </Slot>

          <Slot label="Rambut">
            {HAIRS.map((h) => (
              <Opt key={h.id} on={av.hair === h.id} onClick={() => set({ hair: h.id })}>
                <Mascot avatar={{ ...av, hair: h.id }} size={38} />
              </Opt>
            ))}
          </Slot>

          {av.hair !== "none" && (
            <Slot label="Warna rambut">
              {HAIR_COLORS.map((c) => (
                <Opt key={c.id} on={av.hairColor === c.id} onClick={() => set({ hairColor: c.id })}>
                  <span className="h-8 w-8 rounded-full" style={{ background: c.val }} />
                </Opt>
              ))}
            </Slot>
          )}

          <Slot label="Kacamata">
            {GLASSES.map((g) => (
              <Opt key={g.id} on={av.glasses === g.id} onClick={() => set({ glasses: g.id })}>
                <Mascot avatar={{ ...av, glasses: g.id }} size={38} />
              </Opt>
            ))}
          </Slot>

          <Slot label="Aksesori">
            {ACCS.map((x) => (
              <Opt key={x.id} on={av.acc === x.id} onClick={() => set({ acc: x.id })}>
                <Mascot avatar={{ ...av, acc: x.id }} size={38} />
              </Opt>
            ))}
          </Slot>
        </div>

        {/* footer */}
        <div className="flex items-center gap-2 border-t border-line p-4">
          <button onClick={onClose} className="aa-btn-ghost flex-1">Batal</button>
          <button onClick={submit} className="aa-btn flex-1"><Check size={18} /> Simpan</button>
        </div>
      </div>
    </div>
  );
}

function Slot({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mt-4">
      <p className="mb-1.5 text-sm font-bold">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Opt({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className={`grid h-12 w-12 place-items-center rounded-xl border p-1 transition-all ${
        on ? "-translate-y-0.5 border-transparent bg-[var(--tint)] shadow-[var(--shadow-1)]" : "border-line bg-surface hover:border-[var(--primary)]"
      }`}
    >
      {children}
    </button>
  );
}
