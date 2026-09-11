import { defineRouting } from "next-intl/routing";

export const locales = ["de", "en", "tr"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "de",
  localePrefix: "as-needed",
  localeDetection: false,
  pathnames: {
    "/": "/",
    "/speisekarte": { de: "/speisekarte", en: "/menu", tr: "/menu" },
    "/reservation": { de: "/reservation", en: "/reservations", tr: "/rezervasyon" },
    "/reservation/[id]": {
      de: "/reservation/[id]",
      en: "/reservations/[id]",
      tr: "/rezervasyon/[id]",
    },
    "/ueber-uns": { de: "/ueber-uns", en: "/about", tr: "/hakkimizda" },
    "/gruppen-und-events": {
      de: "/gruppen-und-events",
      en: "/groups-and-events",
      tr: "/gruplar-ve-etkinlikler",
    },
    "/galerie": { de: "/galerie", en: "/gallery", tr: "/galeri" },
    "/kontakt": { de: "/kontakt", en: "/contact", tr: "/iletisim" },
    "/impressum": { de: "/impressum", en: "/imprint", tr: "/kunye" },
    "/datenschutz": { de: "/datenschutz", en: "/privacy", tr: "/gizlilik" },
    "/admin": "/admin",
  },
});

export type AppPathname = keyof typeof routing.pathnames;
