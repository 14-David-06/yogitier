import type { Ambient, StepType, StudioSettings, World, WorldCategory, WorldTheme } from "@/lib/studio/types";

/** Gestaltbare Umgebungen für Lernwelten */
export const worldThemes: Record<
  WorldTheme,
  { label: string; from: string; to: string; dark: boolean; path: string; description: string }
> = {
  dschungel: { label: "Dschungel", from: "#BFE3B4", to: "#F1F8EA", dark: false, path: "#6E9A63", description: "Blätter, Lianen & Glühwürmchen" },
  unterwasser: { label: "Unterwasser", from: "#9FD3EA", to: "#E4F4FA", dark: false, path: "#3F7FA8", description: "Blubberblasen & Seegras" },
  weltraum: { label: "Weltraum", from: "#2A2754", to: "#4A3F86", dark: true, path: "#A99BF0", description: "Funkelnde Sterne & Planeten" },
  zauberwald: { label: "Zauberwald", from: "#DCEBD0", to: "#F3F7E8", dark: false, path: "#5E9C6A", description: "Tannen, Moos & fallende Blätter" },
  wiese: { label: "Sommerwiese", from: "#CFE9F7", to: "#FBF6DE", dark: false, path: "#8CB45E", description: "Sonne, Hügel & Blumen" },
  winter: { label: "Winterland", from: "#E3EEF7", to: "#F7F3FB", dark: false, path: "#8AA7C9", description: "Leiser Schneefall" },
  regenbogen: { label: "Regenbogenland", from: "#F6DDF0", to: "#E7E2F8", dark: false, path: "#A99BF0", description: "Regenbogen & Wolken" },
  strand: { label: "Strand", from: "#BEE3F2", to: "#FBEFD5", dark: false, path: "#E8961E", description: "Meer, Sand & Sonne" },
};

export const accentColors = ["#6E9A63", "#3F7FA8", "#A99BF0", "#E8961E", "#E9879E", "#487270", "#E0612A", "#A8714F"];

export const ambientLabels: Record<Ambient, string> = {
  aus: "Ohne Klang",
  wald: "Waldgeräusche",
  meer: "Meeresrauschen",
  regen: "Sanfter Regen",
  weltraum: "Weltraum-Klang",
  spieluhr: "Spieluhr",
};

export const categoryLabels: Record<WorldCategory, string> = {
  yoga: "Yoga",
  bewegung: "Bewegung",
  atmung: "Atmung",
  achtsamkeit: "Achtsamkeit",
  gewohnheiten: "Gesunde Gewohnheiten",
  ernaehrung: "Essen & Trinken",
  schlaf: "Schlaf & Ruhe",
};

export const stepTypeLabels: Record<StepType, { label: string; hint: string }> = {
  info: { label: "Info-Karte", hint: "Kurz erklären – mit Vorlesestimme" },
  video: { label: "Video", hint: "Hochladen oder Link – mit Mitmach-Stopps" },
  uebung: { label: "Yoga-Übung", hint: "Übung aus der Bibliothek mit Timer" },
  atmung: { label: "Atemübung", hint: "Geführte Atemübung mit Animation" },
  timer: { label: "Mitmach-Timer", hint: "Abschnitte mit Ansage, z. B. Zähneputzen" },
  quiz: { label: "Quiz-Frage", hint: "Spielerisch Wissen prüfen" },
  aufgabe: { label: "Mission", hint: "Alltags-Aufgabe zum Abhaken" },
};

export const ageOptions = ["ab 2 Jahren", "ab 3 Jahren", "ab 4 Jahren", "ab 5 Jahren", "6–10 Jahre", "für alle"];

export const DEFAULT_SETTINGS: StudioSettings = {
  specialBadge: "Weihnachten",
  featuredWorldId: "dschungel-pause",
  adminPin: "1234",
};

export const DEMO_VIDEO_URL = "/media/demo-baum.mp4";

const now = "2026-10-17T09:00:00.000Z";

