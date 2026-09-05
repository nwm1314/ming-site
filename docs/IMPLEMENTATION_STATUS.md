# Implementation Status

## Current Phase

Phase 4C — Post-launch Hardening + Editorial Tooling

## Production

- Production: https://nwmnow.com
- Custom Domain active.
- `SITE_URL=https://nwmnow.com`.
- `SITE_INDEXABLE=true`.
- Google Search Console connected; sitemap submitted successfully.
- Bing Webmaster Tools connected; sitemap processing.
- Sveltia CMS production workflow verified.

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
- Phase 4A uses Sveltia’s Sign In with Token flow for the single editor. Tokens live only in browser storage during use; OAuth remains intentionally deferred and is outside this launch-readiness release.
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
- PR #1 is merged into `main`; the production custom domain is active.
- Workers Builds commands are documented in `docs/DEPLOYMENT.md`; production deploy remains an owner-controlled Cloudflare operation.

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
- Production is live at `https://nwmnow.com` with the custom domain and `SITE_INDEXABLE=true` configured in Cloudflare Workers Builds.
- Local commands: `pnpm dev`, `pnpm preview`, `pnpm cf:preview`, `pnpm cf:dry-run`, `pnpm test:cf`, `pnpm test:links`, `pnpm test:media`, and `pnpm deploy`.

## Known Issues

- Moments and Gallery currently render empty collections by design; no placeholder entries are published until real material is available.
- Pagefind does not stem Chinese terms; exact/substring search remains available.
- No comments provider is connected by design.
- Sveltia production editing is verified through the owner-only GitHub Token flow; Android save/commit/build acceptance is not automated in CI.
- The empty Moments and Gallery collections produce the existing Astro glob/empty-collection build warnings until real content is added. No placeholder content was published to silence them.
- `pnpm format` still reports historical formatting drift in 58 files outside this release task; it was not applied because it would create a broad, low-value diff. This does not block the release gate.
- The external `http://bazi.nwmnow.com/` project demo still needs TLS before its link is changed to HTTPS.
- HSTS and other edge security headers remain a Cloudflare configuration concern; this static site does not add a Worker runtime just to synthesize them.

## Verification

- `pnpm install --frozen-lockfile` — passed.
- `pnpm lint` — passed.
- `pnpm check` — passed with 0 errors, 0 warnings, and 0 hints.
- `pnpm build` — passed; 26 static pages generated and 2 Pagefind pages indexed.
- `pnpm test:unit` — passed, 8 tests including pagination and Moment visibility boundaries.
- `pnpm test:e2e` — passed, 13 Chromium smoke tests including Ming identity, real projects, contact links, Now content, mobile menu, search, Blog, 404, staging robots, and `/admin`.
- `pnpm test:privacy` — passed across 54 generated files; no legacy placeholder identity/content found.
- `pnpm test:cf` — passed under `wrangler dev --local`: public routes, `/admin`, `/admin/config.yml`, and the custom 404 response behaved as expected.
- Phase 3A browser review — Playwright screenshots captured at 390×844 and 1440×900 in Light and Dark themes; overflow checks passed at 320, 390, 768, 1024, and 1440 widths; no Hero subtitle overlap, avatar crop issue, project-card overflow, or mobile horizontal scrolling observed.
- `pnpm cf:dry-run` — passed with Wrangler 4.129.0; 85 static assets read, no upload performed.
- Output checks — 2 public article routes, 2 RSS items, draft/future fixture content absent from public output, no comments placeholder, no taxonomy/list/search Pagefind duplicates, staging noindex/robots behavior verified, and `SITE_URL` override verified across canonical/OG/RSS/sitemap-index/sitemap/robots/JSON-LD.
- `pnpm test:cms` — passed; YAML parsing, pinned Sveltia version, GitHub backend, singleton files, content folders, collection fields, safe defaults, explicit `getEntry` IDs, and optional Pagefind output checks passed.
- Manual browser review — passed at desktop 1440×900 and mobile 390×844. Sveltia login UI loaded in Simplified Chinese, the token dialog opened without entering a token, and the browser console showed 0 errors / 0 warnings after reload.

