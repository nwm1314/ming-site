# 个人主页 + 博客 V1 详细实施方案

> 目标：构建一个“有明显个人特色、可长期演进、内容与项目并重”的个人数字空间。  
> 核心技术方向：Astro + React Islands + Tailwind CSS + Markdown/MDX + Git + Obsidian + Sveltia CMS。  
> 开发方式：以干净 Astro 项目为底座，由 Codex 分阶段实现；参考优秀开源项目的功能与交互思路，但不整体 Fork、不过度复制现有站点视觉与源码。  
> 文档日期：2026-09-04

---

## 1. 产品定位

这个网站不是传统“技术博客模板”，也不是标准“求职 Portfolio”。

它应当同时承担四类职责：

1. **个人主页 / 数字名片（主要）**
   - 头像
   - 自我介绍
   - 当前状态
   - 联系方式
   - 个人兴趣与人格表达

2. **技术能力 / 项目展示（主要）**
   - 精选项目
   - 正在进行的项目
   - 技术栈
   - GitHub
   - 工具、设备、工作流

3. **博客 / 内容沉淀（主要）**
   - AI / Coding / Agent / Vibe Coding
   - VPS / 网络 / 运维
   - 技术教程 / 踩坑
   - 思考 / 随笔 / 生活

4. **长期个人品牌（次要，但需要为未来保留空间）**
   - Timeline
   - Gallery
   - Moments
   - Lab
   - 未来 Web App

一句话定位：

> 一个有生活感、有技术味、可探索、可长期生长的个人数字空间。

---

## 2. 设计参考与吸收原则

参考站点：

- https://www.20050209.xyz/
- https://nahida.im/
- https://hyun.cc/

只吸收“设计原则、信息架构和交互灵感”，不要复制具体视觉资产、文字、图片、代码或高度相似的页面结构。

### 2.1 从 20050209.xyz / Firefly 吸收

保留：
- 内容丰富度
- Blog 卡片
- Moments / 动态
- Gallery
- 音乐
- Theme
- 搜索
- 标签与分类
- 轻量交互和可玩性

避免：
- 首页过度博客化
- 信息密度过高
- 左右侧栏长期占用大量视觉空间
- 为“功能齐全”而堆功能

### 2.2 从 nahida.im / Frosti 吸收

保留：
- 个人主页感
- 简洁直接的入口
- About / Articles / Projects 等主导航逻辑
- “这里是我的数字基地”的氛围

### 2.3 从 hyun.cc 吸收

保留：
- 主页本身即作品
- 更强的人格表达
- 首页不只是博客 Header

---

## 3. 视觉方向

### 3.1 关键词

- 有趣
- 个人化
- 阳光
- 极客
- 松弛
- 干净
- 技术感但不 Hacker 化
- 有生活感但不文艺过度

### 3.2 避免

不要做成：

- 企业 SaaS Landing Page
- 全站 Terminal / Hacker 黑绿风
- 标准程序员简历站
- AI 模板化 Bento 页面
- 大量玻璃拟态
- 夸张 3D 动画
- 技能百分比进度条
- 满屏打字机效果
- 自动播放音乐
- 为动画牺牲移动端体验

### 3.3 推荐视觉语言

默认方向：

- Light：暖白 / 纸张感背景 + 深色文字
- Dark：深灰黑而不是纯黑
- Accent：偏清爽的绿 / 青 / Lime 系
- 圆角适中，不要所有组件都“大圆角卡片”
- 适量使用照片、便签、小标签、状态灯、代码片段、设备小图标
- 允许少量“桌面 / 数字房间 / 技术工作台”的隐喻
- 微交互轻量、克制
- 使用 CSS variables 定义设计 token，方便以后换主题

### 3.4 主题系统

至少支持：

- Light
- Dark
- System

需要：
- 首屏无主题闪烁
- 用户选择持久化
- 颜色必须通过 CSS variables 管理
- 尊重 `prefers-reduced-motion`

---

## 4. 信息架构

建议一级结构：

```text
/
├── /blog
├── /projects
├── /now
├── /moments
├── /gallery
├── /uses
├── /timeline
├── /about
└── /lab
```

### 4.1 Home `/`

作用：
- 告诉访问者“我是谁”
- 让人快速感知个性
- 展示正在做什么
- 展示最值得看的项目与文章
- 提供进一步探索入口

首页不能退化成文章列表。

### 4.2 Blog `/blog`

