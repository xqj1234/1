#!/usr/bin/env node
// 扫描 docs/notes 下的笔记，生成总览页 docs/notes/index.md（不提交，由构建时生成）
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const notesDir = path.join(root, 'docs/notes')
const outFile = path.join(notesDir, 'index.md')

function parse(file) {
  const src = fs.readFileSync(file, 'utf-8')
  const fm = src.match(/^---\n([\s\S]*?)\n---/)
  let title = ''
  let date = ''
  if (fm) {
    const t = fm[1].match(/^\s*title:\s*(.+)$/m)
    if (t) title = t[1].trim().replace(/^["']|["']$/g, '')
    const d = fm[1].match(/^\s*date:\s*(.+)$/m)
    if (d) date = d[1].trim().replace(/^["']|["']$/g, '')
  }
  if (!title) {
    const h1 = src.match(/^#\s+(.+)$/m)
    title = h1 ? h1[1].trim() : path.basename(file, '.md')
  }
  return { title, date }
}

fs.mkdirSync(notesDir, { recursive: true })

const files = fs
  .readdirSync(notesDir)
  .filter((f) => f.endsWith('.md') && f !== 'index.md')

const items = files.map((f) => {
  const { title, date } = parse(path.join(notesDir, f))
  return { title, date, link: `./${f.replace(/\.md$/, '')}.md` }
})

items.sort(
  (a, b) => (b.date || '').localeCompare(a.date || '') || a.title.localeCompare(b.title)
)

const lines = ['# 笔记总览', '']
if (items.length) {
  lines.push('')
  for (const it of items) {
    lines.push(`- ${it.date ? `\`${it.date}\` ` : ''}[${it.title}](${it.link})`)
  }
  lines.push('')
} else {
  lines.push('（还没有笔记，去 [后台](/admin/) 新建一篇吧）', '')
}

const content = lines.join('\n')
if (!fs.existsSync(outFile) || fs.readFileSync(outFile, 'utf-8') !== content) {
  fs.writeFileSync(outFile, content)
  console.log(`已生成 docs/notes/index.md（${items.length} 篇）`)
} else {
  console.log('总览页无变化')
}
