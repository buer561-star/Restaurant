import { defineConfig, devices } from "@playwright/test";

/**
 * E2E-Tests gegen den Standalone-Build (scripts/preview.sh) oder eine laufende Instanz.
 * BASE_URL überschreibt das Ziel, z.B. BASE_URL=https://karahan.up.railway.app
 */
export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  retries: 0,
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:3100",
    trace: "retain-on-failure",
    launchOptions: { executablePath: process.env.CHROMIUM_PATH || undefined, args: ["--no-proxy-server"] },
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
