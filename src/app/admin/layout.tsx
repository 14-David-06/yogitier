import type { Metadata } from "next";

import { StudioShell } from "@/components/studio/studio-shell";

export const metadata: Metadata = {
  title: { default: "Studio", template: "%s · YOGITIER® Studio" },
  description: "YOGITIER® Studio: Lernwelten gestalten, Anleitungsvideos hochladen und Inhalte für die App veröffentlichen.",
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <StudioShell>{children}</StudioShell>;
}
