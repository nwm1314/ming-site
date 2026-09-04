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

`pnpm deploy` performs a production build and deploy. `pnpm cf:preview` builds and starts a local Workers preview. `pnpm cf:dry-run` validates the Wrangler upload without deploying.

## Build variables

Set these as Cloudflare Workers Builds variables, not secrets:

```text
SITE_URL=https://<your-ming-site-workers-dev-host>
SITE_INDEXABLE=false
```

`SITE_URL` has a local fallback of `http://localhost:4321`; `SITE_INDEXABLE` defaults to `false`. The same resolved site URL is used for canonical links, RSS, sitemap, robots, Open Graph, and JSON-LD. Staging emits `noindex, nofollow` and `Disallow: /`.

Toolchain sources are `.node-version` (`22`) and `package.json` (`pnpm@11.19.0`). Configure Workers Builds to use Node 22; pnpm is read from the package manager declaration.

## Connect GitHub

1. In Cloudflare Dashboard, open **Workers & Pages → Create application → Import a repository**.
2. Select GitHub and `nwm1314/ming-site`, then create the Worker named `ming-site`.
3. In **Settings → Builds**, set the production branch to `main`, build command to `pnpm build`, and deploy command to `pnpm exec wrangler deploy`.
4. Enable non-production branch builds for `feature/*` and use `pnpm exec wrangler versions upload` as the preview deploy command.
5. Add `SITE_URL` and `SITE_INDEXABLE=false` under Build variables. Do not commit API tokens; Workers Builds can use its platform-generated token.

The first successful build is available from the deployment's build details/version history. The Worker overview also shows its stable `workers.dev` URL; use that URL for staging `SITE_URL`.

## Final launch

After replacing the remaining placeholders and reviewing the staging build, bind a custom domain from **Worker Settings → Domains & Routes → Add custom domain**. Set:

```text
SITE_URL=https://your-final-domain.example
SITE_INDEXABLE=true
```

Then trigger a new `main` build. This is the only launch switch needed to enable indexing; no page-level environment checks should be added.
