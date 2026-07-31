import { Check, X } from "lucide-react";
import { pisahKeliru } from "@/lib/materi-parse";
import { prettyMath } from "@/lib/pretty-math";

// Kartu "Sering keliru": pecah satu miskonsepsi jadi bagian yang mudah DIPINDAI (bukan tembok teks):
// ✗ judul kesalahan (tebal) · ✓ koreksi/detail (lebih ringan) · kotak contoh penyangkal.
// Dipakai bersama oleh halaman Materi (tab + saat membaca) & panel Pembahasan di Ajari.
export function KeliruCard({ text }: { text: string }) {
  const { salah, koreksi, contoh } = pisahKeliru(text);
  return (
    <div
      className="flex gap-2.5 rounded-xl border p-3"
      style={{ borderColor: "color-mix(in srgb, var(--node-weak) 28%, transparent)", background: "color-mix(in srgb, var(--node-weak) 6%, transparent)" }}
    >
      <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-[var(--node-weak)] text-white">
        <X size={13} />
      </span>
      <div className="flex min-w-0 flex-col gap-2">
        <p className="text-[13.5px] font-semibold leading-snug text-ink">{prettyMath(salah)}</p>
        {koreksi && (
          <p className="flex gap-1.5 text-[13px] leading-snug text-ink-soft">
            <Check size={15} className="mt-[1px] flex-none text-[var(--node-good)]" />
            <span>{prettyMath(koreksi)}</span>
          </p>
        )}
        {contoh && (
          <div className="rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[12.5px] leading-snug text-ink-soft">
            <span className="font-bold text-ink">Contoh: </span>{prettyMath(contoh)}
          </div>
        )}
      </div>
    </div>
  );
}