/** Beispiel-Lernwelten, die beim ersten Start im Studio angelegt werden. */
export const seedWorlds: World[] = [
  {
    id: "dschungel-pause",
    title: "Dschungel-Bewegungspause",
    subtitle: "Toben, strecken, durchatmen – wie die Tiere im Dschungel",
    category: "bewegung",
    age: "ab 4 Jahren",
    guide: "luka",
    greeting: "Hallo! Ich bin Luka. Komm mit in den Dschungel – heute bewegen wir uns wie die Tiere!",
    theme: "dschungel",
    accent: "#6E9A63",
    ambient: "wald",
    reward: { emoji: "🌿", name: "Dschungel-Held" },
    status: "veroeffentlicht",
    createdAt: now,
    updatedAt: now,
    steps: [
      {
        id: "dp-1",
        type: "info",
        title: "Willkommen im Dschungel",
        text: "Im Dschungel ist immer etwas los! Heute bewegen wir uns wie die Tiere – das macht wach, stark und fröhlich.",
      },
      {
        id: "dp-2",
        type: "video",
        title: "Video: Der Baum mit Emmi",
        source: { kind: "url", url: DEMO_VIDEO_URL, poster: "/media/demo-baum.jpg" },
        instruction: "Schau Emmi zu – und wenn das Video anhält, bist du dran!",
        stops: [{ id: "dp-2-s1", at: 12.5, prompt: "Jetzt du! Stell dich wie ein Baum auf ein Bein – wackeln ist erlaubt.", seconds: 15 }],
      },
      { id: "dp-3", type: "uebung", title: "Der Leopard", pose: "leopard", seconds: 30, cue: "Streck dich lang wie Luka der Leopard – erst ein Bein, dann das andere." },
      {
        id: "dp-4",
        type: "timer",
        title: "Tier-Parade",
        intro: "Beweg dich wie die Tiere – jedes Tier 20 Sekunden!",
        segments: [
          { id: "dp-4-a", label: "Stapfen wie ein Bär", seconds: 20 },
          { id: "dp-4-b", label: "Hüpfen wie ein Frosch", seconds: 20 },
          { id: "dp-4-c", label: "Schleichen wie ein Leopard", seconds: 20 },
          { id: "dp-4-d", label: "Stampfen wie ein Elefant", seconds: 20 },
        ],
      },
      {
        id: "dp-5",
        type: "quiz",
        title: "Quiz: Dein Herz",
        question: "Was passiert in deinem Körper, wenn du ganz viel tobst?",
        options: [
          { id: "a", text: "Mein Herz klopft schneller", emoji: "💓" },
          { id: "b", text: "Ich werde unsichtbar", emoji: "🫥" },
          { id: "c", text: "Meine Haare werden grün", emoji: "🟢" },
        ],
        correct: "a",
        explanation: "Genau! Beim Toben pumpt dein Herz schneller, damit deine Muskeln genug Kraft bekommen.",
      },
      { id: "dp-6", type: "atmung", title: "Ballon-Atmung zum Runterkommen", breath: "ballon-atmung" },
    ],
  },
  {
    id: "zaehne-putzen",
    title: "Zähneputz-Profi",
    subtitle: "Zwei Minuten, vier Ecken – mit Benno wird Putzen zum Spiel",
    category: "gewohnheiten",
    age: "ab 3 Jahren",
    guide: "benno",
    greeting: "Hallo, ich bin Benno! Hol deine Zahnbürste – wir putzen zusammen, bis alles glänzt.",
    theme: "unterwasser",
    accent: "#3F7FA8",
    ambient: "meer",
    reward: { emoji: "🦷", name: "Glitzer-Zahn" },
    status: "veroeffentlicht",
    createdAt: now,
    updatedAt: now,
    steps: [
      {
        id: "zp-1",
        type: "info",
        title: "Warum putzen wir Zähne?",
        text: "Nach dem Essen bleiben winzige Essensreste an den Zähnen. Wenn wir sie wegputzen, bleiben die Zähne gesund und stark – und dein Lächeln strahlt!",
      },
      {
        id: "zp-2",
        type: "quiz",
        title: "Quiz: Wie lange?",
        question: "Wie lange solltest du deine Zähne putzen?",
        options: [
          { id: "a", text: "10 Sekunden", emoji: "⏱️" },
          { id: "b", text: "2 Minuten", emoji: "⏳" },
          { id: "c", text: "1 Stunde", emoji: "🕐" },
        ],
        correct: "b",
        explanation: "Richtig! Zwei Minuten – ungefähr so lange wie ein kurzes Lied.",
      },
      {
        id: "zp-3",
        type: "timer",
        title: "2-Minuten-Putz-Timer",
        intro: "Zahnbürste bereit? Benno putzt mit dir – Ecke für Ecke.",
        segments: [
          { id: "zp-3-a", label: "Oben links", seconds: 30 },
          { id: "zp-3-b", label: "Oben rechts", seconds: 30 },
          { id: "zp-3-c", label: "Unten links", seconds: 30 },
          { id: "zp-3-d", label: "Unten rechts", seconds: 30 },
        ],
      },
      {
        id: "zp-4",
        type: "quiz",
        title: "Quiz: Wann putzen?",
        question: "Wann putzt du deine Zähne?",
        options: [
          { id: "a", text: "Morgens und abends", emoji: "☀️" },
          { id: "b", text: "Nur am Geburtstag", emoji: "🎂" },
          { id: "c", text: "Nie", emoji: "🙈" },
        ],
        correct: "a",
        explanation: "Super! Morgens und abends – dann sind deine Zähne rundum gut geschützt.",
      },
      { id: "zp-5", type: "aufgabe", title: "Putz-Mission", text: "Putze heute morgens und abends deine Zähne. Tippe nach jedem Putzen auf einen Zahn!", count: 2, unit: "🦷" },
    ],
  },
  {
    id: "wasser-trinken",
    title: "Wasser-Detektive",
    subtitle: "Warum dein Körper Wasser liebt – mit Eddy dem Elefanten",
    category: "ernaehrung",
    age: "ab 4 Jahren",
    guide: "eddy",
    greeting: "Törööö! Ich bin Eddy. Elefanten lieben Wasser – und dein Körper auch. Komm, wir finden heraus, warum!",
    theme: "strand",
    accent: "#3F7FA8",
    ambient: "meer",
    reward: { emoji: "💧", name: "Wasser-Detektiv" },
    status: "veroeffentlicht",
    createdAt: now,
    updatedAt: now,
    steps: [
      {
        id: "wt-1",
        type: "info",
        title: "Dein Körper braucht Wasser",
        text: "Dein Körper besteht zu mehr als der Hälfte aus Wasser. Wenn du genug trinkst, kannst du besser denken, spielen und toben.",
      },
      {
        id: "wt-2",
        type: "quiz",
        title: "Quiz: Durstlöscher",
        question: "Was ist der beste Durstlöscher?",
        options: [
          { id: "a", text: "Wasser", emoji: "💧" },
          { id: "b", text: "Limonade", emoji: "🥤" },
          { id: "c", text: "Ketchup", emoji: "🍅" },
        ],
        correct: "a",
        explanation: "Genau! Wasser oder ungesüßter Tee löschen den Durst am besten – ganz ohne Zucker.",
      },
      { id: "wt-3", type: "uebung", title: "Der Elefant", pose: "elefant", seconds: 30, cue: "Saug mit deinem Rüssel Wasser auf – und pruste es in hohem Bogen heraus!" },
      { id: "wt-4", type: "aufgabe", title: "Trink-Mission", text: "Trink heute 6 Gläser Wasser oder ungesüßten Tee. Tippe nach jedem Glas auf einen Tropfen.", count: 6, unit: "💧" },
    ],
  },
  {
    id: "weltraum-ruhe",
    title: "Weltraum-Traumreise",
    subtitle: "Leise durch die Sterne schweben – zum Einschlafen",
    category: "schlaf",
    age: "ab 4 Jahren",
    guide: "emmi",
    greeting: "Psst … ich bin Emmi. Leg dich gemütlich hin – heute schweben wir ganz leise zu den Sternen.",
    theme: "weltraum",
    accent: "#A99BF0",
    ambient: "weltraum",
    reward: { emoji: "⭐", name: "Sternen-Träumer" },
    status: "veroeffentlicht",
    createdAt: now,
    updatedAt: now,
    steps: [
      {
        id: "wr-1",
        type: "info",
        title: "Bereit für die Sterne?",
        text: "Mach es dir im Bett oder auf deiner Matte gemütlich. Heute fliegen wir ganz leise durch den Weltraum – vorbei an funkelnden Sternen.",
      },
      { id: "wr-2", type: "atmung", title: "Kuscheltier-Atmung", breath: "kuscheltier-atmung" },
      { id: "wr-3", type: "uebung", title: "Schweben wie ein Seestern", pose: "seestern", seconds: 45, cue: "Breite Arme und Beine aus und schwebe ganz leicht durch den Weltraum." },
      {
        id: "wr-4",
        type: "quiz",
        title: "Quiz: Schlaf",
        question: "Wie lange schlafen Kinder in deinem Alter ungefähr in der Nacht?",
        options: [
          { id: "a", text: "2 Stunden", emoji: "⚡" },
          { id: "b", text: "Etwa 10 Stunden", emoji: "🌙" },
          { id: "c", text: "24 Stunden", emoji: "🛌" },
        ],
        correct: "b",
        explanation: "Richtig! Kinder brauchen ungefähr 10 bis 12 Stunden Schlaf – dabei erholen sich Körper und Kopf.",
      },
      {
        id: "wr-5",
        type: "timer",
        title: "Ganz still werden",
        intro: "Schließ die Augen. Emmi zählt mit dir die Sterne.",
        segments: [
          { id: "wr-5-a", label: "Augen zu – ein Stern leuchtet", seconds: 15 },
          { id: "wr-5-b", label: "Atme ganz langsam", seconds: 20 },
          { id: "wr-5-c", label: "Spür deine warme Decke", seconds: 20 },
        ],
      },
    ],
  },
  {
    id: "gesunde-brotdose",
    title: "Die bunte Brotdose",
    subtitle: "Was gehört in eine gesunde Pause? (Entwurf)",
    category: "ernaehrung",
    age: "ab 4 Jahren",
    guide: "kimi",
    greeting: "Hallo, ich bin Kimi! Was packen wir heute in deine Brotdose?",
    theme: "wiese",
    accent: "#E9879E",
    ambient: "spieluhr",
    reward: { emoji: "🍎", name: "Brotdosen-Profi" },
    status: "entwurf",
    createdAt: now,
    updatedAt: now,
    steps: [
      { id: "gb-1", type: "info", title: "Bunt ist gesund", text: "Je bunter deine Brotdose, desto mehr Kraft steckt drin: Obst, Gemüse, Vollkornbrot und Wasser." },
      { id: "gb-2", type: "video", title: "Video: Brotdose packen", source: null, instruction: "Hier kommt euer Erklärvideo hin.", stops: [] },
    ],
  },
];

