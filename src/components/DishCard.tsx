import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { formatPrice, type MenuItem } from "@/data/menu";
import { DISH_IMAGES_ARE_PLACEHOLDERS } from "@/data/images";
import { PlaceholderBadge } from "./PlaceholderBadge";

const TAG_STYLES: Record<string, string> = {
  signature: "bg-gold text-navy",
  spicy: "bg-ikat text-ivory",
  vegan: "bg-teal text-ivory",
  vegetarian: "bg-teal text-ivory",
  sharing: "bg-navy text-ivory",
  handmade: "bg-sand text-navy",
};

export function DishCard({ item, priority = false }: { item: MenuItem; priority?: boolean }) {
  const locale = useLocale() as Locale;
  const t = useTranslations();
  return (
    <article className="group flex flex-col bg-ivory-2 shadow-soft">
      {item.image && (
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={item.image}
            alt={item.name[locale]}
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            priority={priority}
          />
          {DISH_IMAGES_ARE_PLACEHOLDERS && <PlaceholderBadge />}
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="display text-[1.15rem] text-navy">{item.name[locale]}</h3>
          <span className="tabular shrink-0 text-sm font-semibold text-ink-2">{formatPrice(item.price)}</span>
        </div>
        {item.original && <p className="mt-0.5 text-xs italic text-ink-3">{item.original}</p>}
        <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-2">{item.description[locale]}</p>
        {item.tags && item.tags.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <li key={tag} className={`rounded-sm px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.1em] ${TAG_STYLES[tag]}`}>
                {t(`tags.${tag}`)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
