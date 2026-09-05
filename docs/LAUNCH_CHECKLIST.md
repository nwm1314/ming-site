# Ming 上线清单

当前状态：生产环境已上线，正式域名为 [https://nwmnow.com](https://nwmnow.com)。这份清单保留上线后的人工复核项目，不再把绑定域名或打开索引列为待办。

## Production

- [x] Cloudflare Workers Custom Domain active。
- [x] `SITE_URL=https://nwmnow.com`。
- [x] `SITE_INDEXABLE=true`。
- [x] 首页、Blog、Projects、About、Search、`/admin`、RSS、robots、sitemap 和 404 已完成生产 smoke check。
- [x] Google Search Console 已验证并成功提交 sitemap。
- [x] Bing Webmaster Tools 已导入站点，sitemap 正在处理。
- [x] Sveltia CMS 生产编辑流程已验证；GitHub 仍是内容唯一真源。
- [x] 公开身份保持为 Ming，未加入虚构文章、动态、相册或经历。

## Ongoing checks

- [ ] 发布后确认 canonical、OG image、RSS 和 sitemap 仍使用 `https://nwmnow.com`。
- [ ] 新内容先保持 Post `draft: true` 或 Moment `visibility: unlisted`，确认后再公开。
- [ ] 更新外链前确认目标可用；`http://bazi.nwmnow.com/` 在 TLS 配置完成前不要改写为 HTTPS。
- [ ] 预览环境继续使用 `SITE_INDEXABLE=false`，避免 staging 被索引。

## Owner-only actions

- [ ] 如果 Cloudflare 构建变量或域名发生变化，重新运行 `pnpm test:release`、`pnpm test:cf` 和浏览器 smoke check。
- [ ] Search Console 与 Bing 的提交、抓取状态和域名设置继续在各自后台人工维护；不要把 token 写入仓库。
