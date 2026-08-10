import { Check, X } from "lucide-react";
import { pisahKeliru } from "@/lib/materi-parse";
import { prettyMath } from "@/lib/pretty-math";
import { ProseRich } from "@/components/math-rich";

// Kartu "Sering keliru": pecah satu miskonsepsi jadi bagian yang mudah DIPINDAI (bukan tembok teks):
// ✗ judul kesalahan (tebal) · ✓ koreksi/detail (lebih ringan) · kotak contoh penyangkal.
// Dipakai bersama oleh halaman Materi (tab + saat membaca) & panel Pembahasan di Ajari.
export function KeliruCard({ text }: { text: string }) {
  const { salah, koreksi, contoh } = pisahKeliru(text);
  return (
    <div className="group relative flex overflow-hidden gap-3 rounded-2xl border border-line bg-surface p-4 sm:p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--node-weak)]/40 hover:shadow-md">
      <div className="absolute bottom-0 left-0 top-0 w-1 bg-[var(--node-weak)]/60" />
      
      <span className="mt-0.5 grid h-7 w-7 flex-none place-items-center rounded-full bg-[var(--node-weak)]/10 text-[14px] font-bold text-[var(--node-weak)] ring-1 ring-[var(--node-weak)]/20 transition-colors group-hover:bg-[var(--node-weak)] group-hover:text-white group-hover:ring-[var(--node-weak)]/30">
        <X size={15} />
      </span>
      
      <div className="flex min-w-0 flex-1 flex-col gap-3.5">
        <div className="text-[13px] md:text-[14px] xl:text-[15px] font-bold text-ink">
          <ProseRich>{salah}</ProseRich>
        </div>
        
        {koreksi && (
          <div className="flex items-start gap-2.5 rounded-xl border border-[var(--node-good)]/20 bg-[color-mix(in_srgb,var(--node-good)_8%,var(--surface))] p-3 shadow-sm">
            <Check size={16} className="mt-0.5 flex-none text-[var(--node-good)]" />
            <div className="text-[13px] md:text-[14px] xl:text-[15px] font-medium text-ink/90">
              <ProseRich>{koreksi}</ProseRich>
            </div>
          </div>
        )}
        
        {contoh && (
          <div className="rounded-xl border border-line/60 bg-surface-2/50 px-3.5 py-2.5 text-[13px] md:text-[14px] leading-relaxed text-ink-soft">
            <span className="mb-1 block font-bold text-ink">Contoh: </span>
            <ProseRich>{contoh}</ProseRich>
          </div>
        )}
      </div>
    </div>
  );
}
