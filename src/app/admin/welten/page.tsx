import type { Metadata } from "next";

import { WorldsList } from "@/components/studio/worlds-list";

export const metadata: Metadata = { title: "Lernwelten" };

export default function AdminWorldsPage() {
  return <WorldsList />;
}
