# Ming 上线清单

这份清单写给第一次绑定正式域名时的操作者。当前仓库仍以 staging 为准，代码不会自动绑定域名，也不会自动打开搜索引擎索引。

## Before Domain

- [ ] PR / CI 全部通过。
- [ ] 在 Cloudflare staging 预览中检查首页、Blog、Projects、About、Search、`/admin`、`rss.xml`、`robots.txt`、sitemap 和 404。
- [ ] 用 `/admin` 登录并确认 Now、文章和项目仍能保存到 GitHub；不要把 token 写入仓库。
- [ ] 确认公开身份只有 `Ming`，项目内容仍为智能保险推荐引擎、赛博命理 · Cyber Divination、`ming-site`。
- [ ] 审核所有外链。`bazi.nwmnow.com` 当前仍是 HTTP，正式公开前应先在对应服务配置 TLS。
- [ ] 备份当前 Cloudflare Worker 设置、Build variables 和部署配置。

## Bind Domain

在 Cloudflare Dashboard 手工操作：

`Worker` → `Settings` → `Domains & Routes` → `Add Custom Domain`

不要让 Codex 自动绑定正式域名。

## Cloudflare Build Variables

第一次绑定后先保持不可索引：

```text
SITE_URL=https://<final-domain>
SITE_INDEXABLE=false
```

先部署一次，确认自定义域名能够正常访问。

## Domain Smoke

- [ ] `/`
- [ ] `/blog`
- [ ] `/projects`
- [ ] `/about`
- [ ] `/search`
- [ ] `/admin`
- [ ] `/rss.xml`
- [ ] `/robots.txt`
- [ ] `/sitemap-index.xml` 与 sitemap 文件
- [ ] 不存在的路径返回设计好的 404
- [ ] Light / Dark、手机菜单和主要页面没有横向滚动。

## Go Public

只有人工确认上述检查全部通过后，才把 Cloudflare Build variable 改为：

```text
SITE_INDEXABLE=true
```

重新构建。不要在仓库中把默认值改成 `true`。

## After Public Launch

- [ ] 检查 `robots.txt`、sitemap、canonical、OG image、RSS。
- [ ] 用分享预览确认首页和文章缩略图正确。
- [ ] 在 Google Search Console 和 Bing Webmaster 手工提交 sitemap。
- [ ] 不接入 Search Console API，也不要把站点 token 写进代码。