需要：
- 全部文章
- 分类
- 标签
- 搜索
- Featured
- Series（可选）
- RSS
- 文章详情
- 上一篇 / 下一篇
- 相关文章
- TOC
- 代码高亮
- 图片
- Markdown / MDX

### 4.3 Projects `/projects`

区分：
- Featured
- Active
- Archived / Past

项目卡片至少显示：
- 名称
- 一句话说明
- 状态
- 技术栈
- 链接
- 封面 / Logo（可选）

支持项目详情页。

### 4.4 Now `/now`

表达“最近我在做什么”。

推荐字段：

- Building
- Exploring
- Learning
- Using
- Reading / Listening（可选）
- Updated At

不要做成履历。

### 4.5 Moments `/moments`

短内容：
- 技术发现
- 碎碎念
- 临时想法
- 小记录
- 图片

类似轻量微博 / Memos，但第一阶段使用本地 Markdown/MDX，不引入独立数据库。

### 4.6 Gallery `/gallery`

至少支持：
- 图片网格
- Album
- 图片描述
- 拍摄时间
- Lightbox
- 响应式图片

第一阶段图片可与仓库存放；
以后图片增多时迁移到 R2 / 对象存储。

### 4.7 Uses `/uses`

不是技能百分比。

按分类展示：

```text
Infrastructure
Network
AI
Web
Hardware
Software
Daily Tools
```

字段：
- name
- category
- description
- url
- icon
- recommended（可选）

### 4.8 Timeline `/timeline`

展示：
- 重要经历
- 技术阶段
- 项目里程碑
- 个人节点

不要求一开始填满内容。

### 4.9 About `/about`

完整自我介绍：
- Who I am
- What I build
- What I care about
- 技术兴趣
- 个人兴趣
- 联系方式

### 4.10 Lab `/lab`

这是长期扩展的重要边界。

未来可容纳：

```text
/lab/ip
/lab/network-tools
/lab/ai
/lab/visualization
/lab/mini-apps
```

Lab 不要求 V1 填满，只需要建立可扩展的信息架构和入口。

---

## 5. 首页 V1 详细结构

首页优先级建议：

- 个人表达：30%
- 项目 / 技术：25%
- 最近内容：20%
- 当前状态：10%
- 生活元素：10%
- 导航 / 其他：5%

### Section A：Hero

必须包含：

- 头像
- 名字 / 英文显示名（内容配置化，不写死）
- 简短介绍
- 一句有记忆点的 tagline
- 当前状态
- GitHub / Blog / Projects / About
- 1 个轻量动态元素或彩蛋

不要：
- 超大营销标题
- 过度打字机动画
- 大面积粒子背景

### Section B：Now / Current Status

用小卡或信息条展示：

- Currently building
- Currently exploring
- Last updated

内容来自配置或 `now` 内容源，不硬编码在组件内。

### Section C：Featured Project

突出 1~2 个真正重要项目。

卡片信息：
- 项目名
- 一句话目标
- Status
- Stack
- Repo / Demo
- 最近更新（可选）

允许使用明显比普通 Card 更大的视觉权重。

### Section D：Latest Posts

展示 3~5 篇最近文章。

需要：
- 标题
- 日期
- 分类
- 简介
- 阅读时间
- 封面可选

不要让首页变成完整博客列表。

### Section E：GitHub / Building

可包含：
- GitHub Link
- 最近项目
- 最近提交或 Contribution 摘要

实现原则：
- 不允许首页因 GitHub API 失败而崩溃
- V1 可以只使用静态配置
- 若接 API，必须缓存并提供 graceful fallback

### Section F：Uses / Digital Desk

展示少量：
- 当前设备
- IDE
- AI Coding Agent
- 常用工具

不要做“技能熟练度”。

### Section G：Moments / Photo

二选一或组合：
- 最近 2~3 条 Moment
- 最近一张照片 / 随机照片

用于增加生活感。

### Section H：Explore

进入：
- Blog
- Projects
- Gallery
- Timeline
- Lab

可做成比传统 Footer 更有趣的小型导航区。

---

## 6. 技术架构

### 6.1 核心技术

优先使用当前稳定版本，避免锁定已经过时的依赖。

推荐：

```text
Framework        Astro 7.x（使用当前最新稳定版本）
Language         TypeScript strict
CSS              Tailwind CSS
Interactive UI   React（只用于 Islands）
Content          Markdown + MDX
Content API      Astro Content Collections
Search           Pagefind
Package Manager  pnpm
Hosting          Cloudflare
Source           GitHub
Authoring PC     Obsidian
Mobile CMS       Sveltia CMS
```

