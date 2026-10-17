"use client";

import { ArrowRight, Check, Pause, Play, SkipForward, Volume2, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useEffectEvent, useState, type ReactNode } from "react";

import { Confetti } from "@/components/ui/confetti";
import { ProgressRing } from "@/components/ui/progress-ring";
import { animalsById } from "@/content/animals";
import { worldThemes } from "@/content/worlds";
import { playChime, playPop, playSoftNo, playSuccess, playTick } from "@/lib/audio";
import { cn } from "@/lib/cn";
import { speak, stopSpeaking } from "@/lib/speech";
import { useMediaUrl, useStudio } from "@/lib/studio/store";
import type { InfoStep, MissionStep, QuizStep, TimerStep, VideoStep, World } from "@/lib/studio/types";
import { setMissionCount, useAppState } from "@/lib/store";

import { InteractiveVideo, embedUrl } from "./interactive-video";

/** Rahmen für einen Schritt: Kopfzeile, Inhalt, Fußbereich */
export function StepShell({
  world,
  index,
  total,
  title,
  onClose,
  children,
  footer,
}: {
  world: World;
  index: number;
  total: number;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const t = worldThemes[world.theme];
  const top = t.dark ? "#E7E2F8" : t.from;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-40 flex flex-col"
      style={{ background: `linear-gradient(180deg, ${top} 0%, #FFFFFF 70%)`, animation: "fade-in 220ms ease-out both" }}
    >
      <div className="px-4 pt-safe">
        <div className="flex h-14 items-center gap-3">
          <button type="button" onClick={onClose} aria-label="Schließen" className="grid size-11 shrink-0 place-items-center rounded-full bg-white/85 text-ink ring-1 ring-line active:scale-95">
            <X className="size-5" aria-hidden />
          </button>
          <div className="min-w-0 flex-1 text-center">
            <p className="text-[11.5px] font-bold uppercase tracking-wider text-ink-soft">
              Station {index + 1} von {total}
            </p>
            <p className="truncate text-[15px] font-bold text-ink">{title}</p>
          </div>
          <span className="size-11 shrink-0" />
        </div>
      </div>
      <div className="no-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-3">{children}</div>
      {footer && <div className="px-5 pb-safe pt-2">{footer}</div>}
    </div>
  );
}

function PrimaryButton({ onClick, children, accent }: { onClick: () => void; children: ReactNode; accent?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-2 flex h-14 w-full items-center justify-center gap-2 rounded-[22px] bg-ink text-[17px] font-bold text-white shadow-lg shadow-ink/20 transition active:scale-[0.98]"
      style={accent ? { background: accent } : undefined}
    >
      {children}
    </button>
  );
}

