import { animals } from "./animals";
import { stepTypeLabels } from "./worlds";

/**
 * Emmi, die Begleiterin der App: geführte Touren beim ersten Besuch und
 * Antworten auf Fragen (Kinder-App und YOGITIER® Studio). Alle Texte auf Deutsch.
 */

export type GuideArea = "kids" | "studio";
export type TourId = "kinder-start" | "kinder-lernwelt" | "studio-start" | "studio-editor";

export type TourStep = {
  /** CSS-Selektor des hervorgehobenen Elements (ohne: Karte in der Mitte) */
  target?: string;
  title?: string;
  /** „{name}“ wird durch den Namen des Kindes ersetzt */
  text: string;
};

export type Tour = {
  id: TourId;
  area: GuideArea;
  steps: TourStep[];
  /** Erster Schritt als Angebot („Soll ich dir alles zeigen?“) */
  offer?: { yes: string; no: string };
};

export const tours: Record<TourId, Tour> = {
  "kinder-start": {
    id: "kinder-start",
    area: "kids",
    offer: { yes: "Ja, zeig's mir!", no: "Später" },
    steps: [
      {
        title: "Hallo {name}!",
        text: "Ich bin Emmi, das Einhorn. Soll ich dir in einer kleinen Runde zeigen, was du hier alles machen kannst?",
      },
      { target: '[data-tour="kachel-yoga"]', title: "Yoga", text: "Hier turnst du wie die Tiere – mit Geschichten, Musik und meiner Vorlesestimme." },
      { target: '[data-tour="kachel-meditation"]', title: "Meditation", text: "Atemübungen und Fantasiereisen, wenn du ruhig werden oder träumen möchtest." },
      { target: '[data-tour="kachel-tierfreunde"]', title: "Tierfreunde", text: "Das ist die YOGITIER-Bande. Jedes Tier hat einen Mutmacher-Satz für dich." },
      { target: '[data-tour="kachel-memo"]', title: "Memo", text: "Finde die Paare! Jedes Paar schenkt dir einen schönen Satz." },
      { target: '[data-tour="kachel-tagebuch"]', title: "Tagebuch", text: "Male und erzähle, wie du dich heute fühlst." },
      {
        target: '[data-tour="kachel-besonderes"]',
        title: "Besonderes",
        text: "Hier warten die Lernwelten: Videos zum Mitmachen, Quizfragen und Missionen. Für jede Station gibt es einen Stern!",
      },
      { target: '[data-tour="eltern"]', title: "Für deine Eltern", text: "Hinter dem Schloss sehen deine Eltern, was du schon geschafft hast." },
      { target: '[data-tour="emmi"]', title: "Ich bin immer da", text: "Wenn du eine Frage hast, tipp einfach auf mich. Viel Spaß, {name}!" },
    ],
  },
  "kinder-lernwelt": {
    id: "kinder-lernwelt",
    area: "kids",
    steps: [
      { target: '[data-tour="welt-begleiter"]', title: "Deine Lernwelt", text: "Ein Tier begleitet dich durch diese Welt. Tipp auf die Sprechblase, dann liest es dir vor." },
      { target: '[data-tour="welt-station"]', title: "Der Lernpfad", text: "Die leuchtende Station ist dran. Tipp darauf – Schritt für Schritt geht es weiter." },
      { target: '[data-tour="welt-fortschritt"]', title: "Sterne sammeln", text: "Hier siehst du, wie weit du schon bist. Am Ende bekommst du einen Sticker für dein Album!" },
    ],
  },
  "studio-start": {
    id: "studio-start",
    area: "studio",
    offer: { yes: "Tour starten", no: "Später" },
    steps: [
      {
        title: "Willkommen im YOGITIER Studio!",
        text: "Ich bin Emmi. In einer Minute zeige ich dir, wie du hier Lernwelten mit Videos, Übungen und Quiz für Kinder gestaltest.",
      },
      { target: '[data-tour="studio-nav"]', title: "Alle Bereiche", text: "Übersicht, Lernwelten, Medien und Einstellungen – hier wechselst du zwischen ihnen." },
      { target: '[data-tour="studio-kpis"]', title: "Auf einen Blick", text: "Wie viele Lernwelten und Videos es gibt, wie viel Speicher belegt ist und was Kinder schon geschafft haben." },
      { target: '[data-tour="studio-neu"]', title: "Neue Lernwelt", text: "Mit einer Vorlage bist du in wenigen Minuten fertig: Umgebung wählen, Video hochladen, veröffentlichen." },
      { target: '[data-tour="studio-app"]', title: "Ergebnis ansehen", text: "Hier öffnest du die Kinder-App. Am besten im selben Browser – dort sind deine Lernwelten gespeichert." },
      { target: '[data-tour="emmi"]', title: "Fragen?", text: "Klick auf mich. Ich erkläre dir jeden Schritt und sage dir, was vor dem Veröffentlichen noch fehlt." },
    ],
  },
  "studio-editor": {
    id: "studio-editor",
    area: "studio",
    steps: [
      { target: '[data-tour="editor-grunddaten"]', title: "1 · Grunddaten", text: "Titel, Kategorie, Alter und das Tier, das die Kinder begrüßt." },
      { target: '[data-tour="editor-umgebung"]', title: "2 · Umgebung", text: "Szene, Farbe, Klang und Sticker – so wird jede Lernwelt zu einem eigenen Ort." },
      {
        target: '[data-tour="editor-lernpfad"]',
        title: "3 · Lernpfad",
        text: "Die Stationen: Video mit Mitmach-Stopps, Übung, Atemübung, Timer, Quiz oder Mission. Klapp eine Station auf, um sie zu bearbeiten.",
      },
      { target: '[data-tour="editor-vorschau"]', title: "Live-Vorschau", text: "So sehen es die Kinder. Jede Änderung erscheint sofort – gespeichert wird automatisch." },
      { target: '[data-tour="editor-veroeffentlichen"]', title: "Veröffentlichen", text: "Fertig? Dann erscheint die Lernwelt mit einem Klick in der Kinder-App." },
    ],
  },
};

