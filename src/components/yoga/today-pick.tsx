"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";

import { AppLink } from "@/components/ui/app-link";
import { animalsById } from "@/content/animals";
import { getLesson, lessonMinutes } from "@/content/lessons";
import { greeting } from "@/lib/stats";
import { useAppState } from "@/lib/store";
import { useNow } from "@/lib/use-now";

function pickFor(hour: number) {
  if (hour < 11) return { slug: "guten-morgen", why: "Perfekt für einen fröhlichen Start in den Tag." };
  if (hour < 15) return { slug: "mini-pause", why: "Eine kleine Pause tut jetzt richtig gut." };
  if (hour < 18) return { slug: "dschungel-reise", why: "Zeit für ein Abenteuer nach Kita & Schule!" };
  return { slug: "gute-nacht", why: "So kommst du ganz entspannt zur Ruhe." };
}

/** Empfehlung passend zur Tageszeit (wird erst im Browser berechnet). */
export function TodayPick() {
  const now = useNow();
  const { profile } = useAppState();

  if (!now) return <div className="mx-5 mt-5 h-[132px] animate-pulse rounded-[26px] bg-cream" aria-hidden />;

  const pick = pickFor(now.getHours());
  const lesson = getLesson(pick.slug);
  if (!lesson) return null;
  const host = animalsById[lesson.host];

  return (
    <AppLink
      href={`/yoga/stunde/${lesson.slug}`}
      className="relative mx-5 mt-5 flex h-[132px] items-center gap-3 overflow-hidden rounded-[26px] bg-ink p-4 text-white transition active:scale-[0.98] animate-fade-up"
    >
      <span className="min-w-0 flex-1">
        <span className="block text-[12.5px] font-bold uppercase tracking-wider text-white/70">
          {greeting(now)}
          {profile.name ? `, ${profile.name}` : ""}!
        </span>
        <span className="mt-1 block text-[19px] font-bold leading-tight">{lesson.title}</span>
        <span className="mt-1 block text-[12.5px] font-medium leading-snug text-white/80">{pick.why}</span>
        <span className="mt-2 inline-flex items-center gap-1 text-[13px] font-bold">
          {lessonMinutes(lesson)} Min. · Jetzt starten <ArrowRight className="size-4" aria-hidden />
        </span>
      </span>
      <span className="grid size-[92px] shrink-0 place-items-center rounded-full" style={{ background: lesson.color }}>
        <Image src={host.image} alt="" className="h-16 w-16 object-contain" sizes="64px" />
      </span>
    </AppLink>
  );
}
