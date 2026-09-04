---
title: "先把页面做轻，再给它更多能力"
description: "关于 Astro first、静态优先，以及个人网站为什么不需要一开始就变成全栈应用。"
publishDate: 2026-09-02
draft: false
category: "Build"
tags: ["astro", "web", "performance"]
featured: false
toc: true
---

个人站最珍贵的不是功能数量，而是几年后仍然愿意打开仓库继续写东西。

因此第一版只保留必要的运行时，让 HTML 和 CSS 先把体验做好。

## Build-time first

```ts
const publicPosts = posts.filter((post) => !post.data.draft);
```

真正的发布规则还需要同时检查日期，避免未来文章提前出现在公开页面。
