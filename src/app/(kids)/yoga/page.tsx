import { Dices, LayoutGrid } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

import frosch from "@/assets/poses/frosch.png";

import { PoseArtView } from "@/components/poses/pose-art";
import { AppLink } from "@/components/ui/app-link";
import { ModuleHero, Sheet } from "@/components/ui/module-hero";
import { PageHeader } from "@/components/ui/page-header";
import { Screen } from "@/components/ui/screen";
import { Section } from "@/components/ui/section";
import { WorldsShelf } from "@/components/worlds/worlds-shelf";
import { LessonCard } from "@/components/yoga/lesson-card";
import { TodayPick } from "@/components/yoga/today-pick";
import { animalsById } from "@/content/animals";
import { lessons } from "@/content/lessons";
import { getPose, poses } from "@/content/poses";

export const metadata: Metadata = {
  title: "Yoga",
  description: "Geführte Yoga-Stunden, der Yoga-Würfel und alle Tier-Übungen der YOGITIER-Bande.",
};

const PREVIEW = ["flamingo", "katze", "loewe", "baum"];

export default function YogaPage() {
  return (
    <Screen>
      <PageHeader back="/" background="#EFE2D4" backLabel="Zurück zum Menü" />
      <ModuleHero title="Yoga" text="Bewege dich wie die Tiere – mit Benno und der ganzen Bande!" image={animalsById.benno.image} color="#EFE2D4" vt="tile-yoga" />
      <Sheet>
        <TodayPick />

        <WorldsShelf title="Video-Lernwelten" subtitle="Mitmach-Videos & Bewegungspausen aus dem Studio" categories={["yoga", "bewegung"]} />

        <Section title="Yoga-Stunden" subtitle="Mit Geschichte, Timer und Vorlesestimme">
          <ul className="flex flex-col gap-3">
            {lessons
              .filter((l) => !l.winter)
              .map((l) => (
                <li key={l.slug}>
                  <LessonCard lesson={l} />
                </li>
              ))}
          </ul>
        </Section>

        <Section title="Spielen & Entdecken">
          <div className="grid grid-cols-2 gap-3">
            <AppLink href="/yoga/wuerfel" className="relative flex flex-col overflow-hidden rounded-[24px] bg-memo p-4 transition active:scale-[0.97]">
              <span className="grid size-11 place-items-center rounded-2xl bg-white/70">
                <Dices className="size-6 text-ink" strokeWidth={1.8} aria-hidden />
              </span>
              <Image src={frosch} alt="" className="absolute -right-1 top-9 h-[104px] w-auto object-contain" sizes="100px" />
              <span className="mt-auto pt-6 text-[16px] font-bold text-ink">Yoga-Würfel</span>
              <span className="text-[12.5px] font-medium text-ink-soft">Würfeln & mitmachen</span>
            </AppLink>
            <AppLink href="/yoga/uebungen" className="flex flex-col rounded-[24px] bg-meditation p-4 transition active:scale-[0.97]">
              <span className="grid grid-cols-2 gap-1">
                {PREVIEW.map((slug) => {
                  const p = getPose(slug);
                  return p ? (
                    <span key={slug} className="grid aspect-square place-items-center rounded-xl bg-white/60 p-0.5">
                      <PoseArtView pose={p} sizes="40px" />
                    </span>
                  ) : null;
                })}
              </span>
              <span className="mt-3 flex items-center gap-1.5 text-[16px] font-bold text-ink">
                <LayoutGrid className="size-4" aria-hidden /> Alle Übungen
              </span>
              <span className="text-[12.5px] font-medium text-ink-soft">{poses.length} Tier-Übungen</span>
            </AppLink>
          </div>
        </Section>

        <section className="mx-5 mt-7 rounded-[24px] border border-dashed border-line p-4">
          <h2 className="text-[14px] font-bold text-ink">Für Eltern</h2>
          <p className="mt-1 text-[13.5px] font-medium leading-relaxed text-ink-soft">
            Schon 10 Minuten am Tag reichen für ein schönes Ritual. Es geht um Bewegung ohne Druck – nicht um perfekte Haltungen. Wackeln und
            Lachen sind ausdrücklich erlaubt!
          </p>
        </section>
      </Sheet>
    </Screen>
  );
}