原则：

> Astro First，React Only When Needed。

能用 `.astro` + CSS 完成的组件不要 React 化。

### 6.2 Rendering Strategy

V1：
- 以静态输出为主
- 所有 Blog / Projects / Gallery / About 等默认静态构建

未来需要动态能力时：
- 为对应 Route 使用 Astro on-demand rendering
- 再引入 `@astrojs/cloudflare`
- 不要为了未来可能存在的动态需求，让 V1 全站 SSR

### 6.3 Cloudflare

V1：
- 静态部署即可

未来：
- Workers
- KV
- D1
- R2
- Turnstile

均作为扩展能力，不在 MVP 阶段全部引入。

---

## 7. 推荐目录结构

```text
/
├── docs/
│   └── PERSONAL_SITE_IMPLEMENTATION_PLAN.md
│
├── public/
│   ├── admin/
│   │   ├── index.html
│   │   └── config.yml
│   ├── fonts/
│   ├── icons/
│   └── uploads/
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── common/
│   │   ├── home/
│   │   ├── blog/
│   │   ├── projects/
│   │   └── islands/
│   │
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   ├── ArticleLayout.astro
│   │   └── PageLayout.astro
│   │
│   ├── content/
│   │   ├── posts/
│   │   ├── projects/
│   │   ├── moments/
│   │   ├── gallery/
│   │   ├── timeline/
│   │   └── uses/
│   │
│   ├── content.config.ts
│   │
│   ├── pages/
│   │   ├── index.astro
│   │   ├── blog/
│   │   ├── projects/
│   │   ├── now.astro
│   │   ├── moments/
│   │   ├── gallery/
│   │   ├── uses.astro
│   │   ├── timeline.astro
│   │   ├── about.astro
│   │   └── lab/
│   │
│   ├── lib/
│   │   ├── content/
│   │   ├── seo/
│   │   ├── utils/
│   │   └── integrations/
│   │
│   ├── config/
│   │   ├── site.ts
│   │   ├── navigation.ts
│   │   └── social.ts
│   │
│   └── styles/
│       ├── global.css
│       └── tokens.css
│
├── scripts/
├── tests/
├── astro.config.*
├── package.json
├── tsconfig.json
└── README.md
```

目录可以根据 Astro 当前最佳实践微调，但职责边界不要混乱。

---

## 8. Content Collections 数据模型

所有 Schema 使用 Zod / Astro Content Collections 校验。

### 8.1 Post

```yaml
title:
description:
publishDate:
updatedDate:
draft:
category:
tags:
cover:
featured:
series:
toc:
comments:
canonical:
```

要求：
- `title` 必填
- `description` 必填
- `publishDate` 必填
- `draft` 默认 false
- `tags` 默认 []
- `featured` 默认 false
- slug 由文件名或显式配置产生
- Draft 不进入生产页面 / RSS / Sitemap

### 8.2 Project

```yaml
title:
summary:
description:
status:
startedAt:
endedAt:
stack:
repo:
demo:
homepage:
cover:
featured:
order:
```

`status` 建议 enum：

```text
idea
building
maintaining
paused
archived
```

### 8.3 Moment

```yaml
publishDate:
tags:
image:
location:
visibility:
```

正文放 Markdown body。

### 8.4 Gallery

```yaml
title:
image:
alt:
album:
shotDate:
location:
featured:
```

### 8.5 Timeline

```yaml
date:
title:
type:
description:
link:
```

### 8.6 Uses

```yaml
name:
category:
description:
url:
icon:
recommended:
order:
```

---

## 9. Blog 能力

V1 必须实现：

- Markdown
- MDX
- Syntax highlighting
- Copy code
- Heading anchors
- TOC
- Reading time
- Tags
- Categories
- Featured
- Draft
- Pagination
- RSS
- Sitemap
- Search
- Previous / Next
- Related posts
- OpenGraph metadata
- Canonical
- 404

优先考虑：
- Shiki / Expressive Code 或 Astro 当前推荐方案
- Pagefind 作为静态搜索

不要第一阶段实现：
- 复杂全文检索服务
- Elasticsearch
- 独立搜索后端

---

## 10. 写作与发布工作流

目标：

> 内容只存在一份真源：Git Repository。

不使用 WordPress 数据库。

### 10.1 电脑端

主要使用：

```text
Obsidian
  ↓
Markdown / MDX
  ↓
Git
  ↓
GitHub
  ↓
Cloudflare Build
```

