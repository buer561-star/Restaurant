import { site } from "@/data/site";

function icsDate(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function esc(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

/** Kalenderdatei für die Bestätigungs-Mail. Base64 für Resend-Attachment. */
export function reservationIcs(opts: { id: string; startsAt: Date; endsAt: Date; guests: number; summary: string; description: string; url: string }): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Karahan//Reservation//DE",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${opts.id}@karahan`,
    `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(opts.startsAt)}`,
    `DTEND:${icsDate(opts.endsAt)}`,
    `SUMMARY:${esc(opts.summary)}`,
    `DESCRIPTION:${esc(opts.description)}`,
    `LOCATION:${esc(`${site.legalName}, ${site.address.street}, ${site.address.zip} ${site.address.city}`)}`,
    `URL:${opts.url}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}
