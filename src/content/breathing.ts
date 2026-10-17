import type { Breath } from "./types";

/** Atemübungen – jede wird von einem Tier der YOGITIER-Bande begleitet. */
export const breathing: Breath[] = [
  {
    slug: "ballon-atmung",
    title: "Ballon-Atmung",
    host: "diego",
    color: "#F6F0D2",
    purpose: "Zur Ruhe kommen",
    description:
      "Dein Bauch ist ein bunter Luftballon. Beim Einatmen bläst du ihn langsam auf, beim Ausatmen lässt du die Luft ganz sanft wieder heraus.",
    howTo: [
      "Setz oder leg dich bequem hin.",
      "Leg deine Hände auf deinen Bauch.",
      "Spür, wie dein Bauch beim Einatmen groß und beim Ausatmen wieder klein wird.",
    ],
    pattern: { inhale: 4, hold: 1, exhale: 5, rest: 1 },
    cycles: 6,
    cues: {
      inhale: "Atme durch die Nase ein – dein Ballon wird groß.",
      hold: "Halte die Luft kurz an.",
      exhale: "Atme langsam aus – der Ballon wird wieder klein.",
    },
    visual: "ballon",
  },
  {
    slug: "loewenatem",
    title: "Löwenatem",
    host: "leo",
    color: "#FBEBC4",
    purpose: "Gegen Wut",
    description:
      "Wenn die Wut ganz groß ist, hilft Leos Trick: Tief einatmen – und die Wut mit einem lauten Löwen-Brüllen hinauspusten.",
    howTo: [
      "Knie dich hin und setz dich auf deine Fersen.",
      "Leg die Hände auf die Knie und spreiz die Finger wie Krallen.",
      "Beim Ausatmen: Mund weit auf, Zunge raus – und brüllen!",
    ],
    pattern: { inhale: 3, hold: 1, exhale: 3, rest: 2 },
    cycles: 5,
    cues: {
      inhale: "Atme tief durch die Nase ein.",
      hold: "Sammle deine Kraft …",
      exhale: "Mund auf, Zunge raus – und brüllen: Roaaar!",
    },
    visual: "loewe",
  },
  {
    slug: "blume-kerze",
    title: "Blume & Kerze",
    host: "kimi",
    color: "#FDE9E9",
    purpose: "Zum Entspannen",
    description:
      "Stell dir vor, du hältst eine duftende Blume in der einen Hand und eine Kerze in der anderen. Riech an der Blume – und puste die Kerze ganz vorsichtig aus.",
    howTo: [
      "Halte eine Hand wie eine Blume vor deine Nase.",
      "Halte die andere Hand wie eine Kerze vor deinen Mund.",
      "Riech an der Blume und puste dann ganz langsam die Kerze aus.",
    ],
    pattern: { inhale: 4, hold: 1, exhale: 4, rest: 1 },
    cycles: 6,
    cues: {
      inhale: "Riech an der Blume – mmh, wie gut sie duftet!",
      hold: "Genieß den Duft.",
      exhale: "Puste die Kerze ganz langsam aus.",
    },
    visual: "blume",
  },
  {
    slug: "bienen-summen",
    title: "Bienen-Summen",
    host: "luka",
    color: "#FBF1BE",
    purpose: "Bei Angst & Unruhe",
    description:
      "Atme tief ein und summe beim Ausatmen wie eine kleine Biene. Das Summen kitzelt im Kopf und macht ganz ruhig.",
    howTo: [
      "Setz dich bequem hin und schließ die Augen.",
      "Halte dir die Ohren sanft zu, wenn du magst.",
      "Atme ein und summe beim Ausatmen: Mmmmmm …",
    ],
    pattern: { inhale: 4, hold: 0, exhale: 6, rest: 1 },
    cycles: 6,
    cues: {
      inhale: "Atme tief durch die Nase ein.",
      exhale: "Mund zu und summen: Mmmmmm …",
    },
    visual: "biene",
  },
  {
    slug: "kuscheltier-atmung",
    title: "Kuscheltier-Atmung",
    host: "benno",
    color: "#E3EAF2",
    purpose: "Zum Einschlafen",
    description:
      "Leg dich auf den Rücken und setz dein Lieblings-Kuscheltier auf deinen Bauch. Beim Atmen fährt es sanft Fahrstuhl – hoch und runter.",
    howTo: [
      "Leg dich gemütlich auf den Rücken.",
      "Setz dein Kuscheltier auf deinen Bauch.",
      "Schau zu, wie es beim Atmen langsam hoch und runter fährt.",
    ],
    pattern: { inhale: 4, hold: 0, exhale: 5, rest: 1 },
    cycles: 8,
    cues: {
      inhale: "Atme ein – dein Kuscheltier fährt nach oben.",
      exhale: "Atme aus – und es fährt wieder nach unten.",
    },
    visual: "kuscheltier",
  },
  {
    slug: "regenbogen-atmung",
    title: "Regenbogen-Atmung",
    host: "emmi",
    color: "#E7E2F8",
    purpose: "Für gute Laune",
    description:
      "Mit jedem Atemzug malst du mit deinen Armen einen Regenbogen in die Luft – eine Farbe nach der anderen.",
    howTo: [
      "Stell dich hin, die Arme hängen locker.",
      "Atme ein und heb die Arme in einem großen Bogen über den Kopf.",
      "Atme aus und lass sie auf der anderen Seite wieder sinken.",
    ],
    pattern: { inhale: 4, hold: 1, exhale: 4, rest: 0 },
    cycles: 7,
    cues: {
      inhale: "Atme ein und male einen großen Bogen nach oben.",
      hold: "Oben kurz strahlen!",
      exhale: "Atme aus und lass die Arme sinken.",
    },
    visual: "regenbogen",
  },
  {
    slug: "elefanten-atmung",
    title: "Elefanten-Atmung",
    host: "eddy",
    color: "#E3EEEE",
    purpose: "Zum Wachwerden",
    description:
      "Deine Arme sind ein langer Elefantenrüssel. Beim Einatmen saugst du Wasser auf und hebst den Rüssel, beim Ausatmen sprühst du es in hohem Bogen heraus.",
    howTo: [
      "Stell dich hin und falte die Hände vor deinem Bauch.",
      "Atme ein und heb deinen Rüssel hoch über den Kopf.",
      "Atme aus, beug dich vor und pruste: Pfffff!",
    ],
    pattern: { inhale: 3, hold: 1, exhale: 3, rest: 1 },
    cycles: 6,
    cues: {
      inhale: "Atme ein und heb deinen Rüssel hoch.",
      hold: "Halte das Wasser im Rüssel.",
      exhale: "Atme aus und pruste: Pfffff!",
    },
    visual: "elefant",
  },
  {
    slug: "finger-atmung",
    title: "Fünf-Finger-Atmung",
    host: "freddi",
    color: "#FDE3D3",
    purpose: "Für Konzentration",
    description:
      "Spreiz deine Hand wie einen Stern. Mit dem Zeigefinger der anderen Hand fährst du langsam an deinen Fingern entlang: hoch beim Einatmen, runter beim Ausatmen.",
    howTo: [
      "Spreiz eine Hand weit auseinander.",
      "Fahr mit dem Zeigefinger der anderen Hand am Daumen hoch und atme ein.",
      "Fahr auf der anderen Seite herunter und atme aus – Finger für Finger.",
    ],
    pattern: { inhale: 3, hold: 0, exhale: 3, rest: 1 },
    cycles: 5,
    cues: {
      inhale: "Fahr am Finger hoch und atme ein.",
      exhale: "Fahr am Finger runter und atme aus.",
    },
    visual: "hand",
  },
];

export function getBreath(slug: string): Breath | undefined {
  return breathing.find((b) => b.slug === slug);
}

export function breathSeconds(b: Breath): number {
  const { inhale, hold, exhale, rest } = b.pattern;
  return (inhale + hold + exhale + rest) * b.cycles;
}
