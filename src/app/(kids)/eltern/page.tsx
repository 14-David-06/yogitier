import type { Metadata } from "next";

import { AboutTab } from "@/components/parents/about-tab";
import { DiscoverTab } from "@/components/parents/discover-tab";
import { ParentArea } from "@/components/parents/parent-area";
import { PageHeader } from "@/components/ui/page-header";
import { Screen } from "@/components/ui/screen";

export const metadata: Metadata = {
  title: "Eltern-Bereich",
  description: "Fortschritt, Einstellungen, Tipps aus dem YOGITIER® Eltern-Kompass, Shop und Gratis-Downloads.",
};

export default function ElternPage() {
  return (
    <Screen>
      <PageHeader title="Eltern-Bereich" back="/" backLabel="Zurück zum Menü" />
      <ParentArea discover={<DiscoverTab />} about={<AboutTab />} />
    </Screen>
  );
}
