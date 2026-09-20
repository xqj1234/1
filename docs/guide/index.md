# 开始

这是笔记站的指南首页。左侧边栏和顶部导航都由 `docs/.vitepress/config.mts` 配置。

## 怎么写一篇笔记

1. 在 `docs/` 下新建 `.md` 文件，例如 `docs/notes/idea.md`。
2. 在 `config.mts` 的 `sidebar` 里加一条链接。
3. 保存即预览（运行 `npm run dev`）。

## 本地命令

```sh
npm install     # 首次安装依赖
npm run dev     # 本地预览 http://localhost:5173
npm run build   # 构建到 docs/.vitepress/dist
npm run preview # 预览构建产物
```
