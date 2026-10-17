import type { AnimalId, MoodId } from "./types";

export type Mood = {
  id: MoodId;
  label: string;
  color: string;
  ink: string;
  question: string;
  tip: string;
  helper: AnimalId;
  suggestion: { label: string; href: string };
};

export const moods: Mood[] = [
  {
    id: "froehlich",
    label: "Fröhlich",
    color: "#FBE7A1",
    ink: "#7A4A28",
    question: "Was hat dich heute so fröhlich gemacht?",
    tip: "Wie schön! Teile deine gute Laune und leuchte wie ein Stern.",
    helper: "emmi",
    suggestion: { label: "Der Stern", href: "/yoga/uebungen/stern" },
  },
  {
    id: "ruhig",
    label: "Ruhig",
    color: "#CFE8E2",
    ink: "#3B5F5A",
    question: "Wo fühlst du dich am wohlsten?",
    tip: "Genieß die Ruhe. Magst du eine kleine Fantasiereise hören?",
    helper: "kimi",
    suggestion: { label: "Die Wolkenreise", href: "/meditation/reise/wolkenreise" },
  },
  {
    id: "muede",
    label: "Müde",
    color: "#E2DDF5",
    ink: "#4E4380",
    question: "Was hilft dir, wenn du müde bist?",
    tip: "Kuschel dich ein. Die Kuscheltier-Atmung hilft dir beim Entspannen.",
    helper: "benno",
    suggestion: { label: "Kuscheltier-Atmung", href: "/meditation/atmen/kuscheltier-atmung" },
  },
  {
    id: "traurig",
    label: "Traurig",
    color: "#D3E3F3",
    ink: "#3F5F80",
    question: "Möchtest du erzählen, was dich traurig macht?",
    tip: "Traurig sein ist okay. Benno schickt dir eine dicke Bärenumarmung – leg die Arme um dich und drück ganz fest.",
    helper: "benno",
    suggestion: { label: "Im Zauberwald", href: "/meditation/reise/zauberwald" },
  },
  {
    id: "wuetend",
    label: "Wütend",
    color: "#F8CDBE",
    ink: "#8A3A1E",
    question: "Was hat dich wütend gemacht?",
    tip: "Wut ist ein starkes Gefühl und darf raus. Brüll sie weg wie Leo!",
    helper: "leo",
    suggestion: { label: "Löwenatem", href: "/meditation/atmen/loewenatem" },
  },
  {
    id: "aengstlich",
    label: "Ängstlich",
    color: "#DCEBD0",
    ink: "#4A6B3A",
    question: "Wovor hast du gerade Angst?",
    tip: "Wenn du Angst hast, summ wie eine kleine Biene. Das macht dich ganz ruhig.",
    helper: "luka",
    suggestion: { label: "Bienen-Summen", href: "/meditation/atmen/bienen-summen" },
  },
];

export const moodsById = Object.fromEntries(moods.map((m) => [m.id, m])) as Record<MoodId, Mood>;

/** Inspiriert vom YOGITIER® Dankbarkeits-Faltspiel „Himmel & Erde“ */
export const gratitudeIdeas = [
  "Meine Familie",
  "Meine Freunde",
  "Eine Umarmung",
  "Mein Kuscheltier",
  "Draußen spielen",
  "Leckeres Essen",
  "Die Sonne",
  "Etwas Neues gelernt",
  "Jemand hat mir geholfen",
  "Mein Zuhause",
];
