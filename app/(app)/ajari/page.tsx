"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Pi, RotateCcw, ArrowRight, Flag, BookCheck, KeyRound, X, AlertTriangle, Users, ChevronDown } from "lucide-react";
import { Star, CheckCircle2, BrainCircuit } from "@/components/brand-icons";
import { Mascot } from "@/components/mascot";
import { Konfeti } from "@/components/confetti";
import {
  loadProfil,
  profilSummary,
  sapaanMemori,
  type Profil,
} from "@/lib/memory";
import { useProfil } from "@/components/profil-pengajar";
import { sapaan, namaMurid, loadPengajar } from "@/lib/profile";
import { getSesi, setSesi, clearSesi, completeTopic, addXp, isDone, isMateriDone, isLatihanDone, loadProgress, bumpKoreksi, type Sesi } from "@/lib/progress";
import { activeTopikFor } from "@/lib/next-topic";
import { buildSesi } from "@/lib/sesi";
import { kategoriForTopik } from "@/lib/kelas-topik";
import { KATEGORI } from "@/lib/avatar";
import { MuridPicker } from "@/components/murid-picker";
import { KeliruCard } from "@/components/keliru-card";
import { creditMurid, creditMuridXp, loadMurid, karakterForMurid, pangkatMurid, UTAMA_ID, type MuridKustom } from "@/lib/murid";
import { celebrate, celebrateDelta, celebrateBadges } from "@/lib/celebrate";
import { materiById, type MateriRingkas } from "@/lib/materi";
import { parseContoh, parseMiskonsepsi } from "@/lib/materi-parse";
import { resolveTopik } from "@/lib/topik";
import { responLokal, newMuridState, type MuridState } from "@/lib/murid-lokal";
import { prettyMath } from "@/lib/pretty-math";
import { PAKAI_GEMINI, toHistory, type Mood, type Msg } from "@/lib/ajari-fallback";
import { geminiAllowed, noteGeminiCall } from "@/lib/gemini-guard";
import dynamic from "next/dynamic";

// Rapor Sesi (layar hasil) hanya muncul saat sesi selesai → dipisah dari bundle awal.
const Rapor = dynamic(() => import("@/components/rapor-sesi").then((m) => m.Rapor), { ssr: false });

const TOPIK_DEFAULT = "Persamaan Linear";
const SOAL_DEFAULT = "2x + 3 = 11";
const XP_PER_TURN = 20;
const XP_KOREKSI = 15; // bonus XP saat murid AI berhasil dikoreksi (momen protégé effect)
const XP_SOAL_LANJUT = 12; // bonus XP lanjut ke soal berikutnya (mode Gemini)
const TYPING_MS = 600; // jeda "mengetik" murid biar terasa hidup

// Kalimat pembuka UMUM (cocok untuk topik apa pun), bantu guru yang bingung memulai.
// Sengaja tidak spesifik ke satu materi agar tidak salah konteks di topik lain.
const STARTERS = [
  "Kita mulai dari yang paling dasar dulu ya.",
  "Coba sebutkan dulu apa yang sudah kamu tahu soal ini.",
  "Perhatikan baik-baik, aku tunjukkan langkah pertamanya.",
];

// Simbol matematika cepat untuk kotak ketik.
const SYMBOLS = ["×", "÷", "√", "π", "²", "³", "½", "⅓", "¼", "≤", "≥", "≠", "±", "°"];

// Label bidang ringkas dari id kategori (mis. "Bilangan", "Trigono.").
const bidangShort = (kat: string) => KATEGORI.find((k) => k.id === kat)?.short ?? kat;

// Sapaan pembuka default (dipakai bila sapaanMemori null).
function greetDefault(murid: string, sap: string, soal: string): string {
  return `Halo, ${sap}! Aku ${murid} 🦉 Aku bingung cara nyelesaiin ${soal}. Ajari aku selangkah demi selangkah ya, kalau aku keliru, betulkan sampai paham.`;
}

// Apakah MURID Ruang Kelas ini sudah pernah menuntaskan topik tsb, untuk menggerbangi kredit
// per-murid berdasar penguasaan MURID sendiri (bukan penguasaan global guru).
function muridSudah(id: string, topikId: string): boolean {
  return loadMurid().some((m) => m.id === id && (m.selesai ?? []).includes(topikId));
}

// Sapaan pembuka dibuat dinamis di dalam komponen (pakai nama murid & sapaan pengajar).

