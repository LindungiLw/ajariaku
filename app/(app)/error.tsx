"use client"; // Error boundary harus Client Component

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, Home } from "lucide-react";
import { Mascot } from "@/components/mascot";

// Jaring pengaman berjenama untuk seluruh rute (app), bukan layar error mentah Next.
export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[app] render error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <div className="animate-float">
        <Mascot mood="oops" size={72} />
      </div>
      <h1 className="font-display text-2xl font-extrabold">Aduh, ada yang tersendat 😅</h1>
      <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
        Terjadi kesalahan tak terduga. Tenang, progres belajarmu tetap aman tersimpan di perangkat ini.
      </p>
      <div className="mt-1 flex flex-wrap justify-center gap-3">
        <button onClick={() => unstable_retry()} className="aa-btn">
          <RotateCcw size={18} /> Coba lagi
        </button>
        <Link href="/beranda" className="aa-btn-ghost">
          <Home size={16} /> Ke Beranda
        </Link>
      </div>
    </div>
  );
}
