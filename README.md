# Ming Personal Digital Space

Production: [https://nwmnow.com](https://nwmnow.com)

一个以内容和项目为核心的个人数字空间。生产环境使用 Astro 静态输出，内容由 Git / Markdown 管理，Sveltia CMS 提供编辑入口，Cloudflare Workers Static Assets 负责发布。

## Architecture

- Astro static-first site
- Git / Markdown content source
- Sveltia CMS at `/admin`
- Cloudflare Workers Static Assets

## Local development

```bash
pnpm install
pnpm dev
```

## Verification

```bash
pnpm lint
pnpm check
pnpm build
pnpm test
pnpm test:links
pnpm test:media
```

## Project map

- `src/config/` — site metadata and navigation
- `src/content/` — identity and Markdown / MDX collections
- `src/components/` — Astro-first UI components
- `src/styles/` — tokens and global styles
- `templates/content/` — safe reference templates for new content
- `docs/` — product baseline, deployment and maintenance notes
