"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuth, GoogleG } from "@/components/auth";
import { useConfirm } from "@/components/confirm-dialog";
import { useProfil } from "@/components/profil-pengajar";
import { loadFirebase } from "@/lib/firebase";
import { GELAR_OPSI, sapaan, type Pengajar } from "@/lib/profile";

type Ctx = { promptLogin: () => void };
const LoginSheetCtx = createContext<Ctx | null>(null);

export function useLoginSheet() {
  const c = useContext(LoginSheetCtx);
  if (!c) throw new Error("useLoginSheet harus di dalam <LoginSheetProvider>");
  return c;
}

// Sheet login ringkas untuk tamu yang mau menyimpan progres ke akun. Beda dari layar
// Sambutan: tak mengulang onboarding penuh, cukup pastikan nama lalu login Google.
export function LoginSheetProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const promptLogin = useCallback(() => setOpen(true), []);
  return (
    <LoginSheetCtx.Provider value={{ promptLogin }}>
      {children}
      {open && <LoginSheet onClose={() => setOpen(false)} />}
    </LoginSheetCtx.Provider>
  );
}

function LoginSheet({ onClose }: { onClose: () => void }) {
  const { enabled, signInGoogle } = useAuth();
  const { profil, update } = useProfil();
  const confirm = useConfirm();
  const [nama, setNama] = useState(profil.nama ?? "");
  const [gelar, setGelar] = useState(profil.gelar ?? "Kak");
  const [busy, setBusy] = useState(false);

  // Preload Firebase agar popup login membuka cepat (hindari pop-up blocker).
  useEffect(() => {
    if (enabled) loadFirebase();
  }, [enabled]);

  if (!enabled) return null;

  async function login() {
    setBusy(true);
    try {
      // Simpan nama yang mungkin diedit SEBELUM login → ikut terunggah saat "Unggah progres".
      const nm = nama.trim();
      if (nm && (nm !== profil.nama || gelar !== profil.gelar)) {
        update({ ...profil, nama: nm, gelar });
      }
      await signInGoogle();
      onClose(); // signInGoogle menangani reload sendiri bila perlu (data cloud / akun baru).
    } catch (e) {
      const err = e as { code?: string; message?: string };
      // Menutup / membatalkan popup Google bukan kegagalan (pengguna sengaja batal).
      if (
        err?.code === "auth/popup-closed-by-user" ||
        err?.code === "auth/cancelled-popup-request" ||
        err?.code === "auth/user-cancelled"
      ) {
        return;
      }
      console.error("[auth] login Google gagal:", e);
      await confirm({ title: "Login Google gagal", message: err?.code || err?.message || "Coba lagi sebentar, ya.", hideCancel: true, confirmText: "Mengerti" });
    } finally {
      setBusy(false);
    }
  }

  const preview: Pengajar = { ...profil, nama, gelar };

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div className="aa-card w-full max-w-sm p-5 sm:p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 flex-none place-items-center overflow-hidden rounded-xl bg-white ring-1 ring-line">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Ajari Aku" width={30} height={30} className="h-[30px] w-[30px]" />
          </span>
          <div>
            <p className="font-display text-lg font-extrabold leading-tight">Masuk untuk simpan progres</p>
            <p className="text-[13px] text-ink-soft">Progresmu di perangkat ini tetap aman dan ikut ke akunmu.</p>
          </div>
        </div>

        <label htmlFor="ls-nama" className="mt-4 block text-sm font-bold">Nama Anda</label>
        <input
          id="ls-nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          maxLength={20}
          placeholder="mis. Andi"
          className="mt-1.5 w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-[15px] outline-none transition-colors focus:border-[var(--primary)]"
        />

        <p className="mt-3 text-sm font-bold">Panggilan</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {GELAR_OPSI.map((g) => (
            <button key={g} onClick={() => setGelar(g)} aria-pressed={gelar === g} className={`aa-chip-pick${gelar === g ? " is-on" : ""}`}>
              {g}
            </button>
          ))}
        </div>

        <p className="mt-3 text-[12px] text-ink-soft">
          Murid akan menyapa: <b className="text-ink">{sapaan(preview)}</b>
        </p>

        <button onClick={login} disabled={busy} className="aa-btn mt-4 w-full text-base disabled:opacity-60">
          <GoogleG size={18} /> {busy ? "Menghubungkan…" : "Login dengan Google"}
        </button>
        <button
          onClick={onClose}
          disabled={busy}
          className="mt-2 w-full rounded-full py-2 text-sm font-bold text-ink-soft transition-colors hover:text-ink disabled:opacity-60"
        >
          Nanti saja
        </button>
      </div>
    </div>
  );
}
