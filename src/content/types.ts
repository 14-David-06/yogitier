import type { StaticImageData } from "next/image";

export type AnimalId = "leo" | "benno" | "emmi" | "kimi" | "luka" | "diego" | "eddy" | "freddi";

export type PoseCategory = "stehen" | "balance" | "boden" | "entspannen";

export type FigureKey =
  | "berg"
  | "stern"
  | "baum"
  | "loewe"
  | "baer"
  | "elefant"
  | "einhorn"
  | "leopard"
  | "dino"
  | "fuchs"
  | "schlange"
  | "bruecke"
  | "boot"
  | "seestern"
  | "tannenbaum"
  | "schneemann"
  | "rentier"
  | "schneeengel"
  | "paeckchen";

export type PoseArt = { kind: "image"; src: StaticImageData } | { kind: "figure"; figure: FigureKey };

export type Pose = {
  slug: string;
  name: string;
  short: string;
  category: PoseCategory;
  level: "leicht" | "mittel";
  winter?: boolean;
  art: PoseArt;
  color: string;
  steps: string[];
  benefit: string;
  parentTip: string;
  sound?: string;
  host?: AnimalId;
};

export type Animal = {
  id: AnimalId;
  name: string;
  fullName: string;
  species: string;
  image: StaticImageData;
  /** Farbe der Memo-Karte aus dem YOGITIER® Affirmation-Memory */
  color: string;
  /** helle Flächenfarbe */
  soft: string;
  /** Textfarbe auf `color` */
  ink: string;
  affirmation: string;
  trait: string;
  intro: string;
  superpower: string;
  funFact: string;
  favoritePose: string;
  favoriteBreath: string;
  mat?: { title: string; url: string; price: string };
};

export type LessonStep = { pose: string; seconds: number; cue: string };

export type Lesson = {
  slug: string;
  title: string;
  subtitle: string;
  host: AnimalId;
  color: string;
  tag: string;
  age: string;
  level: "leicht" | "mittel";
  intro: string;
  steps: LessonStep[];
  outro: string;
  winter?: boolean;
};

export type BreathVisual = "ballon" | "loewe" | "blume" | "biene" | "kuscheltier" | "regenbogen" | "elefant" | "hand";

export type Breath = {
  slug: string;
  title: string;
  host: AnimalId;
  color: string;
  purpose: string;
  description: string;
  howTo: string[];
  pattern: { inhale: number; hold: number; exhale: number; rest: number };
  cycles: number;
  cues: { inhale: string; hold?: string; exhale: string };
  visual: BreathVisual;
};

export type JourneyTheme = "wolken" | "wald" | "meer" | "sonne" | "schnee";

export type Journey = {
  slug: string;
  title: string;
  host: AnimalId;
  theme: JourneyTheme;
  purpose: string;
  description: string;
  paragraphs: string[];
  winter?: boolean;
};

export type MoodId = "froehlich" | "ruhig" | "muede" | "traurig" | "wuetend" | "aengstlich";
