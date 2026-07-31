// Latar "mode main" bergaya Kahoot: gradient vibrant + bentuk geometris mengambang.
// CSS murni (nol dependency/aset). Dipakai di momen game (Boss Quiz, Rapor).
// Posisi bentuk deterministik → aman dari mismatch hydration.

const TYPES = ["tri", "dia", "cir", "sq"] as const;
const COLORS = [
  "rgba(255,255,255,.14)",
  "rgba(255,213,74,.22)",
  "rgba(255,90,110,.20)",
  "rgba(74,222,128,.18)",
  "rgba(255,255,255,.10)",
];
const SHAPES = Array.from({ length: 14 }, (_, i) => ({
  type: TYPES[i % 4],
  x: (i * 67 + 8) % 96,
  y: (i * 41 + 6) % 92,
  size: 26 + (i % 5) * 12,
  color: COLORS[i % COLORS.length],
  dur: 9 + (i % 6) * 1.6,
  delay: (i % 7) * 0.6,
}));

function PShape({ type, x, y, size, color, dur, delay }: (typeof SHAPES)[number]) {
  const base: React.CSSProperties = {
    position: "absolute",
    left: `${x}%`,
    top: `${y}%`,
    animation: `aa-gamefloat ${dur}s ease-in-out ${delay}s infinite`,
  };
  if (type === "tri")
    return <span style={{ ...base, width: 0, height: 0, borderLeft: `${size / 2}px solid transparent`, borderRight: `${size / 2}px solid transparent`, borderBottom: `${size}px solid ${color}` }} />;
  if (type === "cir")
    return <span style={{ ...base, width: size, height: size, borderRadius: 9999, background: color }} />;
  // dia & sq: persegi (rotasi dari aa-gamefloat bikin ia berputar seperti belah ketupat)
  return <span style={{ ...base, width: size, height: size, background: color, borderRadius: size * 0.16 }} />;
}

export function PlayBg({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div className="absolute inset-0" style={{ background: "linear-gradient(150deg, #46178f, #1368ce 60%, #0e1a4d)" }} />
      {SHAPES.map((s, i) => (
        <PShape key={i} {...s} />
      ))}
    </div>
  );
}

// Varian latar untuk halaman MATERI, teal→biru (beda dari quiz yang ungu→biru), nuansa "belajar".
export function MateriBg({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div className="absolute inset-0" style={{ background: "linear-gradient(150deg, #0d5c63, #1a73c7 55%, #0f1e45)" }} />
      {SHAPES.map((s, i) => (
        <PShape key={i} {...s} />
      ))}
    </div>
  );
}
