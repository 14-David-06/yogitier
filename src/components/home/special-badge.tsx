"use client";

import { useStudio } from "@/lib/studio/store";

/** Plakette der Kachel „Besonderes“ – der Text ist im Studio einstellbar. */
export function SpecialBadge() {
  const { settings } = useStudio();
  if (!settings.specialBadge.trim()) return null;
  return (
    <span className="absolute right-3 top-3 max-w-[70%] truncate rounded-xl bg-lilac px-2.5 py-[3px] text-[11px] font-bold text-lilac-ink">{settings.specialBadge}</span>
  );
}
