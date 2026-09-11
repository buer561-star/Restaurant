import { chromium } from "@playwright/test";
const [,, url, out, w] = process.argv;
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--no-proxy-server"] });
const p = await b.newPage({ viewport: { width: Number(w||1280), height: 900 } });
await p.goto(url, { waitUntil: "load", timeout: 60000 });
await p.waitForTimeout(1500);
await p.screenshot({ path: out, fullPage: true });
await b.close();
