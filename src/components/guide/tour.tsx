"use client";

import { RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import { tours, type GuideArea, type TourId } from "@/content/guide";
import { cn } from "@/lib/cn";
import { endTour, setMuted, setTourStep, useGuide } from "@/lib/guide/store";
import { hush, say } from "@/lib/guide/voice";
import { useAppState } from "@/lib/store";

import { EmmiAvatar } from "./emmi-avatar";

type Box = { x: number; y: number; w: number; h: number };

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

/** „{name}“ einsetzen – ohne Namen fällt die Anrede weg. */
export function withName(text: string, name: string) {
  return name ? text.replaceAll("{name}", name) : text.replace(/,?\s*\{name\}/g, "");
}

/** Geführte Tour: Emmi zeigt Schritt für Schritt auf Elemente der Seite und erklärt sie mit Stimme. */
export function TourOverlay({ area }: { area: GuideArea }) {
  const { tour } = useGuide();
  if (!tour || tours[tour.id].area !== area) return null;
  return <TourLayer area={area} tourId={tour.id} index={tour.index} />;
}

function TourLayer({ area, tourId, index }: { area: GuideArea; tourId: TourId; index: number }) {
  const tour = tours[tourId];
  const step = tour.steps[index] ?? tour.steps[0];
  const { muted, speaking } = useGuide();
  const name = useAppState().profile.name;
  const layer = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<Box | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  const count = tour.steps.length;
  const offer = tour.offer && index === 0 ? tour.offer : null;
  const first = tour.offer ? 1 : 0;
  const last = index === count - 1;
  const title = step.title ? withName(step.title, area === "kids" ? name : "") : "";
  const text = withName(step.text, area === "kids" ? name : "");
  const spoken = title ? `${title}. ${text}` : text;

  // Ziel-Element verfolgen (Scrollen, Animationen, Größenänderungen)
  useEffect(() => {
    let raf = 0;
    let lastKey = "";
    let scrolled = false;
    const started = performance.now();
    const tick = () => {
      const root = layer.current;
      if (root) {
        const base = root.getBoundingClientRect();
        const el = step.target ? document.querySelector<HTMLElement>(step.target) : null;
        const visible = el && el.getClientRects().length > 0;
        if (step.target && !visible && performance.now() - started < 1500) {
          raf = requestAnimationFrame(tick);
          return;
        }
        let next: Box | null = null;
        if (el && visible) {
          let r = el.getBoundingClientRect();
          if (!scrolled) {
            scrolled = true;
            el.scrollIntoView({ block: r.height > base.height * 0.6 ? "start" : "center", inline: "nearest", behavior: "smooth" });
            r = el.getBoundingClientRect();
          }
          next = { x: r.left - base.left, y: r.top - base.top, w: r.width, h: r.height };
        }
        const key = next ? [next.x, next.y, next.w, next.h, base.width, base.height].map(Math.round).join(",") : `-${Math.round(base.width)}x${Math.round(base.height)}`;
        if (key !== lastKey) {
          lastKey = key;
          setBox(next);
          setSize({ w: base.width, h: base.height });
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [step.target]);

  // Jeden Schritt vorlesen
  useEffect(() => {
    const t = window.setTimeout(() => say(spoken), 320);
    return () => {
      window.clearTimeout(t);
      hush();
    };
  }, [spoken]);

  // Tastatur: Esc = überspringen, Pfeile = vor/zurück
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") endTour();
      else if (e.key === "ArrowRight") {
        if (index >= count - 1) endTour();
        else setTourStep(index + 1);
      } else if (e.key === "ArrowLeft" && index > first) setTourStep(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, count, first]);

  const next = () => (last ? endTour() : setTourStep(index + 1));

  // Sprechblase neben dem Ziel platzieren (unten, oben oder – wenn kein Platz – am unteren Rand)
  const margin = 12;
  const bubbleW = Math.max(0, Math.min(area === "kids" ? 352 : 410, size.w - margin * 2));
  let bubble: CSSProperties = { left: (size.w - bubbleW) / 2, top: "50%", transform: "translateY(-50%)", width: bubbleW };
  let arrow: { side: "top" | "bottom" | "left" | "right"; offset: number } | null = null;
  if (box) {
    const left = clamp(box.x + box.w / 2 - bubbleW / 2, margin, size.w - bubbleW - margin);
    const pointer = clamp(box.x + box.w / 2 - left, 28, bubbleW - 28);
    const sideTop = clamp(Math.max(box.y, 0) + 16, margin, size.h - 250);
    if (size.h - (box.y + box.h) >= 210) {
      bubble = { left, top: box.y + box.h + 18, width: bubbleW };
      arrow = { side: "top", offset: pointer };
    } else if (box.y >= 210) {
      bubble = { left, bottom: size.h - box.y + 18, width: bubbleW };
      arrow = { side: "bottom", offset: pointer };
    } else if (size.w - (box.x + box.w) >= bubbleW + 40) {
      // hohes Element (z. B. Seitenleiste): Sprechblase daneben
      bubble = { left: box.x + box.w + 22, top: sideTop, width: bubbleW };
      arrow = { side: "left", offset: 44 };
    } else if (box.x >= bubbleW + 40) {
      bubble = { left: box.x - bubbleW - 22, top: sideTop, width: bubbleW };
      arrow = { side: "right", offset: 44 };
    } else bubble = { left, bottom: margin + 8, width: bubbleW };
  }

  return (
    <div ref={layer} role="dialog" aria-modal="true" aria-label="Tour mit Emmi" className="fixed inset-0 z-[70]">
      {box ? (
        <div
          className="pointer-events-none absolute rounded-[22px] transition-[left,top,width,height] duration-300 ease-out"
          style={{ left: box.x - 8, top: box.y - 8, width: box.w + 16, height: box.h + 16, boxShadow: "0 0 0 9999px rgb(43 29 20 / 0.58)" }}
        >
          <span className="absolute inset-0 rounded-[22px] ring-[3px] ring-lilac" style={{ animation: "spot-pulse 1.8s ease-in-out infinite" }} />
        </div>
      ) : (
        <div className="absolute inset-0 bg-[#2b1d14]/58" style={{ animation: "fade-in 200ms ease-out both" }} />
      )}

      {size.w > 0 && (
        <div className="absolute" style={bubble}>
          <div
            key={index}
            className="relative rounded-[26px] bg-white p-4 shadow-[0_24px_60px_-18px_rgb(43_29_20/0.6)]"
            style={{ animation: "pop 320ms cubic-bezier(0.34, 1.56, 0.64, 1) both" }}
          >
            {arrow && (
              <span
                className="absolute size-4 rotate-45 rounded-[3px] bg-white"
                style={arrow.side === "top" || arrow.side === "bottom" ? { left: arrow.offset - 8, [arrow.side]: -6 } : { top: arrow.offset - 8, [arrow.side]: -6 }}
              />
            )}
            <div className={cn("relative flex gap-3", offer && "flex-col items-center text-center")}>
              <EmmiAvatar size={offer ? 96 : 60} speaking={speaking} />
              <div className="min-w-0 flex-1">
                <div className={cn("flex items-center gap-2", offer ? "justify-center" : "justify-between")}>
                  <p className="text-[11.5px] font-bold uppercase tracking-wider text-lilac-ink">
                    {offer ? "Emmi · deine Begleiterin" : `Schritt ${index - first + 1} von ${count - first}`}
                  </p>
                  {!offer && (
                    <button type="button" onClick={endTour} className="text-[12.5px] font-bold text-ink-soft underline-offset-2 hover:underline">
                      Überspringen
                    </button>
                  )}
                </div>
                {title && <p className="mt-0.5 text-[17px] font-bold leading-tight text-ink-strong">{title}</p>}
                <p className="mt-1 text-[14.5px] font-medium leading-snug text-ink" aria-live="polite">
                  {text}
                </p>
              </div>
            </div>
            <div className="mt-3.5 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  if (!muted) hush();
                  setMuted(!muted);
                }}
                aria-label={muted ? "Emmis Stimme an" : "Emmis Stimme aus"}
                aria-pressed={!muted}
                className="grid size-9 place-items-center rounded-full bg-cream text-ink transition hover:bg-line/60"
              >
                {muted ? <VolumeX className="size-4" aria-hidden /> : <Volume2 className="size-4" aria-hidden />}
              </button>
              <button
                type="button"
                onClick={() => say(spoken)}
                disabled={muted}
                aria-label="Noch einmal vorlesen"
                className="grid size-9 place-items-center rounded-full bg-cream text-ink transition hover:bg-line/60 disabled:opacity-40"
              >
                <RotateCcw className="size-4" aria-hidden />
              </button>
              <span className="flex-1" />
              {offer ? (
                <>
                  <button type="button" onClick={endTour} className="h-10 rounded-full px-4 text-[14px] font-bold text-ink-soft hover:bg-cream">
                    {offer.no}
                  </button>
                  <button type="button" onClick={next} autoFocus className="h-10 rounded-full bg-ink px-5 text-[14px] font-bold text-white shadow-sm transition active:scale-[0.98]">
                    {offer.yes}
                  </button>
                </>
              ) : (
                <>
                  {index > first && (
                    <button type="button" onClick={() => setTourStep(index - 1)} className="h-10 rounded-full px-4 text-[14px] font-bold text-ink-soft hover:bg-cream">
                      Zurück
                    </button>
                  )}
                  <button type="button" onClick={next} autoFocus className="h-10 rounded-full bg-ink px-5 text-[14px] font-bold text-white shadow-sm transition active:scale-[0.98]">
                    {last ? "Fertig" : "Weiter"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
