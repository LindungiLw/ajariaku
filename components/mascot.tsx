// Avatar karakter berlapis (SVG): bentuk wajah + warna + rambut + kacamata + aksesori.
// Usage: <Mascot avatar={spec} size={72} /> atau <Mascot char="pio" /> (preset lama).
import {
  colorById,
  hairColorById,
  presetAvatar,
  type AvatarSpec,
} from "@/lib/avatar";

type Mood = "happy" | "curious" | "oops";
const INK = "#22303e";

export function Mascot({
  mood = "happy",
  size = 72,
  char,
  avatar,
  className = "",
}: {
  mood?: Mood;
  size?: number;
  char?: string;
  avatar?: AvatarSpec;
  className?: string;
}) {
  const a = avatar ?? presetAvatar(char);
  const col = colorById(a.color);
  const hair = hairColorById(a.hairColor).val;

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`flex-none ${className}`}
      style={{ filter: `drop-shadow(0 8px 14px ${col.dark}55)` }}
      aria-hidden
    >
      {/* badan/kepala */}
      <Head shape={a.shape} col={col} />
      {/* pipi */}
      <ellipse cx="33" cy="63" rx="5" ry="3.4" fill="#ff8fa3" opacity="0.35" />
      <ellipse cx="67" cy="63" rx="5" ry="3.4" fill="#ff8fa3" opacity="0.35" />
      {/* wajah */}
      <Face mood={mood} />
      {/* kacamata di atas mata */}
      <Glasses id={a.glasses} />
      {/* rambut di atas kepala */}
      <Hair id={a.hair} color={hair} />
      {/* aksesori paling atas */}
      <Acc id={a.acc} accent={col.dark} />
    </svg>
  );
}

function Head({ shape, col }: { shape: string; col: { base: string; dark: string } }) {
  const body =
    shape === "oval" ? (
      <ellipse cx="50" cy="55" rx="30" ry="35" fill={col.base} />
    ) : shape === "kotak" ? (
      <rect x="18" y="23" width="64" height="64" rx="22" fill={col.base} />
    ) : (
      <circle cx="50" cy="55" r="33" fill={col.base} />
    );
  return (
    <>
      {body}
      {/* kilau atas & bayangan bawah */}
      <ellipse cx="40" cy="40" rx="15" ry="11" fill="#ffffff" opacity="0.16" />
      <ellipse cx="50" cy="82" rx="26" ry="9" fill={col.dark} opacity="0.28" />
    </>
  );
}

function Face({ mood }: { mood: Mood }) {
  const eye = (cx: number) =>
    mood === "oops" ? (
      <line x1={cx - 3} y1="53" x2={cx + 3} y2="53" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
    ) : (
      <g>
        <ellipse cx={cx} cy="54" rx="4.2" ry={mood === "curious" ? 5.2 : 4.6} fill={INK} />
        <circle cx={cx + 1.4} cy="52" r="1.3" fill="#fff" />
      </g>
    );
  const mouth =
    mood === "oops" ? (
      <circle cx="50" cy="68" r="3.2" fill="none" stroke={INK} strokeWidth="2.6" />
    ) : mood === "curious" ? (
      <path d="M45,68 Q50,71 55,68" fill="none" stroke={INK} strokeWidth="2.8" strokeLinecap="round" />
    ) : (
      <path d="M42,66 Q50,74 58,66" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
    );
  return (
    <>
      {eye(40)}
      {eye(60)}
      {mouth}
    </>
  );
}

