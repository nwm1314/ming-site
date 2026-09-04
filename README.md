# ming-site

一个有生活感、有技术味、可长期生长的个人数字空间。

当前版本以 Astro 静态输出为核心，使用 Markdown / MDX 内容、CSS design tokens 和少量客户端脚本。页面内容与个人资料都集中在 `src/config/` 与 `src/content/`，后续可以在不改动页面结构的前提下接入更多内容。

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
```

## Project map

- `src/config/` — identity, site metadata, navigation and social links
- `src/content/` — Markdown / MDX collections
- `src/components/` — Astro-first UI components
- `src/styles/` — tokens and global styles
- `docs/` — product baseline and implementation handoff notes
