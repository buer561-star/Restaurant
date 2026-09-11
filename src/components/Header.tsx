"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Logo } from "./Logo";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { site } from "@/data/site";

const navItems = [
  { href: "/speisekarte", key: "menu" },
  { href: "/ueber-uns", key: "about" },
  { href: "/gruppen-und-events", key: "events" },
  { href: "/galerie", key: "gallery" },
  { href: "/kontakt", key: "contact" },
] as const;

export function Header({ transparent = false }: { transparent?: boolean }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Menü schliessen, sobald navigiert wurde (State während des Renderns anpassen)
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = !transparent || scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        solid ? "bg-navy/95 shadow-soft backdrop-blur-md" : "bg-gradient-to-b from-navy/70 to-transparent"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-3 sm:h-18">
        <Link href="/" className="shrink-0">
          <Logo tone="light" />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Hauptnavigation">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`text-[0.85rem] font-semibold tracking-[0.06em] transition ${
                  active ? "text-gold" : "text-ivory/85 hover:text-ivory"
                }`}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <LocaleSwitcher tone="light" />
          <Link href="/reservation" className="btn btn-gold">
            {t("book")}
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Link href="/reservation" className="btn btn-gold hidden min-h-10 px-3 py-2 text-sm sm:inline-flex">
            {t("book")}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t("closeMenu") : t("openMenu")}
            className="flex h-10 w-10 items-center justify-center text-ivory"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-ivory/10 bg-navy lg:hidden"
      >
        <nav className="container-page flex flex-col py-4" aria-label="Mobile Navigation">
          <Link href="/" className="border-b border-ivory/10 py-3.5 text-lg font-semibold text-ivory">
            {t("home")}
          </Link>
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="border-b border-ivory/10 py-3.5 text-lg font-semibold text-ivory"
            >
              {t(item.key)}
            </Link>
          ))}
          <div className="flex items-center justify-between py-4">
            <LocaleSwitcher tone="light" />
            <a href={`tel:${site.phoneHref}`} className="text-sm font-semibold text-gold">
              {site.phone}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
