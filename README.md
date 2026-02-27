# Claude Code Burn Report

CLI 工具，从 [CTok](https://subus.imds.ai) 获取 API 使用数据，生成 HTML 统计报告。

## 快速开始

### 方式 1：通过 Claude Code 插件（推荐）

**安装插件：**

在 Claude Code 中运行：
```
/plugins install https://github.com/hellovigoss/cc-burn-report
```

或者手动安装：
```bash
# 克隆插件到 Claude 插件目录
git clone https://github.com/hellovigoss/cc-burn-report.git ~/.claude/plugins/local/cc-burn-report

# 在 Claude Code 中启用插件
# 打开 ~/.claude/settings.json，添加：
{
  "enabledPlugins": {
    "cc-burn-report@local": true
  }
}
```

安装后，直接对 Claude Code 说：
- "生成最近 7 天的 token 使用报告"
- "帮我统计 API 消耗"
- "生成 burn report"

插件会自动：
1. 从 GitHub 安装 CLI 工具
2. 引导你配置 CTok 凭证
3. 生成并打开 HTML 报告

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

## 配置

复制示例文件并填入你的凭证：

```bash
cp token-report-example.json .token-report.json
```

编辑 `.token-report.json`：

```json
{
  "baseUrl": "https://subus.imds.ai",
  "email": "your-email@example.com",
  "password": "your-password",
  "timezone": "Asia/Shanghai"
}
```

> `.token-report.json` 已在 `.gitignore` 中，不会被提交。

也可以用环境变量代替：

```bash
export TOKEN_REPORT_EMAIL="your-email@example.com"
export TOKEN_REPORT_PASSWORD="your-password"
```

## 使用

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

## Claude Code 插件

本项目提供 Claude Code 插件，让 AI 助手自动处理安装、配置和报告生成。

**安装插件：**
```bash
# 方式 1：通过 Claude Code CLI
/plugins install https://github.com/hellovigoss/cc-burn-report

# 方式 2：手动克隆
git clone https://github.com/hellovigoss/cc-burn-report.git ~/.claude/plugins/local/cc-burn-report
```

**使用示例：**
- "生成最近 30 天的 token 报告"
- "统计我的 API 消耗"
- "创建 burn report"

详见 [.claude-plugin/](/.claude-plugin/) 和 [skills/README.md](skills/README.md)

## 开发

详见 [CLAUDE.md](CLAUDE.md) 了解项目架构和开发指南。
