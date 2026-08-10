"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { ArrowRight } from "lucide-react";
import { Star } from "@/components/brand-icons";
import { restoreTema } from "@/lib/theme";
import { syncMuridUtama } from "@/lib/murid";
import {
  DEFAULT_PENGAJAR,
  DEFAULT_MURID_NAMA,
  DEFAULT_MURID_CHAR,
  GELAR_OPSI,
  loadPengajar,
  savePengajar,
  sapaan,
  namaMurid,
  type Pengajar,
} from "@/lib/profile";
import { usePathname } from "next/navigation";
import { Mascot } from "@/components/mascot";
import { CHARACTERS } from "@/lib/characters";
import { useAuth, GoogleG } from "@/components/auth";
import { useConfirm } from "@/components/confirm-dialog";
import { WelcomeSplash } from "@/components/welcome-splash";

// Flag "baru masuk" untuk splash Selamat Datang setelah login (diset di auth.tsx sebelum reload).
const WELCOME_FLAG = "ajari-aku:welcome";

type Ctx = {
  profil: Pengajar;
  ready: boolean;
  hasProfil: boolean;
  save: (p: Pengajar) => void;
  update: (p: Pengajar) => void;
};

const ProfilCtx = createContext<Ctx | null>(null);

export function useProfil() {
  const c = useContext(ProfilCtx);
  if (!c) throw new Error("useProfil harus di dalam <ProfilProvider>");
  return c;
}

export function ProfilProvider({ children }: { children: ReactNode }) {
  const path = usePathname();
  // Halaman informasi bisa dibaca tanpa dipaksa onboarding (mis. dari footer landing).
  const infoRoute = path === "/tentang" || path === "/privasi";
  const [profil, setProfil] = useState<Pengajar>(DEFAULT_PENGAJAR);
  const [ready, setReady] = useState(false);
  const [hasProfil, setHasProfil] = useState(false);
  const [onboarding, setOnboarding] = useState(false);
  const [justWelcomed, setJustWelcomed] = useState(false); // tampilkan splash Selamat Datang

  useEffect(() => {
    restoreTema();
    const saved = loadPengajar();
    if (saved) {
      setProfil(saved);
      setHasProfil(true);
      syncMuridUtama(saved.muridNama, saved.muridChar); // murid dari onboarding tampil di Ruang Kelas
      // Baru saja login (halaman baru reload) → sambut sekali, lalu bersihkan flag.
      try {
        if (window.sessionStorage.getItem(WELCOME_FLAG)) {
          window.sessionStorage.removeItem(WELCOME_FLAG);
          setJustWelcomed(true);
        }
      } catch {
        /* storage diblokir, abaikan */
      }
    } else {
      setOnboarding(true); // pengguna baru → layar sambutan
    }
    setReady(true);
  }, []);

  // Persist + perbarui state, tanpa splash sambutan (edit nama biasa / sebelum login).
  function update(p: Pengajar) {
    savePengajar(p);
    syncMuridUtama(p.muridNama, p.muridChar); // sinkronkan murid utama ke Ruang Kelas
    setProfil(p);
    setHasProfil(true);
  }

  function save(p: Pengajar) {
    update(p);
    setOnboarding(false);
    setJustWelcomed(true); // selesai onboarding (pertama kali masuk) → sambut
  }

  return (
    <ProfilCtx.Provider value={{ profil, ready, hasProfil, save, update }}>
      {children}
      {onboarding && !infoRoute && <WelcomeScreen onSave={save} />}
      {justWelcomed && hasProfil && (
        <WelcomeSplash profil={profil} onDone={() => setJustWelcomed(false)} />
      )}
    </ProfilCtx.Provider>
  );
}

export function SapaanText() {
  const { profil } = useProfil();
  return <>{sapaan(profil)}</>;
}
export function MuridNameText() {
  const { profil } = useProfil();
  return <>{namaMurid(profil)}</>;
}

// Layar Sambutan (kenalan dulu, tanpa akun)

