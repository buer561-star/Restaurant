"use client";

import { useActionState } from "react";
import { login } from "@/app/[locale]/admin/actions";

export function AdminLogin() {
  const [state, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="mx-auto w-full max-w-sm bg-ivory-2 p-8 shadow-soft">
      <p className="eyebrow">Karahan</p>
      <h1 className="display mt-2 text-2xl text-navy">Admin</h1>
      <label className="label mt-6" htmlFor="admin-pw">Passwort</label>
      <input id="admin-pw" name="password" type="password" autoComplete="current-password" required className="field" />
      {state?.error && <p className="mt-3 text-sm font-semibold text-ikat" role="alert">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn btn-navy mt-6 w-full disabled:opacity-60">Anmelden</button>
    </form>
  );
}
