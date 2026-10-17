"use client";

import { usePathname } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";

import type { GuideArea, TourId } from "@/content/guide";
import { startTour, useGuide } from "@/lib/guide/store";
import { useAppState, useHydrated } from "@/lib/store";

import { GuideChat } from "./chat";
import { GuideLauncher } from "./guide-button";
import { TourOverlay } from "./tour";

const noop = () => () => {};

/**
 * Emmi für einen Bereich der App: startet beim ersten Besuch die passende Tour
 * und zeigt Tour bzw. Fragen-Chat. In der Studio-Vorschau (iframe) bleibt sie still.
 */
export function Guide({ area, enabled = true }: { area: GuideArea; enabled?: boolean }) {
  const hydrated = useHydrated();
  const app = useAppState();
  const guide = useGuide();
  const pathname = usePathname();
  const embedded = useSyncExternalStore(
    noop,
    () => window.self !== window.top || window.location.search.includes("vorschau"),
    () => true,
  );

  let auto: TourId | null = null;
  if (enabled && hydrated && !embedded && !guide.tour && !guide.chat) {
    if (area === "kids" && app.onboarded) {
      if (pathname === "/" && !guide.seen["kinder-start"]) auto = "kinder-start";
      else if (/^\/welten\/[^/]+$/.test(pathname) && !guide.seen["kinder-lernwelt"]) auto = "kinder-lernwelt";
    } else if (area === "studio") {
      if (pathname === "/admin" && !guide.seen["studio-start"]) auto = "studio-start";
      else if (/^\/admin\/welten\/[^/]+$/.test(pathname) && !guide.seen["studio-editor"]) auto = "studio-editor";
    }
  }

  useEffect(() => {
    if (!auto) return;
    const t = window.setTimeout(() => startTour(auto), area === "kids" ? 900 : 700);
    return () => window.clearTimeout(t);
  }, [auto, area]);

  if (!enabled || embedded) return null;
  return (
    <>
      {(area === "studio" || app.onboarded) && <TourOverlay area={area} />}
      <GuideChat area={area} />
      {area === "studio" && <GuideLauncher />}
    </>
  );
}
