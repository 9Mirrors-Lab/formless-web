# Design System: Formless / Eyes Closed

**Project:** `formless-web`  
**Live reference:** `/design-system` (`src/DesignSystem.tsx`)  
**Token source of truth:** `src/index.css` (`@theme` block)  
**Philosophy:** `formless_design_philosophy.md`  
**Brand strategy:** `../BRAND_STRATEGY.md`

---

## Configuration — set your style

| Dial | Level | Description |
|------|-------|-------------|
| **Creativity** | `5` | `1` = ultra-quiet, typographic only. `5` = editorial serif + restrained motion (this project). `10` = experimental layouts, not default here. |
| **Density** | `2` | `1` = sanctuary-airy. `5` = balanced. `10` = dashboard-dense. Default: `2` — generous whitespace is structural. |
| **Variance** | `4` | `1` = symmetric grids. `5` = subtle asymmetry. `10` = every section unique. Default: `4` — calm rhythm, not chaotic. |
| **Motion intent** | `5` | `1` = static. `5` = slow scroll reveals, fog-to-clarity, GSAP scrub. `10` = cinematic pinning everywhere. Default: `5`. |

---

## 1. Brand hierarchy

Use this layering on all new UI and copy:

| Layer | Name | Role |
|-------|------|------|
| Organization | **Eyes Closed** | Site brand, nav wordmark, footer, invitation framing |
| Book | **Formless** | Book title and `/book` route label only |
| Practice area | **The Practice** | Formerly "The Work"; `/work` route and teaching content |
| Science | **Spirituality & Science** | `/science` nav label (approved client direction) |

**Tone:** Studio, not storefront. Sanctuary, not billboard. No urgency, no pop-ups, no conversion pressure.

---

## 2. Visual theme and atmosphere

A contemplative digital sanctuary: organic materials (moss, clay, cream, charcoal), editorial serif moments, and slow deliberate motion. The site should feel **spacious, grounded, unrushed, honest, and slightly imperfect** (wabi-sabi).

- Light mode default: cream canvas, charcoal ink
- Dark bands: charcoal or `brief-dark` (`#080a09`) with cream text
- Subtle film grain via `.noise-overlay` on light pages; `.noise-overlay-dark` on dark
- Nature-derived palette only; no neon, no AI-purple gradients, no synthetic gloss

---

## 3. Color palette and roles

### Core tokens (Tailwind / CSS)

| Token | Hex | Role |
|-------|-----|------|
| `moss` | `#2e4036` | Primary accent, buttons, selection, grounded emphasis |
| `clay` | `#cc5833` | Warm accent, links, emphasis, logo mark on light |
| `cream` | `#f2f0e9` | Primary background (light), text on dark |
| `charcoal` | `#1a1a1a` | Primary text (light mode), dark section backgrounds |

### Extended use (in components / dark mode)

| Name | Hex / value | Role |
|------|-------------|------|
| Moss light | `#9fb5aa` | Muted accent on dark (`text-moss`, `brief-dark`) |
| Clay light | `#d46544` | Warm hover / glow on dark surfaces |
| Brief dark base | `#080a09` | Immersive dark pages (`.brief-dark`) |
| Cream at opacity | `cream/50`, `cream/70` | Secondary body on dark |
| Charcoal at opacity | `charcoal/40`, `charcoal/60` | Muted UI labels on light |

### Semantic mapping

- **Background (light):** `bg-cream`
- **Background (dark):** `bg-charcoal` or `.brief-dark`
- **Text primary:** `text-charcoal` (light) / `text-cream` (dark)
- **Text muted:** `text-charcoal/60` or `text-cream/50`
- **Accent primary:** `moss` for actions; `clay` for warmth and emphasis
- **Borders:** `border-charcoal/10` (light) or `border-cream/10` (dark)

### Banned colors

- Pure black `#000000` — use `charcoal`
- Pure white `#FFFFFF` as page background — use `cream`
- Purple/violet neon gradients
- Hyper-saturated accents
- Default `shadcn` zinc/slate palettes without mapping to moss/clay/cream/charcoal

---

## 4. Typography

### Families (from `@theme`)

| Role | Font | Tailwind | Use |
|------|------|----------|-----|
| UI / body | Plus Jakarta Sans | `font-sans` | Body, nav, buttons, lede paragraphs |
| Editorial / sacred | Cormorant Garamond | `font-serif` | Headlines, italics, teaching moments, book tone |
| Metadata | System mono | `font-mono` | Eyebrows, labels, footer legal, section tags |