export default function AjariPage() {
  const { profil: pengajar } = useProfil();
  const sap = sapaan(pengajar);
  const router = useRouter();
  const [sesi, setSesiState] = useState<Sesi | null>(null);
  // Panduan bila belum boleh mengajar (Quiz belum lulus) → tampil di halaman ini, bukan lempar diam-diam ke Materi.
  const [needStage, setNeedStage] = useState<{ id: string; judul: string; mDone: boolean } | null>(null);
  // Identitas murid: dari sesi (kalau dimulai dari Ruang Kelas), fallback ke profil.
  const murid = sesi?.muridNama || namaMurid(pengajar);
  const muridAvatar = sesi?.muridAvatar;
  // Kunci memori (bukan gerbang): sesi solo pakai store Pio sendiri, bukan agregat global.
  const memId = sesi?.muridId ?? UTAMA_ID;
  const [soalIdx, setSoalIdx] = useState(0);
  const soalList = sesi?.soalList?.length ? sesi.soalList : [sesi?.soal ?? SOAL_DEFAULT];
  const totalSoal = soalList.length;
  const soalAktif = soalList[Math.min(soalIdx, totalSoal - 1)] ?? SOAL_DEFAULT;
  const topikAktif = sesi?.topik ?? TOPIK_DEFAULT;
  const bidangAktif = sesi ? bidangShort(kategoriForTopik(sesi.id)) : ""; // bidang topik yang sedang dibahas
  // Pembahasan/kunci topik (contoh + kesalahan umum), sudah ada di data, dibuka on-demand.
  const bantuan = sesi ? materiById(sesi.id) : undefined;
  // Memori murid sesi ini. Dideklarasikan sebelum greeting yang memakainya (hindari TDZ).
  const [profil, setProfil] = useState<Profil | null>(null);
  // Sapaan sadar-memori bila murid ini pernah diajar; else default.
  const greeting = sapaanMemori(profil, sap, soalAktif) ?? greetDefault(murid, sap, soalAktif);

  const [messages, setMessages] = useState<Msg[]>([
    { from: "murid", text: greeting },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [xp, setXp] = useState(0);
  const [xpKey, setXpKey] = useState(0);
  const sessionXpRef = useRef(0); // total XP diperoleh sesi ini
  const creditedRef = useRef(0); // XP yang SUDAH masuk ke store (global + murid) → cegah dobel
  // Tambah XP sesi (tampilan). Disimpan ke store saat flushXp() di batas tahapan / sesi selesai.
  function addSessionXp(n: number) {
    sessionXpRef.current += n;
    setXp(sessionXpRef.current);
  }
  // Simpan XP tahapan yang belum tercatat. Gerbang DIPISAH: XP GLOBAL guru di-gate penguasaan global
  // (cegah farming re-teach guru), sedangkan XP MURID Ruang Kelas di-gate penguasaan MURID SENDIRI,
  // jadi topik yang sudah dikuasai guru TETAP mengkreditkan murid lain (tiap murid tumbuh sendiri).
  function flushXp() {
    if (!sesi) return;
    const delta = sessionXpRef.current - creditedRef.current;
    if (delta <= 0) return;
    const doGlobal = !isDone(sesi.id) && isLatihanDone(sesi.id); // XP GLOBAL hanya bila Quiz topik ini lulus
    const doMurid = !!sesi.muridId && !muridSudah(sesi.muridId, sesi.id);
    if (!doGlobal && !doMurid) return; // guru & murid sama-sama sudah kuasai → tak ada yang dikreditkan
    const before = loadProgress();
    const muridBefore = loadMurid();
    creditedRef.current = sessionXpRef.current;
    if (doGlobal) addXp(delta);
    if (doMurid) creditMuridXp(sesi.muridId!, delta);
    celebrateDelta(before, loadProgress(), { muridBefore, muridAfter: loadMurid() });
  }
  const [muridMood, setMuridMood] = useState<Mood>("curious");
  const [used, setUsed] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [reteach, setReteach] = useState(false); // sesi ULANG atas topik yang sudah dikuasai → tak ada XP baru
  const [showRapor, setShowRapor] = useState(false);
  const [demo, setDemo] = useState(false); // true = murid AI pakai skrip cadangan (offline/kuota)
  const [sumber, setSumber] = useState<string[]>([]); // konsep RAG acuan → grounding terlihat
  const [showKunci, setShowKunci] = useState(false); // buka pembahasan/kunci saat mentok (default tertutup)
  const [showSymbols, setShowSymbols] = useState(false); // papan simbol matematika (disembunyikan default biar ringkas)
  const [atBottom, setAtBottom] = useState(true); // apakah scroll chat di dasar (untuk auto-scroll cerdas)
  const [muridList, setMuridList] = useState<MuridKustom[]>([]); // daftar murid AI (panel kiri desktop)
  const [pickFor, setPickFor] = useState<MuridKustom | null>(null); // murid yang sedang dipilih materinya

  const endRef = useRef<HTMLDivElement>(null); // sentinel dasar daftar pesan (untuk scrollIntoView)
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null); // kontainer pesan, satu-satunya yang scroll
  const alive = useRef(true);
  const muridSt = useRef<MuridState>(newMuridState()); // fase murid lokal (keliru → dikoreksi → paham)

  useEffect(() => {
    alive.current = true;
    setMuridList(loadMurid()); // daftar murid AI untuk panel kiri (desktop)
    const s = getSesi(); // topik yang dipilih dari menu Belajar/Kelas/Beranda (bisa bawa muridId)
    // KUNCI SUNGGUHAN: Ajari hanya boleh dibuka bila Quiz topik ini sudah LULUS (isLatihanDone),
    // menutup celah bypass lewat Beranda "Ajari Sekarang", tab nav Ajari, & tombol Ajari di Materi,
    // konsisten dengan gerbang Quiz di /kursus. Topik yang sudah lulus tetap boleh di-re-teach.
    // Gerbang sesi SOLO: Ajari hanya boleh bila Quiz topik ini LULUS. Bila belum, JANGAN lempar diam-diam
    // ke Materi, tampilkan PANDUAN di halaman ini (setNeedStage) supaya user paham & memilih sendiri.
    const gateSolo = (id: string, judul: string) => {
      if (isLatihanDone(id)) return false; // Quiz sudah lulus → boleh mengajar
      setNeedStage({ id, judul, mDone: isMateriDone(id) });
      return true;
    };
    if (s) {
      // Belajar dulu baru mengajar: SEMUA sesi (solo & Kelas) wajib Quiz lulus (isLatihanDone).
      if (gateSolo(s.id, s.judul)) return;
      setSesiState(s);
    } else {
      // Tanpa sesi (mis. klik tab "Ajari") → topik aktif; bila Quiz-nya belum lulus, tampilkan panduan.
      const jenjang = loadPengajar()?.jenjang;
      const active = activeTopikFor(jenjang, loadProgress().selesai);
      if (gateSolo(active.id, active.judul)) return;
      const s2 = buildSesi(active.id, null); // sesi solo (tanpa murid)
      setSesi(s2);
      setSesiState(s2);
    }
    return () => {
      alive.current = false;
    };
  }, []);

  // Muat memori murid sesi ini (memId: solo -> store Pio).
  useEffect(() => {
    setProfil(loadProfil(memId));
  }, [memId]);

  // Tandai topik tuntas & simpan XP saat sesi selesai (persisten, tanpa wajib login).
  // Kreditkan XP yang BENAR-BENAR ditampilkan (akumulasi sesi), bukan angka tetap,
  // biar "+{xp} XP" di kartu selesai = kenaikan yang muncul di Progres. Idempoten via id.
  // XP diberikan: MINIMAL sebesar hadiah topik (yang tertera di peta), lebih bila usaha banyak.
  // Bikin label "+X XP" jadi jaminan minimum, bukan janji yang meleset.
  const earnedXp = Math.max(xp, sesi?.xp ?? 0);
  // Yang DITAMPILKAN sebagai "didapat": 0 bila re-teach topik tuntas (XP memang tak dikreditkan),
  // jangan mengklaim "+X XP" palsu yang tak muncul di Progres.
  const shownXp = reteach ? 0 : earnedXp;

  // reteach = TIDAK ada kredit baru (global & murid sama-sama tak berhak / sudah kuasai) → kartu
  // selesai menampilkan "sudah dikuasai, XP tak ditambah". Dipakai di done-effect & handler Akhiri.
  function hitungReteach(s: Sesi | null): boolean {
    if (!s) return false;
    const gDone = isDone(s.id);
    const mDone = s.muridId ? muridSudah(s.muridId, s.id) : gDone;
    const bolehGlobal = !gDone && isLatihanDone(s.id);
    return !bolehGlobal && !(!!s.muridId && !mDone);
  }

  useEffect(() => {
    if (done && sesi) {
      const globalDone = isDone(sesi.id);
      const muridDone = sesi.muridId ? muridSudah(sesi.muridId, sesi.id) : globalDone;
      // Mastery/XP GLOBAL hanya sah bila Quiz topik ini lulus. Sesi Kelas atas topik yang Quiz-nya
      // belum lulus tetap berjalan, tapi hanya menambah progres per-murid, bukan penguasaan global.
      const bolehGlobal = !globalDone && isLatihanDone(sesi.id);
      // "re-teach" (tak ada XP baru) = pihak yang RELEVAN sudah menguasai: sesi Kelas → murid ini,
      // sesi solo → penguasaan global guru.
      setReteach(hitungReteach(sesi));
      flushXp(); // simpan + rayakan XP tahapan terakhir (gerbang global/murid dipisah di dalam)
      const floorTopUp = Math.max(0, sesi.xp - creditedRef.current);
      const before = loadProgress();
      const muridBefore = loadMurid();
      // Tandai DIKUASAI global (buka node berikut + riwayat/streak) bila Quiz lulus & guru belum kuasai.
      if (bolehGlobal) completeTopic(sesi.id, floorTopUp, sesi.judul);
      // Tandai topik "diajari" untuk MURID ini + top-up lantai (idempoten per murid) bila MURID belum kuasai.
      if (sesi.muridId && !muridDone) creditMurid(sesi.muridId, sesi.id, floorTopUp);
      if (bolehGlobal || (sesi.muridId && !muridDone))
        celebrateDelta(before, loadProgress(), { muridBefore, muridAfter: loadMurid() });
      clearSesi(); // sesi sudah tuntas → jangan di-resume saat buka /ajari lagi
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, sesi]);

  // Perbarui sapaan pembuka begitu profil termuat, selama sesi belum dimulai.
  useEffect(() => {
    setMessages((m) =>
      m.length === 1 && m[0].from === "murid" && xp === 0 && !done
        ? [{ from: "murid", text: greeting }]
        : m,
    );
  }, [greeting, xp, done]);

  // Segarkan daftar murid saat sesi selesai (level/materi murid ikut ter-update).
  useEffect(() => setMuridList(loadMurid()), [done]);

  // Auto-scroll CERDAS: hanya ikut ke bawah kalau guru memang di dasar (tak menyentak saat baca riwayat).
  useEffect(() => {
    if (atBottom) endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing, atBottom]);

  // Chat kini scroll INTERNAL (kontainer pesan), bukan window → deteksi "sudah di dasar?" dari kontainer.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 80);
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, []);
  function toBottom() {
    setAtBottom(true);
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }

  const teacherTurns = messages.filter((m) => m.from === "kamu").length;

  async function send(text: string) {
    const clean = text.trim();
    if (!clean || typing || done) return;

    const convo: Msg[] = [...messages, { from: "kamu", text: clean }];
    setMessages(convo);
    setInput("");
    addSessionXp(XP_PER_TURN);
    setXpKey((k) => k + 1);
    setTyping(true);

    let reply = "";
    let understood = false;
    let mood: Mood = "curious";
    let dikoreksi = false;
    let usedFallback = false;

    if (!PAKAI_GEMINI) {
      // Murid AI lokal (tanpa Gemini): keliru → dikoreksi → paham
      const hasil = responLokal(sesi?.id ?? "", clean, muridSt.current, sesi?.muridId);
      reply = hasil.reply;
      understood = hasil.understood;
      mood = hasil.mood;
      dikoreksi = hasil.dikoreksi;
      if (!sumber.length) setSumber([topikAktif]); // chip "Sumber: Kurikulum Merdeka" tetap tampil
      await new Promise((r) => setTimeout(r, TYPING_MS)); // jeda "mengetik" biar terasa hidup
    } else {
      const boleh = geminiAllowed();
      if (boleh) noteGeminiCall(); // hitung panggilan ini terhadap batas harian per-perangkat
      try {
        if (!boleh) throw new Error("cap-harian"); // batas harian Gemini tercapai → pakai mode lokal
        const res = await fetch("/api/ajari", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            mode: "chat",
            gaya: "langkah",
            topic: topikAktif,
            topikId: sesi?.id,
            soal: soalAktif,
            profil: profilSummary(profil),
            murid,
            karakter: karakterForMurid(sesi?.muridId),
            sapaan: sap,
            history: toHistory(convo),
          }),
        });
        const data = await res.json();
        if (!res.ok || !data?.reply || data.fallback) throw new Error("fallback");
        reply = String(data.reply);
        understood = !!data.understood;
        mood = (["happy", "curious", "oops"].includes(data.mood) ? data.mood : "curious") as Mood;
        dikoreksi = !!data.dikoreksi; // sinyal eksplisit murid AI: guru baru saja mengoreksinya
        if (Array.isArray(data.sumber)) setSumber(data.sumber as string[]); // konsep RAG acuan
      } catch {
        usedFallback = true;
        // Jaring pengaman OFFLINE (Gemini gagal / kuota habis): pakai mesin murid LOKAL yang tetap
        // memodelkan siklus keliru→dikoreksi→paham + sinyal `dikoreksi`, supaya USP (koreksi
        // miskonsepsi + XP + lencana Detektif) TETAP hidup tanpa API, bukan fallbackReply yang
        // tak pernah mengoreksi. Justru pas skenario "demo tak boleh mati", pembeda utama tetap tampil.
        const hasil = responLokal(sesi?.id ?? "", clean, muridSt.current, sesi?.muridId);
        reply = hasil.reply;
        understood = hasil.understood;
        mood = hasil.mood;
        dikoreksi = hasil.dikoreksi;
      }
      if (usedFallback) {
        setDemo(true);
        await new Promise((r) => setTimeout(r, TYPING_MS));
      }
    }
    if (!alive.current) return;

    setTyping(false);
    setMuridMood(mood);
    setMessages((m) => [...m, { from: "murid", text: reply }]);

    // Momen protégé effect: murid menandai SENDIRI (dikoreksi:true) saat guru berhasil
    // membetulkan miskonsepsinya, sinyal eksplisit, bukan tebakan dari transisi mood.
    // Catat koreksi (metrik USP + XP + lencana) HANYA untuk topik yang BELUM dikuasai, cegah
    // "farming" penghitung koreksi/lencana Detektif dengan mengulang topik tuntas (XP pun tak masuk).
    if (dikoreksi && sesi && !isDone(sesi.id)) {
      const beforeKor = loadProgress();
      bumpKoreksi(); // catat: 1 miskonsepsi berhasil dikoreksi (metrik USP)
      addSessionXp(XP_KOREKSI);
      // rayakan lewat satu sistem toast terpusat (hindari 2 toast tumpang-tindih)
      // Toast koreksi = sorotan momen (bukan angka), sebab +15 XP-nya sudah ikut di toast total XP
      // saat sesi/soal selesai → hindari angka dobel yang bikin kesan XP lebih besar dari kenyataan.
      celebrate([{ kind: "koreksi", label: "Koreksi tepat! 🎯", sub: `Kamu mengoreksi ${murid}` }]);
      celebrateBadges(beforeKor, loadProgress()); // mis. lencana "Detektif Miskonsepsi"
    }

    if (understood) {
      // Mode LOKAL: satu siklus (keliru→koreksi→paham) = sesi tuntas, tak lanjut soal berikutnya.
      if (PAKAI_GEMINI && soalIdx < totalSoal - 1) {
        const ni = soalIdx + 1;
        setSoalIdx(ni);
        addSessionXp(XP_SOAL_LANJUT);
        flushXp(); // satu tahapan (soal) selesai → simpan XP-nya (partial credit)
        setMessages((m) => [
          ...m,
          { from: "murid", text: `Aku paham soal itu! 🎉 (${ni}/${totalSoal}) Sekarang bantu aku yang ini ya: ${soalList[ni]}` },
        ]);
      } else {
        setReteach(hitungReteach(sesi)); // tangkap SEBELUM completeTopic → tak ada kedip klaim XP
        setDone(true); // sesi tuntas
      }
    }
  }

  function pickChip(c: string) {
    setUsed((u) => [...u, c]);
    send(c);
  }

  function insertSymbol(sym: string) {
    const el = inputRef.current;
    if (!el) {
      setInput((v) => v + sym);
      return;
    }
    const start = el.selectionStart ?? input.length;
    const end = el.selectionEnd ?? input.length;
    setInput(input.slice(0, start) + sym + input.slice(end));
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + sym.length;
      el.setSelectionRange(pos, pos);
    });
  }

  function reset() {
    setMessages([{ from: "murid", text: greeting }]);
    setInput("");
    setTyping(false);
    sessionXpRef.current = 0;
    creditedRef.current = 0;
    setXp(0);
    setXpKey(0);
    setMuridMood("curious");
    setUsed([]);
    setSoalIdx(0);
    setDone(false);
    setReteach(false);
    setShowRapor(false);
    setDemo(false);
    setSumber([]);
    setShowKunci(false);
    setShowSymbols(false);
    muridSt.current = newMuridState(); // ulangi dari awal: murid belum bikin kesalahan
  }

  // Ganti murid/topik tanpa pindah halaman: simpan sesi baru + reset state chat + sapaan murid baru.
  function beginSesi(s: Sesi) {
    setSesiState(s);
    setSoalIdx(0);
    const nm = s.muridNama || namaMurid(pengajar);
    const firstSoal = (s.soalList?.length ? s.soalList : [s.soal ?? SOAL_DEFAULT])[0] ?? SOAL_DEFAULT;
    // Muat memori murid baru dulu → sapaan langsung sadar-memori.
    const mem = loadProfil(s.muridId ?? UTAMA_ID);
    setProfil(mem);
    setMessages([{ from: "murid", text: sapaanMemori(mem, sap, firstSoal) ?? greetDefault(nm, sap, firstSoal) }]);
    setInput("");
    setTyping(false);
    sessionXpRef.current = 0;
    creditedRef.current = 0;
    setXp(0);
    setXpKey(0);
    setMuridMood("curious");
    setUsed([]);
    setDone(false);
    setReteach(false);
    setShowRapor(false);
    setDemo(false);
    setSumber([]);
    setShowKunci(false);
    setShowSymbols(false);
    muridSt.current = newMuridState();
  }

  // Pilih materi untuk murid (dari panel kiri) → mulai sesi baru dengan murid itu.
  function pickTopic(id: string) {
    const m = pickFor;
    setPickFor(null);
    if (!resolveTopik(id)) return; // topik tak dikenal → abaikan
    const s = buildSesi(id, m);
    setSesi(s);
    beginSesi(s);
  }

  if (showRapor)
    return (
      // Rapor panjang → kontainer scroll sendiri (main /ajari kini overflow-hidden). pb utk menu-bawah mobile.
      <div className="h-full overflow-y-auto px-4 pb-[84px] pt-5 md:px-8 lg:pb-8">
        <div className="mx-auto max-w-2xl">
          <Rapor
            xp={shownXp}
            reteach={reteach}
            messages={messages}
            topik={topikAktif}
            topikId={sesi?.id}
            muridId={memId}
            soal={soalAktif}
            muridNama={murid}
            muridAvatar={muridAvatar}
            onRepeat={reset}
          />
        </div>
      </div>
    );

  const stepNo = messages.filter((m) => m.from === "kamu").length + 1;
  const chips = STARTERS.filter((c) => !used.includes(c));
  // Mode aktif: "Kelas" (murid buatan) vs "Petualangan Pribadi" (Pio/murid utama, dari Peta/solo).
  const isKelas = !!sesi?.muridId && sesi.muridId !== UTAMA_ID;
  // Ukuran soal ADAPTIF: makin panjang teks soal, makin kecil font-nya agar tak melebar / makan banyak tempat.
  const soalLen = soalAktif.length;
  const soalSize =
    soalLen > 70 ? "text-sm sm:text-base"
      : soalLen > 44 ? "text-base sm:text-lg"
        : soalLen > 24 ? "text-lg sm:text-xl"
          : "text-xl sm:text-2xl";

  // Belum boleh mengajar (Quiz belum lulus) → PANDUAN di halaman ini, bukan lompatan diam-diam ke Materi.
  if (needStage)
    return (
      <div className="mx-auto flex min-h-[68vh] w-full max-w-md flex-col items-center justify-center gap-5 px-4 text-center">
        <Mascot mood="curious" size={76} />
        <div>
          <h1 className="font-display text-2xl font-extrabold">Belajar dulu, baru mengajar</h1>
          <p className="mt-2 leading-relaxed text-ink-soft">
            Untuk mengajari murid AI topik <b className="text-ink">{needStage.judul}</b>, kamu perlu{" "}
            {needStage.mDone ? (
              <b className="text-ink">lulus Quiz</b>
            ) : (
              <>baca <b className="text-ink">Materi</b> lalu <b className="text-ink">lulus Quiz</b></>
            )}{" "}
            dulu, justru dengan memahaminya sendiri, kamu jadi bisa mengajarkannya. 📘
          </p>
        </div>
        <div className="flex w-full flex-col gap-2.5">
          <button
            onClick={() =>
              router.push(
                needStage.mDone
                  ? `/kursus?topik=${encodeURIComponent(needStage.id)}`
                  : `/belajar/materi?topik=${encodeURIComponent(needStage.id)}`,
              )
            }
            className="aa-btn w-full justify-center"
          >
            {needStage.mDone ? "Kerjakan Quiz" : "Mulai dari Materi"} <ArrowRight size={18} />
          </button>
          <button onClick={() => router.push("/belajar")} className="aa-btn-ghost w-full justify-center">
            Lihat Peta Belajar
          </button>
        </div>
      </div>
    );

  return (
    <div className="mx-auto flex w-full min-h-0 max-w-5xl flex-1 overflow-hidden px-4 pb-[64px] md:px-6 lg:pb-0">
      <h1 className="sr-only">Ajari {murid}</h1>

      {showKunci && bantuan && !done && (
        <PembahasanModal bantuan={bantuan} topik={topikAktif} murid={murid} onClose={() => setShowKunci(false)} />
      )}
      {pickFor && <MuridPicker murid={pickFor} taken={new Set<string>()} onClose={() => setPickFor(null)} onPick={pickTopic} />}

      {/* KIRI: daftar murid AI (desktop) */}
      <aside className="hidden w-[228px] flex-none flex-col overflow-hidden border-r border-line bg-surface-2/30 lg:flex">
        <div className="flex flex-none items-center gap-1.5 border-b border-line px-3 py-3 text-[11px] font-extrabold uppercase tracking-wider text-ink-soft">
          <Users size={13} className="text-[var(--primary)]" /> Ajari siapa?
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          {/* MODE 1: Petualangan Pribadi (Pio, progres pribadi lewat Peta) */}
          <Link
            href="/belajar"
            className="mb-1 flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition hover:brightness-105"
            style={{ background: "color-mix(in srgb, var(--reward) 9%, transparent)" }}
          >
            <span className="grid h-[34px] w-[34px] flex-none place-items-center rounded-full text-[17px]" style={{ background: "color-mix(in srgb, var(--reward) 18%, transparent)" }}>🗺️</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-display text-[13px] font-extrabold leading-tight">Petualangan Pribadi</span>
              <span className="block truncate text-[10px] text-ink-soft">Peta materi · progres pribadimu</span>
            </span>
          </Link>

          {/* MODE 2: Kelas (murid buatanmu, tiap murid naik level sendiri) */}
          <p className="px-2 pb-1 pt-2.5 text-[10px] font-extrabold uppercase tracking-wider text-ink-soft">Kelas</p>
          {muridList.map((mu) => {
            const on = sesi?.muridId === mu.id;
            const utama = mu.id === UTAMA_ID;
            const pk = pangkatMurid(mu.xp ?? 0); // gelar + level murid ini
            return (
              <button
                key={mu.id}
                onClick={() => setPickFor(mu)}
                className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors ${on ? "bg-[var(--tint)]" : "hover:bg-surface-2"}`}
              >
                <Mascot avatar={mu.avatar} size={34} className="flex-none" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-[13px] font-extrabold leading-tight">{mu.nama}</span>
                  <span className="block truncate text-[10px] text-ink-soft tnum">{utama ? "Utama · " : ""}{bidangShort(mu.kategori)} · Lv {pk.level}</span>
                </span>
              </button>
            );
          })}
        </div>
        <Link
          href="/kelas"
          className="flex flex-none items-center justify-center gap-1.5 border-t border-line py-3 text-[12px] font-bold text-[var(--primary)] transition-colors hover:bg-[var(--tint)]/50"
        >
          <Users size={14} /> Kelola murid
        </Link>
      </aside>

      {/* TENGAH: chat + panel pembahasan */}
      <div className="flex min-w-0 flex-1 overflow-hidden">
        <section className="relative flex min-w-0 flex-1 flex-col">
        <p className="sr-only" role="status" aria-live="polite">{typing ? `${murid} sedang mengetik…` : ""}</p>

        {/* HEADER chat (fixed): identitas + papan soal */}
        <div className="flex-none border-b border-line px-3 pb-2.5 pt-2.5 sm:px-4">
          <div className="mb-2 flex items-center gap-2">
            <Mascot mood={typing ? "curious" : muridMood} size={32} avatar={muridAvatar} char={pengajar.muridChar} className="animate-float" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate font-display text-sm font-extrabold leading-tight">{murid}</p>
                <span
                  className="flex-none rounded-full px-1.5 py-[1px] text-[9px] font-extrabold uppercase tracking-wide"
                  style={
                    isKelas
                      ? { background: "var(--tint)", color: "var(--primary-deep)" }
                      : { background: "color-mix(in srgb, var(--reward) 18%, transparent)", color: "var(--reward-ink)" }
                  }
                  title={isKelas ? "Murid kelasmu, level murid ini naik" : "Petualangan Pribadi (Pio), progres pribadimu"}
                >
                  {isKelas ? "Kelas" : "Petualangan"}
                </span>
              </div>
              {!done && (
                <Link href="/belajar" className="text-[11px] font-bold text-[var(--primary)]">Ganti topik →</Link>
              )}
            </div>
            <ProgressDots idx={Math.min(soalIdx, totalSoal - 1)} total={totalSoal} />
            {demo && (
              <span className="flex-none rounded-full px-2 py-0.5 text-[11px] font-bold" style={{ background: "color-mix(in srgb, var(--reward) 16%, transparent)", color: "var(--reward)" }}>
                Mode luring
              </span>
            )}
            <span className="relative flex flex-none items-center gap-1 rounded-full bg-[var(--tint)] px-2.5 py-1 font-display text-[13px] font-extrabold text-[var(--primary-deep)] tnum">
              <Star size={13} /> +{xp}
              {xpKey > 0 && (
                <span key={xpKey} className="animate-xpfloat pointer-events-none absolute -top-1 right-2 font-display text-[13px] font-extrabold text-[var(--reward)]">
                  +{XP_PER_TURN}
                </span>
              )}
            </span>
            {!done && teacherTurns >= 2 && (
              <button
                onClick={() => setDone(true)}
                className="flex flex-none items-center gap-1 rounded-full border border-line px-2.5 py-1 text-[11px] font-bold text-ink-soft transition-colors hover:border-[var(--node-weak)] hover:text-[var(--node-weak)]"
              >
                <Flag size={12} /> Akhiri
              </button>
            )}
          </div>

          <div className="rounded-2xl border border-line p-2 text-center shadow-[var(--shadow-1)] sm:p-2.5" style={{ background: "linear-gradient(to bottom, var(--surface), var(--surface-2))" }}>
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-ink-soft">
              {bidangAktif && <span className="text-[var(--primary-deep)]">{bidangAktif} ·</span>}
              {topikAktif}
              {totalSoal > 1 && (
                <span className="text-[var(--primary-deep)]">· {Math.min(soalIdx + 1, totalSoal)}/{totalSoal}</span>
              )}
            </div>
            <p className={`mt-1 font-display font-extrabold leading-snug tracking-tight ${soalSize}`}>{prettyMath(soalAktif)}</p>
            <span aria-hidden className="mx-auto mt-1.5 block h-0.5 w-8 rounded-full" style={{ background: "color-mix(in srgb, var(--primary) 60%, transparent)" }} />
            {sumber.length > 0 && !demo && (
              <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-[var(--tint)] px-2.5 py-0.5 text-[10px] font-bold text-[var(--primary-deep)]">
                <BookCheck size={11} /> Sumber: Kurikulum Merdeka · {sumber.slice(0, 2).join(" · ")}
              </p>
            )}
          </div>

          {/* catatan fokus 1-baris (dari memori sesi lalu) */}
          {profil?.weakest && !done && (
            <div className="mt-2 flex items-center gap-2 rounded-xl bg-[var(--tint)]/60 px-3 py-1.5 text-[12px]">
              <BrainCircuit size={14} className="flex-none text-[var(--primary-deep)]" />
              <span className="truncate">
                <b>{murid}</b> ingat sesi lalu, perkuat <b>{profil.weakest.konsep}</b>{" "}
                <span className="text-ink-soft tnum">({profil.weakest.pct}%)</span>
              </span>
            </div>
          )}
        </div>

        {/* PESAN: satu-satunya yang scroll */}
        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-3 py-3 sm:px-4">
          <div
            role="log"
            aria-live="polite"
            aria-relevant="additions"
            aria-label={`Percakapan dengan ${murid}`}
            tabIndex={0}
            className="mx-auto flex max-w-2xl flex-col gap-3 outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] lg:gap-4"
          >
            {messages.map((m, i) => {
              const prevSame = i > 0 && messages[i - 1].from === m.from;
              if (m.from === "murid")
                return (
                  <div key={i} className="animate-rise flex items-end gap-2 self-start">
                    {prevSame ? (
                      <span className="w-[30px] flex-none" aria-hidden />
                    ) : (
                      <Mascot mood="curious" size={30} className="mb-1" avatar={muridAvatar} char={pengajar.muridChar} />
                    )}
                    <p className="max-w-[80%] rounded-[22px] rounded-bl-sm bg-surface-2 px-3.5 py-2 text-[14px] leading-relaxed" style={{ boxShadow: "0 5px 18px -8px color-mix(in srgb, var(--primary) 22%, transparent)" }}>
                      {prettyMath(m.text)}
                    </p>
                  </div>
                );
              const kStep = messages.slice(0, i + 1).filter((mm) => mm.from === "kamu").length;
              return (
                <div key={i} className="animate-rise flex max-w-[80%] flex-col items-end self-end">
                  <span className="mb-1 mr-1 text-[11px] font-extrabold uppercase tracking-wide text-[var(--primary-deep)]">Kamu · Langkah {kStep}</span>
                  <p className="rounded-[22px] rounded-br-sm bg-gradient-to-br from-[var(--cta-1)] to-[var(--cta-2)] px-3.5 py-2 text-[14px] leading-relaxed text-white" style={{ boxShadow: "0 8px 20px -8px color-mix(in srgb, var(--primary) 55%, transparent)" }}>
                    {prettyMath(m.text)}
                  </p>
                </div>
              );
            })}
            {typing && (
              <div className="flex items-end gap-2 self-start">
                <Mascot mood="curious" size={30} className="mb-1" avatar={muridAvatar} char={pengajar.muridChar} />
                <span className="flex gap-1 rounded-[22px] rounded-bl-sm bg-surface-2 px-3.5 py-2.5" style={{ boxShadow: "0 5px 18px -8px color-mix(in srgb, var(--primary) 22%, transparent)" }}>
                  <Dot /> <Dot /> <Dot />
                </span>
              </div>
            )}
            <div ref={endRef} aria-hidden />
          </div>
        </div>
        {!atBottom && (
          <button
            onClick={toBottom}
            className="absolute bottom-24 right-4 z-30 flex items-center gap-1 rounded-full bg-[var(--primary)] px-3 py-1.5 text-[12px] font-bold text-white shadow-[var(--shadow-2)]"
          >
            ↓ pesan terbaru
          </button>
        )}

        {/* LAPIS 3: Input (sticky di mobile) atau kartu selesai */}
        {done ? (
          <div className="aa-card relative flex flex-none flex-col items-center gap-3 overflow-visible p-5 text-center">
            <Konfeti count={20} colors={["#1591dc", "#4bb8fa", "#f5a524", "#22a06b", "#2c5ead"]} className="pointer-events-none absolute inset-0 overflow-visible" />
            <span className="animate-pop grid h-12 w-12 place-items-center rounded-2xl bg-[var(--node-good)] text-white">
              <CheckCircle2 size={26} />
            </span>
            <p className="font-display text-lg font-extrabold">{murid} sudah paham! Sesi selesai 🎉</p>
            <p className="text-sm text-ink-soft">
              {reteach ? (
                <>Topik ini <b className="text-ink">sudah kamu kuasai</b>, XP tak ditambah lagi. Lihat Rapor Sesi.</>
              ) : (
                <>Kamu dapat <b className="text-[var(--reward-ink)]">+{shownXp} XP</b>. Lihat hasil pemahamanmu di Rapor Sesi.</>
              )}
            </p>
            <div className="mt-1 flex flex-wrap justify-center gap-3">
              <button onClick={() => setShowRapor(true)} className="aa-btn">
                Lihat Rapor Sesi <ArrowRight size={18} />
              </button>
              <button onClick={reset} className="aa-btn-ghost">
                <RotateCcw size={16} /> Ulangi
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-none border-t border-line px-3 py-2.5 sm:px-4">
            {/* mobile: pembahasan collapsible (rail tak dirender di mobile) */}
            {bantuan && (
              <button
                onClick={() => setShowKunci(true)}
                className="mx-auto mb-2 flex w-fit items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-bold text-ink-soft transition hover:text-ink hover:brightness-110 lg:hidden"
                style={{ background: "color-mix(in srgb, var(--reward) 12%, var(--surface-2))" }}
              >
                <KeyRound size={14} className="flex-none text-[var(--reward)]" />
                Mentok? Lihat contoh
              </button>
            )}
            <div className="aa-card flex flex-col gap-2 p-2.5 md:p-3">
              {/* kalimat pembuka, hanya di awal; satu baris ringkas yang bisa digeser (tak menumpuk) */}
              {teacherTurns === 0 && chips.length > 0 && (
                <div className="-mx-0.5 flex gap-1.5 overflow-x-auto px-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {chips.map((c) => (
                    <button
                      key={c}
                      onClick={() => pickChip(c)}
                      disabled={typing}
                      className="aa-chip flex-none whitespace-nowrap px-3 py-1.5 text-[12px] hover:border-[var(--primary)] disabled:opacity-50"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
              {/* papan simbol matematika, disembunyikan default biar ringkas, muncul saat tombol π ditekan */}
              {showSymbols && (
                <div className="-mx-0.5 flex gap-1.5 overflow-x-auto px-0.5 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {SYMBOLS.map((sy) => (
                    <button
                      key={sy}
                      type="button"
                      onClick={() => insertSymbol(sy)}
                      aria-label={`Sisipkan ${sy}`}
                      className="grid h-8 min-w-[2rem] flex-none place-items-center rounded-lg bg-surface-2 px-1.5 font-display text-sm font-bold text-ink transition-colors hover:bg-surface-3"
                    >
                      {sy}
                    </button>
                  ))}
                </div>
              )}
              {/* input + tombol simbol (toggle) */}
              <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowSymbols((v) => !v)}
                  aria-label="Simbol matematika"
                  aria-pressed={showSymbols}
                  className={`grid h-11 w-11 flex-none place-items-center rounded-full border transition-colors ${
                    showSymbols
                      ? "border-[var(--primary)] bg-[var(--tint)] text-[var(--primary-deep)]"
                      : "border-line bg-surface-2 text-ink-soft hover:text-ink"
                  }`}
                >
                  <Pi size={18} />
                </button>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Tulis langkah ke-${stepNo}…`}
                  className="min-w-0 flex-1 rounded-full border border-line bg-surface px-4 py-3 text-[15px] outline-none transition-colors focus:border-[var(--primary)]"
                />
                <button
                  type="submit"
                  disabled={typing || !input.trim()}
                  aria-label="Kirim"
                  className="grid h-11 w-11 flex-none place-items-center rounded-full bg-gradient-to-br from-[var(--cta-1)] to-[var(--cta-2)] text-white shadow-[0_10px_22px_-10px_rgba(21,145,220,.9)] transition disabled:opacity-40"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        )}
        </section>

        {/* PANEL PEMBAHASAN samping (desktop): melebar & menggeser chat jadi 50/50, transisi halus */}
        {bantuan && !done && (
          <aside className={`hidden shrink-0 overflow-hidden border-l border-line transition-[width] duration-300 ease-out lg:block ${showKunci ? "w-1/2" : "w-0"}`}>
            <PembahasanPanel bantuan={bantuan} topik={topikAktif} onClose={() => setShowKunci(false)} />
          </aside>
        )}
        </div>

        {/* KANAN: ikon panduan (desktop) */}
        {bantuan && !done && (
          <aside className="hidden w-[52px] flex-none flex-col items-center gap-2 border-l border-line py-3 lg:flex">
            <button
              onClick={() => setShowKunci((v) => !v)}
              title="Panduan & contoh"
              aria-label="Panduan & contoh"
              aria-pressed={showKunci}
              className={`grid h-11 w-11 place-items-center rounded-full border transition-colors ${
                showKunci
                  ? "border-[var(--primary)] bg-[var(--tint)] text-[var(--primary-deep)]"
                  : "border-line bg-surface text-ink-soft hover:border-[var(--primary)] hover:text-[var(--primary)]"
              }`}
            >
              <KeyRound size={18} />
            </button>
          </aside>
        )}
    </div>
  );
}

