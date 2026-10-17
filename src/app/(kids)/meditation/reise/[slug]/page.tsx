import { BookOpen, Clock, Moon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { JourneyStart } from "@/components/meditation/journey-player";
import { PageHeader } from "@/components/ui/page-header";
import { Screen } from "@/components/ui/screen";
import { Pill, Section } from "@/components/ui/section";
import { DetailSkeleton } from "@/components/ui/skeleton";
import { animalsById } from "@/content/animals";
import { getJourney, journeyMinutes, journeys, journeyThemes } from "@/content/journeys";

export function generateStaticParams() {
  return journeys.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: PageProps<"/meditation/reise/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const j = getJourney(slug);
  return j ? { title: j.title, description: j.description } : { title: "Fantasiereise" };
}

export default function JourneyPage({ params }: PageProps<"/meditation/reise/[slug]">) {
  return (
    <Screen>
      <Suspense fallback={<DetailSkeleton />}>
        <JourneyDetail params={params} />
      </Suspense>
    </Screen>
  );
}

async function JourneyDetail({ params }: { params: PageProps<"/meditation/reise/[slug]">["params"] }) {
  const { slug } = await params;
  const j = getJourney(slug);
  if (!j) notFound();
  const host = animalsById[j.host];
  const t = journeyThemes[j.theme];

  return (
    <>
      <PageHeader back={j.winter ? "/besonderes" : "/meditation"} background={t.from} />
      <div className="px-5 pb-10" style={{ background: `linear-gradient(180deg, ${t.from}, ${t.to})` }}>
        <div className="flex flex-col items-center text-center">
          <Image src={host.image} alt={host.fullName} className="h-[110px] w-auto object-contain animate-float" sizes="120px" loading="eager" />
          <p className="mt-3 text-[12.5px] font-bold uppercase tracking-wider text-ink-soft">Fantasiereise mit {host.name}</p>
          <h1 className="mt-0.5 text-[28px] font-bold leading-tight text-ink-strong">{j.title}</h1>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <Pill>
              <Clock className="size-3.5" aria-hidden /> ca. {journeyMinutes(j)} Min.
            </Pill>
            <Pill>{j.purpose}</Pill>
            <Pill>
              <BookOpen className="size-3.5" aria-hidden /> {j.paragraphs.length} Abschnitte
            </Pill>
          </div>
        </div>
      </div>

      <div className="relative -mt-6 rounded-t-[30px] bg-white pt-1">
        <section className="mx-5 mt-5 rounded-[24px] bg-cream p-4">
          <p className="text-[15px] font-medium leading-relaxed text-ink">{j.description}</p>
          <p className="mt-3 border-l-4 pl-3 text-[14.5px] font-medium italic leading-relaxed text-ink-soft" style={{ borderColor: t.accent }}>
            „{j.paragraphs[2]}“
          </p>
        </section>

        <Section title="So wird's gemütlich">
          <ul className="flex flex-col gap-2.5">
            {[
              "Dimmt das Licht und macht es euch auf der Matte oder im Bett bequem.",
              "Eine kuschelige Decke oder eine Augenmaske helfen beim Abschalten.",
              "Die Vorlesestimme liest die Reise langsam vor – oder ihr lest sie selbst.",
            ].map((tip) => (
              <li key={tip} className="flex gap-3">
                <Moon className="mt-0.5 size-5 shrink-0 text-lilac" aria-hidden />
                <p className="text-[14.5px] font-medium leading-snug text-ink">{tip}</p>
              </li>
            ))}
          </ul>
        </Section>

        <JourneyStart slug={j.slug} />
      </div>
    </>
  );
}
