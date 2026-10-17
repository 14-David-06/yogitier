import { Clock } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

import { AppLink } from "@/components/ui/app-link";
import { ModuleHero, Sheet } from "@/components/ui/module-hero";
import { PageHeader } from "@/components/ui/page-header";
import { Screen } from "@/components/ui/screen";
import { Pill, Section } from "@/components/ui/section";
import { WorldsShelf } from "@/components/worlds/worlds-shelf";
import { animalsById } from "@/content/animals";
import { breathing, breathSeconds } from "@/content/breathing";
import { journeyMinutes, journeys, journeyThemes } from "@/content/journeys";

export const metadata: Metadata = {
  title: "Meditation",
  description: "Atemübungen und Fantasiereisen für Kinder – gegen Wut, bei Angst und zum Einschlafen.",
};

const HELP = [
  { label: "Bei Wut", href: "/meditation/atmen/loewenatem", color: "#F8CDBE" },
  { label: "Bei Angst", href: "/meditation/atmen/bienen-summen", color: "#DCEBD0" },
  { label: "Zum Einschlafen", href: "/meditation/atmen/kuscheltier-atmung", color: "#E2DDF5" },
  { label: "Wenn ich traurig bin", href: "/meditation/reise/zauberwald", color: "#D3E3F3" },
  { label: "Für mehr Mut", href: "/meditation/reise/sonnenplatz", color: "#FBEBC4" },
];

export default function MeditationPage() {
  return (
    <Screen>
      <PageHeader back="/" background="#E7E2F8" backLabel="Zurück zum Menü" />
      <ModuleHero title="Meditation" text="Atmen, träumen und zur Ruhe kommen – mit Emmi und ihren Freunden." image={animalsById.emmi.image} color="#E7E2F8" vt="tile-meditation" />
      <Sheet>
        <Section title="Was hilft mir gerade?" className="mt-5">
          <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
            {HELP.map((h) => (
              <AppLink key={h.href} href={h.href} className="shrink-0 rounded-full px-4 py-2 text-[14px] font-bold text-ink transition active:scale-95" style={{ background: h.color }}>
                {h.label}
              </AppLink>
            ))}
          </div>
        </Section>

        <WorldsShelf title="Ruhe-Lernwelten" subtitle="Traumreisen & Rituale aus dem Studio" categories={["atmung", "achtsamkeit", "schlaf"]} />

        <Section title="Atemübungen" subtitle="Kleine Atem-Tricks für große Gefühle">
          <ul className="grid grid-cols-2 gap-3">
            {breathing.map((b) => {
              const host = animalsById[b.host];
              return (
                <li key={b.slug}>
                  <AppLink href={`/meditation/atmen/${b.slug}`} className="flex h-full flex-col rounded-[24px] p-3.5 transition active:scale-[0.97]" style={{ background: b.color }}>
                    <Image src={host.image} alt="" className="h-14 w-14 object-contain" sizes="56px" />
                    <span className="mt-3 block text-[15px] font-bold leading-tight text-ink">{b.title}</span>
                    <span className="mt-0.5 block text-[12px] font-medium text-ink-soft">{b.purpose}</span>
                    <span className="mt-2 text-[12px] font-bold text-ink-soft">ca. {Math.max(1, Math.round(breathSeconds(b) / 60))} Min.</span>
                  </AppLink>
                </li>
              );
            })}
          </ul>
        </Section>

        <Section title="Fantasiereisen" subtitle="Augen zu – und los geht die Reise">
          <ul className="flex flex-col gap-3">
            {journeys.map((j) => {
              const host = animalsById[j.host];
              const t = journeyThemes[j.theme];
              return (
                <li key={j.slug}>
                  <AppLink
                    href={`/meditation/reise/${j.slug}`}
                    className="flex items-center gap-3 rounded-[24px] p-3 pr-4 transition active:scale-[0.98]"
                    style={{ background: `linear-gradient(120deg, ${t.from}, ${t.to})` }}
                  >
                    <span className="grid size-[68px] shrink-0 place-items-center rounded-[20px] bg-white/60">
                      <Image src={host.image} alt="" className="h-12 w-12 object-contain" sizes="48px" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[16px] font-bold text-ink">{j.title}</span>
                      <span className="mt-0.5 block text-[12.5px] font-medium leading-snug text-ink-soft">{j.description}</span>
                      <span className="mt-2 flex gap-1.5">
                        <Pill>
                          <Clock className="size-3.5" aria-hidden /> {journeyMinutes(j)} Min.
                        </Pill>
                        <Pill>{j.purpose}</Pill>
                      </span>
                    </span>
                  </AppLink>
                </li>
              );
            })}
          </ul>
        </Section>

        <section className="mx-5 mt-7 rounded-[24px] border border-dashed border-line p-4">
          <h2 className="text-[14px] font-bold text-ink">Für Eltern</h2>
          <p className="mt-1 text-[13.5px] font-medium leading-relaxed text-ink-soft">
            Atemübungen sind der schnellste Weg, das Nervensystem zu beruhigen. Übt sie in ruhigen Momenten – dann sind sie in aufgeregten
            Momenten wie ein vertrauter Anker.
          </p>
        </section>
      </Sheet>
    </Screen>
  );
}
