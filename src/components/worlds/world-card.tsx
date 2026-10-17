"use client";

import { Check, Clock, Play } from "lucide-react";
import Image from "next/image";

import { AppLink } from "@/components/ui/app-link";
import { animalsById } from "@/content/animals";
import { categoryLabels, worldThemes } from "@/content/worlds";
import { worldMinutes } from "@/lib/studio/store";
import type { World } from "@/lib/studio/types";
import { cn } from "@/lib/cn";

import { WorldScene } from "./world-scene";

/** Vorschaubild einer Lernwelt: Umgebung + Begleiter */
export function WorldCover({ world, className, size = "md" }: { world: Pick<World, "theme" | "guide">; className?: string; size?: "sm" | "md" | "lg" }) {
  const guide = animalsById[world.guide];
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <WorldScene theme={world.theme} compact className="absolute inset-0" />
      <Image
        src={guide.image}
        alt=""
        className={cn(
          "absolute bottom-[10%] left-1/2 w-auto -translate-x-1/2 object-contain drop-shadow-[0_6px_10px_rgb(0_0_0/0.15)]",
          size === "sm" ? "h-[46%]" : size === "lg" ? "h-[52%]" : "h-[50%]",
        )}
        sizes="140px"
      />
    </div>
  );
}

export function WorldCard({ world, progress, minutes }: { world: World; progress: { done: number; completed: boolean }; minutes?: number }) {
  const total = world.steps.length;
  const dark = worldThemes[world.theme].dark;
  return (
    <AppLink href={`/welten/${world.id}`} className="block overflow-hidden rounded-[26px] bg-white ring-1 ring-line transition active:scale-[0.98]">
      <div className="relative">
        <WorldCover world={world} className="h-[150px] w-full" />
        <span className={cn("absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11.5px] font-bold", dark ? "bg-white/20 text-white" : "bg-white/85 text-ink")}>
          {categoryLabels[world.category]}
        </span>
        <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white text-ink shadow-md">
          {progress.completed ? <Check className="size-4" strokeWidth={3} aria-hidden /> : <Play className="ml-0.5 size-4 fill-ink" aria-hidden />}
        </span>
      </div>
      <div className="p-3.5">
        <p className="text-[16px] font-bold leading-tight text-ink">{world.title}</p>
        <p className="mt-0.5 line-clamp-2 text-[12.5px] font-medium leading-snug text-ink-soft">{world.subtitle}</p>
        <div className="mt-2.5 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-cream px-2.5 py-1 text-[11.5px] font-bold text-ink">
            <Clock className="size-3.5" aria-hidden /> {minutes ?? worldMinutes(world)} Min.
          </span>
          <span className="text-[11.5px] font-bold text-ink-soft">{world.age}</span>
          <span className="ml-auto text-[11.5px] font-bold text-ink-soft">
            {progress.completed ? `${world.reward.emoji} geschafft` : `${progress.done}/${total}`}
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-cream" aria-hidden>
          <div className="h-full rounded-full" style={{ width: `${total ? (Math.min(progress.done, total) / total) * 100 : 0}%`, background: world.accent }} />
        </div>
      </div>
    </AppLink>
  );
}
