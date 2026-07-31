"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { type User } from "firebase/auth";
import { type FieldValue } from "firebase/firestore";
import { loadFirebase, firebaseEnabled, cloudBlocked, noteFirestoreError, blockCloud } from "@/lib/firebase";
import { useConfirm } from "@/components/confirm-dialog";

// Penanda ringan: perangkat ini pernah login? → Firebase (berat) HANYA dimuat untuk pengguna
// berakun; tamu (mayoritas, tanpa wajib login) tak menanggung bundel Firebase sama sekali.
const ACCOUNT_FLAG = "ajari-aku:hasAccount";

type Ctx = {
  user: User | null;
  ready: boolean;
  enabled: boolean; // Firebase terkonfigurasi?
  signInGoogle: () => Promise<{ hasCloud: boolean; displayName: string | null }>;
  signOutUser: () => Promise<void>;
  deleteCloud: () => Promise<void>; // hapus dokumen tersinkron di Firestore
};

const AuthCtx = createContext<Ctx | null>(null);

export function useAuth() {
  const c = useContext(AuthCtx);
  if (!c) throw new Error("useAuth harus di dalam <AuthProvider>");
  return c;
}

// Sync ke Firestore: data dipisah per-field biar rapi & kebaca di console
// localStorage "ajari-aku:<x>"  <->  field Firestore "<x>"  (profil→memori biar jelas)
const FIELD_MAP: Record<string, string> = {
  "ajari-aku:pengajar": "pengajar", // profil guru (nama, gelar, muridNama, muridChar)
  "ajari-aku:progress": "progress", // XP, level, materi selesai
  "ajari-aku:sesi": "sesi",         // sesi mengajar aktif
  "ajari-aku:murid": "murid",       // daftar murid kustom
  "ajari-aku:profil": "memori",     // memori belajar (mastery & kelemahan per konsep)
  "ajari-aku:tema": "tema",         // tema terang/gelap
};
const KEY_BY_FIELD: Record<string, string> = Object.fromEntries(
  Object.entries(FIELD_MAP).map(([k, f]) => [f, k]),
);

// localStorage -> objek Firestore rapi. Nilai JSON di-parse jadi objek asli;
// key yang tak ada di perangkat dihapus dari cloud (deleteField) agar sinkron persis.
function collectStructured(deleteField: () => FieldValue): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, field] of Object.entries(FIELD_MAP)) {
    const raw = window.localStorage.getItem(key);
    if (raw == null) { out[field] = deleteField(); continue; }
    try { out[field] = JSON.parse(raw); } catch { out[field] = raw; } // tema = string biasa
  }
  return out;
}

// Dokumen Firestore -> localStorage. Dukung format lama (blob "data") & format baru (per-field).
function applyFromDoc(d: Record<string, unknown>) {
  const legacy = d.data as Record<string, string> | undefined; // format lama (blob)
  if (legacy && typeof legacy === "object") {
    for (const [k, v] of Object.entries(legacy)) {
      if (k.startsWith("ajari-aku")) window.localStorage.setItem(k, v);
    }
  }
  for (const [field, key] of Object.entries(KEY_BY_FIELD)) { // format baru (rapi)
    const v = d[field];
    if (v == null) continue;
    window.localStorage.setItem(key, typeof v === "string" ? v : JSON.stringify(v));
  }
}

function docHasData(d: Record<string, unknown>): boolean {
  const legacy = d.data as Record<string, unknown> | undefined;
  if (legacy && Object.keys(legacy).length) return true;
  return Object.values(FIELD_MAP).some((f) => d[f] != null);
}

// Tanda-tangan ringkas isi localStorage tersinkron, untuk lewati tulis bila TAK ada perubahan.
function localSig(): string {
  return Object.keys(FIELD_MAP)
    .map((k) => window.localStorage.getItem(k) ?? "")
    .join("");
}
let lastSig: string | null = null;

