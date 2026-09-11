"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { createReservation, type BookingResult } from "@/app/[locale]/reservation/actions";
import { site } from "@/data/site";

type Slot = { time: string; available: boolean; seatsLeft: number };
type Avail = { closed: boolean; blocked: boolean; slots: Slot[] };

const B = site.booking;

function isoDay(offsetDays: number): string {
  const d = new Date(Date.now() + offsetDays * 86400000);
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Zurich" }).format(d); // YYYY-MM-DD
}

export function BookingForm({ initialDay, initialGuests = 2 }: { initialDay: string; initialGuests?: number }) {
  const t = useTranslations("reservation");
  const locale = useLocale();
  const [day, setDay] = useState(initialDay);
  const [guests, setGuests] = useState(Math.min(Math.max(initialGuests, B.minGuests), B.maxGuestsOnline));
  const [time, setTime] = useState<string | null>(null);
  const [avail, setAvail] = useState<{ key: string; data: Avail } | null>(null);
  const [state, action, pending] = useActionState<BookingResult | null, FormData>(createReservation, null);

  const minDay = useMemo(() => isoDay(0), []);
  const maxDay = useMemo(() => isoDay(B.maxDaysAhead), []);

  // Schlüssel der aktuellen Abfrage; ändert er sich, wird die gewählte Uhrzeit zurückgesetzt
  const key = `${day}|${guests}|${state && !state.ok ? state.error : ""}`;
  const [prevKey, setPrevKey] = useState(key);
  if (prevKey !== key) {
    setPrevKey(key);
    setTime(null);
  }
  const loading = avail?.key !== key;

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/availability?day=${day}&guests=${guests}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: Avail) => {
        if (!cancelled) setAvail({ key, data });
      })
      .catch(() => {
        if (!cancelled) setAvail({ key, data: { closed: false, blocked: false, slots: [] } });
      });
    return () => {
      cancelled = true;
    };
  }, [key, day, guests]);

  if (state?.ok) {
    return (
      <div className="bg-ivory-2 p-8 shadow-soft sm:p-10" role="status">
        <p className="eyebrow">Karahan</p>
        <h2 className="display mt-3 text-[1.75rem] text-navy">{t("successTitle")}</h2>
        <p className="serif mt-4 text-ink-2">{t("successText", { email: state.email })}</p>
        <p className="mt-3 text-sm text-ink-2">{t("cancelInfo", { hours: B.cancelUntilMinutesBefore / 60 })}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={{ pathname: "/reservation/[id]", params: { id: state.token } }} className="btn btn-navy">
            {t("detail.title")}
          </Link>
          <Link href="/" className="btn btn-outline">Karahan</Link>
        </div>
      </div>
    );
  }

  const data = loading ? null : avail?.data ?? null;
  const slots = data?.slots ?? [];
  const lunch = slots.filter((s) => Number(s.time.slice(0, 2)) < 16);
  const dinner = slots.filter((s) => Number(s.time.slice(0, 2)) >= 16);
  const errorKey = state && !state.ok ? state.error : null;

  return (
    <form action={action} className="grid gap-8 bg-ivory-2 p-6 shadow-soft sm:p-8">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="day" value={day} />
      <input type="hidden" name="time" value={time ?? ""} />
      <input type="hidden" name="guests" value={guests} />
      <div className="hidden" aria-hidden="true">
        <label htmlFor="rs-website">Website</label>
        <input id="rs-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {/* 1. Datum + Personen */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="rs-day">{t("stepDate")}</label>
          <input
            id="rs-day"
            type="date"
            className="field"
            value={day}
            min={minDay}
            max={maxDay}
            required
            onChange={(e) => e.target.value && setDay(e.target.value)}
          />
        </div>
        <div>
          <span className="label" id="rs-guests-label">{t("stepGuests")}</span>
          <div className="flex flex-wrap gap-1.5" role="group" aria-labelledby="rs-guests-label">
            {Array.from({ length: B.maxGuestsOnline - B.minGuests + 1 }, (_, i) => B.minGuests + i).map((n) => (
              <button key={n} type="button" onClick={() => setGuests(n)} aria-pressed={guests === n} className="chip min-w-11">
                {n}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-ink-3">
            {t("largeGroup", { max: B.maxGuestsOnline })}{" "}
            <Link href="/gruppen-und-events" className="font-semibold text-navy underline decoration-gold underline-offset-2">{t("largeGroupLink")}</Link>
          </p>
        </div>
      </div>

      {/* 2. Uhrzeit */}
      <div>
        <span className="label" id="rs-time-label">{t("stepTime")}</span>
        {loading && <p className="text-sm text-ink-3" aria-live="polite">{t("loadingSlots")}</p>}
        {!loading && data?.closed && <p className="text-sm text-ink-2">{t("closedDay")}</p>}
        {!loading && data && !data.closed && (data.blocked || slots.every((s) => !s.available)) && (
          <p className="text-sm text-ink-2">{t("noSlots")} <a href={`tel:${site.phoneHref}`} className="font-semibold text-navy">{site.phone}</a></p>
        )}
        {!loading && data && !data.closed && !data.blocked && slots.some((s) => s.available) && (
          <div className="space-y-4" role="group" aria-labelledby="rs-time-label">
            {[lunch, dinner].map((group, gi) =>
              group.length ? (
                <div key={gi} className="flex flex-wrap gap-1.5">
                  {group.map((s) => (
                    <button
                      key={s.time}
                      type="button"
                      disabled={!s.available}
                      aria-pressed={time === s.time}
                      onClick={() => setTime(s.time)}
                      className="chip min-w-[4.5rem]"
                    >
                      {s.time}
                    </button>
                  ))}
                </div>
              ) : null
            )}
          </div>
        )}
      </div>

      {/* 3. Angaben */}
      <fieldset className="grid gap-5 sm:grid-cols-2" disabled={!time}>
        <legend className="label mb-3">{t("stepDetails")}</legend>
        <div>
          <label className="label" htmlFor="rs-name">{t("name")}</label>
          <input id="rs-name" name="name" autoComplete="name" required minLength={2} className="field" aria-invalid={errorKey === "nameRequired"} />
        </div>
        <div>
          <label className="label" htmlFor="rs-phone">{t("phone")}</label>
          <input id="rs-phone" name="phone" type="tel" autoComplete="tel" required className="field" placeholder="+41 79 000 00 00" aria-invalid={errorKey === "phoneInvalid"} />
        </div>
        <div>
          <label className="label" htmlFor="rs-email">{t("email")}</label>
          <input id="rs-email" name="email" type="email" autoComplete="email" required className="field" aria-invalid={errorKey === "emailInvalid"} />
        </div>
        <div>
          <label className="label" htmlFor="rs-occasion">{t("occasion")}</label>
          <select id="rs-occasion" name="occasion" className="field" defaultValue="">
            <option value="">{t("occasionOptions.none")}</option>
            <option value="birthday">{t("occasionOptions.birthday")}</option>
            <option value="business">{t("occasionOptions.business")}</option>
            <option value="family">{t("occasionOptions.family")}</option>
            <option value="other">{t("occasionOptions.other")}</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="rs-notes">{t("notes")}</label>
          <textarea id="rs-notes" name="notes" rows={3} className="field" placeholder={t("notesHint")} maxLength={1000} />
        </div>
        <div className="sm:col-span-2">
          <label className="flex items-start gap-3 text-sm text-ink-2">
            <input id="rs-consent" name="consent" type="checkbox" required className="mt-1 h-4 w-4 accent-navy" />
            <span>
              {t.rich("privacy", {
                link: (chunks) => <Link href="/datenschutz" className="font-semibold text-navy underline decoration-gold underline-offset-2">{chunks}</Link>,
              })}
            </span>
          </label>
        </div>
      </fieldset>

      {errorKey && (
        <p className="border-l-4 border-ikat bg-ivory px-4 py-3 text-sm font-semibold text-ikat" role="alert">
          {t(`errors.${errorKey}`)}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={!time || pending} className="btn btn-gold disabled:cursor-not-allowed disabled:opacity-50">
          {pending ? t("submitting") : t("submit")}
        </button>
        {time && (
          <p className="text-sm text-ink-2" aria-live="polite">
            <strong className="text-navy">{t("summary")}:</strong> {day} · {time} · {t("guests", { count: guests })}
          </p>
        )}
      </div>
    </form>
  );
}
