"use client";

import { Pause, Play, RotateCcw, SkipBack, SkipForward, Star, Volume2, VolumeX, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useEffectEvent, useReducer, useRef } from "react";

import { PoseArtView } from "@/components/poses/pose-art";
import { Confetti } from "@/components/ui/confetti";
import { ProgressRing } from "@/components/ui/progress-ring";
import { SpeakButton } from "@/components/ui/speak-button";
import { TRANSITION_SECONDS } from "@/content/lessons";
import type { Animal, Pose } from "@/content/types";
import { playChime, playFanfare, playTick } from "@/lib/audio";
import { cn } from "@/lib/cn";
import { speak, stopSpeaking } from "@/lib/speech";
import { type ActivityType, logActivity, updateSettings, useAppState } from "@/lib/store";

export type PlayerStep = { pose: Pose; seconds: number; cue: string };

type Phase = "intro" | "pose" | "transition" | "done";
type State = { phase: Phase; index: number; remaining: number; paused: boolean; elapsed: number; run: number };
type Action = { type: "tick" } | { type: "toggle" } | { type: "next" } | { type: "prev" } | { type: "restart" };

const INTRO_SECONDS = 4;

const initial = (run = 0): State => ({ phase: "intro", index: 0, remaining: INTRO_SECONDS, paused: false, elapsed: 0, run });

