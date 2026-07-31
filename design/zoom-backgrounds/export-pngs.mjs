import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "../../public/design/zoom-backgrounds");
const CHROME_PATH =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const jobs = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ["2b-ghost-type", "3a-left-pillar"];

const browser = await puppeteer.launch({
  executablePath: CHROME_PATH,
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--font-render-hinting=none"],
});

for (const id of jobs) {
  const htmlPath = path.resolve(__dirname, `export-${id}.html`);
  const outPath = path.resolve(OUT_DIR, `formless-zoom-${id}.png`);
  const fileUrl = `file://${htmlPath}`;

  const page = await browser.newPage();
  await page.setViewport({ width: 3840, height: 2160, deviceScaleFactor: 1 });

  console.log(`Exporting ${id}…`);
  await page.goto(fileUrl, { waitUntil: "networkidle2", timeout: 60000 });
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  });
  await new Promise((r) => setTimeout(r, 800));

  const el = await page.$("#export");
  if (!el) throw new Error(`#export missing in ${id}`);
  await el.screenshot({ path: outPath, type: "png" });

  console.log(`  → ${outPath}`);
  await page.close();
}

await browser.close();
console.log("Done.");