// Modal "Pembahasan", dibuka dari tombol (rail desktop / atas input mobile). Contoh disajikan
// sebagai LANGKAH bernomor yang gampang discan (cara jawab sederhana) + daftar "sering keliru".
// Isi pembahasan (langkah + "sering keliru"), dipakai ulang oleh modal (mobile) & panel samping (desktop).
function PembahasanBody({ bantuan }: { bantuan: MateriRingkas }) {
  const segs = parseContoh(bantuan.contoh);
  const keliru = parseMiskonsepsi(bantuan.miskonsepsi);
  const [showKeliru, setShowKeliru] = useState(false);
  return (
    <>
      <p className="mb-3 font-display text-sm font-extrabold">Cara menyelesaikan, langkah demi langkah</p>
      {segs ? (
        <div className="flex flex-col gap-2.5">
          {segs.map((s, i) => {
            if (s.t === "contoh")
              return (
                <div key={i} className="mt-1 flex items-center gap-2 font-display text-sm font-extrabold text-[var(--primary-deep)]">
                  <span className="h-4 w-1 flex-none rounded bg-[var(--primary)]" />
                  {prettyMath(s.text)}
                </div>
              );
            if (s.t === "soal")
              return (
                <div key={i} className="rounded-xl bg-[var(--tint)]/30 px-3 py-2 font-display text-[15px] font-bold text-ink">
                  {prettyMath(s.text)}
                </div>
              );
            if (s.t === "langkah")
              return (
                <div key={i} className="flex gap-2.5">
                  <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-[var(--primary)] text-[12px] font-bold text-white tnum">{s.n}</span>
                  <p className="text-[14px] leading-relaxed text-ink">
                    {s.label && <b className="text-ink-soft">{s.label} </b>}
                    {prettyMath(s.text)}
                  </p>
                </div>
              );
            const isJadi = /^jadi\b/i.test(s.text);
            return (
              <div key={i} className={`flex gap-2 ${isJadi ? "" : "pl-[2.1rem]"}`}>
                {isJadi && <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-[var(--node-good)] text-[12px] text-white">✓</span>}
                <p className={`text-[13px] leading-relaxed ${isJadi ? "font-bold text-ink" : "text-ink-soft"}`}>{prettyMath(s.text)}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="whitespace-pre-line text-[14px] leading-relaxed text-ink-soft">{prettyMath(bantuan.contoh)}</p>
      )}

      {keliru && keliru.length > 0 && (
        <div className="mt-5">
          <button
            onClick={() => setShowKeliru((v) => !v)}
            aria-expanded={showKeliru}
            className="flex w-full items-center gap-1.5 font-display text-sm font-extrabold text-[var(--node-weak)]"
          >
            <AlertTriangle size={15} className="flex-none" />
            <span className="text-left">{keliru.length} kesalahan umum yang perlu dikoreksi</span>
            <ChevronDown size={16} className={`ml-auto flex-none transition-transform ${showKeliru ? "rotate-180" : ""}`} />
          </button>
          {showKeliru && (
            <div className="mt-2.5 flex flex-col gap-2">
              {keliru.map((k, i) => (
                <KeliruCard key={i} text={k} />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

// Panel pembahasan SAMPING (desktop), muncul di sebelah chat (split), bukan pop-up.
function PembahasanPanel({ bantuan, topik, onClose }: { bantuan: MateriRingkas; topik: string; onClose: () => void }) {
  return (
    <div className="flex h-full min-w-[320px] flex-col bg-surface-2/20">
      <div className="flex flex-none items-center gap-2.5 border-b border-line px-4 py-3">
        <span className="grid h-8 w-8 flex-none place-items-center rounded-xl bg-[var(--tint)] text-[var(--primary-deep)]">
          <KeyRound size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-ink-soft">Pembahasan</p>
          <h2 className="truncate font-display text-sm font-extrabold leading-tight">{topik}</h2>
        </div>
        <button onClick={onClose} aria-label="Tutup pembahasan" className="grid h-8 w-8 flex-none place-items-center rounded-lg text-ink-soft hover:bg-surface-2">
          <X size={16} />
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <PembahasanBody bantuan={bantuan} />
      </div>
    </div>
  );
}

function PembahasanModal({
  bantuan,
  topik,
  murid,
  onClose,
}: {
  bantuan: MateriRingkas;
  topik: string;
  murid: string;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  // A11y: fokuskan tombol tutup saat dibuka + tutup dengan Escape (samakan pola dgn dialog Boss Quiz).
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-end bg-black/50 backdrop-blur-sm sm:place-items-center sm:p-4 lg:hidden"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Pembahasan ${topik}`}
        className="aa-card flex max-h-[88vh] w-full max-w-md flex-col overflow-hidden rounded-b-none sm:rounded-b-[var(--r-card)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mt-2 h-1.5 w-10 flex-none rounded-full bg-line sm:hidden" aria-hidden />
        <div className="flex flex-none items-center gap-3 border-b border-line p-4 sm:p-5">
          <span className="grid h-10 w-10 flex-none place-items-center rounded-2xl bg-[var(--tint)] text-[var(--primary-deep)]">
            <KeyRound size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-soft">Pembahasan</p>
            <h2 className="truncate font-display text-lg font-extrabold leading-tight">{topik}</h2>
          </div>
          <button ref={closeRef} onClick={onClose} aria-label="Tutup" className="grid h-10 w-10 flex-none place-items-center rounded-lg text-ink-soft hover:bg-surface-2">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          <PembahasanBody bantuan={bantuan} />
        </div>

        <div className="flex-none border-t border-line p-4">
          <p className="text-center text-xs text-ink-soft">
            Ini panduan, tetap jelaskan pakai <b className="text-ink">bahasamu sendiri</b> ke {murid}, di situ kamu makin paham. 💡
          </p>
          <button onClick={onClose} className="aa-btn mt-3 w-full">
            Oke, aku ajari sendiri <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Dot() {
  return (
    <span className="h-2 w-2 animate-bounce rounded-full bg-ink-soft [animation-duration:1s]" />
  );
}

// Titik progres soal di top bar (mis. ●●○○○ untuk 2/5). Disembunyikan di layar sangat kecil.
function ProgressDots({ idx, total }: { idx: number; total: number }) {
  if (total <= 1) return null;
  return (
    <span className="hidden flex-none items-center gap-1 sm:flex" aria-label={`Soal ${Math.min(idx + 1, total)} dari ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className="h-1.5 rounded-full transition-all"
          style={{ width: i === idx ? 14 : 6, background: i <= idx ? "var(--primary)" : "var(--surface-3)" }}
        />
      ))}
    </span>
  );
}

