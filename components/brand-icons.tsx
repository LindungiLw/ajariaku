// Ikon KONSEP khas "Ajari Aku", digambar sendiri (bukan lucide), gaya rounded & ramah
// khas maskot. Monokrom currentColor => ikut warna konteks (putih di kotak medali, warna
// di kartu statistik). Drop-in: nama & props kompatibel dengan lucide (size, className, style,
// strokeWidth di-spread ke <svg>). Ikon fungsional (panah, X, chevron, dll.) tetap dari lucide.
import type { SVGProps, ReactNode } from "react";

type IconProps = { size?: number | string; strokeWidth?: number } & SVGProps<SVGSVGElement>;

function Svg({ size = 24, strokeWidth = 2, children, ...rest }: IconProps & { children: ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      {children}
    </svg>
  );
}

export function Star(p: IconProps) { return <Svg {...p}><polygon points="12,2.7 14.29,8.84 20.84,9.13 15.71,13.21 17.47,19.52 12,15.9 6.53,19.52 8.29,13.21 3.16,9.13 9.71,8.84" fill="currentColor" stroke="none" /></Svg>; }
export function Flame(p: IconProps) { return <Svg {...p}><path d="M12 2.5 Q6.5 8 7 13 Q7 18.6 12 18.6 Q17 18.6 17 13 Q17 9.6 14.6 6.7 Q14 9.6 12 8.6 Q13 6 12 2.5 Z" fill="none" /></Svg>; }
export function Trophy(p: IconProps) { return <Svg {...p}><polyline points="8,4.5 16,4.5 16,9 8,9" fill="none" /><path d="M8 9 Q8 13 12 13" fill="none" /><path d="M12 13 Q16 13 16 9" fill="none" /><path d="M8 5.5 Q4.5 5.5 4.5 8" fill="none" /><path d="M4.5 8 Q4.5 10 8 10.3" fill="none" /><path d="M16 5.5 Q19.5 5.5 19.5 8" fill="none" /><path d="M19.5 8 Q19.5 10 16 10.3" fill="none" /><line x1="12" y1="13" x2="12" y2="16.5" /><polyline points="8.5,19.5 15.5,19.5" fill="none" /><polyline points="10,16.5 14,16.5" fill="none" /></Svg>; }
export function Medal(p: IconProps) { return <Svg {...p}><line x1="8" y1="2.5" x2="10.5" y2="8.5" /><line x1="16" y1="2.5" x2="13.5" y2="8.5" /><circle cx="12" cy="14.5" r="5.2" fill="none" /><circle cx="12" cy="14.5" r="1.6" fill="currentColor" stroke="none" /></Svg>; }
export function Crown(p: IconProps) { return <Svg {...p}><polygon points="3.5,8.5 7,13.5 12,6.5 17,13.5 20.5,8.5 18.5,18 5.5,18" fill="none" /><circle cx="3.5" cy="8.5" r="1.1" fill="currentColor" stroke="none" /><circle cx="12" cy="6.5" r="1.1" fill="currentColor" stroke="none" /><circle cx="20.5" cy="8.5" r="1.1" fill="currentColor" stroke="none" /></Svg>; }
export function Award(p: IconProps) { return <Svg {...p}><circle cx="12" cy="9" r="5.4" fill="none" /><polyline points="9.5,13.3 8,21 12,18.5 16,21 14.5,13.3" fill="none" /></Svg>; }
export function BrainCircuit(p: IconProps) { return <Svg {...p}><path d="M11 5 Q5.5 5.5 6 10" fill="none" /><path d="M6 10 Q3.5 12 6 14.5" fill="none" /><path d="M6 14.5 Q6 18 11 18" fill="none" /><line x1="11" y1="4.5" x2="11" y2="18.5" /><circle cx="15" cy="8" r="1.5" fill="currentColor" stroke="none" /><circle cx="18" cy="12" r="1.5" fill="currentColor" stroke="none" /><circle cx="15" cy="16" r="1.5" fill="currentColor" stroke="none" /><line x1="11" y1="8" x2="13.6" y2="8" /><line x1="11" y1="12" x2="16.6" y2="12" /><line x1="11" y1="16" x2="13.6" y2="16" /></Svg>; }
export function Target(p: IconProps) { return <Svg {...p}><circle cx="12" cy="12" r="8.5" fill="none" /><circle cx="12" cy="12" r="5" fill="none" /><circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none" /></Svg>; }
export function BookOpen(p: IconProps) { return <Svg {...p}><line x1="12" y1="7.5" x2="12" y2="19.5" /><path d="M12 7.5 Q9 6 4 7" fill="none" /><polyline points="4,7 4,18" fill="none" /><path d="M4 18 Q9 17 12 18.7" fill="none" /><path d="M12 7.5 Q15 6 20 7" fill="none" /><polyline points="20,7 20,18" fill="none" /><path d="M20 18 Q15 17 12 18.7" fill="none" /></Svg>; }
export function GraduationCap(p: IconProps) { return <Svg {...p}><polygon points="12,5 21.5,9 12,13 2.5,9" fill="currentColor" stroke="none" /><polyline points="6.5,11 6.5,16" fill="none" /><path d="M6.5 16 Q12 19 17.5 16" fill="none" /><polyline points="17.5,11 17.5,16" fill="none" /></Svg>; }
export function CheckCircle2(p: IconProps) { return <Svg {...p}><circle cx="12" cy="12" r="8.7" fill="none" /><polyline points="8,12.2 11,15 16,9.2" fill="none" /></Svg>; }
export function Compass(p: IconProps) { return <Svg {...p}><circle cx="12" cy="12" r="9" fill="none" /><polygon points="15.5,8.5 11,11 8.5,15.5 13,13" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="0.8" fill="currentColor" stroke="none" /></Svg>; }
export function TrendingUp(p: IconProps) { return <Svg {...p}><polyline points="3.5,15.5 9,10 13,13.5 20.5,6.5" fill="none" /><polyline points="15.5,6.5 20.5,6.5 20.5,11.5" fill="none" /></Svg>; }
export function Zap(p: IconProps) { return <Svg {...p}><polygon points="13,2.5 5,13.5 11,13.5 10,21.5 18.5,10 12.5,10" fill="currentColor" stroke="none" /></Svg>; }
export function Gamepad2(p: IconProps) { return <Svg {...p}><polyline points="6,8.5 16,8.5" fill="none" /><path d="M6 8.5 Q2.5 8.5 2.5 13" fill="none" /><path d="M2.5 13 Q2.5 16.5 5 16.5" fill="none" /><path d="M5 16.5 Q7 16.5 8 14.5" fill="none" /><polyline points="8,14.5 14,14.5" fill="none" /><path d="M14 14.5 Q15 16.5 17 16.5" fill="none" /><path d="M17 16.5 Q19.5 16.5 19.5 13" fill="none" /><path d="M19.5 13 Q19.5 8.5 16 8.5" fill="none" /><line x1="5.5" y1="11.5" x2="8.5" y2="11.5" /><line x1="7" y1="10" x2="7" y2="13" /><circle cx="15.5" cy="11" r="1" fill="currentColor" stroke="none" /><circle cx="17" cy="12.5" r="1" fill="currentColor" stroke="none" /></Svg>; }
export function Search(p: IconProps) { return <Svg {...p}><circle cx="10.5" cy="10.5" r="6" fill="none" /><line x1="15" y1="15" x2="20" y2="20" /></Svg>; }
export function CalendarCheck(p: IconProps) { return <Svg {...p}><rect x="4" y="5.5" width="16" height="14.5" rx="2" fill="none" /><line x1="4" y1="9.5" x2="20" y2="9.5" /><line x1="8" y1="3.5" x2="8" y2="6.5" /><line x1="16" y1="3.5" x2="16" y2="6.5" /><polyline points="9,14 11.2,16.2 15.5,12" fill="none" /></Svg>; }
export function ShieldCheck(p: IconProps) { return <Svg {...p}><path d="M12 3 L19 5.9 V11.2 Q19 16.8 12 20.5 Q5 16.8 5 11.2 V5.9 Z" fill="none" /><polyline points="8.9,12 11.2,14.3 15.3,9.8" fill="none" /></Svg>; }
export function Guest(p: IconProps) { return <Svg {...p}><circle cx="12" cy="8" r="3.6" fill="none" /><path d="M5.5 19.5 Q5.5 13.6 12 13.6 Q18.5 13.6 18.5 19.5" fill="none" /></Svg>; }
export function Gift(p: IconProps) { return <Svg {...p}><rect x="4.5" y="10" width="15" height="9.6" rx="1.5" fill="none" /><rect x="3.4" y="6.7" width="17.2" height="3.4" rx="1.2" fill="none" /><line x1="12" y1="6.7" x2="12" y2="19.6" /><path d="M12 6.7 Q8.4 6.7 8.4 4.7 Q8.4 3.3 12 6.7" fill="none" /><path d="M12 6.7 Q15.6 6.7 15.6 4.7 Q15.6 3.3 12 6.7" fill="none" /></Svg>; }
export function Chat(p: IconProps) { return <Svg {...p}><path d="M5 6.5 H19 A2.3 2.3 0 0 1 21.3 8.8 V13.9 A2.3 2.3 0 0 1 19 16.2 H12 L8 19.4 V16.2 H5 A2.3 2.3 0 0 1 2.7 13.9 V8.8 A2.3 2.3 0 0 1 5 6.5 Z" fill="none" /><circle cx="9.4" cy="11.1" r="1.05" fill="currentColor" stroke="none" /><circle cx="14.6" cy="11.1" r="1.05" fill="currentColor" stroke="none" /><path d="M9.6 13.2 Q12 14.9 14.4 13.2" fill="none" /></Svg>; }
export function Users(p: IconProps) { return <Svg {...p}><circle cx="9" cy="9.6" r="2.9" fill="none" /><path d="M4 18.8 Q4 13.9 9 13.9 Q14 13.9 14 18.8" fill="none" /><path d="M15.2 7 A2.55 2.55 0 0 1 15.2 12.2" fill="none" /><path d="M15.7 13.95 Q20 14.3 20 18.8" fill="none" /></Svg>; }
export function Report(p: IconProps) { return <Svg {...p}><rect x="5" y="4.5" width="14" height="16" rx="2.2" fill="none" /><rect x="9" y="2.7" width="6" height="2.6" rx="1" fill="none" /><line x1="8.6" y1="10" x2="15.4" y2="10" /><line x1="8.6" y1="13.4" x2="13.4" y2="13.4" /><polyline points="8.6,16.9 10,18.3 12.6,15.6" fill="none" /></Svg>; }