推荐：
- 直接把内容目录作为 Obsidian Vault，或者把项目仓库作为 Vault
- `.obsidian/` 默认加入 `.gitignore`
- 保留文章模板
- Frontmatter 字段统一

### 10.2 手机端

**不要把传统 Obsidian Git 插件作为唯一主发布方案。**

手机主要通过：

```text
/admin
  ↓
Sveltia CMS
  ↓
GitHub
  ↓
Commit
  ↓
Build
```

Sveltia CMS 应配置：
- GitHub Backend
- posts
- projects
- moments
- gallery
- timeline
- uses
- media

目标体验：
- 手机浏览器可使用
- 可 PWA 安装
- 新建文章
- 保存 Draft
- 编辑 Frontmatter
- 上传图片
- 发布
- Git 自动留历史

### 10.3 Obsidian 手机端

可用于：
- 快速记录
- 长文草稿
- 私人知识库

但 V1 不要求从 Obsidian Mobile 直接稳定 Push Git。

如果未来找到成熟稳定的移动 Git Sync，可再打通。

---

## 11. Sveltia CMS

Phase 2/3 接入，不要阻塞首页与 Blog MVP。

建议路径：

```text
/admin
```

原则：
- Git 是后端
- CMS 不拥有独立数据库
- config.yml 与项目一起版本控制
- 后台不可暴露敏感 token
- OAuth / GitHub App / 适当授权方式按当前官方最佳实践配置
- 管理端默认不进入 Sitemap
- `noindex`

媒体第一阶段：
```text
/public/uploads/
```

未来图片量大：
```text
Cloudflare R2
```

---

## 12. 搜索

V1 使用 Pagefind。

要求：
- 构建后创建搜索索引
- 搜索 Blog 为主
- 后续可扩展 Projects / Moments
- 支持键盘打开搜索
- Mobile UI 可用
- 无 JS 或索引异常时页面仍能正常浏览

可设计快捷键：

```text
/
Ctrl/Cmd + K
```

但不要为快捷键引入大型 Command Palette 依赖。

---

## 13. 评论

不是 MVP 阻塞项。

建议顺序：

1. 先完成 Blog
2. 再选择评论系统

优先候选：
- Waline
- Giscus

选择标准：
- 用户门槛
- 隐私
- 后端维护成本
- 中国大陆访问体验
- 垃圾评论治理
- Cloudflare 兼容性

组件必须 provider abstraction，避免文章模板强绑定具体评论服务。

---

## 14. Analytics

建议：
- Umami 或同类轻量隐私友好统计
- 延迟加载
- 不阻塞页面

V1 不展示复杂“访客计数器”。

如果未来展示：
- 网站运行天数
- 访问量
- 文章阅读量

必须与真实数据对应，不允许伪造数字。

---

## 15. SEO

必须：

- `<title>`
- meta description
- canonical
- Open Graph
- Twitter/X card
- robots.txt
- sitemap.xml
- RSS
- favicon
- Web Manifest
- BlogPosting JSON-LD
- Person JSON-LD
- BreadcrumbList（内容页可选）

文章分享图：
- V1 可使用统一模板
- V2 可自动生成 OG Image

---

## 16. Accessibility

最低要求：

- 键盘导航完整
- Focus visible
- 合理 heading hierarchy
- 图片 alt
- Button/Link 语义正确
- Dialog / Lightbox 可键盘关闭
- 颜色对比度达标
- `prefers-reduced-motion`
- 不仅靠颜色表达状态
- Touch target 适合手机

---

## 17. Performance Budget

目标不是追求测试分数本身，而是避免主题化项目逐渐变重。

建议约束：

- Astro 静态优先
- React Island 尽量少
- 首屏非必要组件延迟 hydration
- 图片必须响应式处理
- 不加载无用字体权重
- 禁止大体积背景视频
- 第三方脚本延迟
- GitHub / Music / Analytics 均不得阻塞首屏

质量目标：
- Lighthouse Performance / Accessibility / SEO 尽量 ≥ 95
- CLS < 0.1
- LCP 目标 < 2.5s（普通移动网络作为参考）
- 首屏 JS 设预算并记录，不允许随着功能添加无限增长

---

## 18. 动画与交互

推荐：

- hover
- card lift
- subtle tilt
- section reveal
- page transition
- avatar / status 的微动画
- 少量 Easter Egg

