// Firebase LAZY: modul auth+firestore TIDAK ikut initial bundle. Diinisialisasi via dynamic
// import hanya saat dibutuhkan (login diklik / sesi tersimpan terdeteksi), sehingga mayoritas
// pengunjung tamu (tanpa wajib login) tak menanggung ~565 KB Firebase. Guest mode bila env belum diisi.
import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";

const cfg = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Aktif hanya bila config inti terisi (dihitung dari env, TANPA memuat Firebase).
export const firebaseEnabled = Boolean(cfg.apiKey && cfg.projectId && cfg.appId);

export type FirebaseBundle = { app: FirebaseApp; auth: Auth; db: Firestore };

let fbPromise: Promise<FirebaseBundle | null> | null = null;

// Muat + inisialisasi Firebase sekali (memoized). Mengembalikan null bila belum dikonfigurasi
// atau dijalankan di server. Import dinamis → Firebase keluar dari initial bundle tiap halaman.
export function loadFirebase(): Promise<FirebaseBundle | null> {
  if (!firebaseEnabled || typeof window === "undefined") return Promise.resolve(null);
  if (!fbPromise) {
    fbPromise = (async () => {
      const [{ initializeApp, getApps }, { getAuth }, { getFirestore }] = await Promise.all([
        import("firebase/app"),
        import("firebase/auth"),
        import("firebase/firestore"),
      ]);
      const app = getApps().length ? getApps()[0] : initializeApp(cfg as Record<string, string>);
      return { app, auth: getAuth(app), db: getFirestore(app) };
    })();
  }
  return fbPromise;
}

// Circuit breaker sinkron cloud
// Bila Firestore menolak secara permanen: rules belum di-deploy (permission-denied),
// kuota harian habis (resource-exhausted), atau sesi tak sah (unauthenticated), hentikan
// SEMUA tulis/baca cloud untuk sesi ini. Tanpa ini, tulis berkala yang gagal akan diulang
// terus oleh SDK di latar belakang → membanjiri console (unhandledRejection) & menguras kuota.
// App tetap jalan penuh dari localStorage (sumber kebenaran), cloud hanya cadangan opsional.
const PAUSE_KEY = "ajari-aku:cloudPaused";
const PAUSE_MS = 60 * 60 * 1000; // 1 jam: setelah kena kuota/timeout, jangan coba tulis lagi tiap reload

let _cloudBlocked = false;
let _checkedPersist = false;

export function cloudBlocked(): boolean {
  // Ingat jeda LINTAS-RELOAD: kalau sesi lalu kena kuota/timeout, JANGAN mencoba tulis lagi tiap
  // muat ulang (itulah yang membuat "Quota exceeded" muncul sekali per reload). Cek localStorage sekali.
  if (!_cloudBlocked && !_checkedPersist) {
    _checkedPersist = true;
    try {
      if (typeof window !== "undefined" && Date.now() < Number(window.localStorage.getItem(PAUSE_KEY) || 0)) {
        _cloudBlocked = true;
      }
    } catch {
      /* abaikan */
    }
  }
  return _cloudBlocked;
}

// Jeda SEMUA sinkron cloud sesi ini + HENTIKAN stream Firestore (disableNetwork) + INGAT lintas-reload.
// Penting: kuota habis (resource-exhausted) diperlakukan SDK sebagai transien → promise setDoc
// MENGGANTUNG & di-retry diam-diam tanpa reject; tanpa disableNetwork retry itu membanjiri console.
// Flag di-set sinkron agar pemanggil lain langsung berhenti.
export function blockCloud(reason: string): void {
  if (_cloudBlocked) return;
  _cloudBlocked = true;
  console.info(`[firebase] sinkron cloud dijeda (${reason}). App tetap jalan dari data lokal; dicoba lagi nanti.`);
  try {
    if (typeof window !== "undefined") window.localStorage.setItem(PAUSE_KEY, String(Date.now() + PAUSE_MS));
  } catch {
    /* abaikan */
  }
  void (async () => {
    try {
      const fb = await loadFirebase();
      if (fb) {
        const { disableNetwork } = await import("firebase/firestore");
        await disableNetwork(fb.db); // batalkan retry stream (kuota habis / offline) → console senyap
      }
    } catch {
      /* abaikan */
    }
  })();
}

// Periksa error Firestore yang REJECT (mis. permission-denied) → jeda sinkron sesi ini.
export function noteFirestoreError(e: unknown): void {
  const code = (e as { code?: string } | null)?.code;
  if (code === "permission-denied" || code === "resource-exhausted" || code === "unauthenticated") {
    blockCloud(code);
  }
}
