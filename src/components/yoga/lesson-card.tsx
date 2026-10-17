import { Clock, Play } from "lucide-react";
import Image from "next/image";

import { AppLink } from "@/components/ui/app-link";
import { Pill } from "@/components/ui/section";
import { animalsById } from "@/content/animals";
import { lessonMinutes } from "@/content/lessons";
import type { Lesson } from "@/content/types";

export function LessonCard({ lesson }: { lesson: Lesson }) {
  const host = animalsById[lesson.host];
  return (
    <AppLink
      href={`/yoga/stunde/${lesson.slug}`}
      className="flex items-center gap-3 rounded-[24px] p-3 pr-4 transition hover:-translate-y-0.5 active:scale-[0.98]"
      style={{ background: lesson.color }}
    >
      <span className="grid size-[68px] shrink-0 place-items-center rounded-[20px] bg-white/55">
        <Image src={host.image} alt="" className="h-12 w-12 object-contain" sizes="48px" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[16px] font-bold leading-tight text-ink">{lesson.title}</span>
        <span className="mt-0.5 block truncate text-[12.5px] font-medium text-ink-soft">{lesson.subtitle}</span>
        <span className="mt-2 flex flex-wrap gap-1.5">
          <Pill>
            <Clock className="size-3.5" aria-hidden /> {lessonMinutes(lesson)} Min.
          </Pill>
          <Pill>{lesson.tag}</Pill>
        </span>
      </span>
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-ink shadow-sm">
        <Play className="ml-0.5 size-4 fill-ink" aria-hidden />
      </span>
    </AppLink>
  );
}
