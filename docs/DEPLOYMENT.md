# Deployment

## Target

This site deploys as an Astro static build to **Cloudflare Workers Static Assets**. It does not use a Pages project, SSR adapter, database, or Worker API.

- Repository: `nwm1314/ming-site`
- Worker name: `ming-site`
- Wrangler config: `wrangler.jsonc`
- Production branch: `main`
- Preview branches: `feature/*`
- Build command: `pnpm build`
- Production deploy command: `pnpm exec wrangler deploy`
- Non-production preview deploy command: `pnpm exec wrangler versions upload`

`wrangler.jsonc` explicitly keeps `workers_dev` enabled and enables `preview_urls`. Its Static Assets routing uses `html_handling: "auto-trailing-slash"`, `not_found_handling: "404-page"`, and `run_worker_first: false`. An unmatched request is therefore served by `dist/404.html` with HTTP 404; this site does not use SPA fallback or a Worker runtime rewrite.

`pnpm deploy` performs a production build and deploy. `pnpm cf:preview` builds and starts a local Workers preview. `pnpm cf:dry-run` validates the Wrangler upload without deploying. After `pnpm build`, `pnpm test:cf` starts `wrangler dev --local` and verifies the Workers Static Assets status codes, including the custom 404 response.

## Build variables

Set these as Cloudflare Workers Builds variables, not secrets:

```text
SITE_URL=https://<your-ming-site-workers-dev-host>
SITE_INDEXABLE=false
```

`SITE_URL` has a local fallback of `http://localhost:4321`; `SITE_INDEXABLE` defaults to `false`. The same resolved site URL is used for canonical links, RSS, sitemap, robots, Open Graph, and JSON-LD. Staging emits `noindex, nofollow` and `Disallow: /`.

Toolchain sources are `.node-version` (`22`) and `package.json` (`pnpm@11.19.0`). Configure Workers Builds to use Node 22; pnpm is read from the package manager declaration.

## Connect GitHub

1. In Cloudflare Dashboard, open **Workers & Pages → Create application**, then select **Get started** beside **Import a repository**.
2. Select GitHub and `nwm1314/ming-site`, then create the Worker named `ming-site`.
3. In **Settings → Build → Branch control**, set the production branch to `main`, build command to `pnpm build`, and production deploy command to `pnpm exec wrangler deploy`.
4. Enable **Builds for non-production branches** so `feature/*` commits get preview builds. Set the non-production deploy command to `pnpm exec wrangler versions upload`; this uploads a version without promoting it to the active production deployment.
5. Add `SITE_URL` and `SITE_INDEXABLE=false` to the build variables for staging/preview builds. Do not commit API tokens; Workers Builds can use its platform-generated token.

The first successful build is available from **Deployments → Version history → View build**. The version details include a versioned `workers.dev` preview URL. The Worker overview also shows its stable `workers.dev` URL; use that URL for staging `SITE_URL`. With the GitHub integration, pull requests can also receive the build status and preview links. Workers Builds owns this preview behavior; no branch router or custom preview URL system is needed.

## Release validation

Run the local Workers route check after a production build:

```text
pnpm build
pnpm test:cf
```

The check expects `/`, `/blog`, an existing article, `/search`, `/rss.xml`, and `/robots.txt` to resolve successfully. It allows the explicit `/404` page to behave according to the generated static output, and specifically requires an unknown path to return HTTP 404 and contain the custom 404 marker.

## Final launch

After reviewing the staging build and confirming the real personal content, bind a custom domain from **Worker Settings → Domains & Routes → Add custom domain**. Set:

```text
SITE_URL=https://your-final-domain.example
SITE_INDEXABLE=true
```

Then trigger a new `main` build. This is the only launch switch needed to enable indexing; no page-level environment checks should be added.
