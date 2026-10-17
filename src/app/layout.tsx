import type { Metadata, Viewport } from "next";
import { Quicksand } from "next/font/google";

import "./globals.css";

// Variable Font (300–700). Hinweis: Eine Liste fester Gewichte bricht aktuell den
// Turbopack-Production-Build („next/font/google queries have exactly one entry“).
const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  // Prototyp: nicht indexieren (für den Livegang entfernen)
  robots: { index: false, follow: false },
  title: {
    default: "YOGITIER® – Yoga & Achtsamkeit für Kinder",
    template: "%s · YOGITIER®",
  },
  description:
    "Die YOGITIER® App: Yoga-Stunden, Atemübungen, Fantasiereisen, Affirmation-Memo und Gefühle-Tagebuch für Kinder ab 2 Jahren – spielerisch begleitet von der YOGITIER-Bande.",
  applicationName: "YOGITIER",
  appleWebApp: { capable: true, title: "YOGITIER", statusBarStyle: "default" },
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "YOGITIER®",
    title: "YOGITIER® – Yoga & Achtsamkeit für Kinder",
    description: "Yoga, Achtsamkeit & kleine Rituale für Kinder – spielerisch begleitet von der YOGITIER-Bande.",
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF6F1",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de" className={`${quicksand.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
