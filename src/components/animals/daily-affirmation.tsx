"use client";

import { Star } from "lucide-react";
import Image from "next/image";

import { SpeakButton } from "@/components/ui/speak-button";
import { animals } from "@/content/animals";
import { useAppState } from "@/lib/store";
import { useNow } from "@/lib/use-now";

function dayOfYear(d: Date) {
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d.getTime() - start.getTime()) / 86_400_000);
}

/** „Mutmacher des Tages“ – jeden Tag spricht ein anderes Tier. */
export function DailyAffirmation() {
  const now = useNow();
  const { stars } = useAppState();
  if (!now) return <div className="mx-5 mt-5 h-[150px] animate-pulse rounded-[26px] bg-cream" aria-hidden />;
  const animal = animals[dayOfYear(now) % animals.length];
  return (
    <div className="mx-5 mt-5 rounded-[26px] p-4 animate-fade-up" style={{ background: animal.soft }}>
      <div className="flex items-center justify-between">
        <p className="text-[12.5px] font-bold uppercase tracking-wider text-ink-soft">Mutmacher des Tages</p>
        <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-[12.5px] font-bold text-ink">
          <Star className="size-3.5 fill-brand-yellow text-brand-orange" aria-hidden /> {stars} Sterne
        </span>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <Image src={animal.image} alt={animal.fullName} className="size-[72px] shrink-0 object-contain" sizes="72px" />
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-ink-soft">{animal.fullName} sagt:</p>
          <p className="text-[21px] font-bold leading-tight text-ink-strong">„{animal.affirmation}“</p>
        </div>
      </div>
      <SpeakButton text={`${animal.fullName} sagt: ${animal.affirmation} Und jetzt du! Sag es ganz laut: ${animal.affirmation}`} label="Sprich mit!" className="mt-3" />
    </div>
  );
}
