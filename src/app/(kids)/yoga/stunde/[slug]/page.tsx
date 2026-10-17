import { Clock, Layers, Shirt, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { LessonStart } from "@/components/player/lesson-start";
import { PoseArtView } from "@/components/poses/pose-art";
import { AppLink } from "@/components/ui/app-link";
import { PageHeader } from "@/components/ui/page-header";
import { Screen } from "@/components/ui/screen";
import { Pill, Section } from "@/components/ui/section";
import { DetailSkeleton } from "@/components/ui/skeleton";
import { SpeakButton } from "@/components/ui/speak-button";
import { animalsById } from "@/content/animals";
import { getLesson, lessonMinutes, lessons } from "@/content/lessons";
import { getPose } from "@/content/poses";

export function generateStaticParams() {
  return lessons.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: PageProps<"/yoga/stunde/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLesson(slug);
  return lesson ? { title: lesson.title, description: lesson.intro } : { title: "Yoga-Stunde" };
}

export default function LessonPage({ params }: PageProps<"/yoga/stunde/[slug]">) {
  return (
    <Screen>
      <Suspense fallback={<DetailSkeleton />}>
        <LessonDetail params={params} />
      </Suspense>
    </Screen>
  );
}

async function LessonDetail({ params }: { params: PageProps<"/yoga/stunde/[slug]">["params"] }) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();
  const host = animalsById[lesson.host];
  const minutes = lessonMinutes(lesson);

  return (
    <>
      <PageHeader back={lesson.winter ? "/besonderes" : "/yoga"} background={lesson.color} />
      <div className="px-5 pb-10" style={{ background: lesson.color }}>
        <div className="flex items-center gap-4">
          <Image src={host.image} alt={host.fullName} className="h-[104px] w-[104px] shrink-0 object-contain animate-float" sizes="110px" loading="eager" />
          <div className="min-w-0">
            <p className="text-[12.5px] font-bold uppercase tracking-wider text-ink-soft">mit {host.fullName}</p>
            <h1 className="mt-0.5 text-[27px] font-bold leading-tight text-ink-strong">{lesson.title}</h1>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Pill>
            <Clock className="size-3.5" aria-hidden /> ca. {minutes} Min.
          </Pill>
          <Pill>{lesson.age}</Pill>
          <Pill>{lesson.level === "leicht" ? "Leicht" : "Mittel"}</Pill>
          <Pill>{lesson.tag}</Pill>
        </div>
      </div>

      <div className="relative -mt-6 rounded-t-[30px] bg-white pt-1">
        <section className="mx-5 mt-5 rounded-[24px] bg-cream p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[16px] font-bold text-ink">Die Geschichte</h2>
            <SpeakButton text={lesson.intro} />
          </div>
          <p className="mt-2 text-[15px] font-medium leading-relaxed text-ink">{lesson.intro}</p>
        </section>

        <ul className="mx-5 mt-4 grid grid-cols-3 gap-2 text-center">
          {[
            { icon: Layers, text: "Deine Yogamatte" },
            { icon: Shirt, text: "Bequeme Kleidung" },
            { icon: Sparkles, text: "Viel Neugier" },
          ].map(({ icon: Icon, text }) => (
            <li key={text} className="rounded-[18px] border border-line px-2 py-3">
              <Icon className="mx-auto size-5 text-ink-soft" strokeWidth={1.8} aria-hidden />
              <span className="mt-1 block text-[12px] font-bold text-ink">{text}</span>
            </li>
          ))}
        </ul>

        <Section title={`${lesson.steps.length} Übungen`} subtitle="Tippe auf eine Übung, um sie genauer anzuschauen.">
          <ol className="flex flex-col gap-2">
            {lesson.steps.map((s, i) => {
              const pose = getPose(s.pose);
              if (!pose) return null;
              return (
                <li key={`${s.pose}-${i}`}>
                  <AppLink href={`/yoga/uebungen/${pose.slug}`} className="flex items-center gap-3 rounded-[20px] p-2 pr-4 transition hover:bg-cream active:scale-[0.99]">
                    <span className="grid size-14 shrink-0 place-items-center rounded-[16px]" style={{ background: pose.color }}>
                      <span className="block size-12">
                        <PoseArtView pose={pose} sizes="48px" />
                      </span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-bold text-ink">
                        {i + 1}. {pose.name}
                      </span>
                      <span className="block truncate text-[12.5px] font-medium text-ink-soft">{s.cue}</span>
                    </span>
                    <span className="shrink-0 text-[13px] font-bold tabular-nums text-ink-soft">{s.seconds} Sek.</span>
                  </AppLink>
                </li>
              );
            })}
          </ol>
        </Section>

        <section className="mx-5 mt-6 rounded-[24px] border border-dashed border-line p-4">
          <h2 className="text-[14px] font-bold text-ink">Tipp für Eltern</h2>
          <p className="mt-1 text-[13.5px] font-medium leading-relaxed text-ink-soft">
            Macht gemeinsam mit – Kinder lieben es, wenn Erwachsene mitturnen. Die Vorlesestimme führt durch die Stunde; ihr könnt sie oben im
            Player jederzeit ausschalten und selbst erzählen.
          </p>
        </section>

        <LessonStart slug={lesson.slug} />
      </div>
    </>
  );
}
