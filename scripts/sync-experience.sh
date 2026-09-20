#!/bin/sh
# 把 AI 经验笔记（~/.aicode/skills/ai-experience-notes/references/）同步进站点内容根。
# CI 环境没有该目录时自动跳过，改用仓库中已提交的镜像文件。
set -e

SRC="$HOME/.aicode/skills/ai-experience-notes/references"
DST="$(cd "$(dirname "$0")/.." && pwd)/docs/experience"

mkdir -p "$DST"

if [ -d "$SRC" ]; then
  cp "$SRC"/*.md "$DST/"
  echo "已同步经验笔记 -> docs/experience/"
else
  echo "跳过同步：未找到经验库 $SRC（使用仓库内已有镜像）"
fi
