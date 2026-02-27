# Claude Code Burn Report

CLI 工具，从 [CTok](https://subus.imds.ai) 获取 API 使用数据，生成 HTML 统计报告。

## 快速开始

### 方式 1：通过 Claude Code Skill（推荐）

**一键安装 Skill：**

```bash
curl -fsSL https://raw.githubusercontent.com/hellovigoss/cc-burn-report/main/skills/token-report/SKILL.md -o ~/.claude/skills/token-report/SKILL.md
```

安装后，直接对 Claude Code 说：
- "生成最近 7 天的 token 使用报告"
- "帮我统计 API 消耗"
- "生成 burn report"

Skill 会自动：
1. 🔧 从 GitHub 安装 CLI 工具（如果不存在）
2. ⚙️ 引导你配置 CTok 凭证
3. 📊 生成 HTML 报告
4. 🌐 在浏览器中打开报告

### 方式 2：手动安装 CLI

```bash
# 克隆仓库
git clone https://github.com/hellovigoss/cc-burn-report.git
cd cc-burn-report

# 全局安装
npm link

# 配置凭证
cp token-report-example.json ~/.token-report.json
# 编辑 ~/.token-report.json 填入你的凭证
```

## CLI 使用

```bash
# 最近 7 天（默认）
token-report

# 指定天数
token-report --days 30

# 指定日期范围
token-report --start 2026-02-01 --end 2026-02-27

# 指定输出文件
token-report --output report.html

# 查看帮助
token-report --help
```

## 报告内容

- **总体统计** — 总请求数、总 Token（K/M/G/T）、总消费
- **按 API 密钥统计** — 请求次数、输入/输出 Token、总消费
- **按模型统计** — 请求次数、输入/输出 Token、总消费

## 相关文档

- [CLAUDE.md](CLAUDE.md) - 项目架构和开发指南
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - 完整项目结构说明
- [skills/README.md](skills/README.md) - Skill 详细说明和故障排除