Fallback sans: `Outfit`. Do not use `Inter` for new work.

### Scale and patterns (match existing pages)

| Element | Classes / size | Notes |
|---------|----------------|-------|
| Hero headline | `font-serif italic font-light text-5xl md:text-7xl lg:text-[6.5rem] leading-[1.08]` | Split across two lines when needed |
| Section headline | `font-serif italic text-3xl md:text-5xl lg:text-6xl` | Cream on dark sections |
| Page title (work) | `text-5xl md:text-7xl lg:text-[5.5rem]` | Often two-line with clip reveal |
| Body | `text-base md:text-lg leading-relaxed` | Max ~65–75ch |
| Eyebrow | `font-mono text-xs tracking-[0.25em] uppercase` | Moss or charcoal at 40% opacity |
| Footer meta | `font-mono text-xs uppercase tracking-widest` | Cream at 30% on dark footer |

### Rules

- Line height: `1.6`–`1.8` for body; `1.05`–`1.15` for large serif display
- Left-align contemplative copy; no justified text
- Hierarchy via size contrast: massive serif + tiny mono eyebrows
- Italic serif for questions and invitations, not for long body blocks

---

## 5. Spacing, grid, and layout

**Base unit:** 8px (Tailwind default)

| Token | Value | Use |
|-------|-------|-----|
| Section padding X | `px-6 md:px-16 lg:px-24` | Standard page gutters |
| Section padding Y | `py-16 md:py-24` to `py-24 md:py-32` | Between major blocks |
| Hero top | `pt-40` | Below fixed nav |
| Max content width | `max-w-6xl mx-auto` | Primary reading column |
| Card internal | `p-6` to `p-8` minimum | Never cramped |

**Breakpoints:** `md` 768px, `lg` 1024px. Mobile-first single column.

**Layout principles:**

- Whitespace is structural, not leftover
- Prefer one focal idea per viewport
- Avoid three equal feature cards in a row; use accordion, split sections, or asymmetric stacks
- Content max-width `max-w-7xl` for footer; `max-w-4xl` for centered teaching copy
- Use `min-h-[100dvh]` not `h-screen`

---

## 6. Component stylings

Map new UI to existing components where possible.

### Buttons — `ParticleButton`

- Primary: `bg-moss text-cream rounded-full px-8 py-4 font-semibold text-sm uppercase tracking-[0.15em]`
- Secondary: transparent, `border border-charcoal/20`, hover invert to charcoal fill
- Motion: `duration-[400ms] ease-[cubic-bezier(.16,1,.3,1)]`; particle burst on click (subtle, not arcade)
- No bounce, flash, or neon glow

### Navigation — `Navbar`

- Minimal links; active state uses `bg-moss`
- CTA pill: moss fill, `rounded-full`, gentle `hover:scale-105`

### Cards and surfaces

- Light cards: cream/white with whisper border, minimal shadow
- Dark reframe band: `bg-charcoal text-cream rounded-t-[3rem]` (see `WorkPage`)
- Border radius: restrained — `rounded-2xl` to `rounded-[3rem]` for section caps; `rounded-full` for pills only
- Avoid card-in-card-in-card nesting

### Reflection / teaching blocks

- Eyebrow in mono, question in large italic serif
- Optional fog-to-clarity scroll (GSAP + soft particles)
- Curtain split panels: oversized serif letters on cream panels (`CurtainReveal`)

### Dividers

- `border-charcoal/10` or `border-cream/10`
- 1px only; moss at low opacity for accent rules

---

## 7. Hero and homepage patterns

Current home stack (`HomePageContent`):

1. **Hero** — full-bleed image or shader, cream/charcoal type, mono eyebrow, serif headline, optional CTA link
2. **Curtain reveal** — split `THE / MIND` (or similar) panels scroll apart; teaching copy centered

**Hero rules:**

- One primary invitation, not a button farm
- CTA copy: invitational ("A moment to go within"), never urgent
- Supporting line can live in eyebrow (e.g. peace / natural state)
- No "Scroll to explore", chevrons, or filler chrome

**Revised copy (production preview):** `/revised` routes apply `clientFeedbackRevisionContent.ts` to the live component tree.

