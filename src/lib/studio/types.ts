import type { AnimalId } from "@/content/types";

/**
 * Datenmodell des YOGITIER® Studios: Admins bauen „Lernwelten“ –
 * gestaltete Umgebungen mit einem Lernpfad aus interaktiven Schritten.
 */

export type WorldTheme = "dschungel" | "unterwasser" | "weltraum" | "zauberwald" | "wiese" | "winter" | "regenbogen" | "strand";

export type Ambient = "aus" | "wald" | "meer" | "regen" | "weltraum" | "spieluhr";

export type WorldCategory = "yoga" | "bewegung" | "atmung" | "achtsamkeit" | "gewohnheiten" | "ernaehrung" | "schlaf";

export type VideoSource = { kind: "upload"; mediaId: string } | { kind: "url"; url: string; poster?: string };

/** Interaktiver Stopp im Video: das Video pausiert, das Kind macht mit. */
export type VideoStop = { id: string; at: number; prompt: string; seconds: number };

type Base = { id: string; title: string };

export type InfoStep = Base & { type: "info"; text: string; imageMediaId?: string };
export type VideoStep = Base & { type: "video"; source: VideoSource | null; instruction: string; stops: VideoStop[] };
export type ExerciseStep = Base & { type: "uebung"; pose: string; seconds: number; cue: string };
export type BreathStep = Base & { type: "atmung"; breath: string };
export type TimerStep = Base & { type: "timer"; intro: string; segments: { id: string; label: string; seconds: number }[] };
export type QuizStep = Base & {
  type: "quiz";
  question: string;
  options: { id: string; text: string; emoji: string }[];
  correct: string;
  explanation: string;
};
export type MissionStep = Base & { type: "aufgabe"; text: string; count: number; unit: string };

export type Step = InfoStep | VideoStep | ExerciseStep | BreathStep | TimerStep | QuizStep | MissionStep;
export type StepType = Step["type"];

export type World = {
  id: string;
  title: string;
  subtitle: string;
  category: WorldCategory;
  age: string;
  guide: AnimalId;
  greeting: string;
  theme: WorldTheme;
  accent: string;
  ambient: Ambient;
  reward: { emoji: string; name: string };
  steps: Step[];
  status: "entwurf" | "veroeffentlicht";
  createdAt: string;
  updatedAt: string;
};

export type MediaMeta = {
  id: string;
  name: string;
  type: string;
  size: number;
  duration: number;
  width: number;
  height: number;
  thumb: string | null;
  createdAt: string;
};

export type StudioSettings = {
  /** Text der Plakette auf der Kachel „Besonderes“ im Menü */
  specialBadge: string;
  /** hervorgehobene Lernwelt (oben auf „Besonderes“) */
  featuredWorldId: string | null;
  adminPin: string;
};
