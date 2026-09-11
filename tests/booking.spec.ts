import { test, expect } from "@playwright/test";

function inDays(n: number): string {
  const d = new Date(Date.now() + n * 86400000);
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Zurich" }).format(d);
}

/** Nächster Tag ab morgen, an dem geöffnet ist (Montag ist Ruhetag) */
function nextOpenDay(): string {
  for (let i = 1; i < 8; i++) {
    const d = new Date(Date.now() + i * 86400000);
    const wd = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Zurich", weekday: "short" }).format(d);
    if (wd !== "Mon") return inDays(i);
  }
  return inDays(2);
}

test.describe("Navigation und Sprachen", () => {
  test("Startseite auf Deutsch, Sprachwechsel auf Englisch und Türkisch", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Karahan/);
    await expect(page.locator("html")).toHaveAttribute("lang", "de");
    await page.goto("/en/menu");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Menu");
    await page.goto("/tr/rezervasyon");
    await expect(page.locator("html")).toHaveAttribute("lang", "tr");
  });

  test("Speisekarte zeigt Sektionen und Preise", async ({ page }) => {
    await page.goto("/speisekarte");
    await expect(page.getByRole("heading", { name: "Handgemachte Teigwaren" })).toBeVisible();
    await expect(page.getByText("CHF 24.50")).toBeVisible();
  });
});

test.describe("Reservation", () => {
  test("Buchung, Detailseite, Stornierung", async ({ page }) => {
    const day = nextOpenDay();
    await page.goto("/reservation");
    await page.locator("#rs-day").fill(day);
    await page.getByRole("button", { name: "4", exact: true }).click();

    // Ersten freien Slot wählen
    const slot = page.locator("button.chip[aria-pressed]:not([disabled])").filter({ hasText: /^\d{2}:\d{2}$/ }).first();
    await expect(slot).toBeVisible();
    const chosen = await slot.textContent();
    await slot.click();

    await page.locator("#rs-name").fill("Test Gast");
    await page.locator("#rs-phone").fill("+41 79 123 45 67");
    await page.locator("#rs-email").fill("test@example.com");
    await page.locator("#rs-notes").fill("Playwright-Test");
    await page.locator("#rs-consent").check();
    await page.getByRole("button", { name: "Verbindlich reservieren" }).click();

    await expect(page.getByRole("heading", { name: /Reserviert/ })).toBeVisible({ timeout: 20000 });

    // Detailseite
    await page.getByRole("link", { name: "Ihre Reservation" }).click();
    await expect(page.getByText("Test Gast")).toBeVisible();
    await expect(page.getByText(chosen!.trim(), { exact: true })).toBeVisible();
    await expect(page.getByText("Bestätigt", { exact: true })).toBeVisible();

    // Stornieren
    page.once("dialog", (d) => d.accept());
    await page.getByRole("button", { name: "Reservation stornieren" }).click();
    await expect(page.getByText("Storniert", { exact: true })).toBeVisible({ timeout: 15000 });
  });

  test("Ruhetag zeigt keine Zeiten", async ({ page }) => {
    // Nächster Montag
    let monday = "";
    for (let i = 1; i < 9; i++) {
      const d = new Date(Date.now() + i * 86400000);
      if (new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Zurich", weekday: "short" }).format(d) === "Mon") { monday = inDays(i); break; }
    }
    await page.goto("/reservation");
    await page.locator("#rs-day").fill(monday);
    await expect(page.getByText("An diesem Tag ist das Restaurant geschlossen.")).toBeVisible();
  });
});

test.describe("Admin", () => {
  test("Login und Tagesliste", async ({ page }) => {
    await page.goto("/admin");
    await page.locator("#admin-pw").fill(process.env.ADMIN_PASSWORD ?? "karahan-admin");
    await page.getByRole("button", { name: "Anmelden" }).click();
    await expect(page.getByRole("heading", { name: "Reservationen" })).toBeVisible();
    await page.getByRole("button", { name: "Abmelden" }).click();
    await expect(page.locator("#admin-pw")).toBeVisible();
  });
});
