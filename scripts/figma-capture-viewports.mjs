import { chromium } from 'playwright';

const BASE = 'http://localhost:5174/';

const captures = [
  {
    label: 'Desktop',
    width: 1440,
    height: 900,
    captureId: '27cd75be-f423-474e-b24f-eb5153927a19',
  },
  {
    label: 'Tablet',
    width: 768,
    height: 1024,
    captureId: '99a8290e-4741-4fde-9a6d-1c573862a44e',
  },
  {
    label: 'iPhone',
    width: 390,
    height: 844,
    captureId: 'f90f9275-814e-42e0-8f90-13a81ae8529a',
  },
];

function captureUrl(captureId) {
  const endpoint = encodeURIComponent(
    `https://mcp.figma.com/mcp/capture/${captureId}/submit`,
  );
  return `${BASE}#figmacapture=${captureId}&figmaendpoint=${endpoint}&figmadelay=2500`;
}

const browser = await chromium.launch({ headless: true });
const results = [];

for (const item of captures) {
  const context = await browser.newContext({
    viewport: { width: item.width, height: item.height },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  console.log(`Capturing ${item.label} (${item.width}x${item.height})...`);
  await page.goto(captureUrl(item.captureId), { waitUntil: 'networkidle' });
  await page.waitForTimeout(6000);

  const captureResult = await page.evaluate(async () => {
    if (typeof window.figma?.captureForDesign !== 'function') {
      return { ok: false, reason: 'captureForDesign unavailable' };
    }
    return { ok: true };
  });

  results.push({ ...item, captureResult });
  await context.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
