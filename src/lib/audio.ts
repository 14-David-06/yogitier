import { getAppState } from "./store";

/**
 * Kleine Klangwelt per Web Audio API – ganz ohne Audiodateien.
 * Alle Klänge sind sanft und leise, passend für Kinder & Entspannung.
 */

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!getAppState().settings.sound) return null;
  try {
    if (!ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(
  ac: AudioContext,
  freq: number,
  { start = 0, duration = 0.6, gain = 0.12, type = "sine" as OscillatorType, attack = 0.01 } = {},
) {
  const t0 = ac.currentTime + start;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(g).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

/** Klangschale – für Start und Ende von Meditationen */
export function playBowl() {
  const ac = audio();
  if (!ac) return;
  const base = 196;
  tone(ac, base, { duration: 5.5, gain: 0.16, attack: 0.02 });
  tone(ac, base * 2.76, { duration: 4.2, gain: 0.05, attack: 0.02 });
  tone(ac, base * 5.4, { duration: 2.6, gain: 0.025, attack: 0.02 });
  tone(ac, base * 1.003, { duration: 5.5, gain: 0.08, attack: 0.03 });
}

/** heller Glockenton – Übergänge */
export function playChime() {
  const ac = audio();
  if (!ac) return;
  tone(ac, 880, { duration: 1.2, gain: 0.08 });
  tone(ac, 1318.5, { start: 0.12, duration: 1.4, gain: 0.06 });
}

/** kleine Erfolgsmelodie */
export function playSuccess() {
  const ac = audio();
  if (!ac) return;
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(ac, f, { start: i * 0.11, duration: 0.7, gain: 0.08, type: "triangle" }));
}

/** großer Applaus-Akkord am Ende */
export function playFanfare() {
  const ac = audio();
  if (!ac) return;
  [523.25, 659.25, 783.99].forEach((f) => tone(ac, f, { duration: 1.6, gain: 0.05, type: "triangle" }));
  [659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => tone(ac, f, { start: 0.15 + i * 0.1, duration: 1.2, gain: 0.05, type: "triangle" }));
}

/** sanftes Ticken für die letzten Sekunden */
export function playTick() {
  const ac = audio();
  if (!ac) return;
  tone(ac, 1200, { duration: 0.09, gain: 0.04, type: "sine" });
}

/** Karte umdrehen / Tippen */
export function playPop() {
  const ac = audio();
  if (!ac) return;
  const t0 = ac.currentTime;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(420, t0);
  osc.frequency.exponentialRampToValueAtTime(820, t0 + 0.08);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(0.07, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.16);
  osc.connect(g).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + 0.2);
}

/** kurzer „Nein“-Ton (z. B. falsches Memo-Paar) */
export function playSoftNo() {
  const ac = audio();
  if (!ac) return;
  tone(ac, 330, { duration: 0.22, gain: 0.05, type: "triangle" });
  tone(ac, 262, { start: 0.12, duration: 0.3, gain: 0.05, type: "triangle" });
}

/** Würfel rollt */
export function playRoll() {
  const ac = audio();
  if (!ac) return;
  for (let i = 0; i < 9; i++) {
    tone(ac, 500 + ((i * 137) % 400), { start: i * 0.13, duration: 0.07, gain: 0.03, type: "square" });
  }
}
