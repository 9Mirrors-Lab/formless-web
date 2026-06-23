import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const BASE_URL = process.env.SCREENSHOT_BASE_URL ?? 'http://localhost:5174';
const OUT_DIR =
  process.env.SCREENSHOT_OUT_DIR ??
  path.resolve('screenshots/responsive-audit');

const CHROME_PATH =
  process.env.CHROME_PATH ??
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const VIEWPORTS = [
  { id: 'desktop-xl', label: 'Desktop XL', width: 1440, height: 900 },
  { id: 'desktop', label: 'Desktop', width: 1280, height: 800 },
  { id: 'tablet-landscape', label: 'Tablet landscape', width: 1024, height: 768 },
  { id: 'tablet-portrait', label: 'Tablet portrait', width: 768, height: 1024 },
  { id: 'mobile-large', label: 'Mobile large', width: 414, height: 896 },
  { id: 'mobile', label: 'Mobile', width: 390, height: 844 },
  { id: 'mobile-small', label: 'Mobile small', width: 375, height: 667 },
];

const PAGES = [
  { id: 'home', path: '/', waitFor: '.home-hero' },
  { id: 'work', path: '/work', waitFor: '.work-title' },
  { id: 'book', path: '/book', waitFor: '.book-title' },
  { id: 'science', path: '/science', waitFor: '.sci-hero-text' },
  { id: 'about', path: '/about', waitFor: '#about-page-scope' },
];

function slug(value) {
  return value.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();
}

async function waitForPageReady(page, selector, timeout = 25000) {
  try {
    await page.waitForSelector(selector, { timeout });
  } catch {
    await page.waitForSelector('main, #main-content, #about-page-scope', { timeout: 8000 });
  }
  await page.evaluate(async () => {
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }
  });
  await new Promise((r) => setTimeout(r, 1200));
}

async function captureViewport(page, pageDef, viewport) {
  await page.setViewport({
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
  });

  const url = `${BASE_URL}${pageDef.path}`;
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
  await waitForPageReady(page, pageDef.waitFor);

  const dir = path.join(OUT_DIR, pageDef.id);
  fs.mkdirSync(dir, { recursive: true });

  const filename = `${viewport.id}-${viewport.width}x${viewport.height}.png`;
  const filepath = path.join(dir, filename);

  await page.screenshot({
    path: filepath,
    fullPage: true,
    captureBeyondViewport: true,
  });

  return {
    page: pageDef.id,
    viewport: viewport.id,
    label: viewport.label,
    size: `${viewport.width}x${viewport.height}`,
    file: path.relative(process.cwd(), filepath),
  };
}

async function main() {
  if (!fs.existsSync(CHROME_PATH)) {
    throw new Error(`Chrome not found at ${CHROME_PATH}`);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  const manifest = [];

  for (const pageDef of PAGES) {
    for (const viewport of VIEWPORTS) {
      const entry = await captureViewport(page, pageDef, viewport);
      manifest.push(entry);
      console.log(`Captured ${entry.file}`);
    }
  }

  const manifestPath = path.join(OUT_DIR, 'manifest.json');
  fs.writeFileSync(
    manifestPath,
    JSON.stringify(
      {
        capturedAt: new Date().toISOString(),
        baseUrl: BASE_URL,
        viewports: VIEWPORTS,
        pages: PAGES.map((p) => ({ id: p.id, path: p.path })),
        shots: manifest,
      },
      null,
      2,
    ),
  );

  await browser.close();
  console.log(`\nDone. ${manifest.length} screenshots in ${OUT_DIR}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
