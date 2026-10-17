import type { Metadata } from "next";
import { Suspense } from "react";

import { WorldEditor } from "@/components/studio/world-editor";
import { seedWorlds } from "@/content/worlds";

export const metadata: Metadata = { title: "Lernwelt bearbeiten" };

export function generateStaticParams() {
  return seedWorlds.map((w) => ({ id: w.id }));
}

export default function AdminWorldPage({ params }: PageProps<"/admin/welten/[id]">) {
  return (
    <Suspense fallback={<div className="mx-auto h-96 max-w-[1280px] animate-pulse rounded-[24px] bg-white" />}>
      <EditorLoader params={params} />
    </Suspense>
  );
}

async function EditorLoader({ params }: { params: PageProps<"/admin/welten/[id]">["params"] }) {
  const { id } = await params;
  return <WorldEditor key={id} id={id} />;
}
