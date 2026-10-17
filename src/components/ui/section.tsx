import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export function Section({
  title,
  subtitle,
  action,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    // eigener Abstand per className überschreibt den Standard (Tailwind 4 sortiert nach Wert, nicht nach Reihenfolge)
    <section className={cn(!/(^|\s)mt-/.test(className ?? "") && "mt-7", "px-5", className)}>
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-[19px] font-bold text-ink">{title}</h2>
          {subtitle && <p className="mt-0.5 text-[13px] font-medium text-ink-soft">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Pill({ children, className, style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <span
      className={cn("inline-flex items-center gap-1 rounded-full bg-white/70 px-2.5 py-1 text-[12px] font-bold text-ink", className)}
      style={style}
    >
      {children}
    </span>
  );
}
