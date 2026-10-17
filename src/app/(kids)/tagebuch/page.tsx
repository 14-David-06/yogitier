import type { Metadata } from "next";

import { DiaryApp } from "@/components/diary/diary-app";
import { ModuleHero } from "@/components/ui/module-hero";
import { PageHeader } from "@/components/ui/page-header";
import { Screen } from "@/components/ui/screen";
import { animalsById } from "@/content/animals";

export const metadata: Metadata = {
  title: "Tagebuch",
  description: "Das Gefühle-Tagebuch: Stimmung festhalten, Dankbarkeit sammeln und Bilder malen.",
};

export default function TagebuchPage() {
  return (
    <Screen>
      <PageHeader back="/" background="#E8E8F0" backLabel="Zurück zum Menü" />
      <ModuleHero title="Tagebuch" text="Wie geht es dir? Erzähle, male und sammle schöne Momente." image={animalsById.eddy.image} color="#E8E8F0" vt="tile-tagebuch" />
      <div className="relative -mt-6 min-h-[50%] rounded-t-[30px] bg-white pt-1">
        <DiaryApp />
      </div>
    </Screen>
  );
}
