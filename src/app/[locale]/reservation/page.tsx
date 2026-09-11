import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Header } from "@/components/Header";
import { PageHero } from "@/components/PageHero";
import { BookingForm } from "@/components/BookingForm";
import { Hours } from "@/components/Hours";
import { todayZurich } from "@/lib/booking";
import { site } from "@/data/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("reservationTitle"), description: t("reservationDescription") };
}

export default async function ReservationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("reservation");
  const tc = await getTranslations("common");

  return (
    <>
      <Header />
      <main>
        <PageHero eyebrow="Karahan" title={t("title")} lead={t("intro")} />
        <div className="container-page grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.5fr_1fr]">
          <BookingForm initialDay={todayZurich()} />
          <aside className="space-y-8 lg:pl-4">
            <div>
              <h2 className="eyebrow">{tc("hours")}</h2>
              <div className="mt-3"><Hours /></div>
            </div>
            <div>
              <h2 className="eyebrow">{tc("phone")}</h2>
              <p className="serif mt-3 text-[1.1rem]">
                <a href={`tel:${site.phoneHref}`} className="text-navy underline decoration-gold underline-offset-4">{site.phone}</a>
              </p>
            </div>
            <p className="border-l-2 border-gold pl-4 text-sm text-ink-2">{t("cancelInfo", { hours: site.booking.cancelUntilMinutesBefore / 60 })}</p>
          </aside>
        </div>
      </main>
    </>
  );
}
