# Project Structure

```
cc-burn-report/
├── .claude-plugin/
│   └── plugin.json              # Claude Code 插件配置
├── skills/
│   ├── README.md                # Skill 使用说明和安装指南
│   └── token-report/
│       └── SKILL.md             # Token report skill 定义（含 YAML frontmatter）
├── index.js                     # CLI 入口点（可执行）
├── config.js                    # 配置管理（环境变量 + 配置文件）
├── api-client.js                # CTok API 客户端（登录、分页、数据获取）
├── report-generator.js          # HTML 报告生成器
├── package.json                 # npm 包配置
├── install.sh                   # 一键安装脚本（CLI + Skill）
├── token-report-example.json    # 配置文件示例（脱敏）
├── .gitignore                   # Git 忽略规则
├── README.md                    # 用户文档
├── CLAUDE.md                    # 开发者文档（项目架构）
└── PROJECT_STRUCTURE.md         # 本文件

生成的文件（已在 .gitignore 中）：
├── .token-report.json           # 用户凭证配置（不提交）
└── *.html                       # 生成的报告文件（不提交）
```

## 文件说明

### 核心代码（4 个文件）

**index.js** - CLI 入口
- 参数解析（--days, --start, --end, --output）
- 主流程编排（config → login → fetch → generate → save）
- 用户友好的控制台输出（emoji 指示器）

**config.js** - 配置管理
- 多路径配置文件查找（当前目录 > home 目录 > 工具目录）
- 环境变量支持（优先级最高）
- 配置验证

**api-client.js** - HTTP 客户端
- Bearer token 认证（/api/v1/auth/login）
- 自动分页处理（最多 1000 页保护）
- 灵活的响应格式处理
- 端点：/api/v1/usage/stats, /api/v1/usage

**report-generator.js** - 报告生成
- 数据聚合（按 API key 和 model）
- 数字格式化（K/M/G/T 单位）
- HTML 生成（内联 CSS，渐变样式）
- 三个统计部分：总体、按 API key、按 model

### 配置文件（2 个）

**package.json** - npm 包配置
- 包名：cc-burn-report
- 全局命令：token-report
- 无外部依赖（仅 Node.js 内置模块）

**token-report-example.json** - 配置示例
- 脱敏的配置文件模板
- 用户复制并填入真实凭证

### 文档文件（3 个）

**README.md** - 用户文档
- 快速开始指南
- 安装方式（插件 / 手动）
- 使用示例
- 配置说明

**CLAUDE.md** - 开发者文档
- 项目架构概述
- 四模块设计说明
- 开发命令
- API 响应处理逻辑
- 关键实现细节

**PROJECT_STRUCTURE.md** - 本文件
- 完整的项目结构
- 文件说明
- 目录组织逻辑

### Skills（2 个文件）

**skills/README.md** - Skill 使用指南
- 一键安装命令
- 功能特性说明
- 配置方法
- 故障排除
- 工作原理
- 架构图

**skills/token-report/SKILL.md** - Skill 定义
- YAML frontmatter（name, description）
- 触发条件说明
- 自动安装工作流
- 配置引导
- 报告生成步骤
- 故障排除指南

### 插件配置

**.claude-plugin/plugin.json** - Claude Code 插件元数据
- 插件名称和版本
- 描述和关键词
- Skills 目录引用
- 作者和仓库信息

### 脚本

**install.sh** - 一键安装脚本
- 检查前置条件（Node.js, Git）
- 克隆仓库到 ~/.claude/tools/token-report
- 全局安装 CLI（npm link）
- 复制 skill 到 ~/.claude/skills
- 引导配置设置

## 目录组织逻辑

**根目录** - CLI 工具核心代码
- 所有 .js 文件都是 CLI 工具的一部分
- 使用 Node.js 内置模块，无外部依赖
- 可通过 npm link 全局安装

**skills/** - Claude Code Skills
- 独立的 skill 定义
- 可单独分发和安装
- 遵循 Claude Code 官方 skill 规范

**.claude-plugin/** - 插件配置
- 让整个项目可作为 Claude Code 插件使用
- 自动发现 skills 目录

## 安装方式

### 方式 1：作为 Claude Code 插件（推荐）

```bash
# 手动安装
git clone https://github.com/hellovigoss/cc-burn-report.git ~/.claude/plugins/local/cc-burn-report

# 在 ~/.claude/settings.json 中启用
{
  "enabledPlugins": {
    "cc-burn-report@local": true
  }
}
```

### 方式 2：仅安装 Skill

```bash
# 一键安装
curl -fsSL https://raw.githubusercontent.com/hellovigoss/cc-burn-report/main/skills/token-report/SKILL.md -o ~/.claude/skills/token-report/SKILL.md
```

### 方式 3：手动安装 CLI

```bash
# 克隆并安装
git clone https://github.com/hellovigoss/cc-burn-report.git
cd cc-burn-report
npm link
```

## 使用流程

1. **安装** - 通过插件、skill 或手动方式安装
2. **配置** - 创建 .token-report.json 或设置环境变量
3. **运行** - 执行 `token-report --days 7` 或对 Claude Code 说 "生成 token 报告"
4. **查看** - 在浏览器中打开生成的 HTML 报告

## 开发

```bash
# 本地测试
node index.js --days 7

# 全局安装（开发模式）
npm link

# 卸载
npm unlink -g cc-burn-report
```

## 维护

- 核心代码在根目录
- Skill 定义在 skills/
- 文档保持同步更新
- 配置示例保持脱敏
- .gitignore 保护敏感信息
