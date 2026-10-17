"use client";

import { ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import { useState, useSyncExternalStore } from "react";

import logo from "@/assets/brand/logo.png";
import { animals, animalsById } from "@/content/animals";
import type { AnimalId } from "@/content/types";
import { playSuccess } from "@/lib/audio";
import { cn } from "@/lib/cn";
import { completeOnboarding, useAppState, useHydrated } from "@/lib/store";

const ARC: { id: AnimalId; x: number; y: number; s: number; r: number }[] = [
  { id: "emmi", x: 6, y: 34, s: 70, r: -10 },
  { id: "kimi", x: 22, y: 8, s: 74, r: -4 },
  { id: "leo", x: 41, y: 0, s: 84, r: 0 },
  { id: "benno", x: 62, y: 8, s: 76, r: 5 },
  { id: "luka", x: 78, y: 34, s: 70, r: 10 },
  { id: "diego", x: 14, y: 62, s: 66, r: -6 },
  { id: "eddy", x: 44, y: 54, s: 70, r: 0 },
  { id: "freddi", x: 72, y: 62, s: 64, r: 6 },
];

const noopSubscribe = () => () => {};

export function Onboarding() {
  const hydrated = useHydrated();
  // In der Live-Vorschau des Studios (iframe) keine Begrüßung zeigen
  const inFrame = useSyncExternalStore(
    noopSubscribe,
    () => window.self !== window.top,
    () => false,
  );
  const { onboarded } = useAppState();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [animal, setAnimal] = useState<AnimalId>("leo");

  if (!hydrated || onboarded || inFrame) return null;

  const finish = () => {
    playSuccess();
    completeOnboarding({ name, animal });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Willkommen bei YOGITIER"
      className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-white pt-safe pb-safe"
      style={{ animation: "fade-in 260ms ease-out both" }}
    >
      <div className="flex justify-center gap-1.5 pt-4" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span key={i} className={cn("h-1.5 rounded-full transition-all", i === step ? "w-6 bg-ink" : "w-1.5 bg-line")} />
        ))}
      </div>

      {step === 0 && (
        <div key="s0" className="flex flex-1 flex-col px-6 pt-6 animate-fade-up">
          <div className="relative mx-auto aspect-[1.25] w-full max-w-[320px]">
            {ARC.map((a, i) => (
              <div
                key={a.id}
                className="absolute animate-pop"
                style={{ left: `${a.x}%`, top: `${a.y}%`, width: a.s, rotate: `${a.r}deg`, animationDelay: `${i * 70}ms` }}
              >
                <Image src={animalsById[a.id].image} alt="" className="h-auto w-full animate-float" style={{ animationDelay: `${i * 0.4}s` }} sizes="84px" loading="eager" />
              </div>
            ))}
          </div>
          <Image src={logo} alt="YOGITIER®" className="mx-auto mt-4 h-8 w-auto" />
          <h2 className="mt-5 text-center text-[26px] font-bold leading-tight text-ink-strong">Willkommen bei der YOGITIER-Bande!</h2>
          <p className="mt-3 text-center text-[16px] font-medium leading-relaxed text-ink-soft">
            Hier warten Yoga-Abenteuer, Atemübungen, Fantasiereisen und Spiele auf dich.
          </p>
          <div className="mt-auto pt-8">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-[22px] bg-ink text-[17px] font-bold text-white shadow-lg shadow-ink/20 transition active:scale-[0.98]"
            >
              Los geht&apos;s <ArrowRight className="size-5" aria-hidden />
            </button>
            <p className="mt-4 text-center text-[12.5px] font-medium leading-snug text-ink-soft">
              Liebe Eltern: Fortschritt, Einstellungen und Tipps findet ihr später im Eltern-Bereich (Schloss oben rechts).
            </p>
          </div>
        </div>
      )}

      {step === 1 && (
        <form
          key="s1"
          className="flex flex-1 flex-col px-6 pt-10 animate-fade-up"
          onSubmit={(e) => {
            e.preventDefault();
            setStep(2);
          }}
        >
          <div className="mx-auto w-28">
            <Image src={animalsById.leo.image} alt="" className="h-auto w-full animate-wiggle" sizes="112px" />
          </div>
          <h2 className="mt-6 text-center text-[26px] font-bold text-ink-strong">Wie heißt du?</h2>
          <p className="mt-2 text-center text-[15px] font-medium text-ink-soft">Dann kann Leo dich richtig begrüßen.</p>
          <label htmlFor="kid-name" className="sr-only">
            Dein Name
          </label>
          <input
            id="kid-name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={24}
            autoComplete="off"
            placeholder="Dein Vorname"
            className="mt-8 h-16 w-full rounded-[22px] border-2 border-line bg-cream px-5 text-center text-[22px] font-bold text-ink outline-none transition placeholder:font-semibold placeholder:text-ink-soft/50 focus:border-lilac"
          />
          <div className="mt-auto flex flex-col gap-3 pt-8">
            <button
              type="submit"
              className="flex h-14 w-full items-center justify-center gap-2 rounded-[22px] bg-ink text-[17px] font-bold text-white shadow-lg shadow-ink/20 transition active:scale-[0.98]"
            >
              Weiter <ArrowRight className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => {
                setName("");
                setStep(2);
              }}
              className="h-11 text-[15px] font-bold text-ink-soft"
            >
              Überspringen
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <div key="s2" className="flex flex-1 flex-col px-6 pt-8 animate-fade-up">
          <h2 className="text-center text-[26px] font-bold leading-tight text-ink-strong">
            {name.trim() ? `Hallo ${name.trim()}!` : "Hallo!"} Wer ist dein Lieblingstier?
          </h2>
          <div className="mt-6 grid grid-cols-4 gap-2.5">
            {animals.map((a) => {
              const active = a.id === animal;
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setAnimal(a.id)}
                  aria-pressed={active}
                  className={cn(
                    "relative flex aspect-[0.82] flex-col items-center justify-center gap-1 rounded-[20px] p-2 transition active:scale-95",
                    active ? "ring-[3px] ring-ink" : "ring-1 ring-line",
                  )}
                  style={{ background: a.soft }}
                >
                  <Image src={a.image} alt="" className="h-12 w-auto object-contain" sizes="56px" />
                  <span className="text-[12px] font-bold text-ink">{a.name}</span>
                  {active && (
                    <span className="absolute -right-1 -top-1 grid size-6 place-items-center rounded-full bg-ink text-white">
                      <Check className="size-3.5" strokeWidth={3} aria-hidden />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-5 rounded-[22px] p-4 text-center" style={{ background: animalsById[animal].soft }}>
            <p className="text-[13px] font-semibold text-ink-soft">{animalsById[animal].fullName} sagt:</p>
            <p className="mt-1 text-[19px] font-bold text-ink-strong">„{animalsById[animal].affirmation}“</p>
          </div>
          <div className="mt-auto pt-6">
            <button
              type="button"
              onClick={finish}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-[22px] bg-ink text-[17px] font-bold text-white shadow-lg shadow-ink/20 transition active:scale-[0.98]"
            >
              Fertig – los geht&apos;s! <Check className="size-5" aria-hidden />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