function reduce(steps: PlayerStep[], s: State, a: Action): State {
  const last = steps.length - 1;
  const toPose = (index: number): State => ({ ...s, phase: "pose", index, remaining: steps[index].seconds, paused: false });
  switch (a.type) {
    case "restart":
      return initial(s.run + 1);
    case "toggle":
      return s.phase === "done" ? s : { ...s, paused: !s.paused };
    case "next":
      if (s.phase === "intro") return toPose(0);
      if (s.phase === "pose") return s.index >= last ? { ...s, phase: "done", remaining: 0 } : toPose(s.index + 1);
      if (s.phase === "transition") return toPose(s.index + 1);
      return s;
    case "prev":
      if (s.phase === "pose" || s.phase === "transition") return toPose(Math.max(0, s.phase === "pose" && s.remaining >= steps[s.index].seconds - 2 ? s.index - 1 : s.index));
      return s;
    case "tick": {
      if (s.paused || s.phase === "done") return s;
      const remaining = s.remaining - 1;
      const elapsed = s.phase === "intro" ? s.elapsed : s.elapsed + 1;
      if (remaining > 0) return { ...s, remaining, elapsed };
      if (s.phase === "intro") return toPose(0);
      if (s.phase === "pose") {
        if (s.index >= last) return { ...s, phase: "done", remaining: 0, elapsed };
        return { ...s, phase: "transition", remaining: TRANSITION_SECONDS, elapsed };
      }
      return { ...toPose(s.index + 1), elapsed };
    }
  }
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function LessonPlayer({
  title,
  host,
  color,
  steps,
  outro,
  activity,
  onClose,
  onComplete,
}: {
  title: string;
  host: Animal;
  color: string;
  steps: PlayerStep[];
  outro: string;
  activity: { type: ActivityType; refId: string; title: string };
  onClose: () => void;
  /** wird aufgerufen, sobald alle Übungen geschafft sind */
  onComplete?: () => void;
}) {
  const [state, dispatch] = useReducer((s: State, a: Action) => reduce(steps, s, a), undefined, () => initial());
  const app = useAppState();
  const voice = app.settings.voice;
  const name = app.profile.name;
  const logged = useRef<number | null>(null);

  const step = steps[state.index];
  const nextStep = steps[state.index + 1];

  // Sekundentakt
  useEffect(() => {
    if (state.paused || state.phase === "done") return;
    const id = window.setInterval(() => dispatch({ type: "tick" }), 1000);
    return () => window.clearInterval(id);
  }, [state.paused, state.phase]);

  // Ansagen & Klänge beim Wechsel der Phase
  const announce = useEffectEvent(() => {
    if (state.phase === "intro") {
      speak(name ? `Bist du bereit, ${name}? Los geht's!` : "Bist du bereit? Los geht's!");
    } else if (state.phase === "pose") {
      playChime();
      speak(`${step.pose.name}. ${step.cue}`);
    } else if (state.phase === "transition" && nextStep) {
      speak(`Super! Als Nächstes: ${nextStep.pose.name}.`);
    } else if (state.phase === "done") {
      playFanfare();
      speak(`Super gemacht${name ? `, ${name}` : ""}! ${outro}`);
      if (logged.current !== state.run) {
        logged.current = state.run;
        logActivity({ ...activity, seconds: Math.max(30, state.elapsed) });
        onComplete?.();
      }
    }
  });
  useEffect(() => {
    announce();
  }, [state.phase, state.index, state.run]);

  // leises Ticken in den letzten Sekunden
  useEffect(() => {
    if (state.phase === "pose" && !state.paused && state.remaining <= 3 && state.remaining > 0) playTick();
  }, [state.phase, state.remaining, state.paused]);

  // Pause stoppt die Stimme
  useEffect(() => {
    if (state.paused) stopSpeaking();
  }, [state.paused]);

  // Bildschirm wach halten & Tastatursteuerung
  const close = useEffectEvent(() => onClose());
  useEffect(() => {
    let lock: WakeLockSentinel | null = null;
    navigator.wakeLock
      ?.request("screen")
      .then((l) => {
        lock = l;
      })
      .catch(() => {});
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        dispatch({ type: "toggle" });
      } else if (e.key === "ArrowRight") dispatch({ type: "next" });
      else if (e.key === "ArrowLeft") dispatch({ type: "prev" });
      else if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lock?.release().catch(() => {});
      stopSpeaking();
    };
  }, []);

  const segmentFill = (i: number) => {
    if (state.phase === "done") return 1;
    if (i < state.index || (i === state.index && state.phase === "transition")) return 1;
    if (i === state.index && state.phase === "pose") return 1 - state.remaining / step.seconds;
    return 0;
  };

  const minutes = Math.max(1, Math.round(state.elapsed / 60));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-40 flex flex-col"
      style={{ background: `linear-gradient(180deg, ${color} 0%, #FFFFFF 78%)`, animation: "fade-in 220ms ease-out both" }}
    >
      <div className="px-4 pt-safe">
        <div className="flex h-14 items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            aria-label="Stunde beenden"
            className="grid size-11 shrink-0 place-items-center rounded-full bg-white/80 text-ink ring-1 ring-line active:scale-95"
          >
            <X className="size-5" aria-hidden />
          </button>
          <div className="flex flex-1 gap-1" aria-hidden>
            {steps.map((s, i) => (
              <span key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/80">
                <span className="block h-full rounded-full bg-ink transition-[width] duration-1000 ease-linear" style={{ width: `${segmentFill(i) * 100}%` }} />
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={() => updateSettings({ voice: !voice })}
            aria-label={voice ? "Vorlesestimme ausschalten" : "Vorlesestimme einschalten"}
            aria-pressed={voice}
            className="grid size-11 shrink-0 place-items-center rounded-full bg-white/80 text-ink ring-1 ring-line active:scale-95"
          >
            {voice ? <Volume2 className="size-5" aria-hidden /> : <VolumeX className="size-5" aria-hidden />}
          </button>
        </div>
      </div>

      <div className="no-scrollbar flex flex-1 flex-col items-center overflow-y-auto px-6 text-center" aria-live="polite">
        {state.phase === "intro" && (
          <div className="flex flex-1 flex-col items-center justify-center">
            <Image src={host.image} alt={host.fullName} className="h-40 w-auto animate-float object-contain" sizes="180px" />
            <p className="mt-6 text-[15px] font-bold uppercase tracking-wider text-ink-soft">{title}</p>
            <h2 className="mt-1 text-[28px] font-bold text-ink-strong">{name ? `Bereit, ${name}?` : "Bist du bereit?"}</h2>
            <span key={state.remaining} className="mt-6 grid size-24 place-items-center rounded-full bg-white text-[44px] font-bold text-ink shadow-lg shadow-ink/10 animate-pop">
              {state.remaining}
            </span>
          </div>
        )}

        {state.phase === "pose" && (
          <div key={`p${state.index}-${state.run}`} className="flex w-full flex-col items-center pt-2 animate-fade-up">
            <div className="relative grid aspect-square w-[min(300px,40cqh)] place-items-center">
              <ProgressRing value={1 - state.remaining / step.seconds} className="absolute inset-0 size-full" />
              <div className="grid size-[86%] place-items-center rounded-full" style={{ background: step.pose.color }}>
                <div className={cn("size-[82%]", !state.paused && "animate-[float_4s_ease-in-out_infinite]")}>
                  <PoseArtView pose={step.pose} sizes="260px" eager />
                </div>
              </div>
            </div>
            <p className="mt-4 text-[12.5px] font-bold uppercase tracking-wider text-ink-soft">
              Übung {state.index + 1} von {steps.length}
            </p>
            <h2 className="mt-0.5 text-[28px] font-bold leading-tight text-ink-strong">{step.pose.name}</h2>
            <p className="mt-2 max-w-[320px] text-[16px] font-medium leading-snug text-ink">{step.cue}</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="rounded-full bg-white px-3 py-1 text-[20px] font-bold tabular-nums text-ink ring-1 ring-line">{formatTime(state.remaining)}</span>
              {step.pose.sound && <span className="rounded-full bg-white px-3 py-1.5 text-[13px] font-bold text-ink ring-1 ring-line">„{step.pose.sound}“</span>}
            </div>
          </div>
        )}

        {state.phase === "transition" && nextStep && (
          <div key={`t${state.index}`} className="flex flex-1 flex-col items-center justify-center animate-fade-up">
            <p className="text-[15px] font-bold text-ink-soft">Super! Atme einmal tief durch.</p>
            <p className="mt-6 text-[12.5px] font-bold uppercase tracking-wider text-ink-soft">Als Nächstes</p>
            <div className="mt-2 grid size-48 place-items-center rounded-full" style={{ background: nextStep.pose.color }}>
              <div className="size-36">
                <PoseArtView pose={nextStep.pose} sizes="150px" />
              </div>
            </div>
            <h2 className="mt-4 text-[26px] font-bold text-ink-strong">{nextStep.pose.name}</h2>
            <span key={state.remaining} className="mt-4 text-[40px] font-bold tabular-nums text-ink animate-pop">
              {state.remaining}
            </span>
          </div>
        )}

        {state.phase === "done" && (
          <div className="relative flex flex-1 flex-col items-center justify-center pb-6">
            <Confetti seed={state.run + 1} />
            <Image src={host.image} alt={host.fullName} className="h-36 w-auto object-contain animate-pop" sizes="160px" />
            <h2 className="mt-5 text-[30px] font-bold leading-tight text-ink-strong">Super gemacht{name ? `, ${name}` : ""}!</h2>
            <p className="mt-2 text-[16px] font-medium text-ink">
              Du hast {minutes} {minutes === 1 ? "Minute" : "Minuten"} Yoga gemacht.
            </p>
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-memo px-3.5 py-1.5 text-[14px] font-bold text-ink">
              <Star className="size-4 fill-brand-yellow text-brand-orange" aria-hidden /> +1 Stern
            </span>
            <div className="mt-6 w-full rounded-[24px] p-4" style={{ background: host.soft }}>
              <p className="text-[13px] font-semibold text-ink-soft">{host.name} sagt:</p>
              <p className="mt-1 text-[21px] font-bold text-ink-strong">„{host.affirmation}“</p>
              <SpeakButton text={`${host.affirmation} Sag es laut mit!`} label="Anhören" className="mt-3" />
            </div>
          </div>
        )}
      </div>

      <div className="px-6 pb-safe pt-3">
        {state.phase === "done" ? (
          <div className="flex gap-3 pb-2">
            <button
              type="button"
              onClick={() => dispatch({ type: "restart" })}
              className="flex h-14 flex-1 items-center justify-center gap-2 rounded-[22px] bg-white text-[16px] font-bold text-ink ring-1 ring-line active:scale-[0.98]"
            >
              <RotateCcw className="size-5" aria-hidden /> Nochmal
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-14 flex-1 items-center justify-center rounded-[22px] bg-ink text-[16px] font-bold text-white shadow-lg shadow-ink/20 active:scale-[0.98]"
            >
              Fertig
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-6 pb-2">
            <button
              type="button"
              onClick={() => dispatch({ type: "prev" })}
              disabled={state.phase === "intro"}
              aria-label="Vorherige Übung"
              className="grid size-14 place-items-center rounded-full bg-white text-ink ring-1 ring-line transition active:scale-95 disabled:opacity-40"
            >
              <SkipBack className="size-6" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => dispatch({ type: "toggle" })}
              aria-label={state.paused ? "Weiter" : "Pause"}
              className="grid size-[76px] place-items-center rounded-full bg-ink text-white shadow-xl shadow-ink/25 transition active:scale-95"
            >
              {state.paused ? <Play className="ml-1 size-8 fill-white" aria-hidden /> : <Pause className="size-8 fill-white" aria-hidden />}
            </button>
            <button
              type="button"
              onClick={() => dispatch({ type: "next" })}
              aria-label="Nächste Übung"
              className="grid size-14 place-items-center rounded-full bg-white text-ink ring-1 ring-line transition active:scale-95"
            >
              <SkipForward className="size-6" aria-hidden />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
