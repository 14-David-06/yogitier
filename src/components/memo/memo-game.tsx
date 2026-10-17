"use client";

import { Clock, Footprints, RotateCcw, Trophy } from "lucide-react";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import logo from "@/assets/brand/logo.png";
import { Confetti } from "@/components/ui/confetti";
import { animals, animalsById } from "@/content/animals";
import type { AnimalId } from "@/content/types";
import { playFanfare, playPop, playSoftNo, playSuccess } from "@/lib/audio";
import { cn } from "@/lib/cn";
import { speak, stopSpeaking } from "@/lib/speech";
import { type MemoLevel, logActivity, saveMemoResult, useAppState } from "@/lib/store";

const LEVELS: { id: MemoLevel; label: string; pairs: number; text: string }[] = [
  { id: "leicht", label: "Leicht", pairs: 4, text: "4 Paare · ab 3 Jahren" },
  { id: "mittel", label: "Mittel", pairs: 6, text: "6 Paare · ab 5 Jahren" },
  { id: "profi", label: "Profi", pairs: 8, text: "8 Paare · die ganze Bande" },
];

type Card = { key: number; animal: AnimalId; matched: boolean };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatTime(sec: number) {
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
}

export function MemoGame() {
  const { memoBest } = useAppState();
  const [level, setLevel] = useState<MemoLevel | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [open, setOpen] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [lastMatch, setLastMatch] = useState<AnimalId | null>(null);
  const [won, setWon] = useState(false);
  const [round, setRound] = useState(0);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  useLayoutEffect(
    () => () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      stopSpeaking();
    },
    [],
  );

  // Spielzeit
  useEffect(() => {
    if (!level || won) return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [level, won, round]);

  const start = (l: MemoLevel) => {
    clearTimers();
    const pairs = LEVELS.find((x) => x.id === l)!.pairs;
    const chosen = shuffle(animals.map((a) => a.id)).slice(0, pairs);
    const deck = shuffle([...chosen, ...chosen]).map((animal, i) => ({ key: i, animal, matched: false }));
    setLevel(l);
    setCards(deck);
    setOpen([]);
    setMoves(0);
    setSeconds(0);
    setLastMatch(null);
    setWon(false);
    setRound((r) => r + 1);
  };

  const flip = (i: number) => {
    if (!level || won) return;
    const card = cards[i];
    if (card.matched || open.includes(i) || open.length >= 2) return;
    playPop();
    const nextOpen = [...open, i];
    setOpen(nextOpen);
    if (nextOpen.length < 2) return;

    const [a, b] = nextOpen;
    const newMoves = moves + 1;
    setMoves(newMoves);
    if (cards[a].animal === cards[b].animal) {
      const animal = cards[a].animal;
      timers.current.push(
        window.setTimeout(() => {
          const updated = cards.map((c, idx) => (idx === a || idx === b ? { ...c, matched: true } : c));
          setCards(updated);
          setOpen([]);
          setLastMatch(animal);
          playSuccess();
          const allDone = updated.every((c) => c.matched);
          if (allDone) {
            timers.current.push(
              window.setTimeout(() => {
                setWon(true);
                playFanfare();
                speak(`Geschafft! Du hast alle Paare gefunden – in ${newMoves} Zügen. Toll gemacht!`);
                saveMemoResult(level, newMoves);
                logActivity({ type: "memo", refId: level, title: "Affirmation-Memo", seconds: Math.max(60, seconds) });
              }, 900),
            );
          } else {
            speak(`${animalsById[animal].name} sagt: ${animalsById[animal].affirmation}`);
          }
        }, 420),
      );
    } else {
      timers.current.push(
        window.setTimeout(() => {
          playSoftNo();
          setOpen([]);
        }, 950),
      );
    }
  };

  if (!level) {
    return (
      <div className="px-5 pb-10">
        <p className="mt-5 text-[15px] font-medium leading-relaxed text-ink">
          Finde die Tier-Paare! Bei jedem Paar verrät dir ein Tier seinen Mutmacher-Satz. Wie viele Züge brauchst du?
        </p>
        <ul className="mt-5 flex flex-col gap-3">
          {LEVELS.map((l, i) => (
            <li key={l.id}>
              <button
                type="button"
                onClick={() => start(l.id)}
                className="flex w-full items-center gap-4 rounded-[24px] p-4 text-left transition active:scale-[0.98]"
                style={{ background: ["#FBF1BE", "#FBEBC4", "#F6F0D2"][i] }}
              >
                <span className="flex -space-x-3">
                  {(["luka", "leo", "emmi"] as AnimalId[]).slice(0, i + 1).map((id) => (
                    <span key={id} className="grid size-12 place-items-center rounded-full bg-white ring-2 ring-white">
                      <Image src={animalsById[id].image} alt="" className="size-9 object-contain" sizes="36px" />
                    </span>
                  ))}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[18px] font-bold text-ink">{l.label}</span>
                  <span className="block text-[13px] font-medium text-ink-soft">{l.text}</span>
                </span>
                {memoBest[l.id] !== undefined && (
                  <span className="flex flex-col items-end text-right">
                    <Trophy className="size-4 text-brand-orange" aria-hidden />
                    <span className="text-[12px] font-bold text-ink">Rekord: {memoBest[l.id]}</span>
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-6 rounded-[20px] border border-dashed border-line p-4 text-[13px] font-medium leading-relaxed text-ink-soft">
          Für Eltern: Das Spiel basiert auf dem YOGITIER® Affirmation-Memory. Erweitert es offline: Wer ein Paar findet, macht die
          Lieblingsübung des Tieres nach!
        </p>
      </div>
    );
  }

  const meta = LEVELS.find((l) => l.id === level)!;
  const matched = cards.filter((c) => c.matched).length / 2;

  return (
    <div className="relative px-5 pb-10">
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1.5 text-[13px] font-bold text-ink">
            <Footprints className="size-4" aria-hidden /> {moves} Züge
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1.5 text-[13px] font-bold tabular-nums text-ink">
            <Clock className="size-4" aria-hidden /> {formatTime(seconds)}
          </span>
        </div>
        <span className="text-[13px] font-bold text-ink-soft">
          {matched}/{meta.pairs} Paare
        </span>
      </div>

      <div className={cn("mt-4 grid gap-2.5", "grid-cols-4")}>
        {cards.map((c, i) => {
          const a = animalsById[c.animal];
          const flipped = c.matched || open.includes(i);
          return (
            <button
              key={`${round}-${c.key}`}
              type="button"
              onClick={() => flip(i)}
              data-flipped={flipped}
              aria-label={flipped ? a.fullName : "Verdeckte Karte"}
              className={cn("flip-card aspect-square w-full", c.matched && "pointer-events-none")}
            >
              <span className="flip-card-inner block">
                <span className="flip-face grid place-items-center rounded-[18px] border-[1.5px] border-[#C9A98C] bg-sand p-2 shadow-sm">
                  <Image src={logo} alt="" className="h-auto w-full" sizes="80px" />
                </span>
                <span
                  className={cn("flip-face flip-face-front grid place-items-center rounded-[18px] p-2 shadow-sm", c.matched && "ring-[3px] ring-white")}
                  style={{ background: a.color }}
                >
                  <Image src={a.image} alt="" className={cn("h-[72%] w-auto object-contain", c.matched && "animate-pop")} sizes="64px" />
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {lastMatch && !won && (
        <div key={`${lastMatch}-${matched}`} className="mt-5 flex items-center gap-3 rounded-[22px] p-3 animate-fade-up" style={{ background: animalsById[lastMatch].soft }}>
          <Image src={animalsById[lastMatch].image} alt="" className="size-12 shrink-0 object-contain" sizes="48px" />
          <p className="text-[13px] font-semibold text-ink-soft">
            {animalsById[lastMatch].name} sagt:
            <span className="block text-[18px] font-bold text-ink-strong">„{animalsById[lastMatch].affirmation}“</span>
          </p>
        </div>
      )}

      {won && (
        <div className="relative mt-5 rounded-[26px] bg-memo p-5 text-center animate-fade-up">
          <Confetti seed={round} />
          <Trophy className="mx-auto size-10 text-brand-orange" aria-hidden />
          <h2 className="mt-2 text-[24px] font-bold text-ink-strong">Geschafft!</h2>
          <p className="mt-1 text-[15px] font-medium text-ink">
            Alle {meta.pairs} Paare in {moves} Zügen und {formatTime(seconds)} Minuten.
          </p>
          {memoBest[level] === moves && <p className="mt-2 text-[14px] font-bold text-brand-orange">Neuer Rekord! 🎉</p>}
          <div className="mt-4 flex gap-3">
            <button type="button" onClick={() => start(level)} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-[18px] bg-ink text-[15px] font-bold text-white active:scale-[0.98]">
              <RotateCcw className="size-4" aria-hidden /> Nochmal
            </button>
            <button type="button" onClick={() => setLevel(null)} className="h-12 flex-1 rounded-[18px] bg-white text-[15px] font-bold text-ink ring-1 ring-line active:scale-[0.98]">
              Anderes Level
            </button>
          </div>
        </div>
      )}

      {!won && (
        <button type="button" onClick={() => setLevel(null)} className="mt-6 w-full text-center text-[14px] font-bold text-ink-soft">
          Level wechseln
        </button>
      )}
    </div>
  );
}
