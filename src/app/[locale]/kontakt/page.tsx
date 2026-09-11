import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/Header";
import { PageHero } from "@/components/PageHero";
import { Hours } from "@/components/Hours";
import { site } from "@/data/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("contactTitle"), description: t("contactDescription") };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("contact");
  const tc = await getTranslations("common");
  const tn = await getTranslations("nav");
  const query = encodeURIComponent(`${site.legalName}, ${site.address.street}, ${site.address.zip} ${site.address.city}`);
  const mapSrc = `https://www.google.com/maps?q=${query}&z=15&hl=${locale}&output=embed`;

  return (
    <>
      <Header />
      <main>
        <PageHero eyebrow="Karahan" title={t("title")} lead={t("lead")} />
        <div className="container-page grid gap-12 py-12 sm:py-16 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-10">
            <div>
              <h2 className="eyebrow">{tc("address")}</h2>
              <address className="serif mt-3 text-[1.1rem] not-italic leading-relaxed text-ink">
                {site.legalName}<br />{site.address.street}<br />{site.address.zip} {site.address.city}
              </address>
              <div className="mt-4 flex flex-wrap gap-3">
                <a href={site.googleMaps} target="_blank" rel="noopener" className="btn btn-outline">{t("mapCta")}</a>
              </div>
            </div>
            <div>
              <h2 className="eyebrow">{tc("phone")} & {tc("email")}</h2>
              <p className="serif mt-3 text-[1.1rem] leading-relaxed">
                <a href={`tel:${site.phoneHref}`} className="text-navy underline decoration-gold underline-offset-4">{site.phone}</a><br />
                <a href={`mailto:${site.email}`} className="text-navy underline decoration-gold underline-offset-4">{site.email}</a>
              </p>
              <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener" className="btn btn-outline mt-4">{t("whatsapp")}</a>
            </div>
            <div>
              <h2 className="eyebrow">{tc("hours")}</h2>
              <div className="mt-3"><Hours /></div>
            </div>
            <div>
              <h2 className="eyebrow">{t("reservationsTitle")}</h2>
              <p className="mt-3 text-ink-2">{t("reservationsText", { max: site.booking.maxGuestsOnline + 1 })}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/reservation" className="btn btn-gold">{tn("book")}</Link>
                <Link href="/gruppen-und-events" className="btn btn-outline">{tn("events")}</Link>
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <div className="aspect-[4/3] overflow-hidden bg-sand shadow-soft">
              <iframe
                title="Google Maps"
                src={mapSrc}
                width="100%"
                height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
            <div>
              <h2 className="display text-xl text-navy">{t("directionsTitle")}</h2>
              <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="bg-ivory-2 p-5 shadow-soft">
                  <dt className="font-semibold text-navy">{t("byTrain")}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-ink-2">{t("byTrainText")}</dd>
                </div>
                <div className="bg-ivory-2 p-5 shadow-soft">
                  <dt className="font-semibold text-navy">{t("byCar")}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-ink-2">{t("byCarText")}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
