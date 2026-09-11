import { site } from "@/data/site";
import { menu } from "@/data/menu";
import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function base() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? site.domain).replace(/\/$/, "");
}

/** schema.org Restaurant + Menu, in jede Seite eingebettet. */
export function RestaurantJsonLd({ locale }: { locale: Locale }) {
  const url = base();
  const openingHoursSpecification = Object.entries(site.hours).flatMap(([wd, ivs]) =>
    ivs.map((iv) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: DAYS[Number(wd)], opens: iv.open, closes: iv.close }))
  );
  const data = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${url}/#restaurant`,
    name: site.legalName,
    url,
    image: [`${url}/images/interior/innenraum.webp`, `${url}/images/interior/eingang.webp`],
    logo: `${url}/images/logo-raster.webp`,
    telephone: site.phone,
    email: site.email,
    servesCuisine: ["Uyghur", "Central Asian", "Halal"],
    priceRange: "CHF 20–50",
    acceptsReservations: "True",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      postalCode: site.address.zip,
      addressLocality: site.address.city,
      addressCountry: site.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: site.address.lat, longitude: site.address.lng },
    openingHoursSpecification,
    sameAs: [site.instagram, site.tiktok, site.facebook],
    hasMenu: {
      "@type": "Menu",
      name: locale === "de" ? "Speisekarte" : locale === "tr" ? "Menü" : "Menu",
      url: url + getPathname({ href: "/speisekarte", locale }),
      hasMenuSection: menu.map((s) => ({
        "@type": "MenuSection",
        name: s.title[locale],
        hasMenuItem: s.items.map((i) => ({
          "@type": "MenuItem",
          name: i.name[locale],
          description: i.description[locale] || undefined,
          image: i.image ? url + i.image : undefined,
          offers: { "@type": "Offer", price: i.price.toFixed(2), priceCurrency: "CHF" },
          suitableForDiet: i.tags?.includes("vegan") ? "https://schema.org/VeganDiet" : i.tags?.includes("vegetarian") ? "https://schema.org/VegetarianDiet" : "https://schema.org/HalalDiet",
        })),
      })),
    },
    potentialAction: {
      "@type": "ReserveAction",
      target: { "@type": "EntryPoint", urlTemplate: url + getPathname({ href: "/reservation", locale }), inLanguage: locale, actionPlatform: ["https://schema.org/DesktopWebPlatform", "https://schema.org/MobileWebPlatform"] },
      result: { "@type": "FoodEstablishmentReservation", name: "Tischreservation" },
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
