import type { CSSProperties } from "react";

import type { JourneyTheme } from "@/content/types";

/** ruhige, animierte Hintergründe für die Fantasiereisen */
export function JourneyBackdrop({ theme, from, to }: { theme: JourneyTheme; from: string; to: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden style={{ background: `linear-gradient(180deg, ${from} 0%, ${to} 100%)` }}>
      {theme === "wolken" && (
        <>
          {[
            { top: "14%", left: "-6%", w: 150, d: "0s" },
            { top: "30%", left: "58%", w: 120, d: "2s" },
            { top: "62%", left: "8%", w: 170, d: "4s" },
            { top: "78%", left: "62%", w: 130, d: "1s" },
          ].map((c, i) => (
            <svg
              key={i}
              viewBox="0 0 120 60"
              className="absolute opacity-80"
              style={{ top: c.top, left: c.left, width: c.w, animation: `drift-slow ${11 + i * 2}s ease-in-out ${c.d} infinite` }}
            >
              <path d="M20 50 C 4 50 4 30 20 30 C 22 14 46 10 52 24 C 60 10 88 12 90 30 C 108 28 112 50 96 50 Z" fill="#FFFFFF" />
            </svg>
          ))}
          <Stars color="#A99BF0" />
        </>
      )}
      {theme === "wald" && (
        <>
          {[8, 24, 44, 66, 82].map((x, i) => (
            <span
              key={i}
              className="absolute block rounded-[50%_0]"
              style={
                {
                  left: `${x}%`,
                  top: "-8%",
                  width: 18,
                  height: 18,
                  background: i % 2 ? "#8CC084" : "#6E9A63",
                  "--drift": `${(i % 2 ? 1 : -1) * 40}px`,
                  animation: `snow ${14 + i * 2}s linear ${i * 2.2}s infinite`,
                } as CSSProperties
              }
            />
          ))}
          <Stars color="#F1DD4B" />
          <svg viewBox="0 0 400 120" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[22%] w-full">
            <path d="M0 120 L0 70 L30 30 L60 70 L90 20 L130 70 L170 36 L210 70 L250 24 L290 70 L330 40 L370 70 L400 30 L400 120 Z" fill="#6E9A63" opacity="0.35" />
          </svg>
        </>
      )}
      {theme === "meer" && (
        <>
          <Stars color="#FFFFFF" />
          {[0, 1, 2].map((i) => (
            <svg
              key={i}
              viewBox="0 0 800 100"
              preserveAspectRatio="none"
              className="absolute bottom-0 h-[18%] w-[200%]"
              style={{ bottom: `${i * 5}%`, opacity: 0.35 + i * 0.15, animation: `drift-slow ${8 + i * 3}s ease-in-out infinite` }}
            >
              <path d="M0 50 Q 50 20 100 50 T 200 50 T 300 50 T 400 50 T 500 50 T 600 50 T 700 50 T 800 50 L800 100 L0 100 Z" fill="#5F97C4" />
            </svg>
          ))}
        </>
      )}
      {theme === "sonne" && (
        <>
          <div className="absolute left-1/2 top-[8%] size-[260px] -translate-x-1/2 animate-spin-slow">
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i} className="absolute left-1/2 top-0 h-1/2 w-2 origin-bottom -translate-x-1/2 rounded-full bg-[#F1DD4B]/45" style={{ rotate: `${i * 30}deg` }} />
            ))}
          </div>
          <div className="absolute left-1/2 top-[calc(8%+70px)] size-[120px] -translate-x-1/2 rounded-full bg-[#F7C65A]/70 blur-[2px]" />
          <Stars color="#E8961E" />
        </>
      )}
      {theme === "schnee" && <Snow />}
    </div>
  );
}

function Stars({ color }: { color: string }) {
  const pos = [
    [12, 10],
    [80, 8],
    [64, 22],
    [26, 40],
    [88, 46],
    [8, 70],
    [52, 58],
    [74, 84],
  ];
  return (
    <>
      {pos.map(([x, y], i) => (
        <span
          key={i}
          className="absolute block size-2 rounded-full"
          style={{ left: `${x}%`, top: `${y}%`, background: color, animation: `twinkle ${2.4 + (i % 3)}s ease-in-out ${i * 0.4}s infinite` }}
        />
      ))}
    </>
  );
}

export function Snow({ count = 26, color = "#FFFFFF" }: { count?: number; color?: string }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const x = (i * 37) % 100;
        const size = 4 + ((i * 7) % 6);
        return (
          <span
            key={i}
            className="absolute block rounded-full"
            style={
              {
                left: `${x}%`,
                top: "-4%",
                width: size,
                height: size,
                background: color,
                opacity: 0.9,
                boxShadow: "0 0 6px rgb(160 180 210 / 0.6)",
                "--drift": `${((i % 5) - 2) * 14}px`,
                animation: `snow ${7 + (i % 6)}s linear ${(i * 0.53) % 7}s infinite`,
              } as CSSProperties
            }
          />
        );
      })}
    </>
  );
}
