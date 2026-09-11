import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Cinzel, Figtree, Noto_Naskh_Arabic, Source_Serif_4 } from "next/font/google";
import { routing, type Locale } from "@/i18n/routing";
import { Footer } from "@/components/Footer";
import { StickyCta } from "@/components/StickyCta";
import { site } from "@/data/site";
import { RestaurantJsonLd } from "@/components/JsonLd";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-cinzel", display: "swap" });
const sourceSerif = Source_Serif_4({ subsets: ["latin", "latin-ext"], weight: ["400", "600"], style: ["normal", "italic"], variable: "--font-source-serif", display: "swap" });
const notoArabic = Noto_Naskh_Arabic({ subsets: ["arabic"], weight: ["400", "600"], variable: "--font-arabic", display: "swap" });
const figtree = Figtree({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "600", "700"], variable: "--font-figtree", display: "swap" });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? site.domain),
    title: { default: t("title"), template: `%s · ${site.name}` },
    description: t("description"),
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: locale === "de" ? "de_CH" : locale === "tr" ? "tr_TR" : "en_GB",
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
    icons: { icon: "/icon.svg" },
  };
}

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale as Locale);

  return (
    <html lang={locale} className={`${cinzel.variable} ${sourceSerif.variable} ${figtree.variable} ${notoArabic.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <RestaurantJsonLd locale={locale as Locale} />
        <NextIntlClientProvider>
          {children}
          <Footer />
          <StickyCta />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
