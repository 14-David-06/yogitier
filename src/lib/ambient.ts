import type { Ambient } from "./studio/types";
import { getAppState } from "./store";

/**
 * Leise Hintergrundklänge für Lernwelten – komplett per Web Audio API erzeugt.
 * Es läuft immer höchstens ein Klang gleichzeitig.
 */

let ctx: AudioContext | null = null;
let current: { type: Ambient; stop: () => void } | null = null;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
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

function noiseBuffer(ac: AudioContext, brown = false): AudioBuffer {
  const len = ac.sampleRate * 3;
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const data = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    const white = Math.random() * 2 - 1;
    if (brown) {
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    } else data[i] = white;
  }
  return buf;
}

function startNoise(ac: AudioContext, out: AudioNode, { brown = false, filter = "lowpass" as BiquadFilterType, freq = 800, q = 0.7, gain = 0.1 }) {
  const src = ac.createBufferSource();
  src.buffer = noiseBuffer(ac, brown);
  src.loop = true;
  const f = ac.createBiquadFilter();
  f.type = filter;
  f.frequency.value = freq;
  f.Q.value = q;
  const g = ac.createGain();
  g.gain.value = gain;
  src.connect(f).connect(g).connect(out);
  src.start();
  return { src, gain: g, filter: f };
}

function lfo(ac: AudioContext, target: AudioParam, rate: number, depth: number) {
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.frequency.value = rate;
  g.gain.value = depth;
  osc.connect(g).connect(target);
  osc.start();
  return osc;
}

export function startAmbient(type: Ambient) {
  if (current?.type === type) return;
  stopAmbient();
  if (type === "aus" || !getAppState().settings.sound) return;
  const ac = audio();
  if (!ac) return;

  const master = ac.createGain();
  master.gain.setValueAtTime(0, ac.currentTime);
  master.gain.linearRampToValueAtTime(1, ac.currentTime + 2.5);
  master.connect(ac.destination);
  const stoppers: Array<() => void> = [];
  const timers: number[] = [];

  if (type === "meer") {
    const n = startNoise(ac, master, { brown: true, freq: 520, gain: 0.32 });
    const l = lfo(ac, n.gain.gain, 0.09, 0.18);
    stoppers.push(() => n.src.stop(), () => l.stop());
  } else if (type === "regen") {
    const n = startNoise(ac, master, { filter: "bandpass", freq: 1600, q: 0.6, gain: 0.05 });
    stoppers.push(() => n.src.stop());
  } else if (type === "wald") {
    const n = startNoise(ac, master, { brown: true, freq: 380, gain: 0.12 });
    const l = lfo(ac, n.gain.gain, 0.05, 0.06);
    stoppers.push(() => n.src.stop(), () => l.stop());
    const chirp = () => {
      const t = ac.currentTime;
      const notes = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < notes; i++) {
        const o = ac.createOscillator();
        const g = ac.createGain();
        const base = 2600 + Math.random() * 1400;
        const t0 = t + i * 0.12;
        o.frequency.setValueAtTime(base, t0);
        o.frequency.exponentialRampToValueAtTime(base * 1.35, t0 + 0.07);
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.linearRampToValueAtTime(0.025, t0 + 0.015);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.1);
        o.connect(g).connect(master);
        o.start(t0);
        o.stop(t0 + 0.12);
      }
      timers.push(window.setTimeout(chirp, 2500 + Math.random() * 4500));
    };
    timers.push(window.setTimeout(chirp, 1500));
  } else if (type === "weltraum") {
    const f = ac.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = 600;
    f.connect(master);
    const l = lfo(ac, f.frequency, 0.04, 280);
    const gain = ac.createGain();
    gain.gain.value = 0.045;
    gain.connect(f);
    const oscs = [110, 164.8, 220.5, 277.2].map((freq, i) => {
      const o = ac.createOscillator();
      o.type = i % 2 ? "triangle" : "sine";
      o.frequency.value = freq;
      o.detune.value = (i - 1.5) * 6;
      o.connect(gain);
      o.start();
      return o;
    });
    stoppers.push(() => oscs.forEach((o) => o.stop()), () => l.stop());
  } else if (type === "spieluhr") {
    const scale = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66];
    const delay = ac.createDelay();
    delay.delayTime.value = 0.32;
    const fb = ac.createGain();
    fb.gain.value = 0.3;
    delay.connect(fb).connect(delay);
    delay.connect(master);
    const play = () => {
      const t = ac.currentTime;
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = "sine";
      o.frequency.value = scale[Math.floor(Math.random() * scale.length)];
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.035, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
      o.connect(g);
      g.connect(master);
      g.connect(delay);
      o.start(t);
      o.stop(t + 1.5);
      timers.push(window.setTimeout(play, 520 + Math.random() * 700));
    };
    play();
  }

  current = {
    type,
    stop: () => {
      timers.forEach((t) => window.clearTimeout(t));
      const t = ac.currentTime;
      master.gain.cancelScheduledValues(t);
      master.gain.setValueAtTime(master.gain.value, t);
      master.gain.linearRampToValueAtTime(0, t + 0.8);
      window.setTimeout(() => {
        stoppers.forEach((s) => {
          try {
            s();
          } catch {
            // bereits gestoppt
          }
        });
        master.disconnect();
      }, 900);
    },
  };
}

export function stopAmbient() {
  current?.stop();
  current = null;
}
