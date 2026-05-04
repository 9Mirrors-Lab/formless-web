# ADR: Supabase-backed site content and a later Next.js move

## Context

Marketing copy for Formless lives in Postgres (`public.content`) with jsonb payloads, stable `(page, section, key)` identifiers, `order` for list-like sections, `type` for editor semantics, and `is_published` for future drafts.

The Vite app loads all published rows once in `ContentProvider`, builds a tree via `buildContentTree` in `src/lib/content.ts`, and pages read strings with `getText` / `getLink` / `listItems`.

## Next.js migration (later phase)

- **Keep** `src/lib/content.ts` free of React: same `fetchContentRows` + `buildContentTree` signatures work on the server.
- **Replace** `src/lib/supabase.ts` with a server-only helper using `createServerClient` from `@supabase/ssr` and `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` (plus service role only for admin routes).
- **Fetch** in a root `layout.tsx` or per-route RSC: call `fetchContentRows` there and pass a serialized tree (or per-section props) into client components that still run GSAP.
- **Caching:** wrap the fetch in `unstable_cache` with a tag like `content`, or use `fetch` with `next: { revalidate: 60 }`; after CMS writes, call `revalidateTag('content')`.
- **Structural change:** split browser vs server Supabase clients; the content table and loader stay the same.

## Status

Accepted for the current Vite implementation; Next steps are deferred until an App Router app exists.
