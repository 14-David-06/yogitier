import { ChevronRight, Lock, MapPin } from "lucide-react";
import Image from "next/image";
import { ViewTransition } from "react";

import logo from "@/assets/brand/logo.png";
import { GuideButton } from "@/components/guide/guide-button";
import { SpecialBadge } from "@/components/home/special-badge";
import { AppLink } from "@/components/ui/app-link";
import { Screen } from "@/components/ui/screen";
import { animalsById } from "@/content/animals";
import type { AnimalId } from "@/content/types";

const TILES: { label: string; href: string; animal: AnimalId; bg: string; vt: string; badge?: string }[] = [
  { label: "Yoga", href: "/yoga", animal: "benno", bg: "#EFE2D4", vt: "tile-yoga" },
  { label: "Meditation", href: "/meditation", animal: "emmi", bg: "#E7E2F8", vt: "tile-meditation" },
  { label: "Tierfreunde", href: "/tierfreunde", animal: "leo", bg: "#FBEBC4", vt: "tile-tierfreunde" },
  { label: "Memo", href: "/memo", animal: "luka", bg: "#FBF1BE", vt: "tile-memo" },
  { label: "Tagebuch", href: "/tagebuch", animal: "eddy", bg: "#E8E8F0", vt: "tile-tagebuch" },
  { label: "Besonderes", href: "/besonderes", animal: "kimi", bg: "#FBE3E6", vt: "tile-besonderes", badge: "Weihnachten" },
];

export default function HomePage() {
  return (
    <Screen>
      <div className="flex min-h-full flex-col">
        <div className="flex items-center justify-between px-5 pt-safe">
          <div className="flex h-[54px] w-full items-center justify-between">
            <GuideButton />
            <Image src={logo} alt="YOGITIER®" className="h-7 w-auto" loading="eager" />
            <AppLink
              href="/eltern"
              aria-label="Eltern-Bereich"
              data-tour="eltern"
              className="grid size-10 place-items-center rounded-full text-ink-soft transition hover:bg-cream active:scale-95"
            >
              <Lock className="size-[22px]" strokeWidth={1.6} aria-hidden />
            </AppLink>
          </div>
        </div>

        <h1 className="px-5 pb-[18px] pt-2 text-[24px] font-semibold text-ink">Was möchtest du machen?</h1>

        <nav aria-label="Hauptmenü" className="grid min-h-[420px] flex-1 grid-cols-2 grid-rows-3 gap-3 px-5 pb-3">
          {TILES.map((t, i) => {
            const animal = animalsById[t.animal];
            return (
              <AppLink
                key={t.href}
                href={t.href}
                data-tour={`kachel-${t.href.slice(1)}`}
                className="group relative flex flex-col items-center justify-center gap-3 rounded-tile text-ink no-underline transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-14px_rgb(122_74_40/0.45)] active:scale-[0.97]"
                style={{ background: t.bg }}
              >
                <ViewTransition name={t.vt} share="morph" default="none">
                  <Image
                    src={animal.image}
                    alt=""
                    className="h-[78px] w-auto max-w-[96px] object-contain animate-float"
                    style={{ animationDelay: `${i * 0.35}s` }}
                    sizes="96px"
                    loading="eager"
                  />
                </ViewTransition>
                <span className="text-[18px] font-bold">{t.label}</span>
                {t.badge && <SpecialBadge />}
              </AppLink>
            );
          })}
        </nav>

        <AppLink
          href="/finder"
          className="mx-5 mb-8 flex h-[76px] shrink-0 items-center gap-3.5 rounded-[26px] border-[1.5px] border-line px-4 text-ink transition hover:bg-cream/60 active:scale-[0.98]"
        >
          <span className="grid size-[46px] shrink-0 place-items-center rounded-full bg-cream">
            <MapPin className="size-6" strokeWidth={1.7} aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[16px] font-bold">Echte Yogalehrerin finden</span>
            <span className="block text-[12px] font-medium text-ink-soft">In deiner Nähe · Kurs, Probestunde oder Hausbesuch</span>
          </span>
          <ChevronRight className="size-[18px] shrink-0" strokeWidth={1.8} aria-hidden />
        </AppLink>
      </div>
    </Screen>
  );
}
