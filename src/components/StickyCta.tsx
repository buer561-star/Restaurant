"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { site } from "@/data/site";

/** Mobile Aktionsleiste am unteren Rand: Reservieren, Anrufen, Route. */
export function StickyCta() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  if (pathname.startsWith("/reservation") || pathname.startsWith("/admin")) return null;

  return (
    <div className="no-print fixed inset-x-0 bottom-0 z-30 border-t border-gold/40 bg-navy/95 backdrop-blur-md lg:hidden">
      <div className="grid grid-cols-[1fr_auto_auto]">
        <Link href="/reservation" className="flex min-h-14 items-center justify-center bg-gold text-sm font-bold uppercase tracking-[0.1em] text-navy">
          {t("book")}
        </Link>
        <a href={`tel:${site.phoneHref}`} className="flex min-h-14 min-w-16 flex-col items-center justify-center gap-0.5 border-l border-ivory/10 px-4 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-ivory">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1L8 9.7a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.8.3 1.7.5 2.6.7a2 2 0 0 1 1.7 2z"/></svg>
          {t("call")}
        </a>
        <a href={site.googleMaps} target="_blank" rel="noopener" className="flex min-h-14 min-w-16 flex-col items-center justify-center gap-0.5 border-l border-ivory/10 px-4 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-ivory">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {t("directions")}
        </a>
      </div>
    </div>
  );
}
