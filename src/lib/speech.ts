import { getAppState } from "./store";

/**
 * Vorlesestimme über die Web Speech API (de-DE).
 * Bevorzugt natürliche Stimmen (z. B. „Microsoft Katja Online (Natural)“
 * in Edge oder „Google Deutsch“ in Chrome), fällt sonst auf die
 * Standardstimme des Geräts zurück.
 */

export function speechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

function pickVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices().filter((v) => v.lang?.toLowerCase().startsWith("de"));
  if (!voices.length) return null;
  const score = (v: SpeechSynthesisVoice) =>
    (/natural|neural|online/i.test(v.name) ? 6 : 0) +
    (/google/i.test(v.name) ? 3 : 0) +
    (/katja|amala|seraphina|vicki|anna|petra|marlene|hedda|helena/i.test(v.name) ? 2 : 0) +
    (v.lang === "de-DE" ? 1 : 0);
  return [...voices].sort((a, b) => score(b) - score(a))[0] ?? null;
}

if (speechSupported()) {
  // Stimmen werden in Chrome asynchron geladen – einmal anstoßen.
  window.speechSynthesis.getVoices();
}

type SpeakOptions = {
  /** auch vorlesen, wenn die Vorlesestimme in den Einstellungen aus ist */
  force?: boolean;
  rate?: number;
  /** interrupted = true, wenn die Ausgabe abgebrochen wurde */
  onEnd?: (interrupted: boolean) => void;
};

export function speak(text: string, { force = false, rate = 0.92, onEnd }: SpeakOptions = {}): boolean {
  if (!speechSupported()) return false;
  if (!force && !getAppState().settings.voice) return false;
  const synth = window.speechSynthesis;
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "de-DE";
  const voice = pickVoice();
  if (voice) utterance.voice = voice;
  utterance.rate = rate;
  utterance.pitch = 1.05;
  if (onEnd) {
    let done = false;
    utterance.onend = () => {
      if (done) return;
      done = true;
      onEnd(false);
    };
    utterance.onerror = (e) => {
      if (done) return;
      done = true;
      onEnd(e.error === "interrupted" || e.error === "canceled");
    };
  }
  synth.speak(utterance);
  return true;
}

export function stopSpeaking() {
  if (speechSupported()) window.speechSynthesis.cancel();
}
