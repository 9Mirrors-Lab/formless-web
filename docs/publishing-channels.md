# Distribution channels (high level)

Early map of where the *Formless* book may be sold. Channels are under discussion; nothing is locked except using **IngramSpark** as the primary print/ebook production hub.

See also: `publishing-roadmap-notes.md` (pipeline), `publishing-in-house-savings.md` (what to DIY vs hire), `publishing-ingramspark.md` in proj-001 coordination (portal workflow).

## Channel overview

| Channel | Format | Role (today) | Portal / entry |
| --- | --- | --- | --- |
| **IngramSpark** | Print (HC/PB), ebook | Primary setup: files, proofs, metadata, wide distribution | [myaccount.ingramspark.com](https://myaccount.ingramspark.com/) |
| **Amazon** | Kindle ebook, KDP print | Major retail destination; may be direct (KDP) and/or via IngramSpark distribution | [KDP](https://kdp.amazon.com/) |
| **Audible** | Audiobook | Separate product; production and rights via ACX | [ACX](https://www.acx.com/) |
| **Substack** | Essays, email | Research: publish excerpts during book dev, build subscriber list, test messaging, sustain readers after launch | [substack.com](https://substack.com/) · `substack-approach.html` |
| Other retailers | Ebook, print | Often reached through IngramSpark expanded distribution (Apple Books, Kobo, B&N, etc.) | Via IngramSpark title settings |

## IngramSpark

- Print on demand: hardcover, paperback (color or B&W).
- Ebook distribution to many retailers from one title record.
- Operational home for ISBN-linked metadata, interior/cover PDFs, proofs, pricing, and channel toggles.

## Amazon

Two common patterns (decide later):

1. **Wide via IngramSpark** — Enable Amazon in IngramSpark distribution; Amazon listing feeds from that pipeline.
2. **Direct KDP** — Publish Kindle and/or KDP paperback on Amazon separately for more control or KDP Select; must avoid duplicate ISBN/listing conflicts.

Open: exclusive vs non-exclusive Amazon, print match between KDP and IngramSpark, and whether KDP Select is worth it for launch.

## Audible (ACX)

Audiobook is a **separate deliverable**, not a file upload beside the print PDF:

- Narration (author-read, pro narrator, or hybrid).
- Audio mastering to ACX specs.
- Rights and distribution: Audible / Amazon / iTunes via ACX.
- Often follows print/ebook once manuscript is stable.

Open: timeline (launch with print or phase 2), production budget, exclusive vs non-exclusive ACX.

## Substack

Parallel **audience channel** (not a bookstore). Status: research / not started. See `substack-approach.html`.

- Publish insights and adapted excerpts while the manuscript develops.
- Build an owned email list; test themes and language with reader feedback.
- Create pre-launch anticipation; launch *Formless* to subscribers who already trust the teaching.
- Continue essays and relationship after print/ebook; point readers to the Eyes Closed site and offerings when ready.

Open: publication name (Eyes Closed vs Soni C. vs *Formless*), cadence, free vs paid tier, excerpt policy vs net-new writing.

## How channels relate

```text
Manuscript + design (upstream)
        │
        ├─► IngramSpark ──► print POD + ebook ──► many stores (incl. possible Amazon)
        ├─► Amazon KDP ──► (optional direct) Kindle / Amazon print
        ├─► ACX ──► audiobook ──► Audible / Amazon audio
        └─► Substack ──► essays + email ──► audience before / during / after launch
```

Marketing site (`formless-web`) points readers to buy/listen; it does not replace any publisher portal.

## Open questions

- [ ] Amazon: IngramSpark only, KDP only, or both (and how to avoid duplicate listings)?
- [ ] Audiobook: launch day one vs phase 2?
- [ ] Which IngramSpark ebook retailers to enable at launch vs add later?
- [ ] One ISBN strategy across print/ebook/audio (audio may use its own identifiers).
- [ ] Substack: when to start, name, cadence, and how it links to the site without feeling like a funnel?

## Session notes

- 2026-05-18 — High-level channel map added (IngramSpark, Amazon, Audible); status = discussing.
- 2026-05-20 — Substack added as research channel for audience building and pre/post-launch relationship.
