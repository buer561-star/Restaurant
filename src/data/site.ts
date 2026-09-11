/**
 * Zentrale Konfiguration des Restaurants.
 * Alles, was mit PLACEHOLDER markiert ist, muss vor dem Livegang ersetzt werden.
 */
export const site = {
  name: "Karahan",
  legalName: "Karahan Uigur Restaurant", // PLACEHOLDER: Firmenname laut Handelsregister
  tagline: {
    de: "Uigurische Küche in Winterthur",
    en: "Uyghur cuisine in Winterthur",
    tr: "Winterthur'da Uygur mutfağı",
  },
  domain: "https://karahan.ch", // PLACEHOLDER: echte Domain
  address: {
    street: "Musterstrasse 1", // PLACEHOLDER
    zip: "8400", // PLACEHOLDER
    city: "Winterthur",
    country: "CH",
    // PLACEHOLDER: Koordinaten des Lokals (Winterthur Zentrum als Standard)
    lat: 47.4995,
    lng: 8.7241,
  },
  phone: "+41 52 000 00 00", // PLACEHOLDER
  phoneHref: "+41520000000", // PLACEHOLDER
  whatsapp: "41790000000", // PLACEHOLDER: ohne + und ohne Leerzeichen
  email: "info@karahan.ch", // PLACEHOLDER
  reservationEmail: "reservation@karahan.ch", // PLACEHOLDER
  instagram: "https://www.instagram.com/karahan.winterthur", // PLACEHOLDER
  tiktok: "https://www.tiktok.com/@karahan.winterthur", // PLACEHOLDER
  facebook: "https://www.facebook.com/karahan.winterthur", // PLACEHOLDER
  googleMaps: "https://maps.google.com/?q=Karahan+Uigur+Restaurant+Winterthur", // PLACEHOLDER
  openingDate: "2026-11-01", // PLACEHOLDER: Eröffnungsdatum (ISO)

  /** Öffnungszeiten. weekday: 0 = Sonntag ... 6 = Samstag. Leeres Array = geschlossen. */
  hours: {
    0: [{ open: "11:30", close: "22:00" }],
    1: [], // Montag Ruhetag PLACEHOLDER
    2: [{ open: "11:30", close: "14:00" }, { open: "17:30", close: "22:00" }],
    3: [{ open: "11:30", close: "14:00" }, { open: "17:30", close: "22:00" }],
    4: [{ open: "11:30", close: "14:00" }, { open: "17:30", close: "22:00" }],
    5: [{ open: "11:30", close: "14:00" }, { open: "17:30", close: "23:00" }],
    6: [{ open: "11:30", close: "23:00" }],
  } as Record<number, { open: string; close: string }[]>,

  /** Reservationslogik */
  booking: {
    seatsTotal: 60, // PLACEHOLDER: Sitzplätze
    onlineShare: 0.7, // Anteil der Plätze, der online buchbar ist
    slotMinutes: 15,
    diningMinutes: 105, // Tischbelegung pro Reservation
    lastSeatingBeforeCloseMinutes: 75,
    minGuests: 1,
    maxGuestsOnline: 8, // darüber: Gruppenanfrage
    minLeadMinutes: 60, // frühestens 1 h im Voraus
    maxDaysAhead: 90,
    cancelUntilMinutesBefore: 120,
  },
} as const;

export type Site = typeof site;
