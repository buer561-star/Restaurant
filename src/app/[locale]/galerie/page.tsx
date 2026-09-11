import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Header } from "@/components/Header";
import { PageHero } from "@/components/PageHero";
import { PlaceholderBadge } from "@/components/PlaceholderBadge";
import { images, DISH_IMAGES_ARE_PLACEHOLDERS } from "@/data/images";
import { menu } from "@/data/menu";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("galleryTitle"), description: t("galleryDescription") };
}

export default async function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const l = locale as Locale;
  const t = await getTranslations("gallery");

  const interior = [images.interior, images.columns, images.shelf, images.entrance, images.table];
  const kitchen = [images.kitchenDough, images.kitchenGrill];
  const dishes = menu.flatMap((s) => s.items).filter((i) => i.image);

  return (
    <>
      <Header />
      <main>
        <PageHero eyebrow="Karahan" title={t("title")} lead={t("lead")} />
        <div className="container-page space-y-16 py-12 sm:py-16">
          <section>
            <h2 className="display border-b-2 border-gold pb-3 text-[1.6rem] text-navy">{t("sections.interior")}</h2>
            <div className="mt-6 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid">
              {interior.map((img) => (
                <figure key={img.src} className="relative overflow-hidden shadow-soft">
                  <Image src={img.src} alt={img.alt[l]} width={img.width} height={img.height} sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="h-auto w-full" />
                  {img.placeholder && <PlaceholderBadge />}
                  <figcaption className="sr-only">{img.alt[l]}</figcaption>
                </figure>
              ))}
            </div>
          </section>
          <section>
            <h2 className="display border-b-2 border-gold pb-3 text-[1.6rem] text-navy">{t("sections.kitchen")}</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {kitchen.map((img) => (
                <figure key={img.src} className="relative aspect-[16/9] overflow-hidden shadow-soft">
                  <Image src={img.src} alt={img.alt[l]} fill sizes="(min-width:640px) 50vw, 100vw" className="object-cover" />
                  {img.placeholder && <PlaceholderBadge />}
                </figure>
              ))}
            </div>
          </section>
          <section>
            <h2 className="display border-b-2 border-gold pb-3 text-[1.6rem] text-navy">{t("sections.dishes")}</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
              {dishes.map((d) => (
                <figure key={d.id} className="relative aspect-[4/3] overflow-hidden shadow-soft">
                  <Image src={d.image!} alt={d.name[l]} fill sizes="(min-width:1024px) 33vw, 50vw" className="object-cover" />
                  {DISH_IMAGES_ARE_PLACEHOLDERS && <PlaceholderBadge />}
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/80 to-transparent px-3 pb-2 pt-8 text-sm font-semibold text-ivory">{d.name[l]}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
