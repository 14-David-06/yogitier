"use client";

import { useStudio } from "@/lib/studio/store";
import { useAppState, useHydrated } from "@/lib/store";

/** Gesammelte Belohnungen aus den Lernwelten */
export function StickerAlbum() {
  const hydrated = useHydrated();
  const studio = useStudio();
  const { stickers } = useAppState();
  if (!hydrated || !studio.ready) return null;
  const published = studio.worlds.filter((w) => w.status === "veroeffentlicht" && w.steps.length > 0);
  const open = published.filter((w) => !stickers.some((s) => s.worldId === w.id));

  return (
    <section id="sticker" className="mx-5 mt-8 scroll-mt-24 rounded-[26px] bg-memo p-4">
      <h2 className="text-[19px] font-bold text-ink">Mein Sticker-Album</h2>
      <p className="mt-0.5 text-[13px] font-medium text-ink-soft">
        {stickers.length} von {stickers.length + open.length} Stickern gesammelt
      </p>
      <ul className="mt-3 grid grid-cols-4 gap-2.5">
        {stickers.map((s) => (
          <li key={s.worldId} className="flex flex-col items-center gap-1 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-white text-[32px] shadow-sm ring-2 ring-white">
              <span aria-hidden>{s.emoji}</span>
            </span>
            <span className="text-[11px] font-bold leading-tight text-ink">{s.name}</span>
          </li>
        ))}
        {open.map((w) => (
          <li key={w.id} className="flex flex-col items-center gap-1 text-center opacity-60">
            <span className="grid size-16 place-items-center rounded-full border-2 border-dashed border-ink/25 text-[22px] font-bold text-ink/40">?</span>
            <span className="text-[11px] font-bold leading-tight text-ink-soft">{w.title}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
