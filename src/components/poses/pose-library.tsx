"use client";

import { useState } from "react";

import { AppLink } from "@/components/ui/app-link";
import { poseCategories, poses } from "@/content/poses";
import { cn } from "@/lib/cn";

import { PoseArtView } from "./pose-art";

type Filter = (typeof poseCategories)[number]["id"];

export function PoseLibrary() {
  const [filter, setFilter] = useState<Filter>("alle");
  const list = poses.filter((p) => {
    if (filter === "alle") return true;
    if (filter === "winter") return p.winter;
    return p.category === filter && !p.winter;
  });

  return (
    <>
      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1" role="tablist" aria-label="Übungen filtern">
        {poseCategories.map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={filter === c.id}
            onClick={() => setFilter(c.id)}
            className={cn(
              "h-9 shrink-0 rounded-full px-4 text-[14px] font-bold transition",
              filter === c.id ? "bg-ink text-white" : "bg-cream text-ink ring-1 ring-line",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <ul className="mt-4 grid grid-cols-2 gap-3">
        {list.map((p) => (
          <li key={p.slug}>
            <AppLink
              href={`/yoga/uebungen/${p.slug}`}
              className="flex h-full flex-col rounded-[24px] p-3 transition active:scale-[0.97]"
              style={{ background: p.color }}
            >
              <span className="relative mx-auto block aspect-square w-full max-w-[140px]">
                <PoseArtView pose={p} sizes="140px" />
              </span>
              <span className="mt-1 block text-[15px] font-bold text-ink">{p.name}</span>
              <span className="block text-[12px] font-medium text-ink-soft">{p.short}</span>
            </AppLink>
          </li>
        ))}
      </ul>
    </>
  );
}
