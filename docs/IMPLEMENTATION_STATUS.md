# Implementation Status

## Current Phase

Phase 4A — Sveltia CMS + Content Editing Workflow

## Completed

- Created `feature/phase-4a-sveltia-cms` from the latest `origin/main`; the production `main` branch was not modified.
- Added the static `/admin` Sveltia CMS shell with exact CDN pin `@sveltia/cms@0.205.4`, GitHub backend `nwm1314/ming-site`, simple publishing, and internal media storage at `public/uploads/`.
- Used Sveltia root-level `singletons` for `profile/ming.md` and `now/current.md`, so editors can modify the two fixed files without creating or deleting a second singleton.
- Changed Now from an editor-hostile `items[]` list to fixed `building`, `exploring`, and `learning` objects. The Astro schema, frontmatter, component, CMS fields, and maintenance docs all use the same model.
- Mapped Posts, Projects, Uses, Moments, Gallery, and Timeline to the current Astro content paths and schemas. Posts default to draft; new Moments default to unlisted.
- Added localized, user-facing labels, select controls for project status and Moment visibility, Markdown editors for body content, media hints, post/project preview paths, and optional-field omission.
- Added CMS configuration validation, singleton/path guards, admin noindex and Pagefind checks, and Cloudflare route coverage for `/admin` and `/admin/config.yml`.
- Added `docs/CMS_USAGE.md` and updated the maintenance/deployment handoff for the web CMS workflow while retaining direct Markdown editing.

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
- Aligned `wrangler.jsonc` with the installed Wrangler schema: `workers_dev: true`, `preview_urls: true`, `html_handling: "auto-trailing-slash"`, `not_found_handling: "404-page"`, and `run_worker_first: false`.
- Added the small `pnpm test:cf` Workers Static Assets routing smoke test and made it part of the GitHub Actions Quality gate. It checks real HTTP statuses and the custom 404 response without duplicating the E2E suite.
- Fixed the build-time `SITE_URL` path for Astro's Node-loaded configuration so the generated sitemap uses the same override as canonical, OG, JSON-LD, RSS, and robots.
- Ignored Wrangler's generated `.wrangler/` directory in ESLint so local Cloudflare validation cannot cause project type-parser errors.
- Replaced unfinished avatar and contact placeholders with an intentional initials mark and the existing GitHub link; no unverified personal details were added.
- Added a readable light-theme `--coral-text` token while keeping bright Coral, Lime, and Sky as decorative accents.
- Reworked Hero spacing and responsive type so the large `Ming.` composition keeps its editorial character without covering the Chinese subtitle from phone through desktop widths.
- Made the mobile menu stateful and keyboard-friendly: synchronized accessible names, `aria-expanded`, `aria-controls`, first-link focus, Escape close, and focus return.
- Expanded `hello-from-the-desk` into a short intro article and made both project summaries concrete without inventing personal history or results.
- Added CMS-ready `profile` and `now` content collections with schema validation; frequently changed identity, About copy, contacts, care topics, avatar metadata, and Now cards no longer live in components or technical config.
- Replaced the initials-only Hero mark with the provided avatar, optimized to `public/images/ming-avatar.webp` at 960×960 and roughly 72 KB, while preserving the paper/grid/orbit/card composition and fixed dimensions.
- Replaced example project content with the verified Insurance Recommendation Engine, Cyber Divination, and `ming-site` entries; homepage featured order is insurance recommendation, Cyber Divination, then the smaller `ming-site` entry on the Projects page.
- Corrected public GitHub identity to `https://github.com/nwm1314`; contact rendering is content-driven and empty optional contacts stay hidden.
- Rewrote About and What I Care About from the supplied Ming copy, and added `docs/CONTENT_MAINTENANCE.md` for non-developer content updates.
- Removed the `desk-notes`, gallery placeholder, and starter moment from production content instead of publishing fictional or placeholder material.
- Added `pnpm test:privacy` to scan generated output for legacy placeholder identity/content and to confirm JSON-LD uses `Ming`; expanded E2E coverage for identity, Now, projects, links, and contacts.

## Architecture Decisions

