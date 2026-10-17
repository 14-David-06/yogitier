import type { Metadata } from "next";

import { ModuleHero } from "@/components/ui/module-hero";
import { PageHeader } from "@/components/ui/page-header";
import { Screen } from "@/components/ui/screen";
import { StickerAlbum } from "@/components/worlds/sticker-album";
import { WorldsShelf } from "@/components/worlds/worlds-shelf";
import { animalsById } from "@/content/animals";

export const metadata: Metadata = {
  title: "Lernwelten",
  description: "Interaktive Lernwelten mit Videos, Übungen, Quiz und Missionen – für gesunde Gewohnheiten von klein an.",
};

export default function WeltenPage() {
  return (
    <Screen>
      <PageHeader back="/besonderes" background="#DCEBD0" backLabel="Zurück" />
      <ModuleHero title="Lernwelten" text="Entdecke Abenteuer-Welten: schauen, mitmachen, rätseln – und Sticker sammeln!" image={animalsById.luka.image} color="#DCEBD0" />
      <div className="relative -mt-6 min-h-[50%] rounded-t-[30px] bg-white pb-12 pt-1">
        <WorldsShelf title="Alle Lernwelten" subtitle="Ausgewählt vom YOGITIER®-Team" layout="grid" showAllLink={false} />
        <StickerAlbum />
      </div>
    </Screen>
  );
}
