"use client";

import { Delete, ExternalLink, Lock } from "lucide-react";
import { useState, type ReactNode } from "react";

import { playPop, playSoftNo, playSuccess } from "@/lib/audio";
import { cn } from "@/lib/cn";

import { BottomSheet } from "./bottom-sheet";

export type GateQuestion = { a: number; b: number };

/** neue Rechenaufgabe – nur in Event-Handlern aufrufen */
export function newGateQuestion(): GateQuestion {
  return { a: 3 + Math.floor(Math.random() * 7), b: 3 + Math.floor(Math.random() * 7) };
}

// Einmal gelöst, bleibt das Gate für diese Sitzung offen.
let unlockedThisSession = false;
export function isParentUnlocked() {
  return unlockedThisSession;
}
export function unlockParent() {
  unlockedThisSession = true;
}

/** Rechenaufgabe mit Ziffernblock – kindersicher, aber für Erwachsene schnell gelöst. */
export function ParentGatePanel({
  question,
  onSolved,
  onNewQuestion,
  title = "Nur für Erwachsene",
  text = "Bitte löse die Aufgabe, um fortzufahren.",
}: {
  question: GateQuestion;
  onSolved: () => void;
  onNewQuestion: () => void;
  title?: string;
  text?: string;
}) {
  const [value, setValue] = useState("");
  const [wrong, setWrong] = useState(0);

  const submit = () => {
    if (!value) return;
    if (Number(value) === question.a * question.b) {
      playSuccess();
      unlockParent();
      onSolved();
    } else {
      playSoftNo();
      setWrong((w) => w + 1);
      setValue("");
      onNewQuestion();
    }
  };

  const press = (d: string) => {
    playPop();
    setValue((v) => (v.length >= 3 ? v : v + d));
  };

  return (
    <div className="px-6 pb-4 pt-2 text-center">
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-cream">
        <Lock className="size-6 text-ink" strokeWidth={1.8} aria-hidden />
      </span>
      <h2 className="mt-3 text-[22px] font-bold text-ink-strong">{title}</h2>
      <p className="mt-1 text-[14px] font-medium text-ink-soft">{text}</p>
      <p className="mt-5 text-[30px] font-bold text-ink" aria-live="polite">
        Was ist {question.a} × {question.b}?
      </p>
      <div
        key={wrong}
        className={cn("mx-auto mt-3 flex h-14 w-40 items-center justify-center rounded-[18px] border-2 bg-cream text-[28px] font-bold tabular-nums text-ink", wrong ? "border-brand-red/50" : "border-line")}
        style={wrong ? { animation: "card-shake 320ms ease-in-out" } : undefined}
        aria-label="Deine Antwort"
      >
        {value || <span className="text-ink-soft/40">?</span>}
      </div>
      {wrong > 0 && <p className="mt-2 text-[13px] font-bold text-brand-red">Leider falsch – hier ist eine neue Aufgabe.</p>}
      <div className="mx-auto mt-4 grid max-w-[280px] grid-cols-3 gap-2.5">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
          <button key={d} type="button" onClick={() => press(d)} className="h-14 rounded-[18px] bg-cream text-[22px] font-bold text-ink active:scale-95 active:bg-line">
            {d}
          </button>
        ))}
        <button type="button" onClick={() => setValue((v) => v.slice(0, -1))} aria-label="Löschen" className="grid h-14 place-items-center rounded-[18px] bg-cream text-ink active:scale-95">
          <Delete className="size-6" aria-hidden />
        </button>
        <button type="button" onClick={() => press("0")} className="h-14 rounded-[18px] bg-cream text-[22px] font-bold text-ink active:scale-95">
          0
        </button>
        <button type="button" onClick={submit} className="h-14 rounded-[18px] bg-ink text-[18px] font-bold text-white active:scale-95">
          OK
        </button>
      </div>
    </div>
  );
}

/**
 * Externer Link aus einem Kinder-Bereich: öffnet erst nach gelöster
 * Eltern-Aufgabe (Kinder-App-Richtlinien von Apple/Google).
 */
export function ParentGateLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  const [question, setQuestion] = useState<GateQuestion | null>(null);

  const openLink = () => window.open(href, "_blank", "noopener,noreferrer");

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => {
          if (isParentUnlocked()) openLink();
          else setQuestion(newGateQuestion());
        }}
      >
        {children}
      </button>
      <BottomSheet open={question !== null} onClose={() => setQuestion(null)} title="Eltern-Bestätigung">
        {question && (
          <>
            <ParentGatePanel
              question={question}
              onNewQuestion={() => setQuestion(newGateQuestion())}
              onSolved={() => {
                setQuestion(null);
                openLink();
              }}
            />
            <p className="flex items-center justify-center gap-1.5 px-6 pb-4 text-[12px] font-medium text-ink-soft">
              <ExternalLink className="size-3.5" aria-hidden /> Der Link öffnet sich in einem neuen Tab
            </p>
          </>
        )}
      </BottomSheet>
    </>
  );
}
