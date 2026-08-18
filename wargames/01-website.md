# BATTLE PLAN · 01-website — Eyes Closed Client Room prototype

Wargamed 2026-07-16 against the mission brief in `01.website.md`. Executor: run the moves in order. Every move tells you what you should see. If you see the failure instead, run the counter-move. If you hit an abort condition, stop and report — do not improvise.

---

## 0 · Settled recon (do not re-derive; cite these as fact)

All paths relative to repo root `/Users/m4/formless-web/`.

| Fact | Source |
|---|---|
| Catalog = 8 entries, 4 groups. In progress: `layout-tests` (Hero & section templates). Directions: `science-directions`, `about-layouts` (both external specimens), `colors` (Supporting page themes). Foundations: `design-system`, `icons`, `moodboard`. Atmosphere: `backgrounds`. Each entry has a one-line `intent` string — reuse those lines verbatim as the client-facing intent copy. | `src/data/designLabCatalog.ts` |
| Current nav to kill: 48px fixed bottom-right flask button (`FlaskConical` icon, `z-[90]`), opens a 20rem listbox. The prototype must never reproduce a corner-icon as primary wayfinding. | `src/components/design-lab/DesignLabPicker.tsx` |
| Brand tokens: page dark `#050806` / `#080a09`, panel `#0e120f`, cream `#f2f0e9` (text on dark), clay `#cc5833` (light mode) / `#d46544`–`#e07852` (dark), moss `#2e4036`, moss-soft/sage `#9fb5aa`, hairline `rgba(242,240,233,.12)`. | `src/index.css` `@theme`, `public/design/about-page-layouts.html` `:root` |
| Fonts: Cormorant Garamond (serif display, often italic light), Plus Jakarta Sans (body/UI), ui-monospace stack (eyebrows/labels, uppercase, tracking `.18em`–`.32em`). Google Fonts URL to copy is in the `<head>` of `public/design/about-page-layouts.html`. Inter/Roboto/Arial banned. | `index.html`, `DESIGN.md` §4 |
| Easing token: `cubic-bezier(0.16, 1, 0.3, 1)` everywhere. Motion is heavy and soft, 300–500ms UI. Banned: bounce, glow spam, purple gradients, bento grids, spinners, horizontal scroll on mobile. | `DESIGN.md` §8, §13 |
| `about-page-layouts.html` is 35KB plain HTML: four boards as `<section class="layout" data-layout="1..4">` with labels Editorial Split / Portrait Hero / Centered Manifesto / Magazine Sidebar, plus its OWN sticky top nav (the competing-chrome anti-pattern the brief bans). Safe to open and read for content. | `public/design/about-page-layouts.html` |
| `science-page-v2-directions.html` is a 1.8MB self-unpacking JS bundle. **DO NOT read this file into context** — it will waste your entire budget. View it in a browser only (Move 1), or take Fork A. Its three directions are named Vault / Atelier / Observatory Press. | file size check; `designLabCatalog.ts` intent line |
| Three dark-theme palettes exist as `--ex-*` CSS variable blocks (a base dark-green key, a moss/sage key with `#9fb5aa`, a colder teal key with `#7dccb0`). These are the "Supporting page themes" content for the themes stage. | `src/index.css` lines ~30–85 |
| `./site` does not exist yet — clean destination. `public/client/` holds only an unrelated SEO deck; ignore it. | dir listing 2026-07-16 |
| Operator directive (overrides boutique timidity): primary wayfinding must be BIG. Full-viewport overlay for the direction map is explicitly welcomed — "we have full real estate, we don't need to be shy." Clarity beats quietness whenever they conflict. | operator note, 2026-07-16 |

---

## 1 · Design directives (non-negotiable; check every page against these)

