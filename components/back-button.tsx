"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

// Tombol kembali ke halaman asal (router.back()); fallback ke "/" bila dibuka tanpa riwayat.
export function BackButton({ label = "Kembali", fallback = "/" }: { label?: string; fallback?: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== "undefined" && window.history.length > 1) router.back();
        else router.push(fallback);
      }}
      className="inline-flex items-center gap-1.5 self-start rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm font-bold text-ink-soft transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
    >
      <ArrowLeft size={16} /> {label}
    </button>
  );
}
