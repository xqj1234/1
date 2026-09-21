import { defineConfig } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// 部署到 <用户名>.github.io/<仓库名>/ 时需要 base 前缀；CI 构建时由 BASE_PATH 注入
const base = process.env.BASE_PATH || '/'

const docsRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const notesDir = path.join(docsRoot, 'notes')

function readTitle(file: string): string {
  const src = fs.readFileSync(file, 'utf-8')
  const fm = src.match(/^---\n[\s\S]*?\n---/)
  if (fm) {
    const t = fm[0].match(/^\s*title:\s*(.+)$/m)
    if (t) return t[1].trim().replace(/^["']|["']$/g, '')
  }
  const h1 = src.match(/^#\s+(.+)$/m)
  return h1 ? h1[1].trim() : path.basename(file, '.md')
}

// 侧边栏「我的笔记」按 docs/notes 目录实时生成，后台新建的笔记自动出现
const noteItems = fs.existsSync(notesDir)
  ? fs
      .readdirSync(notesDir)
      .filter((f) => f.endsWith('.md') && f !== 'index.md')
      .sort()
      .map((f) => ({
        text: readTitle(path.join(notesDir, f)),
        link: `/notes/${f.replace(/\.md$/, '')}`
      }))
  : []

export default defineConfig({
  title: '我的笔记',
  description: '个人笔记站',
  lang: 'zh-CN',
  base,
  transformHead: () => [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}logo.svg` }]
  ],
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: '首页', link: '/' },
      { text: '我的笔记', link: '/notes/' },
      { text: '指南', link: '/guide/' },
      { text: '经验笔记', link: '/experience/' }
    ],
    sidebar: [
      {
        text: '我的笔记',
        items: [{ text: '总览', link: '/notes/' }, ...noteItems]
      },
      {
        text: '指南',
        items: [
          { text: '开始', link: '/guide/' },
          { text: 'Markdown 语法', link: '/guide/markdown' }
        ]
      },
      {
        text: '经验笔记',
        items: [
          { text: '总览', link: '/experience/' },
          { text: '容器 / Android 排错', link: '/experience/container-android' },
          { text: '平台机制', link: '/experience/platform' },
          { text: '工具组合', link: '/experience/tool-patterns' },
          { text: '网络 / 镜像源', link: '/experience/network' }
        ]
      }
    ],
    footer: {
      message: '用 Markdown 记录，随想随写。',
      copyright: '© 2026 我的笔记'
    },
    search: { provider: 'local' },
    outline: { label: '本页目录', level: [2, 3] },
    docFooter: { prev: '上一篇', next: '下一篇' },
    darkModeSwitchLabel: '主题',
    sidebarMenuLabel: '目录',
    returnToTopLabel: '回到顶部'
  }
})
