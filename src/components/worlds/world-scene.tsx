import type { CSSProperties, ReactNode } from "react";

import { Snow } from "@/components/meditation/journey-backdrop";
import { worldThemes } from "@/content/worlds";
import type { WorldTheme } from "@/lib/studio/types";
import { cn } from "@/lib/cn";

/** deterministische Pseudo-Zufallswerte für Deko-Positionen */
const rnd = (i: number, salt = 1) => {
  const x = Math.sin(i * 12.9898 * salt + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

function Leaf({ className, style, color }: { className?: string; style?: CSSProperties; color: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} style={style} aria-hidden>
      <path d="M8 112 C 10 50 50 8 112 8 C 110 70 70 110 8 112 Z" fill={color} />
      <path d="M12 108 C 40 80 70 50 104 14" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="3" fill="none" />
    </svg>
  );
}

function Cloud({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 120 60" className={className} style={style} aria-hidden>
      <path d="M20 50 C 4 50 4 30 20 30 C 22 14 46 10 52 24 C 60 10 88 12 90 30 C 108 28 112 50 96 50 Z" fill="#FFFFFF" />
    </svg>
  );
}

function Twinkles({ count, color, compact }: { count: number; color: string; compact?: boolean }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="absolute block rounded-full"
          style={{
            left: `${rnd(i, 1.3) * 100}%`,
            top: `${rnd(i, 2.1) * 100}%`,
            width: 2 + Math.round(rnd(i, 3.7) * 3),
            height: 2 + Math.round(rnd(i, 3.7) * 3),
            background: color,
            animation: compact ? undefined : `twinkle ${2 + rnd(i, 5) * 3}s ease-in-out ${rnd(i, 7) * 3}s infinite`,
            opacity: compact ? 0.8 : undefined,
          }}
        />
      ))}
    </>
  );
}

/**
 * Gestaltbare Umgebung einer Lernwelt (Hintergrund + animierte Deko).
 * `compact` = ruhige Mini-Version für Kacheln und Vorschaubilder.
 */
