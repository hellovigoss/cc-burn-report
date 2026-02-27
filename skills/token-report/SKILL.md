---
name: token-report
description: Generate HTML reports for Claude API token usage statistics from CTok. Use when user asks to generate token reports, analyze API consumption, track costs, or mentions "token", "报告", "usage", "statistics", "burn report", "消耗", "统计", or "API".
---

# Token Usage Report Generator

Generate HTML reports for Claude API token usage statistics from CTok (https://subus.imds.ai).

## When to Use

- User asks to generate token usage reports
- User wants to analyze Claude API consumption
- User needs to track API costs over time
- User mentions "token", "报告", "usage", "statistics", "burn report", "消耗", "统计", or "API"
- User requests reports for specific time periods (days, weeks, months)

## What This Skill Does

1. **Auto-installs** the CLI tool from GitHub if not present
2. Fetches token usage data from CTok API
3. Aggregates statistics by API key and model
4. Generates a styled HTML report with:
   - Total requests, tokens, and costs
   - Breakdown by API key
   - Breakdown by model
   - Visual formatting with charts and tables

## Prerequisites

User must have:
- CTok account credentials (email + password)
- Access to https://subus.imds.ai
- Node.js >= 18 installed
- Git installed

## Installation

**The tool auto-installs from GitHub when first used. No manual installation needed.**

Installation location: `~/.claude/tools/token-report/`

## Usage

### Auto-Installation Workflow

When user requests a token report, follow this workflow:

```bash
# 1. Check if tool is installed
if ! command -v token-report &> /dev/null; then
  echo "🔧 Installing token-report CLI from GitHub..."

  # Create tools directory
  mkdir -p ~/.claude/tools

  # Clone from GitHub
  git clone https://github.com/hellovigoss/cc-burn-report.git ~/.claude/tools/token-report

  # Install globally
  cd ~/.claude/tools/token-report
  npm link

  echo "✅ Installation complete!"
fi

# 2. Check if configured
if [ ! -f ~/.token-report.json ] && [ ! -f .token-report.json ]; then
  echo "⚙️  Configuration needed. Please provide your CTok credentials."
  # Prompt user for credentials and create config file
fi

# 3. Run the command
token-report --days 30
```

### Configuration Setup

If configuration doesn't exist, create it:

```bash
# Option 1: Global configuration (recommended)
cat > ~/.token-report.json << EOF
{
  "baseUrl": "https://subus.imds.ai",
  "email": "user@example.com",
  "password": "your-password",
  "timezone": "Asia/Shanghai"
}
EOF

# Option 2: Project-local configuration
cat > .token-report.json << EOF
{
  "baseUrl": "https://subus.imds.ai",
  "email": "user@example.com",
  "password": "your-password",
  "timezone": "Asia/Shanghai"
}
EOF
```

### Generate Reports

```bash
# Last 7 days (default)
token-report

# Last 30 days
token-report --days 30

# Specific date range
token-report --start 2026-02-01 --end 2026-02-27

# Custom output file
token-report --output my-report.html
```

### Using Environment Variables (Alternative)

```bash
export TOKEN_REPORT_EMAIL="your-email@example.com"
export TOKEN_REPORT_PASSWORD="your-password"
token-report --days 7
```

## Implementation Notes

**Architecture:**
- Pure Node.js (no external dependencies)
- Four modules: CLI entry, config loader, API client, report generator
- Handles pagination automatically (up to 1000 pages)
- Flexible response parsing (supports multiple API response formats)

**Configuration priority:**
1. Environment variables (highest)
2. `.token-report.json` file
3. Defaults (baseUrl, timezone)

**Security:**
- `.token-report.json` is gitignored
- Credentials never logged or exposed in output
- HTTPS-only API communication

## Example Workflow

When user asks: "Generate a token usage report for the last 30 days"

**Step 1: Check and install tool**
```bash
# Check if tool exists
if ! command -v token-report &> /dev/null; then
  echo "🔧 Token report tool not found. Installing from GitHub..."

  # Create tools directory if it doesn't exist
  mkdir -p ~/.claude/tools

  # Clone repository
  git clone https://github.com/hellovigoss/cc-burn-report.git ~/.claude/tools/token-report

  # Install globally via npm link
  cd ~/.claude/tools/token-report
  npm link

  echo "✅ Installation complete!"
else
  echo "✅ Token report tool already installed"
fi
```

**Step 2: Check and setup configuration**
```bash
# Check for config file (current dir, home dir, or tool dir)
CONFIG_FILE=""
if [ -f .token-report.json ]; then
  CONFIG_FILE=".token-report.json"
  echo "✅ Configuration file found: .token-report.json (current directory)"
elif [ -f ~/.token-report.json ]; then
  CONFIG_FILE="~/.token-report.json"
  echo "✅ Configuration file found: ~/.token-report.json (home directory)"
else
  echo "⚙️  Configuration file not found."
  echo ""
  echo "Please provide your CTok credentials:"
  echo "(Your credentials will be saved to ~/.token-report.json)"
  echo ""

  # Prompt user for credentials
  read -p "CTok Email: " email
  read -sp "CTok Password: " password
  echo ""

  # Create global config file
  cat > ~/.token-report.json << EOF
{
  "baseUrl": "https://subus.imds.ai",
  "email": "$email",
  "password": "$password",
  "timezone": "Asia/Shanghai"
}
EOF

  echo ""
  echo "✅ Configuration saved to ~/.token-report.json"
  CONFIG_FILE="~/.token-report.json"
fi
```

**Step 3: Generate report**
```bash
# Run the command
token-report --days 30

# Auto-open the report in browser
if [ -f token-report.html ]; then
  echo "📊 Report generated: token-report.html"
  echo "🌐 Opening report in browser..."

  # Open in default browser (cross-platform)
  if [[ "$OSTYPE" == "darwin"* ]]; then
    open token-report.html
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open token-report.html
  elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    start token-report.html
  fi

  echo "✅ Report opened in browser"
fi
```

## Implementation Notes

**Architecture:**
- Pure Node.js (no external dependencies)
- Four modules: CLI entry, config loader, API client, report generator
- Handles pagination automatically (up to 1000 pages)
- Flexible response parsing (supports multiple API response formats)

**Installation location:**
- Tool installed to: `~/.claude/tools/token-report/`
- Symlinked globally via `npm link`
- Config file: `~/.token-report.json` (global) or `.token-report.json` (local)

**Configuration priority:**
1. Environment variables (highest)
2. Local `.token-report.json` file
3. Global `~/.token-report.json` file
4. Defaults (baseUrl, timezone)

**Security:**
- Config files are gitignored
- Credentials never logged or exposed in output
- HTTPS-only API communication
- Passwords masked in prompts

## Troubleshooting

**"command not found: token-report"**
- Tool not installed yet
- Run the auto-installation workflow above
- Verify `~/.claude/tools/token-report/` exists

**"Email is required" error:**
- Configuration file missing or incomplete
- Create `~/.token-report.json` with credentials
- Or set environment variables: `TOKEN_REPORT_EMAIL`, `TOKEN_REPORT_PASSWORD`

**"Login failed" error:**
- Verify credentials are correct
- Check if CTok API is accessible: `curl https://subus.imds.ai`
- Confirm baseUrl is correct in config

**"git clone failed" error:**
- Check internet connection
- Verify GitHub repository URL is correct
- Try manual clone: `git clone https://github.com/hellovigoss/cc-burn-report.git`

**"npm link failed" error:**
- Check Node.js is installed: `node --version` (requires >= 18)
- Check npm permissions
- Try with sudo: `sudo npm link` (not recommended)
- Or add to PATH manually

**Empty report:**
- Check date range - may be no usage in that period
- Verify API key has recorded usage
- Check API response with `--verbose` flag (if implemented)

## Maintenance

**Update tool to latest version:**
```bash
cd ~/.claude/tools/token-report
git pull origin main
npm link
```

**Uninstall:**
```bash
npm unlink -g cc-burn-report
rm -rf ~/.claude/tools/token-report
rm ~/.token-report.json  # optional: remove config
```

**Check installation:**
```bash
which token-report
token-report --help
```

## Related Commands

```bash
# View help
token-report --help

# Check version
cat ~/.claude/tools/token-report/package.json | grep version

# Test configuration
node -e "console.log(require('~/.claude/tools/token-report/config').loadConfig())"

# View generated report
open token-report.html  # macOS
xdg-open token-report.html  # Linux
start token-report.html  # Windows
```

## GitHub Repository

**Repository URL:** `https://github.com/hellovigoss/cc-burn-report`

**Installation from source:**
```bash
git clone https://github.com/hellovigoss/cc-burn-report.git
cd token-report
npm link
```

**For contributors:**
- See `CLAUDE.md` for development guidelines
- See `README.md` for usage documentation
- Submit issues and PRs on GitHub
