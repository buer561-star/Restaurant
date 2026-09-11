/**
 * Bild-Manifest. `placeholder: true` bedeutet: AI-generiertes Bild, das durch ein echtes Foto ersetzt werden soll.
 * Zum Ersetzen: Datei unter public/images/... mit gleichem Namen überschreiben und `placeholder` auf false setzen.
 */
export type SiteImage = {
  src: string;
  alt: Record<"de" | "en" | "tr", string>;
  width: number;
  height: number;
  placeholder: boolean;
};

export const images = {
  interior: {
    src: "/images/interior/innenraum.webp",
    alt: { de: "Gastraum des Karahan mit Sitzbänken, Ikat-Läufern und Bildern aus Kaşgar", en: "Karahan dining room with banquettes, ikat runners and pictures of Kashgar", tr: "Karahan yemek salonu, ikat örtüler ve Kaşgar fotoğrafları" },
    width: 1600, height: 1200, placeholder: false,
  },
  columns: {
    src: "/images/interior/saeulen.webp",
    alt: { de: "Säulen mit Ikat-Stoffen und uigurischen Doppa-Hüten", en: "Columns with ikat fabrics and Uyghur doppa hats", tr: "İkat kumaşlı ve Uygur doppa şapkalı sütunlar" },
    width: 1200, height: 1600, placeholder: false,
  },
  shelf: {
    src: "/images/interior/regal.webp",
    alt: { de: "Regal mit Gläsern, Keramik und Bildern von Ürümçi und Turfan", en: "Shelf with glassware, ceramics and pictures of Ürümqi and Turpan", tr: "Bardaklar, seramikler ve Ürümçi, Turfan fotoğraflarıyla raf" },
    width: 1600, height: 1200, placeholder: false,
  },
  entrance: {
    src: "/images/interior/eingang.webp",
    alt: { de: "Eingang des Karahan Uigur Restaurant", en: "Entrance of Karahan Uyghur Restaurant", tr: "Karahan Uygur Restoranı girişi" },
    width: 1200, height: 1603, placeholder: false,
  },
  table: {
    src: "/images/interior/tisch.webp",
    alt: { de: "Gedeckter Tisch mit Polo, Dapanji, Manti und Göşnan", en: "Table set with polo, dapanji, manti and göshnan", tr: "Polo, dapanji, mantı ve göşnanlı sofra" },
    width: 1000, height: 1396, placeholder: false,
  },
  kitchenDough: {
    src: "/images/kitchen/kueche-teig.webp",
    alt: { de: "Hände ziehen Lagman-Nudeln aus frischem Teig", en: "Hands pulling laghman noodles from fresh dough", tr: "Taze hamurdan lagman çeken eller" },
    width: 1600, height: 893, placeholder: true,
  },
  kitchenGrill: {
    src: "/images/kitchen/kueche-grill.webp",
    alt: { de: "Lammspiesse über Holzkohle", en: "Lamb skewers over charcoal", tr: "Kömür ateşinde kuzu şiş" },
    width: 1600, height: 893, placeholder: true,
  },
} satisfies Record<string, SiteImage>;

/** Alle Gerichtsbilder unter /images/dishes sind AI-Platzhalter. */
export const DISH_IMAGES_ARE_PLACEHOLDERS = true;

/** Sichtbares «Beispielbild»-Badge auf der Seite. Für den öffentlichen Auftritt aus; die Markierung bleibt im Manifest. */
export const SHOW_PLACEHOLDER_BADGES = false;
