/** Platzhalter, solange eine Detailseite lädt */
export function DetailSkeleton({ color = "#FAF6F1" }: { color?: string }) {
  return (
    <div aria-busy="true" aria-label="Wird geladen">
      <div className="pt-safe" style={{ background: color }}>
        <div className="h-14" />
        <div className="flex items-center gap-4 px-5 pb-10">
          <div className="size-24 animate-pulse rounded-full bg-white/60" />
          <div className="flex-1 space-y-2">
            <div className="h-7 w-3/4 animate-pulse rounded-full bg-white/60" />
            <div className="h-4 w-1/2 animate-pulse rounded-full bg-white/60" />
          </div>
        </div>
      </div>
      <div className="relative -mt-6 space-y-3 rounded-t-[30px] bg-white px-5 pt-6">
        <div className="h-24 animate-pulse rounded-[24px] bg-cream" />
        <div className="h-16 animate-pulse rounded-[24px] bg-cream" />
        <div className="h-16 animate-pulse rounded-[24px] bg-cream" />
      </div>
    </div>
  );
}
