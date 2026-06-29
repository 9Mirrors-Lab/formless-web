/**
 * Eyes Closed Design — 1:1 live site capture into Figma.
 *
 * Source of truth: production routes in formless-web/src (/, /work, /book, /science, /about).
 * Do NOT hand-rebuild from DESIGN.md or /revised — capture the running dev server instead.
 *
 * File: https://www.figma.com/design/mA96W2OGNZzOO8zmlmjTpE
 *
 * Workflow:
 *   1. npm run dev  (default http://localhost:5173)
 *   2. generate_figma_design(fileKey) once per route × viewport → captureIds
 *   3. node scripts/figma-capture-all-pages.mjs  (reads design/figma/capture-manifest.json)
 *   4. Poll each captureId with generate_figma_design until status completed
 *
 * Manifest: design/figma/capture-manifest.json
 * Handoff:  design/figma/CAPTURE-HANDOFF.md  ← resume here
 * Script:   scripts/figma-capture-all-pages.mjs
 *
 * @deprecated REBUILD_SINGLE_CALL — hand-authored layers; do not use for 1:1 site mirror.
 */

export const FIGMA_FILE_KEY = 'mA96W2OGNZzOO8zmlmjTpE';
export const FIGMA_FILE_URL = 'https://www.figma.com/design/mA96W2OGNZzOO8zmlmjTpE';

/** Live routes to capture (formless-web/src/PublicShell.tsx). */
export const LIVE_ROUTES = ['/', '/work', '/book', '/science', '/about'];

export const VIEWPORTS = [
  { label: 'Desktop', width: 1440, height: 900 },
  { label: 'Tablet', width: 768, height: 1024 },
  { label: 'Mobile', width: 390, height: 844 },
];

export const CAPTURE_MANIFEST_PATH = 'design/figma/capture-manifest.json';
export const CAPTURE_HANDOFF_PATH = 'design/figma/CAPTURE-HANDOFF.md';
export const CAPTURE_SCRIPT_PATH = 'scripts/figma-capture-all-pages.mjs';
export const DEV_BASE_URL = 'http://localhost:5173';

/** @deprecated Hand rebuild node IDs from wrong approach — ignore. */
export const FIGMA_NODE_IDS = {
  websitePageId: '3:2',
  desktopWrapperId: '3:9',
  mobileWrapperId: '3:56',
  sections: {
    navbar: '3:10',
    hero: '3:20',
    curtain: '3:30',
    footer: '3:38',
  },
  variables: {
    moss: 'VariableID:3:5',
    clay: 'VariableID:3:6',
    cream: 'VariableID:3:7',
    charcoal: 'VariableID:3:8',
  },
};
export const WEBSITE_PAGE_NAME = 'website';
export const ARCHIVE_PAGE_NAME = '_archive_flattened';

/** Budget rules for agents working on this project. */
export const MCP_BUDGET = {
  monthlyLimit: 'Starter plan — batch generate_figma_design calls; poll after Playwright submit',
  seat: 'Full on Figma Starter (Ryan Riley team)',
  rules: [
    'Capture live pages only — never hand-draw from tokens or /revised.',
    'One generate_figma_design call per route × viewport for captureId.',
    'Run scripts/figma-capture-all-pages.mjs after updating capture-manifest.json.',
    'Poll each captureId until completed before requesting new IDs.',
    'Real mobile captures required — no placeholder note frames.',
  ],
  forbiddenDuringCapture: [],
};

/**
 * ONE MCP call — full rebuild: pages, tokens, archive flats, desktop homepage layers.
 * Returns node IDs for any follow-up work in a future month.
 */
