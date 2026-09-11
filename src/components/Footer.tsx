import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "./Logo";
import { Hours } from "./Hours";
import { IkatBand } from "./IkatBand";
import { site } from "@/data/site";

export function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto bg-navy text-ivory">
      <IkatBand />
      <div className="container-page grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo tone="light" />
          <p className="serif mt-5 text-[1.05rem] leading-relaxed text-ivory/80">{t("footer.tagline")}</p>
          <div className="mt-6 flex gap-4">
            <a href={site.instagram} target="_blank" rel="noopener" aria-label="Instagram" className="text-ivory/70 transition hover:text-gold">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
            </a>
            <a href={site.tiktok} target="_blank" rel="noopener" aria-label="TikTok" className="text-ivory/70 transition hover:text-gold">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 3c.4 2.4 2 4 4.5 4.2v3.2c-1.7 0-3.2-.5-4.5-1.4v6.4a5.6 5.6 0 1 1-5.6-5.6c.3 0 .7 0 1 .1v3.3a2.4 2.4 0 1 0 1.4 2.2V3h3.2z"/></svg>
            </a>
            <a href={site.facebook} target="_blank" rel="noopener" aria-label="Facebook" className="text-ivory/70 transition hover:text-gold">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-7h2.4l.4-3h-2.8V9.2c0-.9.3-1.5 1.5-1.5h1.4V5.1c-.3 0-1.1-.1-2.1-.1-2.1 0-3.6 1.3-3.6 3.7V11H8.3v3h2.4v7h2.8z"/></svg>
            </a>
          </div>
        </div>

        <div>
          <h2 className="eyebrow mb-4 text-gold">{t("common.hours")}</h2>
          <Hours tone="light" compact />
        </div>

        <div>
          <h2 className="eyebrow mb-4 text-gold">{t("common.address")}</h2>
          <address className="not-italic leading-relaxed text-ivory/85">
            {site.legalName}
            <br />
            {site.address.street}
            <br />
            {site.address.zip} {site.address.city}
          </address>
          <p className="mt-4 leading-relaxed">
            <a href={`tel:${site.phoneHref}`} className="text-ivory/85 hover:text-gold">{site.phone}</a>
            <br />
            <a href={`mailto:${site.email}`} className="text-ivory/85 hover:text-gold">{site.email}</a>
          </p>
        </div>

        <div>
          <h2 className="eyebrow mb-4 text-gold">{t("footer.legal")}</h2>
          <ul className="space-y-2 text-ivory/85">
            <li><Link href="/speisekarte" className="hover:text-gold">{t("nav.menu")}</Link></li>
            <li><Link href="/reservation" className="hover:text-gold">{t("nav.reservation")}</Link></li>
            <li><Link href="/kontakt" className="hover:text-gold">{t("nav.contact")}</Link></li>
            <li><Link href="/impressum" className="hover:text-gold">{t("footer.imprint")}</Link></li>
            <li><Link href="/datenschutz" className="hover:text-gold">{t("footer.privacy")}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ivory/10">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-ivory/50 sm:flex-row sm:justify-between">
          <span>{t("footer.copyright", { year, name: site.legalName })}</span>
          <span>{t("footer.madeIn")}</span>
        </div>
      </div>
      {/* Platz für die mobile Aktionsleiste */}
      <div className="h-14 lg:hidden" aria-hidden="true" />
    </footer>
  );
}