/** Vorlagen für „Neue Lernwelt“ im Studio */
export const worldTemplates: { id: string; label: string; description: string; world: Partial<World> }[] = [
  {
    id: "leer",
    label: "Leere Lernwelt",
    description: "Von Grund auf selbst gestalten",
    world: { title: "Neue Lernwelt", steps: [] },
  },
  {
    id: "bewegung",
    label: "Bewegungspause",
    description: "Video, Übung, Mitmach-Timer & Quiz",
    world: {
      title: "Neue Bewegungspause",
      subtitle: "Kurz toben, strecken und durchatmen",
      category: "bewegung",
      theme: "dschungel",
      accent: "#6E9A63",
      ambient: "wald",
      guide: "luka",
      reward: { emoji: "🏃", name: "Bewegungs-Profi" },
      steps: [
        { id: "t1", type: "info", title: "Los geht's!", text: "Bewegung macht wach und fröhlich. Mach mit!" },
        { id: "t2", type: "video", title: "Mitmach-Video", source: null, instruction: "Schau zu und mach mit!", stops: [] },
        { id: "t3", type: "uebung", title: "Der Stern", pose: "stern", seconds: 30, cue: "" },
        { id: "t4", type: "timer", title: "Tier-Parade", intro: "Jedes Tier 20 Sekunden!", segments: [{ id: "t4a", label: "Hüpfen wie ein Frosch", seconds: 20 }, { id: "t4b", label: "Stapfen wie ein Bär", seconds: 20 }] },
      ],
    },
  },
  {
    id: "gewohnheit",
    label: "Gesunde Gewohnheit",
    description: "Erklären, Quiz, Timer & Alltags-Mission",
    world: {
      title: "Neue Gewohnheit",
      subtitle: "Kleine Rituale für jeden Tag",
      category: "gewohnheiten",
      theme: "unterwasser",
      accent: "#3F7FA8",
      ambient: "meer",
      guide: "benno",
      reward: { emoji: "🌟", name: "Ritual-Held" },
      steps: [
        { id: "t1", type: "info", title: "Warum ist das wichtig?", text: "" },
        {
          id: "t2",
          type: "quiz",
          title: "Quiz-Frage",
          question: "",
          options: [
            { id: "a", text: "", emoji: "🙂" },
            { id: "b", text: "", emoji: "🤔" },
          ],
          correct: "a",
          explanation: "",
        },
        { id: "t3", type: "aufgabe", title: "Mission für heute", text: "", count: 3, unit: "⭐" },
      ],
    },
  },
  {
    id: "ruhe",
    label: "Entspannung & Schlaf",
    description: "Atemübung, Ruhe-Übung & Still-Timer",
    world: {
      title: "Neue Ruhe-Reise",
      subtitle: "Zur Ruhe kommen vor dem Schlafen",
      category: "schlaf",
      theme: "weltraum",
      accent: "#A99BF0",
      ambient: "weltraum",
      guide: "emmi",
      reward: { emoji: "🌙", name: "Mond-Träumer" },
      steps: [
        { id: "t1", type: "atmung", title: "Kuscheltier-Atmung", breath: "kuscheltier-atmung" },
        { id: "t2", type: "uebung", title: "Der müde Seestern", pose: "seestern", seconds: 45, cue: "" },
        { id: "t3", type: "timer", title: "Ganz still werden", intro: "Augen zu und ganz ruhig atmen.", segments: [{ id: "t3a", label: "Augen zu", seconds: 20 }, { id: "t3b", label: "Ganz langsam atmen", seconds: 20 }] },
      ],
    },
  },
];

export function newId(prefix = "id"): string {
  const rnd = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID().slice(0, 8) : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${rnd}`;
}
