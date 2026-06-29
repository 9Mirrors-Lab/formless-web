/**
 * Playwright capture runner for Figma generate_figma_design.
 *
 * Prerequisite: populate design/figma/capture-manifest.json with captureIds
 * from generate_figma_design (one call per route × viewport).
 *
 * Usage:
 *   node scripts/figma-capture-all-pages.mjs
 *   BASE=http://localhost:5173 node scripts/figma-capture-all-pages.mjs
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = (process.env.BASE ?? 'http://localhost:5173').replace(/\/$/, '');
const MANIFEST_PATH = join(__dirname, '../design/figma/capture-manifest.json');

/** @type {{ fileKey: string; captures: { route: string; label: string; width: number; height: number; captureId: string }[] }} */
const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));

function captureUrl(route, captureId) {
  const endpoint = encodeURIComponent(
    `https://mcp.figma.com/mcp/capture/${captureId}/submit`,
  );
  const pageUrl = route === '/' ? `${BASE}/` : `${BASE}${route}`;
  return `${pageUrl}#figmacapture=${captureId}&figmaendpoint=${endpoint}&figmadelay=2500`;
}

const browser = await chromium.launch({ headless: true });
const results = [];

for (const item of manifest.captures) {
  const context = await browser.newContext({
    viewport: { width: item.width, height: item.height },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  const url = captureUrl(item.route, item.captureId);

  console.log(`Capturing ${item.route} ${item.label} (${item.width}x${item.height})...`);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(6000);

  const captureResult = await page.evaluate(async () => {
    if (typeof window.figma?.captureForDesign !== 'function') {
      return { ok: false, reason: 'captureForDesign unavailable' };
    }
    return { ok: true };
  });

  results.push({ ...item, url, captureResult });
  await context.close();
}

await browser.close();
console.log(JSON.stringify({ fileKey: manifest.fileKey, results }, null, 2));
