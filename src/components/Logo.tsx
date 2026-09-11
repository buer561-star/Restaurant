type Props = {
  className?: string;
  /** Farbe des Wortlauts */
  tone?: "light" | "dark";
  withText?: boolean;
  subtitle?: string;
};

/**
 * Vereinfachte Vektorfassung des Karahan-Logos: Torbogen mit zwei Minaretten unter einem Spitzbogen.
 * Das Original-Rasterlogo liegt unter /public/images/logo-raster.webp.
 */
export function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" fill="none">
      {/* outer pointed arch */}
      <path
        d="M12 78 C12 40, 30 22, 50 12 C70 22, 88 40, 88 78"
        stroke="var(--color-gold)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* minarets */}
      <rect x="22" y="44" width="10" height="34" stroke="var(--color-gold)" strokeWidth="2.2" />
      <rect x="68" y="44" width="10" height="34" stroke="var(--color-gold)" strokeWidth="2.2" />
      <path d="M22 44 L27 38 L32 44" stroke="var(--color-gold)" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M68 44 L73 38 L78 44" stroke="var(--color-gold)" strokeWidth="2.2" strokeLinejoin="round" />
      {/* gate body */}
      <rect x="34" y="36" width="32" height="42" stroke="var(--color-gold)" strokeWidth="2.4" />
      {/* inner pointed doorway */}
      <path
        d="M41 78 V58 C41 50, 45 46, 50 44 C55 46, 59 50, 59 58 V78"
        fill="var(--color-teal)"
        fillOpacity="0.85"
        stroke="var(--color-gold)"
        strokeWidth="1.8"
      />
      {/* lattice hints */}
      <path d="M38 40 H62 M38 44 H62" stroke="var(--color-teal)" strokeWidth="1.2" />
      {/* ornament above */}
      <path d="M50 22 L54 26 L50 30 L46 26 Z" fill="var(--color-teal)" />
      {/* base wave */}
      <path d="M6 82 C 20 78, 30 86, 50 82 C 70 78, 80 86, 94 82" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className = "", tone = "light", withText = true, subtitle }: Props) {
  const text = tone === "light" ? "text-ivory" : "text-navy";
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <LogoMark className="h-9 w-9 shrink-0 sm:h-11 sm:w-11" />
      {withText && (
        <span className="flex flex-col leading-none">
          <span className={`display text-[1.15rem] tracking-[0.12em] sm:text-[1.35rem] ${text}`}>KARAHAN</span>
          <span className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-teal">
            {subtitle ?? "Uigur Restaurant"}
          </span>
        </span>
      )}
    </span>
  );
}
