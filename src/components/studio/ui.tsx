import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

/** Bausteine der Studio-Oberfläche (Admin) im YOGITIER®-Look */

export function Card({ title, subtitle, action, children, className }: { title?: string; subtitle?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-[24px] bg-white p-5 ring-1 ring-line sm:p-6", className)}>
      {(title || action) && (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            {title && <h2 className="text-[17px] font-bold text-ink-strong">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-[13px] font-medium text-ink-soft">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Field({ label, hint, children, className }: { label: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="text-[13px] font-bold text-ink">{label}</span>
      <span className="mt-1.5 block">{children}</span>
      {hint && <span className="mt-1 block text-[12px] font-medium text-ink-soft">{hint}</span>}
    </label>
  );
}

/**
 * Standardgrößen nur setzen, wenn `className` sie nicht selbst festlegt –
 * in Tailwind 4 entscheidet sonst die CSS-Reihenfolge, nicht die Klassen-Reihenfolge.
 */
function withDefaults(className: string | undefined, defaults: Record<"w" | "h" | "px", string>) {
  const c = className ?? "";
  const has = (p: string) => new RegExp(`(^|\\s)${p}-`).test(c);
  return cn(!has("w") && !has("size") && defaults.w, !has("h") && !has("size") && defaults.h, !has("px") && defaults.px, c);
}

const inputBase =
  "rounded-[14px] border-2 border-line bg-cream text-[14.5px] font-semibold text-ink outline-none transition placeholder:font-medium placeholder:text-ink-soft/60 focus:border-lilac focus:bg-white";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputBase, withDefaults(className, { w: "w-full", h: "h-11", px: "px-3.5" }))} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(inputBase, "resize-y py-2.5 leading-relaxed", withDefaults(className, { w: "w-full", h: "", px: "px-3.5" }))} />;
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={cn(inputBase, "cursor-pointer pr-8", withDefaults(className, { w: "w-full", h: "h-11", px: "pl-3.5" }))}>
      {children}
    </select>
  );
}

type Variant = "primary" | "secondary" | "ghost" | "danger";

export function Button({ variant = "secondary", className, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-bold transition active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
        !/(^|\s)text-\[/.test(className ?? "") && "text-[14px]",
        variant === "primary" && "bg-ink text-white shadow-md shadow-ink/20 hover:bg-ink-strong",
        variant === "secondary" && "bg-white text-ink ring-1 ring-line hover:bg-cream",
        variant === "ghost" && "text-ink hover:bg-cream",
        variant === "danger" && "bg-[#FDECE7] text-[#A23B1E] hover:bg-[#FBDCD2]",
        withDefaults(className, { w: "", h: "h-10", px: "px-4" }),
      )}
    >
      {children}
    </button>
  );
}

export function StatusBadge({ status }: { status: "entwurf" | "veroeffentlicht" }) {
  return status === "veroeffentlicht" ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#DCEBD0] px-2.5 py-1 text-[11.5px] font-bold text-[#3E6B33]">
      <span className="size-1.5 rounded-full bg-[#4A8A3C]" /> Veröffentlicht
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FBF1BE] px-2.5 py-1 text-[11.5px] font-bold text-[#7A5A12]">
      <span className="size-1.5 rounded-full bg-[#C99A1E]" /> Entwurf
    </span>
  );
}

export function PageTitle({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[28px] font-bold leading-tight text-ink-strong">{title}</h1>
        {subtitle && <p className="mt-1 max-w-[680px] text-[14.5px] font-medium text-ink-soft">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Segmented<T extends string>({ value, options, onChange, label }: { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex flex-wrap gap-1 rounded-full bg-cream p-1 ring-1 ring-line">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn("h-8 rounded-full px-3.5 text-[13px] font-bold transition", value === o.value ? "bg-white text-ink shadow-sm" : "text-ink-soft hover:text-ink")}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
