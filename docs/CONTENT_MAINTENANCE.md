# 内容维护指南

日常内容都在 `src/content/` 里维护。改完后提交 Git，Cloudflare 构建就会把 Markdown 内容生成到网站上。

## 修改首页介绍

编辑 `src/content/profile/ming.md`：

- `tagline`：Hero 下方的一句话
- `bio`：首页个人介绍
- `status`：头像卡片旁边的当前状态
- `seo.title` / `seo.description`：首页标题和描述

公开身份统一使用 `Ming`，不要在文件里添加真实姓名或未确认的个人经历。

## 更新 Now

编辑 `src/content/now/current.md`：

- `updatedAt`：最后更新时间
- `items`：按 `building`、`exploring`、`learning` 顺序维护三张卡片

每一项的 `text` 可以使用 YAML 多行文本，换行会在卡片中保留。

## 修改联系方式

编辑 `src/content/profile/ming.md` 的 `contacts`：

- `github`：个人 GitHub 地址
- `email`：邮箱地址
- `telegram`、`x`、`website`、`wechatQr`：以后需要时再填

没有值的联系方式不会渲染成空链接或占位文字。

## 添加项目

在 `src/content/projects/` 新建一个 `.md` 文件。可以复制现有项目的 frontmatter，并修改这些字段：

```yaml
title: "项目名称"
summary: "首页显示的一句话简介"
description: "项目详情描述"
status: building
statusLabel: "Building"
stack: ["真实使用的技术"]
repo: "https://github.com/..."
demo: "https://..."
featured: false
order: 4
```

只填写仓库或项目中能够确认的技术。`featured: true` 的项目会出现在首页精选区，`order` 越小越靠前。

## 修改头像

把优化后的图片放到 `public/images/ming-avatar.webp`，推荐使用正方形、约 960×960 的 WebP，尽量控制在几百 KB 以内。然后在 `src/content/profile/ming.md` 更新 `avatar.src`、`width`、`height` 和 `alt`。

## 添加文章

文章放在 `src/content/posts/`，复制现有文章的 frontmatter 后修改标题、描述、日期、分类和标签。`draft: true` 的文章不会进入公开列表、RSS 或搜索索引。

## 更新 Uses

编辑 `src/content/uses/` 目录下的 Markdown 文件。只添加实际正在使用、或能从真实项目确认的工具；这里不填写熟练度、百分比或进度条。

## 发布前检查

```text
pnpm lint
pnpm check
pnpm build
pnpm test
pnpm test:privacy
```
