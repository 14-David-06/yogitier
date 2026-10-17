"use client";

import { X } from "lucide-react";
import { useEffect, useEffectEvent, type ReactNode } from "react";

/** Von unten einfahrendes Panel (z. B. Details, Formulare, Eltern-Gate) */
export function BottomSheet({
  open,
  onClose,
  title,
  children,
  hideClose = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  hideClose?: boolean;
}) {
  const close = useEffectEvent(() => onClose());
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label={title}>
      <button
        type="button"
        aria-label="Schließen"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-[#2b1d14]/40"
        style={{ animation: "fade-in 200ms ease-out both" }}
      />
      <div
        className="absolute inset-x-0 bottom-0 max-h-[90%] overflow-y-auto rounded-t-[30px] bg-white pb-safe shadow-[0_-12px_40px_-12px_rgb(90_50_24/0.35)]"
        style={{ animation: "sheet-up 340ms cubic-bezier(0.22, 1, 0.36, 1) both" }}
      >
        <div className="sticky top-0 z-10 flex justify-center bg-white/90 pb-1 pt-2.5 backdrop-blur">
          <span className="h-1.5 w-10 rounded-full bg-line" aria-hidden />
          {!hideClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Schließen"
              className="absolute right-3 top-2 grid size-9 place-items-center rounded-full bg-cream text-ink active:scale-95"
            >
              <X className="size-4" aria-hidden />
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
