import type { AnimalId } from "./types";

/**
 * Inhalte von yogitier.de (Stand: Oktober 2026).
 * Preise und Links bitte vor einer Veröffentlichung mit dem Shop abgleichen.
 */
export const SHOP_URL = "https://yogitier.de";

export const shop = {
  mats: {
    title: "Kinder-Yogamatten",
    subtitle: "Die Yogamatte, die Kinder freiwillig ausrollen.",
    url: "https://yogitier.de/collections/kinder-yogamatte",
    price: "69,95 €",
    facts: [
      "155 × 60 cm · 2 mm",
      "Naturkautschuk & Mikrofaser-Velours",
      "Waschbar bei 30 °C",
      "Faltbar & rutschhemmend",
      "Schadstofffrei geprüft",
      "Ab ca. 2 Jahren",
    ],
  },
  accessories: [
    {
      title: "Löwenmut & Einhornzauber",
      subtitle: "Achtsame Familienmomente mit YOGITIER®",
      price: "21,95 €",
      url: "https://yogitier.de/products/lowenmut-einhornzauber-achtsame-familienmomente-mit-yogitier",
      animal: "leo" as AnimalId,
    },
    {
      title: "Bewegte Momente",
      subtitle: "Das Yoga Memory",
      price: "22,95 €",
      url: "https://yogitier.de/products/yoga-memo-aus-holz",
      animal: "luka" as AnimalId,
    },
    {
      title: "YOGILÖW",
      subtitle: "Der biegsame Löwe",
      price: "29,95 €",
      oldPrice: "39,95 €",
      url: "https://yogitier.de/products/yogilow-der-biegsame-lowe",
      animal: "leo" as AnimalId,
    },
    {
      title: "Mini YOGITIER",
      subtitle: "Die Bande im 7er-Set",
      price: "24,95 €",
      url: "https://yogitier.de/products/mini-yogitier",
      animal: "diego" as AnimalId,
    },
    {
      title: "Augenmasken",
      subtitle: "Emmi das Einhorn & Luka der Leopard",
      price: "ab 12,95 €",
      url: "https://yogitier.de/collections/yoga-zubehor",
      animal: "emmi" as AnimalId,
    },
  ],
  bundles: [
    {
      title: "Ruheinsel",
      subtitle: "Täglicher Ausgleich für dein Kind",
      url: "https://yogitier.de/products/starter-set-complete",
    },
    {
      title: "Ruheinsel Family",
      subtitle: "DAILY WELLNESS für die ganze Familie",
      url: "https://yogitier.de/products/holt-euch-eure-daily-wellness",
    },
    {
      title: "Ruheinsel Kita",
      subtitle: "Achtsam gemeinsam – für Kitas & Einrichtungen",
      url: "https://yogitier.de/products/ruheinsel-kita-achtsam-gemeinsam",
      price: "419,70 €",
      oldPrice: "559,60 €",
    },
  ],
  voucher: { title: "Digitaler Geschenkgutschein", url: "https://yogitier.de/products/yogitier-digitaler-geschenkgutschein" },
  perks: ["Versandkostenfrei ab 50 €", "Lieferung in 3–5 Werktagen", "Auch nach Österreich & in die Schweiz"],
};

const CDN = "https://cdn.shopify.com/s/files/1/0758/1106/2089/files";