export const REBUILD_SINGLE_CALL = {
  id: 'rebuild-all',
  description: 'Full layered website rebuild in a single use_figma call (1 MCP credit)',
  expectedMcpCalls: 1,
  code: `
const WEBSITE = 'website';
const ARCHIVE = '_archive_flattened';
const createdNodeIds = [];
const mutatedNodeIds = [];

function hexToRgb(hex) {
  const n = hex.replace('#', '');
  return {
    r: parseInt(n.slice(0, 2), 16) / 255,
    g: parseInt(n.slice(2, 4), 16) / 255,
    b: parseInt(n.slice(4, 6), 16) / 255,
  };
}

function solid(hex, opacity = 1) {
  const c = hexToRgb(hex);
  return [{ type: 'SOLID', color: c, opacity }];
}

// --- Pages + archive flattened captures ---
let websitePage = figma.root.children.find((p) => p.name === WEBSITE);
if (!websitePage) {
  websitePage = figma.createPage();
  websitePage.name = WEBSITE;
  createdNodeIds.push(websitePage.id);
}

let archivePage = figma.root.children.find((p) => p.name === ARCHIVE);
if (!archivePage) {
  archivePage = figma.createPage();
  archivePage.name = ARCHIVE;
  createdNodeIds.push(archivePage.id);
}

await figma.setCurrentPageAsync(archivePage);
let heroImageHash = null;
for (const page of figma.root.children) {
  if (page.id === websitePage.id || page.id === archivePage.id) continue;
  for (const child of [...page.children]) {
    if (child.type === 'FRAME' || child.type === 'SECTION') {
      if (!heroImageHash) {
        figma.skipInvisibleInstanceChildren = true;
        for (const node of child.findAll(() => true)) {
          if (!('fills' in node) || !Array.isArray(node.fills)) continue;
          const fill = node.fills.find((f) => f.type === 'IMAGE' && f.imageHash);
          if (fill && node.width >= 400) {
            heroImageHash = fill.imageHash;
            break;
          }
        }
      }
      archivePage.appendChild(child);
      mutatedNodeIds.push(child.id);
    }
  }
}

await figma.setCurrentPageAsync(websitePage);

// Remove prior layered rebuild if re-running
for (const child of [...websitePage.children]) {
  if (child.name.startsWith('Homepage /')) child.remove();
}

// --- Color variables ---
const existingCollections = await figma.variables.getLocalVariableCollectionsAsync();
let tokens = existingCollections.find((c) => c.name === 'Eyes Closed / Core');
if (!tokens) {
  tokens = figma.variables.createVariableCollection('Eyes Closed / Core');
  tokens.renameMode(tokens.modes[0].modeId, 'Light');
  createdNodeIds.push(tokens.id);
}
const modeId = tokens.modes[0].modeId;
const variableIds = {};
for (const def of [
  { name: 'color/moss', hex: '#2e4036' },
  { name: 'color/clay', hex: '#cc5833' },
  { name: 'color/cream', hex: '#f2f0e9' },
  { name: 'color/charcoal', hex: '#1a1a1a' },
]) {
  let v = (await figma.variables.getLocalVariablesAsync()).find(
    (x) => x.variableCollectionId === tokens.id && x.name === def.name,
  );
  if (!v) {
    v = figma.variables.createVariable(def.name, tokens, 'COLOR');
    v.scopes = ['ALL_FILLS', 'STROKE_COLOR'];
    createdNodeIds.push(v.id);
  }
  v.setValueForMode(modeId, { ...hexToRgb(def.hex), a: 1 });
  variableIds[def.name] = v.id;
}

// --- Fonts ---
const fonts = await figma.listAvailableFontsAsync();
const serifFamily = fonts.some((f) => f.fontName.family === 'Cormorant Garamond')
  ? 'Cormorant Garamond'
  : 'Times New Roman';
const sansFamily = fonts.some((f) => f.fontName.family === 'Plus Jakarta Sans')
  ? 'Plus Jakarta Sans'
  : 'Inter';
const serifItalic = fonts.some(
  (f) => f.fontName.family === serifFamily && f.fontName.style === 'Light Italic',
)
  ? 'Light Italic'
  : 'Italic';
await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
await figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' });
await figma.loadFontAsync({ family: serifFamily, style: serifItalic });
await figma.loadFontAsync({ family: serifFamily, style: 'Italic' });
await figma.loadFontAsync({ family: sansFamily, style: 'Light' });
await figma.loadFontAsync({ family: sansFamily, style: 'Regular' });

function mkText(name, characters, size, family, style, colorHex, opacity = 1, width) {
  const t = figma.createText();
  t.name = name;
  t.characters = characters;
  t.fontSize = size;
  t.fontName = { family, style };
  t.fills = solid(colorHex, opacity);
  if (width) {
    t.textAutoResize = 'HEIGHT';
    t.resize(width, t.height);
  }
  createdNodeIds.push(t.id);
  return t;
}

// --- Desktop wrapper ---
let maxX = 0;
for (const child of websitePage.children) {
  maxX = Math.max(maxX, child.x + child.width);
}

const desktop = figma.createAutoLayout('VERTICAL');
desktop.name = 'Homepage / Desktop — 1440';
desktop.resize(1440, 100);
desktop.layoutSizingHorizontal = 'FIXED';
desktop.layoutSizingVertical = 'HUG';
desktop.itemSpacing = 0;
desktop.fills = solid('#f2f0e9');
desktop.x = maxX + 200;
desktop.y = 0;
desktop.clipsContent = true;
createdNodeIds.push(desktop.id);

// --- Navbar ---
const navSection = figma.createFrame();
navSection.name = 'Section / Navbar';
navSection.resize(1440, 112);
navSection.fills = [];
const scrim = figma.createRectangle();
scrim.name = 'Nav / gradient scrim';
scrim.resize(1440, 112);
scrim.fills = [{
  type: 'GRADIENT_LINEAR',
  gradientTransform: [[0, 1, 0], [-1, 0, 1]],
  gradientStops: [
    { position: 0, color: { r: 0.102, g: 0.102, b: 0.102, a: 0.75 } },
    { position: 0.55, color: { r: 0.102, g: 0.102, b: 0.102, a: 0.35 } },
    { position: 1, color: { r: 0.102, g: 0.102, b: 0.102, a: 0 } },
  ],
}];
navSection.appendChild(scrim);

const bar = figma.createAutoLayout('HORIZONTAL');
bar.name = 'Nav / bar';
bar.resize(1440, 92);
bar.paddingLeft = 96;
bar.paddingRight = 96;
bar.paddingTop = 24;
bar.paddingBottom = 24;
bar.primaryAxisAlignItems = 'CENTER';
bar.counterAxisAlignItems = 'CENTER';
bar.primaryAxisSizingMode = 'FIXED';
bar.counterAxisSizingMode = 'FIXED';
bar.itemSpacing = 16;
bar.fills = [];

const logo = mkText('Nav / logo wordmark', 'EYES CLOSED', 14, 'Inter', 'Semi Bold', '#f2f0e9', 0.95);
logo.letterSpacing = { unit: 'PERCENT', value: 18 };
bar.appendChild(logo);

const links = figma.createAutoLayout('HORIZONTAL');
links.name = 'Nav / links';
links.itemSpacing = 12;
links.layoutGrow = 1;
links.primaryAxisAlignItems = 'CENTER';
links.counterAxisAlignItems = 'CENTER';
links.fills = [];
for (const label of ['The Practice', 'Formless', 'Spirituality & Science']) {
  const l = mkText('Nav / link — ' + label, label.toUpperCase(), 11, 'Inter', 'Semi Bold', '#f2f0e9', 0.75);
  l.letterSpacing = { unit: 'PERCENT', value: 20 };
  links.appendChild(l);
}
bar.appendChild(links);

const aboutBtn = figma.createAutoLayout('HORIZONTAL');
aboutBtn.name = 'Nav / CTA — About';
aboutBtn.paddingLeft = 20;
aboutBtn.paddingRight = 20;
aboutBtn.paddingTop = 10;
aboutBtn.paddingBottom = 10;
aboutBtn.cornerRadius = 999;
aboutBtn.fills = solid('#2e4036');
const aboutText = mkText('Nav / CTA label', 'ABOUT', 11, 'Inter', 'Semi Bold', '#ffffff');
aboutText.letterSpacing = { unit: 'PERCENT', value: 15 };
aboutBtn.appendChild(aboutText);
bar.appendChild(aboutBtn);

navSection.appendChild(bar);
bar.x = 0;
bar.y = 0;
desktop.appendChild(navSection);
createdNodeIds.push(navSection.id, scrim.id, bar.id, links.id, aboutBtn.id);

// --- Hero ---
const hero = figma.createFrame();
hero.name = 'Section / Hero';
hero.resize(1440, 900);
hero.clipsContent = true;
hero.fills = solid('#1a1a1a');

const bg = figma.createRectangle();
bg.name = 'Hero / background image';
bg.resize(1440, 900);
bg.fills = heroImageHash
  ? [{ type: 'IMAGE', imageHash: heroImageHash, scaleMode: 'FILL' }]
  : solid('#2e4036');
hero.appendChild(bg);

const overlayMultiply = figma.createRectangle();
overlayMultiply.name = 'Hero / overlay multiply';
overlayMultiply.resize(1440, 900);
overlayMultiply.fills = [{
  type: 'GRADIENT_LINEAR',
  gradientTransform: [[0, 1, 0], [-1, 0, 1]],
  gradientStops: [
    { position: 0, color: { r: 0.102, g: 0.102, b: 0.102, a: 1 } },
    { position: 0.42, color: { r: 0.18, g: 0.251, b: 0.212, a: 0.6 } },
    { position: 1, color: { r: 0.102, g: 0.102, b: 0.102, a: 0.3 } },
  ],
}];
overlayMultiply.blendMode = 'MULTIPLY';
hero.appendChild(overlayMultiply);

const overlayRead = figma.createRectangle();
overlayRead.name = 'Hero / overlay readability';
overlayRead.resize(1440, 900);
overlayRead.fills = [{
  type: 'GRADIENT_LINEAR',
  gradientTransform: [[1, 0, 0], [0, 1, 0]],
  gradientStops: [
    { position: 0, color: { r: 0.102, g: 0.102, b: 0.102, a: 0.55 } },
    { position: 0.38, color: { r: 0.102, g: 0.102, b: 0.102, a: 0.2 } },
    { position: 0.68, color: { r: 0.102, g: 0.102, b: 0.102, a: 0 } },
  ],
}];
hero.appendChild(overlayRead);

const content = figma.createAutoLayout('VERTICAL');
content.name = 'Hero / content';
content.resize(560, 400);
content.x = 96;
content.y = 420;
content.itemSpacing = 16;
content.fills = [];

const eyebrow = mkText('Hero / eyebrow', 'PEACE IS YOUR NATURAL STATE.', 12, 'Inter', 'Regular', '#f2f0e9', 0.6);
eyebrow.letterSpacing = { unit: 'PERCENT', value: 30 };
content.appendChild(eyebrow);
content.appendChild(mkText('Hero / headline primary', 'Remembering Who You Are', 72, serifFamily, serifItalic, '#f2f0e9'));
content.appendChild(mkText('Hero / headline secondary', 'Beyond The Mind', 72, serifFamily, serifItalic, '#f2f0e9'));
const lede = mkText(
  'Hero / lede',
  'The world teaches you to look outward for fulfillment.\\nEyes Closed points you inward.',
  18,
  sansFamily,
  'Light',
  '#f2f0e9',
  0.6,
  520,
);
lede.lineHeight = { unit: 'PERCENT', value: 160 };
content.appendChild(lede);
const cta = mkText('Hero / CTA', 'A MOMENT TO GO WITHIN ↓', 11, 'Inter', 'Regular', '#f2f0e9', 0.7);
cta.letterSpacing = { unit: 'PERCENT', value: 20 };
content.appendChild(cta);
hero.appendChild(content);
desktop.appendChild(hero);
createdNodeIds.push(hero.id, bg.id, overlayMultiply.id, overlayRead.id, content.id);

// --- Curtain ---
const curtain = figma.createFrame();
curtain.name = 'Section / Curtain Reveal';
curtain.resize(1440, 720);
curtain.fills = solid('#1a1a1a');
curtain.clipsContent = true;

const center = figma.createAutoLayout('VERTICAL');
center.name = 'Curtain / center copy';
center.resize(800, 320);
center.x = 320;
center.y = 200;
center.itemSpacing = 24;
center.primaryAxisAlignItems = 'CENTER';
center.counterAxisAlignItems = 'CENTER';
center.fills = [];

const headline = mkText(
  'Curtain / headline',
  'Freedom begins the moment you separate yourself from your thoughts\\nand simply observe the mind',
  56,
  serifFamily,
  'Italic',
  '#f2f0e9',
  1,
  760,
);
headline.textAlignHorizontal = 'CENTER';
center.appendChild(headline);
const subtitle = mkText(
  'Curtain / subtitle',
  'Behind every thought is the awareness that sees it. That awareness is what you are, untouched and unharmed by any experience of life.',
  18,
  sansFamily,
  'Regular',
  '#f2f0e9',
  0.7,
  640,
);
subtitle.textAlignHorizontal = 'CENTER';
subtitle.lineHeight = { unit: 'PERCENT', value: 160 };
center.appendChild(subtitle);
curtain.appendChild(center);

function curtainPanel(name, label, side) {
  const p = figma.createFrame();
  p.name = name;
  p.resize(720, 720);
  p.y = 0;
  p.x = side === 'left' ? 0 : 720;
  p.fills = solid('#f2f0e9');
  const t = mkText(name + ' label', label, 120, serifFamily, 'Italic', '#1a1a1a', 0.8);
  t.x = side === 'left' ? 520 : 40;
  t.y = 300;
  p.appendChild(t);
  curtain.appendChild(p);
  createdNodeIds.push(p.id);
}

curtainPanel('Curtain / panel left', 'THE', 'left');
curtainPanel('Curtain / panel right', 'MIND', 'right');
desktop.appendChild(curtain);
createdNodeIds.push(curtain.id, center.id);

// --- Footer ---
const footer = figma.createAutoLayout('VERTICAL');
footer.name = 'Section / Footer';
footer.resize(1440, 420);
footer.paddingLeft = 96;
footer.paddingRight = 96;
footer.paddingTop = 96;
footer.paddingBottom = 48;
footer.itemSpacing = 48;
footer.fills = solid('#1a1a1a');

const top = figma.createAutoLayout('HORIZONTAL');
top.name = 'Footer / top';
top.itemSpacing = 120;
top.fills = [];

const brandCol = figma.createAutoLayout('VERTICAL');
brandCol.itemSpacing = 16;
brandCol.fills = [];
const brand = mkText('Footer / brand', 'EYES CLOSED', 20, 'Inter', 'Semi Bold', '#f2f0e9');
brand.letterSpacing = { unit: 'PERCENT', value: 20 };
brandCol.appendChild(brand);
const tagline = mkText(
  'Footer / tagline',
  'An invitation to go within and meet yourself beyond the identities and stories.',
  18,
  serifFamily,
  'Italic',
  '#f2f0e9',
  0.5,
  360,
);
brandCol.appendChild(tagline);
top.appendChild(brandCol);

const linksRow = figma.createAutoLayout('HORIZONTAL');
linksRow.itemSpacing = 96;
linksRow.fills = [];
for (const [heading, items] of [
  ['Explore', ['The Practice', 'Formless', 'Spirituality & Science']],
  ['Connect', ['About', 'Connect', 'Contact']],
]) {
  const col = figma.createAutoLayout('VERTICAL');
  col.itemSpacing = 12;
  col.fills = [];
  const h = mkText('Footer / ' + heading.toLowerCase() + ' heading', heading.toUpperCase(), 11, 'Inter', 'Regular', '#f2f0e9', 0.4);
  col.appendChild(h);
  for (const item of items) {
    col.appendChild(mkText('Footer / link — ' + item, item, 14, sansFamily, 'Regular', '#f2f0e9', 0.7));
  }
  linksRow.appendChild(col);
  createdNodeIds.push(col.id);
}
top.appendChild(linksRow);
footer.appendChild(top);
top.layoutSizingHorizontal = 'FILL';

const legal = figma.createAutoLayout('HORIZONTAL');
legal.name = 'Footer / legal';
legal.primaryAxisAlignItems = 'SPACE_BETWEEN';
legal.paddingTop = 32;
legal.strokes = [{ type: 'SOLID', color: { r: 0.949, g: 0.941, b: 0.914 }, opacity: 0.1 }];
legal.strokeTopWeight = 1;
legal.fills = [];
legal.appendChild(mkText('Footer / copyright', '© 2026 Eyes Closed. All rights reserved.', 11, 'Inter', 'Regular', '#f2f0e9', 0.5));
footer.appendChild(legal);
legal.layoutSizingHorizontal = 'FILL';
desktop.appendChild(footer);
createdNodeIds.push(footer.id, top.id, legal.id);

// --- Mobile stub (same call, no extra MCP) ---
const mobile = figma.createAutoLayout('VERTICAL');
mobile.name = 'Homepage / Mobile — 390';
mobile.resize(390, 100);
mobile.layoutSizingHorizontal = 'FIXED';
mobile.layoutSizingVertical = 'HUG';
mobile.itemSpacing = 0;
mobile.fills = solid('#f2f0e9');
mobile.x = desktop.x + desktop.width + 200;
mobile.y = 0;
mobile.clipsContent = true;
mobile.paddingTop = 24;
mobile.paddingLeft = 20;
mobile.paddingRight = 20;
const mobileNote = mkText(
  'Mobile / note',
  'Expand: duplicate desktop sections at 390px. Nav = wordmark + menu. Hero = copy-led.',
  12,
  'Inter',
  'Regular',
  '#666666',
  1,
  350,
);
mobile.appendChild(mobileNote);
createdNodeIds.push(mobile.id);

// Inline screenshot (no extra MCP read call)
await desktop.screenshot({ scale: 0.35 });

return {
  ok: true,
  mcpCallsUsed: 1,
  websitePageId: websitePage.id,
  desktopWrapperId: desktop.id,
  mobileWrapperId: mobile.id,
  heroImageHash,
  variableIds,
  sectionIds: {
    navbar: navSection.id,
    hero: hero.id,
    curtain: curtain.id,
    footer: footer.id,
  },
  createdCount: createdNodeIds.length,
  mutatedCount: mutatedNodeIds.length,
  createdNodeIds,
  mutatedNodeIds,
};
`.trim(),
};

/**
 * FALLBACK ONLY — 8 separate calls. Do not use unless REBUILD_SINGLE_CALL failed partway.
 * @deprecated Use REBUILD_SINGLE_CALL instead.
 */
export const REBUILD_STEPS = [];
