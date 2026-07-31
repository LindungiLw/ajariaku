"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Sun, Moon, ShieldCheck, Trash2, ChevronRight, RotateCcw, LogOut } from "lucide-react";
import { GraduationCap, Star } from "@/components/brand-icons";
import { Mascot } from "@/components/mascot";
import { useProfil } from "@/components/profil-pengajar";
import { useAuth, GoogleG } from "@/components/auth";
import { loadFirebase } from "@/lib/firebase";
import { CHARACTERS } from "@/lib/characters";
import { GELAR_OPSI, sapaan, DEFAULT_MURID_NAMA, DEFAULT_MURID_CHAR, type Pengajar } from "@/lib/profile";
import { applyTema, isDark } from "@/lib/theme";
import { useConfirm } from "@/components/confirm-dialog";

export default function ProfilPage() {
  const { profil, save } = useProfil();
  const { user, enabled, signInGoogle, signOutUser, deleteCloud } = useAuth();
  const [authBusy, setAuthBusy] = useState(false);
  const [photoErr, setPhotoErr] = useState(false);
  const confirm = useConfirm();
  // Preload Firebase saat halaman Profil (tempat tombol Login) dibuka → popup login membuka
  // cepat tanpa jeda unduh (hindari pop-up blocker); halaman lain tetap bebas bundel Firebase.
  useEffect(() => {
    if (enabled) loadFirebase();
  }, [enabled]);
  async function google() {
    setAuthBusy(true);
    try {
      await signInGoogle();
    } catch (e) {
      console.error("[auth] login Google gagal:", e);
      const err = e as { code?: string; message?: string };
      await confirm({ title: "Login Google gagal", message: err?.code || err?.message || "Coba lagi sebentar, ya.", hideCancel: true, confirmText: "Mengerti" });
    } finally {
      setAuthBusy(false);
    }
  }
  async function keluar() {
    if (!(await confirm({ title: "Keluar dari akun Google?", message: "Progresmu tetap aman tersimpan di perangkat ini.", confirmText: "Keluar" }))) return;
    setAuthBusy(true);
    try { await signOutUser(); } catch { /* abaikan */ } finally { setAuthBusy(false); }
  }

  const [nama, setNama] = useState(profil.nama);
  const [gelar, setGelar] = useState(profil.gelar);
  const [murid, setMurid] = useState(profil.muridNama);
  const [mChar, setMChar] = useState(profil.muridChar || DEFAULT_MURID_CHAR);
  const [jenjang, setJenjang] = useState(profil.jenjang || "SMA");
  const [saved, setSaved] = useState(false);

  // sinkron saat profil termuat / berubah
  useEffect(() => {
    setNama(profil.nama);
    setGelar(profil.gelar);
    setMurid(profil.muridNama);
    setMChar(profil.muridChar || DEFAULT_MURID_CHAR);
    setJenjang(profil.jenjang || "SMA");
  }, [profil]);

  const [dark, setDark] = useState(false);
  useEffect(() => setDark(isDark()), []);
  function setTheme(d: boolean) {
    applyTema(d ? "dark" : "light");
    setDark(d);
  }

  const preview: Pengajar = { nama, gelar, muridNama: murid, muridChar: mChar };

  function simpan() {
    save({ nama: nama.trim(), gelar, muridNama: murid.trim() || DEFAULT_MURID_NAMA, muridChar: mChar, jenjang });
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  }

  async function resetProgres() {
    if (!(await confirm({ title: "Hapus semua progres belajar?", message: "XP, level, dan materi yang sudah selesai akan hilang. Tindakan ini tak bisa dibatalkan.", confirmText: "Hapus", danger: true }))) return;
    window.localStorage.removeItem("ajari-aku:progress");
    window.localStorage.removeItem("ajari-aku:sesi");
    window.location.reload();
  }
  async function hapusSemua() {
    const jugaCloud = enabled && !!user;
    if (
      !(await confirm({
        title: "Hapus SEMUA data?",
        message: `Profil, progres, memori, dan murid di perangkat ini${jugaCloud ? " beserta salinan tersinkron di cloud" : ""} akan dihapus. App kembali seperti baru.`,
        confirmText: "Hapus semua",
        danger: true,
      }))
    )
      return;
    if (jugaCloud) {
      try {
        await deleteCloud(); // hapus dokumen Firestore users/{uid}
        await signOutUser();
      } catch (e) {
        console.error("[profil] hapus data cloud gagal:", e);
      }
    }
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith("ajari-aku"))
      .forEach((k) => window.localStorage.removeItem(k));
    window.location.reload();
  }

  return (
    <div className="stagger">
      <h1 className="sr-only">Profil Pengajar</h1>
      {/* header: identitas (bukan statistik) */}
      <section className="aa-card flex items-center gap-4 p-5">
        <Mascot char={mChar} size={64} />
        <div className="min-w-0 flex-1">
          <p className="font-display text-xl font-extrabold leading-tight">{sapaan(preview)}</p>
          <p className="text-sm text-ink-soft">Guru dari {murid.trim() || DEFAULT_MURID_NAMA}</p>
        </div>
        <Link
          href="/progres"
          className="flex flex-none items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs font-bold text-[var(--primary-deep)] transition-colors hover:border-[var(--primary)]"
        >
          Progres <ChevronRight size={14} />
        </Link>
      </section>

      {/* dua kolom di layar lebar; numpuk di HP */}
      <div className="mt-4 grid items-start gap-4 lg:grid-cols-2">
        {/* KIRI: edit profil */}
        <section className="aa-card p-5">
          <h2 className="flex items-center gap-2 font-display text-lg font-extrabold">
            <GraduationCap size={18} className="text-[var(--primary)]" /> Profil Pengajar
          </h2>

          <label htmlFor="profil-nama" className="mt-4 block text-sm font-bold">Nama kamu</label>
          <input
            id="profil-nama"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            maxLength={20}
            placeholder="mis. Andi"
            className="mt-1.5 w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-[15px] outline-none transition-colors focus:border-[var(--primary)]"
          />

          <p className="mt-4 text-sm font-bold">Mau dipanggil apa?</p>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {GELAR_OPSI.map((g) => (
              <button key={g} onClick={() => setGelar(g)} aria-pressed={gelar === g} className={chipCls(gelar === g)}>
                {g}
              </button>
            ))}
          </div>

          <p className="mt-4 text-sm font-bold">Jenjang belajar</p>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {["SD", "SMP", "SMA"].map((j) => (
              <button key={j} onClick={() => setJenjang(j)} aria-pressed={jenjang === j} className={chipCls(jenjang === j)}>
                {j}
              </button>
            ))}
          </div>

          <label htmlFor="profil-murid" className="mt-4 flex items-center gap-1.5 text-sm font-bold">
            <Star size={14} className="text-[var(--reward)]" /> Nama murid AI-mu
          </label>
          <input
            id="profil-murid"
            value={murid}
            onChange={(e) => setMurid(e.target.value)}
            maxLength={16}
            placeholder="Pio"
            className="mt-1.5 w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-[15px] outline-none transition-colors focus:border-[var(--primary)]"
          />

          <p className="mt-4 text-sm font-bold">Karakter murid</p>
          <div className="mt-2 flex flex-wrap gap-2.5">
            {CHARACTERS.map((ch) => {
              const on = mChar === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => setMChar(ch.id)}
                  aria-pressed={on}
                  title={ch.nama}
                  className={`grid place-items-center rounded-2xl border p-1.5 transition-all ${
                    on ? "-translate-y-0.5 border-transparent bg-[var(--tint)] shadow-[var(--shadow-1)]" : "border-line bg-surface hover:border-[var(--primary)]"
                  }`}
                >
                  <Mascot char={ch.id} size={40} />
                </button>
              );
            })}
          </div>

          <button onClick={simpan} className="aa-btn mt-5 w-full">
            {saved ? "Tersimpan" : "Simpan Profil"} <Check size={18} />
          </button>
        </section>

        {/* KANAN: pengaturan */}
        <div className="flex flex-col gap-4">
          {/* tema */}
          <section className="aa-card p-5">
            <h2 className="font-display text-lg font-extrabold">Tampilan</h2>
            <p className="mt-1 text-sm text-ink-soft">Pilih tema terang atau gelap.</p>
            <div className="mt-3 grid grid-cols-2 gap-1 rounded-full border border-line bg-surface-2 p-1">
              <button onClick={() => setTheme(false)} aria-pressed={!dark} className={segCls(!dark)}>
                <Sun size={16} /> Terang
              </button>
              <button onClick={() => setTheme(true)} aria-pressed={dark} className={segCls(dark)}>
                <Moon size={16} /> Gelap
              </button>
            </div>
          </section>

          {/* akun (opsional, hanya bila Firebase aktif) */}
          {enabled && (
            <section className="aa-card p-5">
              <h2 className="font-display text-lg font-extrabold">Akun</h2>
              {user ? (
                <>
                  <div className="mt-3 flex items-center gap-3">
                    {user.photoURL && !photoErr ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.photoURL}
                        alt=""
                        referrerPolicy="no-referrer"
                        onError={() => setPhotoErr(true)}
                        className="h-11 w-11 flex-none rounded-full border border-line object-cover"
                      />
                    ) : (
                      <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-[var(--tint)] font-display text-lg font-extrabold text-[var(--primary-deep)]">
                        {(user.displayName ?? user.email ?? "?").slice(0, 1).toUpperCase()}
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold">{user.displayName ?? "Akun Google"}</p>
                      <p className="truncate text-xs text-ink-soft">{user.email}</p>
                    </div>
                    <span
                      className="flex flex-none items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold"
                      style={{ background: "color-mix(in srgb, var(--node-good) 16%, transparent)", color: "var(--node-good)" }}
                    >
                      <Check size={12} /> Tersinkron
                    </span>
                  </div>
                  <div className="mt-3 flex justify-end border-t border-line pt-3">
                    <button
                      onClick={keluar}
                      disabled={authBusy}
                      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold text-ink-soft transition-colors hover:bg-surface-2 hover:text-[var(--node-weak)] disabled:opacity-60"
                    >
                      <LogOut size={15} /> {authBusy ? "Keluar…" : "Keluar"}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="mt-1 text-sm text-ink-soft">
                    Login Google (opsional) agar progresmu <b className="text-ink">tersimpan & sync</b> antar-perangkat.
                  </p>
                  <button
                    onClick={google}
                    disabled={authBusy}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-line bg-surface py-3 font-display text-sm font-bold transition-colors hover:border-[var(--primary)] disabled:opacity-60"
                  >
                    <GoogleG /> {authBusy ? "Menghubungkan…" : "Lanjutkan dengan Google"}
                  </button>
                </>
              )}
            </section>
          )}

          {/* privasi & data */}
          <section className="aa-card p-5">
            <h2 className="flex items-center gap-2 font-display text-lg font-extrabold">
              <ShieldCheck size={18} className="text-[var(--node-good)]" /> Privasi & Data
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              {enabled ? (
                <>Data tersimpan <b className="text-ink">di perangkat ini</b>; login Google hanya untuk sync antar-perangkat.</>
              ) : (
                <>Semua datamu tersimpan <b className="text-ink">di perangkat ini</b>, tidak dikirim ke server.</>
              )}
            </p>
            <Link
              href="/privasi"
              className="mt-3 flex items-center gap-2 rounded-2xl border border-line bg-surface-2 px-4 py-3 text-sm font-semibold transition-colors hover:border-[var(--primary)]"
            >
              Baca kebijakan privasi <ChevronRight size={16} className="ml-auto text-ink-soft" />
            </Link>

            <div className="mt-4 flex flex-col gap-2">
              <button onClick={resetProgres} className="flex items-center gap-2 rounded-2xl border border-line px-4 py-3 text-sm font-bold text-ink-soft transition-colors hover:bg-surface-2">
                <RotateCcw size={16} /> Reset progres belajar
              </button>
              <button onClick={hapusSemua} className="flex items-center gap-2 rounded-2xl border border-line px-4 py-3 text-sm font-bold text-[var(--node-weak)] transition-colors hover:bg-surface-2">
                <Trash2 size={16} /> Hapus semua data
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function chipCls(on: boolean) {
  return `aa-chip-select${on ? " is-on" : ""}`;
}
function segCls(on: boolean) {
  return `flex items-center justify-center gap-1.5 rounded-full py-2 text-sm font-bold transition-colors ${
    on ? "bg-gradient-to-br from-[var(--cta-1)] to-[var(--cta-2)] text-white shadow-[var(--shadow-1)]" : "text-ink-soft"
  }`;
}
