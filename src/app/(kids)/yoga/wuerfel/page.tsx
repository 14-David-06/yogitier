import type { Metadata } from "next";

import { PageHeader } from "@/components/ui/page-header";
import { Screen } from "@/components/ui/screen";
import { YogaDice } from "@/components/yoga/yoga-dice";

export const metadata: Metadata = {
  title: "Yoga-Würfel",
  description: "Würfeln, Übung entdecken, mitmachen – der YOGITIER® Yoga-Würfel für Einsteiger.",
};

export default function WuerfelPage() {
  return (
    <Screen background="linear-gradient(180deg,#FBF1BE 0%,#FFFFFF 55%)">
      <PageHeader title="Yoga-Würfel" back="/yoga" background="rgba(251,241,190,0.86)" />
      <YogaDice />
    </Screen>
  );
}
