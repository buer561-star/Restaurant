import { defineConfig, devices } from "@playwright/test";

/**
 * E2E-Tests gegen den Standalone-Build (scripts/preview.sh) oder eine laufende Instanz.
 * BASE_URL überschreibt das Ziel, z.B. BASE_URL=https://karahan.up.railway.app
 */
const isLocal = /localhost|127\.0\.0\.1/.test(process.env.BASE_URL ?? "http://localhost");
const proxyServer = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;

export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  retries: 0,
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:3100",
    trace: "retain-on-failure",
    // Gegen eine Live-URL in einer Umgebung mit ausgehendem Proxy (HTTPS_PROXY) den Proxy explizit nutzen
    ignoreHTTPSErrors: !isLocal && Boolean(proxyServer),
    launchOptions: {
      executablePath: process.env.CHROMIUM_PATH || undefined,
      args: isLocal ? ["--no-proxy-server"] : [],
      proxy: !isLocal && proxyServer ? { server: proxyServer } : undefined,
    },
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
