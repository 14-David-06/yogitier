import type { CSSProperties } from "react";

const COLORS = ["#A6A3D2", "#E8961E", "#A8714F", "#F1DD4B", "#E9879E", "#B4DCE4", "#487270", "#E0612A"];

/** deterministischer Zufall (gleiches Ergebnis bei gleichem Seed) */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Konfetti-Regen in den YOGITIER®-Farben. `seed` ändern, um ihn neu abzuspielen. */
export function Confetti({ seed = 1, count = 70 }: { seed?: number; count?: number }) {
  const rand = mulberry32(seed * 9973 + 17);
  const pieces = Array.from({ length: count }, (_, i) => {
    const w = 6 + rand() * 7;
    return {
      key: i,
      style: {
        left: `${rand() * 100}%`,
        top: `${-10 - rand() * 30}px`,
        width: w,
        height: rand() > 0.5 ? w : w * 0.45,
        background: COLORS[Math.floor(rand() * COLORS.length)],
        borderRadius: rand() > 0.6 ? "999px" : "2px",
        animation: `confetti-fall ${2.2 + rand() * 1.8}s cubic-bezier(0.2, 0.6, 0.4, 1) ${rand() * 0.6}s both`,
        "--dx": `${(rand() - 0.5) * 160}px`,
        "--dy": `${640 + rand() * 260}px`,
        "--rot": `${(rand() - 0.5) * 1080}deg`,
      } as CSSProperties,
    };
  });
  return (
    <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden" aria-hidden key={seed}>
      {pieces.map((p) => (
        <span key={p.key} className="absolute block" style={p.style} />
      ))}
    </div>
  );
}
