import { Heart, Lightbulb } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { PoseTry } from "@/components/player/lesson-start";
import { PoseArtView } from "@/components/poses/pose-art";
import { AppLink } from "@/components/ui/app-link";
import { PageHeader } from "@/components/ui/page-header";
import { Screen } from "@/components/ui/screen";
import { Pill, Section } from "@/components/ui/section";
import { DetailSkeleton } from "@/components/ui/skeleton";
import { SpeakButton } from "@/components/ui/speak-button";
import { LessonCard } from "@/components/yoga/lesson-card";
import { animalsById } from "@/content/animals";
import { lessonsWithPose } from "@/content/lessons";
import { categoryLabel, getPose, poses } from "@/content/poses";

export function generateStaticParams() {
  return poses.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/yoga/uebungen/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const pose = getPose(slug);
  return pose ? { title: pose.name, description: `${pose.name}: ${pose.steps[0]} ${pose.benefit}` } : { title: "Übung" };
}

export default function PosePage({ params }: PageProps<"/yoga/uebungen/[slug]">) {
  return (
    <Screen>
      <Suspense fallback={<DetailSkeleton />}>
        <PoseDetail params={params} />
      </Suspense>
    </Screen>
  );
}

async function PoseDetail({ params }: { params: PageProps<"/yoga/uebungen/[slug]">["params"] }) {
  const { slug } = await params;
  const pose = getPose(slug);
  if (!pose) notFound();
  const host = pose.host ? animalsById[pose.host] : undefined;
  const inLessons = lessonsWithPose(pose.slug);

  return (
    <>
      <PageHeader back="/yoga/uebungen" background={pose.color} title={pose.name} />
      <div className="px-5 pb-10 text-center" style={{ background: pose.color }}>
        <div className="mx-auto size-[220px]">
          <PoseArtView pose={pose} sizes="220px" eager />
        </div>
        <h1 className="mt-1 text-[28px] font-bold text-ink-strong">{pose.name}</h1>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          <Pill>{pose.winter ? "Winter" : categoryLabel[pose.category]}</Pill>
          <Pill>{pose.level === "leicht" ? "Leicht" : "Mittel"}</Pill>
          {pose.sound && <Pill>Sag mit: „{pose.sound}“</Pill>}
        </div>
      </div>

      <div className="relative -mt-6 rounded-t-[30px] bg-white pt-1">
        <Section title="So geht's" action={<SpeakButton text={pose.steps.join(" ")} />}>
          <ol className="flex flex-col gap-2.5">
            {pose.steps.map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-full text-[14px] font-bold text-ink" style={{ background: pose.color }}>
                  {i + 1}
                </span>
                <p className="pt-1 text-[15px] font-medium leading-snug text-ink">{s}</p>
              </li>
            ))}
          </ol>
        </Section>

        <div className="mx-5 mt-6 grid gap-3">
          <div className="flex gap-3 rounded-[22px] bg-besonderes p-4">
            <Heart className="mt-0.5 size-5 shrink-0 text-brand-pink" fill="currentColor" aria-hidden />
            <div>
              <p className="text-[14px] font-bold text-ink">Das tut dir gut</p>
              <p className="text-[14px] font-medium text-ink">{pose.benefit}</p>
            </div>
          </div>
          {host && (
            <AppLink href={`/tierfreunde/${host.id}`} className="flex items-center gap-3 rounded-[22px] p-3 pr-4 active:scale-[0.99]" style={{ background: host.soft }}>
              <Image src={host.image} alt="" className="size-12 object-contain" sizes="48px" />
              <p className="text-[14px] font-bold text-ink">
                Lieblingsübung von {host.fullName}
                <span className="block text-[12.5px] font-medium text-ink-soft">„{host.affirmation}“</span>
              </p>
            </AppLink>
          )}
          <div className="flex gap-3 rounded-[22px] border border-dashed border-line p-4">
            <Lightbulb className="mt-0.5 size-5 shrink-0 text-brand-orange" aria-hidden />
            <div>
              <p className="text-[14px] font-bold text-ink">Tipp für Eltern</p>
              <p className="text-[13.5px] font-medium leading-relaxed text-ink-soft">{pose.parentTip}</p>
            </div>
          </div>
        </div>

        {inLessons.length > 0 && (
          <Section title="Kommt vor in">
            <ul className="flex flex-col gap-3">
              {inLessons.map((l) => (
                <li key={l.slug}>
                  <LessonCard lesson={l} />
                </li>
              ))}
            </ul>
          </Section>
        )}

        <PoseTry slug={pose.slug} />
      </div>
    </>
  );
}
