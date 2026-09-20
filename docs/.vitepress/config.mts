import { defineConfig } from 'vitepress'

// 部署到 <用户名>.github.io/<仓库名>/ 时需要 base 前缀；CI 构建时由 BASE_PATH 注入
const base = process.env.BASE_PATH || '/'

export default defineConfig({
  title: '我的笔记',
  description: '个人笔记站',
  lang: 'zh-CN',
  base,
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/' },
      { text: '经验笔记', link: '/experience/' }
    ],
    sidebar: [
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
    search: { provider: 'local' },
    outline: { label: '本页目录', level: [2, 3] },
    docFooter: { prev: '上一篇', next: '下一篇' },
    darkModeSwitchLabel: '主题',
    sidebarMenuLabel: '目录',
    returnToTopLabel: '回到顶部'
  }
})