**Layout playground:** `/layout-tests` (`LayoutTestsPage.tsx`) — experimental layouts only; does not affect `/` or `/revised` until promoted.

---

## 8. Motion and interaction

**Library:** GSAP + ScrollTrigger (`gsap-scrolltrigger` patterns)

| Pattern | Implementation | When |
|---------|----------------|------|
| Scroll scrub | `scrub: 1` on ScrollTrigger | Curtain, fog reveal |
| Entrance | `power3.inOut`, clip-path reveals | Work page titles |
| Ambient drift | slow `sine.inOut` yoyo on blurred blobs | Work/science headers |
| Easing token | `.cinematic-ease` → `cubic-bezier(0.16, 1, 0.3, 1)` | Hovers, UI transitions |

**Rules:**

- Animate `transform` and `opacity` only in hot paths
- Honor `prefers-reduced-motion: reduce` — disable ambient loops and hover lifts
- Transitions feel **heavy and soft**, not snappy or bouncy
- Duration: 300–500ms UI; 1–2s+ for scroll-linked teaching moments

---

## 9. Dark mode and immersive pages

Use `.brief-dark` on `PageLayout` for spectrum/brief-style pages:

- Base `#080a09` with moss/clay radial washes
- Remap `text-charcoal/*` and `border-charcoal/*` utilities to cream equivalents (see `index.css`)
- Selection: `selection:bg-clay/35 selection:text-cream`

Moodboard and internal tools may use darker `#050806` grids; public marketing pages stay closer to brand cream/charcoal.

---

## 10. Imagery and texture

- Photography: nature, fog, hands, quiet interiors; desaturated, warm
- Overlays: gradient scrims `from-charcoal/80` or `to-transparent` for legibility
- Grain: global `.noise-overlay` at 5% multiply on light pages
- No stock "corporate handshake" or hyper-saturated lifestyle clichés

---

## 11. Copy and voice (UI text)

- Short sentences. Space between ideas.
- Questions over declarations where teaching ("Who is listening?")
- Avoid: Elevate, Seamless, Unleash, Next-Gen, Revolutionary, limited-time, act now
- CTAs: Begin, Explore, Read, A moment to… — never "Get started free"

---

## 12. File map for implementers

| Need | File |
|------|------|
| CSS tokens | `src/index.css` |
| Visual token board | `src/DesignSystem.tsx` → `/design-system` |
| Page shell / theme class | `src/components/PageLayout.tsx` |
| Primary CTA | `src/components/ParticleButton.tsx` |
| Home sections | `src/components/Hero.tsx`, `CurtainReveal.tsx` |
| Work page template | `src/pages/WorkPage.tsx` |
| Layout playground | `src/pages/LayoutTestsPage.tsx` → `/layout-tests` |
| Client copy revisions | `src/data/clientFeedbackRevisionContent.ts` → `/revised` |
| Moodboard reference | `docs/formless-moodboard.html` |
| Color explorations | `/colors` route |

When changing tokens, update **`index.css` `@theme` first**, then sync `DesignSystem.tsx` swatches if colors shift.

---

## 13. Anti-patterns (banned)

- Pop-ups, countdown timers, sticky email banners
- Dense bento grids with identical cards
- `Inter` as display font
- Purple AI gradients and glassmorphism stacks
- Bouncing buttons, confetti, gamification
- Fake metrics (`99.99%`, `10M+ users`)
- Generic names (John Doe, Acme Corp)
- Overlapping unreadable headline-on-image stacks without scrim
- `z-index` wars outside nav/modal/overlay
- Horizontal scroll on mobile
- Circular spinners — use skeleton or calm fade if loading states are needed

---

## 14. Quick Tailwind cheat sheet

```tsx
// Eyebrow
<span className="font-mono text-xs tracking-[0.3em] uppercase text-charcoal/40" />

// Serif teaching headline (dark section)
<h2 className="font-serif italic text-4xl md:text-6xl text-cream leading-[1.1]" />

// Body lede
<p className="text-lg text-charcoal/60 leading-relaxed max-w-xl" />

// Dark immersion section
<section className="bg-charcoal text-cream px-6 md:px-16 py-24 rounded-t-[3rem]" />

// Moss primary button (prefer ParticleButton component)
<button className="bg-moss text-cream rounded-full px-8 py-4 text-sm font-semibold uppercase tracking-[0.15em]" />
```

---

*Read this file before designing or implementing any new page, section, or component in `formless-web`.*
