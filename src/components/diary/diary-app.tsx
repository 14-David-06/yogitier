"use client";

import { ArrowRight, Check, Palette, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

import { AppLink } from "@/components/ui/app-link";
import { Confetti } from "@/components/ui/confetti";
import { SpeakButton } from "@/components/ui/speak-button";
import { animalsById } from "@/content/animals";
import { gratitudeIdeas, moods, moodsById } from "@/content/moods";
import type { MoodId } from "@/content/types";
import { playPop, playSuccess } from "@/lib/audio";
import { cn } from "@/lib/cn";
import { dayKey, formatLongDate, formatWhen, lastMoodByDay, weekDays } from "@/lib/stats";
import { addDiaryEntry, deleteDiaryEntry, useAppState, useHydrated } from "@/lib/store";
import { useNow } from "@/lib/use-now";

import { DrawingPad, type DrawingPadHandle } from "./drawing-pad";
import { MoodFace } from "./mood-face";

export function DiaryApp() {
  const hydrated = useHydrated();
  const now = useNow();
  const { diary, activities, profile } = useAppState();
  const [mood, setMood] = useState<MoodId | null>(null);
  const [gratitude, setGratitude] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [showPad, setShowPad] = useState(false);
  const [saved, setSaved] = useState(0);
  const pad = useRef<DrawingPadHandle>(null);

  const toggleGratitude = (g: string) => {
    playPop();
    setGratitude((list) => (list.includes(g) ? list.filter((x) => x !== g) : [...list, g]));
  };

  const save = () => {
    if (!mood) return;
    addDiaryEntry({ mood, gratitude, note: note.trim(), drawing: showPad ? (pad.current?.toDataUrl() ?? undefined) : undefined });
    playSuccess();
    setMood(null);
    setGratitude([]);
    setNote("");
    setShowPad(false);
    setSaved((s) => s + 1);
  };

  const week = now ? weekDays(activities, now) : [];
  const moodByDay = lastMoodByDay(diary);
  const m = mood ? moodsById[mood] : null;
  const helper = m ? animalsById[m.helper] : null;

  return (
    <div className="pb-12">
      {/* Wochenübersicht */}
      <section className="mx-5 mt-5 rounded-[24px] bg-cream p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-ink">Meine Woche</h2>
          <span className="text-[12.5px] font-semibold text-ink-soft">{now ? formatLongDate(now) : " "}</span>
        </div>
        <ol className="mt-3 grid grid-cols-7 gap-1.5">
          {(week.length ? week : Array.from({ length: 7 }, () => null)).map((d, i) => {
            const entry = d ? moodByDay.get(d.key) : undefined;
            return (
              <li key={d?.key ?? i} className="flex flex-col items-center gap-1">
                <span className={cn("text-[11.5px] font-bold", d?.isToday ? "text-ink" : "text-ink-soft")}>{d?.label ?? "·"}</span>
                <span className={cn("grid size-10 place-items-center rounded-full", d?.isToday && "ring-2 ring-ink/70 ring-offset-2 ring-offset-cream", !entry && "bg-white")}>
                  {entry ? <MoodFace mood={entry.mood} className="size-10" /> : <span className="size-1.5 rounded-full bg-line" />}
                </span>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Neuer Eintrag */}
      <section key={saved} className="relative mx-5 mt-5 rounded-[26px] border-2 border-tagebuch p-4">
        {saved > 0 && !mood && <Confetti seed={saved + 7} count={40} />}
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[19px] font-bold text-ink-strong">
            {saved > 0 && !mood ? "Gespeichert! Möchtest du noch etwas erzählen?" : `Wie fühlst du dich heute${profile.name ? `, ${profile.name}` : ""}?`}
          </h2>
          {hydrated && <SpeakButton compact text="Wie fühlst du dich heute? Tippe auf ein Gesicht." />}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {moods.map((x) => (
            <button
              key={x.id}
              type="button"
              onClick={() => {
                playPop();
                setMood(x.id);
              }}
              aria-pressed={mood === x.id}
              className={cn(
                "flex flex-col items-center gap-1 rounded-[20px] py-3 transition active:scale-95",
                mood === x.id ? "bg-tagebuch ring-2 ring-ink" : "bg-white ring-1 ring-line",
              )}
            >
              <MoodFace mood={x.id} className="size-12" />
              <span className="text-[13px] font-bold text-ink">{x.label}</span>
            </button>
          ))}
        </div>

        {m && helper && (
          <div className="mt-4 space-y-4 animate-fade-up">
            <div className="flex gap-3 rounded-[22px] p-3.5" style={{ background: m.color }}>
              <Image src={helper.image} alt="" className="size-14 shrink-0 object-contain" sizes="56px" />
              <div className="min-w-0">
                <p className="text-[14px] font-semibold leading-snug" style={{ color: m.ink }}>
                  {m.tip}
                </p>
                <AppLink href={m.suggestion.href} className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/85 px-3 py-1 text-[13px] font-bold text-ink">
                  {m.suggestion.label} <ArrowRight className="size-3.5" aria-hidden />
                </AppLink>
              </div>
            </div>

            <div>
              <h3 className="text-[16px] font-bold text-ink">Wofür bist du heute dankbar?</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {gratitudeIdeas.map((g) => {
                  const on = gratitude.includes(g);
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => toggleGratitude(g)}
                      aria-pressed={on}
                      className={cn("inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[13px] font-bold transition", on ? "bg-ink text-white" : "bg-cream text-ink ring-1 ring-line")}
                    >
                      {on && <Check className="size-3.5" aria-hidden />} {g}
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="block">
              <span className="text-[16px] font-bold text-ink">{m.question}</span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                maxLength={400}
                placeholder="Schreib es auf – oder lass es dir von Mama oder Papa aufschreiben."
                className="mt-2 w-full resize-none rounded-[18px] border-2 border-line bg-cream px-4 py-3 text-[15px] font-medium text-ink outline-none placeholder:text-ink-soft/60 focus:border-lilac"
              />
            </label>

            {showPad ? (
              <div>
                <h3 className="mb-2 text-[16px] font-bold text-ink">Mal dein Gefühl</h3>
                <DrawingPad ref={pad} />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowPad(true)}
                className="flex w-full items-center justify-center gap-2 rounded-[18px] border-2 border-dashed border-line py-3 text-[15px] font-bold text-ink-soft active:scale-[0.99]"
              >
                <Palette className="size-5" aria-hidden /> Ein Bild dazu malen
              </button>
            )}

            <button
              type="button"
              onClick={save}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-[20px] bg-ink text-[17px] font-bold text-white shadow-lg shadow-ink/20 active:scale-[0.98]"
            >
              <Plus className="size-5" aria-hidden /> Eintrag speichern
            </button>
          </div>
        )}
      </section>

      {/* Einträge */}
      <section className="mx-5 mt-7">
        <h2 className="text-[19px] font-bold text-ink">Meine Einträge</h2>
        {!hydrated ? (
          <div className="mt-3 h-24 animate-pulse rounded-[22px] bg-cream" />
        ) : diary.length === 0 ? (
          <p className="mt-2 rounded-[22px] bg-cream p-4 text-[14px] font-medium text-ink-soft">
            Hier sammeln sich deine Gefühle und schönen Momente. Fang einfach oben an!
          </p>
        ) : (
          <ul className="mt-3 flex flex-col gap-3">
            {diary.slice(0, 30).map((e) => {
              const em = moodsById[e.mood];
              return (
                <li key={e.id} className="rounded-[22px] p-3.5 ring-1 ring-line">
                  <div className="flex items-center gap-3">
                    <MoodFace mood={e.mood} className="size-11 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-bold text-ink">{em.label}</p>
                      <p className="text-[12.5px] font-medium text-ink-soft">{now ? formatWhen(e.at, now) : dayKey(new Date(e.at))}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm("Diesen Eintrag wirklich löschen?")) deleteDiaryEntry(e.id);
                      }}
                      aria-label="Eintrag löschen"
                      className="grid size-9 place-items-center rounded-full text-ink-soft hover:bg-cream"
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </button>
                  </div>
                  {e.gratitude.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {e.gratitude.map((g) => (
                        <span key={g} className="rounded-full bg-cream px-2.5 py-1 text-[12px] font-bold text-ink">
                          ♥ {g}
                        </span>
                      ))}
                    </div>
                  )}
                  {e.note && <p className="mt-2 text-[14px] font-medium leading-snug text-ink">{e.note}</p>}
                  {e.drawing && (
                    // eslint-disable-next-line @next/next/no-img-element -- lokales Data-URL-Bild
                    <img src={e.drawing} alt="Gemaltes Bild" className="mt-2 aspect-[16/10] w-full rounded-[16px] object-cover ring-1 ring-line" />
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
