"use client";

import { Pause, Play, RotateCcw, SkipForward, Volume2, VolumeX } from "lucide-react";
import { useEffect, useEffectEvent, useRef, useState } from "react";

import { ProgressRing } from "@/components/ui/progress-ring";
import { playChime, playSuccess, playTick } from "@/lib/audio";
import { cn } from "@/lib/cn";
import { speak, stopSpeaking } from "@/lib/speech";
import type { VideoStop } from "@/lib/studio/types";

/** YouTube-/Vimeo-Link → datenschutzfreundliche Einbettungs-URL */
export function embedUrl(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0&modestbranding=1&playsinline=1`;
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}?dnt=1&title=0&byline=0`;
  return null;
}

function fmt(sec: number) {
  if (!Number.isFinite(sec)) return "0:00";
  const s = Math.max(0, Math.floor(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/**
 * Video mit Mitmach-Stopps: An festgelegten Stellen pausiert das Video,
 * das Kind wird zum Mitmachen aufgefordert – danach geht es weiter.
 */
export function InteractiveVideo({
  src,
  poster,
  stops,
  accent,
  onEnded,
}: {
  src: string;
  poster?: string | null;
  stops: VideoStop[];
  accent: string;
  onEnded: () => void;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const triggered = useRef(new Set<string>());
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [stop, setStop] = useState<VideoStop | null>(null);
  const [remaining, setRemaining] = useState(0);
  // für die Anzeige: bereits erreichte Stopps (die Ref verhindert doppelte Auslöser)
  const [passed, setPassed] = useState<string[]>([]);
  const sorted = [...stops].sort((a, b) => a.at - b.at);

  const play = () => {
    const v = video.current;
    if (!v) return;
    if (ended) {
      triggered.current.clear();
      setPassed([]);
      setEnded(false);
      v.currentTime = 0;
    }
    setStarted(true);
    void v.play().catch(() => setPlaying(false));
  };

  const resumeNow = () => {
    setStop(null);
    playSuccess();
    void video.current?.play().catch(() => {});
  };
  const resume = useEffectEvent(() => resumeNow());

  // Countdown während eines Mitmach-Stopps
  useEffect(() => {
    if (!stop) return;
    const id = window.setTimeout(() => {
      const next = remaining - 1;
      if (next <= 0) {
        setRemaining(0);
        resume();
        return;
      }
      if (next <= 3) playTick();
      setRemaining(next);
    }, 1000);
    return () => window.clearTimeout(id);
  }, [stop, remaining]);

  useEffect(() => () => stopSpeaking(), []);

  const onTimeUpdate = () => {
    const v = video.current;
    if (!v) return;
    setTime(v.currentTime);
    if (stop) return;
    const hit = sorted.find((s) => !triggered.current.has(s.id) && v.currentTime >= s.at && v.currentTime < s.at + 2.5);
    if (hit) {
      triggered.current.add(hit.id);
      setPassed([...triggered.current]);
      v.pause();
      setStop(hit);
      setRemaining(Math.max(3, hit.seconds));
      playChime();
      speak(hit.prompt);
    }
  };

  const seek = (e: React.PointerEvent<HTMLDivElement>) => {
    const v = video.current;
    if (!v || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const t = Math.max(0, Math.min(duration, ((e.clientX - rect.left) / rect.width) * duration));
    v.currentTime = t;
    // Stopps nach der neuen Position wieder scharf schalten
    for (const s of sorted) if (s.at > t) triggered.current.delete(s.id);
    setPassed([...triggered.current]);
    setTime(t);
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[26px] bg-[#1b1410] shadow-xl">
      <div className="relative min-h-0 flex-1" onClick={() => (playing ? video.current?.pause() : !stop && play())}>
        <video
          ref={video}
          src={src}
          poster={poster ?? undefined}
          playsInline
          preload="metadata"
          muted={muted}
          className="absolute inset-0 size-full object-contain"
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onDurationChange={(e) => setDuration(e.currentTarget.duration)}
          onTimeUpdate={onTimeUpdate}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => {
            setEnded(true);
            setPlaying(false);
            onEnded();
          }}
        />
        {!playing && !stop && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              play();
            }}
            aria-label={ended ? "Nochmal ansehen" : started ? "Weiter abspielen" : "Video abspielen"}
            className="absolute left-1/2 top-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-ink shadow-xl transition active:scale-95"
          >
            {ended ? <RotateCcw className="size-8" aria-hidden /> : <Play className="ml-1 size-9 fill-ink" aria-hidden />}
          </button>
        )}

        {stop && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1b1410]/55 p-6 text-center backdrop-blur-[2px] animate-fade-up" role="alertdialog" aria-label="Mitmach-Stopp">
            <div className="w-full rounded-[26px] bg-white p-5 shadow-2xl">
              <p className="text-[13px] font-bold uppercase tracking-wider" style={{ color: accent }}>
                Jetzt du!
              </p>
              <p className="mt-1 text-[19px] font-bold leading-snug text-ink-strong">{stop.prompt}</p>
              <div className="relative mx-auto mt-4 grid size-28 place-items-center">
                <ProgressRing value={1 - remaining / Math.max(3, stop.seconds)} size={112} stroke={9} color={accent} />
                <span className="absolute text-[34px] font-bold tabular-nums text-ink">{remaining}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  stopSpeaking();
                  resumeNow();
                }}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-cream px-4 py-2 text-[13px] font-bold text-ink"
              >
                <SkipForward className="size-4" aria-hidden /> Weiter zum Video
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 bg-[#1b1410] px-4 py-3 text-white">
        <button type="button" onClick={() => (playing ? video.current?.pause() : play())} aria-label={playing ? "Pause" : "Abspielen"} className="grid size-9 place-items-center rounded-full bg-white/15">
          {playing ? <Pause className="size-4 fill-white" aria-hidden /> : <Play className="ml-0.5 size-4 fill-white" aria-hidden />}
        </button>
        <div className="relative h-8 flex-1 cursor-pointer" onPointerDown={seek} role="slider" aria-label="Videoposition" aria-valuemin={0} aria-valuemax={Math.round(duration)} aria-valuenow={Math.round(time)} tabIndex={0}>
          <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-white/20" />
          <div className="absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full" style={{ width: `${duration ? (time / duration) * 100 : 0}%`, background: accent }} />
          {duration > 0 &&
            sorted.map((s) => (
              <span
                key={s.id}
                className={cn("absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#1b1410]", passed.includes(s.id) ? "bg-white/50" : "bg-white")}
                style={{ left: `${Math.min(100, (s.at / duration) * 100)}%` }}
                title={`Mitmach-Stopp bei ${fmt(s.at)}`}
              />
            ))}
        </div>
        <span className="w-[74px] text-right text-[12px] font-bold tabular-nums text-white/80">
          {fmt(time)} / {fmt(duration)}
        </span>
        <button type="button" onClick={() => setMuted((m) => !m)} aria-label={muted ? "Ton an" : "Ton aus"} className="grid size-9 place-items-center rounded-full bg-white/15">
          {muted ? <VolumeX className="size-4" aria-hidden /> : <Volume2 className="size-4" aria-hidden />}
        </button>
      </div>
    </div>
  );
}
