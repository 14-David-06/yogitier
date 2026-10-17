import Image from "next/image";

import { animalsById } from "@/content/animals";
import type { BreathVisual as Visual } from "@/content/types";

export type BreathPhase = "ready" | "inhale" | "hold" | "exhale" | "rest" | "done";

const RAINBOW = ["#E9879E", "#F2A541", "#F1DD4B", "#8CC084", "#9CCFDB", "#7B9BBB", "#A6A3D2"];

/**
 * Animierte Atem-Visualisierung. Die Größe folgt der Atemphase,
 * die Dauer der CSS-Transition entspricht der Phasenlänge.
 */
export function BreathVisual({ visual, phase, duration, cycle }: { visual: Visual; phase: BreathPhase; duration: number; cycle: number }) {
  const big = phase === "inhale" || phase === "hold";
  const scale = phase === "ready" || phase === "done" ? 0.78 : big ? 1.12 : 0.7;
  const t = `transform ${duration}s cubic-bezier(0.45, 0, 0.55, 1)`;

  switch (visual) {
    case "ballon": {
      const color = RAINBOW[cycle % RAINBOW.length];
      return (
        <svg viewBox="0 0 200 240" className="size-full" aria-hidden>
          <g style={{ transform: `scale(${scale})`, transformOrigin: "100px 200px", transition: t }}>
            <path d="M100 200 C 96 210 104 220 98 236" stroke="#9B7A62" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <ellipse cx="100" cy="112" rx="62" ry="76" fill={color} />
            <ellipse cx="78" cy="84" rx="14" ry="22" fill="#fff" opacity="0.35" transform="rotate(-20 78 84)" />
            <path d="M92 186 L108 186 L100 198 Z" fill={color} />
          </g>
        </svg>
      );
    }
    case "loewe":
      return (
        <div className="relative grid size-full place-items-center">
          <div className="absolute inset-[8%] rounded-full bg-tierfreunde" style={{ transform: `scale(${big ? 1.05 : 0.85})`, transition: t }} />
          <Image
            src={animalsById.leo.image}
            alt=""
            className="relative h-[62%] w-auto object-contain"
            style={{ transform: `scale(${phase === "exhale" ? 1.18 : big ? 1 : 0.92}) rotate(${phase === "exhale" ? -3 : 0}deg)`, transition: `transform ${phase === "exhale" ? 0.35 : duration}s ease-out` }}
            sizes="200px"
          />
          {phase === "exhale" && (
            <span className="absolute bottom-[6%] rounded-full bg-white px-4 py-1 text-[22px] font-bold text-brand-orange shadow-md animate-pop">Roaaar!</span>
          )}
        </div>
      );
    case "blume":
      return (
        <svg viewBox="0 0 240 200" className="size-full" aria-hidden>
          {/* Blume */}
          <g style={{ transform: `scale(${phase === "inhale" || phase === "hold" ? 1.15 : 0.9})`, transformOrigin: "70px 120px", transition: t }}>
            <path d="M70 120 L70 190" stroke="#6E9A63" strokeWidth="6" strokeLinecap="round" />
            <ellipse cx="54" cy="160" rx="14" ry="7" fill="#8CC084" transform="rotate(-30 54 160)" />
            {[0, 60, 120, 180, 240, 300].map((a) => (
              <ellipse key={a} cx="70" cy="96" rx="13" ry="22" fill="#E9879E" transform={`rotate(${a} 70 120)`} opacity={0.92} />
            ))}
            <circle cx="70" cy="120" r="13" fill="#F1DD4B" />
          </g>
          {/* Kerze */}
          <g>
            <rect x="152" y="110" width="36" height="80" rx="8" fill="#FBF1BE" stroke="#E6D9CC" strokeWidth="2" />
            <path d="M170 110 L170 98" stroke="#5A3218" strokeWidth="3" strokeLinecap="round" />
            <g
              style={{
                transform: `scaleY(${phase === "exhale" ? 0.35 : 1}) skewX(${phase === "exhale" ? -18 : 0}deg)`,
                transformOrigin: "170px 98px",
                transition: `transform ${phase === "exhale" ? duration : 0.6}s ease-in-out`,
                opacity: phase === "exhale" ? 0.55 : 1,
              }}
            >
              <path d="M170 56 C 186 78 182 96 170 98 C 158 96 154 78 170 56 Z" fill="#F2A541" />
              <path d="M170 72 C 178 84 176 94 170 96 C 164 94 162 84 170 72 Z" fill="#F1DD4B" />
            </g>
          </g>
        </svg>
      );
    case "biene":
      return (
        <div className="relative grid size-full place-items-center">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="absolute rounded-full border-4 border-memo"
              style={{
                inset: `${14 + i * 12}%`,
                opacity: phase === "exhale" ? 0.9 - i * 0.25 : 0.25,
                transform: `scale(${phase === "exhale" ? 1.08 : 0.9})`,
                transition: `all ${duration}s ease-in-out`,
              }}
            />
          ))}
          <svg viewBox="0 0 120 100" className="relative w-[46%]" style={{ transform: `scale(${scale})`, transition: t }} aria-hidden>
            <ellipse cx="44" cy="30" rx="20" ry="14" fill="#E3EEF7" opacity="0.95" transform="rotate(-25 44 30)" />
            <ellipse cx="70" cy="28" rx="20" ry="14" fill="#E3EEF7" opacity="0.95" transform="rotate(25 70 28)" />
            <ellipse cx="60" cy="60" rx="38" ry="28" fill="#F1DD4B" />
            <path d="M46 36 Q 42 60 46 86 M62 32 Q 58 60 62 88 M78 38 Q 74 60 78 84" stroke="#3B2A1E" strokeWidth="7" fill="none" />
            <circle cx="92" cy="54" r="4" fill="#3B2A1E" />
            <path d="M22 60 L12 62" stroke="#3B2A1E" strokeWidth="3" strokeLinecap="round" />
          </svg>
          {phase === "exhale" && <span className="absolute bottom-[4%] text-[22px] font-bold tracking-widest text-ink animate-pop">Mmmmm …</span>}
        </div>
      );
    case "kuscheltier":
      return (
        <div className="relative size-full">
          <div className="absolute inset-x-[6%] bottom-[16%] h-[34%] rounded-[50%] bg-[#E2DDF5]" />
          <div
            className="absolute inset-x-[10%] bottom-[24%] h-[30%] rounded-[50%] bg-[#C9C2EE]"
            style={{ transform: `scaleY(${big ? 1.15 : 0.82})`, transformOrigin: "bottom", transition: t }}
          />
          <div className="absolute left-1/2 w-[46%] -translate-x-1/2" style={{ bottom: big ? "47%" : "36%", transition: `bottom ${duration}s cubic-bezier(0.45,0,0.55,1)` }}>
            <Image src={animalsById.benno.image} alt="" className="h-auto w-full" sizes="160px" />
          </div>
        </div>
      );
    case "regenbogen": {
      const shown = phase === "ready" ? 0 : Math.min(RAINBOW.length, cycle + (big ? 1 : 0));
      return (
        <svg viewBox="0 0 240 150" className="size-full" aria-hidden>
          {RAINBOW.map((c, i) => {
            const r = 104 - i * 11;
            const len = Math.PI * r;
            const visible = i < shown;
            const drawing = i === cycle && big;
            return (
              <path
                key={c}
                d={`M ${120 - r} 140 A ${r} ${r} 0 0 1 ${120 + r} 140`}
                fill="none"
                stroke={c}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={len}
                strokeDashoffset={visible ? 0 : len}
                style={{ transition: drawing ? `stroke-dashoffset ${duration}s ease-in-out` : "stroke-dashoffset 0.8s ease" }}
                opacity={0.95}
              />
            );
          })}
          <circle cx="40" cy="138" r="16" fill="#fff" />
          <circle cx="56" cy="134" r="12" fill="#fff" />
          <circle cx="200" cy="138" r="16" fill="#fff" />
          <circle cx="184" cy="134" r="12" fill="#fff" />
        </svg>
      );
    }
    case "elefant":
      return (
        <div className="relative grid size-full place-items-center">
          <div className="absolute inset-[10%] rounded-full bg-[#E3EEEE]" />
          <Image
            src={animalsById.eddy.image}
            alt=""
            className="relative h-[60%] w-auto object-contain"
            style={{ transform: `rotate(${big ? -14 : 8}deg) scale(${big ? 1.06 : 0.94})`, transformOrigin: "60% 30%", transition: t }}
            sizes="200px"
          />
          {phase === "exhale" && (
            <span className="absolute right-[6%] top-[14%] text-[20px] font-bold text-[#5F97C4] animate-pop">Pfffff!</span>
          )}
        </div>
      );
    case "hand": {
      const finger = cycle % 5;
      return (
        <svg viewBox="0 0 200 200" className="size-full" aria-hidden>
          <g fill="#F6CDB0">
            <rect x="62" y="96" width="76" height="80" rx="34" />
            {[
              { x: 44, y: 92, h: 52, r: -38 },
              { x: 70, y: 40, h: 72, r: -10 },
              { x: 92, y: 30, h: 80, r: 0 },
              { x: 114, y: 38, h: 74, r: 10 },
              { x: 134, y: 56, h: 60, r: 22 },
            ].map((f, i) => (
              <rect
                key={i}
                x={f.x}
                y={f.y}
                width="18"
                height={f.h}
                rx="9"
                transform={`rotate(${f.r} ${f.x + 9} ${f.y + f.h})`}
                fill={i === finger && phase !== "ready" ? "#F2A541" : "#F6CDB0"}
                style={{ transition: "fill 0.4s ease" }}
              />
            ))}
          </g>
          <circle
            r="8"
            fill="#7A4A28"
            style={{
              transform: `translate(${[50, 76, 101, 124, 146][finger]}px, ${big ? [92, 44, 34, 42, 60][finger] : 150}px)`,
              transition: `transform ${duration}s ease-in-out`,
            }}
          />
        </svg>
      );
    }
  }
}