export function WorldScene({ theme, compact = false, className }: { theme: WorldTheme; compact?: boolean; className?: string }) {
  const t = worldThemes[theme];
  const anim = (value: string) => (compact ? undefined : value);
  let deco: ReactNode = null;

  switch (theme) {
    case "dschungel":
      deco = (
        <>
          {[
            { c: "left-[-10%] top-[-4%] w-[46%]", r: "-10deg", col: "#6E9A63" },
            { c: "right-[-12%] top-[2%] w-[44%] scale-x-[-1]", r: "8deg", col: "#8CC084" },
            { c: "left-[-14%] bottom-[18%] w-[38%]", r: "20deg", col: "#8CC084" },
            { c: "right-[-10%] bottom-[-6%] w-[50%] scale-x-[-1]", r: "-12deg", col: "#5E9C6A" },
          ].map((l, i) => (
            <Leaf
              key={i}
              color={l.col}
              className={cn("absolute opacity-90", l.c)}
              style={{ "--base": l.r, transformOrigin: "10% 90%", animation: anim(`sway ${6 + i}s ease-in-out infinite`) } as CSSProperties}
            />
          ))}
          {[18, 64, 82].map((x, i) => (
            <svg key={x} viewBox="0 0 20 200" className="absolute top-0 h-[38%] w-5" style={{ left: `${x}%` }} aria-hidden>
              <path d={`M10 0 C ${i % 2 ? 0 : 20} 60 ${i % 2 ? 20 : 0} 120 10 200`} stroke="#5E9C6A" strokeWidth="3" fill="none" />
              <ellipse cx="10" cy="196" rx="7" ry="4" fill="#8CC084" />
            </svg>
          ))}
          <Twinkles count={compact ? 4 : 10} color="#F1DD4B" compact={compact} />
        </>
      );
      break;
    case "unterwasser":
      deco = (
        <>
          {[6, 22, 48, 70, 88].map((x, i) => (
            <svg
              key={x}
              viewBox="0 0 40 160"
              className="absolute bottom-0 h-[28%] w-10"
              style={{ left: `${x}%`, transformOrigin: "bottom", "--base": "0deg", animation: anim(`sway ${5 + i}s ease-in-out infinite`) } as CSSProperties}
              aria-hidden
            >
              <path d={`M20 160 C ${i % 2 ? 0 : 40} 110 ${i % 2 ? 40 : 0} 60 20 0`} stroke={i % 2 ? "#5E9C6A" : "#7BAF6E"} strokeWidth="9" strokeLinecap="round" fill="none" />
            </svg>
          ))}
          {Array.from({ length: compact ? 6 : 14 }, (_, i) => (
            <span
              key={i}
              className="absolute block rounded-full border-2 border-white/80 bg-white/20"
              style={
                {
                  left: `${rnd(i, 1.7) * 100}%`,
                  bottom: compact ? `${rnd(i, 2.9) * 90}%` : "-4%",
                  width: 6 + rnd(i, 4.1) * 14,
                  height: 6 + rnd(i, 4.1) * 14,
                  "--drift": `${(rnd(i, 6) - 0.5) * 40}px`,
                  animation: anim(`bubble ${7 + rnd(i, 8) * 6}s linear ${rnd(i, 9) * 8}s infinite`),
                } as CSSProperties
              }
            />
          ))}
          <svg viewBox="0 0 60 30" className="absolute left-[10%] top-[30%] w-14 opacity-70" style={{ animation: anim("drift-slow 9s ease-in-out infinite") }} aria-hidden>
            <path d="M10 15 C 20 2 40 2 48 15 C 40 28 20 28 10 15 Z M48 15 L58 6 L58 24 Z" fill="#F2A541" />
            <circle cx="18" cy="13" r="2" fill="#2F2622" />
          </svg>
          <svg viewBox="0 0 60 30" className="absolute right-[12%] top-[56%] w-10 opacity-70" style={{ animation: anim("drift-slow 11s ease-in-out 2s infinite") }} aria-hidden>
            <path d="M50 15 C 40 2 20 2 12 15 C 20 28 40 28 50 15 Z M12 15 L2 6 L2 24 Z" fill="#E9879E" />
            <circle cx="42" cy="13" r="2" fill="#2F2622" />
          </svg>
        </>
      );
      break;
    case "weltraum":
      deco = (
        <>
          <Twinkles count={compact ? 18 : 46} color="#FFFFFF" compact={compact} />
          <span className="absolute right-[-8%] top-[8%] block size-[34%] rounded-full bg-gradient-to-br from-[#F7C65A] to-[#E8961E] opacity-90" />
          <span className="absolute right-[-14%] top-[17%] block h-[6%] w-[52%] rotate-[-18deg] rounded-full border-[3px] border-[#F6DDF0]/70" />
          <span className="absolute bottom-[12%] left-[-6%] block size-[22%] rounded-full bg-gradient-to-br from-[#A6A3D2] to-[#6F6AB8] opacity-90" />
          {!compact && <span className="absolute right-[10%] top-[30%] block h-0.5 w-20 rotate-[-28deg] rounded-full bg-white" style={{ animation: "shoot 7s ease-in 2s infinite" }} />}
        </>
      );
      break;
    case "zauberwald":
      deco = (
        <>
          <svg viewBox="0 0 400 120" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[24%] w-full" aria-hidden>
            <path d="M0 120 L0 70 L30 30 L60 70 L90 20 L130 70 L170 36 L210 70 L250 24 L290 70 L330 40 L370 70 L400 30 L400 120 Z" fill="#5E9C6A" opacity="0.45" />
          </svg>
          {[10, 30, 52, 74, 90].map((x, i) => (
            <span
              key={x}
              className="absolute top-[-6%] block size-4 rounded-[50%_0]"
              style={
                {
                  left: `${x}%`,
                  top: compact ? `${20 + i * 12}%` : "-6%",
                  background: i % 2 ? "#8CC084" : "#E8961E",
                  "--drift": `${(i % 2 ? 1 : -1) * 36}px`,
                  animation: anim(`snow ${12 + i * 2}s linear ${i * 2.4}s infinite`),
                } as CSSProperties
              }
            />
          ))}
          <Twinkles count={compact ? 4 : 8} color="#F1DD4B" compact={compact} />
        </>
      );
      break;
    case "wiese":
      deco = (
        <>
          <div className="absolute right-[6%] top-[5%] size-[30%]" style={{ animation: anim("spin 30s linear infinite") }}>
            {Array.from({ length: 10 }, (_, i) => (
              <span key={i} className="absolute left-1/2 top-0 h-1/2 w-1.5 origin-bottom -translate-x-1/2 rounded-full bg-[#F7C65A]/50" style={{ rotate: `${i * 36}deg` }} />
            ))}
          </div>
          <span className="absolute right-[14%] top-[13%] block size-[14%] rounded-full bg-[#F7C65A]" />
          <Cloud className="absolute left-[6%] top-[12%] w-[30%] opacity-90" style={{ animation: anim("drift-slow 12s ease-in-out infinite") }} />
          <svg viewBox="0 0 400 140" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[26%] w-full" aria-hidden>
            <path d="M0 60 C 80 10 160 20 220 50 C 280 80 340 30 400 40 L400 140 L0 140 Z" fill="#B8DC93" />
            <path d="M0 100 C 100 60 200 80 260 90 C 320 100 360 70 400 80 L400 140 L0 140 Z" fill="#8CC084" />
          </svg>
          {Array.from({ length: compact ? 5 : 10 }, (_, i) => (
            <span
              key={i}
              className="absolute block size-2.5 rounded-full"
              style={{ left: `${6 + rnd(i, 2) * 88}%`, bottom: `${4 + rnd(i, 3) * 14}%`, background: ["#E9879E", "#F1DD4B", "#FFFFFF", "#A6A3D2"][i % 4] }}
            />
          ))}
        </>
      );
      break;
    case "winter":
      deco = (
        <>
          <svg viewBox="0 0 400 140" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[22%] w-full" aria-hidden>
            <path d="M0 70 C 90 30 170 40 240 64 C 300 84 350 50 400 56 L400 140 L0 140 Z" fill="#FFFFFF" />
          </svg>
          {compact ? <Twinkles count={14} color="#FFFFFF" compact /> : <Snow count={22} />}
        </>
      );
      break;
    case "regenbogen":
      deco = (
        <>
          <svg viewBox="0 0 240 130" className="absolute left-1/2 top-[6%] w-[86%] -translate-x-1/2 opacity-80" aria-hidden>
            {["#E9879E", "#F2A541", "#F1DD4B", "#8CC084", "#9CCFDB", "#A6A3D2"].map((c, i) => (
              <path key={c} d={`M ${20 + i * 9} 125 A ${100 - i * 9} ${100 - i * 9} 0 0 1 ${220 - i * 9} 125`} stroke={c} strokeWidth="8" fill="none" strokeLinecap="round" />
            ))}
          </svg>
          <Cloud className="absolute left-[2%] top-[22%] w-[30%]" style={{ animation: anim("drift-slow 10s ease-in-out infinite") }} />
          <Cloud className="absolute right-[2%] top-[24%] w-[28%]" style={{ animation: anim("drift-slow 12s ease-in-out 1s infinite") }} />
          <Twinkles count={compact ? 6 : 12} color="#FFFFFF" compact={compact} />
        </>
      );
      break;
    case "strand":
      deco = (
        <>
          <span className="absolute left-[8%] top-[6%] block size-[18%] rounded-full bg-[#F7C65A]" />
          <Cloud className="absolute right-[6%] top-[10%] w-[28%] opacity-90" style={{ animation: anim("drift-slow 12s ease-in-out infinite") }} />
          <div className="absolute inset-x-0 bottom-[16%] h-[20%] bg-[#7FB9DB]/70" />
          <svg viewBox="0 0 800 60" preserveAspectRatio="none" className="absolute bottom-[34%] h-[5%] w-[200%]" style={{ animation: anim("drift-slow 8s ease-in-out infinite") }} aria-hidden>
            <path d="M0 30 Q 50 0 100 30 T 200 30 T 300 30 T 400 30 T 500 30 T 600 30 T 700 30 T 800 30 L800 60 L0 60 Z" fill="#7FB9DB" opacity="0.7" />
          </svg>
          <div className="absolute inset-x-0 bottom-0 h-[18%] bg-[#F3DDB0]" />
          {[14, 40, 72].map((x, i) => (
            <span key={x} className="absolute bottom-[6%] block size-3 rounded-full bg-[#E9879E]/70" style={{ left: `${x}%`, transform: `scale(${1 + i * 0.3})` }} />
          ))}
        </>
      );
      break;
  }

  return (
    <div
      className={cn("pointer-events-none overflow-hidden", className)}
      style={{ background: `linear-gradient(180deg, ${t.from} 0%, ${t.to} 100%)` }}
      aria-hidden
    >
      {deco}
    </div>
  );
}
