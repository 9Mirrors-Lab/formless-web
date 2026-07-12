# Formless Web — design document

**Repository:** `formless-web`  
**Document title (site):** Remembering Who You Are Beyond The Mind — from [`index.html`](index.html)  
**Philosophy:** [`formless_design_philosophy.md`](formless_design_philosophy.md)  
**Brand strategy:** [`../BRAND_STRATEGY.md`](../BRAND_STRATEGY.md)  
**Live token reference:** `/design-system` ([`src/DesignSystem.tsx`](src/DesignSystem.tsx))

This file is the entry point for anyone designing or building in this repo. Copy, labels, and structure come from the codebase and Supabase seed; nothing here is invented.

---

## What this codebase is

`formless-web` is the public marketing site for **Eyes Closed** (organization brand) and **Formless** (the book). It is a React + Vite + TypeScript SPA that:

- Loads almost all visitor-facing copy from **Supabase** (`public.content` rows keyed by `page` / `section` / `key`)
- Applies a **client revision overlay** at runtime via [`applyClientFeedbackRevision`](src/data/clientFeedbackRevisionContent.ts) in [`ContentProvider`](src/context/ContentContext.tsx)
- Renders a **teaching journey** in scroll-linked sections (hero → curtain reveal → practice accordion → book → science → about), not a conventional product landing page
- Supports optional **teaser mode** (`VITE_PUBLIC_SITE_RESTRICTED=true`) that shows only the home experience
- Supports optional **member auth** (Supabase) and **PostHog** analytics

The Vite template [`README.md`](README.md) is boilerplate only. Product truth lives in migrations, revision content, and [`src/data/briefContent.ts`](src/data/briefContent.ts).

---

## Goals (from project brief)

From [`WEBSITE_BRIEF`](src/data/briefContent.ts) and [`POSITIONING_STATEMENT`](src/data/briefContent.ts):

| Goal | Source language |
|------|-----------------|
| **Primary audience** | Anyone who has had enough — suffering, stress, pain, anger, lack, discontentment |
| **Core website job** | Help visitors see that inner life is dictated by outer circumstances, then offer a doorway inward |
| **Core transformation** | From absorbed in the problem → recognizing awareness behind the problem |
| **Positioning** | A quiet invitation to stop, pause, go within, and meet the work behind Formless so they can live with more space, peace, and groundedness regardless of outer circumstances |
| **First release strategy** | Feel seen → create the pause → land the central insight → invite reflection before asking for action |
| **What it is not** | A conventional sales page, a method brand, or a conversion funnel |

**Primary promise** (brand strategy): Peace is internal and unshakeable, regardless of outer circumstances.

**Tone keywords** (brief): Calm, direct, spacious, compassionate, clear, reflective, nonjudgmental, grounded.

---

## Brand hierarchy (use this layering)

Runtime nav/footer copy comes from the client revision transform. Seed migrations retain older labels for reference.

| Layer | Name | Role in UI |
|-------|------|------------|
| Organization | **Eyes Closed** | Nav wordmark, footer, legal entity (Sonika Cottman) |
| Book | **Formless** | Book title, `/book` nav label, cover title |
| Practice area | **The Practice** | `/work` route and teaching content (seed: "The Work") |
| Science | **Spirituality & Science** | `/science` nav label (seed: "Science") |

**Philosophy framing** ([`formless_design_philosophy.md`](formless_design_philosophy.md)): Studio, not storefront. Sanctuary, not billboard.

**Contact:** `hello@eyesclosed.love` (footer seed and revision)

---

## The product's native shape

The site is organized as a **visitor journey**, not a feature grid. The brief defines this arc in [`VISITOR_JOURNEY`](src/data/briefContent.ts):

1. **Recognition** — visitor feels seen in exhaustion, anger, stress, or searching
2. **Pause** — interrupts the fixing reflex
3. **Reframe** — voice in the head vs. the one listening
4. **Pattern** — same inner mechanism across life domains
5. **Doorway** — book as guide into the teaching
6. **Bridge** — science for the mind that needs rational foothold
7. **Invitation** — stay close, return when ready

**Homepage weight** (what leads, what measures):

The homepage is only two sections — [`Hero`](src/components/Hero.tsx) then [`CurtainReveal`](src/components/CurtainReveal.tsx). The central teaching question dominates before any nav depth:

