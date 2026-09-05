# 内容维护指南

## 推荐：网页后台

日常维护优先使用部署后的 `/admin`。它适合手机和电脑，可以编辑 Now、写文章、维护项目和上传图片。后台使用 GitHub 保存修改，Git 仓库仍然是唯一内容真源；CMS 没有额外数据库。

详细的登录、保存和发布步骤见 [CMS_USAGE.md](./CMS_USAGE.md)。

### 内容入口

- `个人资料`：编辑 `src/content/profile/ming.md`，包括首页一句话、简介、状态、头像、联系方式、About 和 SEO 信息。
- `现在 / Now`：编辑 `src/content/now/current.md` 的 `updatedAt`、`building`、`exploring`、`learning` 四块内容。
- `文章`：管理 `src/content/posts/`。新文章默认是草稿；只有取消 `draft` 后才会进入公开页面、RSS 和搜索。
- `项目`：管理 `src/content/projects/`。状态使用固定选项，`featured` 和 `order` 控制首页精选顺序。
- `Uses`：管理 `src/content/uses/`，记录正在使用的工具，不填写技能等级或百分比。
- `动态`：管理 `src/content/moments/`。新建内容默认仅链接可见，确认后才改为公开。
- `相册`：管理 `src/content/gallery/`，目前只接入内容模型，不会自动增加新的前台动画。
- `时间线`：管理 `src/content/timeline/`，只填写真实发生过的节点。

`个人资料` 和 `现在 / Now` 是固定文件。后台可以修改它们，但不能创建第二份，也不能删除唯一文件。

## 高级：直接 Markdown

需要批量修改、检查 diff 或离线写作时，继续直接维护 `src/content/`。复制同一目录下的现有文件，保持字段名、日期格式和枚举值与 `src/content.config.ts` 一致。

### 头像

继续使用 `public/images/ming-avatar.webp` 或通过后台上传到 `public/uploads/`。推荐正方形 WebP，约 960×960，尽量不超过 500 KB。头像替换后同步确认 `src/content/profile/ming.md` 的 `avatar.src`、`alt`、`width` 和 `height`。

### 联系方式

编辑 Profile 的 `contacts`。没有值的可选联系方式不会渲染空链接；公开身份统一使用 `Ming`，不要添加真实姓名或未确认的个人经历。

### 本地检查

```text
pnpm lint
pnpm check
pnpm build
pnpm test
pnpm test:privacy
pnpm test:cf
pnpm cf:dry-run
```

不要把 GitHub token、OAuth Secret、`.env` 或私人笔记提交到仓库。
