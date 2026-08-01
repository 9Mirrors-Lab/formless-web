import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "../../public/design/zoom-backgrounds");
const CHROME_PATH =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

/** Final downloadable size served on /zoom-backgrounds */
const OUT_WIDTH = 1920;
const OUT_HEIGHT = 1080;

const DEFAULT_JOBS = [
  "1a-charcoal-sanctuary-v2",
  "1b-misty-river-v2",
  "1d-moss-editorial-v2",
  "2a-dusk-horizon-v2",
  "2b-ghost-type-v2",
  "2c-golden-coast-v2",
  "3b-dusk-announcement-v2",
  "3c-corner-anchors-v2",
];

const jobs = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT_JOBS;

function resizeToHd(srcPath, destPath) {
  const result = spawnSync(
    "sips",
    ["-z", String(OUT_HEIGHT), String(OUT_WIDTH), srcPath, "--out", destPath],
    { encoding: "utf8" },
  );
  if (result.status !== 0) {
    throw new Error(
      `sips resize failed for ${srcPath}: ${result.stderr || result.stdout}`,
    );
  }
}

const browser = await puppeteer.launch({
  executablePath: CHROME_PATH,
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--font-render-hinting=none"],
});

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "zoom-export-"));

try {
  for (const id of jobs) {
    const htmlPath = path.resolve(__dirname, `export-${id}.html`);
    const outPath = path.resolve(OUT_DIR, `formless-zoom-${id}.png`);
    const tmpPath = path.join(tmpDir, `formless-zoom-${id}-4k.png`);
    const fileUrl = `file://${htmlPath}`;

    const page = await browser.newPage();
    // Designs are authored at 4K; capture full fidelity then downscale for Zoom HD.
    await page.setViewport({ width: 3840, height: 2160, deviceScaleFactor: 1 });

    console.log(`Exporting ${id} → ${OUT_WIDTH}×${OUT_HEIGHT}…`);
    await page.goto(fileUrl, { waitUntil: "networkidle2", timeout: 60000 });
    await page.evaluate(async () => {
      if (document.fonts?.ready) await document.fonts.ready;
    });
    await new Promise((r) => setTimeout(r, 800));

    const el = await page.$("#export");
    if (!el) throw new Error(`#export missing in ${id}`);
    await el.screenshot({ path: tmpPath, type: "png" });
    resizeToHd(tmpPath, outPath);

    console.log(`  → ${outPath}`);
    await page.close();
  }
} finally {
  await browser.close();
  fs.rmSync(tmpDir, { recursive: true, force: true });
}

console.log("Done.");
