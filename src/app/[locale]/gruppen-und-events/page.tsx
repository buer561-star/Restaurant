import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Header } from "@/components/Header";
import { PageHero } from "@/components/PageHero";
import { Section, SectionHeading } from "@/components/Section";
import { EventForm } from "@/components/EventForm";
import { PlaceholderBadge } from "@/components/PlaceholderBadge";
import { images, DISH_IMAGES_ARE_PLACEHOLDERS } from "@/data/images";
import { site } from "@/data/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("eventsTitle"), description: t("eventsDescription") };
}

const MIN_GROUP = site.booking.maxGuestsOnline + 1;

export default async function EventsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const l = locale as Locale;
  const t = await getTranslations("events");

  return (
    <>
      <Header />
      <main>
        <PageHero eyebrow="Karahan" title={t("title")} lead={t("lead", { min: MIN_GROUP })} />
        <Section>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
            <div className="grid grid-cols-2 gap-3">
              <div className="relative aspect-[3/4] overflow-hidden shadow-lift">
                <Image src={images.table.src} alt={images.table.alt[l]} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover" />
              </div>
              <div className="relative mt-8 aspect-[3/4] overflow-hidden shadow-lift">
                <Image src="/images/dishes/dapanji.webp" alt="Dapanji" fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover" />
                {DISH_IMAGES_ARE_PLACEHOLDERS && <PlaceholderBadge />}
              </div>
            </div>
            <div>
              <SectionHeading eyebrow={t("offerEyebrow")} title={t("title")} />
              <dl className="mt-8 divide-y divide-line">
                {(["1", "2", "3"] as const).map((n) => (
                  <div key={n} className="py-5 first:pt-0">
                    <dt className="display text-xl text-navy">{t(`offers.${n}.title`)}</dt>
                    <dd className="serif mt-2 leading-relaxed text-ink-2">{t(`offers.${n}.text`, { min: MIN_GROUP, seats: site.booking.seatsTotal })}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Section>
        <section className="bg-sand">
          <div className="container-page grid gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_1.4fr]">
            <SectionHeading eyebrow="Karahan" title={t("formTitle")} text={t("formText")} />
            <EventForm />
          </div>
        </section>
      </main>
    </>
  );
}