禁止：
- 页面所有元素飞入
- Scroll hijacking
- 强制跟随鼠标特效
- 大量 Canvas / WebGL
- 自动播放有声媒体

动画实现优先顺序：

1. CSS
2. View Transitions
3. 小型 React Island
4. 最后才考虑动画库

---

## 19. 音乐

参考 Firefly，但不作为 V1 首屏核心。

如实现：
- 默认不自动播放
- 用户主动开启
- 播放状态可保持
- 不影响页面导航
- 不为音乐播放器引入大体积运行时

可以推迟到 Phase 4。

---

## 20. 动态 Web App 扩展策略

不要现在把个人站做成全栈 Dashboard。

`/lab` 建立扩展边界。

未来某个 Lab 需要：
- API
- 登录
- Database
- Cron
- Real-time

再针对该模块引入：
- Astro server route
- Cloudflare Worker
- D1 / KV / R2
- Hono（确有必要时）
- 或把独立复杂 App 放到子域名

原则：

> 内容站与 Web App 可以共享品牌，不必共享全部运行时。

如果某个未来应用已经明显属于完整 SaaS / Dashboard，可部署到：

```text
app.example.com
lab.example.com
tools.example.com
```

不要强迫 Astro 主站承担所有复杂业务。

---

## 21. 配置化原则

以下内容禁止散落硬编码：

- 姓名
- Bio
- Avatar
- Social Links
- Navigation
- Email
- Site title
- Site description
- Default OG
- Theme defaults
- Homepage section enable/disable

统一放：

```text
src/config/site.ts
src/config/navigation.ts
src/config/social.ts
```

首页每个模块尽量支持开关。

---

## 22. Error / Empty State

项目必须能在内容很少时正常展示。

例如：
- 没有 Moment
- 只有 1 篇 Blog
- Gallery 为空
- GitHub API 失败
- 评论服务不可用

都不能导致页面空白或布局错乱。

---

## 23. Security

V1 最重要：

- 不把 GitHub token 放客户端
- `.env` 不提交
- 外链使用合理 rel
- 用户输入未来若出现必须验证
- CMS 授权最小权限
- `/admin` noindex
- CSP 可在架构稳定后逐步启用
- 不把私人 Obsidian Notes 误打包到公开站点

必须明确区分：

```text
public content
private notes
draft content
```

---

## 24. Git / Development Workflow

推荐：

```text
main          production
feature/*     feature work
fix/*         bug fix
```

小型个人项目不需要复杂 GitFlow。

每个阶段：
1. 实现
2. lint / typecheck
3. build
4. smoke test
5. commit

Codex 不应：
- 一次改几百个无关文件
- 顺手重构与当前任务无关代码
- 引入大依赖却不解释
- 用复制粘贴制造重复组件

---

## 25. 代码质量约束

- TypeScript strict
- 避免 `any`
- 组件职责单一
- Content query 统一封装
- 日期格式统一
- URL/slug 工具统一
- 不要 premature abstraction
- 不引入全局状态管理，除非有明确必要
- React 仅用于需要 hydration 的局部组件
- 不因“未来可能用到”引入数据库
- 每个第三方依赖必须有明确用途

---

## 26. 测试策略

不追求大型测试体系。

### 必须

- `astro check`
- production build
- lint
- 关键页面 smoke test

### 推荐 Playwright

覆盖：
- Home 可打开
- Theme switch
- Navigation
- Blog 列表
- Blog detail
- Search
- Project detail
- Mobile menu
- 404

### Unit

只对值得测试的 utility：
- related posts
- sort
- filter
- slug
- date
- content helpers

---

## 27. 开发阶段

### Phase 0 — 技术审查与骨架

Codex 首先：

1. 阅读本方案
2. 审查当前仓库
3. 如果仓库为空，创建 Astro 项目
4. 确认 Astro / React / Tailwind 的当前稳定兼容版本
5. 形成简短架构决策
6. 不直接开始堆完整功能

产出：
- 项目可启动
- 基础目录
- site config
- design tokens
- Header/Footer
- Light/Dark
- 基础 CI

### Phase 1 — Homepage MVP

实现：
- Header
- Hero
- Now
- Featured Projects
- Latest Posts
- Uses
- Photo/Moment preview
- Explore
- Footer

要求：
- 先使用 mock/local content
- Mobile first
- 首页必须已经有明确个人特色
- 不追求全部动态数据

### Phase 2 — Blog Core

实现：
- Content Collection
- Blog index
- Detail
- Category
- Tag
- RSS
- Sitemap
- Search
- TOC
- Code
- Related
- SEO

