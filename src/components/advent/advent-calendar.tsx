"use client";

import { Check, Dices, ExternalLink, Gift, Heart, Lock, Moon, Palette, PersonStanding, Sparkles, Wind } from "lucide-react";
import Image from "next/image";
import { useState, type ComponentType } from "react";

import { AppLink } from "@/components/ui/app-link";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Confetti } from "@/components/ui/confetti";
import { ParentGateLink } from "@/components/ui/parent-gate";
import { SpeakButton } from "@/components/ui/speak-button";
import { adventColors, adventDoors, adventKindLabel, adventOrder, type AdventKind } from "@/content/advent";
import { animalsById } from "@/content/animals";
import { playChime, playSoftNo } from "@/lib/audio";
import { cn } from "@/lib/cn";
import { openAdventDoor, useAppState } from "@/lib/store";
import { useNow } from "@/lib/use-now";

const KIND_ICON: Record<AdventKind, ComponentType<{ className?: string; "aria-hidden"?: boolean }>> = {
  yoga: PersonStanding,
  atmen: Wind,
  affirmation: Heart,
  dankbarkeit: Sparkles,
  kreativ: Palette,
  reise: Moon,
  spiel: Dices,
  fest: Gift,
};

export function AdventCalendar() {
  const now = useNow();
  const { advent } = useAppState();
  const [openDay, setOpenDay] = useState<number | null>(null);
  const [denied, setDenied] = useState<{ day: number; wait: number } | null>(null);

  const inDecember = now ? now.getMonth() === 11 : false;
  const today = now ? now.getDate() : 0;
  const preview = !inDecember;
  const canOpen = (day: number) => preview || day <= today;

  const door = openDay ? adventDoors.find((d) => d.day === openDay) : undefined;
  const animal = door?.animal ? animalsById[door.animal] : undefined;

  return (
    <div>
      {now && preview && (
        <p className="mb-3 rounded-[18px] bg-meditation px-4 py-3 text-[13px] font-semibold leading-snug text-lilac-ink">
          ✨ Vorschau: Im Dezember öffnet sich jeden Tag ein neues Türchen. Jetzt kannst du schon alle ausprobieren!
        </p>
      )}
      {denied && (
        <p key={denied.day} className="mb-3 rounded-[18px] bg-besonderes px-4 py-3 text-center text-[14px] font-bold text-ink animate-fade-up">
          Türchen {denied.day} öffnet sich in {denied.wait} {denied.wait === 1 ? "Tag" : "Tagen"}. Noch ein bisschen Geduld!
        </p>
      )}
      <ol className="grid grid-cols-4 gap-2.5">
        {adventOrder.map((day, i) => {
          const d = adventDoors.find((x) => x.day === day)!;
          const opened = advent.includes(day);
          const locked = !!now && !canOpen(day);
          const Icon = KIND_ICON[d.kind];
          return (
            <li key={day}>
              <button
                type="button"
                onClick={() => {
                  if (!now) return;
                  if (!canOpen(day)) {
                    playSoftNo();
                    setDenied({ day, wait: day - today });
                    return;
                  }
                  setDenied(null);
                  playChime();
                  openAdventDoor(day);
                  setOpenDay(day);
                }}
                aria-label={`Türchen ${day}${opened ? ", geöffnet" : ""}${locked ? ", noch verschlossen" : ""}`}
                className={cn(
                  "relative grid aspect-[0.86] w-full place-items-center overflow-hidden rounded-[18px] transition active:scale-95",
                  opened ? "ring-2 ring-white" : "shadow-[inset_0_-4px_0_rgb(122_74_40/0.08)]",
                  day === 24 && "ring-2 ring-brand-orange/40",
                )}
                style={{ background: adventColors[i % adventColors.length] }}
              >
                {opened ? (
                  <span className="flex flex-col items-center gap-1">
                    <Icon className="size-6 text-ink" aria-hidden />
                    <span className="text-[12px] font-bold text-ink-soft">{day}</span>
                    <Check className="absolute right-1.5 top-1.5 size-3.5 text-ink/60" strokeWidth={3} aria-hidden />
                  </span>
                ) : (
                  <span className="flex flex-col items-center">
                    <span className="text-[26px] font-bold leading-none text-ink">{day}</span>
                    {locked ? <Lock className="mt-1 size-3.5 text-ink-soft" aria-hidden /> : <span className="mt-1.5 size-1.5 rounded-full bg-ink/25" />}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ol>

      <BottomSheet open={!!door} onClose={() => setOpenDay(null)} title={door ? `Türchen ${door.day}` : "Türchen"}>
        {door && (
          <div className="relative px-6 pb-6 pt-2 text-center">
            <Confetti seed={door.day} count={36} />
            <span className="inline-flex items-center gap-1.5 rounded-full bg-besonderes px-3 py-1 text-[12.5px] font-bold text-ink">
              Türchen {door.day} · {adventKindLabel[door.kind]}
            </span>
            {animal && <Image src={animal.image} alt={animal.fullName} className="mx-auto mt-4 h-24 w-auto object-contain animate-pop" sizes="100px" />}
            <h2 className="mt-3 text-[26px] font-bold leading-tight text-ink-strong">{door.title}</h2>
            <p className="mt-2 text-[15.5px] font-medium leading-relaxed text-ink">{door.text}</p>
            <div className="mt-4 flex justify-center">
              <SpeakButton text={`${door.title} ${door.text}`} />
            </div>
            {door.link && (
              <AppLink
                href={door.link.href}
                className="mt-5 flex h-14 w-full items-center justify-center rounded-[20px] bg-ink text-[16px] font-bold text-white shadow-lg shadow-ink/20 active:scale-[0.98]"
              >
                {door.link.label}
              </AppLink>
            )}
            {door.external && (
              <ParentGateLink
                href={door.external.href}
                className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-[20px] bg-ink text-[16px] font-bold text-white shadow-lg shadow-ink/20 active:scale-[0.98]"
              >
                <ExternalLink className="size-5" aria-hidden /> {door.external.label}
              </ParentGateLink>
            )}
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
