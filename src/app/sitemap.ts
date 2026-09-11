import type { MetadataRoute } from "next";
import { routing, type AppPathname } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { site } from "@/data/site";

type PublicPath = Exclude<AppPathname, "/reservation/[id]" | "/admin">;
const publicPages: PublicPath[] = ["/", "/speisekarte", "/reservation", "/ueber-uns", "/gruppen-und-events", "/galerie", "/kontakt", "/impressum", "/datenschutz"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? site.domain).replace(/\/$/, "");
  return publicPages.map((href) => {
    const languages = Object.fromEntries(
      routing.locales.map((locale) => [locale, base + getPathname({ href, locale })])
    );
    return {
      url: base + getPathname({ href, locale: routing.defaultLocale }),
      lastModified: new Date(),
      changeFrequency: href === "/" || href === "/speisekarte" ? "weekly" : "monthly",
      priority: href === "/" ? 1 : href === "/speisekarte" || href === "/reservation" ? 0.9 : 0.6,
      alternates: { languages: { ...languages, "x-default": languages.de } },
    };
  });
}
