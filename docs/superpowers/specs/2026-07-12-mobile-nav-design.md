# Mobile Navigation — Two Immersive Variants
**Date:** 2026-07-12  
**Status:** Approved for implementation

---

## Problem

The current mobile navigation has two issues:
1. The hamburger button loses contrast as the user scrolls past the dark hero into lighter page sections (no scroll-adaptive styling).
2. The bottom sheet that opens is generic — charcoal panel, stacked links, no distinctive motion or personality.

---

## Solution

Two opt-in mobile nav variants controlled by a feature flag (`VITE_MOBILE_NAV_VARIANT`), replacing only `MobileNavPanel` on mobile (`md:hidden`). The hamburger trigger in `Navbar.tsx` is updated in both variants to always maintain contrast. Desktop nav is untouched.

---

## Feature Flag

```
VITE_MOBILE_NAV_VARIANT=shroud | bloom | default
```

- `default` — current behavior (no change)
- `shroud` — Concept A
- `bloom` — Concept B

Read via a helper `getMobileNavVariant()` in `src/config/mobileNav.ts`.

---

## Shared Changes to `Navbar.tsx`

### Hamburger visibility fix
The hamburger button gains a persistent pill-shaped backdrop so it's always visible regardless of page scroll position or background color:

```tsx
// Before
className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-cream ...`}

// After
className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg 
  bg-charcoal/50 backdrop-blur-sm text-cream ...`}
```

### Variant switching
`Navbar.tsx` imports both panels and selects via the flag:

```tsx
const variant = getMobileNavVariant();
// renders MobileNavShroud | MobileNavBloom | MobileNavPanel
```

Both new panels accept the same props as `MobileNavPanel`:
```ts
type MobileNavPanelProps = {
  brandName: string;
  navLinks: NavLinkItem[];
  aboutCta: { text: string; href: string };
  aboutIsActive: boolean;
  onClose: () => void;
}
```

---

## Concept A — "The Shroud" (`MobileNavShroud.tsx`)

**Emotional quality:** Precise / Considered — architectural, deliberate, editorial.

### Layout
- Panel covers **72% of screen width** from the right edge
- Height: 100vh (full height)
- Position: fixed right-0 top-0, z-[100]
- Background: `bg-charcoal/90 backdrop-blur-xl`
- No rounded corners (architectural feel, distinct from current rounded-t-3xl sheet)
- A 1px cream accent line runs down the left edge: `border-l border-cream/20`

### Content layout (inside panel, top → bottom)
1. Close button (top-right of panel, X icon)
2. Brand logo (scaled down, ~5rem height)
3. Vertical nav link list (generous spacing)
4. Optional: BackgroundPicker + account link at bottom

### Animation — GSAP clip-path reveal

**Open sequence:**
1. Backdrop overlay fades in: `opacity: 0 → 0.6`, duration 0.3s, ease `power2.out`
2. Panel clips in from right: `clipPath: "inset(0 100% 0 0)" → "inset(0 0% 0 0)"`, duration 0.45s, ease `power3.out`, starts simultaneously with step 1
3. Accent line draws down: a pseudo-element or thin `<div>` that scales from `scaleY: 0 → 1` on the left edge, duration 0.4s, ease `power2.inOut`, starts 0.1s after panel begins
4. Nav links stagger in: each link `opacity: 0 → 1` + `x: 16 → 0`, stagger 0.06s, ease `power2.out`, starting at 0.25s after panel open begins

**Close sequence (reverse):**
1. Links fade out instantly (opacity 0, 0.1s)
2. Panel clips out to right: `clipPath: "inset(0 0% 0 0)" → "inset(0 100% 0 0)"`, duration 0.35s, ease `power3.in`
3. Backdrop fades out, duration 0.3s

### Hamburger → X morphing
GSAP rotates the three lines of the hamburger to form an X on open, reverses on close. The button remains in the top-right position of the full viewport (outside the panel) so it's always tappable.

