"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";
import { speak, speechSupported, stopSpeaking } from "@/lib/speech";
import { useHydrated } from "@/lib/store";

/** „Vorlesen“-Knopf: liest einen Text mit der deutschen Vorlesestimme vor. */
export function SpeakButton({
  text,
  label = "Vorlesen",
  className,
  compact = false,
}: {
  text: string;
  label?: string;
  className?: string;
  compact?: boolean;
}) {
  const hydrated = useHydrated();
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => () => stopSpeaking(), []);

  if (!hydrated || !speechSupported()) return null;

  const toggle = () => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    const ok = speak(text, { force: true, onEnd: () => setSpeaking(false) });
    setSpeaking(ok);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={speaking}
      aria-label={speaking ? "Vorlesen stoppen" : label}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-bold transition active:scale-95",
        compact ? "size-10 justify-center bg-white/80 ring-1 ring-line" : "h-9 bg-white/80 px-3.5 text-[13px] ring-1 ring-line",
        speaking && "bg-ink text-white ring-ink",
        className,
      )}
    >
      {speaking ? <VolumeX className="size-[18px]" aria-hidden /> : <Volume2 className="size-[18px]" aria-hidden />}
      {!compact && <span>{speaking ? "Stopp" : label}</span>}
    </button>
  );
}
