import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/Header";
import { PageHero } from "@/components/PageHero";
import { CancelButton } from "@/components/CancelButton";
import { prisma } from "@/lib/prisma";
import { canCancel, formatReservationDate } from "@/lib/booking";
import { site } from "@/data/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "reservation" });
  return { title: t("detail.title"), robots: { index: false, follow: false } };
}

export default async function ReservationDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("reservation");
  const r = await prisma.reservation.findUnique({ where: { cancelToken: id } });
  if (!r) notFound();
  const f = formatReservationDate(r.startsAt, locale);
  const cancellable = r.status !== "CANCELLED" && canCancel(r.startsAt);

  return (
    <>
      <Header />
      <main>
        <PageHero eyebrow="Karahan" title={t("detail.title")} />
        <div className="container-page grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.2fr_1fr]">
          <div className="bg-ivory-2 p-6 shadow-soft sm:p-8">
            <dl className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-3">
              <dt className="text-sm font-semibold text-ink-2">{t("stepDate")}</dt><dd className="font-semibold text-navy">{f.date}</dd>
              <dt className="text-sm font-semibold text-ink-2">{t("stepTime")}</dt><dd className="font-semibold text-navy">{f.time}</dd>
              <dt className="text-sm font-semibold text-ink-2">{t("stepGuests")}</dt><dd className="font-semibold text-navy">{t("guests", { count: r.guests })}</dd>
              <dt className="text-sm font-semibold text-ink-2">{t("name")}</dt><dd>{r.name}</dd>
              {r.notes && (<><dt className="text-sm font-semibold text-ink-2">{t("notes")}</dt><dd className="whitespace-pre-wrap">{r.notes}</dd></>)}
              <dt className="text-sm font-semibold text-ink-2">Status</dt>
              <dd>
                <span className={`inline-block rounded-sm px-2 py-0.5 text-xs font-semibold uppercase tracking-[0.1em] ${r.status === "CANCELLED" ? "bg-ikat text-ivory" : "bg-teal text-ivory"}`}>
                  {t(`status.${r.status}`)}
                </span>
              </dd>
            </dl>
            {r.status === "CANCELLED" && <p className="mt-6 text-ink-2">{t("detail.cancelled")}</p>}
            {r.status !== "CANCELLED" && (
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {cancellable ? <CancelButton token={r.cancelToken} /> : <p className="text-sm text-ink-2">{t("detail.cancelTooLate")} <a href={`tel:${site.phoneHref}`} className="font-semibold text-navy">{site.phone}</a></p>}
              </div>
            )}
          </div>
          <aside>
            <address className="serif not-italic leading-relaxed text-ink">
              {site.legalName}<br />{site.address.street}<br />{site.address.zip} {site.address.city}
            </address>
            <p className="mt-4"><a href={`tel:${site.phoneHref}`} className="text-navy underline decoration-gold underline-offset-4">{site.phone}</a></p>
            <Link href="/" className="btn btn-outline mt-8">Karahan</Link>
          </aside>
        </div>
      </main>
    </>
  );
}
