"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Info, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Star, Flame } from "@/components/brand-icons";
import { IconBeranda, IconBelajar, IconAjari, IconKelas, IconProgres } from "@/components/nav-icons";
import { useProfil } from "@/components/profil-pengajar";
import { useAuth } from "@/components/auth";
import { useLoginSheet } from "@/components/login-sheet";
import { sapaan, DEFAULT_MURID_CHAR } from "@/lib/profile";
import { loadProgress, levelInfo, streakDays } from "@/lib/progress";
import { onCelebrate } from "@/lib/celebrate";
import { applyTema, isDark } from "@/lib/theme";
import { Mascot } from "@/components/mascot";
import { CelebrationHost } from "@/components/celebration-host";

const NAV = [
  { href: "/beranda", label: "Beranda", icon: IconBeranda },
  { href: "/belajar", label: "Belajar", icon: IconBelajar },
  { href: "/ajari", label: "Ajari", icon: IconAjari },
  { href: "/kelas", label: "Kelas", icon: IconKelas },
  { href: "/progres", label: "Progres", icon: IconProgres },
];

function Logo() {
  return (
    <Link href="/beranda" className="flex min-w-0 shrink items-center gap-2.5">
      <span className="grid h-9 w-9 flex-none place-items-center overflow-hidden rounded-[11px] bg-white shadow-[0_8px_18px_-8px_rgba(21,145,220,.5)] ring-1 ring-line">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Icon Ajari Aku" width={30} height={30} className="h-[26px] w-[26px]" />
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/ajariaku.png" alt="Ajari Aku" className="h-[80px] w-auto object-contain -my-[24px]" />
    </Link>
  );
}

// Poin XP: bintang + jumlah XP. Duduk di samping avatar profil.
// Baca ulang tiap pindah rute → bintang ikut naik setelah dapat XP di /ajari.
function XpStar() {
  const path = usePathname();
  const [xp, setXp] = useState(0);
  useEffect(() => setXp(loadProgress().xp), [path]);
  // Bintang XP ikut naik SEKETIKA saat ada perayaan (mis. selesai sesi di /ajari).
  useEffect(() => onCelebrate(() => setXp(loadProgress().xp)), []);
  const lv = levelInfo(xp).level;
  return (
    <span
      title={`${xp} XP · Level ${lv}`}
      aria-label={`${xp} poin XP, Level ${lv}`}
      className="tnum inline-flex items-center gap-1 rounded-full border border-line bg-surface px-2.5 py-1.5 text-sm font-extrabold text-ink"
    >
      <Star size={15} className="flex-none fill-[var(--reward)] text-[var(--reward)]" />
      {xp}
      <span className="ml-0.5 rounded-full bg-[var(--tint)] px-1.5 py-0.5 text-[11px] font-bold text-[var(--primary-deep)]">Lv {lv}</span>
    </span>
  );
}

// Streak api: kehadiran beruntun; ikut update saat perayaan. Disembunyikan di layar kecil biar tak sesak.
function StreakChip() {
  const path = usePathname();
  const [s, setS] = useState(0);
  useEffect(() => setS(streakDays(loadProgress().riwayat)), [path]);
  useEffect(() => onCelebrate(() => setS(streakDays(loadProgress().riwayat))), []);
  return (
    <span
      title={`${s} hari beruntun`}
      aria-label={`${s} hari beruntun`}
      className="tnum hidden items-center gap-1 rounded-full border border-line bg-surface px-2.5 py-1.5 text-sm font-extrabold sm:inline-flex"
      style={{ color: s > 0 ? "var(--reward)" : "var(--ink-soft)" }}
    >
      <Flame size={15} className="flex-none" style={{ fill: s > 0 ? "var(--reward)" : "transparent" }} />
      {s}
    </span>
  );
}

// ThemeToggle is now imported from @/components/theme-toggle

// Avatar murid pilihan saat login, tombol ke /profil.
function ProfilButton() {
  const { profil } = useProfil();
  return (
    <Link
      href="/profil"
      aria-label={`Profil ${sapaan(profil)}`}
      title={sapaan(profil)}
      className="group flex-none rounded-full outline-none"
    >
      <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-full border border-line bg-[var(--tint)] transition-all group-hover:-translate-y-0.5 group-hover:border-[var(--primary)] group-hover:shadow-[var(--shadow-1)]">
        <Mascot char={profil.muridChar || DEFAULT_MURID_CHAR} size={32} />
      </span>
    </Link>
  );
}

// Ambang XP "progres baru" untuk memunculkan lagi banner setelah ditutup (~1 level = 50 XP).
const GUEST_RESURFACE_XP = 50;
const GUEST_DISMISS_KEY = "ajari-aku:guest-banner-dismissed";

