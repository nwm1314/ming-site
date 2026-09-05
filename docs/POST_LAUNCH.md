# Post-launch maintenance

Production is [https://nwmnow.com](https://nwmnow.com). GitHub is the only content source; Cloudflare builds `main` after content changes.

## Daily

- CMS: use `/admin` for Now, Posts, Projects, Moments, Gallery and profile updates.
- Now: keep the current state short and change `updatedAt` when it changes.
- Posts: save new writing as `draft: true` until it is reviewed.
- Projects: keep status, links and featured order current.

## When Publishing

- Post: complete title, description, date, tags and any cover/`coverAlt`; then remove `draft: true` only when ready.
- Moment: keep `visibility: unlisted` while checking it; choose `public` deliberately.
- Build: run `pnpm lint`, `pnpm check`, `pnpm build`, `pnpm test:content`, `pnpm test:links` and `pnpm test:media` when working locally.
- CI / Cloudflare: wait for the GitHub quality gate and Cloudflare build before checking the live URL.

## Monthly

- Run the internal link and media checks; review any warnings.
- Check Google Search Console and Bing Webmaster Tools for crawl or sitemap issues.
- Review dependencies only when there is a concrete maintenance or security reason.

## Recovery

- Revert the Git commit that introduced the bad content or configuration.
- Use the Cloudflare deployment/version history to roll back the last bad deployment if needed.
- If a CMS token may have leaked, revoke it in GitHub immediately and sign in again with a new token.
