"use client";

import { Play } from "lucide-react";
import { useLayoutEffect, useState } from "react";

import { animalsById } from "@/content/animals";
import { getLesson } from "@/content/lessons";
import { getPose } from "@/content/poses";

import { LessonPlayer, type PlayerStep } from "./lesson-player";

/** Startknopf (unten fixiert) + Player für eine Yoga-Stunde */
export function LessonStart({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false);

  // Verlässt man die Seite, startet die Stunde beim Zurückkommen nicht mitten im Ablauf.
  useLayoutEffect(() => () => setOpen(false), []);

  const lesson = getLesson(slug);
  if (!lesson) return null;
  const steps: PlayerStep[] = lesson.steps.flatMap((s) => {
    const pose = getPose(s.pose);
    return pose ? [{ pose, seconds: s.seconds, cue: s.cue }] : [];
  });

  return (
    <>
      <div className="sticky bottom-0 z-10 bg-gradient-to-t from-white via-white/95 to-white/0 px-5 pb-safe pt-6">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-14 w-full items-center justify-center gap-2.5 rounded-[22px] bg-ink text-[17px] font-bold text-white shadow-lg shadow-ink/25 transition active:scale-[0.98]"
        >
          <Play className="size-5 fill-white" aria-hidden /> Stunde starten
        </button>
      </div>
      {open && (
        <LessonPlayer
          title={lesson.title}
          host={animalsById[lesson.host]}
          color={lesson.color}
          steps={steps}
          outro={lesson.outro}
          activity={{ type: "yoga", refId: lesson.slug, title: lesson.title }}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

/** „Jetzt ausprobieren“ für eine einzelne Übung (45 Sekunden) */
export function PoseTry({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false);
  useLayoutEffect(() => () => setOpen(false), []);
  const pose = getPose(slug);
  if (!pose) return null;
  const host = animalsById[pose.host ?? "leo"];
  return (
    <>
      <div className="sticky bottom-0 z-10 bg-gradient-to-t from-white via-white/95 to-white/0 px-5 pb-safe pt-6">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-14 w-full items-center justify-center gap-2.5 rounded-[22px] bg-ink text-[17px] font-bold text-white shadow-lg shadow-ink/25 transition active:scale-[0.98]"
        >
          <Play className="size-5 fill-white" aria-hidden /> Jetzt ausprobieren
        </button>
      </div>
      {open && (
        <LessonPlayer
          title={pose.name}
          host={host}
          color={pose.color}
          steps={[{ pose, seconds: 45, cue: pose.steps.slice(0, 2).join(" ") }]}
          outro={pose.benefit}
          activity={{ type: "uebung", refId: pose.slug, title: pose.name }}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
