import type { Metadata } from "next";

import { PoseLibrary } from "@/components/poses/pose-library";
import { PageHeader } from "@/components/ui/page-header";
import { Screen } from "@/components/ui/screen";
import { poses } from "@/content/poses";

export const metadata: Metadata = {
  title: "Alle Übungen",
  description: "Alle Yoga-Übungen der YOGITIER-Bande – von Löwe bis Schneeengel, kindgerecht erklärt.",
};

export default function UebungenPage() {
  return (
    <Screen>
      <PageHeader title="Alle Übungen" back="/yoga" />
      <div className="px-5 pb-12 pt-2">
        <p className="mb-4 text-[14px] font-medium text-ink-soft">
          {poses.length} Übungen zum Nachmachen – such dir dein Lieblingstier aus!
        </p>
        <PoseLibrary />
      </div>
    </Screen>
  );
}