| Section | Production copy (revision transform) |
|---------|--------------------------------------|
| Hero eyebrow | An Invitation to go within |
| Hero headline | Remembering Who You Are / Beyond The Mind |
| Hero lede | The world teaches you to look outward for fulfillment. Eyes Closed points you inward. |
| Hero CTA | A moment to go within |
| Curtain headline | Freedom begins the moment / you observe the mind |
| Curtain panels | THE / MIND |
| Curtain subtitle | Behind every thought is the awareness that sees it… |

Seed copy (DB, pre-transform) used the parallel arc: "For anyone who has had enough" → "There is another way to live" → "If you can hear the voice, who is listening?" with panels **THE / VOICE**.

**Messaging pillars** (repeatable truths from brief):

- Anyone who has had enough
- You are not the voice — you are the one listening
- Peace is not circumstantial
- Allow without judgment
- Every problem points to the same pattern

---

## Site map and routes

Routing is path-based in [`PublicShell.tsx`](src/PublicShell.tsx) (no React Router).

### Public journey (primary)

| Route | Page | Native structure |
|-------|------|------------------|
| `/` | Home | Hero → Curtain reveal |
| `/work` | The Practice | Header → category accordion (4 life domains) → reframe band → CTA to book |
| `/book` | Formless | Header + waitlist → cover → pause/observe/recognize quotes → four themes → closing CTAs |
| `/science` | Spirituality & Science | Header → three pillars (perception, observation, neuroplasticity) → closing |
| `/about` | About | Author story → future offerings → Stay Close email |

### Legal

| Route | Purpose |
|-------|---------|
| `/privacy` | Eyes Closed privacy policy |
| `/terms` | Terms of use |
| `/disclaimer` | Educational-content disclaimer |

### Auth (optional)

| Route | Purpose |
|-------|---------|
| `/login`, `/signup`, `/account`, `/auth/callback` | Supabase member auth |
| `/client/site-updates` | Client updates view |

Controlled by [`VITE_PUBLIC_MEMBER_AUTH_NAV`](.env.example) for nav visibility.

### Internal / design tooling (not public marketing)

`/design-system`, `/icons`, `/colors`, `/fonts`, `/backgrounds`, `/shader`, `/brief`, `/brief2`, `/moodboard`, `/layout-tests`, `/pattern-mirror`, `/design-framework`, `/brand-kit-export`, `/eyes-closed-logo-options`, `/work2`, `/about-magazine`

### Config flags

| Variable | Effect |
|----------|--------|
| `VITE_PUBLIC_SITE_RESTRICTED=true` | Home only; deep URLs normalize to `/`; footer links non-navigable ([`publicSite.ts`](src/config/publicSite.ts)) |
| Missing Supabase env | "Content unavailable" — see `.env.example` error copy |

---

## Content model (critical)

All marketing copy flows through one pipeline:

```
Supabase content rows → buildContentTree() → applyClientFeedbackRevision() → useContent() hooks
```

| Concept | Location |
|---------|----------|
| Row schema | [`ContentRow`](src/lib/content.ts) — `page`, `section`, `key`, `value`, `type`, `order` |
| Seed data | [`supabase/migrations/20260504000001_seed_content.sql`](supabase/migrations/20260504000001_seed_content.sql) |
| Runtime revision | [`src/data/clientFeedbackRevisionContent.ts`](src/data/clientFeedbackRevisionContent.ts) |
| Fetch + API | [`src/context/ContentContext.tsx`](src/context/ContentContext.tsx) |
| Helpers | `getText`, `getLink`, `getImage`, `listItems` in [`src/lib/content.ts`](src/lib/content.ts) |

**Value types:** `text`, `link`, `image`, `list_item` (accordion categories, book themes, science pillars, about future items).

**Error messages (real):**

- Loading: `Loading…`
- Misconfigured: `Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. See .env.example.`
- Failure: `Content unavailable`

When adding copy, update the revision transform and/or a migration — not hardcoded strings in page components.

---

## Page copy inventory (production revision)

### Navigation

- Eyes Closed · The Practice · Formless · Spirituality & Science · About

### The Practice (`/work`)