// Dorong progres lokal → cloud. Tak pernah melempar (swallow + note) supaya aman dipanggil
// "fire-and-forget". Lewati bila: sinkron dijeda breaker, atau isi tak berubah sejak push terakhir.
async function pushFromLocal(uid: string, force = false): Promise<void> {
  if (cloudBlocked()) return; // sinkron dijeda (rules/kuota/timeout) → jangan menumpuk tulis gagal
  const sig = localSig();
  if (!force && sig === lastSig) return; // tak ada perubahan → hemat kuota tulis
  const fb = await loadFirebase();
  if (!fb) return;
  const { doc, setDoc, deleteField } = await import("firebase/firestore");
  const payload: Record<string, unknown> = {
    ...collectStructured(deleteField),
    data: deleteField(), // buang blob lama bila masih ada → dokumen bersih
    akun: deleteField(), // minimisasi PII: JANGAN simpan email/nama/foto di server
    updatedAt: Date.now(),
  };
  // Tulis dengan penanganan galat MANDIRI (tak jadi unhandledRejection walau kita lanjut via timeout).
  let ok = false;
  const writeP = setDoc(doc(fb.db, "users", uid), payload, { merge: true })
    .then(() => { ok = true; })
    .catch((e) => noteFirestoreError(e)); // permission-denied dsb. yang REJECT → jeda sinkron
  // Kuota habis = transien di mata SDK → promise menggantung sambil retry diam-diam. Jangan tunggu
  // selamanya: 8 dtk tak tuntas → jeda sinkron (disableNetwork) agar stream tulis berhenti mengular.
  await Promise.race([writeP, new Promise((r) => setTimeout(r, 8000))]);
  if (ok) lastSig = sig;
  else if (!cloudBlocked()) blockCloud("timeout");
}

// Hak penghapusan (UU PDP): hapus dokumen tersinkron milik pengguna dari cloud.
async function deleteCloudDoc() {
  const fb = await loadFirebase();
  if (!fb) return;
  const u = fb.auth.currentUser;
  if (!u) return;
  const { doc, deleteDoc } = await import("firebase/firestore");
  await deleteDoc(doc(fb.db, "users", u.uid));
}

// Apakah perangkat ini menyimpan progres belajar yang berarti, untuk minta izin sebelum
// mengunggahnya ke akun baru (cegah kebocoran data antar-akun di perangkat bersama).
function hasLocalData(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const prog = window.localStorage.getItem("ajari-aku:progress");
    if (prog) {
      const p = JSON.parse(prog) as { xp?: number; selesai?: unknown[] };
      if ((p?.xp ?? 0) > 0 || (p?.selesai?.length ?? 0) > 0) return true;
    }
    return Boolean(window.localStorage.getItem("ajari-aku:pengajar") || window.localStorage.getItem("ajari-aku:murid"));
  } catch {
    return false;
  }
}