// Banner "Mode Tamu", muncul untuk pengguna yang BELUM login (dan Firebase tersedia). BISA DITUTUP:
// penutupan diingat (localStorage menyimpan XP saat ditutup), lalu banner muncul LAGI hanya saat ada
// progres baru berarti (>= 1 level XP) dengan ajakan positif, tak nge-nag, tapi mengingatkan saat ada
// yang layak diselamatkan. Hilang total begitu login.
function GuestBanner() {
  const { user, ready, enabled } = useAuth();
  const { promptLogin } = useLoginSheet();
  const path = usePathname();
  const [show, setShow] = useState(false);
  const [resurface, setResurface] = useState(false);

  // Cek ulang tiap navigasi (mis. setelah lulus topik → XP naik → banner boleh muncul lagi).
  useEffect(() => {
    if (!ready || !enabled || user) {
      setShow(false);
      return;
    }
    try {
      const xp = loadProgress().xp;
      const raw = window.localStorage.getItem(GUEST_DISMISS_KEY);
      const parsed = raw === null ? -1 : Number(raw);
      const dismissedAt = Number.isFinite(parsed) ? parsed : -1; // nilai korup → anggap belum pernah ditutup
      const grew = dismissedAt >= 0 && xp - dismissedAt >= GUEST_RESURFACE_XP;
      setResurface(grew);
      setShow(dismissedAt < 0 || grew);
    } catch {
      setResurface(false);
      setShow(true);
    }
  }, [ready, enabled, user, path]);

  if (!show) return null;

  function tutup() {
    try {
      window.localStorage.setItem(GUEST_DISMISS_KEY, String(loadProgress().xp));
    } catch {
      /* abaikan */
    }
    setShow(false);
  }

  return (
    <div className="border-b border-line" style={{ background: "color-mix(in srgb, var(--reward) 12%, var(--surface))" }}>
      <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-1.5 md:px-6">
        <Info size={15} className="flex-none text-[var(--reward-ink)]" />
        <span className="min-w-0 flex-1 text-[12px] leading-snug text-ink-soft">
          {resurface ? (
            <><b className="text-ink">Progresmu bertambah 🎉</b> Login untuk menyimpannya agar tak hilang.</>
          ) : (
            <><b className="text-ink">Mode Tamu</b> · progres tersimpan di perangkat ini.</>
          )}
        </span>
        <button
          onClick={promptLogin}
          className="flex-none rounded-full bg-gradient-to-r from-[var(--cta-1)] to-[var(--cta-2)] px-3 py-1 text-[12px] font-bold text-white transition"
        >
          Login untuk simpan
        </button>
        <button
          onClick={tutup}
          aria-label="Tutup"
          className="flex-none grid h-6 w-6 place-items-center rounded-full text-ink-soft transition hover:bg-[color-mix(in_srgb,var(--ink)_8%,transparent)]"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const isActive = (href: string) => path === href || path.startsWith(href + "/");
  // /ajari = "workspace chat" penuh-layar: hanya area pesan yang scroll, footer disembunyikan.
  const isChat = path === "/ajari";

  return (
    <div className={isChat ? "flex h-[100dvh] flex-col overflow-hidden overflow-x-clip" : "min-h-screen overflow-x-clip"}>
      {/* perayaan gamifikasi (toast +XP / naik liga / lencana baru) */}
      <CelebrationHost />

      {/* top navigation */}
      <header className="sticky top-0 z-30 border-b border-line bg-surface/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-2.5 md:px-6 md:py-3">
          <Logo />

          {/* desktop links: grup pill tersegmen; label muncul di layar lebar */}
          <nav className="ml-3 hidden items-center gap-1 rounded-full border border-line bg-surface-2 p-1 lg:flex">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                aria-label={label}
                title={label}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
                  isActive(href)
                    ? "bg-gradient-to-r from-[var(--cta-1)] to-[var(--cta-2)] text-white shadow-[0_8px_16px_-10px_rgba(21,145,220,.9)]"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                <Icon size={16} className="flex-none" />
                <span className="hidden lg:inline">{label}</span>
              </Link>
            ))}
          </nav>

          {/* right cluster */}
          <div className="ml-auto flex flex-none items-center gap-2">
            <StreakChip />
            <XpStar />
            <ThemeToggle />
            <ProfilButton />
          </div>
        </div>
      </header>

      {/* pengingat mode tamu (hilang begitu login) */}
      <GuestBanner />

      {/* content */}
      <main className={isChat ? "flex min-h-0 w-full flex-1 flex-col overflow-hidden" : "mx-auto w-full max-w-4xl px-5 pt-6 md:px-8"}>
        {children}
        {!isChat && (
          <footer className="mt-10 border-t border-line pb-28 pt-5 text-center text-xs text-ink-soft lg:pb-10">
            <Link href="/tentang" className="font-bold hover:text-[var(--primary)]">
              Tentang
            </Link>
            <span className="mx-2 opacity-50">·</span>
            <Link href="/privasi" className="font-bold hover:text-[var(--primary)]">
              Privasi &amp; Data
            </Link>
            <span className="mx-2 opacity-50">·</span>
            Datamu tersimpan di perangkat ini
          </footer>
        )}
      </main>

      {/* mobile bottom nav: docked, ikon + label SELALU tampil */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-md items-stretch justify-around px-2">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                aria-label={label}
                className={`flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-bold transition-colors ${
                  active ? "text-[var(--primary-deep)]" : "text-ink-soft"
                }`}
              >
                <span
                  className={`grid h-9 w-12 place-items-center rounded-2xl transition-all duration-200 ${
                    active
                      ? "-translate-y-0.5 bg-gradient-to-br from-[var(--cta-1)] to-[var(--cta-2)] text-white shadow-[0_8px_16px_-8px_rgba(21,145,220,.9)]"
                      : ""
                  }`}
                >
                  <Icon size={20} />
                </span>
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