## Phase 4B Release Audit

### Release Audit

- Audited the public routes, generated assets, metadata, RSS, robots, sitemap, Pagefind scope, CMS shell, empty states, external links, and staging index boundary.
- Retained `static-first.md`: it is a short, concrete public note about this site's real static-first architecture rather than a search or layout fixture. `draft-note.md` remains non-public.
- Added deterministic `pnpm test:release` checks for staging and production indexing modes without external network access.

### SEO

- Homepage title remains `Ming — 把好奇心做成能跑起来的东西`.
- Canonical, RSS, sitemap, robots, JSON-LD, Open Graph and Twitter image URLs continue to derive from the single `SITE_URL` value.
- Search, 404 and admin remain `noindex, nofollow`; admin remains outside sitemap and Pagefind.

### Social Sharing

- Replaced the favicon fallback with `public/images/ming-og.webp`, a 1200×630 brand-level share image using the existing paper/grid/orbit visual language.
- Added `summary_large_image`, image alt metadata, and article cover alt fallback. The OG asset is metadata-only and is not rendered by public page components.

### Indexing Boundary

- `SITE_INDEXABLE=false` remains the repository default and emits `noindex, nofollow` plus `Disallow: /`.
- The release smoke test also verifies `SITE_INDEXABLE=true` emits `Allow: /` and the correct `SITE_URL` sitemap without changing the repository default.

### RSS / Search

- RSS contains only the two current public posts and uses `SITE_URL` for channel and item links.
- Pagefind continues to index only public article detail bodies; draft, future, list, taxonomy, search and admin content are excluded.
- Empty Moments and Gallery pages now show explicit non-fictional empty states.

### CMS Safety

- Sveltia remains pinned at `@sveltia/cms@0.205.4` with GitHub Token login; no OAuth, authenticator Worker or secret was added.
- The CMS branch, singleton files, media folder and noindex markers remain unchanged and covered by existing validation.

### Responsive / Accessibility

- Kept the established responsive layout and reduced-motion behavior; tightened external `target="_blank"` links to `rel="noopener noreferrer"`.
- Preserved keyboard-friendly mobile navigation, focus-visible styles, form labels, image dimensions and empty-state layouts.

### Performance

- Default OG image is not part of normal page markup; avatar dimensions remain explicit and Pagefind remains lazy-loaded from the Search page.
- No new runtime, analytics, service worker, database or large dependency was introduced.

### Known External Risks

- `http://bazi.nwmnow.com/` is intentionally unchanged and is a release-experience risk until that service has TLS; change it to HTTPS only after the service is configured.
- Security headers such as HSTS depend on the final HTTPS domain and Cloudflare configuration. The static-assets architecture does not add a Worker runtime just to synthesize headers; review the final Cloudflare response headers before public launch.
- In a local browser check, Sveltia's optional Chinese translation request showed a non-blocking in-app fallback alert while the pinned CMS shell and token login controls remained usable; recheck the deployed staging URL before launch.
- Moments and Gallery remain empty by design until real material is supplied.

### Launch Checklist

- Added [LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md) covering domain binding, Cloudflare variables, smoke checks, and the manual indexing switch.

## Phase 4C Release Audit

- Updated this handoff to record the live custom-domain production state.
- Added deterministic content quality validation for required editorial fields, URL fields, post cover/alt pairing, Gallery alt text, Profile identity, and unique featured project order.
- Added `pnpm test:links` to validate root-relative and same-origin generated HTML references without requesting external URLs.
- Added `pnpm test:media` with explicit ordinary-media, avatar, and default-OG size policies; it never edits or compresses files.
- Added safe authoring templates under `templates/content/` and lightweight `pnpm new:post` / `pnpm new:moment` scaffolds that refuse overwrites.
- Kept RSS autodiscovery and the existing `SITE_URL`-derived metadata path, with release invariants covering canonical, OG, Twitter, RSS, sitemap, indexability, and Pagefind boundaries.

## Current Handoff

Phase 4C is complete. Continue normal editorial maintenance through the CMS or Git-backed Markdown workflow; do not treat this release as a request to start another feature phase.
