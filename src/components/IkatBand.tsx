/** Schmales Ikat-Band als Sektionsgrenze, angelehnt an die Stoffe im Gastraum. */
export function IkatBand({ className = "" }: { className?: string }) {
  return (
    <div className={`h-3 w-full overflow-hidden ${className}`} aria-hidden="true">
      <svg width="100%" height="12" preserveAspectRatio="none">
        <defs>
          <pattern id="ikat" width="48" height="12" patternUnits="userSpaceOnUse">
            <rect width="48" height="12" fill="var(--color-ivory)" />
            <path d="M0 6 L12 0 L24 6 L12 12 Z" fill="var(--color-ikat)" />
            <path d="M24 6 L36 0 L48 6 L36 12 Z" fill="var(--color-navy)" />
            <path d="M6 6 L12 3 L18 6 L12 9 Z" fill="var(--color-gold)" />
            <path d="M30 6 L36 3 L42 6 L36 9 Z" fill="var(--color-teal)" />
          </pattern>
        </defs>
        <rect width="100%" height="12" fill="url(#ikat)" />
      </svg>
    </div>
  );
}
