import type { WeekDay } from "@/lib/stats";

const BAR = "#D9821A";
const PLOT_H = 120;

/**
 * Übungsminuten pro Tag (eine Datenreihe). Tooltip pro Balken bei Hover/Fokus,
 * Wertelabel nur für heute und das Maximum, Tabellenansicht für Screenreader & Details.
 */
export function WeekChart({ days, goal }: { days: WeekDay[]; goal: number }) {
  const max = Math.max(goal * 1.25, ...days.map((d) => d.minutes), 5);
  const peak = Math.max(...days.map((d) => d.minutes));
  const y = (v: number) => (v / max) * PLOT_H;

  return (
    <figure>
      <div className="relative" style={{ height: PLOT_H + 28 }}>
        {/* Ziel-Linie */}
        <div className="absolute inset-x-0 border-t border-line" style={{ bottom: 28 + y(goal) }} aria-hidden>
          <span className="absolute -top-[18px] right-0 rounded-full bg-white px-1.5 text-[10.5px] font-bold text-ink-soft">Ziel {goal} Min.</span>
        </div>
        {/* Grundlinie */}
        <div className="absolute inset-x-0 border-t border-[#D9CBBD]" style={{ bottom: 28 }} aria-hidden />
        <ol className="absolute inset-x-0 bottom-0 top-0 grid grid-cols-7">
          {days.map((d) => {
            const h = d.minutes > 0 ? Math.max(4, y(d.minutes)) : 0;
            const showLabel = d.minutes > 0 && (d.isToday || d.minutes === peak);
            return (
              <li key={d.key} className="relative">
                <button
                  type="button"
                  className="group absolute inset-x-0 bottom-0 top-0 flex flex-col items-center justify-end outline-none"
                  aria-label={`${d.label}: ${d.minutes} Minuten`}
                >
                  <span
                    className="pointer-events-none absolute z-10 hidden -translate-y-2 whitespace-nowrap rounded-[10px] bg-ink-strong px-2 py-1 text-[11.5px] font-bold text-white shadow-md group-hover:block group-focus-visible:block"
                    style={{ bottom: 28 + h + 4 }}
                  >
                    {d.minutes} Min.
                  </span>
                  {showLabel && (
                    <span className="absolute text-[11px] font-bold text-ink group-hover:invisible group-focus-visible:invisible" style={{ bottom: 28 + h + 3 }}>
                      {d.minutes}
                    </span>
                  )}
                  <span
                    className="block w-[min(22px,60%)] rounded-t-[4px] transition group-hover:brightness-110"
                    style={{ height: h, background: d.isFuture ? "transparent" : BAR, marginBottom: 28 }}
                  />
                  <span className={`absolute bottom-1 text-[11.5px] font-bold ${d.isToday ? "text-ink" : "text-ink-soft"}`}>{d.label}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
      <details className="mt-2 text-[12.5px]">
        <summary className="cursor-pointer font-bold text-ink-soft">Als Tabelle anzeigen</summary>
        <table className="mt-2 w-full text-left">
          <thead>
            <tr className="text-ink-soft">
              <th className="py-1 font-bold">Tag</th>
              <th className="py-1 text-right font-bold">Minuten</th>
            </tr>
          </thead>
          <tbody>
            {days.map((d) => (
              <tr key={d.key} className="border-t border-line text-ink">
                <td className="py-1 font-semibold">{d.date.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "short" })}</td>
                <td className="py-1 text-right font-semibold tabular-nums">{d.minutes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
