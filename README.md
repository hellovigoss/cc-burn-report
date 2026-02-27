# Claude Code Burn Report

CLI 工具，从 [CTok](https://subus.imds.ai) 获取 API 使用数据，生成 HTML 统计报告。

## 安装

```bash
npm link
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
```

## 报告内容

- **总体统计** — 总请求数、总 Token（K/M/G/T）、总消费
- **按 API 密钥统计** — 请求次数、输入/输出 Token、总消费
- **按模型统计** — 请求次数、输入/输出 Token、总消费
