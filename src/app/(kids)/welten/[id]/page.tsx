import type { Metadata } from "next";
import { Suspense } from "react";

import { Screen } from "@/components/ui/screen";
import { WorldView } from "@/components/worlds/world-view";
import { seedWorlds } from "@/content/worlds";

export const metadata: Metadata = {
  title: "Lernwelt",
  description: "Eine interaktive YOGITIER® Lernwelt.",
};

/** Beispielwelten werden vorgerendert; im Studio neu angelegte Welten laden im Browser. */
export function generateStaticParams() {
  return seedWorlds.map((w) => ({ id: w.id }));
}

export default function WorldPage({ params }: PageProps<"/welten/[id]">) {
  return (
    <Screen background="#FFFFFF">
      <Suspense fallback={<div className="h-full animate-pulse bg-cream" />}>
        <WorldLoader params={params} />
      </Suspense>
    </Screen>
  );
}

async function WorldLoader({ params }: { params: PageProps<"/welten/[id]">["params"] }) {
  const { id } = await params;
  return <WorldView id={id} />;
}
