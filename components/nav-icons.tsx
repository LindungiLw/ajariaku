// Ikon navbar KHAS "Ajari Aku", digambar sendiri, memakai metafora khas APP ini (bukan set nav
// universal rumah/peta/orang/batang). Gaya: garis MONO currentColor (ikut warna menu: biru saat aktif,
// abu saat nonaktif). TANPA warna kuning/oranye & TANPA percikan. Jelas terbaca di 16-20px navbar.
type IconProps = { size?: number; className?: string };

function Svg({ size = 24, className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

// Beranda: rumah berpintu MELENGKUNG (lebih ramah & khas, bukan kotak polos).
export function IconBeranda(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M3.8 11.2 L12 4.5 L20.2 11.2" />
      <path d="M6 10 V19.5 H18 V10" />
      <path d="M9.8 19.5 V15 A2.2 2.2 0 0 1 14.2 15 V19.5" />
    </Svg>
  );
}

// Belajar: JALUR PETUALANGAN berkelok menanjak + bendera tujuan (persis peta di layar Belajar).
export function IconBelajar(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M6 20 C 6 15.5 15 15.5 15 11 S 6 6.5 6 2.8" />
      <circle cx="6" cy="20" r="1.5" fill="currentColor" stroke="none" />
      <path d="M6 2.8 L10 4.2 L6 5.6 Z" fill="currentColor" stroke="none" />
    </Svg>
  );
}

// Ajari: gelembung obrolan berwajah ramah (kamu mengajari murid AI). Ciri khas, dipertahankan.
export function IconAjari(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M6 7 H18 A2.4 2.4 0 0 1 20.4 9.4 V14 A2.4 2.4 0 0 1 18 16.4 H12 L8.4 19.5 V16.4 H6 A2.4 2.4 0 0 1 3.6 14 V9.4 A2.4 2.4 0 0 1 6 7 Z" />
      <circle cx="9.6" cy="11.4" r="1.05" fill="currentColor" stroke="none" />
      <circle cx="14.4" cy="11.4" r="1.05" fill="currentColor" stroke="none" />
      <path d="M9.7 13.4 Q12 15 14.3 13.4" />
    </Svg>
  );
}

// Kelas: dua murid; yang depan berANTENA khas maskot = "murid AI" (bukan sekadar orang).
export function IconKelas(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="9" cy="10.2" r="2.9" />
      <path d="M4 19.5 V18.4 A5 5 0 0 1 14 18.4 V19.5" />
      <path d="M9 7.3 V5.8" />
      <circle cx="9" cy="5" r="0.95" fill="currentColor" stroke="none" />
      <path d="M15.2 7.6 A2.6 2.6 0 0 1 15.2 12.8" />
      <path d="M15.6 14.4 A4.8 4.8 0 0 1 20 18.6 V19.5" />
    </Svg>
  );
}

// Progres: PANAH TUMBUH menanjak (dinamis, capaian naik), bukan batang statik.
export function IconProgres(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4 15.5 L9 11 L13 14 L20 6" />
      <path d="M15 6 H20 V11" />
    </Svg>
  );
}
