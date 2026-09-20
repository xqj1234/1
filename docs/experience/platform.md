# 平台参数名词与踩坑（AiCode / 容器环境）

> 记录 AI 在调整 AiCode 平台或容器参数时踩过的坑：名词真实含义、被误解的说法、参数连带影响等。便于溯源与复用。
> 记录时机：遇到新的平台参数/名词、发现理解有误、或确认了某项连带影响时，立即补词条。

## 词条格式

```markdown
### <参数 / 名词>
- **含义**：这个参数/名词的真实含义
- **被误解的点**：曾被怎么误读 / 误改
- **连带影响**：调整后会连带影响什么（相互重置、副作用等）
- **注意事项**：踩坑要点 / 正确做法
```

<!-- 演进: 2026-09-03 | 来源: 装包排错 | 类型: troubleshoot -->

### 沙盒文件系统禁硬链接（link() Permission denied）
- **含义**：AiCode 的 PRoot/overlay 容器文件系统在底层禁止 `link()` 系统调用，任何创建硬链接的操作都会报 `Permission denied`。
- **被误解的点**：起初误以为是 apk 安装的临时问题或权限问题，反复 `apk fix`/`--force-overwrite` 无果；实际是文件系统层面对 `link()` 的硬限制。
- **连带影响**：凡是以"硬链接打包"的 Alpine 包都装不完整——典型如 `unzip`（其 `zipinfo` 是 `unzip` 的硬链接）、`binutils`（ar/as/ld/nm/objcopy 等几乎全是硬链接）。apk 数据库会因此长期报错（每次事务 `4 errors`），且缺失文件不会自动补齐。
- **注意事项**：装包报 `Failed to create xxx: Permission denied` 且手动 `touch`/`mv` 同路径都成功时，先怀疑硬链接限制。验证方法：`ln 源 目标` 看是否 Permission denied。对策：换无硬链接的替代包（如 `libarchive-tools` 的 `bsdtar` 替代 unzip/zip），或手动 `cp` 副本补齐单个文件。注意 `zip` 包依赖 `unzip`，要一起删/一起装。

<!-- 演进: 2026-09-03 | 来源: 全库技能适配 | 类型: tip -->

### AiCode 平台目录速查
- **含义**：AiCode 的配置/记忆/技能/规则文件分布约定，适配或排查时快速定位。
- **路径清单**：
  - AI 配置根 `~/.aicode/`（宿主私有目录 `filesDir/aicode`，跨升级保留；卸载 App 一并删除）
  - 全局规则 `~/.aicode/AGENTS.md`；项目规则 `~/workspace/AGENTS.md`（无则回退 CLAUDE.md）
  - 自动记忆：全局 `~/.aicode/memory/`，项目 `<根>/.aicode/memory/`，经 `memory` 工具读写，启动只注入摘要
  - 技能：全局 `~/.aicode/skills/<name>/SKILL.md`，项目 `<根>/.aicode/skills/`，同名项目级优先
  - 技能禁用名单 `~/.aicode/skills.json` / `<根>/.aicode/skills.json`（`{"disabled":[...]}`，并集生效，约 2 秒轮询自动刷新）
  - MCP：全局 `~/.aicode/mcp.json`，项目 `<根>/.aicode/mcp.json`（项目级优先；用 `manageMcp` 管理，禁止手编）
  - 平台文档 `~/.aicode/docs/*.md`；版本信息 `~/.aicode/update-info.json`
  - 提示词覆盖 `~/.aicode/prompts.custom/`（同名覆盖默认片段，重启 App 生效）
  - 项目工作区 `~/workspace`（对应宿主 `filesDir/projects/`）
  - 容器内日志/tool 输出 `~/.aicode/tool-output/`；宿主日志 `/storage/emulated/0/Android/data/<包名>/files/logs/`
- **触发机制**：技能正文不自动注入，靠 frontmatter `description` 语义匹配、按需 `loadSkill`；修改技能/配置后新会话或数秒内生效。
- **注意事项**：不把其他平台（Claude Code/Codex）的尺寸阈值与写入规则套到 AiCode 上；平台参数以 `~/.aicode/docs/` 文档为准。
