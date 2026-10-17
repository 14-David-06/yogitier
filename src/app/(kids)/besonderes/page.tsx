import { Clock, ExternalLink, Snowflake } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

import { AdventCalendar } from "@/components/advent/advent-calendar";
import { Snow } from "@/components/meditation/journey-backdrop";
import { PoseArtView } from "@/components/poses/pose-art";
import { AppLink } from "@/components/ui/app-link";
import { ModuleHero, Sheet } from "@/components/ui/module-hero";
import { PageHeader } from "@/components/ui/page-header";
import { ParentGateLink } from "@/components/ui/parent-gate";
import { Screen } from "@/components/ui/screen";
import { Pill, Section } from "@/components/ui/section";
import { WorldsShelf } from "@/components/worlds/worlds-shelf";
import { LessonCard } from "@/components/yoga/lesson-card";
import { animalsById } from "@/content/animals";
import { downloads } from "@/content/brand";
import { getJourney, journeyMinutes } from "@/content/journeys";
import { getLesson } from "@/content/lessons";
import { poses } from "@/content/poses";

export const metadata: Metadata = {
  title: "Besonderes",
  description: "Neue Lernwelten aus dem YOGITIER® Studio und Saison-Highlights wie der Adventskalender mit 24 Türchen.",
};

const CRAFTS = ["Bastelvorlage & Ausmalbilder", "Affirmationssonne", "YOGITIER®-Bande"];

export default function BesonderesPage() {
  const lesson = getLesson("weihnachts-yoga");
  const journey = getJourney("schneeflocke");
  const winterPoses = poses.filter((p) => p.winter);
  const kimi = animalsById.kimi;

  return (
    <Screen>
      <PageHeader back="/" background="#FBE3E6" backLabel="Zurück zum Menü" />
      <div className="relative overflow-hidden bg-besonderes">
        <div className="pointer-events-none absolute inset-0 opacity-80" aria-hidden>
          <Snow count={18} />
        </div>
        <div className="relative">
          <ModuleHero
            title="Besonderes"
            text="Neue Lernwelten und Saison-Highlights – immer wieder frisch vom YOGITIER®-Team."
            image={kimi.image}
            color="transparent"
            vt="tile-besonderes"
          />
        </div>
      </div>
      <Sheet>
        <WorldsShelf title="Neue Lernwelten" subtitle="Schauen, mitmachen, rätseln – und Sticker sammeln" />

        <div className="mx-5 mt-9 flex items-center gap-3">
          <span className="h-px flex-1 bg-line" />
          <span className="rounded-full bg-besonderes px-3.5 py-1 text-[13px] font-bold text-ink">❄️ Weihnachtszauber</span>
          <span className="h-px flex-1 bg-line" />
        </div>

        <Section title="Adventskalender" subtitle="Jeden Tag eine kleine Achtsamkeits-Überraschung" className="mt-4">
          <AdventCalendar />
        </Section>

        {lesson && (
          <Section title="Weihnachts-Yoga">
            <LessonCard lesson={lesson} />
          </Section>
        )}

        {journey && (
          <Section title="Winter-Fantasiereise">
            <AppLink
              href={`/meditation/reise/${journey.slug}`}
              className="relative flex items-center gap-3 overflow-hidden rounded-[24px] bg-[#E3EEF7] p-4 active:scale-[0.98]"
            >
              <Snowflake className="absolute -right-4 -top-4 size-20 text-white/80" aria-hidden />
              <Image src={kimi.image} alt="" className="relative size-14 shrink-0 object-contain" sizes="56px" />
              <span className="relative min-w-0 flex-1 pr-6">
                <span className="block text-[16px] font-bold text-ink">{journey.title}</span>
                <span className="block text-[12.5px] font-medium text-ink-soft">{journey.description}</span>
                <span className="mt-2 flex">
                  <Pill>
                    <Clock className="size-3.5" aria-hidden /> {journeyMinutes(journey)} Min.
                  </Pill>
                </span>
              </span>
            </AppLink>
          </Section>
        )}

        <Section title="Winter-Übungen">
          <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 pb-1">
            {winterPoses.map((p) => (
              <AppLink key={p.slug} href={`/yoga/uebungen/${p.slug}`} className="w-[132px] shrink-0 rounded-[22px] p-3 active:scale-[0.97]" style={{ background: p.color }}>
                <span className="block aspect-square w-full">
                  <PoseArtView pose={p} sizes="120px" />
                </span>
                <span className="mt-1 block text-[14px] font-bold leading-tight text-ink">{p.name}</span>
              </AppLink>
            ))}
          </div>
        </Section>

        <Section title="Basteln für die Feiertage" subtitle="Gratis-Vorlagen von YOGITIER® zum Ausdrucken">
          <ul className="flex flex-col gap-2">
            {downloads
              .filter((d) => CRAFTS.includes(d.title))
              .map((d) => (
                <li key={d.title}>
                  <ParentGateLink href={d.url} className="flex w-full items-center gap-3 rounded-[20px] bg-cream p-3 text-left active:scale-[0.99]">
                    <Image src={animalsById[d.animal].image} alt="" className="size-11 shrink-0 object-contain" sizes="44px" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14.5px] font-bold text-ink">{d.title}</span>
                      <span className="block truncate text-[12.5px] font-medium text-ink-soft">{d.text}</span>
                    </span>
                    <ExternalLink className="size-4 shrink-0 text-ink-soft" aria-hidden />
                  </ParentGateLink>
                </li>
              ))}
          </ul>
        </Section>
      </Sheet>
    </Screen>
  );
}
