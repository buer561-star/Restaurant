import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing, type AppPathname, type Locale } from "@/i18n/routing";

type PublicPath = Exclude<AppPathname, "/reservation/[id]" | "/admin">;

/** Canonical + hreflang-Alternates für eine Seite in allen Sprachen. */
export function localizedAlternates(href: PublicPath, locale: Locale): NonNullable<Metadata["alternates"]> {
  const languages = Object.fromEntries(routing.locales.map((l) => [l, getPathname({ href, locale: l })]));
  return {
    canonical: getPathname({ href, locale }),
    languages: { ...languages, "x-default": languages[routing.defaultLocale] },
  };
}
