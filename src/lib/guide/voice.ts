import { speak, stopSpeaking } from "@/lib/speech";

import { getGuide, setSpeaking } from "./store";

/** Emmis Stimme: etwas höher und ruhiger als die Vorlesestimme – sanft und freundlich für Kinder. */
const EMMI_VOICES = [/seraphina/i, /amala/i, /katja/i, /google deutsch/i, /anna|petra|marlene|vicki|hedda/i];

let poll = 0;

export function say(text: string) {
  if (getGuide().muted) return;
  // Emojis nicht vorlesen
  const clean = text.replace(/\p{Extended_Pictographic}|️/gu, "").trim();
  if (!clean) return;
  window.clearInterval(poll);
  const started = speak(clean, { force: true, pitch: 1.25, rate: 0.95, prefer: EMMI_VOICES, onEnd: () => setSpeaking(false) });
  setSpeaking(started);
  if (!started) return;
  // Manche Browser melden das Ende nicht zuverlässig – dann selbst nachsehen.
  const since = Date.now();
  poll = window.setInterval(() => {
    if (Date.now() - since < 900 || window.speechSynthesis.speaking) return;
    window.clearInterval(poll);
    setSpeaking(false);
  }, 400);
}

export function hush() {
  window.clearInterval(poll);
  stopSpeaking();
  setSpeaking(false);
}