| Block | Copy |
|-------|------|
| Eyebrow | The Practice |
| Title | Learn to observe the mind / without becoming lost in it. |
| Accordion eyebrow | The Pattern Repeats Until It Is Seen |
| Accordion title | Outer circumstances change. / The pattern remains. |
| Categories | Relationships · Career & Financial Wealth · Body & Health · Family & Origins |
| Reframe | You are not your thoughts or emotions. / You are the one that observes them. You are awareness. |
| CTA | Explore Formless → `/book` |

### Formless (`/book`)

| Block | Copy |
|-------|------|
| Lede | You are not your thoughts or emotions. Formless takes you within to discover what exists beyond them. |
| Quotes | Pause. / Observe. / Recognize. |
| Themes | Awareness · Presence · Peace · Freedom |
| Waitlist | Join the waitlist… · Releasing September 1 · No spam. Unsubscribe anytime. |
| Errors | Enter a valid email, or try again in a moment. |

### Spirituality & Science (`/science`)

| Block | Copy |
|-------|------|
| Pillars | Perception · Observation · Neuroplasticity |
| Closing | You are not the constructed perception. / You are the awareness that sees it. |

### About (`/about`)

| Block | Copy |
|-------|------|
| Subject | Sonika Cottman — Awareness Guide, author, founder of Eyes Closed |
| Future | Talks & Gatherings · Retreats · Community · Deeper Teachings |
| Stay Close | Return when you are ready. · No spam. Unsubscribe anytime. |

### Footer (revision)

Tagline: *An invitation to go within and meet yourself beyond the identities and stories.*  
Copyright: © 2026 Eyes Closed. All rights reserved.

---

## Visual identity (from code)

Token source of truth: [`src/index.css`](src/index.css) `@theme` block.

### Color palette

| Token | Hex | Role |
|-------|-----|------|
| `moss` | `#2e4036` | Primary accent, buttons, selection |
| `clay` | `#cc5833` | Warm accent, links, emphasis |
| `cream` | `#f2f0e9` | Light background, text on dark |
| `charcoal` | `#1a1a1a` | Light-mode text, dark sections |

Extended in components: moss light `#9fb5aa`, clay light `#d46544`, immersive base `.brief-dark` `#080a09`.

**Banned:** pure `#000000` / `#FFFFFF` page backgrounds, neon purple gradients, default zinc/slate without mapping.

### Typography

| Role | Family | Tailwind |
|------|--------|----------|
| UI / body | Plus Jakarta Sans | `font-sans` |
| Editorial | Cormorant Garamond | `font-serif` |
| Metadata | System mono | `font-mono` |

Fallback sans: Outfit (loaded in `index.html`). Do not use Inter.

**Hierarchy pattern:** massive italic serif + tiny mono eyebrows (`tracking-[0.25em]`–`[0.3em]` uppercase).

### Spacing and layout

- Base unit: 8px (Tailwind default)
- Gutters: `px-6 md:px-16 lg:px-24`
- Section rhythm: `py-16 md:py-24` to `py-24 md:py-32`
- Reading width: `max-w-6xl` primary, `max-w-4xl` centered teaching
- Viewport: `min-h-[100dvh]`, not `h-screen`

### Atmosphere

- Light default: cream canvas, charcoal ink, `.noise-overlay` film grain
- Dark immersion: `.brief-dark` on [`PageLayout`](src/components/PageLayout.tsx) (`briefSpectrum` prop on Work/Science)
- Imagery: nature, fog, quiet interiors; gradient scrims for legibility

### Motion

- **Library:** GSAP + ScrollTrigger
- **Home:** hero fade-in (`power3.out`); scroll scrub on curtain split panels
- **Work:** clip-path title reveal; ambient moss/clay blob drift (`sine.inOut`)
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (`.cinematic-ease`)
- **Rule:** honor `prefers-reduced-motion`; animate transform/opacity in hot paths

### Core components (reuse before inventing)

| Component | File | Use |
|-----------|------|-----|
| `PageLayout` | [`src/components/PageLayout.tsx`](src/components/PageLayout.tsx) | Shell, nav, footer, theme class |
| `Navbar` | [`src/components/Navbar.tsx`](src/components/Navbar.tsx) | Minimal links, moss active state |
| `ParticleButton` | [`src/components/ParticleButton.tsx`](src/components/ParticleButton.tsx) | Primary CTA — moss pill, subtle particle burst |
| `Hero` | [`src/components/Hero.tsx`](src/components/Hero.tsx) | Full-bleed image + scrim stack |
| `CurtainReveal` | [`src/components/CurtainReveal.tsx`](src/components/CurtainReveal.tsx) | Split-panel scroll teaching moment |

