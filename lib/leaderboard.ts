// Papan peringkat global OPSIONAL & anonim. Menjaga prinsip tanpa wajib login (tamu tetap main) & privasi:
// HANYA {nick, xp} yang disimpan/ditampilkan, TANPA nama asli/email/PII. Semua operasi lewat
// loadFirebase() (lazy) + gagal-anggun bila offline / belum login.
import { loadFirebase, cloudBlocked, noteFirestoreError } from "./firebase";
import { loadProgress } from "./progress";

export type LbPref = { on: boolean; nick: string };
export type LbEntry = { uid: string; nick: string; xp: number };

const PREF_KEY = "ajari-aku:leaderboard";

export function loadLbPref(): LbPref {
  if (typeof window === "undefined") return { on: false, nick: "" };
  try {
    const raw = window.localStorage.getItem(PREF_KEY);
    if (!raw) return { on: false, nick: "" };
    const p = JSON.parse(raw) as Partial<LbPref>;
    return { on: !!p.on, nick: typeof p.nick === "string" ? p.nick : "" };
  } catch {
    return { on: false, nick: "" };
  }
}

function savePref(p: LbPref) {
  try {
    window.localStorage.setItem(PREF_KEY, JSON.stringify(p));
  } catch {
    /* abaikan */
  }
}

// Nickname aman: rapikan spasi, batasi 24 char (cocok dgn rules), fallback "Anonim".
function bersihNick(nick: string): string {
  return nick.replace(/\s+/g, " ").trim().slice(0, 24) || "Anonim";
}

// Ikut peringkat: tulis entri {nick, xp} + simpan preferensi. Return true bila berhasil.
export async function joinLeaderboard(nick: string): Promise<boolean> {
  if (cloudBlocked()) return false;
  const fb = await loadFirebase();
  const uid = fb?.auth.currentUser?.uid;
  if (!fb || !uid) return false;
  const nm = bersihNick(nick);
  try {
    const { doc, setDoc } = await import("firebase/firestore");
    await setDoc(doc(fb.db, "leaderboard", uid), { nick: nm, xp: loadProgress().xp, updatedAt: Date.now() });
    savePref({ on: true, nick: nm });
    return true;
  } catch (e) {
    noteFirestoreError(e);
    return false; // rules belum di-deploy / offline → jangan lempar unhandled
  }
}

// Keluar dari peringkat: hapus entri + matikan preferensi.
export async function leaveLeaderboard(): Promise<void> {
  savePref({ ...loadLbPref(), on: false }); // matikan preferensi lokal dulu (yang penting)
  if (cloudBlocked()) return;
  const fb = await loadFirebase();
  const uid = fb?.auth.currentUser?.uid;
  if (!fb || !uid) return;
  const { doc, deleteDoc } = await import("firebase/firestore");
  await deleteDoc(doc(fb.db, "leaderboard", uid)).catch((e) => noteFirestoreError(e));
}

// Perbarui XP entri bila sedang ikut (dipanggil saat papan dibuka) agar peringkat selalu mutakhir.
export async function syncLeaderboardXp(): Promise<void> {
  if (!loadLbPref().on || cloudBlocked()) return;
  const fb = await loadFirebase();
  const uid = fb?.auth.currentUser?.uid;
  if (!fb || !uid) return;
  const { doc, setDoc } = await import("firebase/firestore");
  await setDoc(
    doc(fb.db, "leaderboard", uid),
    { nick: bersihNick(loadLbPref().nick), xp: loadProgress().xp, updatedAt: Date.now() },
    { merge: true },
  ).catch((e) => noteFirestoreError(e));
}

// Ambil N peringkat teratas (urut XP menurun).
export async function fetchTop(n = 50): Promise<LbEntry[]> {
  if (cloudBlocked()) return []; // sinkron dijeda → jangan tembak kuota baca yang habis
  const fb = await loadFirebase();
  if (!fb) return [];
  try {
    const { collection, query, orderBy, limit, getDocs } = await import("firebase/firestore");
    const snap = await getDocs(query(collection(fb.db, "leaderboard"), orderBy("xp", "desc"), limit(n)));
    return snap.docs.map((d) => {
      const v = d.data() as { nick?: string; xp?: number };
      return { uid: d.id, nick: v.nick ?? "Anonim", xp: v.xp ?? 0 };
    });
  } catch (e) {
    noteFirestoreError(e);
    return []; // rules belum di-deploy / offline → papan kosong (jangan lempar unhandled)
  }
}

// uid pengguna saat ini (untuk menyorot baris "kamu" di papan).
export async function myUid(): Promise<string | null> {
  const fb = await loadFirebase();
  return fb?.auth.currentUser?.uid ?? null;
}
