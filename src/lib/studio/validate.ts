import type { World } from "./types";

/** Hinweise vor dem Veröffentlichen (Editor und Emmi nutzen dieselbe Prüfung) */
export function validateWorld(w: World): string[] {
  const issues: string[] = [];
  if (!w.title.trim()) issues.push("Titel fehlt");
  if (w.steps.length === 0) issues.push("Mindestens eine Station hinzufügen");
  w.steps.forEach((s, i) => {
    const n = `Station ${i + 1}`;
    if (s.type === "video" && !s.source) issues.push(`${n}: Kein Video ausgewählt`);
    if (s.type === "info" && !s.text.trim()) issues.push(`${n}: Text fehlt`);
    if (s.type === "quiz") {
      if (!s.question.trim()) issues.push(`${n}: Quiz-Frage fehlt`);
      if (s.options.some((o) => !o.text.trim())) issues.push(`${n}: Nicht alle Antworten ausgefüllt`);
      if (!s.options.some((o) => o.id === s.correct)) issues.push(`${n}: Richtige Antwort markieren`);
    }
    if (s.type === "aufgabe" && !s.text.trim()) issues.push(`${n}: Missions-Text fehlt`);
  });
  return issues;
}