// Bersihkan SEMUA data lokal 'ajari-aku:*' penghuni sebelumnya (kecuali flag akun) sebelum
// menerapkan dokumen cloud pengguna yang login, cegah sisa data tamu/akun lain (murid, memori,
// sesi aktif, preferensi peringkat) ikut terbawa & terunggah ke akun ini (privasi perangkat bersama).
function wipeLocalData() {
  if (typeof window === "undefined") return;
  Object.keys(window.localStorage)
    .filter((k) => k.startsWith("ajari-aku") && k !== ACCOUNT_FLAG)
    .forEach((k) => window.localStorage.removeItem(k));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const confirm = useConfirm();

  useEffect(() => {
    // Muat Firebase hanya bila perangkat ini pernah login (flag) → tamu tak menanggung bundel.
    if (!firebaseEnabled || typeof window === "undefined" || !window.localStorage.getItem(ACCOUNT_FLAG)) {
      setReady(true);
      return;
    }
    let unsub: (() => void) | undefined;
    let alive = true;
    (async () => {
      const fb = await loadFirebase();
      if (!alive) return;
      if (!fb) {
        setReady(true);
        return;
      }
      const { onAuthStateChanged } = await import("firebase/auth");
      unsub = onAuthStateChanged(fb.auth, (u) => {
        setUser(u);
        setReady(true);
        if (!u) window.localStorage.removeItem(ACCOUNT_FLAG); // sesi habis → bersihkan flag
      });
    })();
    return () => {
      alive = false;
      unsub?.();
    };
  }, []);

  // Selama login: dorong progres lokal ke cloud berkala + saat halaman ditutup.
  useEffect(() => {
    if (!user) return;
    const iv = setInterval(() => void pushFromLocal(user.uid), 30000);
    const onHide = () => void pushFromLocal(user.uid);
    window.addEventListener("beforeunload", onHide);
    document.addEventListener("visibilitychange", onHide);
    return () => {
      clearInterval(iv);
      window.removeEventListener("beforeunload", onHide);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, [user]);

  async function signInGoogle(): Promise<{ hasCloud: boolean; displayName: string | null }> {
    const fb = await loadFirebase();
    if (!fb) throw new Error("Firebase belum dikonfigurasi (.env.local)");
    const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
    const cred = await signInWithPopup(fb.auth, new GoogleAuthProvider());
    const uid = cred.user.uid;
    const displayName = cred.user.displayName;
    window.localStorage.setItem(ACCOUNT_FLAG, "1"); // tandai: perangkat ini punya akun
    // Login sudah berhasil di sini, sync jangan sampai menggantung UI.
    const { doc, getDoc } = await import("firebase/firestore");
    try {
      const snap = await getDoc(doc(fb.db, "users", uid));
      const d = snap.exists() ? (snap.data() as Record<string, unknown>) : undefined;
      if (d && docHasData(d)) {
        wipeLocalData(); // buang sisa penghuni sebelumnya SEBELUM memuat data akun ini
        applyFromDoc(d); // pengguna lama → tarik data cloud & muat ulang
        try { window.sessionStorage.setItem("ajari-aku:welcome", "1"); } catch { /* abaikan */ } // sambut setelah reload
        window.location.reload();
        return { hasCloud: true, displayName };
      }
      // Pengguna baru (belum ada dokumen cloud). Di perangkat bersama, cegah progres pengguna
      // sebelumnya ikut terunggah ke akun ini: minta izin dulu bila ada data di perangkat.
      if (hasLocalData()) {
        const unggah = await confirm({
          title: "Simpan progres ke akun Google?",
          message: "Ada progres belajar di perangkat ini. Unggah ke akunmu, atau mulai akun baru yang bersih (progres di perangkat ini tidak diunggah).",
          confirmText: "Unggah progres",
          cancelText: "Akun baru",
          dismissable: false,
        });
        if (!unggah) {
          Object.keys(window.localStorage)
            .filter((k) => k.startsWith("ajari-aku"))
            .forEach((k) => window.localStorage.removeItem(k));
          window.localStorage.setItem(ACCOUNT_FLAG, "1"); // re-set: tetap login walau data dibersihkan
          await pushFromLocal(uid, true); // akun baru mulai bersih
          try { window.sessionStorage.setItem("ajari-aku:welcome", "1"); } catch { /* abaikan */ } // sambut setelah reload
          window.location.reload();
          return { hasCloud: false, displayName };
        }
      }
      await pushFromLocal(uid, true); // pengguna baru (disetujui / perangkat kosong) → seed cloud dari lokal
    } catch (e) {
      console.error("[auth] sync Firestore gagal (login tetap berhasil):", e);
    }
    return { hasCloud: false, displayName };
  }

  async function signOutUser() {
    window.localStorage.removeItem(ACCOUNT_FLAG);
    // Akhiri niat ikut-peringkat secara lokal → akun berikutnya di perangkat ini TIDAK
    // auto-enroll memakai nickname pemilik akun sebelumnya (kebocoran nick antar-akun).
    window.localStorage.removeItem("ajari-aku:leaderboard");
    const fb = await loadFirebase();
    if (fb) {
      const { signOut } = await import("firebase/auth");
      await signOut(fb.auth); // data lokal tetap → kembali jadi tamu
    }
    setUser(null);
  }

  return (
    <AuthCtx.Provider value={{ user, ready, enabled: firebaseEnabled, signInGoogle, signOutUser, deleteCloud: deleteCloudDoc }}>
      {children}
    </AuthCtx.Provider>
  );
}

// Logo "G" Google (4 warna) untuk tombol login.
export function GoogleG({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden className="flex-none">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.2 35.3 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.6 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.6l6.3 5.2C41.9 36 44 30.5 44 24c0-1.3-.1-2.3-.4-3.5z" />
    </svg>
  );
}