/** Welche Tour zu welcher Seite gehört (für „Tour starten“ im Chat). */
export function tourForPath(area: GuideArea, path: string): TourId {
  if (area === "studio") return /^\/admin\/welten\/[^/]+$/.test(path) ? "studio-editor" : "studio-start";
  return /^\/welten\/[^/]+$/.test(path) ? "kinder-lernwelt" : "kinder-start";
}

// ---------------------------------------------------------------------------
// Wissen für Fragen & Antworten
// ---------------------------------------------------------------------------

export type GuideContext = {
  area: GuideArea;
  path: string;
  name: string;
  hour: number;
  stars: number;
  stickers: number;
  worldsDone: number;
  studio?: { worlds: number; published: number; videos: number; issues: string[] | null };
};

export type GuideAction = { label: string; href?: string; tour?: TourId };

export type GuideTopic = {
  id: string;
  area: GuideArea | "beide";
  keywords: string[];
  /** Gewichtung beim Abgleich (Begrüßungen niedrig, Sicherheit hoch) */
  weight?: number;
  answer: string | ((ctx: GuideContext) => string);
  actions?: GuideAction[] | ((ctx: GuideContext) => GuideAction[]);
};

const JOKES = [
  "Was macht ein Einhorn beim Yoga? Den Regenbogen!",
  "Treffen sich zwei Kerzen. Fragt die eine: „Ist Wasser gefährlich?“ Sagt die andere: „Davon kannst du ausgehen!“",
  "Was sitzt auf dem Baum und ruft „Aha“? Ein Uhu mit Schnupfen!",
  "Warum können Elefanten nicht Fahrrad fahren? Weil sie keinen Daumen zum Klingeln haben!",
  "Was ist grün und klopft an die Tür? Ein Klopfsalat!",
];

const daytime = (h: number) => (h < 11 ? "morgen" : h >= 18 ? "abend" : "tag");

