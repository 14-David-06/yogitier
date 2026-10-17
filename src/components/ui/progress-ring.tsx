/** Kreisförmiger Fortschritt (0–1). Ohne className: feste Größe `size`, sonst füllt er den Container. */
export function ProgressRing({
  value,
  size = 300,
  stroke = 10,
  color = "#7A4A28",
  track = "rgba(122,74,40,0.12)",
  className,
  smooth = true,
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  track?: string;
  className?: string;
  smooth?: boolean;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(1, value));
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className={className} style={className ? undefined : { width: size, height: size }} aria-hidden>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - v)}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: smooth ? "stroke-dashoffset 1s linear" : undefined }}
      />
    </svg>
  );
}
