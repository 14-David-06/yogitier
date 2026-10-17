import Image from "next/image";

import emmi from "@/assets/animals/emmi.png";
import { cn } from "@/lib/cn";

const SPARKLES = [
  { left: "4%", top: "10%", size: 0.16, delay: "0s", color: "#A99BF0" },
  { left: "82%", top: "4%", size: 0.13, delay: "0.7s", color: "#F2B84B" },
  { left: "88%", top: "70%", size: 0.11, delay: "1.3s", color: "#F48FB1" },
];

/** Emmi das Einhorn – schwebt wie die Tiere der App, wippt und sendet Schallwellen, während sie spricht. */
export function EmmiAvatar({ size = 64, speaking = false, sparkles = true, className }: { size?: number; speaking?: boolean; sparkles?: boolean; className?: string }) {
  return (
    <span className={cn("relative inline-grid shrink-0 place-items-center", className)} style={{ width: size, height: size }} aria-hidden>
      <span className="absolute inset-[4%] rounded-full bg-gradient-to-br from-[#F6F2FF] via-[#ECE6FB] to-[#DCD3F7]" />
      {speaking &&
        [0, 1].map((i) => (
          <span key={i} className="absolute inset-0 rounded-full border-2 border-lilac" style={{ animation: `emmi-ring 1.6s ease-out ${i * 0.8}s infinite` }} />
        ))}
      <span className="relative animate-float" style={{ width: size * 0.88, height: size * 0.88 }}>
        <Image
          src={emmi}
          alt=""
          className="size-full object-contain drop-shadow-[0_3px_4px_rgb(90_50_24/0.18)]"
          style={speaking ? { animation: "emmi-talk 0.75s ease-in-out infinite" } : undefined}
          sizes={`${Math.round(size)}px`}
        />
      </span>
      {sparkles &&
        SPARKLES.map((s) => (
          <svg
            key={s.left}
            viewBox="0 0 24 24"
            className="absolute"
            style={{ left: s.left, top: s.top, width: size * s.size, height: size * s.size, color: s.color, animation: `twinkle 2.4s ease-in-out ${s.delay} infinite` }}
          >
            <path fill="currentColor" d="M12 0c.6 5.6 3 9 12 12-9 3-11.4 6.4-12 12C11.4 18.4 9 15 0 12 9 9 11.4 5.6 12 0Z" />
          </svg>
        ))}
    </span>
  );
}
