"use client";

import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { submitEventRequest, type EventFormState } from "@/app/[locale]/gruppen-und-events/actions";
import { site } from "@/data/site";

export function EventForm() {
  const t = useTranslations("events");
  const tr = useTranslations("reservation");
  const locale = useLocale();
  const [state, action, pending] = useActionState<EventFormState, FormData>(submitEventRequest, null);

  if (state?.ok) {
    return (
      <div className="border-l-4 border-teal bg-ivory-2 p-6 shadow-soft" role="status">
        <p className="serif text-[1.05rem] text-ink">{t("success")}</p>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-5 bg-ivory-2 p-6 shadow-soft sm:p-8">
      <input type="hidden" name="locale" value={locale} />
      <div className="hidden" aria-hidden="true">
        <label htmlFor="ev-website">Website</label>
        <input id="ev-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="ev-type">{t("type")}</label>
          <select id="ev-type" name="type" className="field" required defaultValue="group">
            <option value="group">{t("types.group")}</option>
            <option value="private">{t("types.private")}</option>
            <option value="catering">{t("types.catering")}</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="ev-guests">{t("guests")}</label>
          <input id="ev-guests" name="guests" type="number" min={1} max={500} inputMode="numeric" className="field" />
        </div>
        <div>
          <label className="label" htmlFor="ev-date">{t("date")}</label>
          <input id="ev-date" name="date" type="date" className="field" />
        </div>
        <div>
          <label className="label" htmlFor="ev-name">{tr("name")}</label>
          <input id="ev-name" name="name" autoComplete="name" required minLength={2} className="field" />
        </div>
        <div>
          <label className="label" htmlFor="ev-phone">{tr("phone")}</label>
          <input id="ev-phone" name="phone" type="tel" autoComplete="tel" required className="field" />
        </div>
        <div>
          <label className="label" htmlFor="ev-email">{tr("email")}</label>
          <input id="ev-email" name="email" type="email" autoComplete="email" required className="field" />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="ev-message">{t("message")}</label>
        <textarea id="ev-message" name="message" rows={5} required minLength={5} className="field" />
      </div>
      {state && !state.ok && (
        <p className="text-sm font-semibold text-ikat" role="alert">
          {state.error === "invalid" ? tr("errors.invalid") : t("error", { email: site.email })}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn btn-gold justify-self-start disabled:opacity-60">
        {pending ? tr("submitting") : t("submit")}
      </button>
    </form>
  );
}
