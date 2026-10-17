import type { MoodId } from "@/content/types";
import { moodsById } from "@/content/moods";

const INK = "#5A3218";

/** einfache, freundliche Gefühls-Gesichter */
export function MoodFace({ mood, className }: { mood: MoodId; className?: string }) {
  const m = moodsById[mood];
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label={m.label}>
      <circle cx="32" cy="32" r="30" fill={m.color} />
      <circle cx="32" cy="32" r="30" fill="none" stroke="#000" strokeOpacity="0.05" strokeWidth="2" />
      <g stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none">
        {mood === "froehlich" && (
          <>
            <circle cx="22" cy="26" r="2.6" fill={INK} stroke="none" />
            <circle cx="42" cy="26" r="2.6" fill={INK} stroke="none" />
            <path d="M19 37 Q32 51 45 37" />
          </>
        )}
        {mood === "ruhig" && (
          <>
            <path d="M17 27 Q22 23 27 27" />
            <path d="M37 27 Q42 23 47 27" />
            <path d="M24 40 Q32 45 40 40" />
          </>
        )}
        {mood === "muede" && (
          <>
            <path d="M17 28 L27 28" />
            <path d="M37 28 L47 28" />
            <ellipse cx="32" cy="42" rx="4" ry="5" fill={INK} stroke="none" />
            <path d="M48 12 h5 l-5 5 h5" strokeWidth="2" />
          </>
        )}
        {mood === "traurig" && (
          <>
            <circle cx="22" cy="28" r="2.6" fill={INK} stroke="none" />
            <circle cx="42" cy="28" r="2.6" fill={INK} stroke="none" />
            <path d="M22 46 Q32 37 42 46" />
            <path d="M44 33 Q41 38 44 40 Q47 38 44 33 Z" fill="#7FB3E0" stroke="none" />
          </>
        )}
        {mood === "wuetend" && (
          <>
            <path d="M16 21 L27 25" />
            <path d="M48 21 L37 25" />
            <circle cx="22" cy="29" r="2.6" fill={INK} stroke="none" />
            <circle cx="42" cy="29" r="2.6" fill={INK} stroke="none" />
            <path d="M22 45 Q32 38 42 45" />
          </>
        )}
        {mood === "aengstlich" && (
          <>
            <circle cx="22" cy="27" r="5" fill="#fff" strokeWidth="2.4" />
            <circle cx="42" cy="27" r="5" fill="#fff" strokeWidth="2.4" />
            <circle cx="22" cy="28" r="2" fill={INK} stroke="none" />
            <circle cx="42" cy="28" r="2" fill={INK} stroke="none" />
            <path d="M21 43 q3.5 -3 7 0 t7 0 t7 0" strokeWidth="2.6" />
          </>
        )}
      </g>
      {(mood === "froehlich" || mood === "ruhig") && (
        <g fill="#F08C8C" opacity="0.5">
          <circle cx="15" cy="36" r="4" />
          <circle cx="49" cy="36" r="4" />
        </g>
      )}
    </svg>
  );
}
