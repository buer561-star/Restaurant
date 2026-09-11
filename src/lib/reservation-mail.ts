import type { Reservation } from "@prisma/client";
import { sendMail, restaurantInbox, mailLayout } from "@/lib/email";
import { reservationIcs } from "@/lib/ics";
import { formatReservationDate } from "@/lib/booking";
import { site } from "@/data/site";

const T = {
  de: {
    subject: (d: string, t: string) => `Ihre Reservation im Karahan am ${d}, ${t} Uhr`,
    title: "Reserviert. Wir freuen uns auf Sie.",
    intro: (name: string) => `Guten Tag ${name}`,
    body: "Ihr Tisch ist reserviert. Hier die Details:",
    date: "Datum", time: "Uhrzeit", guests: "Personen", notes: "Bemerkungen",
    cancel: "Sie können bis zwei Stunden vor dem Termin kostenlos stornieren:",
    cancelLink: "Reservation ansehen oder stornieren",
    footer: "Bei Fragen erreichen Sie uns unter",
    reminderSubject: (d: string, t: string) => `Erinnerung: Ihr Tisch im Karahan morgen um ${t} Uhr`,
    reminderTitle: "Bis morgen!",
    reminderBody: "Wir erinnern Sie an Ihre Reservation:",
    cancelledSubject: "Ihre Reservation wurde storniert",
    cancelledTitle: "Storniert",
    cancelledBody: "Ihre Reservation wurde storniert. Wir hoffen, Sie ein anderes Mal begrüssen zu dürfen.",
  },
  en: {
    subject: (d: string, t: string) => `Your reservation at Karahan on ${d} at ${t}`,
    title: "Booked. We look forward to seeing you.",
    intro: (name: string) => `Hello ${name}`,
    body: "Your table is reserved. Here are the details:",
    date: "Date", time: "Time", guests: "Guests", notes: "Notes",
    cancel: "You can cancel free of charge up to two hours before:",
    cancelLink: "View or cancel reservation",
    footer: "Questions? Reach us at",
    reminderSubject: (d: string, t: string) => `Reminder: your table at Karahan tomorrow at ${t}`,
    reminderTitle: "See you tomorrow!",
    reminderBody: "A reminder of your reservation:",
    cancelledSubject: "Your reservation has been cancelled",
    cancelledTitle: "Cancelled",
    cancelledBody: "Your reservation has been cancelled. We hope to welcome you another time.",
  },
  tr: {
    subject: (d: string, t: string) => `Karahan rezervasyonunuz: ${d}, saat ${t}`,
    title: "Rezerve edildi. Sizi bekliyoruz.",
    intro: (name: string) => `Merhaba ${name}`,
    body: "Masanız ayrıldı. Ayrıntılar:",
    date: "Tarih", time: "Saat", guests: "Kişi", notes: "Notlar",
    cancel: "Randevudan iki saat öncesine kadar ücretsiz iptal edebilirsiniz:",
    cancelLink: "Rezervasyonu görüntüle veya iptal et",
    footer: "Sorularınız için:",
    reminderSubject: (d: string, t: string) => `Hatırlatma: yarın saat ${t} Karahan'da masanız`,
    reminderTitle: "Yarın görüşürüz!",
    reminderBody: "Rezervasyonunuzu hatırlatırız:",
    cancelledSubject: "Rezervasyonunuz iptal edildi",
    cancelledTitle: "İptal edildi",
    cancelledBody: "Rezervasyonunuz iptal edildi. Başka bir zaman sizi ağırlamayı umuyoruz.",
  },
} as const;

type L = keyof typeof T;

function esc(s: string) {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] ?? c));
}

function baseUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? site.domain).replace(/\/$/, "");
}

export function reservationUrl(r: Reservation): string {
  const prefix = r.locale === "de" ? "" : `/${r.locale}`;
  const seg = r.locale === "en" ? "reservations" : r.locale === "tr" ? "rezervasyon" : "reservation";
  return `${baseUrl()}${prefix}/${seg}/${r.cancelToken}`;
}

