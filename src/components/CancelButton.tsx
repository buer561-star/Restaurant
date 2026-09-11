"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { cancelReservation } from "@/app/[locale]/reservation/actions";

export function CancelButton({ token }: { token: string }) {
  const t = useTranslations("reservation");
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <button
        type="button"
        disabled={pending}
        className="btn btn-outline border-ikat text-ikat hover:bg-ikat hover:text-ivory disabled:opacity-60"
        onClick={() => {
          if (!window.confirm(t("detail.cancelConfirm"))) return;
          start(async () => {
            const res = await cancelReservation(token);
            if (res.ok) router.refresh();
            else setError(res.error === "tooLate" ? t("detail.cancelTooLate") : t("errors.generic"));
          });
        }}
      >
        {pending ? t("submitting") : t("detail.cancel")}
      </button>
      {error && <p className="mt-3 text-sm font-semibold text-ikat" role="alert">{error}</p>}
    </div>
  );
}
