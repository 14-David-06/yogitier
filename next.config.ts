import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Für Kunden-Präsentationen im Dev-Modus: kein Next.js-Badge im Bild.
  devIndicators: false,
  poweredByHeader: false,
  // `npm run paquete`: eigenständiger Server für das Offline-Paket (Vercel braucht das nicht).
  output: process.env.YOGITIER_STANDALONE === "1" ? "standalone" : undefined,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