完成后网站已经可以作为正式博客使用。

### Phase 3 — Personal Space

实现：
- Projects
- Now
- Moments
- Gallery
- Uses
- Timeline
- About
- Lab index

### Phase 4 — Mobile CMS

实现：
- Sveltia CMS
- GitHub backend
- Posts
- Projects
- Moments
- Gallery
- Media
- Draft/publish workflow
- `/admin` noindex

在真实 Android 手机上验证：
- 登录
- 新建
- 编辑
- 上传图片
- 发布

### Phase 5 — Enhancement

按价值逐个加入：
- Comment
- Analytics
- GitHub data
- Music
- OG image generator
- Easter eggs
- 更完整的 page transitions

不要一次全部实现。

### Phase 6 — Lab / Dynamic Foundation

只在存在第一个真实动态应用需求时开始。

评估：
- Astro server route
- Cloudflare Worker
- D1/KV/R2
- 是否需要独立应用 / 子域名

---

## 28. V1 发布标准

V1 不等于所有功能完成。

达到以下即可发布：

### 必须

- Home
- Blog
- Projects
- Now
- About
- Uses
- Search
- RSS
- Sitemap
- SEO
- Responsive
- Theme
- 至少 3 篇示例/真实文章
- 至少 2 个项目
- 正确 404
- Cloudflare 自动部署

### 可以暂缓

- Music
- Comment
- Gallery 完整功能
- Timeline 丰富内容
- GitHub 动态 API
- View Counter
- Web App
- 自研 Admin
- 登录
- Database

---

## 29. V1 验收清单

### Product

- [ ] 5 秒内能理解“这个人是谁、做什么、最近在做什么”
- [ ] 首页不是博客列表
- [ ] 项目展示足够突出
- [ ] 文章容易发现
- [ ] 网站有明显个人风格
- [ ] 不像 SaaS 模板
- [ ] Mobile 可完整使用

### Engineering

- [ ] `pnpm build` 通过
- [ ] `astro check` 通过
- [ ] TypeScript 无明显绕过
- [ ] Draft 不发布
- [ ] RSS 正常
- [ ] Sitemap 正常
- [ ] Search 正常
- [ ] 404 正常
- [ ] Theme 无闪烁
- [ ] 无明显 hydration error
- [ ] 无 token 暴露

### Content

- [ ] Posts schema
- [ ] Projects schema
- [ ] Now 内容
- [ ] About 内容
- [ ] Social links 配置化
- [ ] 默认 OG
- [ ] 图片 alt

### UX

- [ ] Desktop
- [ ] Android mobile
- [ ] Light
- [ ] Dark
- [ ] Keyboard
- [ ] Reduced motion
- [ ] Empty states

---

## 30. Codex 实施原则

Codex 必须遵守：

1. 先理解现状，再修改。
2. 本文是目标与边界，不是要求机械逐条照抄。
3. 发现方案与最新依赖或项目现实冲突时，应提出更优替代，但必须说明原因。
4. 不要为了“未来扩展”提前过度工程。
5. 不要一次完成所有 Phase。
6. 每个 Phase 结束都必须可运行、可构建。
7. 优先完成核心体验，再做装饰。
8. 开源项目只做参考，不直接复制私人站点素材。
9. 对大依赖、数据库、SSR、全局状态、复杂动画库保持克制。
10. 优先构建可长期维护的个人系统，而不是“第一眼很炫、三个月后难维护”的主题。

---

## 31. Codex 第一次执行时的建议输出

在真正写大量代码前，Codex 应输出一份简短的：

```text
Implementation Review

1. Current repo status
2. Proposed stack + versions
3. Architecture changes
4. Phase 0 files
5. Phase 1 files
6. Risks / deviations from plan
7. What will be implemented in this run
```

然后直接实施 Phase 0 + Phase 1 的合理部分。

不要停在“给建议”。
如果没有阻塞性信息缺失，应自行做合理决定并继续。

---

## 32. 后续演进原则

网站长期演进优先级：

```text
内容质量
>
个人表达
>
可维护性
>
性能
>
功能丰富度
>
炫技
```

每增加一个模块都问：

> 它是否让访问者更了解我、让内容更容易被发现、让我的工作流更轻，或者真的提供了有用能力？

如果答案都是否，就不应该加入。

最终目标不是“最完整的博客主题”，而是：

> 一个几年后仍然愿意维护、内容不会被平台锁住、能不断长出新能力的个人数字主页。
