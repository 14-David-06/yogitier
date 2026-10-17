import type { Metadata } from "next";

import { SettingsPanel } from "@/components/studio/settings-panel";

export const metadata: Metadata = { title: "Einstellungen" };

export default function AdminSettingsPage() {
  return <SettingsPanel />;
}
