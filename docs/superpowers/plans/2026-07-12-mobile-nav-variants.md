# Mobile Navigation Variants Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement two immersive mobile navigation variants — "The Shroud" (GSAP clip-path panel from right) and "The Bloom" (GSAP circle-expand from hamburger origin) — selectable via feature flag, replacing the existing generic bottom sheet on mobile.

**Architecture:** The `getMobileNavVariant()` helper is added to the existing `src/config/featureFlags.ts`, reading from `?mobileNav=` query param (for previewing) then `VITE_MOBILE_NAV_VARIANT` env var. `Navbar.tsx` exports the shared `NavLinkItem` and `MobileNavPanelProps` types, then renders the correct panel component based on the flag. Each panel is fully self-contained, uses `createPortal` to `document.body`, and runs its own GSAP animations internally.

**Tech Stack:** React 18, TypeScript, GSAP 3.14.2 (already installed), Tailwind CSS v4, `lucide-react`, `createPortal`

## Global Constraints

- No new npm dependencies — GSAP `^3.14.2` and `@gsap/react ^2.1.2` are already installed
- Desktop nav (`md:flex`) must not be touched in any task
- Both panels must accept exactly `MobileNavPanelProps` — no new props
- All nav content comes from the same `ContentContext` props passed from `Navbar.tsx`
- Brand colors: `bg-charcoal` (#1a1a1a), `text-cream` (#f2f0e9) — use Tailwind tokens only
- Mobile breakpoint: `md:hidden` (below 768px) — both panels must include `md:hidden` on their root
- Reduced motion: skip all GSAP transitions, show/hide instantly when `window.matchMedia('(prefers-reduced-motion: reduce)').matches`
- TypeScript check command: `npx tsc -b`
- Dev server: `npm run dev`
- The `restricted` site mode is handled in `Navbar.tsx` already — panels only render when `!restricted`

---

### Task 1: Feature flag + export shared types

**Files:**
- Modify: `src/config/featureFlags.ts` (add `getMobileNavVariant`)
- Modify: `src/components/Navbar.tsx` (export `NavLinkItem` and `MobileNavPanelProps`)

**Interfaces:**
- Produces:
  - `MobileNavVariant` — `'default' | 'shroud' | 'bloom'`
  - `getMobileNavVariant(search?: string): MobileNavVariant` — imported by `Navbar.tsx`
  - `NavLinkItem` (exported) — imported by both panel components
  - `MobileNavPanelProps` (exported) — imported by both panel components

- [ ] **Step 1: Add `getMobileNavVariant` to `src/config/featureFlags.ts`**

Append to the end of the existing file:

```typescript
const MOBILE_NAV_VARIANT_QUERY_KEY = 'mobileNav';

export type MobileNavVariant = 'default' | 'shroud' | 'bloom';

/** Which mobile nav variant to render. `?mobileNav=shroud|bloom` or `VITE_MOBILE_NAV_VARIANT=shroud|bloom`. Default: 'default'. */
export function getMobileNavVariant(search?: string): MobileNavVariant {
  if (typeof window !== 'undefined' || search !== undefined) {
    const params = new URLSearchParams(search ?? window.location.search);
    const fromQuery = params.get(MOBILE_NAV_VARIANT_QUERY_KEY);
    if (fromQuery === 'shroud' || fromQuery === 'bloom') return fromQuery;
  }
  const fromEnv = import.meta.env.VITE_MOBILE_NAV_VARIANT;
  if (fromEnv === 'shroud' || fromEnv === 'bloom') return fromEnv;
  return 'default';
}
```

- [ ] **Step 2: Export `NavLinkItem` and `MobileNavPanelProps` from `Navbar.tsx`**

In `src/components/Navbar.tsx`, add the `export` keyword to both type declarations. Current lines 22–27:

```typescript
// Change from:
type NavLinkItem = {

// Change to:
export type NavLinkItem = {
```

Current lines 174–180:

```typescript
// Change from:
type MobileNavPanelProps = {

// Change to:
export type MobileNavPanelProps = {
```

- [ ] **Step 3: Verify TypeScript**

```bash
npx tsc -b
```

Expected: exits with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/config/featureFlags.ts src/components/Navbar.tsx
git commit -m "feat: add mobile nav variant flag and export shared nav types"
```

---

### Task 2: Build `MobileNavShroud.tsx` — The Shroud

**Files:**
- Create: `src/components/MobileNavShroud.tsx`

**Interfaces:**
- Consumes:
  - `MobileNavPanelProps` from `./Navbar`
  - `NavLinkItem` from `./Navbar`
  - `captureCtaClick` from `@/lib/analytics`
  - `logoWhiteSrc` from `../../design/eyes-closed-logo-variations/Final-logos/09a-white-ec-notagline.svg`
- Produces: `MobileNavShroud` — default React component matching `MobileNavPanelProps`

**Animation spec:**

Open (all positions are on a GSAP timeline, labeled by offset seconds):
- `0s` — backdrop: `opacity 0 → 1`, duration 0.3s, `power2.out`
- `0s` — panel: `clipPath 'inset(0 100% 0 0)' → 'inset(0 0% 0 0)'`, duration 0.45s, `power3.out`
- `0.1s` — accent line: `scaleY 0 → 1` (transformOrigin top), duration 0.4s, `power2.inOut`
- `0.25s` — links: `opacity 0→1, x 16→0`, stagger 0.06s, duration 0.35s, `power2.out`

Close (regular `gsap.timeline({ onComplete: onClose })`):
- `0s` — links: `opacity → 0`, duration 0.1s
- `0s` — panel: `clipPath → 'inset(0 100% 0 0)'`, duration 0.35s, `power3.in`
- `0s` — backdrop: `opacity → 0`, duration 0.3s

- [ ] **Step 1: Create `src/components/MobileNavShroud.tsx`**

```tsx
import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { X } from 'lucide-react';
import type { MobileNavPanelProps, NavLinkItem } from './Navbar';
import { captureCtaClick } from '@/lib/analytics';
import logoWhiteSrc from '../../design/eyes-closed-logo-variations/Final-logos/09a-white-ec-notagline.svg';

const linkFocus =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream/80';

function ShroudNavLink({
  href,
  text,
  isActive,
  onNavigate,
}: {
  href: string;
  text: string;
  isActive: boolean;
  onNavigate: () => void;
}) {
  return (
    <a
      href={href}
      aria-current={isActive ? 'page' : undefined}
      onClick={() => {
        captureCtaClick(text, href, 'navbar_mobile_shroud');
        onNavigate();
      }}
      className={`shroud-link flex min-h-11 w-full items-center px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] transition-colors ${linkFocus} ${
        isActive ? 'text-cream' : 'text-cream/60 hover:text-cream'
      }`}
    >
      {text}
    </a>
  );
}

export function MobileNavShroud({
  brandName,
  navLinks,
  aboutCta,
  aboutIsActive,
  onClose,
}: MobileNavPanelProps) {
  const backdropRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const accentLineRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleClose = useCallback(() => {
    if (prefersReducedMotion) {
      onClose();
      return;
    }
    const tl = gsap.timeline({ onComplete: onClose });
    const linkEls = linksRef.current?.querySelectorAll('.shroud-link') ?? [];
    if (linkEls.length) tl.to(linkEls, { opacity: 0, duration: 0.1 }, 0);
    tl.to(panelRef.current, { clipPath: 'inset(0 100% 0 0)', duration: 0.35, ease: 'power3.in' }, 0);
    tl.to(backdropRef.current, { opacity: 0, duration: 0.3 }, 0);
  }, [onClose, prefersReducedMotion]);

  // Open animation on mount
  useEffect(() => {
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      const linkEls = linksRef.current?.querySelectorAll('.shroud-link') ?? [];
      // Panel clipPath hides links during initial set — no flash risk
      gsap.set(accentLineRef.current, { scaleY: 0, transformOrigin: 'top center' });
      if (linkEls.length) gsap.set(linkEls, { opacity: 0, x: 16 });

      const tl = gsap.timeline();
      tl.to(backdropRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' }, 0);
      tl.to(panelRef.current, { clipPath: 'inset(0 0% 0 0)', duration: 0.45, ease: 'power3.out' }, 0);
      tl.to(accentLineRef.current, { scaleY: 1, duration: 0.4, ease: 'power2.inOut' }, 0.1);
      if (linkEls.length) {
        tl.to(linkEls, { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out', stagger: 0.06 }, 0.25);
      }
    });
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleClose]);

  const allLinks: NavLinkItem[] = [
    ...navLinks,
    { key: 'about', text: aboutCta.text, href: aboutCta.href, isActive: aboutIsActive },
  ];

  return createPortal(
    <div className="fixed inset-0 z-[100] md:hidden" role="presentation">
      {/* Darkened backdrop — tapping closes the menu */}
      <button
        ref={backdropRef}
        type="button"
        style={{ opacity: 0 }}
        className="absolute inset-0 bg-charcoal/40"
        aria-label="Close main menu"
        onClick={handleClose}
      />

      {/* Panel — clips in from right, 72% width */}
      <div
        ref={panelRef}
        id="site-nav-mobile-panel"
        style={{ clipPath: 'inset(0 100% 0 0)' }}
        className="absolute bottom-0 right-0 top-0 w-[72%] bg-charcoal/90 backdrop-blur-xl"
        role="dialog"
        aria-modal="true"
        aria-label="Main menu"
      >
        {/* Accent line — draws down the left edge as the panel opens */}
        <div
          ref={accentLineRef}
          className="absolute bottom-0 left-0 top-0 w-px bg-cream/20"
          aria-hidden
        />

        {/* Header row: close button */}
        <div className="flex items-center justify-end p-4">
          <button
            type="button"
            className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream ${linkFocus}`}
            onClick={handleClose}
            aria-label="Close main menu"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        {/* Logo */}
        <div className="px-6 pb-6">
          <img
            src={logoWhiteSrc}
            alt={brandName}
            width={1929}
            height={865}
            className="h-[5rem] w-auto"
          />
        </div>

        {/* Nav links */}
        <ul ref={linksRef} className="flex flex-col">
          {allLinks.map((link) => (
            <li key={link.key}>
              <ShroudNavLink
                href={link.href}
                text={link.text}
                isActive={link.isActive}
                onNavigate={handleClose}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>,
    document.body,
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc -b
```

Expected: exits with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/MobileNavShroud.tsx
git commit -m "feat: add MobileNavShroud — GSAP clip-path right-panel mobile nav"
```

---

### Task 3: Build `MobileNavBloom.tsx` — The Bloom

**Files:**
- Create: `src/components/MobileNavBloom.tsx`

**Interfaces:**
- Consumes:
  - `MobileNavPanelProps` from `./Navbar`
  - `NavLinkItem` from `./Navbar`
  - `captureCtaClick` from `@/lib/analytics`
- Produces: `MobileNavBloom` — default React component matching `MobileNavPanelProps`

**Bloom origin constants** (hamburger button center, approximated from Navbar padding):
- X: `calc(100% - 2.625rem)` — right padding (px-5 = 1.25rem) + half button width (min-w-11/2 = 1.375rem)
- Y: `2.5rem` — top padding (py-4 = 1rem) + half button height (min-h-11/2 = 1.375rem) ≈ 2.375rem

**Animation spec:**

Open:
- `0s` — scrim circle: `circle(0px at ORIGIN) → circle(200vmax at ORIGIN)`, opacity `0 → 1`, duration 0.55s, `power3.out`
- `0.2s` — links: `opacity 0→1, y 32→0`, stagger 0.08s, duration 0.5s, `back.out(1.2)`
- `0.35s` — close button: `opacity 0 → 1`, duration 0.2s

Close (reversed, `onComplete: onClose`):
- `0s` — links: `opacity → 0, y → 20`, stagger 0.04s, duration 0.2s, `power2.in`
- `0s` — close button: `opacity → 0`, duration 0.15s
- `0.1s` — scrim circle: `circle(200vmax → 0px)`, opacity `→ 0`, duration 0.4s, `power3.in`

Touch gesture: swipe up (deltaY > 60px) triggers `handleClose`.

- [ ] **Step 1: Create `src/components/MobileNavBloom.tsx`**

```tsx
import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { X } from 'lucide-react';
import type { MobileNavPanelProps, NavLinkItem } from './Navbar';
import { captureCtaClick } from '@/lib/analytics';

const linkFocus =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream/80';

// Hamburger button center: right padding (px-5=1.25rem) + half min-w-11 (1.375rem) from right edge;
// top padding (py-4=1rem) + half min-h-11 (1.375rem) from top
const BLOOM_ORIGIN = 'calc(100% - 2.625rem) 2.5rem';

function BloomNavLink({
  href,
  text,
  isActive,
  onNavigate,
}: {
  href: string;
  text: string;
  isActive: boolean;
  onNavigate: () => void;
}) {
  return (
    <a
      href={href}
      aria-current={isActive ? 'page' : undefined}
      onClick={() => {
        captureCtaClick(text, href, 'navbar_mobile_bloom');
        onNavigate();
      }}
      className={`bloom-link inline-flex min-h-11 w-full items-center justify-center rounded-full px-8 py-3 text-xl font-semibold uppercase tracking-[0.12em] transition-colors ${linkFocus} ${
        isActive ? 'bg-cream/10 text-cream' : 'text-cream/70 hover:text-cream'
      }`}
    >
      {text}
    </a>
  );
}

export function MobileNavBloom({
  navLinks,
  aboutCta,
  aboutIsActive,
  onClose,
}: MobileNavPanelProps) {
  const scrimRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartY = useRef<number>(0);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleClose = useCallback(() => {
    if (prefersReducedMotion) {
      onClose();
      return;
    }
    const tl = gsap.timeline({ onComplete: onClose });
    const linkEls = linksRef.current?.querySelectorAll('.bloom-link') ?? [];
    if (linkEls.length) {
      tl.to(linkEls, { opacity: 0, y: 20, duration: 0.2, ease: 'power2.in', stagger: 0.04 }, 0);
    }
    tl.to(closeButtonRef.current, { opacity: 0, duration: 0.15 }, 0);
    tl.to(
      scrimRef.current,
      { clipPath: `circle(0px at ${BLOOM_ORIGIN})`, opacity: 0, duration: 0.4, ease: 'power3.in' },
      0.1,
    );
  }, [onClose, prefersReducedMotion]);

  // Open animation on mount
  useEffect(() => {
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      const linkEls = linksRef.current?.querySelectorAll('.bloom-link') ?? [];
      // Scrim clipPath hides content initially — no flash risk for links
      if (linkEls.length) gsap.set(linkEls, { opacity: 0, y: 32 });

      const tl = gsap.timeline();
      tl.to(
        scrimRef.current,
        {
          clipPath: `circle(200vmax at ${BLOOM_ORIGIN})`,
          opacity: 1,
          duration: 0.55,
          ease: 'power3.out',
        },
        0,
      );
      if (linkEls.length) {
        tl.to(
          linkEls,
          { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.2)', stagger: 0.08 },
          0.2,
        );
      }
      tl.to(closeButtonRef.current, { opacity: 1, duration: 0.2 }, 0.35);
    });
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleClose]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = touchStartY.current - e.changedTouches[0].clientY;
    if (delta > 60) handleClose();
  };

  const allLinks: NavLinkItem[] = [
    ...navLinks,
    { key: 'about', text: aboutCta.text, href: aboutCta.href, isActive: aboutIsActive },
  ];

  return createPortal(
    <div
      className="fixed inset-0 z-[100] md:hidden"
      role="presentation"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Bloom scrim — circle expands from hamburger button position */}
      <div
        ref={scrimRef}
        id="site-nav-mobile-panel"
        style={{ clipPath: `circle(0px at ${BLOOM_ORIGIN})`, opacity: 0 }}
        className="absolute inset-0 bg-charcoal/80 backdrop-blur-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Main menu"
      >
        {/* Close button */}
        <button
          ref={closeButtonRef}
          type="button"
          style={{ opacity: 0 }}
          className={`absolute right-4 top-4 inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream ${linkFocus}`}
          onClick={handleClose}
          aria-label="Close main menu"
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
        >
          <X className="h-5 w-5" aria-hidden />
        </button>

        {/* Centered nav links */}
        <div className="flex h-full flex-col items-center justify-center px-8">
          <ul
            ref={linksRef}
            className="flex w-full max-w-xs flex-col items-center gap-3"
          >
            {allLinks.map((link) => (
              <li key={link.key} className="w-full">
                <BloomNavLink
                  href={link.href}
                  text={link.text}
                  isActive={link.isActive}
                  onNavigate={handleClose}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>,
    document.body,
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc -b
```

Expected: exits with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/MobileNavBloom.tsx
git commit -m "feat: add MobileNavBloom — GSAP circle-bloom spring mobile nav"
```

---

### Task 4: Wire up variants in `Navbar.tsx` + hamburger contrast fix

**Files:**
- Modify: `src/components/Navbar.tsx`

**Interfaces:**
- Consumes:
  - `getMobileNavVariant` from `@/config/featureFlags`
  - `MobileNavShroud` from `./MobileNavShroud`
  - `MobileNavBloom` from `./MobileNavBloom`

- [ ] **Step 1: Add imports to `Navbar.tsx`**

After the existing imports (after line 11, the `logoWhiteSrc` import), add:

```typescript
import { getMobileNavVariant } from '@/config/featureFlags';
import { MobileNavShroud } from './MobileNavShroud';
import { MobileNavBloom } from './MobileNavBloom';
```

- [ ] **Step 2: Add `mobileNavVariant` inside the `Navbar` function**

Inside the `Navbar` function body, after the `const closeMobile = ...` line (line 288), add:

```typescript
const mobileNavVariant = getMobileNavVariant();
```

- [ ] **Step 3: Fix hamburger button contrast**

Find the hamburger `<button>` (around line 377 — the one with `aria-label="Open main menu"`). Add `bg-charcoal/50 backdrop-blur-sm` to its `className`:

```tsx
// Before:
className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-cream transition-colors hover:bg-cream/10 ${linkFocus}`}

// After:
className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-charcoal/50 backdrop-blur-sm text-cream transition-colors hover:bg-cream/10 ${linkFocus}`}
```

- [ ] **Step 4: Replace `MobileNavPanel` render with variant switch**

Find the bottom of the `Navbar` return (around line 393), where `MobileNavPanel` is rendered:

```tsx
// Replace the entire block:
{!restricted && mobileOpen ? (
  <MobileNavPanel
    brandName={brandName}
    navLinks={navLinks}
    aboutCta={aboutCta}
    aboutIsActive={aboutIsActive}
    onClose={closeMobile}
  />
) : null}

// With:
{!restricted && mobileOpen ? (
  mobileNavVariant === 'shroud' ? (
    <MobileNavShroud
      brandName={brandName}
      navLinks={navLinks}
      aboutCta={aboutCta}
      aboutIsActive={aboutIsActive}
      onClose={closeMobile}
    />
  ) : mobileNavVariant === 'bloom' ? (
    <MobileNavBloom
      brandName={brandName}
      navLinks={navLinks}
      aboutCta={aboutCta}
      aboutIsActive={aboutIsActive}
      onClose={closeMobile}
    />
  ) : (
    <MobileNavPanel
      brandName={brandName}
      navLinks={navLinks}
      aboutCta={aboutCta}
      aboutIsActive={aboutIsActive}
      onClose={closeMobile}
    />
  )
) : null}
```

- [ ] **Step 5: Verify TypeScript**

```bash
npx tsc -b
```

Expected: exits with no errors.

- [ ] **Step 6: Run dev server and manually test all three variants**

```bash
npm run dev
```

Resize browser to < 768px width, then test:

**Default (no query param):**
- Hamburger button has a visible dark pill backdrop (contrast fix)
- Tap hamburger → existing bottom sheet opens as before
- Escape key closes it

**Shroud (`http://localhost:5173/?mobileNav=shroud`):**
- Hamburger has contrast backdrop
- Tap hamburger → dark overlay fades in over left 28%; panel clips in from right edge (72% width)
- A thin cream accent line draws down the panel's left edge
- Links stagger in from right inside the panel
- Tap X button inside panel → links fade, panel clips back out to the right
- Tap the dark left-side backdrop → same close behavior
- Escape key → closes with animation
- Page content visible through left 28% of screen (blurred/dimmed)
- No desktop nav changes at 768px+

**Bloom (`http://localhost:5173/?mobileNav=bloom`):**
- Tap hamburger → circle expands from top-right corner outward
- Page blurs behind the scrim
- Links float up from center of screen with spring easing, staggered
- Close button fades in at top-right after links appear
- Tap X → links drop down, circle collapses back to hamburger origin
- Swipe up quickly → same close behavior
- Escape key → closes
- No desktop nav changes at 768px+

**Reduced motion** (enable in OS/browser accessibility settings):
- All three variants: menu appears/disappears instantly, no animation

- [ ] **Step 7: Commit**

```bash
git add src/components/Navbar.tsx
git commit -m "feat: wire mobile nav variants with hamburger contrast fix"
```
