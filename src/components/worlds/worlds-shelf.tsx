"use client";

import { ArrowRight, Sparkles } from "lucide-react";

import { AppLink } from "@/components/ui/app-link";
import { useStudio } from "@/lib/studio/store";
import type { WorldCategory } from "@/lib/studio/types";
import { useAppState, useHydrated } from "@/lib/store";

import { WorldCard } from "./world-card";

/**
 * Veröffentlichte Lernwelten aus dem YOGITIER® Studio.
 * `categories` filtert passend zum Bereich (z. B. Yoga & Bewegung).
 */
export function WorldsShelf({
  title = "Lernwelten",
  subtitle = "Neu aus dem YOGITIER® Studio",
  categories,
  layout = "scroll",
  showAllLink = true,
}: {
  title?: string;
  subtitle?: string;
  categories?: WorldCategory[];
  layout?: "scroll" | "grid";
  showAllLink?: boolean;
}) {
  const hydrated = useHydrated();
  const studio = useStudio();
  const { worldProgress } = useAppState();

  if (!hydrated || !studio.ready) {
    return (
      <section className="mt-7 px-5" aria-busy="true">
        <div className="h-6 w-40 animate-pulse rounded-full bg-cream" />
        <div className="mt-3 h-[250px] animate-pulse rounded-[26px] bg-cream" />
      </section>
    );
  }

  const featured = studio.settings.featuredWorldId;
  const list = studio.worlds
    .filter((w) => w.status === "veroeffentlicht" && w.steps.length > 0)
    .filter((w) => !categories || categories.includes(w.category))
    .sort((a, b) => Number(b.id === featured) - Number(a.id === featured));

  if (list.length === 0) return null;

  const progressOf = (id: string, total: number) => {
    const p = worldProgress[id];
    return { done: p?.done.length ?? 0, completed: !!p?.completedAt || (total > 0 && (p?.done.length ?? 0) >= total) };
  };

  return (
    <section className="mt-7">
      <div className="mb-3 flex items-end justify-between gap-3 px-5">
        <div>
          <h2 className="flex items-center gap-1.5 text-[19px] font-bold text-ink">
            <Sparkles className="size-[18px] text-brand-orange" aria-hidden /> {title}
          </h2>
          <p className="mt-0.5 text-[13px] font-medium text-ink-soft">{subtitle}</p>
        </div>
        {showAllLink && (
          <AppLink href="/welten" className="inline-flex shrink-0 items-center gap-1 text-[13px] font-bold text-ink">
            Alle <ArrowRight className="size-4" aria-hidden />
          </AppLink>
        )}
      </div>
      {layout === "scroll" ? (
        <div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1">
          {list.map((w) => (
            <div key={w.id} className="w-[78%] shrink-0 snap-start">
              <WorldCard world={w} progress={progressOf(w.id, w.steps.length)} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-3 px-5">
          {list.map((w) => (
            <WorldCard key={w.id} world={w} progress={progressOf(w.id, w.steps.length)} />
          ))}
        </div>
      )}
    </section>
  );
}
