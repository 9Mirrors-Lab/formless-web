# Eyes Closed Design — Figma capture handoff

Last updated: 2026-07-11

Use this file to resume the 1:1 live-site capture into Figma. The website source (`formless-web/src`) was **not** modified for this work.

## Goal

Mirror the **current dev site** in Figma as pixel-accurate captures (not hand-drawn layers):

| Route | Page |
|-------|------|
| `/` | Home |
| `/work` | Work |
| `/book` | Book |
| `/science` | Science |
| `/about` | About |

Viewports per page: **1440×900** (desktop), **768×1024** (tablet), **390×844** (mobile).

## Figma file

| | |
|---|---|
| **Name** | Eyes Closed Design |
| **URL** | https://www.figma.com/design/mA96W2OGNZzOO8zmlmjTpE |
| **fileKey** | `mA96W2OGNZzOO8zmlmjTpE` |
| **Account** | riles4757@gmail.com — Ryan Riley's team (Starter, Full seat) |

Old files (ignore for this effort):

- `0BgvoyuehcStcvJ0Mugve2` — reset / view-only
- `EnphwBio0tvFdMssmi1NJH` — hand rebuild (wrong approach)

## Approach (correct)

1. `npm run dev` in `formless-web` → **http://localhost:5173**
2. `generate_figma_design({ fileKey })` once per route × viewport → get `captureId`
3. Record IDs in `capture-manifest.json`
4. `node scripts/figma-capture-all-pages.mjs` — Playwright opens each URL with `#figmacapture=…`
5. Poll each ID: `generate_figma_design({ fileKey, captureId })` until completed

**Do not** use `REBUILD_SINGLE_CALL` in `rebuild-website-steps.mjs` — that hand-builds UI and does not match production.

## Progress (session 2026-07-11 — full refresh)

Previous June captures are **outdated**. This session started a full re-capture from current `localhost:5173`.

### Playwright submitted — poll pending (MCP rate limit hit)

All 10 rows below were submitted successfully (`captureResult.ok: true`). Poll with `generate_figma_design` when the limit resets:

| Page | Viewport | captureId |
|------|----------|-----------|
| Home | Desktop | `a33a448e-b448-43f8-be1d-a34f5ac935d0` |
| Home | Tablet | `d016cd29-5513-4712-b807-ceb0617f8343` |
| Home | Mobile | `51e7c222-f16c-4135-9c3f-a57a773804c6` |
| Work | Desktop | `5b8c4a1b-1cb8-49d2-ad38-da953a7ef37d` |
| Work | Tablet | `75d2522b-5265-4250-863f-676ff59a54ab` |
| Work | Mobile | `f55ed275-e62a-402b-9a8d-c68ab9ca5b2c` |
| Book | Desktop | `ce5a5dbb-f191-4373-b396-3995ab426cd0` |
| Book | Tablet | `73853b3b-0d79-453a-94a4-26ffa4150c4e` |
| Book | Mobile | `6b6ce6e7-1e5d-40e9-9556-9197485feec3` |
| Science | Desktop | `00105711-b2d2-4024-bc27-fb7643b71936` |

### Not started (need new captureIds — rate limit blocked)

| Page | Viewport |
|------|----------|
| Science | Tablet, Mobile |
| About | Desktop, Tablet, Mobile |

## Resume checklist

When Figma MCP limit has reset:

### Step A — Poll submitted captures (10 MCP calls)

```text
generate_figma_design({ fileKey: "mA96W2OGNZzOO8zmlmjTpE", captureId: "<id>" })
```

Poll each ID in the "Playwright submitted" table until status is `completed`. Wait ~5s between retries if still pending.

### Step B — Request 5 new captureIds (5 MCP calls)

One call per pending row in `capture-manifest.json` → `pending` array:

- `/science` Tablet, Mobile
- `/about` Desktop, Tablet, Mobile

Append new entries to `captures` in the manifest; remove from `pending`.

### Step C — Run Playwright (no MCP cost)

```bash
cd formless-web
npm run dev   # confirm http://localhost:5173
node scripts/figma-capture-all-pages.mjs
```

To capture only new rows, temporarily trim `captures` in the manifest to pending items only (single-use IDs cannot be reused).

### Step D — Poll new captures (5 MCP calls)

Same as Step A for the five new IDs.

### Step E — Optional cleanup in Figma

Delete or archive old June 2026 frames. Rename new frames to a consistent pattern, e.g. `Home / Desktop — 1440 (Jul 2026)`. No redraw; captures only.

## Repo files

| File | Purpose |
|------|---------|
| `design/figma/CAPTURE-HANDOFF.md` | This handoff (status + resume steps) |
| `design/figma/capture-manifest.json` | captureIds, routes, pending list |
| `design/figma/rebuild-website-steps.mjs` | Constants: `FIGMA_FILE_KEY`, `LIVE_ROUTES`, `VIEWPORTS` |
| `scripts/figma-capture-all-pages.mjs` | Playwright runner |
| `scripts/figma-capture-viewports.mjs` | Legacy homepage-only script (port 5173) |

## Dev server notes

- Vite default port: **5173** (not 5174)
- Capture script `BASE`: `http://localhost:5173` (override with `BASE=…` env var)
- Routes come from `formless-web/src/PublicShell.tsx`
- Playwright is now a devDependency (`npm install` includes it)

## What went wrong before (avoid)

- Hand-rebuilt Figma from `/revised` + `DESIGN.md` ≠ production site
- Mobile frame with only a text note instead of a real capture
- Wrong dev port (5174) in old capture script
- Reusing old Figma files after account reset
- Using outdated June captures when site has changed

## MCP budget note

Starter plan hit rate limit after ~15 `generate_figma_design` calls in one session (10 ID requests + polling blocked). Batch work: poll submitted captures first (10 calls), then request 5 new IDs, then Playwright, then poll again. Consider upgrading Figma plan or waiting for monthly reset if blocked.
