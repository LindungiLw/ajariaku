"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { AlertTriangle, Info } from "lucide-react";

// Modal konfirmasi/alert KHAS "Ajari Aku", pengganti window.confirm/alert native yang jelek.
// Promise-based, jadi gampang dipakai: `const confirm = useConfirm(); if (await confirm({...})) {…}`.
export type ConfirmOpts = {
  title: string;
  message?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean; // aksi merusak (hapus) → tombol merah + ikon peringatan
  hideCancel?: boolean; // true → mode "alert" (satu tombol OK)
  dismissable?: boolean; // false → wajib pilih tombol (Escape/klik-luar tak menutup)
};

type Pending = { opts: ConfirmOpts; resolve: (v: boolean) => void } | null;

const Ctx = createContext<(opts: ConfirmOpts) => Promise<boolean>>(async () => false);
export function useConfirm() {
  return useContext(Ctx);
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<Pending>(null);

  const confirm = useCallback(
    (opts: ConfirmOpts) => new Promise<boolean>((resolve) => setPending({ opts, resolve })),
    [],
  );

  const close = useCallback((v: boolean) => {
    setPending((cur) => {
      cur?.resolve(v);
      return null;
    });
  }, []);

  // Esc → batal (setara menutup dialog).
  useEffect(() => {
    if (!pending) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && pending.opts.dismissable !== false) close(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pending, close]);

  const o = pending?.opts;

  return (
    <Ctx.Provider value={confirm}>
      {children}
      {pending && o && (
        <div
          className="fixed inset-0 z-[120] grid place-items-center bg-black/55 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={o.title}
          onClick={() => { if (o.dismissable !== false) close(false); }}
        >
          <div
            className="aa-card w-full max-w-sm p-5 shadow-[var(--shadow-2)] sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-3">
              <span
                className="grid h-11 w-11 flex-none place-items-center rounded-2xl text-white"
                style={{ background: o.danger ? "var(--node-weak)" : "var(--primary)" }}
              >
                {o.danger ? <AlertTriangle size={22} /> : <Info size={22} />}
              </span>
              <div className="min-w-0 pt-0.5">
                <h2 className="font-display text-lg font-extrabold leading-tight">{o.title}</h2>
                {o.message != null && (
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{o.message}</p>
                )}
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2.5">
              {!o.hideCancel && (
                <button onClick={() => close(false)} className="aa-btn-ghost">
                  {o.cancelText ?? "Batal"}
                </button>
              )}
              <button
                onClick={() => close(true)}
                autoFocus
                className="aa-btn"
                style={
                  o.danger
                    ? { background: "linear-gradient(140deg, color-mix(in srgb, var(--node-weak) 82%, #fff), var(--node-weak))" }
                    : undefined
                }
              >
                {o.confirmText ?? (o.hideCancel ? "OK" : "Ya")}
              </button>
            </div>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}
