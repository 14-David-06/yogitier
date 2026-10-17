import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

import { GuideButton } from "@/components/guide/guide-button";
import { cn } from "@/lib/cn";

import { AppLink } from "./app-link";

/** Kopfzeile einer Unterseite mit Zurück-Button (bleibt beim Scrollen oben). */
export function PageHeader({
  title,
  back = "/",
  backLabel = "Zurück",
  right,
  background = "rgba(255,255,255,0.86)",
  className,
}: {
  title?: string;
  back?: string;
  backLabel?: string;
  right?: ReactNode;
  background?: string;
  className?: string;
}) {
  return (
    <header className={cn("sticky top-0 z-20 pt-safe backdrop-blur-md", className)} style={{ background }}>
      <div className="flex h-14 items-center gap-2 px-3">
        <AppLink
          href={back}
          direction="back"
          aria-label={backLabel}
          className="grid size-11 shrink-0 place-items-center rounded-full bg-white/80 text-ink shadow-[0_1px_0_rgb(122_74_40/0.08)] ring-1 ring-line transition active:scale-95"
        >
          <ChevronLeft className="size-6" strokeWidth={2} aria-hidden />
        </AppLink>
        <h1 className="min-w-0 flex-1 truncate text-center text-[17px] font-bold text-ink">{title}</h1>
        <div className="flex size-11 shrink-0 items-center justify-center">{right ?? <GuideButton className="size-11" />}</div>
      </div>
    </header>
  );
}
