"use client";

import { Bird, Check, Dices, Wind } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import { useEffect, useEffectEvent, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

import flamingo from "@/assets/poses/flamingo.png";
import frosch from "@/assets/poses/frosch.png";
import katze from "@/assets/poses/katze.png";
import schmetterling from "@/assets/poses/schmetterling.png";
import { ProgressRing } from "@/components/ui/progress-ring";
import { playChime, playRoll, playSuccess, playTick } from "@/lib/audio";
import { cn } from "@/lib/cn";
import { speak, stopSpeaking } from "@/lib/speech";
import { logActivity } from "@/lib/store";

/** Die sechs Seiten des YOGITIER® DIY-Yoga-Würfels (Gratis-Download) */
type Face = { id: string; title: string; text: string; color: string; image?: StaticImageData; icon?: ReactNode; seconds: number };

const FACES: Face[] = [
  { id: "schmetterling", title: "Der Schmetterling", text: "Setz dich hin, Fußsohlen zusammen – und lass deine Flügel flattern.", color: "#FBEBC4", image: schmetterling, seconds: 20 },
  { id: "katze", title: "Die Katze", text: "Vierfüßlerstand: runder Katzenbuckel – und wieder lang machen. Miau!", color: "#FDE9E9", image: katze, seconds: 20 },
  { id: "frosch", title: "Der Frosch", text: "Tief in die Hocke, Hände vor die Brust – und hüpf wie ein Frosch!", color: "#E2F0CF", image: frosch, seconds: 20 },
  { id: "flamingo", title: "Der Flamingo", text: "Stell dich auf ein Bein und leg die Hände über dem Kopf zusammen.", color: "#FBE3E6", image: flamingo, seconds: 20 },
  {
    id: "atmen",
    title: "3 tiefe Atemzüge",
    text: "Atme dreimal ganz tief durch die Nase ein – und langsam wieder aus.",
    color: "#E7E2F8",
    icon: <Wind className="size-14 text-lilac-ink" strokeWidth={1.6} aria-hidden />,
    seconds: 15,
  },
  {
    id: "fliegen",
    title: "Du fliegst!",
    text: "Schließ deine Augen und stell dir vor, du fliegst wie ein Vogel über die Welt.",
    color: "#D6E6F5",
    icon: <Bird className="size-14 text-[#3F5F80]" strokeWidth={1.6} aria-hidden />,
    seconds: 20,
  },
];

// Ausrichtung, damit die jeweilige Seite nach vorn zeigt: [rotateX, rotateY]
const ORIENT: [number, number][] = [
  [0, 0],
  [0, -90],
  [0, -180],
  [0, 90],
  [-90, 0],
  [90, 0],
];

const FACE_TRANSFORM = ["rotateY(0deg)", "rotateY(90deg)", "rotateY(180deg)", "rotateY(-90deg)", "rotateX(90deg)", "rotateX(-90deg)"];

function FaceContent({ face, small = false }: { face: Face; small?: boolean }) {
  return (
    <span className="flex size-full flex-col items-center justify-center gap-1 rounded-[26px] border-4 border-white p-3 shadow-[inset_0_0_0_1px_rgb(122_74_40/0.06)]" style={{ background: face.color }}>
      {face.image ? (
        <Image src={face.image} alt="" className={cn("w-auto object-contain", small ? "h-[62%]" : "h-[64%]")} sizes="160px" />
      ) : (
        face.icon
      )}
      <span className="text-center text-[13px] font-bold leading-tight text-ink">{face.title}</span>
    </span>
  );
}

type Phase = "idle" | "rolling" | "result" | "doing" | "done";

export function YogaDice() {
  const [rot, setRot] = useState<[number, number]>([-18, 24]);
  const [faceIdx, setFaceIdx] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [remaining, setRemaining] = useState(0);
  const [count, setCount] = useState(0);
  const landTimer = useRef<number | null>(null);

  const face = faceIdx === null ? null : FACES[faceIdx];

  const roll = () => {
    if (phase === "rolling") return;
    stopSpeaking();
    const idx = Math.floor(Math.random() * FACES.length);
    const [tx, ty] = ORIENT[idx];
    const spinsX = 1 + Math.floor(Math.random() * 2);
    const spinsY = 1 + Math.floor(Math.random() * 2);
    setRot(([x, y]) => {
      const nx = x - (((x % 360) + 360) % 360) + 360 * spinsX + tx;
      const ny = y - (((y % 360) + 360) % 360) + 360 * spinsY + ty;
      return [nx, ny];
    });
    setFaceIdx(idx);
    setPhase("rolling");
    playRoll();
    if (landTimer.current) window.clearTimeout(landTimer.current);
    landTimer.current = window.setTimeout(() => {
      setPhase("result");
      playChime();
      speak(`${FACES[idx].title}! ${FACES[idx].text}`);
    }, 1650);
  };

  const start = () => {
    if (!face) return;
    setRemaining(face.seconds);
    setPhase("doing");
  };

  const finish = useEffectEvent(() => {
    if (!face) return;
    setPhase("done");
    setCount((c) => c + 1);
    playSuccess();
    speak("Super gemacht! Würfel noch einmal!");
    logActivity({ type: "wuerfel", refId: face.id, title: `Yoga-Würfel: ${face.title}`, seconds: face.seconds + 10 });
  });

  // Countdown während „Mach mit!“
  useEffect(() => {
    if (phase !== "doing") return;
    const id = window.setTimeout(() => {
      const next = remaining - 1;
      if (next <= 0) {
        setRemaining(0);
        finish();
        return;
      }
      if (next <= 3) playTick();
      setRemaining(next);
    }, 1000);
    return () => window.clearTimeout(id);
  }, [phase, remaining]);

  useLayoutEffect(
    () => () => {
      if (landTimer.current) window.clearTimeout(landTimer.current);
      stopSpeaking();
    },
    [],
  );

  const size = 168;
  const cubeStyle = { "--dice-size": `${size}px`, transform: `rotateX(${rot[0]}deg) rotateY(${rot[1]}deg)` } as CSSProperties;

  return (
    <div className="flex flex-col items-center px-5 pb-10">
      <div className="dice-scene mt-6 grid h-[230px] place-items-center">
        <button type="button" onClick={roll} aria-label="Würfeln" className="dice cursor-pointer outline-none" style={cubeStyle} disabled={phase === "rolling"}>
          {FACES.map((f, i) => (
            <span key={f.id} className="dice-face" style={{ transform: `${FACE_TRANSFORM[i]} translateZ(${size / 2}px)` }}>
              <FaceContent face={f} />
            </span>
          ))}
        </button>
      </div>

      <div className="mt-4 min-h-[220px] w-full" aria-live="polite">
        {(phase === "idle" || phase === "rolling") && (
          <div className="text-center animate-fade-up">
            <h2 className="text-[22px] font-bold text-ink-strong">{phase === "rolling" ? "Der Würfel rollt …" : "Tippe auf den Würfel!"}</h2>
            <p className="mt-1 text-[14.5px] font-medium text-ink-soft">Welche Übung zeigt dir der Würfel?</p>
          </div>
        )}

        {face && (phase === "result" || phase === "doing" || phase === "done") && (
          <div key={`${faceIdx}-${count}`} className="rounded-[26px] p-5 text-center animate-fade-up" style={{ background: face.color }}>
            {phase === "doing" ? (
              <div className="flex flex-col items-center">
                <div className="relative grid size-28 place-items-center">
                  <ProgressRing value={1 - remaining / face.seconds} size={112} stroke={8} />
                  <span className="absolute text-[34px] font-bold tabular-nums text-ink">{remaining}</span>
                </div>
                <p className="mt-3 text-[18px] font-bold text-ink-strong">{face.title}</p>
                <p className="mt-1 text-[14px] font-medium text-ink">{face.text}</p>
              </div>
            ) : phase === "done" ? (
              <div className="flex flex-col items-center">
                <span className="grid size-14 place-items-center rounded-full bg-white text-ink animate-pop">
                  <Check className="size-7" strokeWidth={3} aria-hidden />
                </span>
                <p className="mt-3 text-[20px] font-bold text-ink-strong">Super gemacht!</p>
                <p className="text-[14px] font-medium text-ink">Würfle noch einmal für die nächste Übung.</p>
              </div>
            ) : (
              <>
                <p className="text-[12.5px] font-bold uppercase tracking-wider text-ink-soft">Gewürfelt</p>
                <p className="mt-1 text-[22px] font-bold text-ink-strong">{face.title}</p>
                <p className="mt-1 text-[15px] font-medium leading-snug text-ink">{face.text}</p>
                <button
                  type="button"
                  onClick={start}
                  className="mt-4 h-12 w-full rounded-[18px] bg-ink text-[16px] font-bold text-white shadow-md shadow-ink/20 active:scale-[0.98]"
                >
                  Los, mach mit! ({face.seconds} Sek.)
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={roll}
        disabled={phase === "rolling" || phase === "doing"}
        className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-[22px] border-2 border-ink text-[17px] font-bold text-ink transition active:scale-[0.98] disabled:opacity-40"
      >
        <Dices className="size-5" aria-hidden /> {faceIdx === null ? "Würfeln" : "Nochmal würfeln"}
      </button>
      {count > 0 && <p className="mt-3 text-[13px] font-bold text-ink-soft">Schon {count} {count === 1 ? "Übung" : "Übungen"} geschafft!</p>}
    </div>
  );
}
