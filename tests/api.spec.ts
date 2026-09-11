import { test, expect } from "@playwright/test";

test("Health-Route antwortet", async ({ request }) => {
  const res = await request.get("/api/health");
  expect(res.ok()).toBeTruthy();
  expect((await res.json()).ok).toBe(true);
});

test("Verfügbarkeit lehnt ungültige Parameter ab", async ({ request }) => {
  expect((await request.get("/api/availability?day=2020-01-01&guests=2")).status()).toBe(400);
  expect((await request.get("/api/availability?day=2099-01-01&guests=99")).status()).toBe(400);
});

test("Cron-Route ist geschützt", async ({ request }) => {
  expect((await request.get("/api/cron/reminders")).status()).toBe(401);
});
