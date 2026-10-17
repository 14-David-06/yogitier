import { ChevronLeft, ChevronRight, Lightbulb, ShoppingBag, Zap } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { PoseArtView } from "@/components/poses/pose-art";
import { AppLink } from "@/components/ui/app-link";
import { PageHeader } from "@/components/ui/page-header";
import { ParentGateLink } from "@/components/ui/parent-gate";
import { Screen } from "@/components/ui/screen";
import { Pill, Section } from "@/components/ui/section";
import { DetailSkeleton } from "@/components/ui/skeleton";
import { SpeakButton } from "@/components/ui/speak-button";
import { animals, getAnimal } from "@/content/animals";
import { getBreath } from "@/content/breathing";
import { getPose } from "@/content/poses";

export function generateStaticParams() {
  return animals.map((a) => ({ slug: a.id }));
}

export async function generateMetadata({ params }: PageProps<"/tierfreunde/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const a = getAnimal(slug);
  return a ? { title: a.fullName, description: `${a.fullName} sagt: ${a.affirmation} ${a.intro}` } : { title: "Tierfreund" };
}

export default function AnimalPage({ params }: PageProps<"/tierfreunde/[slug]">) {
  return (
    <Screen>
      <Suspense fallback={<DetailSkeleton />}>
        <AnimalDetail params={params} />
      </Suspense>
    </Screen>
  );
}

async function AnimalDetail({ params }: { params: PageProps<"/tierfreunde/[slug]">["params"] }) {
  const { slug } = await params;
  const a = getAnimal(slug);
  if (!a) notFound();
  const idx = animals.findIndex((x) => x.id === a.id);
  const prev = animals[(idx - 1 + animals.length) % animals.length];
  const next = animals[(idx + 1) % animals.length];
  const pose = getPose(a.favoritePose);
  const breath = getBreath(a.favoriteBreath);

  return (
    <>
      <PageHeader back="/tierfreunde" background={a.soft} title={a.fullName} />
      <div className="px-5 pb-10 text-center" style={{ background: a.soft }}>
        <Image src={a.image} alt={a.fullName} className="mx-auto h-[150px] w-auto max-w-[200px] object-contain animate-float" sizes="200px" loading="eager" />
        <h1 className="mt-3 text-[30px] font-bold text-ink-strong">{a.fullName}</h1>
        <div className="mt-2 flex justify-center gap-2">
          <Pill>{a.species}</Pill>
          <Pill>ist {a.trait}</Pill>
        </div>
      </div>

      <div className="relative -mt-6 rounded-t-[30px] bg-white pb-10 pt-1">
        <section className="mx-5 mt-5 rounded-[26px] p-5 text-center" style={{ background: a.color, color: a.ink }}>
          <p className="text-[13px] font-bold uppercase tracking-wider opacity-80">{a.name} sagt</p>
          <p className="mt-1 text-[28px] font-bold leading-tight">„{a.affirmation}“</p>
          <p className="mt-2 text-[13.5px] font-semibold opacity-85">Sag es laut nach – dreimal, jedes Mal ein bisschen lauter!</p>
          <SpeakButton text={`${a.affirmation} … Jetzt du! ${a.affirmation}`} label="Sprich mit!" className="mt-3 text-ink" />
        </section>

        <Section title={`Das ist ${a.name}`}>
          <p className="text-[15px] font-medium leading-relaxed text-ink">{a.intro}</p>
        </Section>

        <div className="mx-5 mt-5 grid gap-3">
          <div className="flex gap-3 rounded-[22px] bg-cream p-4">
            <Zap className="mt-0.5 size-5 shrink-0 text-brand-orange" fill="currentColor" aria-hidden />
            <div>
              <p className="text-[14px] font-bold text-ink">Superkraft</p>
              <p className="text-[14px] font-medium leading-snug text-ink">{a.superpower}</p>
            </div>
          </div>
          <div className="flex gap-3 rounded-[22px] border border-dashed border-line p-4">
            <Lightbulb className="mt-0.5 size-5 shrink-0 text-brand-orange" aria-hidden />
            <div>
              <p className="text-[14px] font-bold text-ink">Wusstest du schon?</p>
              <p className="text-[14px] font-medium leading-snug text-ink">{a.funFact}</p>
            </div>
          </div>
        </div>

        <Section title={`${a.name}s Lieblinge`}>
          <div className="grid grid-cols-2 gap-3">
            {pose && (
              <AppLink href={`/yoga/uebungen/${pose.slug}`} className="flex flex-col rounded-[24px] p-3 active:scale-[0.97]" style={{ background: pose.color }}>
                <span className="mx-auto block size-24">
                  <PoseArtView pose={pose} sizes="96px" />
                </span>
                <span className="mt-1 text-[11.5px] font-bold uppercase tracking-wider text-ink-soft">Übung</span>
                <span className="text-[15px] font-bold text-ink">{pose.name}</span>
              </AppLink>
            )}
            {breath && (
              <AppLink href={`/meditation/atmen/${breath.slug}`} className="flex flex-col rounded-[24px] p-3 active:scale-[0.97]" style={{ background: breath.color }}>
                <span className="mx-auto grid size-24 place-items-center">
                  <Image src={a.image} alt="" className="h-16 w-auto object-contain" sizes="64px" />
                </span>
                <span className="mt-1 text-[11.5px] font-bold uppercase tracking-wider text-ink-soft">Atemübung</span>
                <span className="text-[15px] font-bold text-ink">{breath.title}</span>
              </AppLink>
            )}
          </div>
        </Section>

        {a.mat && (
          <Section title={`${a.name} zum Ausrollen`}>
            <div className="flex items-center gap-4 rounded-[24px] border border-line p-4">
              <div className="relative h-[86px] w-[64px] shrink-0 rounded-[14px] shadow-md" style={{ background: a.color }}>
                <Image src={a.image} alt="" className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 object-contain" sizes="48px" />
                <span className="absolute inset-x-2 bottom-1.5 h-1 rounded-full bg-white/50" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[14.5px] font-bold leading-snug text-ink">{a.mat.title}</p>
                <p className="mt-0.5 text-[12.5px] font-medium text-ink-soft">Waschbar, faltbar, schadstofffrei · {a.mat.price}</p>
                <ParentGateLink href={a.mat.url} className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 text-[13px] font-bold text-white active:scale-95">
                  <ShoppingBag className="size-4" aria-hidden /> Im Shop ansehen
                </ParentGateLink>
              </div>
            </div>
          </Section>
        )}

        <nav className="mx-5 mt-8 flex gap-3" aria-label="Weitere Tierfreunde">
          <AppLink href={`/tierfreunde/${prev.id}`} direction="back" className="flex flex-1 items-center gap-2 rounded-[20px] bg-cream p-3 active:scale-[0.98]">
            <ChevronLeft className="size-5 shrink-0 text-ink" aria-hidden />
            <Image src={prev.image} alt="" className="size-9 object-contain" sizes="36px" />
            <span className="truncate text-[14px] font-bold text-ink">{prev.name}</span>
          </AppLink>
          <AppLink href={`/tierfreunde/${next.id}`} className="flex flex-1 items-center justify-end gap-2 rounded-[20px] bg-cream p-3 active:scale-[0.98]">
            <span className="truncate text-[14px] font-bold text-ink">{next.name}</span>
            <Image src={next.image} alt="" className="size-9 object-contain" sizes="36px" />
            <ChevronRight className="size-5 shrink-0 text-ink" aria-hidden />
          </AppLink>
        </nav>
      </div>
    </>
  );
}
