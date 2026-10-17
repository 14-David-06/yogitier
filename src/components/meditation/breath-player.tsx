"use client";

import { Pause, Play, RotateCcw, Volume2, VolumeX, Wind, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useEffectEvent, useLayoutEffect, useReducer, useRef, useState } from "react";

import { Confetti } from "@/components/ui/confetti";
import { animalsById } from "@/content/animals";
import { breathSeconds, getBreath } from "@/content/breathing";
import type { Breath } from "@/content/types";
import { playBowl } from "@/lib/audio";
import { cn } from "@/lib/cn";
import { speak, stopSpeaking } from "@/lib/speech";
import { logActivity, updateSettings, useAppState } from "@/lib/store";

import { BreathVisual, type BreathPhase } from "./breath-visual";

type State = { phase: BreathPhase; cycle: number; remaining: number; paused: boolean; run: number };
type Action = { type: "tick" } | { type: "toggle" } | { type: "restart" };

const READY_SECONDS = 4;
const LABEL: Record<BreathPhase, string> = {
  ready: "Mach es dir bequem",
  inhale: "Einatmen",
  hold: "Halten",
  exhale: "Ausatmen",
  rest: "Pause",
  done: "Wunderbar!",
};

function phaseLength(b: Breath, phase: BreathPhase) {
  switch (phase) {
    case "inhale":
      return b.pattern.inhale;
    case "hold":
      return b.pattern.hold;
    case "exhale":
      return b.pattern.exhale;
    case "rest":
      return b.pattern.rest;
    case "ready":
      return READY_SECONDS;
    default:
      return 0;
  }
}

function nextPhase(b: Breath, s: State): State {
  const order: BreathPhase[] = ["inhale", "hold", "exhale", "rest"];
  if (s.phase === "ready") return { ...s, phase: "inhale", cycle: 0, remaining: b.pattern.inhale };
  let idx = order.indexOf(s.phase);
  let cycle = s.cycle;
  for (let guard = 0; guard < 5; guard++) {
    idx++;
    if (idx >= order.length) {
      idx = 0;
      cycle++;
      if (cycle >= b.cycles) return { ...s, phase: "done", remaining: 0, cycle };
    }
    const len = phaseLength(b, order[idx]);
    if (len > 0) return { ...s, phase: order[idx], cycle, remaining: len };
  }
  return { ...s, phase: "done", remaining: 0 };
}

function reduce(b: Breath, s: State, a: Action): State {
  switch (a.type) {
    case "restart":
      return { phase: "ready", cycle: 0, remaining: READY_SECONDS, paused: false, run: s.run + 1 };
    case "toggle":
      return s.phase === "done" ? s : { ...s, paused: !s.paused };
    case "tick":
      if (s.paused || s.phase === "done") return s;
      if (s.remaining > 1) return { ...s, remaining: s.remaining - 1 };
      return nextPhase(b, s);
  }
}

