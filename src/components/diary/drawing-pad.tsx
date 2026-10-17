"use client";

import { Eraser, Trash2 } from "lucide-react";
import { useImperativeHandle, useRef, useState, type Ref } from "react";

import { cn } from "@/lib/cn";

const COLORS = ["#5A3218", "#E0612A", "#F1DD4B", "#8CC084", "#7B9BBB", "#A6A3D2", "#E9879E"];
const COLOR_NAMES = ["Braun", "Orange", "Gelb", "Grün", "Blau", "Lila", "Rosa"];

export type DrawingPadHandle = { toDataUrl: () => string | null };

/** kleines Malbrett für Finger und Maus */
export function DrawingPad({ ref }: { ref?: Ref<DrawingPadHandle> }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const dirty = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [color, setColor] = useState(COLORS[1]);
  const [eraser, setEraser] = useState(false);

  useImperativeHandle(ref, () => ({
    toDataUrl: () => {
      const c = canvas.current;
      if (!c || !dirty.current) return null;
      // verkleinert speichern, damit der lokale Speicher nicht vollläuft
      const out = document.createElement("canvas");
      out.width = 320;
      out.height = 200;
      const ctx = out.getContext("2d");
      if (!ctx) return null;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, out.width, out.height);
      ctx.drawImage(c, 0, 0, out.width, out.height);
      return out.toDataURL("image/jpeg", 0.72);
    },
  }));

  const point = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = e.currentTarget;
    const rect = c.getBoundingClientRect();
    return { x: ((e.clientX - rect.left) / rect.width) * c.width, y: ((e.clientY - rect.top) / rect.height) * c.height };
  };

  const stroke = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    ctx.globalCompositeOperation = eraser ? "destination-out" : "source-over";
    ctx.strokeStyle = color;
    ctx.lineWidth = eraser ? 28 : 9;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  };

  return (
    <div>
      <canvas
        ref={canvas}
        width={640}
        height={400}
        className="aspect-[16/10] w-full touch-none rounded-[20px] bg-white ring-1 ring-line"
        aria-label="Malfläche"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          drawing.current = true;
          const p = point(e);
          last.current = p;
          stroke(p, { x: p.x + 0.1, y: p.y + 0.1 });
          dirty.current = true;
        }}
        onPointerMove={(e) => {
          if (!drawing.current || !last.current) return;
          const p = point(e);
          stroke(last.current, p);
          last.current = p;
        }}
        onPointerUp={() => {
          drawing.current = false;
          last.current = null;
        }}
        onPointerCancel={() => {
          drawing.current = false;
          last.current = null;
        }}
      />
      <div className="mt-2 flex items-center gap-1.5">
        {COLORS.map((c, i) => (
          <button
            key={c}
            type="button"
            onClick={() => {
              setColor(c);
              setEraser(false);
            }}
            aria-label={`Farbe ${COLOR_NAMES[i]}`}
            aria-pressed={!eraser && color === c}
            className={cn("size-8 rounded-full ring-offset-2 transition active:scale-90", !eraser && color === c && "ring-2 ring-ink")}
            style={{ background: c }}
          />
        ))}
        <span className="flex-1" />
        <button
          type="button"
          onClick={() => setEraser((v) => !v)}
          aria-label="Radiergummi"
          aria-pressed={eraser}
          className={cn("grid size-9 place-items-center rounded-full bg-cream text-ink", eraser && "bg-ink text-white")}
        >
          <Eraser className="size-4" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => {
            const c = canvas.current;
            c?.getContext("2d")?.clearRect(0, 0, c.width, c.height);
            dirty.current = false;
          }}
          aria-label="Bild löschen"
          className="grid size-9 place-items-center rounded-full bg-cream text-ink"
        >
          <Trash2 className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
