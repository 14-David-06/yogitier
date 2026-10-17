"use client";

import { openChat, useGuide } from "@/lib/guide/store";
import { cn } from "@/lib/cn";

import { EmmiAvatar } from "./emmi-avatar";

/** Emmi in der Kopfzeile der Kinder-App: antippen öffnet Fragen & Hilfe. */
export function GuideButton({ className }: { className?: string }) {
  const { speaking } = useGuide();
  return (
    <button
      type="button"
      data-tour="emmi"
      onClick={openChat}
      aria-label="Frag Emmi"
      className={cn("relative grid size-10 shrink-0 place-items-center rounded-full bg-white/80 ring-1 ring-lilac/40 transition active:scale-95", className)}
    >
      <EmmiAvatar size={38} speaking={speaking} sparkles={false} />
      <span className="absolute -right-0.5 -top-0.5 grid size-[17px] place-items-center rounded-full bg-lilac text-[11px] font-bold text-lilac-ink ring-2 ring-white">?</span>
    </button>
  );
}

/** Emmi im YOGITIER® Studio: schwebender Knopf unten rechts. */
export function GuideLauncher() {
  const { chat, speaking } = useGuide();
  return (
    <button
      type="button"
      data-tour="emmi"
      onClick={openChat}
      aria-label="Frag Emmi"
      aria-expanded={chat}
      className={cn(
        "group fixed bottom-5 right-5 z-40 grid size-[64px] place-items-center rounded-full bg-white shadow-[0_18px_40px_-16px_rgb(43_29_20/0.55)] ring-1 ring-lilac/50 transition hover:-translate-y-0.5",
        chat && "pointer-events-none opacity-0",
      )}
    >
      <EmmiAvatar size={56} speaking={speaking} />
      <span className="absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-lilac text-[12px] font-bold text-lilac-ink ring-2 ring-white">?</span>
      <span className="pointer-events-none absolute right-[calc(100%+10px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-ink px-3.5 py-1.5 text-[13px] font-bold text-white opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-visible:opacity-100">
        Frag Emmi · Hilfe & Tour
      </span>
    </button>
  );
}
