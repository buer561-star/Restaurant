import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { localizedAlternates } from "@/lib/seo";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/Header";
import { PageHero } from "@/components/PageHero";
import { Section, SectionHeading } from "@/components/Section";
import { PlaceholderBadge } from "@/components/PlaceholderBadge";
import { images } from "@/data/images";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("aboutTitle"), description: t("aboutDescription"), alternates: localizedAlternates("/ueber-uns", locale as Locale) };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const l = locale as Locale;
  const t = await getTranslations("about");
  const tn = await getTranslations("nav");
  const th = await getTranslations("home");

  return (
    <>
      <Header />
      <main>
        <PageHero eyebrow="Karahan" title={t("title")} lead={t("lead")} />

        <Section>
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <SectionHeading eyebrow={t("whyEyebrow")} title={t("whyTitle")} />
              <p className="serif mt-6 text-[1.05rem] leading-relaxed text-ink-2">{t("whyText1")}</p>
              <p className="serif mt-4 text-[1.05rem] leading-relaxed text-ink-2">{t("whyText2")}</p>
            </div>
            <div className="relative aspect-[3/4] max-h-[620px] overflow-hidden shadow-lift lg:justify-self-end lg:w-[440px]">
              <Image src={images.entrance.src} alt={images.entrance.alt[l]} fill sizes="(min-width:1024px) 440px, 100vw" className="object-cover" />
            </div>
          </div>
        </Section>

        <section className="bg-navy text-ivory">
          <div className="container-page py-16 sm:py-20 lg:py-24">
            <SectionHeading tone="light" eyebrow={t("cuisineEyebrow")} title={t("cuisineTitle")} />
            <ol className="mt-10 grid gap-px bg-ivory/10 sm:grid-cols-2">
              {(["1", "2", "3", "4"] as const).map((n) => (
                <li key={n} className="bg-navy p-6 sm:p-8">
                  <span className="display text-3xl text-gold">{n}</span>
                  <h3 className="display mt-3 text-xl">{t(`cuisinePoints.${n}.title`)}</h3>
                  <p className="serif mt-2 leading-relaxed text-ivory/75">{t(`cuisinePoints.${n}.text`)}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <Section>
          <SectionHeading eyebrow={t("placesEyebrow")} title={t("placesTitle")} />
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-start">
            <div className="relative aspect-[4/3] overflow-hidden shadow-lift">
              <Image src={images.shelf.src} alt={images.shelf.alt[l]} fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
            </div>
            <dl className="divide-y divide-line">
              {(["kashgar", "urumqi", "turpan"] as const).map((p) => (
                <div key={p} className="py-5 first:pt-0">
                  <dt className="display text-xl text-navy">{t(`places.${p}.title`)}</dt>
                  <dd className="serif mt-2 leading-relaxed text-ink-2">{t(`places.${p}.text`)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Section>

        <section className="bg-sand">
          <div className="container-page py-16 sm:py-20">
            <SectionHeading eyebrow={t("teamEyebrow")} title={t("teamTitle")} text={t("teamText")} />
          </div>
        </section>

        <Section>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="relative aspect-[16/10] overflow-hidden shadow-lift">
              <Image src={images.kitchenGrill.src} alt={images.kitchenGrill.alt[l]} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
              {images.kitchenGrill.placeholder && <PlaceholderBadge />}
            </div>
            <div>
              <SectionHeading eyebrow="Karahan" title={th("bookBannerTitle")} text={th("bookBannerText")} />
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/reservation" className="btn btn-gold">{tn("book")}</Link>
                <Link href="/speisekarte" className="btn btn-outline">{tn("menu")}</Link>
              </div>
            </div>
          </div>
        </Section>
      </main>
    </>
  );
}
