import { guideFallback, guideSuggestions, guideTopics, tourForPath, type GuideAction, type GuideContext } from "@/content/guide";

/**
 * Emmis eingebautes Wissen: ordnet eine Frage dem passenden Thema zu
 * (Stichwörter, Wortstämme und feste Wendungen) und baut die Antwort mit dem
 * aktuellen Zustand der App (Name, Sterne, Uhrzeit, Hinweise im Editor).
 *
 * Hier könnte später eine echte KI angebunden werden – die Antwortform bleibt gleich.
 */

export type GuideReply = { text: string; actions: GuideAction[]; suggestions: string[]; topic: string | null };

const UMLAUTS: Record<string, string> = { ä: "ae", ö: "oe", ü: "ue", ß: "ss" };

export function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/[äöüß]/g, (c) => UMLAUTS[c])
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function score(text: string, tokens: string[], keyword: string) {
  const k = normalize(keyword);
  if (k.includes(" ")) return ` ${text} `.includes(` ${k} `) ? 3 : 0;
  let best = 0;
  for (const t of tokens) {
    if (t === k) return 2;
    if (k.length >= 4 && t.startsWith(k)) best = Math.max(best, 1.5);
    else if (t.length >= 5 && k.startsWith(t)) best = Math.max(best, 1);
  }
  return best;
}

export function answer(question: string, ctx: GuideContext): GuideReply {
  const text = normalize(question);
  const tokens = text.split(" ").filter(Boolean);
  let best: { topic: (typeof guideTopics)[number]; score: number } | null = null;
  for (const topic of guideTopics) {
    if (topic.area !== "beide" && topic.area !== ctx.area) continue;
    const s = topic.keywords.reduce((sum, k) => sum + score(text, tokens, k), 0) * (topic.weight ?? 1);
    if (s >= 1 && (!best || s > best.score)) best = { topic, score: s };
  }
  if (!best) return { text: guideFallback(ctx.area), actions: [], suggestions: guideSuggestions[ctx.area], topic: null };

  const { topic } = best;
  const reply = typeof topic.answer === "function" ? topic.answer(ctx) : topic.answer;
  const actions =
    topic.id === "tour"
      ? [{ label: ctx.area === "studio" ? "Tour starten" : "Los geht's!", tour: tourForPath(ctx.area, ctx.path) }]
      : typeof topic.actions === "function"
        ? topic.actions(ctx)
        : (topic.actions ?? []);
  return { text: reply, actions, suggestions: [], topic: topic.id };
}