function Bubble({ world, text }: { world: World; text: string }) {
  const guide = animalsById[world.guide];
  return (
    <div className="flex items-end gap-3">
      <Image src={guide.image} alt={guide.fullName} className="h-20 w-20 shrink-0 object-contain animate-float" sizes="80px" />
      <div className="relative mb-3 flex-1 rounded-[22px] rounded-bl-[6px] bg-white p-3.5 shadow-sm ring-1 ring-line">
        <p className="text-[15.5px] font-semibold leading-snug text-ink-strong">{text}</p>
        <button
          type="button"
          onClick={() => speak(text, { force: true })}
          aria-label="Vorlesen"
          className="absolute -right-2 -top-3 grid size-9 place-items-center rounded-full bg-ink text-white shadow-md active:scale-95"
        >
          <Volume2 className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ Info

export function InfoView({ world, step, onDone, shell }: { world: World; step: InfoStep; onDone: () => void; shell: (c: ReactNode, f?: ReactNode) => ReactNode }) {
  const image = useMediaUrl(step.imageMediaId);
  const read = useEffectEvent(() => speak(`${step.title}. ${step.text}`));
  useEffect(() => {
    read();
    return () => stopSpeaking();
  }, []);
  return shell(
    <div className="flex flex-1 flex-col justify-center gap-5 py-4">
      {image && (
        // eslint-disable-next-line @next/next/no-img-element -- lokales Bild aus dem Studio
        <img src={image} alt="" className="max-h-[38cqh] w-full rounded-[24px] object-cover shadow-md" />
      )}
      <h2 className="text-[27px] font-bold leading-tight text-ink-strong">{step.title}</h2>
      <Bubble world={world} text={step.text} />
    </div>,
    <PrimaryButton onClick={onDone} accent={world.accent}>
      Verstanden <ArrowRight className="size-5" aria-hidden />
    </PrimaryButton>,
  );
}

// ------------------------------------------------------------------ Video

export function VideoView({ world, step, onDone, shell }: { world: World; step: VideoStep; onDone: () => void; shell: (c: ReactNode, f?: ReactNode) => ReactNode }) {
  const studio = useStudio();
  const [ended, setEnded] = useState(false);
  const uploadUrl = useMediaUrl(step.source?.kind === "upload" ? step.source.mediaId : null);
  const src = step.source?.kind === "upload" ? uploadUrl : step.source?.kind === "url" ? step.source.url : null;
  const poster =
    step.source?.kind === "upload"
      ? (studio.media.find((m) => m.id === (step.source as { mediaId: string }).mediaId)?.thumb ?? null)
      : step.source?.kind === "url"
        ? (step.source.poster ?? null)
        : null;
  const embed = step.source?.kind === "url" ? embedUrl(step.source.url) : null;

  return shell(
    <div className="flex min-h-0 flex-1 flex-col gap-3 pt-1">
      {step.instruction && <p className="text-center text-[15px] font-semibold leading-snug text-ink">{step.instruction}</p>}
      <div className="min-h-[320px] flex-1">
        {!step.source ? (
          <div className="grid h-full place-items-center rounded-[26px] bg-cream p-6 text-center text-[14px] font-semibold text-ink-soft">
            Für diese Station wurde noch kein Video hinterlegt.
          </div>
        ) : embed ? (
          <iframe
            src={embed}
            title={step.title}
            className="h-full min-h-[320px] w-full rounded-[26px] bg-black"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : src ? (
          <InteractiveVideo src={src} poster={poster} stops={step.stops} accent={world.accent} onEnded={() => setEnded(true)} />
        ) : (
          <div className="h-full animate-pulse rounded-[26px] bg-cream" aria-label="Video wird geladen" />
        )}
      </div>
      {embed && <p className="text-center text-[11.5px] font-medium text-ink-soft">Eingebettetes Video (erweiterter Datenschutzmodus)</p>}
    </div>,
    ended || embed || !step.source ? (
      <PrimaryButton onClick={onDone} accent={world.accent}>
        <Check className="size-5" aria-hidden /> {embed ? "Video angeschaut" : "Super – weiter"}
      </PrimaryButton>
    ) : (
      <p className="pb-4 text-center text-[13px] font-semibold text-ink-soft">Schau das Video bis zum Ende – dann geht es weiter.</p>
    ),
  );
}

// ------------------------------------------------------------------ Quiz

export function QuizView({ world, step, onDone, shell }: { world: World; step: QuizStep; onDone: () => void; shell: (c: ReactNode, f?: ReactNode) => ReactNode }) {
  const [wrong, setWrong] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const read = useEffectEvent(() => speak(`${step.question} ${step.options.map((o) => o.text).join("? ")}?`));
  useEffect(() => {
    read();
    return () => stopSpeaking();
  }, []);

  const choose = (id: string) => {
    if (solved) return;
    if (id === step.correct) {
      setSolved(true);
      playSuccess();
      speak(`Richtig! ${step.explanation}`);
    } else if (!wrong.includes(id)) {
      setWrong([...wrong, id]);
      playSoftNo();
      speak("Hmm, fast! Versuch es noch einmal.");
    }
  };

  return shell(
    <div className="relative flex flex-1 flex-col gap-4 py-3">
      {solved && <Confetti seed={step.id.length + 11} count={50} />}
      <Bubble world={world} text={step.question} />
      <div className="grid gap-2.5">
        {step.options.map((o) => {
          const isWrong = wrong.includes(o.id);
          const isRight = solved && o.id === step.correct;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => choose(o.id)}
              disabled={solved && !isRight}
              className={cn(
                "flex min-h-16 items-center gap-3 rounded-[22px] px-4 py-3 text-left text-[17px] font-bold text-ink ring-2 transition active:scale-[0.98]",
                isRight ? "bg-[#DCEBD0] ring-[#6E9A63]" : isWrong ? "bg-[#FDECE7] text-ink-soft ring-[#F3B8A6]" : "bg-white ring-line",
                solved && !isRight && "opacity-50",
              )}
              style={isWrong ? { animation: "card-shake 320ms ease-in-out" } : undefined}
            >
              <span className="text-[30px] leading-none" aria-hidden>
                {o.emoji}
              </span>
              <span className="flex-1">{o.text}</span>
              {isRight && <Check className="size-6 text-[#4A6B3A]" strokeWidth={3} aria-hidden />}
              {isWrong && <X className="size-5 text-[#C0583A]" strokeWidth={3} aria-hidden />}
            </button>
          );
        })}
      </div>
      {solved && (
        <div className="rounded-[22px] bg-white p-4 shadow-sm ring-1 ring-line animate-fade-up">
          <p className="text-[14px] font-bold text-[#4A6B3A]">Richtig!</p>
          <p className="mt-1 text-[15px] font-medium leading-snug text-ink">{step.explanation}</p>
        </div>
      )}
    </div>,
    solved ? (
      <PrimaryButton onClick={onDone} accent={world.accent}>
        Weiter <ArrowRight className="size-5" aria-hidden />
      </PrimaryButton>
    ) : undefined,
  );
}

// ------------------------------------------------------------------ Mitmach-Timer

export function TimerView({ world, step, onDone, shell }: { world: World; step: TimerStep; onDone: () => void; shell: (c: ReactNode, f?: ReactNode) => ReactNode }) {
  const [phase, setPhase] = useState<"intro" | "run" | "done">("intro");
  const [seg, setSeg] = useState(0);
  const [remaining, setRemaining] = useState(step.segments[0]?.seconds ?? 0);
  const [paused, setPaused] = useState(false);
  const current = step.segments[seg];

  const announce = useEffectEvent(() => {
    if (phase === "intro") speak(step.intro);
    else if (phase === "run" && current) {
      playChime();
      speak(current.label);
    } else if (phase === "done") {
      playSuccess();
      speak("Geschafft! Das hast du toll gemacht.");
    }
  });
  useEffect(() => {
    announce();
  }, [phase, seg]);
  useEffect(() => () => stopSpeaking(), []);

  const goNext = () => {
    if (seg >= step.segments.length - 1) {
      setPhase("done");
      return;
    }
    setSeg(seg + 1);
    setRemaining(step.segments[seg + 1].seconds);
  };
  const next = useEffectEvent(() => goNext());

  useEffect(() => {
    if (phase !== "run" || paused) return;
    const id = window.setTimeout(() => {
      const n = remaining - 1;
      if (n <= 0) {
        next();
        return;
      }
      if (n <= 3) playTick();
      setRemaining(n);
    }, 1000);
    return () => window.clearTimeout(id);
  }, [phase, paused, remaining]);

  const totalSec = step.segments.reduce((a, s) => a + s.seconds, 0);
  const doneSec = step.segments.slice(0, seg).reduce((a, s) => a + s.seconds, 0) + (current ? current.seconds - remaining : 0);

  if (phase === "intro") {
    return shell(
      <div className="flex flex-1 flex-col justify-center gap-5 py-4">
        <h2 className="text-[27px] font-bold leading-tight text-ink-strong">{step.title}</h2>
        <Bubble world={world} text={step.intro} />
        <ol className="grid gap-2">
          {step.segments.map((s, i) => (
            <li key={s.id} className="flex items-center gap-3 rounded-[18px] bg-white px-4 py-3 ring-1 ring-line">
              <span className="grid size-8 place-items-center rounded-full text-[14px] font-bold text-white" style={{ background: world.accent }}>
                {i + 1}
              </span>
              <span className="flex-1 text-[15px] font-bold text-ink">{s.label}</span>
              <span className="text-[13px] font-bold text-ink-soft">{s.seconds} Sek.</span>
            </li>
          ))}
        </ol>
      </div>,
      <PrimaryButton
        onClick={() => {
          setSeg(0);
          setRemaining(step.segments[0]?.seconds ?? 0);
          setPhase("run");
        }}
        accent={world.accent}
      >
        <Play className="size-5 fill-white" aria-hidden /> Los geht&apos;s
      </PrimaryButton>,
    );
  }

  if (phase === "done") {
    return shell(
      <div className="relative flex flex-1 flex-col items-center justify-center text-center">
        <Confetti seed={seg + 21} count={50} />
        <span className="grid size-24 place-items-center rounded-full text-white animate-pop" style={{ background: world.accent }}>
          <Check className="size-12" strokeWidth={3} aria-hidden />
        </span>
        <h2 className="mt-5 text-[28px] font-bold text-ink-strong">Geschafft!</h2>
        <p className="mt-1 text-[15px] font-medium text-ink">Du hast alle {step.segments.length} Abschnitte geschafft.</p>
      </div>,
      <PrimaryButton onClick={onDone} accent={world.accent}>
        Weiter <ArrowRight className="size-5" aria-hidden />
      </PrimaryButton>,
    );
  }

  return shell(
    <div className="flex flex-1 flex-col items-center justify-center text-center" aria-live="polite">
      <p className="text-[12.5px] font-bold uppercase tracking-wider text-ink-soft">
        Abschnitt {seg + 1} von {step.segments.length}
      </p>
      <h2 key={seg} className="mt-1 text-[30px] font-bold leading-tight text-ink-strong animate-fade-up">
        {current?.label}
      </h2>
      <div className="relative mt-6 grid aspect-square w-[min(240px,34cqh)] place-items-center">
        <ProgressRing value={current ? 1 - remaining / current.seconds : 1} className="absolute inset-0 size-full" color={world.accent} />
        <span className="text-[56px] font-bold tabular-nums text-ink">{remaining}</span>
      </div>
      <div className="mt-6 h-2 w-full max-w-[280px] overflow-hidden rounded-full bg-cream" aria-hidden>
        <div className="h-full rounded-full transition-[width] duration-1000 ease-linear" style={{ width: `${(doneSec / Math.max(1, totalSec)) * 100}%`, background: world.accent }} />
      </div>
    </div>,
    <div className="flex items-center justify-center gap-5 pb-2">
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-label={paused ? "Weiter" : "Pause"}
        className="grid size-[72px] place-items-center rounded-full text-white shadow-xl active:scale-95"
        style={{ background: world.accent }}
      >
        {paused ? <Play className="ml-1 size-8 fill-white" aria-hidden /> : <Pause className="size-8 fill-white" aria-hidden />}
      </button>
      <button type="button" onClick={goNext} aria-label="Nächster Abschnitt" className="grid size-14 place-items-center rounded-full bg-white text-ink ring-1 ring-line active:scale-95">
        <SkipForward className="size-6" aria-hidden />
      </button>
    </div>,
  );
}

// ------------------------------------------------------------------ Mission

export function MissionView({
  world,
  step,
  onDone,
  onLater,
  shell,
}: {
  world: World;
  step: MissionStep;
  onDone: () => void;
  onLater: () => void;
  shell: (c: ReactNode, f?: ReactNode) => ReactNode;
}) {
  const { worldProgress } = useAppState();
  const count = Math.min(step.count, worldProgress[world.id]?.missions[step.id] ?? 0);
  const complete = count >= step.count;
  const read = useEffectEvent(() => speak(`${step.title}. ${step.text}`));
  useEffect(() => {
    read();
    return () => stopSpeaking();
  }, []);

  const tap = (i: number) => {
    const n = i < count ? i : i + 1;
    playPop();
    setMissionCount(world.id, step.id, n);
    if (n >= step.count) {
      playSuccess();
      speak("Mission erfüllt! Super gemacht!");
    }
  };

  return shell(
    <div className="relative flex flex-1 flex-col justify-center gap-5 py-4">
      {complete && <Confetti seed={step.count + 31} count={50} />}
      <h2 className="text-[27px] font-bold leading-tight text-ink-strong">{step.title}</h2>
      <Bubble world={world} text={step.text} />
      <div className="rounded-[26px] bg-white p-4 ring-1 ring-line">
        <p className="text-center text-[13px] font-bold text-ink-soft">
          {count} von {step.count} geschafft
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-3">
          {Array.from({ length: step.count }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => tap(i)}
              aria-pressed={i < count}
              aria-label={`${i + 1}. ${i < count ? "erledigt" : "offen"}`}
              className={cn(
                "grid size-16 place-items-center rounded-full text-[30px] transition active:scale-90",
                i < count ? "scale-105 shadow-md" : "bg-cream opacity-50 grayscale",
              )}
              style={i < count ? { background: `${world.accent}33` } : undefined}
            >
              <span aria-hidden>{step.unit}</span>
            </button>
          ))}
        </div>
      </div>
    </div>,
    complete ? (
      <PrimaryButton onClick={onDone} accent={world.accent}>
        <Check className="size-5" aria-hidden /> Mission erfüllt!
      </PrimaryButton>
    ) : (
      <PrimaryButton onClick={onLater}>Ich mache später weiter</PrimaryButton>
    ),
  );
}
