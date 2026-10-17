import type { AnimalId } from "./types";

export type OfferType = "kurs" | "probestunde" | "hausbesuch";

export const offerLabel: Record<OfferType, string> = {
  kurs: "Kurs",
  probestunde: "Probestunde",
  hausbesuch: "Hausbesuch",
};

export type Teacher = {
  id: string;
  name: string;
  role: string;
  studio: string;
  city: string;
  district: string;
  plz: string;
  distanceKm: number;
  offers: OfferType[];
  ages: string;
  rating: number;
  reviews: number;
  prices: string[];
  slots: string[];
  bio: string;
  languages: string[];
  qualification: string;
  yogitierMats: boolean;
  animal: AnimalId;
  color: string;
};

/**
 * BEISPIELPROFILE für den Prototyp – frei erfundene Personen und Studios.
 * In der finalen App kommen hier echte Kinderyogalehrende aus dem
 * YOGITIER®-Netzwerk hinein (z. B. über ein CMS oder eine API).
 */
export const DEMO_LOCATION = "Düsseldorf";

export const teachers: Teacher[] = [
  {
    id: "lena-hoffmann",
    name: "Lena Hoffmann",
    role: "Kinderyogalehrerin",
    studio: "Kinderyoga am Rhein",
    city: "Düsseldorf",
    district: "Bilk",
    plz: "40225",
    distanceKm: 1.2,
    offers: ["kurs", "probestunde"],
    ages: "3–10 Jahre",
    rating: 4.9,
    reviews: 38,
    prices: ["Kurs mit 10 Terminen ab 120 €", "Probestunde kostenlos"],
    slots: ["Di · 15:30 · Kurs 3–6 Jahre", "Do · 16:30 · Kurs 6–10 Jahre"],
    bio: "Lena unterrichtet seit über acht Jahren Kinderyoga. In ihren Stunden reisen die Kinder mit Geschichten durch den Dschungel, übers Meer und bis zu den Sternen.",
    languages: ["Deutsch", "Englisch"],
    qualification: "Kinderyoga-Ausbildung (200 Std.)",
    yogitierMats: true,
    animal: "leo",
    color: "#FBEBC4",
  },
  {
    id: "sophie-kraemer",
    name: "Sophie Krämer",
    role: "Kinderyogalehrerin & Erzieherin",
    studio: "Purzelbaum Yoga",
    city: "Düsseldorf",
    district: "Pempelfort",
    plz: "40477",
    distanceKm: 2.4,
    offers: ["kurs", "hausbesuch"],
    ages: "2–5 Jahre · Eltern-Kind",
    rating: 4.8,
    reviews: 21,
    prices: ["Eltern-Kind-Kurs ab 12 € pro Termin", "Hausbesuch ab 45 €"],
    slots: ["Mi · 10:00 · Eltern-Kind-Yoga", "Sa · 09:30 · Familien-Yoga"],
    bio: "Als Erzieherin weiß Sophie genau, wie viel Bewegung und Ruhe kleine Kinder brauchen. Besonders beliebt sind ihre Eltern-Kind-Stunden am Samstagmorgen.",
    languages: ["Deutsch"],
    qualification: "Zertifizierte Kinderyogalehrerin",
    yogitierMats: true,
    animal: "kimi",
    color: "#FDE9E9",
  },
  {
    id: "miriam-yilmaz",
    name: "Miriam Yilmaz",
    role: "Kinderyogalehrerin",
    studio: "Atemzug Kids",
    city: "Düsseldorf",
    district: "Oberkassel",
    plz: "40545",
    distanceKm: 3.1,
    offers: ["kurs", "probestunde", "hausbesuch"],
    ages: "6–12 Jahre",
    rating: 5.0,
    reviews: 17,
    prices: ["Kurs ab 11 € pro Termin", "Probestunde 5 €", "Hausbesuch ab 50 €"],
    slots: ["Mo · 16:00 · Kurs 6–9 Jahre", "Fr · 15:00 · Kids 10–12 Jahre"],
    bio: "Miriam verbindet Yoga mit Achtsamkeitsspielen und Entspannungstechniken. Ihr Schwerpunkt: Konzentration und Gelassenheit für Schulkinder.",
    languages: ["Deutsch", "Türkisch", "Englisch"],
    qualification: "Kinder- & Jugendyoga-Lehrerin",
    yogitierMats: false,
    animal: "luka",
    color: "#DDEAEA",
  },
  {
    id: "jonas-berger",
    name: "Jonas Berger",
    role: "Kinderyogalehrer",
    studio: "Kleine Krieger",
    city: "Neuss",
    district: "Innenstadt",
    plz: "41460",
    distanceKm: 6.8,
    offers: ["kurs", "probestunde"],
    ages: "5–10 Jahre",
    rating: 4.7,
    reviews: 26,
    prices: ["Kurs ab 10 € pro Termin", "Probestunde kostenlos"],
    slots: ["Di · 17:00 · Kurs 5–8 Jahre", "Sa · 11:00 · Vater-Kind-Yoga"],
    bio: "Jonas bringt Bewegung, Spaß und eine Prise Abenteuer in jede Stunde. Sein Vater-Kind-Yoga am Samstag ist ein echter Geheimtipp.",
    languages: ["Deutsch", "Englisch"],
    qualification: "Kinderyoga-Ausbildung (120 Std.)",
    yogitierMats: true,
    animal: "diego",
    color: "#F6F0D2",
  },
  {
    id: "hannah-wolf",
    name: "Hannah Wolf",
    role: "Kinderyogalehrerin & Physiotherapeutin",
    studio: "Yoga-Wiese",
    city: "Ratingen",
    district: "Mitte",
    plz: "40878",
    distanceKm: 9.5,
    offers: ["hausbesuch", "probestunde"],
    ages: "2–8 Jahre",
    rating: 4.9,
    reviews: 12,
    prices: ["Hausbesuch ab 50 € (bis 4 Kinder)", "Kita-Angebote auf Anfrage"],
    slots: ["Termine nach Absprache", "Auch in Kitas & Grundschulen"],
    bio: "Hannah kommt mit Matten und Musik direkt zu euch nach Hause oder in die Kita. Als Physiotherapeutin achtet sie besonders auf gesunde Bewegung.",
    languages: ["Deutsch"],
    qualification: "Physiotherapeutin & Kinderyogalehrerin",
    yogitierMats: true,
    animal: "benno",
    color: "#E3EAF2",
  },
  {
    id: "clara-neumann",
    name: "Clara Neumann",
    role: "Kinderyogalehrerin",
    studio: "Lotusblüte Kinderyoga",
    city: "Köln",
    district: "Ehrenfeld",
    plz: "50823",
    distanceKm: 33,
    offers: ["kurs", "probestunde"],
    ages: "4–10 Jahre",
    rating: 4.8,
    reviews: 44,
    prices: ["Kurs ab 12 € pro Termin", "Probestunde kostenlos"],
    slots: ["Mi · 15:00 · Kurs 4–6 Jahre", "Mi · 16:15 · Kurs 7–10 Jahre"],
    bio: "Clara liebt Fantasiereisen und baut in jede Stunde eine kleine Geschichte ein. Ihre Kurse finden in einem hellen Hinterhof-Studio statt.",
    languages: ["Deutsch", "Französisch"],
    qualification: "Kinderyoga-Ausbildung (200 Std.)",
    yogitierMats: true,
    animal: "emmi",
    color: "#ECEFF8",
  },
  {
    id: "aylin-demir",
    name: "Aylin Demir",
    role: "Kinderyogalehrerin",
    studio: "Sternenkinder Yoga",
    city: "Berlin",
    district: "Prenzlauer Berg",
    plz: "10405",
    distanceKm: 476,
    offers: ["kurs", "hausbesuch"],
    ages: "3–8 Jahre",
    rating: 4.9,
    reviews: 52,
    prices: ["Kurs ab 13 € pro Termin", "Hausbesuch ab 55 €"],
    slots: ["Mo · 15:30 · Kurs 3–5 Jahre", "Do · 16:00 · Kurs 6–8 Jahre"],
    bio: "Aylin macht Yoga mit Musik, Klangschalen und viel Lachen. Ihre Kinder lieben besonders die Tierreisen und die Endentspannung.",
    languages: ["Deutsch", "Türkisch"],
    qualification: "Zertifizierte Kinderyogalehrerin",
    yogitierMats: true,
    animal: "eddy",
    color: "#F0F6F6",
  },
  {
    id: "marie-fischer",
    name: "Marie Fischer",
    role: "Kinderyogalehrerin & Grundschullehrerin",
    studio: "Yoga mit Herz",
    city: "Hamburg",
    district: "Eimsbüttel",
    plz: "20259",
    distanceKm: 340,
    offers: ["kurs", "probestunde"],
    ages: "6–12 Jahre",
    rating: 4.7,
    reviews: 19,
    prices: ["Kurs ab 11 € pro Termin", "Probestunde kostenlos"],
    slots: ["Di · 16:00 · Kurs 6–9 Jahre", "Fr · 16:00 · Kurs 9–12 Jahre"],
    bio: "Als Grundschullehrerin kennt Marie den Schulalltag. Ihre Stunden helfen Kindern, nach der Schule abzuschalten und neue Energie zu tanken.",
    languages: ["Deutsch", "Englisch"],
    qualification: "Kinderyogalehrerin (Yoga Alliance)",
    yogitierMats: false,
    animal: "freddi",
    color: "#FDE3D3",
  },
  {
    id: "nora-schulte",
    name: "Nora Schulte",
    role: "Kinderyogalehrerin",
    studio: "Mini-Mantra",
    city: "München",
    district: "Schwabing",
    plz: "80801",
    distanceKm: 486,
    offers: ["kurs", "probestunde", "hausbesuch"],
    ages: "2–6 Jahre",
    rating: 5.0,
    reviews: 31,
    prices: ["Kurs ab 14 € pro Termin", "Probestunde kostenlos", "Hausbesuch ab 60 €"],
    slots: ["Mi · 09:30 · Krabbel-Yoga", "Sa · 10:00 · Eltern-Kind-Yoga"],
    bio: "Nora begleitet die Kleinsten mit Liedern, Fingerspielen und sanften Tierübungen. Eltern sind herzlich zum Mitmachen eingeladen.",
    languages: ["Deutsch"],
    qualification: "Kinderyoga-Ausbildung (150 Std.)",
    yogitierMats: true,
    animal: "emmi",
    color: "#E7E2F8",
  },
];

/** einfache Ortssuche für den Prototyp (PLZ-Präfix oder Ortsname) */
export function matchesLocation(t: Teacher, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    t.city.toLowerCase().includes(q) ||
    t.district.toLowerCase().includes(q) ||
    t.plz.startsWith(q) ||
    t.studio.toLowerCase().includes(q) ||
    t.name.toLowerCase().includes(q)
  );
}