1. **Chrome is a top rail, on every page, always visible.** Left: small orbit logomark (lift the inline `.mark` SVG from `about-page-layouts.html`) + wordmark "Eyes Closed" + mono label "CLIENT ROOM". Right: `Index` link, an `All directions` button, and `Exit site ↗`. Center (stage pages only): mono eyebrow `YOU ARE HERE` + current direction name. Rail is sticky `top:0`, min tap target 44px, backdrop-blur over dark, hairline bottom border.
2. **`All directions` opens a full-viewport overlay** — the room's map. Dark field, the 4 groups as columns/rows, each direction a large serif target (≥ 1.5rem type on mobile, ≥ 2rem desktop) with its intent line and status chip, current direction marked "You are here". Close = visible ✕ button (top right, 44px) + `Escape` + click on backdrop. Overlay is scrollable if it overflows. This replaces the flask forever.
3. **Stages, not dumps.** Every direction opens a stage page: chrome rail → direction title block (mono eyebrow group name, serif italic title, intent line, status chip) → the work inside a **frame**. Three frame types only:
   - `frame-viewport`: a browser-chrome plate (hairline border, rounded ~1rem, three dots + mono URL label in a slim header bar) containing a recreated page composition.
   - `frame-plate`: a plain matted plate (padding, hairline border, panel background) for boards, swatches, marks.
   - `frame-boards`: a sequenced set of `frame-viewport`/`frame-plate` plates with a board switcher (see directive 4).
4. **Multi-board directions** (Science ×3, About ×4, Themes ×3): boards live in ONE stage page. Switcher = a row of labeled plate-tabs above the frame (board name in serif, index in mono, e.g. `01 — Vault`). Clicking swaps boards with a ~400ms crossfade inside the SAME frame (position: absolute stack, class toggle, transform+opacity only). No hash navigation, no scroll jump, no separate files per board.
5. **Graphic discipline.** Graphic-led stages (Science, Icons, Moodboard, Backgrounds) may lead with inline-SVG marks, field/torus diagrams, gradient atmosphere. Composition-led stages (Hero templates, About layouts, Themes, Foundations) get a quiet frame: type, spacing, swatches, and recreated compositions only. **Zero decorative filler:** if a quiet stage "needs something", it needs nothing.
6. **Motion budget: 2–3 moments per view, cap enforced.**
   - Page enter: chrome fades in (~250ms), then title block (~350ms, +60ms delay), then stage content (~450ms, +120ms delay). Transform+opacity only, easing `cubic-bezier(0.16,1,0.3,1)`.
   - Index only: plates stagger in (~40ms/plate, max ~400ms total). Hover = 1px hairline brighten + ≤4px lift. No bounce, no glow.
   - Board switch: crossfade per directive 4.
   - `@media (prefers-reduced-motion: reduce)`: everything instant, no stagger, no crossfade (hard swap).
7. **Mobile first, 375px is the contract.** Rail collapses to: mark + `CLIENT ROOM` label + `All directions` button (the overlay IS mobile nav). No horizontal scroll. No hidden floating buttons.
8. **Semantics:** `<header>` for the rail, `<main>` for content, `<nav aria-label="Client room">` in rail + overlay, one `<h1>` per page, `alt` on every `<img>` (expect zero `<img>` — everything is inline SVG with `role="img"` + `aria-label`, or `aria-hidden` if decorative), overlay is `role="dialog" aria-modal="true"` with focus moved to it on open and returned on close.

---

## 2 · File map (create exactly this; nothing more)

```
site/
  index.html                 client room hub
  css/room.css               all shared styles (tokens, chrome, frames, motion)
  js/room.js                 plain script (NO type="module"): overlay, board switcher, enter-reveal
  stages/
    hero-templates.html      In progress · composition-led
    science.html             Directions · graphic-led · 3 boards
    about-layouts.html       Directions · composition-led · 4 boards
    themes.html              Directions · composition-led · 3 boards
    foundations.html         Foundations · composition-led
    icons.html               Foundations · graphic-led
    moodboard.html           Foundations · graphic-led
    backgrounds.html         Atmosphere · graphic-led
```