function Hair({ id, color }: { id: string; color: string }) {
  if (id === "none") return null;
  if (id === "poni")
    return <path d="M19,52 Q19,25 50,24 Q81,25 81,52 Q70,42 60,45 Q50,39 40,45 Q30,42 19,52 Z" fill={color} />;
  if (id === "jambul")
    return (
      <g fill={color}>
        <path d="M20,50 Q20,26 50,25 Q80,26 80,50 Q66,44 50,46 Q34,44 20,50 Z" />
        <path d="M46,27 Q38,8 62,13 Q54,20 58,28 Z" />
      </g>
    );
  if (id === "keriting")
    return (
      <g fill={color}>
        <circle cx="28" cy="36" r="9" />
        <circle cx="41" cy="28" r="10" />
        <circle cx="55" cy="26" r="10.5" />
        <circle cx="69" cy="31" r="9.5" />
        <circle cx="34" cy="46" r="8" />
        <circle cx="63" cy="45" r="8" />
      </g>
    );
  if (id === "kucir")
    return (
      <g fill={color}>
        <path d="M20,50 Q20,26 50,25 Q80,26 80,50 Q66,45 50,46 Q34,45 20,50 Z" />
        <ellipse cx="85" cy="47" rx="8" ry="13" />
      </g>
    );
  if (id === "mohawk")
    return <path d="M43,12 Q50,6 57,12 L57,44 Q50,40 43,44 Z" fill={color} />;
  return null;
}

function Glasses({ id }: { id: string }) {
  if (id === "none") return null;
  const frame = "#2b3743";
  if (id === "bulat")
    return (
      <g>
        <circle cx="40" cy="54" r="9" fill="#bcdcff" opacity="0.35" />
        <circle cx="60" cy="54" r="9" fill="#bcdcff" opacity="0.35" />
        <g fill="none" stroke={frame} strokeWidth="2.6">
          <circle cx="40" cy="54" r="9" />
          <circle cx="60" cy="54" r="9" />
          <path d="M49,54 H51" />
          <path d="M31,52 L24,49" strokeLinecap="round" />
          <path d="M69,52 L76,49" strokeLinecap="round" />
        </g>
      </g>
    );
  if (id === "kotak")
    return (
      <g>
        <rect x="31" y="47" width="18" height="14" rx="4" fill="#bcdcff" opacity="0.35" />
        <rect x="51" y="47" width="18" height="14" rx="4" fill="#bcdcff" opacity="0.35" />
        <g fill="none" stroke={frame} strokeWidth="2.6">
          <rect x="31" y="47" width="18" height="14" rx="4" />
          <rect x="51" y="47" width="18" height="14" rx="4" />
          <path d="M49,54 H51" />
        </g>
      </g>
    );
  // keren (kacamata hitam)
  return (
    <g fill={frame}>
      <path d="M30,48 h20 v6 q0,7 -10,7 q-10,0 -10,-7 Z" />
      <path d="M50,48 h20 v6 q0,7 -10,7 q-10,0 -10,-7 Z" />
      <rect x="48" y="50" width="4" height="2.5" />
    </g>
  );
}

function Acc({ id, accent }: { id: string; accent: string }) {
  if (id === "none") return null;
  if (id === "topi")
    return (
      <g fill={accent}>
        <path d="M22,31 Q50,24 78,31 L78,34 Q50,27 22,34 Z" />
        <rect x="28" y="19" width="44" height="12" rx="6" />
        <circle cx="50" cy="17" r="3" />
      </g>
    );
  if (id === "pita")
    return (
      <g fill={accent}>
        <path d="M50,17 L35,9 L35,25 Z" />
        <path d="M50,17 L65,9 L65,25 Z" />
        <circle cx="50" cy="17" r="4.5" />
      </g>
    );
  if (id === "toga")
    return (
      <g>
        <rect x="28" y="13" width="44" height="8" rx="2" fill="#26323f" transform="rotate(-3 50 17)" />
        <circle cx="50" cy="16" r="3" fill={accent} />
        <path d="M67,17 L67,29" stroke={accent} strokeWidth="2" />
        <circle cx="67" cy="30" r="3" fill={accent} />
      </g>
    );
  // antena
  return (
    <g>
      <line x1="50" y1="23" x2="50" y2="11" stroke={accent} strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="50" cy="9" r="4" fill="#f5a524" />
    </g>
  );
}
