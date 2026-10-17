/** Statusleiste, Dynamic Island und Home-Indikator – nur im Präsentations-Rahmen sichtbar. */
export function DeviceChrome() {
  return (
    <div className="device-chrome" aria-hidden>
      <div className="absolute inset-x-0 top-0 flex h-[52px] items-center justify-between px-8 pt-1 text-[15px] font-semibold text-[#3b2a1e]">
        <span className="w-14 tabular-nums">9:41</span>
        <span className="flex w-14 items-center justify-end gap-1.5">
          <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
            <rect x="0" y="8" width="3" height="4" rx="1" />
            <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
            <rect x="10" y="3" width="3" height="9" rx="1" />
            <rect x="15" y="0" width="3" height="12" rx="1" />
          </svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
            <path d="M8 2.2c2.4 0 4.6.9 6.3 2.5l1.2-1.3A10.6 10.6 0 0 0 8 .4C5.2.4 2.5 1.5.5 3.4l1.2 1.3A9 9 0 0 1 8 2.2Z" />
            <path d="M8 5.6c1.5 0 2.9.6 3.9 1.5l1.2-1.3A7.3 7.3 0 0 0 8 3.8c-1.9 0-3.7.7-5.1 2l1.2 1.3c1-.9 2.4-1.5 3.9-1.5Z" />
            <path d="M8 9c.6 0 1.2.2 1.6.6L8 11.5 6.4 9.6C6.8 9.2 7.4 9 8 9Z" />
          </svg>
          <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
            <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="currentColor" opacity="0.4" />
            <rect x="2" y="2" width="18" height="9" rx="2" fill="currentColor" />
            <path d="M25 4.5v4c.8-.3 1.5-1.1 1.5-2s-.7-1.7-1.5-2Z" fill="currentColor" opacity="0.4" />
          </svg>
        </span>
      </div>
      <div className="absolute left-1/2 top-[11px] h-[33px] w-[118px] -translate-x-1/2 rounded-full bg-[#120d0a]" />
      <div className="absolute bottom-[8px] left-1/2 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-[#3b2a1e]/35" />
    </div>
  );
}