Rules: every link is **relative** (`stages/science.html`, `../index.html`). One `<link>` to Google Fonts per page with full fallback stacks (`"Cormorant Garamond", Georgia, serif` etc.). No fetch(), no imports, no build step, no external JS. `Exit site ↗` points to `https://eyesclosed.love`.

---

## 3 · Moves

Each move: **Do → Expect → If instead / because / then.**

### Move 1 — Recon the two specimens in a browser (read-only)

**Do:** Open `public/design/about-page-layouts.html` and `public/design/science-page-v2-directions.html` in a browser (`open <path>` on macOS, or via any static server). Note, for each board: composition skeleton, hero treatment, palette accents. Read `DESIGN.md` §2–§11 once. Do NOT read the science HTML file as text.
**Expect:** About shows 4 layout studies behind its own top nav. Science unpacks (may take seconds) into 3 dark directions.
**If instead** science shows "Unpacking…" forever or a bundle error banner, **because** the self-unpacking bundle needs capabilities `file://` doesn't grant, **then** take **Fork A**.

### Move 2 — Scaffold `site/` and build `room.css`

**Do:** Create the file map from §2. In `room.css` define `:root` tokens copied from recon facts (bg `#050806`, panel `#0e120f`, cream, clay `#d46544`, sage `#9fb5aa`, hairlines, the three font stacks, the easing as `--ease`). Add the noise texture only if trivially done via an inline SVG `feTurbulence` data-URI background at ~4% opacity; otherwise skip it (it is optional atmosphere, not a requirement).
**Expect:** Opening any stub via `file://` shows a dark cream-on-ink page with correct serif rendering.
**If instead** fonts render as Times/system, **because** Google Fonts link is missing/typo'd or you are offline, **then** verify the `<link>` matches the one in `public/design/about-page-layouts.html` head; if genuinely offline, the Georgia/system fallbacks are acceptable — note it in the final report and continue.

### Move 3 — Build the shared chrome (rail + overlay) once, as a copy-paste block

**Do:** Build the rail + overlay per directives 1–2 directly in `index.html` first, styled entirely from `room.css`, behavior in `room.js` (open/close overlay, Escape, backdrop click, focus trap-lite: move focus to close button on open, restore on close, `body{overflow:hidden}` while open). Then paste the same block into every stage page, changing only: the `YOU ARE HERE` label, the overlay's current-item marker, and relative path prefixes (`../` from `stages/`).
**Expect:** Rail visible at top of every page; `All directions` fills the viewport with the grouped map; ✕, Escape, and backdrop all close it; focus returns to the trigger.
**If instead** the overlay opens but the page scrolls behind it, **because** `overflow:hidden` wasn't applied to `body`, **then** toggle a `.overlay-open` class on `<body>` in `room.js` and style it in CSS.
**If instead** links 404 from stage pages, **because** the pasted block kept root-relative paths, **then** audit every `href`/`src` in `stages/*` for the `../` prefix — this is the single most likely mechanical failure of the whole mission; check it before moving on.

### Move 4 — Build the index hub

**Do:** `index.html`: rail → intro block (mono eyebrow `EYES CLOSED · CLIENT ROOM`, serif italic h1 like "Directions worth sitting with", then a 3-sentence how-to: *enter a direction → sit with the framed work → return and tell us which feels true*) → the 4 groups in catalog order (`In progress`, `Directions`, `Foundations`, `Atmosphere`), each a labeled section of large entry plates. Each plate: status chip, serif direction title (≥1.75rem), intent line from the catalog, and a framed thumbnail ONLY where a real visual is trivially recreatable as a tiny inline SVG sketch (science orbit mark, icons grid dots, moodboard field, backgrounds gradient). Hero templates / About / Themes / Foundations get calm typographic plates — no fake thumbs.
**Expect:** At 1200px: generous editorial grid, scannable from across a room. At 375px: single column, plates full-width, no horizontal scroll.
**If instead** the group sections read as a dashboard card grid, **because** equal-sized boxes in a uniform grid (banned by `DESIGN.md` §13), **then** vary plate scale: `In progress` plate full-width and taller; `Directions` two-up; `Foundations`/`Atmosphere` can sit three-up or stacked with tighter plates.

