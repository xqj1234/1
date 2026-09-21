# 我的笔记站

基于 [VitePress](https://vitepress.dev/) 的个人笔记站：本地写 Markdown，推送到 GitHub 后由 Actions 自动构建并部署到 GitHub Pages。

## 本地开发

```sh
npm install     # 首次安装依赖
npm run dev     # 本地预览 http://localhost:5173
npm run build   # 构建到 docs/.vitepress/dist
npm run preview # 预览构建产物
```

## 写笔记

1. 在 `docs/` 下新建 `.md` 文件。
2. 在 `docs/.vitepress/config.mts` 的 `sidebar` 中加一条链接。
3. 保存即热更新预览。

## 在线写笔记（后台）

访问 `/admin/`（线上：https://xqj1234.github.io/1/admin/），点「Sign In with Token」
粘贴 GitHub 访问令牌登录，即可图形化写笔记、点保存自动提交。

- CMS 用 [Sveltia CMS](https://sveltiacms.app/)（纯前端 CDN 引入，单人用令牌登录，无需 OAuth 服务端）。
- 配置在 `docs/public/admin/config.yml`；笔记存 `docs/notes/`。
- 令牌需 `repo`（或 contents 读写）权限，存在浏览器本地，换设备需重登。
- 侧边栏「我的笔记」由 `config.mts` 构建时扫描 `docs/notes/` 生成，新笔记自动出现。
- `docs/notes/index.md`（总览页）由 `scripts/gen-index.mjs` 生成，不入版本库。

## 每周链接检查

`.github/workflows/organize.yml` 每周一 09:00（北京时间）自动检查文档中的外部链接，
发现失效链接时开/更新一个 issue。可用 `scripts/link-check.mjs` 本地手动跑。

## 经验笔记联动

`scripts/sync-experience.sh` 会把 `~/.aicode/skills/ai-experience-notes/references/` 下的
经验文档复制到 `docs/experience/`，`dev`/`build` 前自动执行。CI 环境无此目录时自动跳过，
使用仓库内已提交的镜像。

## 部署

推送到 `main` 分支即触发 `.github/workflows/deploy.yml`。首次需在仓库
**Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。

若仓库是 `<用户名>.github.io`（用户主页仓库），把 workflow 里的
`BASE_PATH: /${{ github.event.repository.name }}/` 改为 `BASE_PATH: /`。
