import type { Metadata } from "next";

import { MemoGame } from "@/components/memo/memo-game";
import { ModuleHero } from "@/components/ui/module-hero";
import { PageHeader } from "@/components/ui/page-header";
import { Screen } from "@/components/ui/screen";
import { animalsById } from "@/content/animals";

export const metadata: Metadata = {
  title: "Affirmation-Memo",
  description: "Das YOGITIER® Affirmation-Memo: Tier-Paare finden und Mutmacher-Sätze entdecken.",
};

export default function MemoPage() {
  return (
    <Screen>
      <PageHeader back="/" background="#FBF1BE" backLabel="Zurück zum Menü" />
      <ModuleHero title="Memo" text="Finde die Paare – und sammle Mutmacher-Sätze der Bande." image={animalsById.luka.image} color="#FBF1BE" vt="tile-memo" />
      <div className="relative -mt-6 min-h-[50%] rounded-t-[30px] bg-white pt-1">
        <MemoGame />
      </div>
    </Screen>
  );
}
