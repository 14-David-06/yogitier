"use client";

import { Pause, Play, SkipBack, SkipForward, Sparkles, Volume2, VolumeX, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useEffectEvent, useLayoutEffect, useRef, useState } from "react";

import { animalsById } from "@/content/animals";
import { getJourney, journeyMinutes, journeyThemes } from "@/content/journeys";
import type { Journey } from "@/content/types";
import { playBowl } from "@/lib/audio";
import { speak, speechSupported, stopSpeaking } from "@/lib/speech";
import { logActivity, updateSettings, useAppState } from "@/lib/store";

import { JourneyBackdrop } from "./journey-backdrop";

const PAUSE_AFTER_SPEECH = 2200;

export function JourneyPlayer({ journey, onClose }: { journey: Journey; onClose: () => void }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [done, setDone] = useState(false);
  const [run, setRun] = useState(0);
  const app = useAppState();
  const voice = app.settings.voice && speechSupported();
  const theme = journeyThemes[journey.theme];
  const host = animalsById[journey.host];
  const logged = useRef<number | null>(null);
  const total = journey.paragraphs.length;

  const advance = useEffectEvent(() => {
    if (index >= total - 1) {
      setDone(true);
      return;
    }
    setIndex(index + 1);
  });

  // Vorlesen bzw. Zeitsteuerung des aktuellen Absatzes
  useEffect(() => {
    if (paused || done) return;
    const text = journey.paragraphs[index];
    let timer: number | undefined;
    if (voice) {
      speak(text, {
        rate: 0.86,
        onEnd: (interrupted) => {
          if (interrupted) return;
          timer = window.setTimeout(() => advance(), PAUSE_AFTER_SPEECH);
        },
      });
    } else {
      const words = text.split(/\s+/).length;
      timer = window.setTimeout(() => advance(), words * 430 + 2600);
    }
    return () => {
      if (timer) window.clearTimeout(timer);
      stopSpeaking();
    };
  }, [index, paused, done, voice, run, journey.paragraphs]);

  const onStartOrEnd = useEffectEvent(() => {
    playBowl();
    if (done && logged.current !== run) {
      logged.current = run;
      logActivity({ type: "reise", refId: journey.slug, title: journey.title, seconds: journeyMinutes(journey) * 60 });
    }
  });

  useEffect(() => {
    onStartOrEnd();
  }, [done, run]);

  const close = useEffectEvent(() => onClose());
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        setPaused((p) => !p);
      } else if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      stopSpeaking();
    };
  }, []);

  const restart = () => {
    setIndex(0);
    setDone(false);
    setPaused(false);
    setRun((r) => r + 1);
  };

  return (
    <div role="dialog" aria-modal="true" aria-label={journey.title} className="fixed inset-0 z-40 flex flex-col" style={{ animation: "fade-in 300ms ease-out both" }}>
      <JourneyBackdrop theme={journey.theme} from={theme.from} to={theme.to} />

      <div className="relative px-4 pt-safe">
        <div className="flex h-14 items-center gap-3">
          <button type="button" onClick={onClose} aria-label="Reise beenden" className="grid size-11 shrink-0 place-items-center rounded-full bg-white/80 text-ink ring-1 ring-line active:scale-95">
            <X className="size-5" aria-hidden />
          </button>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/70" aria-hidden>
            <div className="h-full rounded-full transition-[width] duration-700" style={{ width: `${done ? 100 : (index / total) * 100}%`, background: theme.accent }} />
          </div>
          <button
            type="button"
            onClick={() => updateSettings({ voice: !app.settings.voice })}
            aria-label={app.settings.voice ? "Vorlesestimme ausschalten" : "Vorlesestimme einschalten"}
            aria-pressed={app.settings.voice}
            className="grid size-11 shrink-0 place-items-center rounded-full bg-white/80 text-ink ring-1 ring-line active:scale-95"
          >
            {app.settings.voice ? <Volume2 className="size-5" aria-hidden /> : <VolumeX className="size-5" aria-hidden />}
          </button>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center px-7 text-center" aria-live="polite">
        {done ? (
          <div className="flex flex-col items-center animate-fade-up">
            <Image src={host.image} alt={host.fullName} className="h-32 w-auto object-contain animate-float" sizes="140px" />
            <h2 className="mt-5 text-[30px] font-bold text-ink-strong">Willkommen zurück!</h2>
            <p className="mt-2 max-w-[300px] text-[16px] font-medium text-ink">Streck dich, gähn einmal laut – und nimm das schöne Gefühl mit in deinen Tag.</p>
            <p className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-white/80 px-4 py-2 text-[14px] font-bold text-ink">
              <Sparkles className="size-4 text-brand-orange" aria-hidden /> +1 Stern für deine Reise
            </p>
          </div>
        ) : (
          <>
            <Image src={host.image} alt="" className="h-20 w-auto object-contain opacity-90 animate-float" sizes="90px" />
            <p key={`${index}-${run}`} className="mt-8 max-w-[330px] text-[21px] font-semibold leading-relaxed text-ink-strong animate-fade-up">
              {journey.paragraphs[index]}
            </p>
            {!voice && <p className="mt-6 text-[12.5px] font-semibold text-ink-soft">Zum Vorlesen durch Mama, Papa oder die Vorlesestimme (oben rechts).</p>}
          </>
        )}
      </div>

      <div className="relative px-6 pb-safe pt-3">
        {done ? (
          <div className="flex gap-3 pb-2">
            <button type="button" onClick={restart} className="h-14 flex-1 rounded-[22px] bg-white text-[16px] font-bold text-ink ring-1 ring-line active:scale-[0.98]">
              Nochmal hören
            </button>
            <button type="button" onClick={onClose} className="h-14 flex-1 rounded-[22px] bg-ink text-[16px] font-bold text-white active:scale-[0.98]">
              Fertig
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-6 pb-2">
            <button
              type="button"
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={index === 0}
              aria-label="Vorheriger Absatz"
              className="grid size-14 place-items-center rounded-full bg-white/85 text-ink ring-1 ring-line active:scale-95 disabled:opacity-40"
            >
              <SkipBack className="size-6" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? "Weiter" : "Pause"}
              className="grid size-[76px] place-items-center rounded-full bg-ink text-white shadow-xl shadow-ink/25 active:scale-95"
            >
              {paused ? <Play className="ml-1 size-8 fill-white" aria-hidden /> : <Pause className="size-8 fill-white" aria-hidden />}
            </button>
            <button
              type="button"
              onClick={() => (index >= total - 1 ? setDone(true) : setIndex(index + 1))}
              aria-label="Nächster Absatz"
              className="grid size-14 place-items-center rounded-full bg-white/85 text-ink ring-1 ring-line active:scale-95"
            >
              <SkipForward className="size-6" aria-hidden />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function JourneyStart({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false);
  useLayoutEffect(() => () => setOpen(false), []);
  const journey = getJourney(slug);
  if (!journey) return null;
  return (
    <>
      <div className="sticky bottom-0 z-10 bg-gradient-to-t from-white via-white/95 to-white/0 px-5 pb-safe pt-6">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-14 w-full items-center justify-center gap-2.5 rounded-[22px] bg-ink text-[17px] font-bold text-white shadow-lg shadow-ink/25 transition active:scale-[0.98]"
        >
          <Play className="size-5 fill-white" aria-hidden /> Reise starten
        </button>
      </div>
      {open && <JourneyPlayer journey={journey} onClose={() => setOpen(false)} />}
    </>
  );
}
