# Implementation Status

## Current Phase

Phase 2 — Blog Core + Foundation Hardening completed on top of the Phase 1 homepage foundation.

## Completed

- Reworked `readingTime()` for Markdown, CJK characters, Latin words, mixed Chinese/English content, and empty content without an NLP dependency.
- Added one public-post rule: `draft === false` and `publishDate <= build time`. Homepage, Blog, detail paths, taxonomy, pagination, related posts, RSS, Pagefind, and sitemap all consume the same public collection query.
- Added a reusable navigation active-state helper. Blog remains active for article, category, tag, and pagination routes while Home only matches `/`.
- Added `ArticleLayout.astro` with category, dates, reading time, title, description, optional cover, tags, TOC, article body, comments boundary, previous/next, and related posts.
- Added official Astro heading extraction for a responsive h2/h3 TOC, including `toc: false` and short-content behavior.
- Kept Astro/Shiki code output and added a small accessible copy button with success/failure feedback and horizontal scrolling.
- Added centralized `BLOG_PAGE_SIZE = 8`, `/blog/page/2` pagination, category and tag overview/list routes, CJK-safe taxonomy slugs, counts, and SEO metadata.
- Added deterministic previous/next navigation (newer = Previous, older = Next) and a lightweight related-post score using series, category, and shared tags.
- Added `/rss.xml`, RSS autodiscovery, article Open Graph metadata, article published/modified metadata, BlogPosting JSON-LD, and preserved Person JSON-LD.
- Replaced the duplicated static robots file with `src/pages/robots.txt.ts`; site URL now comes from `src/config/site.ts` for Astro, sitemap, RSS, robots, canonical, OG, and JSON-LD output.
- Added Pagefind as a project dev dependency and made `pnpm build` generate its static index after Astro build. Search lives at `/search` with a small accessible custom UI.
- Added Playwright unit tests for content rules and browser smoke tests for home, theme, mobile menu, Blog, pagination, article, category, tag, search, and 404.
- Added GitHub Actions quality gate for pnpm install, lint, check, build/Pagefind, browser install, and smoke tests.

## Architecture Decisions

- Astro remains static-first. No SSR adapter, database, CMS, runtime search service, or global state was introduced.
- Pure rules live in `src/lib/content/rules.ts`; Astro collection queries remain in `src/lib/content.ts`. This keeps the production filter and algorithms testable without mocking `astro:content`.
- `ArticleLayout` owns article composition while small Blog components own list, taxonomy, pagination, TOC, related, and navigation presentation.
- Pagefind is invoked from the package script (`pagefind --site dist`) after the static build. Pages opt into indexing with `data-pagefind-body`; Header, Footer, taxonomy controls, and Search UI are ignored as noise.
- Code highlighting stays with Astro's Markdown/Shiki pipeline. Copy behavior is a tiny native browser script, avoiding a code-block UI dependency.
- SEO is centralized in `BaseLayout`; article pages provide only article-specific props and BlogPosting data. Person JSON-LD is always emitted by the base layout.
- New dependencies: `@astrojs/rss` for the official RSS response, `pagefind` for the static index, and `@playwright/test` for both lightweight utility tests and browser smoke tests.

## Deviations From Plan

- The implementation uses the current installed Astro 7/Tailwind 4 setup and `@astrojs/rss` 4 rather than older integration examples.
- Pagefind uses a custom native UI instead of its full UI component because the site already has a design system and only needs a small search surface.
- A handful of concise local sample posts were added so the default eight-item page size produces a real second page and the future-post exclusion can be verified in build output. They are fixtures/content examples, not a new product feature.

## Known Issues

- Personal avatar, email, and deployment URL are still placeholders from Phase 1.
- Pagefind does not stem Chinese terms; exact/substring search works, but linguistic root matching is not provided by the static index.
- Comments are intentionally only a boundary; no provider is connected.
- Cloudflare deployment and Sveltia CMS remain out of scope for this phase.

## Verification

- `pnpm lint` — passed.
- `pnpm check` — passed with 0 errors, 0 warnings, 0 hints.
- `pnpm build` — passed; 42 static pages generated, including `/blog/page/2`, `/rss.xml`, `/robots.txt`, and sitemap output; Pagefind indexed 29 opted-in pages.
- `pnpm test:unit` — passed, 6 content/navigation tests.
- `pnpm test:e2e` — passed, 7 Chromium smoke tests against a production preview.
- Output checks — draft and future fixture routes/content are absent from `dist`; RSS contains only public posts; Pagefind is present; sitemap and robots point to the configured site URL.
- Visual smoke — desktop article and mobile search screenshots checked; TOC, code block, navigation, and mobile form remain within the existing paper/ink/lime/coral design system.

## Next Recommended Task

Begin Phase 3 Personal Space detail: replace placeholders with final personal content, then deepen Projects/Now/Moments/Gallery/Timeline/About while keeping the new public content and SEO boundaries intact.
