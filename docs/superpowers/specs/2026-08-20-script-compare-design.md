# Script compare page — design

Approved 2026-08-20.

## Goal

Side-by-side word audit of ARC manuscript vs chapter audio script so alignment can be judged without trusting a cached similarity percent.

## Route

- `/audio/script-compare`
- Nav: Audible → Script compare
- Internal audio auth (same as other `/audio/*` tools)

## UI

- Chapter picker: Opening Credits, Introduction, Chapters 1–9, Acknowledgments
- Stats: match %, matched / missing-from-script / only-in-script / replacements
- Prev / Next difference jump
- Legend for highlight kinds
- Left column: ARC text for that track
- Right column: chapter script (cue texts joined in listen order)
- Word spans colored by diff kind; click jumps paired pane

## Matching

- Normalize: lowercase, strip punctuation / smart quotes
- Display original tokens
- Live Myers/LCS-style word diff in the browser against current `audioManuscripts` cues

## Data

- Right: `manuscriptForChapter(id)` from `src/data/audioManuscripts.ts`
- Left: ARC chapter strings in `src/data/arcManuscriptChapters.ts`, generated from `.cache/manuscript-compare/Formless_ARC_cleaned.txt`

## Out of scope (v1)

- Playback
- Closing Credits
- In-page cue editing
