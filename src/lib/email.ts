import { Resend } from "resend";

export type Attachment = { filename: string; content: string; contentType?: string };

export type Mail = {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  attachments?: Attachment[];
};

const from = process.env.MAIL_FROM ?? "Karahan <reservation@karahan.ch>";

/**
 * Versendet über Resend. Ohne RESEND_API_KEY wird die Mail nur geloggt,
 * damit die Seite lokal und in der Vorschau ohne Zugangsdaten funktioniert.
 */
export async function sendMail(mail: Mail): Promise<{ ok: boolean; id?: string; skipped?: boolean }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info(`[mail:skipped] to=${Array.isArray(mail.to) ? mail.to.join(",") : mail.to} subject="${mail.subject}"`);
    return { ok: true, skipped: true };
  }
  const resend = new Resend(key);
  const { data, error } = await resend.emails.send({
    from,
    to: mail.to,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
    replyTo: mail.replyTo,
    attachments: mail.attachments?.map((a) => ({ filename: a.filename, content: a.content, contentType: a.contentType })),
  });
  if (error) {
    console.error("[mail:error]", error);
    return { ok: false };
  }
  return { ok: true, id: data?.id };
}

export const restaurantInbox = () => process.env.MAIL_RESTAURANT ?? "info@karahan.ch";

/** Einfache HTML-Hülle für alle Mails, Navy/Gold wie die Seite. */
export function mailLayout(title: string, body: string, footer: string): string {
  return `<!doctype html><html><body style="margin:0;background:#f5efe3;font-family:Georgia,serif;color:#1b2233">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5efe3;padding:24px 12px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fffdf8;border:1px solid #d9d0bc">
<tr><td style="background:#0b1f3a;padding:22px 28px;color:#f5efe3;font-family:Georgia,serif;letter-spacing:.14em;font-size:20px">KARAHAN<span style="display:block;font-size:10px;letter-spacing:.28em;color:#2a9d9f;margin-top:4px">UIGUR RESTAURANT</span></td></tr>
<tr><td style="padding:28px 28px 8px;font-size:22px;color:#0b1f3a">${title}</td></tr>
<tr><td style="padding:0 28px 28px;font-size:16px;line-height:1.55">${body}</td></tr>
<tr><td style="padding:16px 28px;border-top:1px solid #d9d0bc;font-size:12px;color:#7b8494;line-height:1.5">${footer}</td></tr>
</table></td></tr></table></body></html>`;
}