### Move 5 — Build the stage template + the two single-board composition-led stages

**Do:** Establish the stage skeleton on `hero-templates.html`: rail (with `YOU ARE HERE · Hero & section templates`) → title block → one `frame-viewport` containing a recreated dark hero composition (mono eyebrow, two-line serif italic display, one quiet CTA pill) and below it a second plate with a section-rhythm study (three stacked type specimens at h1/h2/body scale). Then `foundations.html`: `frame-plate`s for (a) token swatches — the core palette as labeled chips, (b) a type ramp (serif display / sans body / mono eyebrow), (c) a motion note: one line naming the easing + durations, with a small hover-demo chip. Both stages stay quiet — no marks, no diagrams.
**Expect:** Both pages read as curated presentations: chrome, title, framed work, nothing full-bleed, footer link `← Back to index`.
**If instead** the recreated hero looks empty/unfinished, **because** you are tempted to add decoration, **then** increase type scale and whitespace instead — composition-led stages prove themselves with type and space (directive 5).

### Move 6 — Build the three multi-board stages

**Do:** Using directive 4:
- `about-layouts.html` — 4 boards recreated as condensed compositions from Move 1 recon: Editorial Split (asymmetric two-col), Portrait Hero (tall image-block placeholder as a toned rect with alt-labeled SVG), Centered Manifesto (single centered measure), Magazine Sidebar (narrow mono rail + body col). Strip the specimen's own nav — chrome belongs to the room.
- `science.html` — 3 boards: Vault / Atelier / Observatory Press, each a `frame-viewport` dark composition with its own accent key and ONE hero graphic (orbit/field/torus inline SVG) — this is the graphic-led showcase.
- `themes.html` — 3 boards from the three `--ex-*` palettes in `src/index.css`: each board shows the palette as a mini page-mock (band, surface, text sample) + labeled swatch row.
**Expect:** Board tabs swap content with a crossfade inside one persistent frame; chrome never moves; deep-reload of the page lands on board 1 cleanly.
**If instead** the crossfade causes layout jump, **because** boards have different heights while absolutely stacked, **then** set the frame's `min-height` to the tallest board (fixed `min-height` per breakpoint is fine for a prototype).
**If instead** Science boards feel like guesses (Fork A was taken), **because** the bundle never rendered, **then** label each board footer `Interpretive board — from direction notes` in mono 10px; do not fake fidelity.

### Move 7 — Build the remaining graphic-led stages

**Do:**
- `icons.html`: a `frame-plate` grid of 8–12 teaching marks as inline SVGs (circle/orbit, field lines, torus, dissolve dots, breath wave, etc.), each with a mono caption. Line-drawn, 1.5px strokes, cream on panel, sage/clay used sparingly as single-stroke accents.
- `moodboard.html`: 3 large plates — Field (radial sage wash + scattered dots), Torus (elliptical orbit SVG), Dissolve (dot-grid fading out) — each with a serif caption line.
- `backgrounds.html`: 3 full-width-in-frame atmosphere plates: a slow radial gradient wash, a grain-over-gradient, a horizon band — CSS gradients only, each inside `frame-viewport` with a one-line intent caption. No animation loops (banned: perpetual ambient).
**Expect:** These three pages clearly lead with graphics while staying inside frames with chrome intact — together with Move 5 they prove both modes.
**If instead** an SVG mark reads as clip-art, **because** filled shapes/detail overload, **then** reduce to strokes only, one accent color max per mark.

### Move 8 — Motion pass

