import type { Metadata } from "next";
import Image from "next/image";

import { DailyAffirmation } from "@/components/animals/daily-affirmation";
import { AppLink } from "@/components/ui/app-link";
import { ModuleHero, Sheet } from "@/components/ui/module-hero";
import { PageHeader } from "@/components/ui/page-header";
import { Screen } from "@/components/ui/screen";
import { Section } from "@/components/ui/section";
import { animals, animalsById } from "@/content/animals";

export const metadata: Metadata = {
  title: "Tierfreunde",
  description: "Die YOGITIER-Bande: Leo, Benno, Emmi, Kimi, Luka, Diego, Eddy und Freddi – mit Mutmacher-Sätzen und Lieblingsübungen.",
};

export default function TierfreundePage() {
  return (
    <Screen>
      <PageHeader back="/" background="#FBEBC4" backLabel="Zurück zum Menü" />
      <ModuleHero title="Tierfreunde" text="Lerne die YOGITIER-Bande kennen – jedes Tier hat einen Mutmacher-Satz für dich." image={animalsById.leo.image} color="#FBEBC4" vt="tile-tierfreunde" />
      <Sheet>
        <DailyAffirmation />
        <Section title="Die YOGITIER-Bande" subtitle="Tippe auf ein Tier">
          <ul className="grid grid-cols-2 gap-3">
            {animals.map((a, i) => (
              <li key={a.id}>
                <AppLink href={`/tierfreunde/${a.id}`} className="flex h-full flex-col items-center rounded-[26px] px-3 pb-4 pt-5 text-center transition active:scale-[0.97]" style={{ background: a.soft }}>
                  <Image src={a.image} alt="" className="h-[84px] w-auto max-w-[100px] object-contain animate-float" style={{ animationDelay: `${i * 0.3}s` }} sizes="100px" />
                  <span className="mt-3 block text-[16px] font-bold text-ink">{a.fullName}</span>
                  <span className="mt-1 block text-[12.5px] font-semibold leading-snug text-ink-soft">„{a.affirmation}“</span>
                </AppLink>
              </li>
            ))}
          </ul>
        </Section>
      </Sheet>
    </Screen>
  );
}
