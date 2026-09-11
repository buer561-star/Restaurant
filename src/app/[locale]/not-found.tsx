import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/Header";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <>
      <Header />
      <main className="container-page flex flex-1 flex-col items-center justify-center py-40 text-center">
        <p className="eyebrow">404</p>
        <h1 className="display mt-3 text-3xl text-navy">{t("title")}</h1>
        <p className="serif mt-4 text-ink-2">{t("text")}</p>
        <Link href="/" className="btn btn-navy mt-8">{t("cta")}</Link>
      </main>
    </>
  );
}
