# Eyes Closed Design — Figma capture handoff

Last updated: 2026-06-23

Use this file to resume the 1:1 live-site capture into Figma. The website source (`formless-web/src`) was **not** modified for this work.

## Goal

Mirror the **production pages** in Figma as pixel-accurate captures (not hand-drawn layers):

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

## Progress (session 2026-06-23)

### Confirmed in Figma (poll returned completed)

| Page | Viewport | captureId | Figma node |
|------|----------|-----------|------------|
| Home | Desktop | `52dd1e4f-f585-476b-a520-8951de6956e0` | `1:2` |
| Home | Tablet | `cfa93469-8642-4534-b6db-07797d84cf2b` | `2:2` |
| Home | Mobile | `a50b94f1-a246-45b5-a9db-fb6738ead5d9` | `3:2` |
| Work | Desktop | `dee338bd-1bc4-4873-8845-16aa48d0b261` | `4:2` |
| Work | Tablet | `1e8b5054-b094-483b-aa60-7699b771e458` | `5:2` |

### Playwright submitted — poll blocked by MCP rate limit

Playwright reported `captureForDesign` OK for all rows below. Poll with `generate_figma_design` when the limit resets:

| Page | Viewport | captureId |
|------|----------|-----------|
| Work | Mobile | `b4bb06b4-57b9-4d41-bfb8-2d725b90962c` |
| Book | Desktop | `3a05e169-b934-446b-bb64-5de5675b0ae1` |
| Book | Tablet | `07e513e6-a709-492d-acb9-d079b4cf8672` |
| Book | Mobile | `5fe6b25c-ae0a-42ae-859f-87376c921d7e` |
| Science | Desktop | `2c0ea43e-2a7b-4a61-8983-d973dc0f602f` |

### Not started (need new captureIds)

| Page | Viewport |
|------|----------|
| Science | Tablet, Mobile |
| About | Desktop, Tablet, Mobile |

## Resume checklist

When Figma MCP limit has reset:

### Step A — Poll submitted captures (5 MCP calls)

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

Rename frames to a consistent pattern, e.g. `Home / Desktop — 1440`. No redraw; captures only.

## Repo files

| File | Purpose |
|------|---------|
| `design/figma/CAPTURE-HANDOFF.md` | This handoff (status + resume steps) |
| `design/figma/capture-manifest.json` | captureIds, routes, pending list |
| `design/figma/rebuild-website-steps.mjs` | Constants: `FIGMA_FILE_KEY`, `LIVE_ROUTES`, `VIEWPORTS` |
| `scripts/figma-capture-all-pages.mjs` | Playwright runner |
| `scripts/figma-capture-viewports.mjs` | Legacy homepage-only script (port 5173) |
| `.claude/skills/formless-design/SKILL.md` | Design skill — links to capture workflow |

## Dev server notes

- Vite default port: **5173** (not 5174)
- Capture script `BASE`: `http://localhost:5173` (override with `BASE=…` env var)
- Routes come from `formless-web/src/PublicShell.tsx`

## What went wrong before (avoid)

- Hand-rebuilt Figma from `/revised` + `DESIGN.md` ≠ production site
- Mobile frame with only a text note instead of a real capture
- Wrong dev port (5174) in old capture script
- Reusing old Figma files after account reset

## MCP budget note

Starter plan hit rate limit after ~15 `generate_figma_design` calls in one session (10 ID requests + 5 successful polls). Batch work: poll submitted captures first, then request new IDs, then Playwright, then poll again.
