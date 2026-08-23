---
version: 2
slug: "src-pages-preorderlandingpage-tsx"
primary_target: "src/pages/PreorderLandingPage.tsx"
related_targets: ["src/data/preorderLanding.ts","src/config/preorderAccess.ts","src/components/preorder/IntroductionPlayer.tsx"]
---

# /special-preview, /preorder, and /preorder/stay-close

## Scope and mode

Two email destinations. Waitlist is a thank-you listen. Stay Close is the cream letter. Not a rewrite of `/book`.

## Audience and job

Waitlist (`/special-preview`, also `/preorder`) came to hear. The gift is hearing Sonika read the Introduction. Pre-order is the quiet second act. Stay Close (`/preorder/stay-close`) is an ongoing relationship: know Formless can be pre-ordered on Kindle, see $0.99 and September 1, go to Amazon.

## Direction

Waitlist: listen first. The cover world is the room. Play is the special preview. Kindle is an italic line. Stay Close: the pause, then the door. Cream sanctuary, jacket as a developing plate, moss pill as the commit.

## Inventory

| Region | Medium |
| --- | --- |
| Wordmark | Eyes Closed SVG; multiply on cream, invert on dusk |
| Jacket | `/book-covers/formless-ebook.jpg` |
| Waitlist player | IntroductionPlayer, dusk orb, chapter 0 |
| Stay Close marks | TeachingIconMark compact live CSS, light theme |
| Pre-order | Waitlist: italic Kindle link. Stay Close: ParticleButton moss pill |
| Grain | `.noise-overlay` on cream, `.noise-overlay-dark` on dusk |

## Constraints

Kindle URL defaults to `https://www.amazon.com/dp/B0HFYC45QC`. Override with `VITE_KINDLE_PREORDER_URL`. Do not invent Audible. Introduction only on waitlist; the full advance-listen room stays behind its own door. No Amazon chrome, no countdown, no second email gate.

## Unresolved

None for the Amazon door. Stay Close stays on cream unless asked.