- Astro remains static-first: `astro build` writes `dist/`, then Pagefind indexes only the opted-in article bodies.
- The production public-post rule remains `draft === false && publishDate <= build time`; all production-facing post queries use the shared helper.
- Site URL and indexability are build-time configuration, not route-local checks. `SITE_URL` drives canonical, RSS, sitemap, robots, OG, and JSON-LD values.
- GitHub Actions remains a quality gate. Cloudflare Workers Builds owns deployment and receives no production token from this repository.
- Sveltia CMS is a static CDN application isolated under `/admin`; it is not imported by public Astro pages. The CMS uses the GitHub backend and commits Markdown/media directly to Git.
- Phase 4A uses Sveltia’s Sign In with Token flow for the single editor. Tokens live only in browser storage during use; OAuth Authenticator remains a Phase 4B prerequisite.
- The CMS configuration is validated against the pinned release’s JSON schema by editor tooling and by a repository-local structural smoke test. No token, OAuth secret, `.env`, or credential fixture is present.
- Static Assets are served first for every request. There is no Worker main script; unknown paths use `dist/404.html` with HTTP 404, and SPA fallback remains disabled.
- `workers_dev` and Wrangler Preview URLs are explicitly enabled. Workers Builds uses `wrangler deploy` for `main` and `wrangler versions upload` for non-production branches.

## Sveltia CMS Version

- Pinned version: `@sveltia/cms@0.205.4`, the current official Latest release checked on 2026-09-05.
- Why pinned: Sveltia’s CDN otherwise follows the latest release automatically. An exact pin makes the `/admin` runtime and its config schema change together and gives this project a deliberate rollback point.
- Upgrade strategy: review the official release notes and blocking issue reports, update the script URL and schema URL together, run `pnpm test:cms`, `pnpm build`, the browser review, and all release checks before committing the new pin. The previous `0.205.1` release specifically fixed an infinite-loop content-editor regression; this is why the selected release is verified in the actual login shell rather than chosen blindly.

## Cloudflare Decision

- Target: Cloudflare Workers + Static Assets, Worker name `ming-site`, assets directory `./dist`.
- GitHub repository: `nwm1314/ming-site`; production branch `main`; preview branches `feature/*`.
- PR #1 is merged into `main`; the release gate is complete and the next environment step is Cloudflare staging deployment.
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
- Local commands: `pnpm dev`, `pnpm preview`, `pnpm cf:preview`, `pnpm cf:dry-run`, `pnpm test:cf`, and `pnpm deploy`.

## Known Issues

- Moments and Gallery currently render empty collections by design; no placeholder entries are published until real material is available.
- Pagefind does not stem Chinese terms; exact/substring search remains available.
- No comments provider is connected by design.
- Real GitHub read/write authentication and Android save/commit/build acceptance still require the owner’s token and Cloudflare Preview environment; they are intentionally not automated in CI.
- The empty Moments and Gallery collections produce the existing Astro glob/empty-collection build warnings until real content is added. No placeholder content was published to silence them.
- `pnpm format` still reports historical formatting drift in 58 files outside this release task; it was not applied because it would create a broad, low-value diff. This does not block the release gate.

## Verification

- `pnpm install --frozen-lockfile` — passed.
- `pnpm lint` — passed.
- `pnpm check` — passed with 0 errors, 0 warnings, and 0 hints.
- `pnpm build` — passed; 26 static pages generated and 2 Pagefind pages indexed.
- `pnpm test:unit` — passed, 7 tests including pagination boundaries.
- `pnpm test:e2e` — passed, 13 Chromium smoke tests including Ming identity, real projects, contact links, Now content, mobile menu, search, Blog, 404, staging robots, and `/admin`.
- `pnpm test:privacy` — passed across 53 generated files; no legacy placeholder identity/content found.
- `pnpm test:cf` — passed under `wrangler dev --local`: public routes, `/admin`, `/admin/config.yml`, and the custom 404 response behaved as expected.
- Phase 3A browser review — Playwright screenshots captured at 390×844 and 1440×900 in Light and Dark themes; overflow checks passed at 320, 390, 768, 1024, and 1440 widths; no Hero subtitle overlap, avatar crop issue, project-card overflow, or mobile horizontal scrolling observed.
- `pnpm cf:dry-run` — passed with Wrangler 4.129.0; 85 static assets read, no upload performed.
- Output checks — 2 public article routes, 2 RSS items, draft/future fixture content absent from public output, no comments placeholder, no taxonomy/list/search Pagefind duplicates, staging noindex/robots behavior verified, and `SITE_URL` override verified across canonical/OG/RSS/sitemap-index/sitemap/robots/JSON-LD.
- `pnpm test:cms` — passed; YAML parsing, pinned Sveltia version, GitHub backend, singleton files, content folders, collection fields, safe defaults, explicit `getEntry` IDs, and optional Pagefind output checks passed.
- Manual browser review — passed at desktop 1440×900 and mobile 390×844. Sveltia login UI loaded in Simplified Chinese, the token dialog opened without entering a token, and the browser console showed 0 errors / 0 warnings after reload.

## Next Recommended Task

Phase 4A owner acceptance on Android/Cloudflare Preview → review and merge the PR → Phase 4B OAuth Authenticator only after explicit approval.
