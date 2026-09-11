import type { Metadata } from "next";
import Image from "next/image";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { localizedAlternates } from "@/lib/seo";
import { Header } from "@/components/Header";
import { HeroMedia } from "@/components/home/HeroMedia";
import { Embers } from "@/components/home/Embers";
import { Marquee } from "@/components/home/Marquee";
import { Reveal } from "@/components/home/Reveal";
import { SilkRoad } from "@/components/home/SilkRoad";
import { QuickBook } from "@/components/home/QuickBook";
import { Hours } from "@/components/Hours";
import { images } from "@/data/images";
import { site } from "@/data/site";
import { todayZurich } from "@/lib/booking";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { alternates: localizedAlternates("/", locale as Locale) };
}

const chapters = [
  { key: "lagman", uy: "لەغمەن", image: "/images/dishes/lagman.webp", anchor: "teigwaren" },
  { key: "polo", uy: "پولو", image: "/images/dishes/polo.webp", anchor: "reis-und-pfanne" },
  { key: "kebab", uy: "كاۋاپ", image: "/images/dishes/kebab.webp", anchor: "grill" },
  { key: "manti", uy: "مانتا", image: "/images/dishes/manti.webp", anchor: "teigwaren" },
  { key: "tea", uy: "چاي", image: "/images/dishes/tee.webp", anchor: "tee-und-getraenke" },
] as const;

const numerals = ["I", "II", "III", "IV", "V"];