---

## Critical files map

| Need | File |
|------|------|
| Entry + routing | [`src/main.tsx`](src/main.tsx), [`src/PublicShell.tsx`](src/PublicShell.tsx) |
| CSS tokens | [`src/index.css`](src/index.css) |
| Content pipeline | [`src/lib/content.ts`](src/lib/content.ts), [`src/context/ContentContext.tsx`](src/context/ContentContext.tsx) |
| Production copy overlay | [`src/data/clientFeedbackRevisionContent.ts`](src/data/clientFeedbackRevisionContent.ts) |
| Strategy brief (static) | [`src/data/briefContent.ts`](src/data/briefContent.ts) |
| DB seed | [`supabase/migrations/20260504000001_seed_content.sql`](supabase/migrations/20260504000001_seed_content.sql) |
| Env contract | [`.env.example`](.env.example) |
| Home stack | [`src/components/HomePageContent.tsx`](src/components/HomePageContent.tsx) |
| Practice page | [`src/pages/WorkPage.tsx`](src/pages/WorkPage.tsx) |
| Book page | [`src/pages/BookPage.tsx`](src/pages/BookPage.tsx) |
| Science page | [`src/pages/SciencePage.tsx`](src/pages/SciencePage.tsx) |
| About page | [`src/pages/AboutPage.tsx`](src/pages/AboutPage.tsx) |
| Visual token board | [`src/DesignSystem.tsx`](src/DesignSystem.tsx) |
| Icon animations | [`src/data/iconAnimations.ts`](src/data/iconAnimations.ts), [`src/hooks/useIconAnimations.ts`](src/hooks/useIconAnimations.ts) |
| Design framework (process) | [`src/data/designFramework.ts`](src/data/designFramework.ts) → `/design-framework` |
| Layout experiments | [`src/pages/LayoutTestsPage.tsx`](src/pages/LayoutTestsPage.tsx) → `/layout-tests` |
| Moodboard | [`docs/formless-moodboard.html`](docs/formless-moodboard.html) |
| Philosophy | [`formless_design_philosophy.md`](formless_design_philosophy.md) |

**Build:** `npm run dev` · `npm run build` · deploy via Vercel ([`vercel.json`](vercel.json))

---

## Design configuration dials

Aligned with production defaults:

| Dial | Level | Meaning here |
|------|-------|--------------|
| Creativity | 5 | Editorial serif + restrained motion |
| Density | 2 | Generous whitespace is structural |
| Variance | 4 | Calm rhythm, subtle asymmetry |
| Motion intent | 5 | Slow scroll reveals, fog-to-clarity, GSAP scrub |

---

## Voice and CTAs (from codebase)

**Use:** Stop. Pause. Go within. Allow. The voice in the head. The one listening. Outer circumstances. Rooted. Grounded. At peace. A moment to reflect. Begin. Explore. Read.

**Avoid** (brief + philosophy): Elevate, Seamless, Unleash, Next-Gen, Revolutionary, limited-time, act now, optimization language, hype, funnels, guaranteed outcomes.

**CTA pattern:** Doorways, not pressure — "A moment to go within", "Explore Formless", "Stay close", "Notify me". Never "Get started free".

---

## Anti-patterns (banned)

- Pop-ups, countdown timers, sticky email banners
- Dense bento grids with identical feature cards
- Three equal cards in a row on marketing pages (prefer accordion, split sections, asymmetric stacks)
- Purple AI gradients, glassmorphism stacks, `Inter` display type
- Bouncing buttons, confetti, fake metrics
- Horizontal scroll on mobile
- Hardcoded marketing copy bypassing the content tree

---

## Designing new work

1. Read this file and [`formless_design_philosophy.md`](formless_design_philosophy.md).
2. Identify where the idea sits on the **visitor journey** — recognition before proof before action.
3. Pull copy from migrations/revision transform; if new copy is needed, add it to the content model.
4. Match tokens in [`src/index.css`](src/index.css); verify on `/design-system`.
5. Reuse `PageLayout`, `ParticleButton`, and existing section patterns before new components.
6. Promote layout experiments from `/layout-tests` only after they serve the journey arc.

---

*Read this file before designing or implementing any new page, section, or component in `formless-web`.*
