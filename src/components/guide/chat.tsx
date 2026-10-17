"use client";

import { Compass, Mic, Send, Volume2, VolumeX, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { guideSuggestions, guideWelcome, tourForPath, type GuideAction, type GuideArea, type GuideContext } from "@/content/guide";
import { cn } from "@/lib/cn";
import { answer } from "@/lib/guide/brain";
import { closeChat, setMuted, startTour, useGuide } from "@/lib/guide/store";
import { hush, say } from "@/lib/guide/voice";
import { useAppState } from "@/lib/store";
import { useStudio } from "@/lib/studio/store";
import { validateWorld } from "@/lib/studio/validate";

import { EmmiAvatar } from "./emmi-avatar";

type Message = { id: number; from: "emmi" | "du"; text: string; actions?: GuideAction[] };

// Spracheingabe (Web Speech API, in Chrome & Edge verfügbar)
type Recognition = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onresult: ((e: { results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};
type RecognitionWindow = { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
const recognition = () => {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as RecognitionWindow;
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
};
const noop = () => () => {};

/** Fragen & Antworten mit Emmi – in der Kinder-App als Blatt im Handy, im Studio als Fenster unten rechts. */
export function GuideChat({ area }: { area: GuideArea }) {
  const { chat } = useGuide();
  return chat ? <ChatPanel area={area} /> : null;
}

function ChatPanel({ area }: { area: GuideArea }) {
  const app = useAppState();
  const studio = useStudio();
  const pathname = usePathname();
  const router = useRouter();
  const { muted, speaking } = useGuide();
  const name = area === "kids" ? app.profile.name : "";
  const welcome = guideWelcome({ area, name });
  const [messages, setMessages] = useState<Message[]>(() => [{ id: 0, from: "emmi", text: welcome }]);
  const [suggestions, setSuggestions] = useState(guideSuggestions[area]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [listening, setListening] = useState(false);
  const canListen = useSyncExternalStore(noop, () => !!recognition(), () => false);
  const nextId = useRef(1);
  const list = useRef<HTMLDivElement>(null);
  const rec = useRef<Recognition | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => say(welcome), 250);
    return () => {
      window.clearTimeout(t);
      hush();
      rec.current?.stop();
    };
  }, [welcome]);

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const context = (): GuideContext => {
    const editorId = area === "studio" ? pathname.match(/^\/admin\/welten\/([^/]+)$/)?.[1] : undefined;
    const world = editorId ? studio.worlds.find((w) => w.id === editorId) : undefined;
    return {
      area,
      path: pathname,
      name,
      hour: new Date().getHours(),
      stars: app.stars,
      stickers: app.stickers.length,
      worldsDone: Object.values(app.worldProgress).filter((p) => p.completedAt).length,
      studio:
        area === "studio"
          ? {
              worlds: studio.worlds.length,
              published: studio.worlds.filter((w) => w.status === "veroeffentlicht").length,
              videos: studio.media.filter((m) => m.type.startsWith("video/")).length,
              issues: world ? validateWorld(world) : null,
            }
          : undefined,
    };
  };

  const send = (raw: string) => {
    const question = raw.trim();
    if (!question || thinking) return;
    const id = nextId.current;
    nextId.current += 2;
    setInput("");
    setMessages((m) => [...m, { id, from: "du", text: question }]);
    setThinking(true);
    hush();
    window.setTimeout(() => {
      const reply = answer(question, context());
      setMessages((m) => [...m, { id: id + 1, from: "emmi", text: reply.text, actions: reply.actions }]);
      setSuggestions(reply.suggestions.length ? reply.suggestions : guideSuggestions[area].filter((s) => s !== question));
      setThinking(false);
      say(reply.text);
    }, 650);
  };

  const act = (action: GuideAction) => {
    if (action.tour) {
      const home = action.tour === "kinder-start" ? "/" : action.tour === "studio-start" ? "/admin" : null;
      if (home && pathname !== home) router.push(home);
      startTour(action.tour);
    } else if (action.href) {
      closeChat();
      router.push(action.href);
    }
  };

  const listen = () => {
    const Recognition = recognition();
    if (!Recognition) return;
    if (listening) {
      rec.current?.stop();
      return;
    }
    hush();
    const r = new Recognition();
    r.lang = "de-DE";
    r.interimResults = true;
    r.maxAlternatives = 1;
    r.onresult = (e) => {
      let text = "";
      let final = false;
      for (let i = 0; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
        final = e.results[i].isFinal;
      }
      setInput(text);
      if (final) send(text);
    };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    rec.current = r;
    r.start();
    setListening(true);
  };

  const kids = area === "kids";

  return (
    <div role="dialog" aria-modal={kids} aria-label="Emmi – Fragen & Hilfe" className={cn(kids ? "fixed inset-0 z-[65]" : "fixed bottom-5 right-5 z-50")}>
      {kids && <button type="button" aria-label="Schließen" onClick={closeChat} className="absolute inset-0 bg-[#2b1d14]/40" style={{ animation: "fade-in 200ms ease-out both" }} />}
      <div
        className={cn(
          "flex flex-col overflow-hidden bg-white",
          kids
            ? "absolute inset-x-0 bottom-0 h-[84%] rounded-t-[30px] pb-safe shadow-2xl"
            : "h-[min(640px,calc(100dvh-40px))] w-[min(410px,calc(100vw-40px))] rounded-[28px] shadow-[0_30px_80px_-24px_rgb(43_29_20/0.55)] ring-1 ring-line",
        )}
        style={{ animation: kids ? "sheet-up 340ms cubic-bezier(0.32, 0.72, 0, 1) both" : "pop 300ms cubic-bezier(0.34, 1.56, 0.64, 1) both" }}
      >
        {/* Kopf mit Emmi */}
        <div className="relative flex items-center gap-3 bg-gradient-to-br from-[#EFEAFD] via-[#E7E2F8] to-[#FBE3E6] px-4 pb-3 pt-4">
          <EmmiAvatar size={70} speaking={speaking} />
          <div className="min-w-0 flex-1">
            <p className="text-[19px] font-bold leading-tight text-ink-strong">Emmi</p>
            <p className="text-[12.5px] font-semibold text-lilac-ink">{kids ? "Deine YOGITIER-Begleiterin" : "Deine Assistentin im Studio"}</p>
            {speaking && (
              <p className="mt-0.5 flex items-center gap-1 text-[11.5px] font-bold text-lilac-ink/80" aria-hidden>
                <Volume2 className="size-3" /> spricht …
              </p>
            )}
          </div>
          <button type="button" onClick={closeChat} aria-label="Emmi schließen" className="grid size-10 place-items-center rounded-full bg-white/80 text-ink transition hover:bg-white">
            <X className="size-5" aria-hidden />
          </button>
        </div>

        {/* Verlauf */}
        <div ref={list} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
          {messages.map((m) =>
            m.from === "emmi" ? (
              <div key={m.id} className="flex max-w-[88%] flex-col items-start gap-2">
                <p className="rounded-[20px] rounded-tl-[6px] bg-meditation/70 px-3.5 py-2.5 text-[14.5px] font-medium leading-snug text-ink-strong">{m.text}</p>
                {!!m.actions?.length && (
                  <div className="flex flex-wrap gap-1.5">
                    {m.actions.map((a) => (
                      <button
                        key={a.label}
                        type="button"
                        onClick={() => act(a)}
                        className="inline-flex h-9 items-center gap-1.5 rounded-full bg-ink px-3.5 text-[13px] font-bold text-white transition active:scale-[0.98]"
                      >
                        {a.tour && <Compass className="size-3.5" aria-hidden />}
                        {a.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p key={m.id} className="ml-auto w-fit max-w-[80%] rounded-[20px] rounded-tr-[6px] bg-ink px-3.5 py-2.5 text-[14.5px] font-semibold leading-snug text-white">
                {m.text}
              </p>
            ),
          )}
          {thinking && (
            <p className="flex w-fit gap-1 rounded-[20px] rounded-tl-[6px] bg-meditation/70 px-4 py-3.5" aria-label="Emmi denkt nach">
              {[0, 1, 2].map((i) => (
                <span key={i} className="size-2 rounded-full bg-lilac-ink" style={{ animation: `dot-bounce 1s ease-in-out ${i * 0.15}s infinite` }} />
              ))}
            </p>
          )}
        </div>

        {/* Ideen */}
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              className="shrink-0 rounded-full bg-cream px-3 py-1.5 text-[13px] font-bold text-ink ring-1 ring-line transition hover:bg-white"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Eingabe */}
        <form
          className="flex items-center gap-2 border-t border-line px-3 py-3"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={listening ? "Ich höre zu …" : kids ? "Frag Emmi …" : "Frage an Emmi …"}
            aria-label="Frage an Emmi"
            enterKeyHint="send"
            className="h-11 min-w-0 flex-1 rounded-full bg-cream px-4 text-[15px] font-medium text-ink outline-none ring-1 ring-line placeholder:text-ink-soft focus:ring-2 focus:ring-lilac"
          />
          {canListen && (
            <button
              type="button"
              onClick={listen}
              aria-label={listening ? "Zuhören beenden" : "Frage sprechen"}
              aria-pressed={listening}
              className={cn("grid size-11 shrink-0 place-items-center rounded-full transition", listening ? "bg-[#F48FB1] text-white" : "bg-cream text-ink ring-1 ring-line")}
              style={listening ? { animation: "spot-pulse 1.4s ease-in-out infinite" } : undefined}
            >
              <Mic className="size-5" aria-hidden />
            </button>
          )}
          <button type="submit" aria-label="Senden" disabled={!input.trim() || thinking} className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-white transition disabled:opacity-40">
            <Send className="size-[18px]" aria-hidden />
          </button>
        </form>

        {/* Steuerung */}
        <div className="flex items-center gap-2 px-3 pb-3">
          <button
            type="button"
            onClick={() => {
              if (!muted) hush();
              setMuted(!muted);
            }}
            aria-pressed={!muted}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-cream px-3 text-[12.5px] font-bold text-ink ring-1 ring-line"
          >
            {muted ? <VolumeX className="size-4" aria-hidden /> : <Volume2 className="size-4" aria-hidden />} {muted ? "Stimme aus" : "Stimme an"}
          </button>
          <button
            type="button"
            onClick={() => act({ label: "Tour", tour: tourForPath(area, pathname) })}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-cream px-3 text-[12.5px] font-bold text-ink ring-1 ring-line"
          >
            <Compass className="size-4" aria-hidden /> Tour starten
          </button>
        </div>
      </div>
    </div>
  );
}
