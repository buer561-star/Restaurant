import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { localizedAlternates } from "@/lib/seo";
import { Header } from "@/components/Header";
import { PageHero } from "@/components/PageHero";
import { site } from "@/data/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return { title: t("imprintTitle"), robots: { index: false }, alternates: localizedAlternates("/impressum", locale as Locale) };
}

const TEXT = {
  de: {
    responsible: "Verantwortlich für den Inhalt dieser Website",
    company: "Firma", register: "Handelsregister", uid: "UID", vat: "MwSt-Nummer", contact: "Kontakt",
    disclaimerTitle: "Haftungsausschluss",
    disclaimer: "Der Autor übernimmt keine Gewähr für die Richtigkeit, Genauigkeit, Aktualität, Zuverlässigkeit und Vollständigkeit der Informationen. Haftungsansprüche gegen den Autor wegen Schäden materieller oder immaterieller Art, die aus dem Zugriff oder der Nutzung bzw. Nichtnutzung der veröffentlichten Informationen, durch Missbrauch der Verbindung oder durch technische Störungen entstanden sind, werden ausgeschlossen.",
    linksTitle: "Haftung für Links",
    links: "Verweise und Links auf Websites Dritter liegen ausserhalb unseres Verantwortungsbereichs. Es wird jegliche Verantwortung für solche Websites abgelehnt. Der Zugriff und die Nutzung solcher Websites erfolgen auf eigene Gefahr des Nutzers.",
    copyrightTitle: "Urheberrechte",
    copyright: "Die Urheber- und alle anderen Rechte an Inhalten, Bildern, Fotos oder anderen Dateien auf der Website gehören ausschliesslich der Firma {name} oder den speziell genannten Rechtsinhabern. Für die Reproduktion jeglicher Elemente ist die schriftliche Zustimmung der Urheberrechtsträger im Voraus einzuholen.",
    imagesTitle: "Bildnachweis",
    images: "Innenraum- und Aussenaufnahmen: {name}. Gerichtsbilder mit der Kennzeichnung «Beispielbild» wurden KI-gestützt erstellt und dienen bis zur Eröffnung als Platzhalter.",
    placeholder: "PLACEHOLDER: Rechtsform, Handelsregister- und UID-Nummer vor dem Livegang ergänzen.",
  },
  en: {
    responsible: "Responsible for the content of this website",
    company: "Company", register: "Commercial register", uid: "UID", vat: "VAT number", contact: "Contact",
    disclaimerTitle: "Disclaimer",
    disclaimer: "The author accepts no liability for the correctness, accuracy, timeliness, reliability or completeness of the information. Liability claims against the author for material or immaterial damage arising from access to or use or non-use of the published information, from misuse of the connection or from technical faults are excluded.",
    linksTitle: "Liability for links",
    links: "References and links to third-party websites are outside our area of responsibility. We reject any responsibility for such websites. Access to and use of such websites is at the user's own risk.",
    copyrightTitle: "Copyright",
    copyright: "The copyright and all other rights to content, images, photos or other files on the website belong exclusively to {name} or the specifically named rights holders. Written consent of the copyright holder must be obtained in advance for the reproduction of any elements.",
    imagesTitle: "Image credits",
    images: "Interior and exterior photographs: {name}. Dish images marked \"Sample image\" were created with AI assistance and serve as placeholders until opening.",
    placeholder: "PLACEHOLDER: add legal form, commercial register and UID number before going live.",
  },
  tr: {
    responsible: "Bu web sitesinin içeriğinden sorumlu",
    company: "Şirket", register: "Ticaret sicili", uid: "UID", vat: "KDV numarası", contact: "İletişim",
    disclaimerTitle: "Sorumluluk reddi",
    disclaimer: "Yazar, bilgilerin doğruluğu, kesinliği, güncelliği, güvenilirliği ve eksiksizliği konusunda garanti vermez. Yayınlanan bilgilere erişim veya bunların kullanımı ya da kullanılmaması, bağlantının kötüye kullanılması veya teknik arızalardan kaynaklanan maddi veya manevi zararlar için yazara karşı sorumluluk talepleri hariç tutulur.",
    linksTitle: "Bağlantılar için sorumluluk",
    links: "Üçüncü taraf web sitelerine yapılan atıflar ve bağlantılar sorumluluk alanımızın dışındadır. Bu tür web siteleri için her türlü sorumluluk reddedilir. Bu sitelere erişim ve kullanım kullanıcının kendi sorumluluğundadır.",
    copyrightTitle: "Telif hakları",
    copyright: "Web sitesindeki içerik, görsel, fotoğraf veya diğer dosyaların telif ve diğer tüm hakları münhasıran {name} şirketine veya özel olarak belirtilen hak sahiplerine aittir. Herhangi bir öğenin çoğaltılması için telif hakkı sahibinin önceden yazılı izni alınmalıdır.",
    imagesTitle: "Görsel kaynakları",
    images: "İç ve dış mekân fotoğrafları: {name}. «Örnek görsel» işaretli yemek görselleri yapay zekâ desteğiyle oluşturulmuştur ve açılışa kadar geçici olarak kullanılmaktadır.",
    placeholder: "PLACEHOLDER: yasal şekil, ticaret sicili ve UID numarası yayına girmeden önce eklenecek.",
  },
} as const;

export default async function ImprintPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("legal");
  const x = TEXT[locale as keyof typeof TEXT] ?? TEXT.de;
  const name = site.legalName;

  return (
    <>
      <Header />
      <main>
        <PageHero eyebrow="Karahan" title={t("imprintTitle")} />
        <div className="container-page max-w-3xl py-12 sm:py-16">
          <div className="prose-karahan space-y-8">
            <section>
              <h2 className="display text-xl text-navy">{x.responsible}</h2>
              <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-8 gap-y-2">
                <dt className="text-sm font-semibold text-ink-2">{x.company}</dt><dd>{name}<br />{site.address.street}<br />{site.address.zip} {site.address.city}, {locale === "de" ? "Schweiz" : locale === "tr" ? "İsviçre" : "Switzerland"}</dd>
                <dt className="text-sm font-semibold text-ink-2">{x.contact}</dt><dd><a href={`tel:${site.phoneHref}`}>{site.phone}</a><br /><a href={`mailto:${site.email}`}>{site.email}</a></dd>
                <dt className="text-sm font-semibold text-ink-2">{x.register}</dt><dd>CHE-000.000.000 <span className="text-ink-3">(PLACEHOLDER)</span></dd>
                <dt className="text-sm font-semibold text-ink-2">{x.vat}</dt><dd>CHE-000.000.000 MWST <span className="text-ink-3">(PLACEHOLDER)</span></dd>
              </dl>
              <p className="mt-4 border-l-2 border-ikat pl-3 text-xs text-ink-3">{x.placeholder}</p>
            </section>
            <section><h2 className="display text-xl text-navy">{x.disclaimerTitle}</h2><p className="mt-3 leading-relaxed text-ink-2">{x.disclaimer}</p></section>
            <section><h2 className="display text-xl text-navy">{x.linksTitle}</h2><p className="mt-3 leading-relaxed text-ink-2">{x.links}</p></section>
            <section><h2 className="display text-xl text-navy">{x.copyrightTitle}</h2><p className="mt-3 leading-relaxed text-ink-2">{x.copyright.replace("{name}", name)}</p></section>
            <section><h2 className="display text-xl text-navy">{x.imagesTitle}</h2><p className="mt-3 leading-relaxed text-ink-2">{x.images.replace("{name}", name)}</p></section>
          </div>
        </div>
      </main>
    </>
  );
}
