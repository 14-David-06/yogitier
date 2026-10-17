import type { Lesson } from "./types";

/** Pause zwischen zwei Übungen im Player (Sekunden) */
export const TRANSITION_SECONDS = 5;

export const lessons: Lesson[] = [
  {
    slug: "guten-morgen",
    title: "Guten-Morgen-Yoga",
    subtitle: "Wach werden wie die Tiere",
    host: "leo",
    color: "#FBEBC4",
    tag: "Morgens",
    age: "ab 3 Jahren",
    level: "leicht",
    intro:
      "Die Sonne geht auf und die YOGITIER-Bande wacht auf. Leo zeigt dir, wie du fröhlich und voller Kraft in den Tag startest.",
    steps: [
      { pose: "berg", seconds: 20, cue: "Wir stehen auf wie ein großer Berg und schauen zur Sonne." },
      { pose: "katze", seconds: 30, cue: "Kimi die Katze streckt sich nach dem Schlafen – mach mit! Rund und lang, rund und lang." },
      { pose: "leopard", seconds: 30, cue: "Jetzt streckst du dich lang wie Luka der Leopard." },
      { pose: "loewe", seconds: 25, cue: "Leo wacht auf und brüllt ganz laut: Guten Morgen!" },
      { pose: "stern", seconds: 25, cue: "Mach dich groß wie ein Stern und leuchte in den Tag." },
      { pose: "baum", seconds: 30, cue: "Zum Schluss stehst du wie ein Baum im Morgenwind." },
      { pose: "berg", seconds: 20, cue: "Spür nach: Wie fühlst du dich jetzt?" },
    ],
    outro: "Was für ein starker Start in den Tag! Leo sagt: Ich bin mutig.",
  },
  {
    slug: "dschungel-reise",
    title: "Tierreise durch den Dschungel",
    subtitle: "Ein Abenteuer mit Luka",
    host: "luka",
    color: "#DDEAEA",
    tag: "Abenteuer",
    age: "ab 4 Jahren",
    level: "leicht",
    intro:
      "Pack deinen Rucksack! Heute reist du mit Luka dem Leoparden durch den Dschungel und triffst unterwegs ganz viele Tiere.",
    steps: [
      { pose: "berg", seconds: 20, cue: "Wir stehen am Rand des Dschungels. Bist du bereit für das Abenteuer?" },
      { pose: "elefant", seconds: 30, cue: "Ein Elefant kommt vorbei und schwingt seinen Rüssel. Töröö!" },
      { pose: "baer", seconds: 30, cue: "Wir stapfen wie Benno der Bär durch das dichte Grün." },
      { pose: "schlange", seconds: 25, cue: "Vorsicht, im Gras liegt eine Schlange. Ssssss!" },
      { pose: "frosch", seconds: 25, cue: "Am Fluss hüpfen die Frösche von Stein zu Stein. Quak!" },
      { pose: "flamingo", seconds: 30, cue: "Im Wasser steht ein rosa Flamingo auf einem Bein." },
      { pose: "leopard", seconds: 30, cue: "Oben im Baum streckt sich Luka der Leopard." },
      { pose: "schmetterling", seconds: 30, cue: "Bunte Schmetterlinge flattern um dich herum." },
      { pose: "fuchs", seconds: 40, cue: "Puh, was für eine Reise! Ruh dich aus wie ein Fuchs in seinem Bau." },
    ],
    outro: "Du hast den ganzen Dschungel durchquert! Luka sagt: Meine Gefühle sind wichtig.",
  },
  {
    slug: "mutmacher",
    title: "Mutmacher-Yoga",
    subtitle: "Stark und sicher mit Diego",
    host: "diego",
    color: "#F6F0D2",
    tag: "Mut & Kraft",
    age: "ab 4 Jahren",
    level: "mittel",
    intro:
      "Manchmal braucht man ein bisschen extra Mut – vor einem neuen Tag in der Kita, einer Prüfung oder einem Arztbesuch. Diego zeigt dir Übungen, mit denen du dich stark und sicher fühlst.",
    steps: [
      { pose: "berg", seconds: 20, cue: "Stell dich fest hin. Deine Füße sind wie starke Wurzeln." },
      { pose: "dino", seconds: 30, cue: "Stark wie Diego! Sag laut: Ich bin stark." },
      { pose: "stern", seconds: 25, cue: "Mach dich ganz groß – du darfst Platz einnehmen." },
      { pose: "loewe", seconds: 25, cue: "Brüll allen Mut aus deinem Bauch heraus!" },
      { pose: "boot", seconds: 25, cue: "Halte dein Boot ganz ruhig, auch wenn es ein bisschen wackelt." },
      { pose: "einhorn", seconds: 30, cue: "Leg die Hände zusammen und wünsch dir etwas Mutiges." },
      { pose: "seestern", seconds: 40, cue: "Lieg jetzt ganz still. Du hast so toll durchgehalten!" },
    ],
    outro: "Du bist stärker, als du denkst! Diego sagt: Ich bin stark.",
  },
  {
    slug: "gute-nacht",
    title: "Gute-Nacht-Yoga",
    subtitle: "Zur Ruhe kommen mit Benno",
    host: "benno",
    color: "#E3EAF2",
    tag: "Abends",
    age: "ab 2 Jahren",
    level: "leicht",
    intro:
      "Der Tag war aufregend. Jetzt wird es Zeit, langsam zur Ruhe zu kommen. Benno der Bär zeigt dir, wie du dich bettfertig kuschelst.",
    steps: [
      { pose: "schmetterling", seconds: 30, cue: "Lass deine Schmetterlingsflügel ganz langsam flattern." },
      { pose: "katze", seconds: 30, cue: "Mach einen weichen, runden Katzenbuckel – ganz langsam." },
      { pose: "bruecke", seconds: 25, cue: "Bau eine kleine Brücke und lass sie langsam wieder sinken." },
      { pose: "fuchs", seconds: 40, cue: "Kuschel dich ein wie ein Fuchs in seinem warmen Bau." },
      { pose: "seestern", seconds: 60, cue: "Du bist ein müder Seestern. Alles an dir wird schwer und warm." },
    ],
    outro: "Jetzt bist du bereit für süße Träume. Benno sagt: Ich bin einzigartig. Gute Nacht!",
  },
  {
    slug: "balance",
    title: "Balance & Konzentration",
    subtitle: "Ganz still werden mit Emmi",
    host: "emmi",
    color: "#E7E2F8",
    tag: "Konzentration",
    age: "ab 5 Jahren",
    level: "mittel",
    intro:
      "Emmi liebt es, ganz still zu werden und auf einem Bein zu balancieren. Schaffst du es, so ruhig zu stehen wie sie? Wackeln ist übrigens erlaubt!",
    steps: [
      { pose: "berg", seconds: 20, cue: "Stell dich hin und spür, wie fest du auf dem Boden stehst." },
      { pose: "flamingo", seconds: 30, cue: "Balancier wie ein Flamingo. Such dir einen Punkt zum Anschauen." },
      { pose: "baum", seconds: 30, cue: "Jetzt bist du ein Baum. Deine Äste wiegen sich im Wind." },
      { pose: "einhorn", seconds: 30, cue: "Streck dein Zauberhorn hoch in den Himmel." },
      { pose: "boot", seconds: 25, cue: "Dein Boot schaukelt ganz ruhig auf dem See." },
      { pose: "stern", seconds: 20, cue: "Mach dich groß wie ein Stern – du bist ganz wach und klar." },
      { pose: "fuchs", seconds: 35, cue: "Ruh dich aus. Dein Kopf ist jetzt ganz ruhig." },
    ],
    outro: "So viel Ruhe und Konzentration! Emmi sagt: Ich bin kreativ.",
  },
  {
    slug: "wut-weg",
    title: "Wut-weg-Yoga",
    subtitle: "Große Gefühle rauslassen mit Eddy",
    host: "eddy",
    color: "#E3EEEE",
    tag: "Große Gefühle",
    age: "ab 3 Jahren",
    level: "leicht",
    intro:
      "Wut ist ein ganz normales Gefühl – und sie darf raus! Mit Eddy stampfst, brüllst und schwingst du, bis du dich wieder leicht und ruhig fühlst.",
    steps: [
      { pose: "dino", seconds: 25, cue: "Stampf fest auf wie ein Dino – zeig, wie viel Kraft in dir steckt!" },
      { pose: "loewe", seconds: 25, cue: "Brüll die Wut heraus wie ein Löwe. Roaaar!" },
      { pose: "elefant", seconds: 30, cue: "Schwing deinen Rüssel hin und her und lass alles los." },
      { pose: "katze", seconds: 30, cue: "Mach einen runden Rücken und atme ganz tief." },
      { pose: "fuchs", seconds: 35, cue: "Kuschel dich in deinen Bau. Hier bist du sicher." },
      { pose: "seestern", seconds: 40, cue: "Spür nach: Die Wut ist kleiner geworden." },
    ],
    outro: "Toll, wie du mit deiner Wut umgegangen bist! Eddy sagt: Ich bin genau so, wie ich bin.",
  },
  {
    slug: "mini-pause",
    title: "Mini-Pause",
    subtitle: "Drei Minuten für zwischendurch",
    host: "kimi",
    color: "#FDE9E9",
    tag: "Zwischendurch",
    age: "ab 3 Jahren",
    level: "leicht",
    intro:
      "Nur ein paar Minuten Zeit? Perfekt für eine kleine Yoga-Pause zwischen Hausaufgaben, Spielen und Abendessen.",
    steps: [
      { pose: "berg", seconds: 20, cue: "Mach eine kurze Pause. Stell dich hin wie ein Berg." },
      { pose: "stern", seconds: 25, cue: "Streck dich groß wie ein Stern." },
      { pose: "katze", seconds: 30, cue: "Ein bisschen Katzenbuckel tut immer gut." },
      { pose: "fuchs", seconds: 30, cue: "Und jetzt kurz einkuscheln und durchatmen." },
    ],
    outro: "Pause geschafft – jetzt bist du wieder frisch! Kimi sagt: Ich bin geliebt.",
  },
  {
    slug: "weihnachts-yoga",
    title: "Weihnachts-Yoga",
    subtitle: "Im Winterwunderland mit Kimi",
    host: "kimi",
    color: "#FBE3E6",
    tag: "Weihnachten",
    age: "ab 3 Jahren",
    level: "leicht",
    winter: true,
    intro:
      "Draußen fallen Schneeflocken und drinnen duftet es nach Plätzchen. Kimi lädt dich zu einer gemütlichen Yoga-Stunde im Winterwunderland ein.",
    steps: [
      { pose: "schneemann", seconds: 30, cue: "Bau dir einen dicken Schneemann – und lass ihn dann ganz langsam schmelzen." },
      { pose: "tannenbaum", seconds: 25, cue: "Steh so still wie ein Tannenbaum im Wohnzimmer." },
      { pose: "stern", seconds: 25, cue: "Du bist der leuchtende Stern auf der Spitze!" },
      { pose: "rentier", seconds: 30, cue: "Die Rentiere galoppieren los – sie ziehen den Schlitten." },
      { pose: "paeckchen", seconds: 35, cue: "Mach dich klein wie ein Geschenk unter dem Baum." },
      { pose: "schneeengel", seconds: 40, cue: "Leg dich in den Schnee und mach einen Schneeengel." },
    ],
    outro: "Frohe Weihnachten! Kimi sagt: Ich bin froh, dass wir uns haben.",
  },
];

export function getLesson(slug: string): Lesson | undefined {
  return lessons.find((l) => l.slug === slug);
}

export function lessonSeconds(lesson: Lesson): number {
  return lesson.steps.reduce((sum, s) => sum + s.seconds, 0) + lesson.steps.length * TRANSITION_SECONDS + 5;
}

export function lessonMinutes(lesson: Lesson): number {
  return Math.max(1, Math.round(lessonSeconds(lesson) / 60));
}

export function lessonsWithPose(slug: string): Lesson[] {
  return lessons.filter((l) => l.steps.some((s) => s.pose === slug));
}