export function BreathPlayer({ breath, onClose, onComplete }: { breath: Breath; onClose: () => void; onComplete?: () => void }) {
  const [s, dispatch] = useReducer((st: State, a: Action) => reduce(breath, st, a), undefined, () => ({
    phase: "ready" as BreathPhase,
    cycle: 0,
    remaining: READY_SECONDS,
    paused: false,
    run: 0,
  }));
  const app = useAppState();
  const voice = app.settings.voice;
  const host = animalsById[breath.host];
  const logged = useRef<number | null>(null);

  useEffect(() => {
    if (s.paused || s.phase === "done") return;
    const id = window.setInterval(() => dispatch({ type: "tick" }), 1000);
    return () => window.clearInterval(id);
  }, [s.paused, s.phase]);

  const announce = useEffectEvent(() => {
    const first = s.cycle === 0;
    if (s.phase === "ready") {
      playBowl();
      speak(`${breath.title}. ${breath.howTo[0]}`);
    } else if (s.phase === "inhale") speak(first ? breath.cues.inhale : "Einatmen");
    else if (s.phase === "hold") speak(first && breath.cues.hold ? breath.cues.hold : "Halten");
    else if (s.phase === "exhale") speak(first ? breath.cues.exhale : "Ausatmen");
    else if (s.phase === "done") {
      playBowl();
      speak(`Wunderbar! ${host.name} sagt: ${host.affirmation}`);
      if (logged.current !== s.run) {
        logged.current = s.run;
        logActivity({ type: "atmen", refId: breath.slug, title: breath.title, seconds: breathSeconds(breath) });
        onComplete?.();
      }
    }
  });

  useEffect(() => {
    announce();
  }, [s.phase, s.cycle, s.run]);

  useEffect(() => {
    if (s.paused) stopSpeaking();
  }, [s.paused]);

  const close = useEffectEvent(() => onClose());
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        dispatch({ type: "toggle" });
      } else if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      stopSpeaking();
    };
  }, []);

  const duration = Math.max(0.6, phaseLength(breath, s.phase));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={breath.title}
      className="fixed inset-0 z-40 flex flex-col"
      style={{ background: `radial-gradient(circle at 50% 38%, #FFFFFF 0%, ${breath.color} 70%)`, animation: "fade-in 240ms ease-out both" }}
    >
      <div className="px-4 pt-safe">
        <div className="flex h-14 items-center justify-between">
          <button type="button" onClick={onClose} aria-label="Schließen" className="grid size-11 place-items-center rounded-full bg-white/80 text-ink ring-1 ring-line active:scale-95">
            <X className="size-5" aria-hidden />
          </button>
          <p className="text-[15px] font-bold text-ink">{breath.title}</p>
          <button
            type="button"
            onClick={() => updateSettings({ voice: !voice })}
            aria-label={voice ? "Vorlesestimme ausschalten" : "Vorlesestimme einschalten"}
            aria-pressed={voice}
            className="grid size-11 place-items-center rounded-full bg-white/80 text-ink ring-1 ring-line active:scale-95"
          >
            {voice ? <Volume2 className="size-5" aria-hidden /> : <VolumeX className="size-5" aria-hidden />}
          </button>
        </div>
      </div>

      {s.phase === "done" ? (
        <div className="relative flex flex-1 flex-col items-center justify-center px-6 text-center">
          <Confetti seed={s.run + 3} count={40} />
          <Image src={host.image} alt={host.fullName} className="h-32 w-auto object-contain animate-pop" sizes="140px" />
          <h2 className="mt-5 text-[30px] font-bold text-ink-strong">Wunderbar!</h2>
          <p className="mt-2 text-[16px] font-medium text-ink">Spür mal nach: Wie fühlst du dich jetzt?</p>
          <div className="mt-6 w-full rounded-[24px] bg-white/80 p-4">
            <p className="text-[13px] font-semibold text-ink-soft">{host.name} sagt:</p>
            <p className="mt-1 text-[21px] font-bold text-ink-strong">„{host.affirmation}“</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center" aria-live="polite">
          <div className="aspect-square w-[min(300px,42cqh)]">
            <BreathVisual visual={breath.visual} phase={s.phase} duration={duration} cycle={s.cycle} />
          </div>
          <h2 key={`${s.phase}-${s.cycle}`} className="mt-4 text-[34px] font-bold text-ink-strong animate-fade-up">
            {LABEL[s.phase]}
          </h2>
          <p className="mt-1 min-h-[48px] max-w-[320px] text-[16px] font-medium leading-snug text-ink">
            {s.phase === "ready"
              ? breath.howTo.join(" ")
              : s.phase === "inhale"
                ? breath.cues.inhale
                : s.phase === "exhale"
                  ? breath.cues.exhale
                  : s.phase === "hold"
                    ? (breath.cues.hold ?? "Halte die Luft kurz an.")
                    : "Und noch einmal …"}
          </p>
          <span className="mt-3 text-[44px] font-bold tabular-nums text-ink">{s.remaining}</span>
          <div className="mt-2 flex gap-1.5" aria-label={`Atemzug ${Math.min(s.cycle + 1, breath.cycles)} von ${breath.cycles}`}>
            {Array.from({ length: breath.cycles }, (_, i) => (
              <span key={i} className={cn("size-2.5 rounded-full transition", i < s.cycle ? "bg-ink" : i === s.cycle && s.phase !== "ready" ? "bg-ink/50" : "bg-white")} />
            ))}
          </div>
        </div>
      )}

      <div className="px-6 pb-safe pt-3">
        {s.phase === "done" ? (
          <div className="flex gap-3 pb-2">
            <button
              type="button"
              onClick={() => dispatch({ type: "restart" })}
              className="flex h-14 flex-1 items-center justify-center gap-2 rounded-[22px] bg-white text-[16px] font-bold text-ink ring-1 ring-line active:scale-[0.98]"
            >
              <RotateCcw className="size-5" aria-hidden /> Nochmal
            </button>
            <button type="button" onClick={onClose} className="flex h-14 flex-1 items-center justify-center rounded-[22px] bg-ink text-[16px] font-bold text-white active:scale-[0.98]">
              Fertig
            </button>
          </div>
        ) : (
          <div className="flex justify-center pb-2">
            <button
              type="button"
              onClick={() => dispatch({ type: "toggle" })}
              aria-label={s.paused ? "Weiter" : "Pause"}
              className="grid size-[76px] place-items-center rounded-full bg-ink text-white shadow-xl shadow-ink/25 active:scale-95"
            >
              {s.paused ? <Play className="ml-1 size-8 fill-white" aria-hidden /> : <Pause className="size-8 fill-white" aria-hidden />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function BreathStart({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false);
  useLayoutEffect(() => () => setOpen(false), []);
  const breath = getBreath(slug);
  if (!breath) return null;
  return (
    <>
      <div className="sticky bottom-0 z-10 bg-gradient-to-t from-white via-white/95 to-white/0 px-5 pb-safe pt-6">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-14 w-full items-center justify-center gap-2.5 rounded-[22px] bg-ink text-[17px] font-bold text-white shadow-lg shadow-ink/25 transition active:scale-[0.98]"
        >
          <Wind className="size-5" aria-hidden /> Atemübung starten
        </button>
      </div>
      {open && <BreathPlayer breath={breath} onClose={() => setOpen(false)} />}
    </>
  );
}