export const guideTopics: GuideTopic[] = [
  // --- Sicherheit zuerst ---------------------------------------------------
  {
    id: "notfall",
    area: "kids",
    weight: 3,
    keywords: ["weh", "aua", "schmerz", "bauchweh", "kopfweh", "verletzt", "blut", "krank", "notfall", "hilfe hilfe", "jemand tut mir"],
    answer:
      "Oh nein! Bitte sag sofort einem Erwachsenen Bescheid – Mama, Papa oder jemandem, dem du vertraust. Die können dir richtig helfen. Ich bin nur ein Einhorn in der App.",
  },
  // --- Kinder-App ------------------------------------------------------------
  {
    id: "hallo",
    area: "beide",
    weight: 0.5,
    keywords: ["hallo", "hi", "hey", "huhu", "guten morgen", "guten tag", "guten abend", "servus", "moin", "hola", "hello"],
    answer: (c) =>
      c.area === "studio"
        ? "Hallo! Ich bin Emmi, deine Assistentin im Studio. Frag mich zum Beispiel, wie du ein Video hochlädst oder eine Lernwelt veröffentlichst."
        : `Hallo${c.name ? ` ${c.name}` : ""}! Schön, dass du da bist. Frag mich, was du hier machen kannst – oder tipp unten auf eine Idee.`,
  },
  {
    id: "wer",
    area: "beide",
    keywords: ["wer bist du", "wie heisst du", "was bist du", "einhorn", "quien eres"],
    answer: (c) =>
      c.area === "studio"
        ? "Ich bin Emmi, das Einhorn aus der YOGITIER-Bande. Im Studio erkläre ich dir alle Schritte – in der Kinder-App begleite ich die Kinder."
        : "Ich bin Emmi, das Einhorn aus der YOGITIER-Bande. Mit meinem Regenbogen-Schweif male ich bunte Bilder in den Himmel – und ich zeige dir alles in der App.",
  },
  {
    id: "idee",
    area: "kids",
    keywords: ["was kann ich", "was soll ich", "was machen", "langweilig", "idee", "vorschlag", "spielen", "tipp", "was gibt es"],
    answer: (c) =>
      ({
        morgen: "Guten Morgen! Wie wäre es mit dem Guten-Morgen-Yoga? Damit wird dein Körper ganz wach.",
        tag: "Lust auf Bewegung? Die Dschungel-Bewegungspause ist super – mit Video zum Mitmachen!",
        abend: "Bald ist Schlafenszeit. Die Weltraum-Traumreise macht dich schön ruhig.",
      })[daytime(c.hour)],
    actions: (c) =>
      ({
        morgen: [{ label: "Guten-Morgen-Yoga", href: "/yoga/stunde/guten-morgen" }],
        tag: [{ label: "Zur Bewegungspause", href: "/welten/dschungel-pause" }],
        abend: [{ label: "Zur Traumreise", href: "/welten/weltraum-ruhe" }],
      })[daytime(c.hour)],
  },
  {
    id: "yoga",
    area: "kids",
    keywords: ["yoga", "turnen", "uebung", "pose", "stunde", "bewegen", "bewegung", "sport", "strecken", "wuerfel"],
    answer: "Beim Yoga turnst du wie die Tiere: als Baum, Löwe oder Katze. Es gibt Yoga-Stunden mit Geschichte und einen Yoga-Würfel, der dir eine Übung aussucht.",
    actions: [
      { label: "Zu Yoga", href: "/yoga" },
      { label: "Yoga-Würfel", href: "/yoga/wuerfel" },
    ],
  },
  {
    id: "ruhe",
    area: "kids",
    keywords: ["ruhig", "ruhe", "atmen", "atmung", "atem", "entspannen", "meditation", "stress", "durchatmen"],
    answer: "Wenn du ruhig werden möchtest, hilft eine Atemübung. Probier die Ballon-Atmung: Beim Einatmen wird der Ballon groß, beim Ausatmen wieder klein.",
    actions: [
      { label: "Ballon-Atmung", href: "/meditation/atmen/ballon-atmung" },
      { label: "Alle Atemübungen", href: "/meditation" },
    ],
  },
  {
    id: "traurig",
    area: "kids",
    weight: 1.5,
    keywords: ["traurig", "weinen", "allein", "einsam", "vermisse", "nicht gut"],
    answer:
      "Oh, das tut mir leid. Traurig sein ist okay. Nimm dein Kuscheltier in den Arm und atme mit ihm – oder male dein Gefühl in dein Tagebuch. Und erzähl es einem Erwachsenen, der dich lieb hat.",
    actions: [
      { label: "Kuscheltier-Atmung", href: "/meditation/atmen/kuscheltier-atmung" },
      { label: "Mein Tagebuch", href: "/tagebuch" },
    ],
  },
  {
    id: "wut",
    area: "kids",
    weight: 1.5,
    keywords: ["wuetend", "sauer", "aerger", "wut", "boese", "genervt", "zornig"],
    answer: "Wut ist ein starkes Gefühl! Probier den Löwenatem: tief einatmen und dann mit einem großen Löwen-Brüllen ausatmen. Danach fühlt es sich leichter an.",
    actions: [
      { label: "Löwenatem", href: "/meditation/atmen/loewenatem" },
      { label: "Wut-weg-Yoga", href: "/yoga/stunde/wut-weg" },
    ],
  },
  {
    id: "angst",
    area: "kids",
    weight: 1.5,
    keywords: ["angst", "fuerchte", "gruselig", "nervoes", "aufgeregt", "unsicher", "mut"],
    answer: "Wenn du aufgeregt bist oder Angst hast, leg eine Hand auf deinen Bauch und atme ganz langsam. Die Finger-Atmung hilft auch. Und sag es jemandem, dem du vertraust.",
    actions: [
      { label: "Finger-Atmung", href: "/meditation/atmen/finger-atmung" },
      { label: "Mutmacher-Yoga", href: "/yoga/stunde/mutmacher" },
    ],
  },
  {
    id: "froh",
    area: "kids",
    keywords: ["gluecklich", "froh", "froehlich", "gut drauf", "freue mich", "mir geht es gut"],
    answer: "Juhu, wie schön! Halte das gute Gefühl in deinem Tagebuch fest – dann kannst du es später wieder anschauen.",
    actions: [{ label: "Mein Tagebuch", href: "/tagebuch" }],
  },
  {
    id: "schlafen",
    area: "kids",
    keywords: ["muede", "schlafen", "einschlafen", "bett", "nacht", "gute nacht", "traeumen", "traum"],
    answer: "Zeit zum Kuscheln! Das Gute-Nacht-Yoga und die Weltraum-Traumreise helfen dir beim Einschlafen.",
    actions: [
      { label: "Gute-Nacht-Yoga", href: "/yoga/stunde/gute-nacht" },
      { label: "Weltraum-Traumreise", href: "/welten/weltraum-ruhe" },
    ],
  },
  {
    id: "lernwelten",
    area: "kids",
    keywords: ["lernwelt", "lernwelten", "welt", "video", "mission", "station", "dschungel", "abenteuer", "quiz"],
    answer: "Lernwelten sind kleine Abenteuer: Du schaust ein Video, machst mit, löst Quizfragen und erfüllst Missionen. Für jede Station gibt es einen Stern und am Ende einen Sticker!",
    actions: [{ label: "Zu den Lernwelten", href: "/welten" }],
  },
  {
    id: "sterne",
    area: "kids",
    keywords: ["stern", "sterne", "sticker", "album", "punkte", "belohnung", "gesammelt", "wie viele"],
    answer: (c) =>
      `Du hast schon ${c.stars} ${c.stars === 1 ? "Stern" : "Sterne"} gesammelt${c.stickers ? ` und ${c.stickers} ${c.stickers === 1 ? "Sticker" : "Sticker"} in deinem Album` : ""}! Sterne bekommst du für jede Übung und jede Station. Sticker gibt es, wenn du eine ganze Lernwelt schaffst.`,
    actions: [{ label: "Mein Sticker-Album", href: "/welten" }],
  },
  {
    id: "tiere",
    area: "kids",
    keywords: ["tiere", "tier", "tierfreunde", "bande", "freunde", ...animals.map((a) => a.name.toLowerCase())],
    answer: `Die YOGITIER-Bande: ${animals.map((a) => a.fullName).join(", ")}. Jedes Tier hat eine Superkraft und einen Mutmacher-Satz für dich.`,
    actions: [{ label: "Zu den Tierfreunden", href: "/tierfreunde" }],
  },
  {
    id: "memo",
    area: "kids",
    keywords: ["memo", "memory", "karten", "paare", "merken"],
    answer: "Beim Affirmation-Memo deckst du Karten auf und suchst Paare. Jedes Paar schenkt dir einen Mutmacher-Satz.",
    actions: [{ label: "Memo spielen", href: "/memo" }],
  },
  {
    id: "tagebuch",
    area: "kids",
    keywords: ["tagebuch", "malen", "gefuehl", "gefuehle", "stimmung", "dankbar", "zeichnen"],
    answer: "In deinem Tagebuch wählst du, wie du dich fühlst, schreibst auf, wofür du dankbar bist, und kannst sogar malen.",
    actions: [{ label: "Mein Tagebuch", href: "/tagebuch" }],
  },
  {
    id: "zaehne",
    area: "kids",
    keywords: ["zaehne", "zahn", "putzen", "zahnbuerste"],
    answer: "Zähneputzen macht mit dem Zähneputz-Profi Spaß: zwei Minuten mit Timer für alle Ecken und ein kleines Quiz!",
    actions: [{ label: "Zähneputz-Profi", href: "/welten/zaehne-putzen" }],
  },
  {
    id: "wasser",
    area: "kids",
    keywords: ["wasser", "trinken", "durst", "durstig"],
    answer: "Wasser ist super für deinen Körper und deinen Kopf! Werde Wasser-Detektiv und sammle Tropfen.",
    actions: [{ label: "Wasser-Detektive", href: "/welten/wasser-trinken" }],
  },
  {
    id: "eltern",
    area: "kids",
    keywords: ["eltern", "mama", "papa", "erwachsene", "einstellungen", "fortschritt", "shop", "matte"],
    answer: "Der Eltern-Bereich ist hinter dem Schloss oben rechts im Menü. Dort sehen deine Eltern deinen Fortschritt, die Einstellungen und Tipps.",
    actions: [{ label: "Zum Eltern-Bereich", href: "/eltern" }],
  },
  {
    id: "lehrerin",
    area: "kids",
    keywords: ["lehrerin", "lehrer", "kurs", "yogalehrerin", "probestunde", "in der naehe"],
    answer: "Mit deinen Eltern könnt ihr eine echte Kinderyoga-Lehrerin in eurer Nähe finden – für einen Kurs oder eine Probestunde.",
    actions: [{ label: "Lehrerin finden", href: "/finder" }],
  },
  {
    id: "advent",
    area: "kids",
    keywords: ["weihnachten", "advent", "adventskalender", "kalender", "winter", "schnee", "nikolaus"],
    answer: "Unter „Besonderes“ wartet der Adventskalender mit 24 Türchen – dazu Weihnachts-Yoga und eine Winterreise.",
    actions: [{ label: "Zu Besonderes", href: "/besonderes" }],
  },
  {
    id: "stimme",
    area: "beide",
    keywords: ["stimme", "leise", "laut", "lautstaerke", "stumm", "vorlesen", "sprechen", "voz"],
    answer: (c) =>
      c.area === "studio"
        ? "Meine Stimme schaltest du unten im Fenster mit dem Lautsprecher-Knopf an oder aus."
        : "Meine Stimme schaltest du unten mit dem Lautsprecher-Knopf an oder aus. Die Vorlesestimme und die Töne der App stellen deine Eltern im Eltern-Bereich ein.",
  },
  {
    id: "witz",
    area: "beide",
    keywords: ["witz", "lustig", "lachen", "witzig", "spass", "chiste"],
    answer: () => JOKES[Math.floor(Math.random() * JOKES.length)],
  },
  {
    id: "danke",
    area: "beide",
    keywords: ["danke", "dankeschoen", "lieb von dir", "gracias", "thanks"],
    weight: 0.8,
    answer: "Gern geschehen! Du bist toll.",
  },
  {
    id: "tschuess",
    area: "beide",
    keywords: ["tschuess", "bye", "ciao", "bis bald", "bis spaeter", "adios", "auf wiedersehen"],
    answer: (c) => (c.area === "studio" ? "Bis bald! Ich bin hier unten rechts, wenn du mich brauchst." : `Tschüss${c.name ? ` ${c.name}` : ""}! Ich bin immer oben in der Ecke, wenn du mich brauchst.`),
  },
  {
    id: "tour",
    area: "beide",
    keywords: ["tour", "zeig mir", "zeig", "hilfe", "help", "wie geht", "erklaer", "rundgang", "anleitung", "ayuda", "alles"],
    answer: (c) => (c.area === "studio" ? "Gern! Ich führe dich in einer kurzen Tour durch diese Seite." : "Klar! Ich zeige dir alles in einer kleinen Runde."),
  },
  // --- YOGITIER Studio --------------------------------------------------------
  {
    id: "s-neu",
    area: "studio",
    keywords: ["neue lernwelt", "erstell", "anleg", "neu", "vorlage", "create", "crear", "nueva"],
    answer:
      "So geht's: „Lernwelten“ → „Neue Lernwelt“ → eine Vorlage wählen, zum Beispiel „Bewegungspause“. Danach Titel, Umgebung und Stationen anpassen – alles speichert automatisch.",
    actions: [{ label: "Zu den Lernwelten", href: "/admin/welten" }],
  },
  {
    id: "s-video",
    area: "studio",
    keywords: ["video", "videos", "hochlad", "upload", "mp4", "datei", "film", "subir", "aufnehm", "mediathek", "medien"],
    answer:
      "Öffne eine Lernwelt, klapp eine Video-Station auf und zieh deine Datei in das Feld „Hochladen“ (MP4, MOV oder WebM, am besten im Hochformat). Vorschaubild und Dauer erkennt das Studio automatisch. Alle Videos findest du unter „Medien“.",
    actions: [{ label: "Zu den Medien", href: "/admin/medien" }],
  },
  {
    id: "s-stopp",
    area: "studio",
    keywords: ["stopp", "stopps", "pause", "jetzt du", "mitmach", "mitmachen", "interaktiv", "anhalten", "countdown"],
    answer:
      "Mitmach-Stopps halten das Video an: Die Kinder hören eine Aufforderung, machen mit – mit Countdown – und dann läuft das Video weiter. Spiel das Video bis zur passenden Stelle ab und klicke „Stopp an aktueller Stelle“.",
  },
  {
    id: "s-umgebung",
    area: "studio",
    keywords: ["umgebung", "szene", "hintergrund", "farbe", "design", "thema", "entorno", "gestalt", "aussehen", "sticker"],
    answer:
      "Unter „Umgebung gestalten“ wählst du die Szene (Dschungel, Unterwasser, Weltraum, Zauberwald, Wiese, Winter, Regenbogen oder Strand), die Akzentfarbe, den Klang und den Sticker als Belohnung. Die Vorschau zeigt alles sofort.",
  },
  {
    id: "s-klang",
    area: "studio",
    keywords: ["klang", "sound", "musik", "ambient", "geraeusch", "ton", "hintergrundklang"],
    answer: "Es gibt sanfte Klangwelten: Wald, Meer, Regen, Weltraum und Spieluhr. Mit „Probe“ hörst du sechs Sekunden hinein.",
  },
  {
    id: "s-stationen",
    area: "studio",
    keywords: ["station", "stationen", "quiz", "timer", "mission", "uebung", "atemuebung", "lernpfad", "reihenfolge"],
    answer: `Stationen im Lernpfad: ${Object.values(stepTypeLabels)
      .map((t) => t.label)
      .join(", ")}. Mit den Pfeilen änderst du die Reihenfolge, mit „Station hinzufügen“ kommt eine neue dazu.`,
  },
  {
    id: "s-fehlt",
    area: "studio",
    weight: 1.2,
    keywords: ["was fehlt", "fehlt", "fertig", "pruef", "check", "fehler", "bereit", "kontroll"],
    answer: (c) => {
      if (!c.studio?.issues) return "Öffne eine Lernwelt im Editor – dann prüfe ich sie für dich.";
      if (!c.studio.issues.length) return "Alles bereit! Du kannst die Lernwelt veröffentlichen.";
      return `Vor dem Veröffentlichen fehlt noch: ${c.studio.issues.join("; ")}.`;
    },
  },
  {
    id: "s-veroeffentlichen",
    area: "studio",
    keywords: ["veroeffentlich", "publizier", "live", "online", "freigeb", "publicar", "zurueckzieh"],
    answer: (c) =>
      `Klicke im Editor oben rechts auf „Veröffentlichen“. Danach erscheint die Lernwelt sofort in der Kinder-App unter „Besonderes“.${
        c.studio?.issues?.length ? ` Aktuell fehlt noch: ${c.studio.issues.join("; ")}.` : ""
      }`,
  },
  {
    id: "s-vorschau",
    area: "studio",
    keywords: ["vorschau", "handy", "preview", "ansehen", "testen", "kinder-app", "app oeffnen"],
    answer: "Die Live-Vorschau im Editor zeigt die Lernwelt auf einem Handy. „Im neuen Tab“ öffnet sie groß, „App öffnen“ zeigt die ganze Kinder-App – am besten im selben Browser.",
  },
  {
    id: "s-youtube",
    area: "studio",
    keywords: ["youtube", "vimeo", "link", "url", "einbetten", "verlinken"],
    answer: "YouTube- und Vimeo-Links kannst du einfügen. Mitmach-Stopps funktionieren aber nur mit hochgeladenen Videos oder direkten MP4-Links.",
  },
  {
    id: "s-speicher",
    area: "studio",
    keywords: ["speicher", "gespeichert", "daten", "backup", "sicher", "export", "import", "voll"],
    answer:
      "Im Prototyp speichert das Studio alles hier im Browser – automatisch. Unter „Einstellungen“ sicherst du alles als Datei und kannst es wieder importieren. In der fertigen Version liegt alles in der Cloud.",
    actions: [{ label: "Zu den Einstellungen", href: "/admin/einstellungen" }],
  },
  {
    id: "s-pin",
    area: "studio",
    keywords: ["pin", "passwort", "zugang", "login", "anmelden", "abmelden", "sicherheit"],
    answer: "Die Admin-PIN änderst du unter „Einstellungen → Zugang zum Studio“ (4 bis 8 Ziffern).",
    actions: [{ label: "Zu den Einstellungen", href: "/admin/einstellungen" }],
  },
  {
    id: "s-hervorheben",
    area: "studio",
    keywords: ["hervorheben", "plakette", "badge", "besonderes", "startseite", "vorne", "kachel"],
    answer: "Unter „Einstellungen“ legst du die Plakette der Kachel „Besonderes“ fest und welche Lernwelt ganz vorne steht. Im Editor geht das auch mit „Hervorheben“.",
  },
  {
    id: "s-reset",
    area: "studio",
    keywords: ["zuruecksetz", "loesch", "reset", "beispiel", "wiederherstell", "von vorne"],
    answer: "In den „Einstellungen“ kannst du die Beispiel-Lernwelten wiederherstellen oder das Studio komplett zurücksetzen.",
    actions: [{ label: "Zu den Einstellungen", href: "/admin/einstellungen" }],
  },
  {
    id: "s-zahlen",
    area: "studio",
    keywords: ["wie viele", "anzahl", "statistik", "uebersicht", "zahlen"],
    answer: (c) =>
      c.studio
        ? `Im Studio gibt es ${c.studio.worlds} Lernwelten (${c.studio.published} veröffentlicht) und ${c.studio.videos} hochgeladene Videos.`
        : "Die Zahlen findest du in der Übersicht.",
    actions: [{ label: "Zur Übersicht", href: "/admin" }],
  },
  {
    id: "s-ki",
    area: "beide",
    keywords: ["ki", "kuenstliche intelligenz", "chatgpt", "claude", "cloud", "server", "synchron", "andere geraete", "ia"],
    answer:
      "Im Prototyp antworte ich mit meinem eingebauten Wissen, und alles bleibt auf diesem Gerät. In der fertigen Version kann ich mit einer echten KI antworten – kindgerecht und sicher – und die Inhalte liegen in der Cloud.",
  },
];

export const guideWelcome = (c: Pick<GuideContext, "area" | "name">) =>
  c.area === "studio"
    ? "Hallo! Ich bin Emmi, deine Assistentin im Studio. Wobei kann ich dir helfen?"
    : `Hallo${c.name ? ` ${c.name}` : ""}! Ich bin Emmi. Was möchtest du wissen?`;

export const guideFallback = (area: GuideArea) =>
  area === "studio" ? "Dazu weiß ich leider noch nichts. Probier zum Beispiel eine dieser Fragen:" : "Hmm, das weiß ich leider noch nicht. Aber ich kann dir das hier zeigen:";

export const guideSuggestions: Record<GuideArea, string[]> = {
  kids: ["Was kann ich machen?", "Ich bin aufgeregt", "Wie bekomme ich Sticker?", "Erzähl einen Witz", "Zeig mir alles"],
  studio: ["Wie lade ich ein Video hoch?", "Wie erstelle ich eine Lernwelt?", "Was sind Mitmach-Stopps?", "Was fehlt noch?", "Zeig mir das Studio"],
};
