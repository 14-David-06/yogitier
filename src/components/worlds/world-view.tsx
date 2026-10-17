"use client";

import {
  BookOpen,
  Check,
  ChevronLeft,
  CircleHelp,
  Clapperboard,
  Lock,
  PersonStanding,
  RotateCcw,
  Target,
  Timer,
  Volume2,
  VolumeX,
  Wind,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";

import { AppLink } from "@/components/ui/app-link";
import { Confetti } from "@/components/ui/confetti";
import { animalsById } from "@/content/animals";
import { categoryLabels, worldThemes } from "@/content/worlds";
import { startAmbient, stopAmbient } from "@/lib/ambient";
import { playFanfare } from "@/lib/audio";
import { cn } from "@/lib/cn";
import { speak } from "@/lib/speech";
import { useStudio, worldMinutes } from "@/lib/studio/store";
import type { StepType, World } from "@/lib/studio/types";
import { completeWorld, getAppState, markStepDone, resetWorldProgress, useAppState, useHydrated } from "@/lib/store";

import { StepRunner } from "./step-runner";
import { WorldScene } from "./world-scene";

const STEP_ICON: Record<StepType, LucideIcon> = {
  info: BookOpen,
  video: Clapperboard,
  uebung: PersonStanding,
  atmung: Wind,
  timer: Timer,
  quiz: CircleHelp,
  aufgabe: Target,
};

const X_PATTERN = [50, 74, 50, 26];
const ROW = 128;

const noop = () => () => {};
function usePreview() {
  return useSyncExternalStore(
    noop,
    () => window.location.search.includes("vorschau") || window.self !== window.top,
    () => false,
  );
}

export function WorldView({ id }: { id: string }) {
  const hydrated = useHydrated();
  const studio = useStudio();
  const app = useAppState();
  const preview = usePreview();
  const [active, setActive] = useState<string | null>(null);
  const [celebrate, setCelebrate] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const world = studio.worlds.find((w) => w.id === id);

  // Hintergrundklang der Umgebung (pausiert während einer Station)
  const ambient = world?.ambient ?? "aus";
  const wantSound = hydrated && soundOn && app.settings.sound && !active && !celebrate;
  useEffect(() => {
    if (!wantSound) {
      stopAmbient();
      return;
    }
    startAmbient(ambient);
    return () => stopAmbient();
  }, [wantSound, ambient]);

  if (!hydrated || !studio.ready) {
    return <div className="h-full animate-pulse bg-cream" aria-busy="true" />;
  }

  if (!world || (world.status !== "veroeffentlicht" && !preview)) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center px-8 pt-safe text-center">
        <Image src={animalsById.freddi.image} alt="" className="h-28 w-auto object-contain" sizes="120px" />
        <h1 className="mt-5 text-[24px] font-bold text-ink-strong">{world ? "Noch nicht veröffentlicht" : "Lernwelt nicht gefunden"}</h1>
        <p className="mt-2 text-[15px] font-medium text-ink-soft">
          {world ? "Diese Lernwelt wird gerade im Studio vorbereitet." : "Vielleicht wurde sie im Studio gelöscht."}
        </p>
        <AppLink href="/welten" direction="back" className="mt-6 rounded-full bg-ink px-5 py-3 text-[15px] font-bold text-white">
          Zu den Lernwelten
        </AppLink>
      </div>
    );
  }

  const t = worldThemes[world.theme];
  const guide = animalsById[world.guide];
  const progress = app.worldProgress[world.id];
  const done = new Set(progress?.done ?? []);
  const doneCount = world.steps.filter((s) => done.has(s.id)).length;
  const allDone = world.steps.length > 0 && doneCount >= world.steps.length;
  const nextIndex = world.steps.findIndex((s) => !done.has(s.id));
  const activeStep = world.steps.find((s) => s.id === active);
  const textColor = t.dark ? "text-white" : "text-ink-strong";
  const height = world.steps.length * ROW + 40;

  const closeStep = () => {
    setActive(null);
    const latest = getAppState().worldProgress[world.id];
    const finished = world.steps.every((s) => latest?.done.includes(s.id));
    if (finished && !latest?.completedAt) {
      completeWorld(world, worldMinutes(world) * 60);
      setCelebrate(true);
      playFanfare();
      speak(`Geschafft! Du hast den Sticker ${world.reward.name} gewonnen!`);
    }
  };

  const points = world.steps.map((_, i) => ({ x: X_PATTERN[i % X_PATTERN.length], y: i * ROW + 50 }));
  const pathD = points.reduce((d, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    return `${d} C ${prev.x} ${prev.y + ROW / 2}, ${p.x} ${p.y - ROW / 2}, ${p.x} ${p.y}`;
  }, "");

  return (
    <div className="relative min-h-full">
      <WorldScene theme={world.theme} className="fixed inset-0" />

      <div className="relative z-10 pb-12">
        {/* Kopfzeile */}
        <header className="sticky top-0 z-20 pt-safe">
          <div className="flex h-14 items-center gap-2 px-3">
            <AppLink href="/welten" direction="back" aria-label="Zurück zu den Lernwelten" className="grid size-11 place-items-center rounded-full bg-white/85 text-ink shadow-sm active:scale-95">
              <ChevronLeft className="size-6" aria-hidden />
            </AppLink>
            <p className={cn("min-w-0 flex-1 truncate text-center text-[15px] font-bold drop-shadow-sm", t.dark ? "text-white" : "text-ink")}>{categoryLabels[world.category]}</p>
            {world.ambient !== "aus" ? (
              <button
                type="button"
                onClick={() => setSoundOn((s) => !s)}
                aria-label={soundOn ? "Hintergrundklang aus" : "Hintergrundklang an"}
                aria-pressed={soundOn}
                className="grid size-11 place-items-center rounded-full bg-white/85 text-ink shadow-sm active:scale-95"
              >
                {soundOn && app.settings.sound ? <Volume2 className="size-5" aria-hidden /> : <VolumeX className="size-5" aria-hidden />}
              </button>
            ) : (
              <span className="size-11" />
            )}
          </div>
          {preview && (
            <p className="mx-auto w-fit rounded-full bg-lilac px-3 py-1 text-[11.5px] font-bold text-lilac-ink">
              Vorschau{world.status !== "veroeffentlicht" ? " · Entwurf" : ""}
            </p>
          )}
        </header>

        {/* Begrüßung */}
        <div className="px-5 pt-2">
          <h1 className={cn("text-[28px] font-bold leading-tight drop-shadow-sm", textColor)}>{world.title}</h1>
          <p className={cn("mt-1 text-[14px] font-semibold", t.dark ? "text-white/80" : "text-ink")}>{world.subtitle}</p>
          <div className="mt-4 flex items-end gap-3" data-tour="welt-begleiter">
            <Image src={guide.image} alt={guide.fullName} className="h-24 w-24 shrink-0 object-contain animate-float drop-shadow-md" sizes="96px" loading="eager" />
            <button
              type="button"
              onClick={() => speak(world.greeting, { force: true })}
              className="relative mb-4 flex-1 rounded-[22px] rounded-bl-[6px] bg-white/95 p-3.5 text-left shadow-md active:scale-[0.99]"
            >
              <span className="block text-[14.5px] font-semibold leading-snug text-ink-strong">{world.greeting}</span>
              <span className="mt-1.5 inline-flex items-center gap-1 text-[12px] font-bold text-ink-soft">
                <Volume2 className="size-3.5" aria-hidden /> Antippen zum Anhören
              </span>
            </button>
          </div>
          <div className="rounded-[20px] bg-white/90 p-3 shadow-sm" data-tour="welt-fortschritt">
            <div className="flex items-center justify-between text-[13px] font-bold text-ink">
              <span>
                {doneCount} von {world.steps.length} Stationen
              </span>
              <span className="text-ink-soft">
                {world.age} · ca. {worldMinutes(world)} Min.
              </span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-cream" aria-hidden>
              <div className="h-full rounded-full transition-[width] duration-700" style={{ width: `${(doneCount / Math.max(1, world.steps.length)) * 100}%`, background: world.accent }} />
            </div>
          </div>
        </div>

        {/* Lernpfad */}
        <div className="relative mx-5 mt-6" style={{ height }}>
          <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden>
            <path d={pathD} fill="none" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" vectorEffect="non-scaling-stroke" opacity="0.75" />
            <path d={pathD} fill="none" stroke={t.path} strokeWidth="4" strokeDasharray="2 12" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>
          <ol>
            {world.steps.map((s, i) => {
              const Icon = STEP_ICON[s.type];
              const isDone = done.has(s.id);
              const isNext = i === nextIndex;
              const p = points[i];
              return (
                <li key={s.id} className="absolute -translate-x-1/2 -translate-y-[38px]" style={{ left: `${p.x}%`, top: p.y }}>
                  <button
                    type="button"
                    onClick={() => setActive(s.id)}
                    data-tour={isNext ? "welt-station" : undefined}
                    aria-label={`Station ${i + 1}: ${s.title}${isDone ? " (geschafft)" : ""}`}
                    className="group flex w-[150px] flex-col items-center"
                  >
                    <span
                      className={cn(
                        "relative grid size-[76px] place-items-center rounded-full shadow-[0_6px_0_rgb(0_0_0/0.12)] transition group-active:translate-y-1 group-active:shadow-none",
                        isDone ? "text-white" : "bg-white text-ink",
                      )}
                      style={{
                        background: isDone ? world.accent : undefined,
                        boxShadow: isNext ? `0 0 0 5px ${world.accent}, 0 6px 0 rgb(0 0 0 / 0.12)` : undefined,
                        animation: isNext ? "node-pulse 2s ease-in-out infinite" : undefined,
                      }}
                    >
                      {isDone ? <Check className="size-8" strokeWidth={3} aria-hidden /> : <Icon className="size-8" strokeWidth={1.8} aria-hidden />}
                      <span className="absolute -right-1 -top-1 grid size-7 place-items-center rounded-full bg-ink text-[12px] font-bold text-white ring-2 ring-white">{i + 1}</span>
                    </span>
                    <span className="mt-2 line-clamp-2 rounded-full bg-white/90 px-3 py-1 text-center text-[12.5px] font-bold leading-tight text-ink shadow-sm">{s.title}</span>
                    {isNext && (
                      <span className="mt-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white" style={{ background: world.accent }}>
                        {doneCount === 0 ? "Start" : "Weiter"}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Belohnung */}
        <div className="mx-5 mt-2 flex flex-col items-center rounded-[26px] bg-white/92 p-5 text-center shadow-md">
          <span className={cn("grid size-24 place-items-center rounded-full text-[48px]", !allDone && "bg-cream grayscale")} style={allDone ? { background: `${world.accent}26` } : undefined}>
            <span aria-hidden>{world.reward.emoji}</span>
          </span>
          <p className="mt-3 text-[13px] font-bold uppercase tracking-wider text-ink-soft">{allDone ? "Gewonnen!" : "Deine Belohnung"}</p>
          <p className="text-[19px] font-bold text-ink-strong">Sticker „{world.reward.name}“</p>
          {!allDone ? (
            <p className="mt-1 flex items-center gap-1 text-[13px] font-semibold text-ink-soft">
              <Lock className="size-3.5" aria-hidden /> Schaff alle Stationen, um ihn zu sammeln.
            </p>
          ) : (
            <button
              type="button"
              onClick={() => resetWorldProgress(world.id)}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-cream px-4 py-2 text-[13px] font-bold text-ink"
            >
              <RotateCcw className="size-4" aria-hidden /> Nochmal spielen
            </button>
          )}
        </div>
      </div>

      {activeStep && <StepRunner world={world} step={activeStep} onDone={() => markStepDone(world.id, activeStep.id)} onClose={closeStep} />}

      {celebrate && <Celebration world={world} onClose={() => setCelebrate(false)} />}
    </div>
  );
}

function Celebration({ world, onClose }: { world: World; onClose: () => void }) {
  return (
    <div role="dialog" aria-modal="true" aria-label="Lernwelt geschafft" className="fixed inset-0 z-50 flex items-center justify-center bg-[#2b1d14]/45 p-6" style={{ animation: "fade-in 200ms ease-out both" }}>
      <Confetti seed={world.id.length + 5} count={80} />
      <div className="relative w-full rounded-[30px] bg-white p-6 text-center shadow-2xl animate-pop">
        <span className="mx-auto grid size-28 place-items-center rounded-full text-[60px]" style={{ background: `${world.accent}26`, boxShadow: `0 0 0 8px ${world.accent}40` }}>
          <span aria-hidden>{world.reward.emoji}</span>
        </span>
        <h2 className="mt-4 text-[28px] font-bold text-ink-strong">Geschafft!</h2>
        <p className="mt-1 text-[15px] font-medium text-ink">
          Du hast alle Stationen von „{world.title}“ gemeistert und den Sticker <b>„{world.reward.name}“</b> gewonnen.
        </p>
        <p className="mt-3 inline-flex rounded-full bg-memo px-3.5 py-1.5 text-[14px] font-bold text-ink">⭐ +3 Sterne</p>
        <div className="mt-5 grid gap-2">
          <AppLink href="/welten#sticker" className="flex h-12 items-center justify-center rounded-[18px] bg-ink text-[15px] font-bold text-white">
            Zu meinen Stickern
          </AppLink>
          <button type="button" onClick={onClose} className="h-12 rounded-[18px] bg-cream text-[15px] font-bold text-ink">
            Weiter
          </button>
        </div>
      </div>
    </div>
  );
}