**Do:** Implement directive 6 in `room.js` + `room.css`: an `.enter` class added on `DOMContentLoaded` drives the three-step reveal via transition-delays; index plates get `--i` custom-property stagger; board crossfade already in Move 6. Add the `prefers-reduced-motion` block that zeroes all transitions/delays and makes board swaps instant.
**Expect:** Reloading any page shows chrome → title → content in under ~900ms total; with reduced motion emulated (DevTools → Rendering → prefers-reduced-motion), everything appears instantly.
**If instead** content flashes visible before the reveal, **because** initial hidden state is applied by JS after first paint, **then** put the initial hidden state in CSS (guarded by `@media (scripting: enabled)` if available, else a `<script>document.documentElement.classList.add('js')</script>` in `<head>` and hide only under `.js`) so no-JS users still see everything.

### Move 9 — Mobile pass at 375px

**Do:** Set viewport to 375px (DevTools responsive mode) and walk every page: rail per directive 7, overlay full-screen and scrollable, index single column, stage frames full-width with reduced padding, board tabs wrap or scroll VERTICALLY (never horizontal page scroll), tap targets ≥44px.
**Expect:** No horizontal scrollbar on any page (`document.documentElement.scrollWidth === 375` in console), all nav reachable without hunting.
**If instead** a board tab row overflows, **because** 3–4 serif labels don't fit at 375px, **then** stack tabs as a 2×2 grid of small plates above the frame.

### Move 10 — Accessibility + link audit

**Do:** On every page: confirm landmarks (`header/nav/main`), one `h1`, heading order sane, every interactive element is a real `<a>`/`<button>` with a visible focus style (`outline: 2px solid` cream at offset), overlay dialog semantics from Move 3, every non-decorative SVG has `role="img"` + `aria-label`, decorative ones `aria-hidden="true"`. Then click EVERY link and tab on EVERY page.
**Expect:** Zero dead links, zero missing labels, keyboard-only traversal can reach index → overlay → any stage → boards → exit.
**If instead** the board switcher isn't keyboard-operable, **because** tabs were built as styled `<div>`s, **then** rebuild as `<button>`s in a `role="tablist"` with `aria-selected`.

---

## 4 · Forks

| Fork | Trigger (observation) | Route |
|---|---|---|
| **A — Science bundle won't render** | `file://` open shows "Unpacking…" > 30s, an error banner, or a blank field | Serve the repo root once (`python3 -m http.server 8000` from `/Users/m4/formless-web/public`, open `http://localhost:8000/design/science-page-v2-directions.html`). If it STILL fails: build the 3 science boards interpretively from the catalog intent line + the three `--ex-*` palettes, label them `Interpretive board` per Move 6, and add RECON NEEDED #1 to your final report. |
| **B — Google Fonts unreachable** | Serif renders as Georgia/Times in every page | Continue with fallbacks (they are in every stack); note in final report. Do NOT vendor font files. |
| **C — 375px chrome doesn't fit** | Rail wraps to 2 lines or causes horizontal scroll at 375px | Drop the `Index` and `Exit` text links from the rail on mobile; move both INTO the overlay as the first and last items. Rail keeps mark + `CLIENT ROOM` + `All directions` only. |
| **D — A quiet stage looks bare** | You feel the urge to add an icon/diagram to About/Hero/Themes/Foundations | That urge is the failure. Route: bigger type, more whitespace, better plate matting. Adding graphics to quiet stages is a graded defect (brief §graphic-discipline). |
| **E — Time/complexity pressure on board recreation** | A recreated board is taking disproportionate effort for fidelity | Reduce fidelity, keep composition: boards are framed impressions, not clones. A board = skeleton composition + palette + one hero element, max. |

---

## 5 · RECON NEEDED (carry into the final report if unresolved)

1. **Actual visual content of the Science bundle** (Vault / Atelier / Observatory Press). Settles it: rendering the file in a browser per Move 1 / Fork A and noting each board's palette + hero composition. If never rendered, boards ship as labeled interpretive.
2. **Whether the operator wants the prototype's overlay/rail pattern ported back into the React app afterward.** Settles it: operator answer after prototype review. Out of scope for this mission — do not touch `src/`.

---

## 6 · Abort conditions (stop, report, do not improvise)

