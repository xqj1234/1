#!/usr/bin/env node
// 检查 docs 下 Markdown 里的外部链接是否可访问；有失效链接时以非零退出码结束
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const docsDir = path.join(root, 'docs')
const IGNORE = [/^https?:\/\/(localhost|127\.0\.0\.1)/]
const URL_RE = /https?:\/\/[^\s)"'<>]+/g

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.vitepress' || entry.name === 'public') continue
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(p, out)
    else if (entry.name.endsWith('.md')) out.push(p)
  }
  return out
}

const found = new Map()
for (const file of walk(docsDir)) {
  const src = fs.readFileSync(file, 'utf-8')
  for (const m of src.matchAll(URL_RE)) {
    const url = m[0].replace(/[.,;:]+$/, '')
    if (IGNORE.some((re) => re.test(url))) continue
    if (!found.has(url)) found.set(url, new Set())
    found.get(url).add(path.relative(root, file))
  }
}

const entries = [...found.keys()]
const bad = []
let idx = 0

async function check(url) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 15000)
  const opts = { redirect: 'follow', signal: ctrl.signal, headers: { 'user-agent': 'Mozilla/5.0 link-check' } }
  try {
    let res = await fetch(url, { ...opts, method: 'HEAD' })
    if (res.status === 405 || res.status === 403) res = await fetch(url, { ...opts, method: 'GET' })
    if (res.status >= 400) bad.push({ url, status: res.status, files: [...found.get(url)] })
  } catch {
    bad.push({ url, status: 'ERR', files: [...found.get(url)] })
  } finally {
    clearTimeout(timer)
  }
}

async function worker() {
  while (idx < entries.length) await check(entries[idx++])
}

await Promise.all(Array.from({ length: 8 }, worker))

console.log(`共检查 ${entries.length} 个外部链接`)
if (bad.length) {
  console.log(`发现 ${bad.length} 个失效链接：`)
  for (const b of bad) console.log(`- [${b.status}] ${b.url}  (${b.files.join(', ')})`)
  process.exit(1)
}
console.log('全部可访问')