export const downloads = [
  {
    title: "YOGITIER® Eltern-Kompass",
    text: "Dein Fahrplan für weniger Stress und mehr Verbindung – mit Tipps für Morgen, Nachmittag und gemeinsame Kreativzeit.",
    url: `${CDN}/YOGITIER_Eltern-Guide.pdf?v=1775817667`,
    format: "PDF",
    animal: "kimi" as AnimalId,
  },
  {
    title: "Bastelvorlage & Ausmalbilder",
    text: "Masken der YOGITIER-Bande zum Ausmalen, Ausschneiden und Spielen.",
    url: `${CDN}/yogitier_Masken_sw.pdf?v=1750242917`,
    format: "PDF",
    animal: "leo" as AnimalId,
  },
  {
    title: "DIY-Yoga-Würfel",
    text: "Würfel ausschneiden, zusammenkleben und losyogieren – für Einsteiger.",
    url: `${CDN}/Wuerfel_mit_Yoga-Uebungen.pdf?v=1756903462`,
    format: "PDF",
    animal: "diego" as AnimalId,
  },
  {
    title: "Affirmationssonne",
    text: "Positive Sätze, die Kinder ermutigen, freundlich mit sich selbst zu sprechen.",
    url: `${CDN}/Affirmationen_YOGITIER.pdf?v=1771064365`,
    format: "PDF",
    animal: "emmi" as AnimalId,
  },
  {
    title: "YOGITIER®-Bande",
    text: "Alle Tiere zum Spielen, Ausschneiden und für bunte Kindergeburtstage.",
    url: `${CDN}/YOGITIER-_Bande.pdf?v=1777024227`,
    format: "PDF",
    animal: "benno" as AnimalId,
  },
  {
    title: "Himmel & Erde – Worte der Dankbarkeit",
    text: "Ein Faltspiel, das Dankbarkeit sichtbar macht.",
    url: `${CDN}/Dankbarkeits-Huepfer.pdf?v=1777024260`,
    format: "PDF",
    animal: "luka" as AnimalId,
  },
  {
    title: "Familien-Wochenplan",
    text: "Ein Wochenkalender, der alle Aufgaben und Rituale im Blick behält.",
    url: `${CDN}/Wochenplan_2026.png?v=1785321860`,
    format: "PNG",
    animal: "eddy" as AnimalId,
  },
  {
    title: "Affirmation-Memory",
    text: "Das Memo-Spiel mit Mutmacher-Sätzen zum Ausdrucken.",
    url: `${CDN}/Affirmation_Memory.pdf?v=1787208891`,
    format: "PDF",
    animal: "freddi" as AnimalId,
  },
];

export const blogPosts = [
  {
    title: "Affirmationen für Kinder: Positive Gedanken bilden mehr Selbstvertrauen und Resilienz",
    date: "9. August 2026",
    excerpt: "Affirmationen stärken Kinder von innen heraus – mit kreativen Ideen und Ritualen für den Familienalltag.",
    url: "https://yogitier.de/blogs/yogitier-blogs/affirmationen",
  },
  {
    title: "Reiseyogamatte vs. klassische Yogamatte: Welche lohnt sich wirklich?",
    date: "1. Juli 2026",
    excerpt: "Wenn es schnell, leicht und flexibel sein soll, bleibt die klassische Matte oft zu Hause.",
    url: "https://yogitier.de/blogs/yogitier-blogs/reiseyogamatte-vs-klassische-yogamatte",
  },
  {
    title: "Geschenk zur Geburt: Die perfekte Matte für Rückbildung, Yoga und Familienalltag",
    date: "28. Juni 2026",
    excerpt: "Ein Geschenk zur Geburt darf mehr sein als nur schön – es darf den Alltag wirklich erleichtern.",
    url: "https://yogitier.de/blogs/yogitier-blogs/geschenk-zur-geburt",
  },
  {
    title: "Warum Yoga heute wichtiger ist denn je",
    date: "21. Juni 2026",
    excerpt: "Die Stimme von außen ist oft lauter als die von innen. Yoga schafft ein Gegengewicht.",
    url: "https://yogitier.de/blogs/yogitier-blogs/alles-gute-zum-welt-yoga-tag",
  },
  {
    title: "Einschulung ohne Druck: Was Kinder wirklich für einen guten Schulstart brauchen",
    date: "7. Juni 2026",
    excerpt: "Schulreife ist viel mehr als Lesen und Rechnen.",
    url: "https://yogitier.de/blogs/yogitier-blogs/schulvorbereitung-worauf-kommt-es-wirklich-an",
  },
  {
    title: "Wo greift Kinderyoga?",
    date: "4. Juni 2026",
    excerpt: "Gefühle lassen sich nicht einfach wegreden – Kinderyoga baut Anspannung über spielerische Bewegung ab.",
    url: "https://yogitier.de/blogs/yogitier-blogs/wo-greift-kinderyoga",
  },
];

/** Zusammengefasst aus dem YOGITIER® Eltern-Kompass */
export const parentTips = [
  {
    title: "Dein Morgen-Date mit dir selbst",
    text: "Schenk dir ein paar Minuten, bevor die Kinder aufwachen: kurz bewegen, eine Tasse Tee, Gedanken notieren. Werden die Kinder früher wach, dürfen sie einfach mitkuscheln.",
    animal: "leo" as AnimalId,
  },
  {
    title: "Die Wohlfühl-Oase nach Kita & Schule",
    text: "Bevor der Haushalt ruft: ein ehrlicher Gefühlscheck, eine Atemübung gegen Wut oder Angst und ein spielerisches Yoga-Memory auf der Matte.",
    animal: "benno" as AnimalId,
  },
  {
    title: "Gemeinsam kreativ werden",
    text: "Etwas mit den Händen zu erschaffen, ist pure Achtsamkeit: Affirmationssonne, Yoga-Würfel oder ein Achtsamkeits-Spaziergang mit allen Sinnen.",
    animal: "emmi" as AnimalId,
  },
];

