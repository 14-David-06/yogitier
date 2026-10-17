import type { Metadata } from "next";

import { TeacherFinder } from "@/components/finder/teacher-finder";
import { PageHeader } from "@/components/ui/page-header";
import { Screen } from "@/components/ui/screen";

export const metadata: Metadata = {
  title: "Yogalehrerin finden",
  description: "Kinderyogalehrende in deiner Nähe finden – für Kurse, Probestunden oder Hausbesuche.",
};

export default function FinderPage() {
  return (
    <Screen>
      <PageHeader title="Yogalehrerin finden" back="/" />
      <div className="px-5 pt-1">
        <h1 className="text-[26px] font-bold leading-tight text-ink-strong">Echte Yogalehrerin finden</h1>
        <p className="mt-1 text-[14px] font-medium text-ink-soft">In deiner Nähe · Kurs, Probestunde oder Hausbesuch</p>
      </div>
      <TeacherFinder />
    </Screen>
  );
}