function WelcomeScreen({ onSave }: { onSave: (p: Pengajar) => void }) {
  const { enabled, signInGoogle } = useAuth();
  const [nama, setNama] = useState("");
  const [gelar, setGelar] = useState("Kak");
  const [murid, setMurid] = useState(DEFAULT_MURID_NAMA);
  const [mChar, setMChar] = useState(DEFAULT_MURID_CHAR);
  const [jenjang, setJenjang] = useState("SMA");
  const [busy, setBusy] = useState(false);
  const confirm = useConfirm();

  async function google() {
    setBusy(true);
    try {
      const res = await signInGoogle();
      if (!res.hasCloud) {
        // login sukses & belum ada data cloud → simpan profil (pakai nama Google kalau kosong) → masuk app
        const nm = nama.trim() || (res.displayName?.trim().split(/\s+/)[0] ?? "");
        onSave({ nama: nm, gelar, muridNama: murid.trim() || DEFAULT_MURID_NAMA, muridChar: mChar, jenjang });
      }
      // kalau hasCloud → app sudah reload dengan data cloud
    } catch (e) {
      const err = e as { code?: string; message?: string };
      // Menutup / membatalkan popup Google BUKAN kegagalan (pengguna sengaja batal) → diam saja.
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

  const preview: Pengajar = { nama, gelar, muridNama: murid, muridChar: mChar };
  const sap = sapaan(preview);
  const m = namaMurid(preview);

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center overflow-y-auto bg-[var(--bg)] p-4">
      <div className="aa-card grid w-full max-w-3xl overflow-hidden lg:grid-cols-[0.82fr_1fr]">
        {/* KIRI: sambutan + maskot + preview obrolan */}
        <div
          className="relative flex flex-col items-center justify-center gap-3 p-6 text-center"
          style={{ background: "linear-gradient(160deg, color-mix(in srgb, var(--primary-bright) 15%, transparent), transparent 72%)" }}
        >
          {/* ikon web (logo) + teks, dipatok di pojok kiri-atas panel */}
          <div className="absolute left-5 top-5 flex items-center gap-2.5">
            <span className="grid h-11 w-11 flex-none place-items-center overflow-hidden rounded-xl bg-white shadow-[var(--shadow-1)] ring-1 ring-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Icon Ajari Aku" width={32} height={32} className="h-8 w-8" />
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/ajariaku.png" alt="Ajari Aku" className="h-[120px] w-auto object-contain -my-[40px]" />
          </div>
          <div className="animate-float">
            <Mascot char={mChar} mood="happy" size={64} />
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight">
            Selamat datang di Ajari Aku
          </h1>
          <p className="max-w-xs text-sm text-ink-soft">
            Perkenalkan diri Anda terlebih dahulu agar murid dapat menyapa dengan tepat.{" "}
            <b className="text-ink">Masuk untuk menyimpan progres, atau coba terlebih dahulu sebagai tamu.</b>
          </p>
          <div className="mt-1 flex w-full items-center gap-2.5 rounded-2xl border border-line bg-surface p-3 text-left">
            <Mascot char={mChar} size={30} />
            <p className="text-sm leading-snug">
              <b>{m}:</b> Halo, {sap}! Ajari saya, ya.
            </p>
          </div>
        </div>

        {/* KANAN: form kompak */}
        <div className="p-5 sm:p-6">
          <label htmlFor="wc-nama" className="block text-sm font-bold">Nama Anda</label>
          <input
            id="wc-nama"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            maxLength={20}
            placeholder="mis. Andi"
            className="mt-1.5 w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-[15px] outline-none transition-colors focus:border-[var(--primary)]"
          />

          {/* Panggilan → Jenjang, berurutan ke bawah & ringkas (chip selebar isi, tak wrap aneh) */}
          <p className="mt-3.5 text-sm font-bold">Panggilan</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {GELAR_OPSI.map((g) => (
              <button key={g} onClick={() => setGelar(g)} aria-pressed={gelar === g} className={`aa-chip-pick${gelar === g ? " is-on" : ""}`}>
                {g}
              </button>
            ))}
          </div>

          <p className="mt-3 text-sm font-bold">Jenjang</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {["SD", "SMP", "SMA"].map((j) => (
              <button key={j} onClick={() => setJenjang(j)} aria-pressed={jenjang === j} className={`aa-chip-pick${jenjang === j ? " is-on" : ""}`}>
                {j}
              </button>
            ))}
          </div>

          <label htmlFor="wc-murid" className="mt-3.5 flex items-center gap-1.5 text-sm font-bold">
            <Star size={14} className="text-[var(--reward)]" /> Nama murid AI Anda
          </label>
          <input
            id="wc-murid"
            value={murid}
            onChange={(e) => setMurid(e.target.value)}
            maxLength={16}
            placeholder="Pio"
            className="mt-1.5 w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-[15px] outline-none transition-colors focus:border-[var(--primary)]"
          />

          <p className="mt-3.5 text-sm font-bold">Karakter murid</p>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {CHARACTERS.map((ch) => {
              const on = mChar === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => setMChar(ch.id)}
                  aria-pressed={on}
                  title={ch.nama}
                  className={`grid place-items-center rounded-2xl border p-1 transition-all ${
                    on ? "-translate-y-0.5 border-transparent bg-[var(--tint)] shadow-[var(--shadow-1)]" : "border-line bg-surface hover:border-[var(--primary)]"
                  }`}
                >
                  <Mascot char={ch.id} size={34} />
                </button>
              );
            })}
          </div>

          {enabled ? (
            <>
              {/* Login = jalur utama (progres tersimpan) */}
              <button
                onClick={google}
                disabled={busy}
                className="aa-btn mt-5 w-full text-base disabled:opacity-60"
              >
                <GoogleG size={18} /> {busy ? "Menghubungkan…" : "Login dengan Google"}
              </button>
              <div className="my-2.5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-ink-soft">
                <span className="h-px flex-1 bg-line" /> atau <span className="h-px flex-1 bg-line" />
              </div>
              {/* Tamu = coba dulu (progres TIDAK disimpan permanen) */}
              <button
                onClick={() => onSave({ nama: nama.trim(), gelar, muridNama: murid.trim() || DEFAULT_MURID_NAMA, muridChar: mChar, jenjang })}
                disabled={busy}
                className="flex w-full items-center justify-center gap-1.5 rounded-full border border-line bg-surface py-2.5 font-display text-sm font-bold text-ink-soft transition-colors hover:border-[var(--primary)] disabled:opacity-60"
              >
                Masuk sebagai Tamu <ArrowRight size={16} />
              </button>
            </>
          ) : (
            <button
              onClick={() => onSave({ nama: nama.trim(), gelar, muridNama: murid.trim() || DEFAULT_MURID_NAMA, muridChar: mChar, jenjang })}
              className="aa-btn mt-5 w-full text-base"
            >
              Masuk sebagai Tamu <ArrowRight size={18} />
            </button>
          )}

          {enabled ? (
            <div className="mt-3.5 flex flex-col items-center gap-1.5 text-[12px] leading-tight">
              <span className="inline-flex items-center gap-2">
                <span className="rounded-md bg-[var(--tint)] px-2 py-0.5 text-[11px] font-extrabold text-[var(--primary-deep)]">Login</span>
                <span className="text-ink-soft">progres tersimpan</span>
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="rounded-md bg-surface-2 px-2 py-0.5 text-[11px] font-extrabold text-ink-soft">Tamu</span>
                <span className="text-ink-soft">progres <b className="text-[var(--node-weak)]">tidak disimpan</b></span>
              </span>
            </div>
          ) : (
            <p className="mt-3 text-center text-xs text-ink-soft">Progres tersimpan di perangkat ini.</p>
          )}
        </div>
      </div>
    </div>
  );
}
