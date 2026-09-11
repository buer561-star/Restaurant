# Karahan Uigur Restaurant · Website

Mehrsprachige Restaurant-Website (Deutsch, Englisch, Türkisch) mit eigenem Tischreservierungssystem, HTML-Speisekarte, Gruppen-/Event-Anfragen und Admin-Bereich. Gebaut mit Next.js 16, Tailwind 4, Prisma und Postgres. Läuft auf Railway.

## Inhalt

- [Schnellstart lokal](#schnellstart-lokal)
- [Deployment auf Railway](#deployment-auf-railway)
- [Vor dem Livegang: Platzhalter ersetzen](#vor-dem-livegang-platzhalter-ersetzen)
- [Bilder austauschen](#bilder-austauschen)
- [Speisekarte und Preise pflegen](#speisekarte-und-preise-pflegen)
- [Öffnungszeiten und Reservationslogik](#öffnungszeiten-und-reservationslogik)
- [Admin-Bereich](#admin-bereich)
- [E-Mails](#e-mails)
- [Erinnerungs-Mails (Cron)](#erinnerungs-mails-cron)
- [Tests](#tests)
- [Struktur](#struktur)

## Schnellstart lokal

Voraussetzungen: Node 22, pnpm 10, Postgres.

```bash
cp .env.example .env          # Werte anpassen, mindestens DATABASE_URL
pnpm install                  # generiert auch den Prisma-Client
pnpm prisma migrate dev       # legt die Tabellen an
pnpm dev                      # http://localhost:3000
```

Produktionsbuild lokal so starten, wie Railway ihn ausführt:

```bash
pnpm build && pnpm preview    # http://localhost:3100
```

## Deployment auf Railway

1. **Neues Projekt** in Railway anlegen, «Deploy from GitHub repo» wählen, dieses Repository und den gewünschten Branch verbinden. Railway erkennt das `Dockerfile` automatisch (siehe `railway.json`).
2. **Postgres hinzufügen**: im Projekt «+ New» → «Database» → «PostgreSQL».
3. **Variablen** beim Web-Service setzen (Tab «Variables»):

   | Variable | Wert |
   | --- | --- |
   | `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` (Referenz auf den Postgres-Service) |
   | `NEXT_PUBLIC_SITE_URL` | `https://karahan.ch` (oder die Railway-Domain, solange keine eigene Domain hängt) |
   | `RESEND_API_KEY` | API-Key von resend.com |
   | `MAIL_FROM` | `Karahan <reservation@karahan.ch>` (Domain muss bei Resend verifiziert sein) |
   | `MAIL_RESTAURANT` | Adresse, die Kopien aller Reservationen und Anfragen erhält |
   | `ADMIN_PASSWORD` | Passwort für `/admin` |
   | `SESSION_SECRET` | langer Zufallsstring, z.B. `openssl rand -base64 48` |
   | `CRON_SECRET` | Zufallsstring für die Erinnerungs-Route |

4. **Deploy**: Railway baut das Image und führt beim Start `prisma migrate deploy` aus (siehe `scripts/start.sh`). Healthcheck ist `/api/health`.
5. **Domain**: unter «Settings» → «Networking» eine Domain generieren oder die eigene Domain (`karahan.ch`) per CNAME verbinden. Danach `NEXT_PUBLIC_SITE_URL` anpassen.

Jeder Push auf den verbundenen Branch löst ein neues Deployment aus.

## Vor dem Livegang: Platzhalter ersetzen

Alle Stellen sind im Code mit `PLACEHOLDER` markiert:

```bash
grep -rn PLACEHOLDER src
```

- `src/data/site.ts`: Adresse, Koordinaten, Telefon, WhatsApp, E-Mail, Social-Links, Google-Maps-Link, Eröffnungsdatum, Öffnungszeiten, Sitzplätze.
- `src/data/menu.ts`: Preise (aktuell Schätzungen) und `PRICES_ARE_PLACEHOLDERS` auf `false` setzen, dann verschwindet der Hinweis auf der Seite.
- `src/app/[locale]/impressum/page.tsx`: Rechtsform, Handelsregister- und UID-Nummer.
- `messages/*.json` → `contact.byTrainText` / `byCarText`: Anfahrt mit definitiver Adresse.

## Bilder austauschen

Alle Gerichtsbilder unter `public/images/dishes/` und die beiden Küchenbilder unter `public/images/kitchen/` sind KI-generierte Platzhalter. Auf der öffentlichen Seite sind sie nicht markiert (`SHOW_PLACEHOLDER_BADGES` in `src/data/images.ts` steht auf `false`); zum Prüfen kann der Badge «Beispielbild» damit eingeschaltet werden.

So ersetzen Sie sie durch echte Fotos:

1. Foto im Format 4:3 (Gerichte) bzw. 16:9 (Küche) aufnehmen, mindestens 1200 px breit, als WebP oder JPEG speichern.
2. Datei mit **gleichem Namen** überschreiben, z.B. `public/images/dishes/lagman.webp`.
3. In `src/data/images.ts` bei den Küchenbildern `placeholder: false` setzen. Für die Gerichte `DISH_IMAGES_ARE_PLACEHOLDERS` auf `false` setzen, sobald alle ersetzt sind.

Neue Bilder für weitere Gerichte: Datei ablegen und in `src/data/menu.ts` beim Gericht `image: "/images/dishes/<name>.webp"` eintragen.

Innenraum- und Aussenaufnahmen (`public/images/interior/`) sind echte Fotos. Teamfotos: Platzhalter auf der Seite «Über uns» (`teamPlaceholder`).

## Speisekarte und Preise pflegen

Eine Datei: `src/data/menu.ts`. Jede Sektion hat Titel in drei Sprachen und eine Liste von Gerichten mit Name, Beschreibung, Preis (CHF), Tags (`signature`, `spicy`, `vegan`, `vegetarian`, `sharing`, `handmade`), Allergenen und optionalem Bild. Änderungen wirken nach dem nächsten Deploy auf Speisekarte, Startseite, Galerie und im schema.org-Markup.

## Öffnungszeiten und Reservationslogik

`src/data/site.ts`:

- `hours`: pro Wochentag (0 = Sonntag) beliebig viele Zeitfenster. Leeres Array = Ruhetag.
- `booking.seatsTotal`: Sitzplätze. `onlineShare` (0.7) = Anteil, der online buchbar ist, der Rest bleibt für Telefon und Laufkundschaft.
- `slotMinutes` (15), `diningMinutes` (105) = Tischbelegung pro Reservation, `lastSeatingBeforeCloseMinutes` (75).
- `maxGuestsOnline` (8): grössere Gruppen werden auf das Gruppenformular verwiesen.
- `minLeadMinutes` (60), `maxDaysAhead` (90), `cancelUntilMinutesBefore` (120).

Ein Zeitfenster gilt als frei, wenn die Summe der Gäste aller überlappenden Reservationen plus die Anfrage die Online-Kapazität nicht überschreitet. Die Prüfung läuft im Formular (Anzeige) und nochmals in einer Datenbank-Transaktion beim Speichern (Doppelbuchungen).

## Admin-Bereich

`/admin`, Passwort aus `ADMIN_PASSWORD`. Funktionen: Tagesliste mit Status (Eingegangen, Bestätigt, Am Tisch, Storniert, Nicht erschienen), Telefon-Reservationen erfassen, Sperrtage setzen, offene Gruppen-/Event-Anfragen abarbeiten. Die Sitzung läuft 12 Stunden.

## E-Mails

Versand über Resend. Ohne `RESEND_API_KEY` werden Mails nur ins Log geschrieben (praktisch für Tests). Vorlagen in `src/lib/reservation-mail.ts` (Bestätigung mit Kalenderdatei, Erinnerung, Stornierung, interne Kopien) und `src/app/[locale]/gruppen-und-events/actions.ts` (Anfragen).

## Erinnerungs-Mails (Cron)

`GET /api/cron/reminders` verschickt Erinnerungen an Gäste mit Termin in 22 bis 26 Stunden. Auf Railway einen zweiten Service «Cron» anlegen (Settings → Cron Schedule, z.B. `0 * * * *`) mit dem Befehl:

```bash
curl -fsS -H "Authorization: Bearer $CRON_SECRET" https://karahan.ch/api/cron/reminders
```

Alternativ ein externer Dienst wie cron-job.org mit demselben Header.

## Tests

```bash
pnpm build && pnpm preview &          # Server auf :3100
CHROMIUM_PATH=/pfad/zu/chromium pnpm test:e2e
```

Playwright prüft Sprachen, Speisekarte, den kompletten Buchungsablauf inklusive Stornierung, Ruhetage, Admin-Login und die API-Routen, jeweils auf Desktop und Mobile. `BASE_URL` zeigt die Tests auf eine andere Instanz.

## Struktur

```
messages/            Texte in de/en/tr
prisma/              Schema und Migrationen
public/images/       Bilder (dishes = Platzhalter, interior = echt)
scripts/             start.sh (Railway), preview.sh (lokal)
src/app/[locale]/    Seiten: Start, speisekarte, reservation, ueber-uns, gruppen-und-events, galerie, kontakt, impressum, datenschutz, admin
src/app/api/         health, availability, cron/reminders
src/components/      Header, Footer, BookingForm, MenuBrowser, …
src/data/            site.ts (Konfiguration), menu.ts (Speisekarte), images.ts (Bild-Manifest)
src/i18n/            Routing mit lokalisierten Pfaden (/speisekarte, /en/menu, /tr/menu)
src/lib/             booking.ts (Verfügbarkeit), email.ts, reservation-mail.ts, admin-session.ts, seo.ts
tests/               Playwright
```

## Bewusst nicht enthalten

Online-Bestellung, Gutscheine, Online-Zahlung, uigurische Sprachversion, Blog. Wenn das Reservationsaufkommen ein Tischplan-System nötig macht, kann die Reservationsseite durch ein Widget von Foratable oder aleno ersetzt werden, ohne den Rest der Seite anzufassen.
