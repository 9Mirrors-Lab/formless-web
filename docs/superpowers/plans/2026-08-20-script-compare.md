# Script compare — implementation plan

## Files

| File | Role |
|---|---|
| `scripts/generate-arc-manuscript-chapters.py` | Split ARC cleaned text → TS module |
| `src/data/arcManuscriptChapters.ts` | Generated ARC text by chapter id |
| `src/lib/scriptWordDiff.ts` | Normalize, tokenize, word diff, stats |
| `src/lib/scriptWordDiff.test.ts` | Diff tests |
| `src/pages/AudioScriptComparePage.tsx` | Page UI |
| `src/PublicShell.tsx` | Route |
| `src/components/brandNavData.ts` | Nav item |
| `src/data/sitePageIndex.ts` | Page index |
| `src/config/internalAccess.test.ts` | Path coverage if asserted |

## Tasks

1. Generate ARC chapter TS from cleaned ARC (drop-cap join, heading cuts).
2. Implement `diffWords` + tests (match / delete / insert / replace).
3. Build page: picker, legend, dual panes, next/prev diff.
4. Wire route + nav + unrestricted path.
5. Run unit tests for diff helper.

## Done when

- `/audio/script-compare` loads, chapter switch works, missing Ch2/Ch4/Ch6 passages highlight on the left.