function detailsTable(r: Reservation, t: (typeof T)[L]) {
  const f = formatReservationDate(r.startsAt, r.locale);
  const rows: [string, string][] = [
    [t.date, f.date],
    [t.time, f.time],
    [t.guests, String(r.guests)],
  ];
  if (r.notes) rows.push([t.notes, r.notes]);
  return {
    html: `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:12px 0">${rows
      .map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0;color:#7b8494">${esc(k)}</td><td style="padding:4px 0;font-weight:600">${esc(v)}</td></tr>`)
      .join("")}</table>`,
    text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
    f,
  };
}

export async function sendConfirmation(r: Reservation) {
  const t = T[(r.locale as L) in T ? (r.locale as L) : "de"];
  const { html, text, f } = detailsTable(r, t);
  const url = reservationUrl(r);
  const ics = reservationIcs({
    id: r.id,
    startsAt: r.startsAt,
    endsAt: r.endsAt,
    guests: r.guests,
    summary: `Karahan · ${r.guests} P.`,
    description: `${text}\n${url}`,
    url,
  });
  const addr = `${site.address.street}, ${site.address.zip} ${site.address.city}`;
  await sendMail({
    to: r.email,
    subject: t.subject(f.date, f.time),
    html: mailLayout(
      t.title,
      `<p>${esc(t.intro(r.name))}</p><p>${esc(t.body)}</p>${html}<p style="color:#7b8494">${esc(addr)}</p><p>${esc(t.cancel)}<br><a href="${url}" style="color:#0b1f3a">${esc(t.cancelLink)}</a></p>`,
      `${esc(t.footer)} ${esc(site.phone)} · ${esc(site.email)}`
    ),
    text: `${t.intro(r.name)}\n\n${t.body}\n${text}\n${addr}\n\n${t.cancel}\n${url}\n\n${t.footer} ${site.phone}`,
    attachments: [{ filename: "karahan-reservation.ics", content: Buffer.from(ics).toString("base64"), contentType: "text/calendar" }],
  });

  // Interne Kopie
  await sendMail({
    to: restaurantInbox(),
    replyTo: r.email,
    subject: `Neue Reservation: ${f.date} ${f.time}, ${r.guests} P., ${r.name}`,
    html: mailLayout("Neue Reservation", `${html}<p>${esc(r.name)}<br>${esc(r.phone)}<br>${esc(r.email)}${r.occasion ? `<br>Anlass: ${esc(r.occasion)}` : ""}</p>`, "Automatische Nachricht der Website."),
    text: `${text}\n${r.name}\n${r.phone}\n${r.email}`,
  });
}

export async function sendReminder(r: Reservation) {
  const t = T[(r.locale as L) in T ? (r.locale as L) : "de"];
  const { html, text, f } = detailsTable(r, t);
  const url = reservationUrl(r);
  await sendMail({
    to: r.email,
    subject: t.reminderSubject(f.date, f.time),
    html: mailLayout(t.reminderTitle, `<p>${esc(t.intro(r.name))}</p><p>${esc(t.reminderBody)}</p>${html}<p><a href="${url}" style="color:#0b1f3a">${esc(t.cancelLink)}</a></p>`, `${esc(t.footer)} ${esc(site.phone)}`),
    text: `${t.intro(r.name)}\n\n${t.reminderBody}\n${text}\n${url}`,
  });
}

export async function sendCancellation(r: Reservation) {
  const t = T[(r.locale as L) in T ? (r.locale as L) : "de"];
  const { html, text, f } = detailsTable(r, t);
  await sendMail({
    to: r.email,
    subject: t.cancelledSubject,
    html: mailLayout(t.cancelledTitle, `<p>${esc(t.intro(r.name))}</p><p>${esc(t.cancelledBody)}</p>${html}`, `${esc(t.footer)} ${esc(site.phone)}`),
    text: `${t.intro(r.name)}\n\n${t.cancelledBody}\n${text}`,
  });
  await sendMail({
    to: restaurantInbox(),
    subject: `Storniert: ${f.date} ${f.time}, ${r.guests} P., ${r.name}`,
    html: mailLayout("Reservation storniert", html, "Automatische Nachricht der Website."),
    text,
  });
}
