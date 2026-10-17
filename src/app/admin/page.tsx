import type { Metadata } from "next";

import { Dashboard } from "@/components/studio/dashboard";

export const metadata: Metadata = { title: "Übersicht" };

export default function AdminPage() {
  return <Dashboard />;
}
