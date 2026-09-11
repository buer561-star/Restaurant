"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { formatPrice, type MenuSection, type Tag } from "@/data/menu";
import { DISH_IMAGES_ARE_PLACEHOLDERS } from "@/data/images";
import { PlaceholderBadge } from "./PlaceholderBadge";

type Filter = "all" | "veg" | "spicy" | "signature";

const TAG_DOT: Record<Tag, string> = {
  signature: "bg-gold",
  spicy: "bg-ikat",
  vegan: "bg-teal",
  vegetarian: "bg-teal",
  sharing: "bg-navy",
  handmade: "bg-sand-2",
};

export function MenuBrowser({ sections }: { sections: MenuSection[] }) {
  const locale = useLocale() as Locale;
  const t = useTranslations();
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    return sections
      .map((s) => ({
        ...s,
        items: s.items.filter((i) => {
          const tags = i.tags ?? [];
          if (filter === "veg") return tags.includes("vegan") || tags.includes("vegetarian");
          if (filter === "spicy") return tags.includes("spicy");
          if (filter === "signature") return tags.includes("signature");
          return true;
        }),
      }))
      .filter((s) => s.items.length > 0);
  }, [sections, filter]);

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: t("menu.filterAll") },
    { id: "signature", label: t("menu.filterSignature") },
    { id: "veg", label: t("menu.filterVegetarian") },
    { id: "spicy", label: t("menu.filterSpicy") },
  ];

  return (
    <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
      {/* Sprungnavigation */}
      <aside className="no-print lg:sticky lg:top-24 lg:self-start">
        <p className="eyebrow">{t("menu.jumpTo")}</p>
        <nav className="mt-3 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-0 lg:overflow-visible" aria-label={t("menu.jumpTo")}>
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="shrink-0 border-b border-transparent py-1.5 pr-3 text-sm font-semibold text-ink-2 hover:text-navy lg:border-line lg:py-2.5"
            >
              {s.title[locale]}
            </a>
          ))}
        </nav>
        <div className="mt-6 flex flex-wrap gap-2 lg:flex-col lg:items-start" role="group" aria-label="Filter">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className="chip !min-h-9 px-3 text-xs uppercase tracking-[0.08em]"
            >
              {f.label}
            </button>
          ))}
        </div>
      </aside>

      {/* Sektionen */}
      <div className="space-y-16">
        {filtered.length === 0 && <p className="text-ink-2">{t("menu.noResults")}</p>}
        {filtered.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-28">
            <div className="flex items-end justify-between gap-6 border-b-2 border-gold pb-3">
              <h2 className="display text-[1.6rem] text-navy sm:text-[1.9rem]">{s.title[locale]}</h2>
            </div>
            {s.intro && <p className="serif mt-4 max-w-2xl text-ink-2">{s.intro[locale]}</p>}
            <ul className="mt-6 divide-y divide-line">
              {s.items.map((item) => (
                <li key={item.id} className="grid gap-4 py-5 sm:grid-cols-[1fr_auto] sm:items-start">
                  <div className="flex gap-4">
                    {item.image && (
                      <div className="relative hidden h-24 w-32 shrink-0 overflow-hidden sm:block">
                        <Image src={item.image} alt={item.name[locale]} fill sizes="128px" className="object-cover" />
                        {DISH_IMAGES_ARE_PLACEHOLDERS && <PlaceholderBadge className="!left-1 !top-1 !px-1.5 !text-[0.5rem]" />}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="display text-[1.1rem] text-navy">
                        {item.name[locale]}
                        {item.original && <span className="ml-2 font-sans text-xs font-normal italic tracking-normal text-ink-3">{item.original}</span>}
                      </h3>
                      {item.description[locale] && <p className="mt-1.5 max-w-prose text-[0.95rem] leading-relaxed text-ink-2">{item.description[locale]}</p>}
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-ink-3">
                        {item.tags?.map((tag) => (
                          <span key={tag} className="flex items-center gap-1.5">
                            <span className={`h-1.5 w-1.5 rotate-45 ${TAG_DOT[tag]}`} aria-hidden="true" />
                            {t(`tags.${tag}`)}
                          </span>
                        ))}
                        {item.allergens && item.allergens.length > 0 && (
                          <span className="normal-case tracking-normal">
                            {t("allergens.title")}: {item.allergens.map((a) => t(`allergens.${a}`)).join(", ")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="tabular font-semibold text-navy sm:pt-1">{formatPrice(item.price)}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
        <p className="border-l-2 border-gold pl-4 text-sm text-ink-2">{t("allergens.note")}</p>
        <p className="text-xs text-ink-3">{t("common.pricesPlaceholder")} {t("menu.downloadHint")}</p>
      </div>
    </div>
  );
}
