import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { localizedAlternates } from "@/lib/seo";
import { Header } from "@/components/Header";
import { Section, SectionHeading } from "@/components/Section";
import { DishCard } from "@/components/DishCard";
import { Hours } from "@/components/Hours";
import { IkatBand } from "@/components/IkatBand";
import { PlaceholderBadge } from "@/components/PlaceholderBadge";
import { findItem, signatureIds } from "@/data/menu";
import { images } from "@/data/images";
import { site } from "@/data/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { alternates: localizedAlternates("/", locale as Locale) };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("home");
  const tc = await getTranslations("common");
  const l = locale as Locale;
  const signatures = signatureIds.map(findItem).filter((i): i is NonNullable<typeof i> => Boolean(i));
  const openingDate = new Intl.DateTimeFormat(locale === "de" ? "de-CH" : locale === "tr" ? "tr-TR" : "en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(site.openingDate));

  return (
    <>
      <Header transparent />
      <main>
        {/* ---------- Hero ---------- */}
        <section className="relative isolate min-h-[88svh] overflow-hidden bg-navy text-ivory">
          <Image
            src={images.interior.src}
            alt={images.interior.alt[l]}
            fill
            priority
            fetchPriority="high"
            quality={55}
            sizes="100vw"
            className="object-cover object-center opacity-[0.55]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-navy/30" aria-hidden="true" />
          <div className="container-page relative flex min-h-[88svh] flex-col justify-end pb-16 pt-32 sm:pb-24">
            <p className="eyebrow text-gold">{t("eyebrow")}</p>
            <h1 className="display mt-4 max-w-3xl text-[2.4rem] leading-[1.05] sm:text-[3.4rem] lg:text-[4.2rem]">
              {t("heroTitle")}
            </h1>
            <p className="serif mt-6 max-w-xl text-[1.1rem] leading-relaxed text-ivory/85 sm:text-[1.2rem]">
              {t("heroText")}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/reservation" className="btn btn-gold">{t("heroCta")}</Link>
              <Link href="/speisekarte" className="btn btn-outline-light">{t("heroSecondary")}</Link>
            </div>
            <p className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold uppercase tracking-[0.14em] text-ivory/70">
              <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rotate-45 bg-gold" />{tc("halal")}</span>
              <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rotate-45 bg-gold" />{tc("handmade")}</span>
              <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rotate-45 bg-gold" />{tc("openingSoon", { date: openingDate })}</span>
            </p>
          </div>
        </section>
        <IkatBand />

        {/* ---------- Signature dishes ---------- */}
        <Section>
          <SectionHeading eyebrow={t("signatureEyebrow")} title={t("signatureTitle")} />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {signatures.map((item, i) => (
              <DishCard key={item.id} item={item} priority={i === 0} />
            ))}
          </div>
          <p className="mt-6 text-xs text-ink-3">{tc("pricesPlaceholder")}</p>
        </Section>

        {/* ---------- First time ---------- */}
        <section className="bg-navy text-ivory">
          <div className="container-page grid gap-12 py-16 sm:py-20 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:py-24">
            <div>
              <SectionHeading tone="light" eyebrow={t("firstTimeEyebrow")} title={t("firstTimeTitle")} text={t("firstTimeText")} />
              <Link href="/speisekarte" className="btn btn-gold mt-8">{t("firstTimeCta")}</Link>
            </div>
            <ol className="grid gap-px bg-ivory/10">
              {(["1", "2", "3"] as const).map((n) => (
                <li key={n} className="grid grid-cols-[3rem_1fr] gap-4 bg-navy py-6 pr-4">
                  <span className="display text-3xl text-gold">{n}</span>
                  <div>
                    <h3 className="display text-xl">{t(`firstTimeSteps.${n}.title`)}</h3>
                    <p className="serif mt-2 leading-relaxed text-ivory/75">{t(`firstTimeSteps.${n}.text`)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------- Craft ---------- */}
        <Section>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="relative aspect-[16/10] overflow-hidden shadow-lift">
              <Image src={images.kitchenDough.src} alt={images.kitchenDough.alt[l]} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
              {images.kitchenDough.placeholder && <PlaceholderBadge />}
            </div>
            <div>
              <SectionHeading eyebrow={t("craftEyebrow")} title={t("craftTitle")} text={t("craftText")} />
              <ul className="mt-8 space-y-3">
                {(["1", "2", "3"] as const).map((n) => (
                  <li key={n} className="flex gap-3 text-[1.02rem] text-ink">
                    <span className="mt-2.5 h-2 w-2 shrink-0 rotate-45 bg-gold" aria-hidden="true" />
                    {t(`craftPoints.${n}`)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* ---------- Culture ---------- */}
        <section className="bg-sand">
          <div className="container-page grid gap-10 py-16 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-24">
            <div className="order-2 lg:order-1">
              <SectionHeading eyebrow={t("cultureEyebrow")} title={t("cultureTitle")} text={t("cultureText")} />
              <Link href="/ueber-uns" className="btn btn-navy mt-8">{t("cultureCta")}</Link>
            </div>
            <div className="order-1 grid grid-cols-[1.2fr_1fr] gap-3 lg:order-2">
              <div className="relative aspect-[3/4] overflow-hidden shadow-lift">
                <Image src={images.columns.src} alt={images.columns.alt[l]} fill sizes="(min-width:1024px) 30vw, 60vw" className="object-cover" />
              </div>
              <div className="relative mt-10 aspect-[3/4] overflow-hidden shadow-lift">
                <Image src={images.shelf.src} alt={images.shelf.alt[l]} fill sizes="(min-width:1024px) 25vw, 40vw" className="object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Sharing ---------- */}
        <Section>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeading eyebrow={t("sharingEyebrow")} title={t("sharingTitle")} text={t("sharingText")} />
              <Link href="/gruppen-und-events" className="btn btn-outline mt-8">{t("sharingCta")}</Link>
            </div>
            <div className="relative aspect-[4/5] max-h-[560px] overflow-hidden shadow-lift lg:justify-self-end lg:w-[420px]">
              <Image src={images.table.src} alt={images.table.alt[l]} fill sizes="(min-width:1024px) 420px, 100vw" className="object-cover" />
            </div>
          </div>
        </Section>

        {/* ---------- Visit ---------- */}
        <section className="bg-navy text-ivory">
          <div className="container-page grid gap-10 py-16 sm:py-20 md:grid-cols-2 lg:grid-cols-3 lg:py-24">
            <div className="lg:col-span-1">
              <SectionHeading tone="light" eyebrow={t("visitEyebrow")} title={t("visitTitle")} text={t("visitText")} />
            </div>
            <div>
              <h3 className="eyebrow text-gold">{tc("hours")}</h3>
              <div className="mt-4"><Hours tone="light" /></div>
            </div>
            <div>
              <h3 className="eyebrow text-gold">{tc("address")}</h3>
              <address className="mt-4 not-italic leading-relaxed text-ivory/85">
                {site.legalName}<br />{site.address.street}<br />{site.address.zip} {site.address.city}
              </address>
              <p className="mt-3"><a href={`tel:${site.phoneHref}`} className="text-ivory/85 hover:text-gold">{site.phone}</a></p>
              <a href={site.googleMaps} target="_blank" rel="noopener" className="btn btn-outline-light mt-6">{tc("readMore")} →</a>
            </div>
          </div>
        </section>

        {/* ---------- Instagram + Book banner ---------- */}
        <Section>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <SectionHeading eyebrow={t("instagramTitle")} title={t("instagramText")} />
              <div className="mt-6 flex gap-3">
                <a href={site.instagram} target="_blank" rel="noopener" className="btn btn-outline">Instagram</a>
                <a href={site.tiktok} target="_blank" rel="noopener" className="btn btn-outline">TikTok</a>
              </div>
            </div>
            <div className="flex flex-col justify-center bg-ivory-2 p-8 shadow-soft sm:p-10">
              <h2 className="display text-[1.75rem] text-navy">{t("bookBannerTitle")}</h2>
              <p className="serif mt-3 text-ink-2">{t("bookBannerText")}</p>
              <Link href="/reservation" className="btn btn-gold mt-8 self-start">{t("heroCta")}</Link>
            </div>
          </div>
        </Section>
      </main>
    </>
  );
}
