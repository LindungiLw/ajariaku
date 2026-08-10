"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Pi, RotateCcw, ArrowRight, Flag, BookCheck, Lightbulb, X, AlertTriangle, Users, ChevronDown, Key } from "lucide-react";
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
import { parseContoh, parseMiskonsepsi, type ContohSeg } from "@/lib/materi-parse";
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
  const greeting = sapaanMemori(profil, sap, soalAktif) ?? greetDefault(murid, sap, soalAktif);

  const [messages, setMessages] = useState<Msg[]>([
    { from: "murid", text: greeting },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [xp, setXp] = useState(0);
  const [xpKey, setXpKey] = useState(0);
  const sessionXpRef = useRef(0);
  const creditedRef = useRef(0);
  function addSessionXp(n: number) {
    sessionXpRef.current += n;
    setXp(sessionXpRef.current);
  }
  function flushXp() {
    if (!sesi) return;
    const delta = sessionXpRef.current - creditedRef.current;
    if (delta <= 0) return;
    const doGlobal = !isDone(sesi.id) && isLatihanDone(sesi.id);
    const doMurid = !!sesi.muridId && !muridSudah(sesi.muridId, sesi.id);
    if (!doGlobal && !doMurid) return;
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
  const [reteach, setReteach] = useState(false);
  const [showRapor, setShowRapor] = useState(false);
  const [demo, setDemo] = useState(false);
  const [sumber, setSumber] = useState<string[]>([]);
  const [showKunci, setShowKunci] = useState(false);
  const [showSymbols, setShowSymbols] = useState(false);
  const [atBottom, setAtBottom] = useState(true);
  const [muridList, setMuridList] = useState<MuridKustom[]>([]);
  const [pickFor, setPickFor] = useState<MuridKustom | null>(null);

  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const alive = useRef(true);
  const muridSt = useRef<MuridState>(newMuridState());

  useEffect(() => {
    alive.current = true;
    setMuridList(loadMurid());
    const s = getSesi();
    const gateSolo = (id: string, judul: string) => {
      if (isLatihanDone(id)) return false;
      setNeedStage({ id, judul, mDone: isMateriDone(id) });
      return true;
    };
    if (s) {
      if (gateSolo(s.id, s.judul)) return;
      setSesiState(s);
    } else {
      const jenjang = loadPengajar()?.jenjang;
      const active = activeTopikFor(jenjang, loadProgress().selesai);
      if (gateSolo(active.id, active.judul)) return;
      const s2 = buildSesi(active.id, null);
      setSesi(s2);
      setSesiState(s2);
    }
    return () => {
      alive.current = false;
    };
  }, []);

  useEffect(() => {
    setProfil(loadProfil(memId));
  }, [memId]);

  const earnedXp = Math.max(xp, sesi?.xp ?? 0);
  const shownXp = reteach ? 0 : earnedXp;

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
      const bolehGlobal = !globalDone && isLatihanDone(sesi.id);
      setReteach(hitungReteach(sesi));
      flushXp();
      const floorTopUp = Math.max(0, sesi.xp - creditedRef.current);
      const before = loadProgress();
      const muridBefore = loadMurid();
      if (bolehGlobal) completeTopic(sesi.id, floorTopUp, sesi.judul);
      if (sesi.muridId && !muridDone) creditMurid(sesi.muridId, sesi.id, floorTopUp);
      if (bolehGlobal || (sesi.muridId && !muridDone))
        celebrateDelta(before, loadProgress(), { muridBefore, muridAfter: loadMurid() });
      clearSesi();
    }
  }, [done, sesi]);

  useEffect(() => {
    setMessages((m) =>
      m.length === 1 && m[0].from === "murid" && xp === 0 && !done
        ? [{ from: "murid", text: greeting }]
        : m,
    );
  }, [greeting, xp, done]);

  useEffect(() => setMuridList(loadMurid()), [done]);

  useEffect(() => {
    if (atBottom) endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing, atBottom]);

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
      const hasil = responLokal(sesi?.id ?? "", clean, muridSt.current, sesi?.muridId);
      reply = hasil.reply;
      understood = hasil.understood;
      mood = hasil.mood;
      dikoreksi = hasil.dikoreksi;
      if (!sumber.length) setSumber([topikAktif]);
      await new Promise((r) => setTimeout(r, TYPING_MS));
    } else {
      const boleh = geminiAllowed();
      if (boleh) noteGeminiCall();
      try {
        if (!boleh) throw new Error("cap-harian");
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
        dikoreksi = !!data.dikoreksi;
        if (Array.isArray(data.sumber)) setSumber(data.sumber as string[]);
      } catch {
        usedFallback = true;
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

    if (dikoreksi && sesi && !isDone(sesi.id)) {
      const beforeKor = loadProgress();
      bumpKoreksi();
      addSessionXp(XP_KOREKSI);
      celebrate([{ kind: "koreksi", label: "Koreksi tepat! 🎯", sub: `Kamu mengoreksi ${murid}` }]);
      celebrateBadges(beforeKor, loadProgress());
    }

    if (understood) {
      if (PAKAI_GEMINI && soalIdx < totalSoal - 1) {
        const ni = soalIdx + 1;
        setSoalIdx(ni);
        addSessionXp(XP_SOAL_LANJUT);
        flushXp();
        setMessages((m) => [
          ...m,
          { from: "murid", text: `Aku paham soal itu! 🎉 (${ni}/${totalSoal}) Sekarang bantu aku yang ini ya: ${soalList[ni]}` },
        ]);
      } else {
        setReteach(hitungReteach(sesi));
        setDone(true);
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
    muridSt.current = newMuridState();
  }

  function beginSesi(s: Sesi) {
    setSesiState(s);
    setSoalIdx(0);
    const nm = s.muridNama || namaMurid(pengajar);
    const firstSoal = (s.soalList?.length ? s.soalList : [s.soal ?? SOAL_DEFAULT])[0] ?? SOAL_DEFAULT;
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

  function pickTopic(id: string) {
    const m = pickFor;
    setPickFor(null);
    if (!resolveTopik(id)) return;
    const s = buildSesi(id, m);
    setSesi(s);
    beginSesi(s);
  }

  if (showRapor)
    return (
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
  const isKelas = !!sesi?.muridId && sesi.muridId !== UTAMA_ID;
  const soalLen = soalAktif.length;
  const soalSize =
    soalLen > 70 ? "text-[14px] sm:text-[16px] xl:text-[18px]"
      : soalLen > 44 ? "text-[16px] sm:text-[18px] xl:text-[20px]"
        : soalLen > 24 ? "text-[18px] sm:text-[20px] xl:text-[22px]"
          : "text-[20px] sm:text-[22px] xl:text-[24px]";

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

      <aside className="hidden w-[200px] xl:w-[228px] flex-none flex-col overflow-hidden border-r border-line bg-surface-2/30 lg:flex">
        <div className="flex flex-none items-center gap-1.5 border-b border-line px-3 py-3 text-[11px] font-extrabold uppercase tracking-wider text-ink-soft">
          <Users size={13} className="text-[var(--primary)]" /> Ajari siapa?
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-2">
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

          <p className="px-2 pb-1 pt-2.5 text-[10px] font-extrabold uppercase tracking-wider text-ink-soft">Kelas</p>
          {muridList.map((mu) => {
            const on = sesi?.muridId === mu.id;
            const utama = mu.id === UTAMA_ID;
            const pk = pangkatMurid(mu.xp ?? 0);
            return (
              <button
                key={mu.id}
                onClick={() => setPickFor(mu)}
                className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-left transition-all ${on ? "bg-surface shadow-sm ring-1 ring-[var(--primary)]/20" : "hover:bg-surface-2/60"}`}
              >
                {on && <div className="absolute bottom-2 left-0 top-2 w-1 rounded-r-md bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]" />}
                <Mascot avatar={mu.avatar} size={34} className={`flex-none transition-transform ${on ? "scale-105" : "group-hover:scale-105"}`} />
                <span className="min-w-0 flex-1">
                  <span className={`block truncate font-display text-[13px] font-extrabold leading-tight ${on ? "text-[var(--primary-deep)]" : "text-ink"}`}>
                    {mu.nama}
                  </span>
                  <span className="mt-0.5 block truncate text-[10px] font-medium text-ink-soft tnum">
                    {utama ? <span className="font-bold text-[var(--primary-deep)]">Utama</span> : bidangShort(mu.kategori)} · Lv {pk.level}
                  </span>
                </span>
              </button>
            );
          })}

          <Link
            href="/kelas"
            className="mt-4 flex flex-none items-center justify-center gap-1.5 rounded-xl border border-[var(--primary)]/20 bg-surface px-4 py-2.5 text-[12px] font-bold text-[var(--primary)] shadow-sm transition-colors hover:bg-[var(--tint)]/50 hover:border-[var(--primary)]/40"
          >
            <Users size={14} /> Kelola murid
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 overflow-hidden">
        <section className="relative flex min-w-0 flex-1 flex-col">
        <p className="sr-only" role="status" aria-live="polite">{typing ? `${murid} sedang mengetik…` : ""}</p>

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

          <div className="relative overflow-hidden rounded-2xl border border-[var(--primary)]/20 bg-surface p-3 text-center shadow-[0_8px_30px_-12px_rgba(21,145,220,0.25)] sm:p-4">
            <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-transparent via-[var(--primary)]/40 to-transparent" />
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--primary-deep)]/70">
              {bidangAktif && <span>{bidangAktif} ·</span>}
              <span className="text-[var(--primary-deep)]">{topikAktif}</span>
              {totalSoal > 1 && (
                <span>· {Math.min(soalIdx + 1, totalSoal)}/{totalSoal}</span>
              )}
            </div>
            <p className={`relative z-10 mt-1.5 font-display font-extrabold leading-snug tracking-tight text-ink ${soalSize}`}>
              {prettyMath(soalAktif)}
            </p>
            <div className="mx-auto mt-2.5 h-[1px] w-12 bg-gradient-to-r from-transparent via-[var(--primary)]/30 to-transparent" />
            {sumber.length > 0 && !demo && (
              <p className="mx-auto mt-3 flex w-fit items-center gap-1.5 rounded-full border border-[var(--primary)]/10 bg-[var(--tint)]/40 px-3 py-1 text-[10px] font-bold text-[var(--primary-deep)]">
                <BookCheck size={12} className="opacity-70" /> 
                <span>Kurikulum Merdeka · {sumber.slice(0, 2).join(" · ")}</span>
              </p>
            )}
          </div>

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
                    <p className="max-w-[80%] rounded-[22px] rounded-bl-sm bg-surface-2 px-3.5 py-2 text-[13px] md:text-[14px] xl:text-[15px] leading-relaxed" style={{ boxShadow: "0 5px 18px -8px color-mix(in srgb, var(--primary) 22%, transparent)" }}>
                      {prettyMath(m.text)}
                    </p>
                  </div>
                );
              const kStep = messages.slice(0, i + 1).filter((mm) => mm.from === "kamu").length;
              return (
                <div key={i} className="animate-rise flex max-w-[80%] flex-col items-end self-end">
                  <span className="mb-1 mr-1 text-[11px] font-extrabold uppercase tracking-wide text-[var(--primary-deep)]">Kamu · Langkah {kStep}</span>
                  <p className="rounded-[22px] rounded-br-sm bg-gradient-to-br from-[var(--cta-1)] to-[var(--cta-2)] px-3.5 py-2 text-[13px] md:text-[14px] xl:text-[15px] leading-relaxed text-white" style={{ boxShadow: "0 8px 20px -8px color-mix(in srgb, var(--primary) 55%, transparent)" }}>
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
          <div className="flex-none px-3 pb-4 sm:px-4 sm:pb-6">
            <div className="mx-auto max-w-2xl">
              {bantuan && (
                <button
                  onClick={() => setShowKunci(true)}
                  className="mx-auto mb-3 flex w-fit items-center gap-1.5 rounded-full px-4 py-1.5 text-[12px] font-bold text-ink-soft transition hover:text-ink hover:brightness-110 lg:hidden"
                  style={{ background: "color-mix(in srgb, var(--reward) 12%, var(--surface-2))" }}
                >
                  <Lightbulb size={14} className="flex-none text-[var(--reward)]" />
                  Mentok? Lihat petunjuk 💡
                </button>
              )}
              <div className="aa-card flex flex-col gap-2 p-2.5 md:p-3 shadow-md border border-[var(--primary)]/10 ring-1 ring-[var(--primary)]/5">
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
                  className="min-w-0 flex-1 rounded-full border border-line bg-surface px-4 py-3 text-[14px] md:text-[15px] outline-none transition-colors focus:border-[var(--primary)]"
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
        </div>
      )}
        </section>

        {/* PANEL PEMBAHASAN samping (desktop): menggunakan fixed width yang adaptif */}
        {bantuan && !done && (
          <aside className={`hidden shrink-0 overflow-hidden border-l border-line transition-[width] duration-300 ease-out lg:block ${showKunci ? "w-[300px] xl:w-[380px]" : "w-0"}`}>
            <PembahasanPanel bantuan={bantuan} topik={topikAktif} onClose={() => setShowKunci(false)} />
          </aside>
        )}
        </div>

        {/* KANAN: ikon petunjuk & contoh (desktop) */}
        {bantuan && !done && (
          <aside className="hidden w-[52px] flex-none flex-col items-center gap-2 border-l border-line py-3 lg:flex">
            <button
              onClick={() => setShowKunci((v) => !v)}
              title={showKunci ? "Tutup petunjuk" : "Petunjuk & contoh"}
              aria-label="Petunjuk & contoh"
              aria-pressed={showKunci}
              className={`grid h-11 w-11 place-items-center rounded-full border transition-all ${
                showKunci
                  ? "border-[var(--reward)] bg-[color-mix(in_srgb,var(--reward)_15%,var(--surface))] text-[var(--reward-ink)] shadow-sm"
                  : "border-line bg-surface text-ink-soft hover:border-[var(--reward)] hover:text-[var(--reward-ink)] hover:bg-surface-2"
              }`}
            >
              <Lightbulb size={18} />
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

  const contohGroups: ContohSeg[][] = [];
  if (segs) {
    let current: ContohSeg[] = [];
    segs.forEach((s) => {
      if (s.t === "contoh") {
        if (current.length > 0) contohGroups.push(current);
        current = [s];
      } else {
        current.push(s);
      }
    });
    if (current.length > 0) contohGroups.push(current);
  }

  const renderSegs = (list: ContohSeg[]) => {
    return list.map((s, i) => {
      if (s.t === "soal")
        return (
          <div key={i} className="rounded-2xl border border-line bg-surface-2/60 px-4 py-3 font-display text-[13px] xl:text-[15px] font-bold text-ink shadow-sm">
            {prettyMath(s.text)}
          </div>
        );
      if (s.t === "langkah")
        return (
          <div key={i} className="group/step relative flex flex-col gap-2 rounded-2xl border border-line/60 bg-surface/80 p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--primary)]/40 hover:bg-surface hover:shadow-md">
            <div className="flex items-center gap-2.5">
              <span className="tnum inline-flex items-center rounded-lg bg-[var(--tint)]/80 px-2.5 py-1 font-display text-[11px] font-black uppercase tracking-wider text-[var(--primary-deep)] ring-1 ring-[var(--primary)]/10 transition-colors group-hover/step:bg-[var(--primary)] group-hover/step:text-white group-hover/step:ring-[var(--primary)]/30">
                Langkah {s.n}
              </span>
              {s.label && <b className="text-[13.5px] font-bold text-ink">{s.label}</b>}
            </div>
            <p className="text-[13px] md:text-[14px] xl:text-[15px] font-medium leading-relaxed text-ink/90">
              {prettyMath(s.text)}
            </p>
          </div>
        );
      const isJadi = /^jadi\b/i.test(s.text);
      return (
        <div
          key={i}
          className={
            isJadi
              ? "relative flex items-start gap-3 rounded-2xl border border-[var(--node-good)]/40 bg-[color-mix(in_srgb,var(--node-good)_10%,var(--surface))] p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              : "ml-4 mt-1 rounded-xl border-l-2 border-line/80 bg-surface-2/30 px-3.5 py-2.5"
          }
        >
          {isJadi && (
            <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-[var(--node-good)] text-[12px] font-bold text-white shadow-sm shadow-[var(--node-good)]/30 ring-4 ring-[var(--node-good)]/10">
              ✓
            </span>
          )}
          <p className={`text-[13px] md:text-[14px] xl:text-[15px] leading-relaxed ${isJadi ? "font-bold text-ink" : "font-medium text-ink-soft"}`}>
            {prettyMath(s.text)}
          </p>
        </div>
      );
    });
  };

  return (
    <>
      {bantuan.rumus && bantuan.rumus.length > 0 && (
        <details className="group mb-6 rounded-2xl border border-line bg-surface shadow-sm open:pb-4" open={false}>
          <summary className="flex cursor-pointer select-none list-none items-center gap-2.5 rounded-2xl px-4 py-3 transition-colors hover:bg-surface-2 [&::-webkit-details-marker]:hidden">
            <div className="grid h-7 w-7 flex-none place-items-center rounded-lg bg-[var(--primary)]/15 text-[var(--primary-deep)] shadow-sm">
              <Pi size={15} />
            </div>
            <h3 className="font-display text-[13px] xl:text-[14px] font-extrabold text-ink">
              Rumus Kunci Topik Ini
            </h3>
            <ChevronDown size={16} className="ml-auto text-ink-soft transition-transform group-open:rotate-180" />
          </summary>
          <div className="flex flex-wrap gap-2 px-4 pt-1">
            {bantuan.rumus.map((r, i) => (
              <span key={i} className="inline-flex items-center rounded-xl border border-[var(--primary)]/20 bg-surface px-3 py-1.5 font-display text-[12px] xl:text-[13.5px] font-bold text-[var(--primary-deep)] shadow-sm">
                {prettyMath(r)}
              </span>
            ))}
          </div>
        </details>
      )}

      <div className="mb-4 flex items-center gap-2.5 px-1">
        <div className="grid h-8 w-8 flex-none place-items-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] shadow-sm ring-1 ring-[var(--primary)]/10">
          <Key size={16} />
        </div>
        <h3 className="font-display text-[14px] xl:text-[15px] font-extrabold text-ink">
          Contoh Kasus Serupa
        </h3>
      </div>
      {contohGroups.length > 0 ? (
        <div className="flex flex-col gap-3">
          {contohGroups.map((g, i) => {
            const isContoh = g[0].t === "contoh";
            if (!isContoh) {
              return <div key={i} className="flex flex-col gap-2.5">{renderSegs(g)}</div>;
            }
            return (
              <details key={i} className="group rounded-2xl border border-line bg-surface shadow-sm open:pb-4" open={false}>
                <summary className="flex cursor-pointer select-none list-none items-center gap-2.5 rounded-2xl px-4 py-3 transition-colors hover:bg-[var(--tint)]/50 [&::-webkit-details-marker]:hidden">
                  <span className="h-4 w-1.5 flex-none rounded-full bg-[var(--primary)]" />
                  <span className="flex-1 font-display text-[13px] xl:text-[14px] font-extrabold text-[var(--primary-deep)]">{prettyMath(g[0].text)}</span>
                  <ChevronDown size={16} className="text-ink-soft transition-transform group-open:rotate-180" />
                </summary>
                <div className="flex flex-col gap-2.5 px-4 pt-2">
                  {renderSegs(g.slice(1))}
                </div>
              </details>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-line bg-surface p-4">
          <p className="whitespace-pre-line text-[13px] md:text-[14px] xl:text-[15px] leading-relaxed text-ink">{prettyMath(bantuan.contoh)}</p>
        </div>
      )}

      {keliru && keliru.length > 0 && (
        <details className="group mt-6" open={false}>
          <summary className="flex cursor-pointer select-none list-none items-center gap-2.5 rounded-2xl bg-[color-mix(in_srgb,var(--node-mid)_8%,var(--surface))] px-4 py-3 transition-colors hover:bg-[color-mix(in_srgb,var(--node-mid)_15%,var(--surface))] [&::-webkit-details-marker]:hidden">
            <div className="grid h-7 w-7 flex-none place-items-center rounded-lg bg-[var(--node-mid)]/20 text-[var(--reward-ink)] shadow-sm">
              <Flag size={15} />
            </div>
            <span className="flex-1 font-display text-[13px] md:text-[14px] xl:text-[15px] font-extrabold text-[var(--reward-ink)]">
              Awas! {keliru.length} Jebakan Umum
            </span>
            <ChevronDown size={16} className="text-[var(--reward-ink)]/70 transition-transform group-open:rotate-180" />
          </summary>
          <div className="mt-3 flex flex-col gap-3">
            {keliru.map((k, i) => (
              <KeliruCard key={i} text={k} />
            ))}
          </div>
        </details>
      )}
    </>
  );
}

// Panel pembahasan SAMPING (desktop), muncul di sebelah chat (split), bukan pop-up.
function PembahasanPanel({ bantuan, topik, onClose }: { bantuan: MateriRingkas; topik: string; onClose: () => void }) {
  return (
    <div className="flex h-full w-[300px] xl:w-[380px] flex-col bg-surface-2/20">
      <div className="flex flex-none items-center gap-2.5 border-b border-line px-4 py-3">
        <span className="grid h-8 w-8 flex-none place-items-center rounded-xl bg-[color-mix(in_srgb,var(--reward)_15%,var(--surface))] text-[var(--reward-ink)]">
          <Lightbulb size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-ink-soft">Petunjuk &amp; Contoh</p>
          <h2 className="truncate font-display text-sm font-extrabold leading-tight">{topik}</h2>
        </div>
        <button onClick={onClose} aria-label="Tutup petunjuk" className="grid h-8 w-8 flex-none place-items-center rounded-lg text-ink-soft hover:bg-surface-2">
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
          <span className="grid h-10 w-10 flex-none place-items-center rounded-2xl bg-[color-mix(in_srgb,var(--reward)_15%,var(--surface))] text-[var(--reward-ink)]">
            <Lightbulb size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-soft">Petunjuk &amp; Contoh</p>
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

