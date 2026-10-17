import type { Metadata } from "next";

import { MediaLibrary } from "@/components/studio/media-library";

export const metadata: Metadata = { title: "Medien" };

export default function AdminMediaPage() {
  return <MediaLibrary />;
}
