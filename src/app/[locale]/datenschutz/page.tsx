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
  return { title: t("privacyTitle"), robots: { index: false }, alternates: localizedAlternates("/datenschutz", locale as Locale) };
}

type Section = { title: string; body: string[] };

const TEXT: Record<"de" | "en" | "tr", { intro: string; sections: Section[]; updated: string }> = {
  de: {
    intro: "Diese Datenschutzerklärung informiert darüber, welche Personendaten wir beim Besuch dieser Website und bei einer Tischreservation bearbeiten. Massgebend ist das Schweizer Datenschutzgesetz (revDSG).",
    updated: "Stand",
    sections: [
      { title: "Verantwortliche Stelle", body: ["{name}, {address}. E-Mail: {email}, Telefon: {phone}."] },
      { title: "Welche Daten wir bearbeiten", body: [
        "Reservation: Name, Telefonnummer, E-Mail-Adresse, Datum, Uhrzeit, Anzahl Personen, Anlass und Bemerkungen, die Sie im Formular angeben. Zweck: Bearbeitung und Bestätigung Ihrer Reservation, Erinnerung vor dem Termin, Kontaktaufnahme bei Änderungen.",
        "Gruppen- und Event-Anfragen: Name, Telefonnummer, E-Mail-Adresse und Ihre Nachricht. Zweck: Beantwortung der Anfrage.",
        "Server-Logdaten: IP-Adresse, Zeitpunkt, aufgerufene Seite, Browsertyp. Zweck: Betrieb, Sicherheit und Fehlerbehebung. Diese Daten werden nach maximal 30 Tagen gelöscht.",
      ] },
      { title: "Cookies und Analyse", body: [
        "Diese Website setzt keine Marketing- oder Tracking-Cookies. Für den Admin-Bereich wird ein technisch notwendiges Sitzungs-Cookie verwendet. Wir nutzen keine Analysewerkzeuge, die Personendaten an Dritte übermitteln.",
      ] },
      { title: "Weitergabe an Dritte", body: [
        "Hosting: Railway Corp., USA. Die Datenbank mit Reservationsdaten wird dort betrieben. Railway ist vertraglich zum Datenschutz verpflichtet.",
        "E-Mail-Versand: Resend Inc., USA, für Bestätigungs- und Erinnerungsmails. Übermittelt werden Name, E-Mail-Adresse und Reservationsdetails.",
        "Karte: Auf der Kontaktseite ist eine Karte von Google Maps eingebettet. Beim Laden der Karte werden Daten an Google übermittelt. Es gelten die Datenschutzbestimmungen von Google.",
        "Eine weitere Weitergabe findet nicht statt, ausser wir sind gesetzlich dazu verpflichtet.",
      ] },
      { title: "Aufbewahrung", body: ["Reservationsdaten werden 12 Monate nach dem Termin gelöscht. Anfragen werden nach Abschluss der Korrespondenz, spätestens nach 12 Monaten gelöscht."] },
      { title: "Ihre Rechte", body: ["Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Datenherausgabe. Wenden Sie sich dazu an {email}. Zuständige Aufsichtsbehörde ist der Eidgenössische Datenschutz- und Öffentlichkeitsbeauftragte (EDÖB)."] },
      { title: "Sicherheit", body: ["Die Übertragung erfolgt verschlüsselt (TLS). Der Zugriff auf Reservationsdaten ist auf das Restaurant-Team beschränkt und passwortgeschützt."] },
    ],
  },
  en: {
    intro: "This privacy policy explains which personal data we process when you visit this website and make a table reservation. The Swiss Federal Act on Data Protection (revFADP) applies.",
    updated: "Last updated",
    sections: [
      { title: "Controller", body: ["{name}, {address}. Email: {email}, phone: {phone}."] },
      { title: "Data we process", body: [
        "Reservations: name, phone number, email address, date, time, number of guests, occasion and notes you enter in the form. Purpose: processing and confirming your reservation, a reminder before the date, contact in case of changes.",
        "Group and event requests: name, phone number, email address and your message. Purpose: answering your request.",
        "Server logs: IP address, time, page requested, browser type. Purpose: operation, security and troubleshooting. Deleted after 30 days at the latest.",
      ] },
      { title: "Cookies and analytics", body: ["This website sets no marketing or tracking cookies. The admin area uses one strictly necessary session cookie. We use no analytics tools that transmit personal data to third parties."] },
      { title: "Third parties", body: [
        "Hosting: Railway Corp., USA. The database holding reservation data runs there under a data processing agreement.",
        "Email: Resend Inc., USA, for confirmation and reminder emails. Name, email address and reservation details are transmitted.",
        "Map: the contact page embeds a Google Maps map. Loading it transmits data to Google; Google's privacy policy applies.",
        "No further disclosure takes place unless required by law.",
      ] },
      { title: "Retention", body: ["Reservation data is deleted 12 months after the date. Requests are deleted once correspondence is closed, at the latest after 12 months."] },
      { title: "Your rights", body: ["You have the right to access, rectification, deletion and data portability. Contact {email}. The supervisory authority is the Swiss Federal Data Protection and Information Commissioner (FDPIC)."] },
      { title: "Security", body: ["Transmission is encrypted (TLS). Access to reservation data is limited to the restaurant team and password protected."] },
    ],
  },
  tr: {
    intro: "Bu gizlilik politikası, bu web sitesini ziyaret ettiğinizde ve masa rezervasyonu yaptığınızda hangi kişisel verileri işlediğimizi açıklar. İsviçre Veri Koruma Kanunu (revDSG) geçerlidir.",
    updated: "Güncelleme",
    sections: [
      { title: "Sorumlu", body: ["{name}, {address}. E-posta: {email}, telefon: {phone}."] },
      { title: "İşlediğimiz veriler", body: [
        "Rezervasyon: formda girdiğiniz ad, telefon numarası, e-posta adresi, tarih, saat, kişi sayısı, vesile ve notlar. Amaç: rezervasyonunuzun işlenmesi ve onaylanması, randevu öncesi hatırlatma, değişiklik durumunda iletişim.",
        "Grup ve etkinlik talepleri: ad, telefon numarası, e-posta adresi ve mesajınız. Amaç: talebinizin yanıtlanması.",
        "Sunucu kayıtları: IP adresi, zaman, istenen sayfa, tarayıcı türü. Amaç: işletim, güvenlik ve hata giderme. En geç 30 gün sonra silinir.",
      ] },
      { title: "Çerezler ve analiz", body: ["Bu web sitesi pazarlama veya izleme çerezi kullanmaz. Yönetici alanı için teknik olarak gerekli tek bir oturum çerezi kullanılır. Kişisel verileri üçüncü taraflara ileten analiz araçları kullanmıyoruz."] },
      { title: "Üçüncü taraflar", body: [
        "Barındırma: Railway Corp., ABD. Rezervasyon verilerini içeren veritabanı orada çalışır.",
        "E-posta: onay ve hatırlatma e-postaları için Resend Inc., ABD. Ad, e-posta adresi ve rezervasyon ayrıntıları iletilir.",
        "Harita: iletişim sayfasında Google Haritalar gömülüdür. Harita yüklendiğinde Google'a veri iletilir; Google'ın gizlilik politikası geçerlidir.",
        "Yasal zorunluluk dışında başka bir paylaşım yapılmaz.",
      ] },
      { title: "Saklama", body: ["Rezervasyon verileri randevudan 12 ay sonra silinir. Talepler yazışma tamamlandıktan sonra, en geç 12 ay içinde silinir."] },
      { title: "Haklarınız", body: ["Erişim, düzeltme, silme ve veri taşınabilirliği hakkına sahipsiniz. {email} adresine başvurun. Denetim makamı İsviçre Federal Veri Koruma ve Bilgi Komiseri'dir (EDÖB)."] },
      { title: "Güvenlik", body: ["Aktarım şifrelidir (TLS). Rezervasyon verilerine erişim restoran ekibiyle sınırlıdır ve parola korumalıdır."] },
    ],
  },
};

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("legal");
  const x = TEXT[locale as keyof typeof TEXT] ?? TEXT.de;
  const fill = (s: string) =>
    s.replace("{name}", site.legalName).replace("{address}", `${site.address.street}, ${site.address.zip} ${site.address.city}`).replace("{email}", site.email).replace("{phone}", site.phone);

  return (
    <>
      <Header />
      <main>
        <PageHero eyebrow="Karahan" title={t("privacyTitle")} lead={x.intro} />
        <div className="container-page max-w-3xl py-12 sm:py-16">
          <div className="space-y-8">
            {x.sections.map((s) => (
              <section key={s.title}>
                <h2 className="display text-xl text-navy">{s.title}</h2>
                {s.body.map((p, i) => <p key={i} className="mt-3 leading-relaxed text-ink-2">{fill(p)}</p>)}
              </section>
            ))}
            <p className="text-xs text-ink-3">{x.updated}: 11.09.2026</p>
          </div>
        </div>
      </main>
    </>
  );
}
