"use client";

import { Play } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { startTour } from "@/lib/guide/store";

import { EmmiAvatar } from "./emmi-avatar";

/** Präsentationsfläche: startet Emmis Tour im Handy-Rahmen. */
export function EmmiPitchButton() {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        if (pathname !== "/") router.push("/");
        startTour("kinder-start");
      }}
      className="group mt-3 flex w-full items-center gap-3 rounded-2xl bg-meditation p-2.5 pl-2 text-left text-lilac-ink ring-1 ring-lilac/40 transition hover:bg-[#ddd6f6] short:mt-2"
    >
      <EmmiAvatar size={44} />
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-bold">Neu: Emmi zeigt dir alles</span>
        <span className="block text-[12.5px] font-medium leading-snug text-lilac-ink/80 tiny:hidden">
          Geführte Tour mit sanfter Stimme – beantwortet Fragen von Kindern, Eltern und Admins
        </span>
      </span>
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/70 transition group-hover:bg-white">
        <Play className="size-4 translate-x-px" aria-hidden />
      </span>
    </button>
  );
}