export const values = [
  { title: "Nachhaltig & umweltbewusst", text: "Nachhaltige Materialien und verantwortungsbewusste Lieferanten." },
  { title: "Achtsam & gemeinsam", text: "Fördert aktiv und spielerisch den Zusammenhalt in der Familie." },
  { title: "Slowing Down", text: "Das Leben entschleunigen – mit ruhigen Aktivitäten." },
  { title: "Tägliches Ritual", text: "Spielerische Rituale und gute Gewohnheiten von klein an." },
];

export const story = {
  founder: "Fei Schäfer",
  paragraphs: [
    "YOGITIER® ist die erste Marke von 8samsam. Gegründet wurde sie von Fei Schäfer – Unternehmerin mit chinesischen Wurzeln, Mama von zwei Töchtern und seit über 15 Jahren Produktentwicklerin für Spielwaren und Premium-Geschenkartikel.",
    "Ihre Töchter Anna und Lia wachsen mit Kinderyoga auf. Aus dem Familienalltag entstand die Idee für Yogamatten, die Kinder lieben – mit Tiermotiven, praktisch und langlebig.",
    "8samsam steht für einen entschleunigten und achtsamen Lebensstil, den Eltern und Kinder gemeinsam erleben: neben wöchentlichen Yogastunden auch eine tägliche „Slow-Time“ von 15 oder 30 Minuten.",
  ],
  quote: "Wer lernt, gut auf sich zu achten, kann auch gut auf andere achten.",
  knownFrom: ["Die Höhle der Löwen", "Yoga World", "Rheinische Post", "Decathlon", "Babykochs"],
};

export const faq = [
  {
    q: "Ab welchem Alter ist die App geeignet?",
    a: "Die Übungen sind für Kinder ab etwa 2 Jahren bis ins Teenageralter gedacht. Kleine Kinder machen am besten gemeinsam mit einem Erwachsenen mit.",
  },
  {
    q: "Braucht mein Kind Vorkenntnisse?",
    a: "Nein. Alle Übungen sind spielerisch erklärt – es geht um Bewegung ohne Druck, nicht um perfekte Haltungen.",
  },
  {
    q: "Wie lange sollten wir üben?",
    a: "Schon 10 Minuten am Tag reichen für eine schöne, alltagstaugliche Routine. Das Tagesziel könnt ihr in den Einstellungen anpassen.",
  },
  {
    q: "Welche Daten speichert die App?",
    a: "In diesem Prototyp bleiben alle Daten (Name, Fortschritt, Tagebuch) ausschließlich lokal auf eurem Gerät. Es gibt keine Werbung, kein Tracking und keine Konten.",
  },
  {
    q: "Brauchen wir eine spezielle Matte?",
    a: "Nein – aber die YOGITIER® Kinder-Yogamatten mit Tiermotiv motivieren Kinder zum Ausrollen. Sie sind waschbar, faltbar und schadstofffrei.",
  },
];

export const legalLinks = [
  { label: "Impressum", url: "https://yogitier.de/pages/contact" },
  { label: "Datenschutz", url: "https://yogitier.de/pages/datenschutzerklarung" },
  { label: "AGB", url: "https://yogitier.de/pages/agb" },
  { label: "Kontakt", url: "https://yogitier.de/pages/kontakt" },
];

export const teacherProgram = {
  title: "Du bist Kinderyogalehrende?",
  text: "Ab 8 Kinder-Yogamatten gibt es 25 % Rabatt – dazu eine WhatsApp-Community mit Ideen für Atemübungen, Entspannungsspiele und Achtsamkeitsrituale.",
  url: "https://yogitier.de/pages/fur-kinderyogalehrende",
  email: "hello@yogitier.de",
};

export const social = {
  instagram: "https://instagram.com/yogitier__8samsam/",
  facebook: "https://facebook.com/YOGITIER",
};