/** Liefert die vorhandenen Varianten (WebM zuerst, dann MP4) eines Videos unter public/videos. */
function videoSources(name: string): string[] | undefined {
  const list = [`${name}.webm`, `${name}.mp4`].filter((f) => existsSync(join(process.cwd(), "public", "videos", f))).map((f) => `/videos/${f}`);
  return list.length ? list : undefined;
}
function posterFor(name: string, fallback: string): string {
  return existsSync(join(process.cwd(), "public", "videos", `${name}-poster.webp`)) ? `/videos/${name}-poster.webp` : fallback;
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const l = locale as Locale;
  const t = await getTranslations("home");
  const tc = await getTranslations("common");
  const tn = await getTranslations("nav");
  const openingDate = new Intl.DateTimeFormat(locale === "de" ? "de-CH" : locale === "tr" ? "tr-TR" : "en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(site.openingDate));
  const heroVideo = videoSources("hero");
  const grillVideo = videoSources("grill");

  const stops = [
    { key: "urumqi", label: t("stops.urumqi"), uy: "ئۈرۈمچى", x: 930, y: 70 },
    { key: "turpan", label: t("stops.turpan"), uy: "تۇرپان", x: 840, y: 150 },
    { key: "kashgar", label: t("stops.kashgar"), uy: "قەشقەر", x: 660, y: 105 },
    { key: "winterthur", label: t("stops.winterthur"), uy: "ۋىنتېرتۇر", x: 110, y: 130 },
  ];

  return (
    <>
      <Header transparent />
      <main className="bg-navy-deep text-ivory">
        {/* ---------- Hero ---------- */}
        <section className="relative isolate min-h-[100svh] overflow-hidden">
          <HeroMedia videoSrc={heroVideo} poster={posterFor("hero", images.kitchenDough.src)} alt={images.kitchenDough.alt[l]} />
          <Embers className="z-[1]" />
          <div className="container-page relative z-[2] flex min-h-[100svh] flex-col justify-end pb-24 pt-32 sm:pb-28">
            <p className="eyebrow text-gold">{t("heroEyebrow")}</p>
            <h1 className="display mt-5 max-w-4xl text-[2.6rem] leading-[1.02] sm:text-[4rem] lg:text-[5.4rem]">
              {t("heroTitle")}
            </h1>
            <div className="mt-7 flex items-center gap-4">
              <span className="hairline w-16" aria-hidden="true" />
              <p className="serif text-[1.15rem] italic text-ivory/85 sm:text-[1.4rem]">{t("heroLine")}</p>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link href="/reservation" className="btn btn-gold">{t("heroCta")}</Link>
              <Link href="/speisekarte" className="btn btn-outline-light">{t("heroSecondary")}</Link>
              <span className="ml-2 text-xs font-semibold uppercase tracking-[0.16em] text-ivory/60">{t("openingSoon", { date: openingDate })}</span>
            </div>
          </div>
          <a href="#karte" className="absolute bottom-6 left-1/2 z-[2] hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-ivory/60 transition hover:text-gold sm:flex" aria-label={t("scroll")}>
            {t("scroll")}
            <span className="drift block h-8 w-px bg-gradient-to-b from-gold to-transparent" aria-hidden="true" />
          </a>
        </section>

        <Marquee />

        {/* ---------- Kapitel: fünf Gerichte ---------- */}
        <section id="karte" className="relative bg-navy py-20 sm:py-28">
          <div className="container-page">
            <Reveal className="max-w-2xl">
              <p className="eyebrow text-gold">{t("chaptersEyebrow")}</p>
              <h2 className="display mt-3 text-[2rem] sm:text-[2.8rem]">{t("chaptersTitle")}</h2>
            </Reveal>
            <ol className="mt-16 space-y-24 sm:mt-24 sm:space-y-32">
              {chapters.map((c, i) => {
                const flip = i % 2 === 1;
                return (
                  <li key={c.key} className={`grid items-center gap-8 lg:grid-cols-12 lg:gap-12 ${flip ? "" : ""}`}>
                    <Reveal as="figure" className={`relative m-0 ${flip ? "lg:col-span-6 lg:col-start-7 lg:order-2" : "lg:col-span-6"}`}>
                      <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/4] lg:aspect-[4/5]">
                        <Image src={c.image} alt={t(`chapters.${c.key}.title`)} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover transition duration-[1400ms] ease-out hover:scale-[1.03]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" aria-hidden="true" />
                      </div>
                      <span className="uyghur pointer-events-none absolute -bottom-6 right-4 select-none text-[4.5rem] leading-none text-gold/90 sm:-bottom-8 sm:text-[6rem]" aria-hidden="true">{c.uy}</span>
                    </Reveal>
                    <Reveal delay={150} className={`${flip ? "lg:col-span-5 lg:col-start-1 lg:order-1" : "lg:col-span-5 lg:col-start-8"}`}>
                      <p className="display text-sm tracking-[0.3em] text-gold">{numerals[i]} <span className="ml-3 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-ivory/60">{t(`chapters.${c.key}.kicker`)}</span></p>
                      <h3 className="display mt-4 text-[2.2rem] sm:text-[3rem]">{t(`chapters.${c.key}.title`)}</h3>
                      <p className="serif mt-5 max-w-md text-[1.1rem] leading-relaxed text-ivory/80">{t(`chapters.${c.key}.text`)}</p>
                      <Link href={{ pathname: "/speisekarte", hash: c.anchor }} className="mt-6 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-gold transition hover:text-gold-3">
                        {t("chapterCta")} <span aria-hidden="true">→</span>
                      </Link>
                    </Reveal>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* ---------- Seidenstrasse ---------- */}
        <section className="relative grain overflow-hidden bg-navy-deep py-20 sm:py-28">
          <div className="container-page">
            <Reveal className="max-w-2xl">
              <p className="eyebrow text-gold">{t("roadEyebrow")}</p>
              <h2 className="display mt-3 text-[2rem] sm:text-[2.8rem]">{t("roadTitle")}</h2>
              <p className="serif mt-5 text-[1.1rem] leading-relaxed text-ivory/80">{t("roadText")}</p>
            </Reveal>
            <div className="mt-12 -mx-4 overflow-x-auto sm:mx-0">
              <div className="min-w-[720px] px-4 sm:min-w-0 sm:px-0">
                <SilkRoad stops={stops} distance={t("roadDistance")} />
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Handwerk ---------- */}
        <section className="relative isolate min-h-[80svh] overflow-hidden">
          <HeroMedia videoSrc={grillVideo} poster={posterFor("grill", images.kitchenGrill.src)} alt={images.kitchenGrill.alt[l]} />
          <div className="container-page relative z-[2] flex min-h-[80svh] flex-col justify-center py-24">
            <Reveal className="max-w-xl">
              <p className="eyebrow text-gold">{t("craftEyebrow")}</p>
              <h2 className="display mt-3 text-[2rem] sm:text-[2.8rem]">{t("craftTitle")}</h2>
              <p className="serif mt-5 text-[1.1rem] leading-relaxed text-ivory/85">{t("craftText")}</p>
            </Reveal>
            <Reveal delay={200} className="mt-12 grid max-w-2xl grid-cols-3 gap-6 border-t border-ivory/15 pt-8">
              {(["1", "2", "3"] as const).map((n) => (
                <div key={n}>
                  <p className="display text-[2rem] leading-none text-gold sm:text-[2.6rem]">{t(`craftFacts.${n}.n`)}</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-ivory/65">{t(`craftFacts.${n}.t`)}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ---------- Das Lokal ---------- */}
        <section className="bg-navy py-20 sm:py-28">
          <div className="container-page grid gap-12 lg:grid-cols-12 lg:items-center">
            <Reveal className="lg:col-span-4">
              <p className="eyebrow text-gold">{t("roomEyebrow")}</p>
              <h2 className="display mt-3 text-[2rem] sm:text-[2.6rem]">{t("roomTitle")}</h2>
              <p className="serif mt-5 text-[1.1rem] leading-relaxed text-ivory/80">{t("roomText")}</p>
              <Link href="/ueber-uns" className="btn btn-outline-light mt-8">{t("roomCta")}</Link>
            </Reveal>
            <div className="grid grid-cols-12 gap-3 lg:col-span-8">
              <Reveal as="figure" className="relative col-span-7 m-0 aspect-[4/3] overflow-hidden">
                <Image src={images.interior.src} alt={images.interior.alt[l]} fill sizes="(min-width:1024px) 40vw, 60vw" className="object-cover" />
              </Reveal>
              <Reveal as="figure" delay={120} className="relative col-span-5 m-0 mt-10 aspect-[3/4] overflow-hidden">
                <Image src={images.columns.src} alt={images.columns.alt[l]} fill sizes="(min-width:1024px) 25vw, 40vw" className="object-cover" />
              </Reveal>
              <Reveal as="figure" delay={240} className="relative col-span-8 col-start-3 m-0 -mt-6 aspect-[16/9] overflow-hidden">
                <Image src={images.shelf.src} alt={images.shelf.alt[l]} fill sizes="(min-width:1024px) 40vw, 70vw" className="object-cover" />
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------- Reservation ---------- */}
        <section className="relative grain overflow-hidden bg-navy-deep py-20 sm:py-28">
          <div className="container-page grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <p className="eyebrow text-gold">{t("bookEyebrow")}</p>
              <h2 className="display mt-3 text-[2.4rem] sm:text-[3.4rem]">{t("bookTitle")}</h2>
              <p className="serif mt-5 max-w-lg text-[1.1rem] leading-relaxed text-ivory/80">{t("bookText")}</p>
              <div className="mt-10 max-w-xl border border-gold/30 p-6 sm:p-8">
                <QuickBook initialDay={todayZurich()} />
              </div>
            </Reveal>
            <Reveal delay={150} className="lg:col-span-4 lg:col-start-9">
              <h3 className="eyebrow text-gold">{tc("hours")}</h3>
              <div className="mt-4"><Hours tone="light" /></div>
              <address className="mt-8 not-italic leading-relaxed text-ivory/80">
                {site.legalName}<br />{site.address.street}<br />{site.address.zip} {site.address.city}
              </address>
              <p className="mt-3"><a href={`tel:${site.phoneHref}`} className="text-ivory hover:text-gold">{site.phone}</a></p>
              <div className="mt-10 border-t border-ivory/15 pt-8">
                <h3 className="display text-xl">{t("sharingTitle")}</h3>
                <p className="serif mt-3 text-ivory/75">{t("sharingText")}</p>
                <Link href="/gruppen-und-events" className="mt-4 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-gold hover:text-gold-3">{t("sharingCta")} <span aria-hidden="true">→</span></Link>
              </div>
            </Reveal>
          </div>
        </section>
        <span className="sr-only">{tn("home")}</span>
      </main>
    </>
  );
}