1. Any step would require editing files outside `site/` (anything in `src/`, `public/`, `index.html` at repo root). The mission is a static prototype only.
2. `site/` already exists with non-trivial content at start. (Recon 2026-07-16 says it does not; if that changed, someone else is working here.)
3. Meeting the mobile contract would force removing persistent chrome from any page (i.e., directives 1 and 7 become mutually unsatisfiable even after Fork C).
4. You cannot open ANY page in a browser to verify (no browser access at all) — the mission's verification is browser-based; flag rather than "verify" by reading your own code.

---

## 7 · Verification runs (all must pass before reporting done)

Run in a real browser via `file://` (primary) — this proves the no-build contract.

| # | Run | Pass looks like |
|---|---|---|
| V1 | Open `site/index.html`; click every plate; from each stage click every rail link, overlay link, and back-link | Every page reachable; zero dead links; chrome present on all 9 pages |
| V2 | On each multi-board stage, click every tab | Boards swap with crossfade in the same frame; no scroll jump; no layout shift beyond the frame |
| V3 | Overlay drill on index + one stage: open → Escape; open → backdrop click; open → ✕; tab through it | All three close paths work; focus lands in overlay on open, returns to trigger on close; page behind doesn't scroll |
| V4 | DevTools → emulate `prefers-reduced-motion: reduce`; reload index + one stage; switch a board | No stagger, no reveal sequence, no crossfade; content instantly visible |
| V5 | Responsive 375px on all 9 pages; console: `document.documentElement.scrollWidth` | `375` everywhere; rail usable; overlay scrollable; tap targets ≥44px |
| V6 | Orphan check: from `science.html` and `about-layouts.html`, attempt to reach any raw specimen or chrome-less view | Impossible — no link in the prototype leaves the room except `Exit site ↗` |
| V7 | Mode proof: open `science.html` (graphic-led) and `about-layouts.html` + `hero-templates.html` (composition-led) side by side | Science leads with marks/atmosphere inside its frame; the quiet stages contain zero decorative SVG/icons |
| V8 | Landmark/labels sweep: DevTools accessibility tree on index, one multi-board stage, the overlay | `banner`/`navigation`/`main` present; dialog exposed as modal; no unlabeled buttons/images |
| V9 | Final report audit | Every claim in your summary names the run (V1–V8) or file that proves it; no unverified claims |

---

## 8 · Red-team record (SUCCESS #7)

**Attack 1 — "The executor reads the 1.8MB science bundle as text and burns its entire context."** Landed on the draft (the brief says "recon the specimens" with no size warning). **Patch:** explicit DO-NOT-READ in Recon table + Move 1, byte size stated, browser-only viewing, Fork A interpretive route with labeling.

**Attack 2 — "Pages built and 'verified' by re-reading source; ships with `file://`-broken module scripts and root-relative links."** Landed. **Patch:** §2 bans `type="module"` and mandates relative links; Move 3 counter-move makes the `../` audit explicit; Verification header forces `file://` as the primary environment; Abort 4 forbids coderead-as-verification.

**Attack 3 — "Overlay opens but keyboard/scroll state leaks, or closing strands focus — the exact 'confusing nav' failure reborn at full size."** Partially landed. **Patch:** Move 3 gained focus-move/restore + `body` scroll lock + three explicit close paths; V3 tests all of them.

**Attack 4 — "Executor pads the quiet stages with decorative SVG because they 'look empty'."** Failed against the draft (directive 5 + Move 5 counter-move already blocked it) — but the attack showed no fork covered the urge itself, so **Fork D** now names the urge as the trigger and the graded defect.

**Attack 5 — "Different heights across boards make the crossfade jump, executor switches to hash-links to 'fix' it, breaking scroll position."** Landed. **Patch:** directive 4 bans hash navigation outright; Move 6 counter-move prescribes `min-height` matting.

---

## 9 · Final report contract

Report: files created (tree), forks taken and why, RECON NEEDED items resolved/unresolved, V1–V9 results one line each, and any deviation from this plan with its trigger. A deviation without a recorded trigger is a defect.
