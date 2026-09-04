# Implementation Status

## Current Phase

Phase 2.5 — Release Candidate / Deployment Foundation

## Completed

- Separated Phase 2 pagination/search sample posts from production content. `src/content/posts/` now contains only the two Phase 1 public examples and the Phase 1 draft used to verify release filtering.
- Added pure `getPageCount()` and `paginatePosts()` rules with test fixtures covering 0, 1, 8, 9, 16, and 17 posts.
- Removed fixture-dependent E2E pagination assertions. The current build correctly exposes one Blog page; future real posts will generate later pages automatically.
- Restricted Pagefind to article detail body content. Blog lists, taxonomy pages, pagination, search, TOC, navigation, related posts, and comments are not indexed.
- Added Pagefind metadata for article title, category, tags, publish date, description, and `type:article`.
- Hardened search with GET semantics, shareable `?q=`, loading/error/empty states, accessible status/result containers, and Pagefind-generated excerpt rendering.
- Replaced the comments placeholder with a provider boundary. With no provider configured, article pages render no comments UI.
- Added `coverAlt` validation for posts with covers and a title fallback in article markup; article covers use responsive sizing and a fixed aspect ratio to reduce layout shift.
- Added centralized build-time `SITE_URL` resolution with a safe localhost fallback and `SITE_INDEXABLE=false` as the default release boundary. Base metadata and `robots.txt` now follow that single setting.
- Added `.node-version` (`22`), `packageManager` (`pnpm@11.19.0`), compatible engines, `.env.example`, and CI version-file usage.
- Added Wrangler `4.129.0`, `wrangler.jsonc`, Workers Static Assets scripts, and deployment documentation. No Pages adapter, SSR, Worker API, database, CMS, comments provider, or analytics was introduced.

## Architecture Decisions

- Astro remains static-first: `astro build` writes `dist/`, then Pagefind indexes only the opted-in article bodies.
- The production public-post rule remains `draft === false && publishDate <= build time`; all production-facing post queries use the shared helper.
- Site URL and indexability are build-time configuration, not route-local checks. `SITE_URL` drives canonical, RSS, sitemap, robots, OG, and JSON-LD values.
- GitHub Actions remains a quality gate. Cloudflare Workers Builds owns deployment and receives no production token from this repository.

## Cloudflare Decision

- Target: Cloudflare Workers + Static Assets, Worker name `ming-site`, assets directory `./dist`.
- GitHub repository: `nwm1314/ming-site`; production branch `main`; preview branches `feature/*`.
- Workers Builds commands are documented in `docs/DEPLOYMENT.md`; production deploy is deliberately not run by Codex.

## Test Fixture Strategy

- The eight posts added by `c386e0b` solely for pagination/taxonomy/search verification were removed from `src/content/posts/`.
- Pagination tests use objects from `tests/fixtures/posts.ts`; public content no longer needs nine artificial articles.
- `draft-note.md` remains as the original Phase 1 draft boundary test and is absent from all public output.

## Search Index Strategy

- Pagefind indexed exactly 2 pages, matching the 2 public article detail routes in the current build.
- Taxonomy/list/search pages have no `data-pagefind-body`; article metadata is captured separately and article auxiliary regions are excluded.
- Search uses Pagefind's entity-encoded excerpt output, which is the documented safe HTML result format.

## Deployment Strategy

- Staging defaults to `SITE_INDEXABLE=false`, emits `noindex, nofollow`, and serves `robots.txt` with `Disallow: /`.
- Final launch only needs `SITE_URL` set to the custom domain and `SITE_INDEXABLE=true` in Workers Builds variables after content and visual review.
- Local commands: `pnpm dev`, `pnpm preview`, `pnpm cf:preview`, `pnpm cf:dry-run`, and `pnpm deploy`.

## Known Issues

- Avatar, email, and some personal copy remain Phase 1 placeholders; this build is staging/preview, not a formal launch.
- Pagefind does not stem Chinese terms; exact/substring search remains available.
- No comments provider is connected by design.
- The existing repository-wide `pnpm format` check still reports historical formatting drift outside this release task; lint, type/content check, build, unit, E2E, and Wrangler dry-run are green.

## Verification

- `pnpm install --frozen-lockfile` — passed.
- `pnpm lint` — passed.
- `pnpm check` — passed with 0 errors, 0 warnings, 0 hints.
- `pnpm build` — passed; 25 static pages generated and 2 Pagefind pages indexed.
- `pnpm test:unit` — passed, 7 tests including pagination boundaries.
- `pnpm test:e2e` — passed, 8 Chromium smoke tests.
- `pnpm cf:dry-run` — passed with Wrangler 4.129.0; 77 static assets read, no upload performed.
- Output checks — 2 public article routes, 2 RSS items, draft/future fixture content absent from public output, no comments placeholder, no taxonomy/list/search Pagefind duplicates, staging noindex/robots behavior verified, and `SITE_URL` override verified across canonical/OG/RSS/sitemap/robots/JSON-LD.

## Next Recommended Task

Cloudflare staging verification plus real Desktop/Android visual review. Only after that should the project resume Phase 3 Personal Space detail work.
