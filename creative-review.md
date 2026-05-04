# Creative review: Formless marketing site (`localhost:5174`)

Review date: May 1, 2026.  

---

## What works

- **Hero (above-the-fold narrative):** Full-viewport treatment, load animation, scroll fade on `.hero-content`, and primary CTA (“Begin with a reflection”) read as intentional and on-brand. This matches your note that the main page feels fine.
- **Pattern / three-card stack (`PatternCards`):** The sticky stack (intro band + three full-viewport cards + closing line) is the strongest long-scroll interaction: clear structure, readable cards, and a sensible payoff (“The pattern remains.”). It aligns with the “sticky stack” style of scroll choreography without feeling empty.
- **Visual system:** Cream / charcoal / moss palette, serif + sans pairing, noise overlay, and restrained UI chrome support a contemplative tone.

---

## Elements that do not work (or work against the experience)

### 1. Scroll distance far exceeds information density

Several sections are implemented as **tall scroll tracks with pinned viewports** so that a short line of copy consumes multiple screen-heights of scrolling.

| Section | Approx. scroll budget (code) | What the user gets |
|--------|------------------------------|--------------------|
| **Reframe** | Section height `300vh` with `pin: true` and scrubbed timeline (`Reframe.tsx`) | Three beats: two italic lines + “who is listening?” |
| **Reflection** | Section height `400vh` with `pin: true` and scrubbed timeline (`Reflection.tsx`) | One question + one guidance paragraph |
| **Pattern** | `60vh` intro + **three** `100dvh` sticky cards + `50vh` outro (`PatternCards.tsx`) | Strong content, but still ~4+ viewports for this block alone |

**Why it feels broken:** The ratio of **pixels scrolled to new meaning** is too low outside the card stack. Users report scrolling “way too much” just to see text appear; the implementation explains why.

### 2. Pinned scenes hide content at opacity 0 until deep scroll

In **Reframe**, `.reframe-line-1`, `.reframe-line-2`, and `.reframe-question` start at `opacity: 0` and only ease in as the scrubbed timeline advances. Same pattern in **Reflection** for `.reflect-question` and `.reflect-guide`.

**Risk:** For a long pinned segment, the viewport can look **empty or nearly empty** for a noticeable portion of the scroll unless the user has already moved past the early timeline phases. That reads as “nothing is happening” rather than “dramatic reveal.”

### 3. Standard sections still delay copy with aggressive scroll triggers

**Recognition**, **Science**, **Book**, **About**, and **Invitation** use `ScrollTrigger` starts such as `top 70%`–`top 85%` for fades (`Recognition.tsx`, `Science.tsx`, `Book.tsx`, `About.tsx`, `Invitation.tsx`).

**Effect:** Blocks can stay visually blank or minimal until the trigger fires. Combined with the huge pinned sections above, the page feels like **waiting on animation gates** instead of reading.

### 4. Broken or placeholder interaction

- **Book CTA:** “Explore the book” uses `href="#"` (`Book.tsx`). It performs no navigation and may jump to the top of the page depending on browser behavior.

### 5. Hero vs. `/cinematic-sites` spec (gap analysis)

The `/cinematic-sites` workflow calls for a specific stack: **scroll-scrubbed hero via canvas + preloaded JPEG frames** (no `video.currentTime`), optional **Cinematic Modules** fetched from a local server, inline SVGs (no emoji), strict hero overlay rules (no full-hero vignette wrappers; pills on small text only), and a loader during frame preload.

**Current site:**

- Hero is a **static Unsplash background + CSS gradients**, not a frame sequence on canvas.
- **No Cinematic Modules** integration (nolocalhost module fetch, no adapted module sections such as kinetic marquee, text mask reveal, odometer, etc.).
- Implementation is **React + Vite + Tailwind**, not the skill’s single-file HTML/CSS/JS pattern; that is a legitimate tech choice, but it means the **library of module designs** was not actually woven in.
- Hero gradients include **full-bleed multiply / top-darkening layers** (`Hero.tsx`). The cinematic skill explicitly warns against darkening the whole hero with gradients and against wrapping all hero copy in one backdrop; your layout keeps copy as separate blocks, but the **global overlays** still push toward a “cinematic grade” that the skill tries to avoid.

**Bottom line:** The update borrows **GSAP + ScrollTrigger + sticky stacking** at a high level, but it does **not** deliver the `/cinematic-sites` package as specified (canvas hero, module library, optional serve-and-merge workflow).

### 6. Browser observation (first paint)

On initial navigation, the visible viewport was mostly **background and chrome** until scroll (hero copy sits low with `items-end`, and hero lines animate from zero opacity). That can reinforce an “empty page” first impression on some viewports or before `gsap.from` completes.

---

## Recommendations (concise)

1. **Cut scroll-multipliers:** Reduce Reframe from `300vh` and Reflection from `400vh` to something closer to **1.5–2× viewport** unless user testing shows the pause is essential; or replace pins with shorter scrub ranges.
2. **Avoid long stretches of opacity-0 copy:** Show low-contrast or blurred **readable** states early, then sharpen on scroll, so the section never reads as blank.
3. **Relax scroll triggers:** Use `start: 'top 90%'` (or once-on-enter without hiding content in CSS) so paragraphs do not wait for deep viewport entry.
4. **Fix Book CTA:** Point to a real route, anchor, or external URL; avoid bare `#`.
5. **If truly targeting `/cinematic-sites`:** Add canvas + extracted frames for the hero **or** explicitly scope the project as “inspired by” and pull **2–4** Cinematic Modules from a running `cinematic-site-components` server and merge adapted CSS/JS.

---

## File reference (scroll-heavy sections)

- `src/components/Reframe.tsx`: `h-[300vh]`, pin, scrubbed timeline.
- `src/components/Reflection.tsx`: `h-[400vh]`, pin, fog timeline.
- `src/components/PatternCards.tsx`: sticky card stack (strongest below-fold section).
- `src/components/Hero.tsx`: hero fade on scroll; static background image.
- `src/components/Book.tsx`: `href="#"` on primary button.


