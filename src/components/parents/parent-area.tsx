"use client";

import { BarChart3, Compass, Heart, Settings } from "lucide-react";
import Image from "next/image";
import { useState, type ReactNode } from "react";

import { ParentGatePanel, isParentUnlocked, newGateQuestion, type GateQuestion } from "@/components/ui/parent-gate";
import { animalsById } from "@/content/animals";
import { cn } from "@/lib/cn";

import { OverviewTab } from "./overview-tab";
import { SettingsTab } from "./settings-tab";

type Tab = "ueberblick" | "einstellungen" | "entdecken" | "ueber";

const TABS: { id: Tab; label: string; icon: typeof BarChart3 }[] = [
  { id: "ueberblick", label: "Überblick", icon: BarChart3 },
  { id: "einstellungen", label: "Einstellungen", icon: Settings },
  { id: "entdecken", label: "Entdecken", icon: Compass },
  { id: "ueber", label: "Über uns", icon: Heart },
];

/** Eltern-Bereich: Rechen-Gate, danach Fortschritt, Einstellungen, Tipps & Shop. */
export function ParentArea({ discover, about }: { discover: ReactNode; about: ReactNode }) {
  const [unlocked, setUnlocked] = useState(() => isParentUnlocked());
  const [question, setQuestion] = useState<GateQuestion | null>(null);
  const [tab, setTab] = useState<Tab>("ueberblick");

  if (!unlocked) {
    return (
      <div className="flex flex-col items-center px-6 pb-10 pt-4 text-center">
        {question ? (
          <div className="w-full animate-fade-up">
            <ParentGatePanel
              question={question}
              onNewQuestion={() => setQuestion(newGateQuestion())}
              onSolved={() => setUnlocked(true)}
              title="Kurze Eltern-Kontrolle"
            />
          </div>
        ) : (
          <>
            <div className="relative mt-4 h-36 w-56">
              <Image src={animalsById.benno.image} alt="" className="absolute left-0 top-6 h-24 w-auto object-contain" sizes="110px" loading="eager" />
              <Image src={animalsById.kimi.image} alt="" className="absolute right-0 top-8 h-20 w-auto object-contain" sizes="100px" loading="eager" />
              <Image src={animalsById.leo.image} alt="" className="absolute left-1/2 top-0 h-24 w-auto -translate-x-1/2 object-contain" sizes="100px" loading="eager" />
            </div>
            <h1 className="mt-6 text-[28px] font-bold text-ink-strong">Eltern-Bereich</h1>
            <p className="mt-2 max-w-[320px] text-[15px] font-medium leading-relaxed text-ink-soft">
              Fortschritt, Einstellungen, Tipps aus dem YOGITIER® Eltern-Kompass und der Shop – geschützt vor kleinen Fingern.
            </p>
            <button
              type="button"
              onClick={() => setQuestion(newGateQuestion())}
              className="mt-8 h-14 w-full rounded-[22px] bg-ink text-[17px] font-bold text-white shadow-lg shadow-ink/20 active:scale-[0.98]"
            >
              Ich bin erwachsen – weiter
            </button>
            <p className="mt-4 text-[12.5px] font-medium text-ink-soft">Ihr müsst eine kleine Rechenaufgabe lösen.</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="pb-12">
      <div className="sticky top-[calc(var(--safe-top)+56px)] z-10 bg-white/90 px-5 pb-3 pt-2 backdrop-blur">
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5" role="tablist" aria-label="Eltern-Bereich">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={cn(
                "inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full px-4 text-[14px] font-bold transition",
                tab === id ? "bg-ink text-white" : "bg-cream text-ink ring-1 ring-line",
              )}
            >
              <Icon className="size-4" aria-hidden /> {label}
            </button>
          ))}
        </div>
      </div>
      <div role="tabpanel" hidden={tab !== "ueberblick"}>
        <OverviewTab onOpenSettings={() => setTab("einstellungen")} />
      </div>
      <div role="tabpanel" hidden={tab !== "einstellungen"}>
        <SettingsTab />
      </div>
      <div role="tabpanel" hidden={tab !== "entdecken"}>
        {discover}
      </div>
      <div role="tabpanel" hidden={tab !== "ueber"}>
        {about}
      </div>
    </div>
  );
}