### Accessibility
- `role="dialog"`, `aria-modal="true"`, `aria-label="Main menu"` on panel
- Focus trap: first focus goes to close button on open
- Escape key closes
- Backdrop `<button>` with `aria-label="Close main menu"`
- `prefers-reduced-motion`: skip GSAP animations, use instant show/hide

---

## Concept B — "The Bloom" (`MobileNavBloom.tsx`)

**Emotional quality:** Fluid / Gestural — organic, physical, spring-driven.

### Layout
The scrim is a fixed-position full-screen layer. The nav links float in a vertical centered stack. The bloom expands from the hamburger button's corner origin point.

- Scrim: `fixed inset-0 z-[100]`, `bg-charcoal/75 backdrop-blur-2xl`
- The scrim uses a CSS `clip-path: circle(...)` or SVG circle mask that expands from the top-right corner (hamburger position ~`top: 2rem, right: 1.25rem`)
- Nav links: centered stack in the middle of the screen, large type (`text-2xl font-semibold tracking-wide`)
- Close: tap anywhere outside the links, or swipe up

### Animation — GSAP spring expand

**Open sequence:**
1. The scrim's circle clip-path expands: from `circle(22px at calc(100% - 1.5rem) 2.5rem)` to `circle(200vmax at calc(100% - 1.5rem) 2.5rem)`, duration 0.55s, ease `power3.out`
2. The hamburger button scales down briefly (0.85, 0.1s) as a tactile press response, then fades to X
3. Nav links float up from below: each link `opacity: 0 → 1` + `y: 32 → 0`, stagger 0.08s, ease `back.out(1.2)`, starting at 0.2s after bloom begins

**Close sequence:**
1. Links drop: `opacity → 0`, `y → 20`, stagger 0.04s (faster), ease `power2.in`
2. Circle clips back in to origin: `circle(200vmax → 22px)`, duration 0.4s, ease `power3.in`, starting 0.1s after links begin dropping

### Touch gesture — swipe up to close
A touch handler on the scrim listens for `touchstart` + `touchend`. If the user swipes upward by >60px, trigger the close sequence. During drag, the scrim opacity can follow the touch position slightly (subtle feedback) using `gsap.to(scrimRef, { opacity: ... })`.

### Nav link style (inside Bloom)
Links are larger than current — `text-2xl` uppercase, cream color, centered. The active link has a `bg-cream/10 rounded-full` pill. On tap, the link briefly scales to 0.95 (tactile) before navigation.

### Accessibility
- Same as Shroud: `role="dialog"`, `aria-modal`, focus trap, Escape key
- `prefers-reduced-motion`: use instant fade instead of circle expand
- Touch swipe is additive (close button always present as fallback)

---

## File Structure

```
src/
  components/
    MobileNavShroud.tsx    # Concept A (new)
    MobileNavBloom.tsx     # Concept B (new)
    Navbar.tsx             # Updated: flag-based variant selection + hamburger fix
  config/
    mobileNav.ts           # getMobileNavVariant() helper (new)
```

No new dependencies. GSAP is already installed (`^3.14.2`). ScrollTrigger is already registered in `PageLayout.tsx`; the mobile nav only needs core GSAP + Eases (no extra plugins).

---

## Constraints & Non-Goals

- Desktop nav (`md:flex`) is untouched
- No changes to nav content/links — same links, same `ContentContext` data
- No new npm packages
- The `restricted` site mode (no nav) is respected in both variants (existing `!restricted` guards stay)
- Account link and BackgroundPicker are preserved in both panels where applicable
- `createPortal` to `document.body` — same as current pattern

---

## Testing

- Visual: run dev server, resize to `< 768px`, toggle variant via env var
- Keyboard: Tab through links, Escape to close, no focus escape
- Reduced motion: `@media (prefers-reduced-motion: reduce)` — instant transitions
- Contrast: check hamburger button at multiple scroll positions on each page
