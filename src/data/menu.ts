import type { Locale } from "@/i18n/routing";

export type Tag = "vegetarian" | "vegan" | "spicy" | "signature" | "sharing" | "handmade";
export type Allergen = "gluten" | "egg" | "milk" | "sesame" | "soy" | "nuts";

export type MenuItem = {
  id: string;
  name: Record<Locale, string>;
  /** Uigurischer Originalname in Lateinschrift, wird klein unter dem Namen gezeigt */
  original?: string;
  description: Record<Locale, string>;
  /** CHF. PLACEHOLDER: alle Preise sind Schätzungen, vor Livegang ersetzen. */
  price: number;
  tags?: Tag[];
  allergens?: Allergen[];
  /** Pfad unter /public. Alle Gerichtsbilder sind AI-Platzhalter, siehe src/data/images.ts */
  image?: string;
};

export type MenuSection = {
  id: string;
  title: Record<Locale, string>;
  intro?: Record<Locale, string>;
  items: MenuItem[];
};

export const PRICES_ARE_PLACEHOLDERS = true;

export const menu: MenuSection[] = [
  {
    id: "vorspeisen",
    title: { de: "Vorspeisen & Salate", en: "Starters & Salads", tr: "Başlangıçlar & Salatalar" },
    items: [
      {
        id: "samsa",
        name: { de: "Samsa", en: "Samsa", tr: "Uygur Samsa" },
        original: "Samsa",
        description: {
          de: "Knusprige Teigtaschen aus dem Ofen, gefüllt mit Lammfleisch und Zwiebeln, mit Schwarzkümmel. 2 Stück.",
          en: "Crisp oven-baked pastries filled with lamb and onion, topped with nigella seeds. 2 pieces.",
          tr: "Fırında pişmiş çıtır hamur, kuzu eti ve soğan dolgulu, çörek otlu. 2 adet.",
        },
        price: 9.5,
        tags: ["handmade", "signature"],
        allergens: ["gluten"],
        image: "/images/dishes/samsa.webp",
      },
      {
        id: "gurkensalat",
        name: { de: "Gurkensalat mit Knoblauch und Chili", en: "Smashed cucumber salad", tr: "Sarımsaklı acılı salatalık" },
        original: "Tërsik",
        description: {
          de: "Zerdrückte Gurken, Knoblauch, Chiliöl und Reisessig. Frisch und scharf.",
          en: "Smashed cucumber, garlic, chili oil and rice vinegar. Fresh and hot.",
          tr: "Ezilmiş salatalık, sarımsak, acı yağ ve pirinç sirkesi. Taze ve acı.",
        },
        price: 8.5,
        tags: ["vegan", "spicy"],
        allergens: ["sesame", "soy"],
        image: "/images/dishes/salate.webp",
      },
      {
        id: "kichererbsensalat",
        name: { de: "Kichererbsen-Karotten-Salat", en: "Chickpea and carrot salad", tr: "Nohutlu havuç salatası" },
        description: {
          de: "Kichererbsen, Karottenstreifen, Koriander und Zitrone.",
          en: "Chickpeas, shredded carrot, coriander and lemon.",
          tr: "Nohut, rendelenmiş havuç, kişniş ve limon.",
        },
        price: 8.0,
        tags: ["vegan"],
      },
      {
        id: "gemuesesalat",
        name: { de: "Uigurischer Gemüsesalat", en: "Uyghur garden salad", tr: "Uygur salatası" },
        description: {
          de: "Tomaten, Gurken, Zwiebeln, Peperoni, Koriander, leichtes Essig-Dressing.",
          en: "Tomato, cucumber, onion, peppers, coriander, light vinegar dressing.",
          tr: "Domates, salatalık, soğan, biber, kişniş, hafif sirkeli sos.",
        },
        price: 8.0,
        tags: ["vegan"],
      },
    ],
  },
  {
    id: "teigwaren",
    title: { de: "Handgemachte Teigwaren", en: "Handmade Noodles & Dumplings", tr: "El Yapımı Hamur İşleri" },
    intro: {
      de: "Unser Teig wird jeden Tag frisch geknetet. Lagman wird von Hand gezogen, Manti und Çüçüre von Hand gefaltet.",
      en: "Our dough is kneaded fresh every day. Laghman is hand-pulled, manti and chüchüre are hand-folded.",
      tr: "Hamurumuz her gün taze yoğrulur. Lagman elde çekilir, mantı ve çüçüre elde kapatılır.",
    },
    items: [
      {
        id: "lagman",
        name: { de: "Lagman", en: "Laghman", tr: "Uygur Lagmanı" },
        original: "Leghmen",
        description: {
          de: "Handgezogene Nudeln mit Lamm, Peperoni, Tomaten, Sellerie und Zwiebeln in kräftiger Sauce. Das Herz der uigurischen Küche.",
          en: "Hand-pulled noodles with lamb, peppers, tomato, celery and onion in a rich sauce. The heart of Uyghur cooking.",
          tr: "El çekmesi erişte, kuzu eti, biber, domates, kereviz ve soğanlı kavurma ile. Uygur mutfağının kalbi.",
        },
        price: 24.5,
        tags: ["signature", "handmade"],
        allergens: ["gluten"],
        image: "/images/dishes/lagman.webp",
      },
      {
        id: "lagman-kavurma",
        name: { de: "Gebratener Lagman", en: "Fried Laghman", tr: "Lagman Kavurması" },
        original: "Qoruma Leghmen",
        description: {
          de: "Handgezogene Nudeln im Wok gebraten, mit Rindfleisch, Peperoni, Knoblauchschnittlauch. Leicht scharf.",
          en: "Hand-pulled noodles stir-fried in the wok with beef, peppers and garlic chives. Mildly spicy.",
          tr: "El çekmesi erişte wokta kavrulmuş, dana eti, biber ve sarımsaklı frenk soğanı ile. Hafif acı.",
        },
        price: 25.5,
        tags: ["handmade", "spicy"],
        allergens: ["gluten", "soy"],
        image: "/images/dishes/lagman-kavurma.webp",
      },
      {
        id: "manti",
        name: { de: "Manti", en: "Manti", tr: "Uygur Mantısı" },
        original: "Manta",
        description: {
          de: "Grosse gedämpfte Teigtaschen mit Lamm und Zwiebeln, dazu Joghurt und Tomatensalat. 6 Stück.",
          en: "Large steamed dumplings filled with lamb and onion, served with yogurt and tomato salad. 6 pieces.",
          tr: "Kuzu eti ve soğan dolgulu büyük buharda mantı, yoğurt ve domates salatası ile. 6 adet.",
        },
        price: 23.0,
        tags: ["handmade"],
        allergens: ["gluten", "milk"],
        image: "/images/dishes/manti.webp",
      },
      {
        id: "chuchure",
        name: { de: "Çüçüre in Brühe", en: "Chüchüre soup dumplings", tr: "Çüçüre Çorbası" },
        original: "Chöchürä",
        description: {
          de: "Kleine handgefaltete Teigtaschen in klarer Lammbrühe mit Tomate und Koriander.",
          en: "Small hand-folded dumplings in clear lamb broth with tomato and coriander.",
          tr: "Küçük el yapımı hamur bohçaları, domates ve kişnişli berrak kuzu suyunda.",
        },
        price: 19.5,
        tags: ["handmade"],
        allergens: ["gluten"],
        image: "/images/dishes/chuchure-suppe.webp",
      },
      {
        id: "goshnan",
        name: { de: "Göşnan", en: "Göshnan", tr: "Göşnan – Etli Ekmek" },
        original: "Göshnan",
        description: {
          de: "Fladenbrot aus der Pfanne, gefüllt mit Lammhack und Zwiebeln. In Stücke geschnitten, ideal zum Teilen.",
          en: "Pan-fried flatbread stuffed with minced lamb and onion. Cut in wedges, ideal for sharing.",
          tr: "Kıymalı ve soğanlı tavada pişmiş etli ekmek. Dilimlenmiş, paylaşmak için ideal.",
        },
        price: 18.0,
        tags: ["handmade", "sharing"],
        allergens: ["gluten"],
        image: "/images/dishes/goshnan.webp",
      },
    ],
  },
  {
    id: "grill",
    title: { de: "Vom Grill", en: "From the Grill", tr: "Izgaradan" },
    items: [
      {
        id: "kebab-lamm",
        name: { de: "Şiş Kebab Lamm", en: "Lamb shish kebab", tr: "Kuzu Şiş Kebap" },
        original: "Kawap",
        description: {
          de: "Lammwürfel über Holzkohle, mit Kreuzkümmel und Chili. 3 Spiesse mit Fladenbrot und Zwiebeln.",
          en: "Cubed lamb over charcoal with cumin and chili. 3 skewers with flatbread and onion.",
          tr: "Kömür ateşinde kuzu kuşbaşı, kimyon ve pul biberli. 3 şiş, lavaş ve soğan ile.",
        },
        price: 26.0,
        tags: ["signature"],
        allergens: ["gluten"],
        image: "/images/dishes/kebab.webp",
      },
      {
        id: "kebab-huhn",
        name: { de: "Şiş Kebab Poulet", en: "Chicken shish kebab", tr: "Tavuk Şiş Kebap" },
        description: {
          de: "Marinierte Pouletstücke vom Grill, 3 Spiesse mit Fladenbrot.",
          en: "Marinated grilled chicken, 3 skewers with flatbread.",
          tr: "Marine edilmiş tavuk ızgara, 3 şiş, lavaş ile.",
        },
        price: 23.0,
        allergens: ["gluten"],
      },
      {
        id: "grillplatte",
        name: { de: "Grillplatte für zwei", en: "Mixed grill for two", tr: "İki kişilik ızgara tabağı" },
        description: {
          de: "Lamm- und Pouletspiesse, Samsa, Fladenbrot, zwei Salate.",
          en: "Lamb and chicken skewers, samsa, flatbread, two salads.",
          tr: "Kuzu ve tavuk şiş, samsa, lavaş, iki salata.",
        },
        price: 58.0,
        tags: ["sharing"],
        allergens: ["gluten"],
      },
    ],
  },
  {
    id: "reis-und-pfanne",
    title: { de: "Reis & Pfanne", en: "Rice & Wok", tr: "Pilav & Tava" },
    items: [
      {
        id: "polo",
        name: { de: "Polo – Uigurischer Pilaw", en: "Polo – Uyghur pilaf", tr: "Uygur Polosu" },
        original: "Polu",
        description: {
          de: "Reis mit Lamm, Karotten, Zwiebeln und Rosinen, langsam im Kessel gegart. Dazu Gemüsesalat.",
          en: "Rice with lamb, carrot, onion and raisins, slowly cooked in the kazan. Served with salad.",
          tr: "Kazanda ağır ağır pişen kuzulu, havuçlu, soğanlı ve kuru üzümlü pilav. Salata ile.",
        },
        price: 24.0,
        tags: ["signature"],
        image: "/images/dishes/polo.webp",
      },
      {
        id: "dapanji",
        name: { de: "Dapanji – Grosser Teller Poulet", en: "Dapanji – Big plate chicken", tr: "Dapanji – Büyük Tabak Tavuk" },
        original: "Chong Texse Toxu Qorumisi",
        description: {
          de: "Poulet, Kartoffeln und Peperoni in würziger Chili-Sternanis-Sauce auf breiten Bandnudeln. Zum Teilen für 2 bis 3 Personen.",
          en: "Chicken, potatoes and peppers in a spiced chili and star anise sauce over wide noodle belts. Shared by 2 to 3 people.",
          tr: "Tavuk, patates ve biber, baharatlı acılı sos içinde geniş erişte üzerinde. 2–3 kişilik, paylaşmak için.",
        },
        price: 52.0,
        tags: ["sharing", "spicy", "signature"],
        allergens: ["gluten"],
        image: "/images/dishes/dapanji.webp",
      },
      {
        id: "etli-biber",
        name: { de: "Rindfleisch mit grünen Peperoni", en: "Beef with green peppers", tr: "Etli Biber Kavurması" },
        description: {
          de: "Rindsstreifen mit grünen Peperoni und Zwiebeln, kurz im Wok gebraten. Mit Reis.",
          en: "Beef strips with green peppers and onion, flash-fried in the wok. With rice.",
          tr: "Dana eti şeritleri, yeşil biber ve soğan, wokta kısa kavrulmuş. Pilav ile.",
        },
        price: 25.0,
        allergens: ["soy"],
        image: "/images/dishes/etli-biber.webp",
      },
      {
        id: "tofu",
        name: { de: "Tofu in Chili-Knoblauch-Sauce", en: "Tofu in chili garlic sauce", tr: "Acı Sarımsaklı Tofu" },
        description: {
          de: "Geschmorter Tofu mit Frühlingszwiebeln, dazu Reis. Vegan.",
          en: "Braised tofu with spring onion, served with rice. Vegan.",
          tr: "Yeşil soğanlı tofu güveç, pilav ile. Vegan.",
        },
        price: 21.0,
        tags: ["vegan", "spicy"],
        allergens: ["soy"],
        image: "/images/dishes/tofu.webp",
      },
    ],
  },
  {
    id: "vegetarisch",
    title: { de: "Vegetarisch", en: "Vegetarian", tr: "Vejetaryen" },
    intro: {
      de: "Fast jedes Nudelgericht gibt es auch ohne Fleisch. Fragen Sie uns.",
      en: "Almost every noodle dish is available without meat. Just ask.",
      tr: "Hemen her erişte yemeğinin etsiz hali vardır. Sorun yeter.",
    },
    items: [
      {
        id: "gemuese-lagman",
        name: { de: "Gemüse-Lagman", en: "Vegetable laghman", tr: "Sebzeli Lagman" },
        description: {
          de: "Handgezogene Nudeln mit Saisongemüse, Tomaten und Peperoni.",
          en: "Hand-pulled noodles with seasonal vegetables, tomato and peppers.",
          tr: "El çekmesi erişte, mevsim sebzeleri, domates ve biber ile.",
        },
        price: 21.0,
        tags: ["vegan", "handmade"],
        allergens: ["gluten"],
      },
      {
        id: "gemuese-manti",
        name: { de: "Kürbis-Manti", en: "Pumpkin manti", tr: "Kabaklı Mantı" },
        description: {
          de: "Gedämpfte Teigtaschen mit Kürbis und Zwiebeln, dazu Joghurt. 6 Stück.",
          en: "Steamed dumplings with pumpkin and onion, served with yogurt. 6 pieces.",
          tr: "Kabak ve soğan dolgulu buharda mantı, yoğurt ile. 6 adet.",
        },
        price: 20.0,
        tags: ["vegetarian", "handmade"],
        allergens: ["gluten", "milk"],
      },
    ],
  },
  {
    id: "tee-und-getraenke",
    title: { de: "Tee & Getränke", en: "Tea & Drinks", tr: "Çay & İçecekler" },
    items: [
      {
        id: "kraeutertee",
        name: { de: "Uigurischer Kräutertee", en: "Uyghur herbal tea", tr: "Uygur Şifalı Bitki Çayı" },
        original: "Dora Chay",
        description: {
          de: "Safran, Rosenknospen, Kardamom, Goji und Minze. Kanne für 2 Personen.",
          en: "Saffron, rose buds, cardamom, goji and mint. Pot for 2.",
          tr: "Safran, gül goncası, kakule, goji ve nane. 2 kişilik demlik.",
        },
        price: 12.0,
        tags: ["signature"],
        image: "/images/dishes/tee.webp",
      },
      {
        id: "schwarztee",
        name: { de: "Schwarztee mit Milch", en: "Black tea with milk", tr: "Sütlü Çay" },
        original: "Etkän Chay",
        description: {
          de: "Kräftiger Schwarztee mit Milch und einer Prise Salz, wie in Kaşgar. Kanne.",
          en: "Strong black tea with milk and a pinch of salt, Kashgar style. Pot.",
          tr: "Kaşgar usulü sütlü ve bir tutam tuzlu koyu çay. Demlik.",
        },
        price: 7.5,
        allergens: ["milk"],
      },
      {
        id: "ayran",
        name: { de: "Ayran", en: "Ayran", tr: "Ayran" },
        description: { de: "Hausgemacht, 3 dl.", en: "Homemade, 3 dl.", tr: "Ev yapımı, 3 dl." },
        price: 5.0,
        allergens: ["milk"],
      },
      {
        id: "softdrinks",
        name: { de: "Mineral, Cola, Säfte", en: "Water, soft drinks, juices", tr: "Su, gazlı içecekler, meyve suları" },
        description: { de: "3.3 dl.", en: "3.3 dl.", tr: "3.3 dl." },
        price: 4.5,
      },
    ],
  },
  {
    id: "kaffee-und-dessert",
    title: { de: "Kaffee & Dessert", en: "Coffee & Dessert", tr: "Kahve & Tatlı" },
    items: [
      {
        id: "kaffee",
        name: { de: "Espresso, Cappuccino, Latte", en: "Espresso, cappuccino, latte", tr: "Espresso, cappuccino, latte" },
        description: { de: "", en: "", tr: "" },
        price: 5.0,
        allergens: ["milk"],
      },
      {
        id: "matcha",
        name: { de: "Matcha Latte", en: "Matcha latte", tr: "Matcha latte" },
        description: { de: "", en: "", tr: "" },
        price: 6.5,
        allergens: ["milk"],
      },
      {
        id: "baklava",
        name: { de: "Baklava", en: "Baklava", tr: "Baklava" },
        description: { de: "Mit Walnüssen, 2 Stück.", en: "With walnuts, 2 pieces.", tr: "Cevizli, 2 adet." },
        price: 7.5,
        allergens: ["gluten", "nuts", "milk"],
      },
      {
        id: "kuchen",
        name: { de: "Kuchen des Tages", en: "Cake of the day", tr: "Günün pastası" },
        description: { de: "Fragen Sie nach der Tageskarte.", en: "Ask for today's selection.", tr: "Günün seçkisini sorun." },
        price: 7.0,
        allergens: ["gluten", "egg", "milk"],
      },
    ],
  },
];

export const signatureIds = ["lagman", "polo", "kebab-lamm"] as const;

export function findItem(id: string): MenuItem | undefined {
  for (const s of menu) for (const i of s.items) if (i.id === id) return i;
  return undefined;
}

export function formatPrice(price: number): string {
  return `CHF ${price.toFixed(2).replace(/\.00$/, ".–").replace(/\.50$/, ".50")}`;
}
