"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";

const labels: Record<Locale, string> = { de: "DE", en: "EN", tr: "TR" };

export function LocaleSwitcher({ tone = "light" }: { tone?: "light" | "dark" }) {
  const locale = useLocale();
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();

  function switchTo(next: Locale) {
    // Keep dynamic params (e.g. reservation id) when switching
    router.replace(
      // @ts-expect-error -- pathname + params combination is validated by next-intl at runtime
      { pathname, params },
      { locale: next }
    );
  }

  const base = tone === "light" ? "text-ivory/70 hover:text-ivory" : "text-ink-2 hover:text-navy";
  const active = tone === "light" ? "text-gold" : "text-navy";

  return (
    <div className="flex items-center gap-1" role="group" aria-label={t("language")}>
      {locales.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && <span className={`mx-1 text-xs ${tone === "light" ? "text-ivory/30" : "text-line"}`}>/</span>}
          <button
            type="button"
            onClick={() => switchTo(l)}
            aria-current={l === locale ? "true" : undefined}
            className={`px-1 py-2 text-xs font-semibold tracking-[0.12em] transition ${l === locale ? active : base}`}
          >
            {labels[l]}
          </button>
        </span>
      ))}
    </div>
  );
}
