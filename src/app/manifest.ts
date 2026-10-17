import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "YOGITIER® – Yoga & Achtsamkeit für Kinder",
    short_name: "YOGITIER",
    description: "Yoga-Stunden, Atemübungen, Fantasiereisen und Spiele mit der YOGITIER-Bande.",
    lang: "de-DE",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FFFFFF",
    theme_color: "#FAF6F1",
    categories: ["kids", "health", "lifestyle", "education"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
