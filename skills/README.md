# Claude Code Skills

This directory contains Claude Code skills for token usage reporting.

## Quick Start

**One-line installation:**

```bash
curl -fsSL https://raw.githubusercontent.com/hellovigoss/cc-burn-report/main/skills/token-report.md -o ~/.claude/skills/token-report.md
```

After installation, simply ask Claude Code:
- "生成最近 7 天的 token 使用报告"
- "Generate a token usage report for last 30 days"
- "Show me my API consumption"
- "Create a burn report"

The skill will automatically:
1. 🔧 Install CLI tool from GitHub (if not present)
2. ⚙️ Guide you through configuration setup
3. 📊 Generate HTML report with statistics
4. 🌐 Open report in your browser

## Available Skills

### token-report

Generate HTML reports for Claude API token usage statistics from CTok (https://subus.imds.ai).

**Features:**
- ✅ Auto-installation from GitHub
- ✅ Interactive configuration setup
- ✅ Multi-path config file search (current dir > home dir > tool dir)
- ✅ Automatic pagination handling (up to 1000 pages)
- ✅ Auto-open report in browser
- ✅ Beautiful HTML report with charts and tables

**What it generates:**
- Total requests, tokens (K/M/G/T units), and costs
- Breakdown by API key
- Breakdown by model
- Date range filtering

**Installation Options:**

```bash
# Option 1: One-line install (recommended)
curl -fsSL https://raw.githubusercontent.com/hellovigoss/cc-burn-report/main/skills/token-report.md -o ~/.claude/skills/token-report.md

# Option 2: Manual copy (if you cloned the repo)
cp skills/token-report.md ~/.claude/skills/

# Option 3: Project-specific installation
cp skills/token-report.md .claude/skills/

# Option 4: Reference via settings.json
# Add to ~/.claude/settings.json:
{
  "skillPaths": [
    "~/.claude/tools/token-report/skills"
  ]
}
```

**Usage Examples:**

Once installed, Claude Code will automatically recognize these requests:

```
User: "生成最近 7 天的 token 使用报告"
→ Generates report for last 7 days

User: "Generate token report for February 2026"
→ Generates report for specified date range

User: "Show me my API costs for last 30 days"
→ Generates 30-day cost report

User: "Create a burn report"
→ Generates default 7-day report
```

**First-time Setup:**

When you first use the skill, it will:

1. Check if CLI tool is installed
   - If not: automatically clone from GitHub and install
2. Check if configuration exists
   - If not: prompt for CTok email and password
   - Save to `~/.token-report.json`
3. Generate report and open in browser

**Configuration:**

The skill supports multiple configuration methods:

```bash
# Method 1: Global config file (recommended)
~/.token-report.json

# Method 2: Local config file (project-specific)
.token-report.json

# Method 3: Environment variables
export TOKEN_REPORT_EMAIL="your-email@example.com"
export TOKEN_REPORT_PASSWORD="your-password"
```

Config file format:
```json
{
  "baseUrl": "https://subus.imds.ai",
  "email": "your-email@example.com",
  "password": "your-password",
  "timezone": "Asia/Shanghai"
}
```

## Troubleshooting

**Skill not recognized:**
```bash
# Verify skill is installed
ls -la ~/.claude/skills/token-report.md

# Reinstall if missing
curl -fsSL https://raw.githubusercontent.com/hellovigoss/cc-burn-report/main/skills/token-report.md -o ~/.claude/skills/token-report.md
```

**Tool installation fails:**
```bash
# Check prerequisites
node --version  # Should be >= 18
git --version   # Should be installed

# Manual installation
git clone https://github.com/hellovigoss/cc-burn-report.git ~/.claude/tools/token-report
cd ~/.claude/tools/token-report
npm link
```

**Configuration issues:**
```bash
# Check config file exists
cat ~/.token-report.json

# Create config manually
cat > ~/.token-report.json << EOF
{
  "baseUrl": "https://subus.imds.ai",
  "email": "your-email@example.com",
  "password": "your-password",
  "timezone": "Asia/Shanghai"
}
EOF
```

**Report generation fails:**
```bash
# Test CLI directly
token-report --help
token-report --days 7

# Check logs for errors
# Verify CTok credentials are correct
# Ensure API is accessible: curl https://subus.imds.ai
```

## How It Works

1. **Skill Detection**: Claude Code reads `~/.claude/skills/token-report.md`
2. **Trigger Matching**: When user mentions "token report", "usage statistics", or "burn report"
3. **Auto-Installation**: Skill checks if `token-report` command exists
   - If not: clones from GitHub and runs `npm link`
4. **Configuration**: Skill checks for config file
   - If not found: prompts user for credentials
5. **Execution**: Runs `token-report` command with appropriate flags
6. **Auto-Open**: Opens generated HTML report in default browser

## Architecture

```
~/.claude/
├── skills/
│   └── token-report.md          # Skill definition (this gets loaded by Claude Code)
└── tools/
    └── token-report/            # CLI tool (auto-installed by skill)
        ├── index.js             # CLI entry point
        ├── config.js            # Config loader
        ├── api-client.js        # CTok API client
        └── report-generator.js  # HTML generator

~/.token-report.json             # User credentials (created by skill)
```

## Contributing

To add new skills to this directory:

1. Create a new `.md` file following the skill template
2. Test the skill thoroughly
3. Update this README with the new skill
4. Submit a pull request

**Skill Template:**

```markdown
# Skill Name

Brief description.

## When to Use
- Trigger condition 1
- Trigger condition 2

## What This Skill Does
1. Step 1
2. Step 2

## Prerequisites
- Requirement 1
- Requirement 2

## Usage
### Auto-Installation Workflow
```bash
# Installation steps
```

### Generate Output
```bash
# Usage examples
```

## Implementation Notes
- Technical detail 1
- Technical detail 2

## Troubleshooting
**Issue 1:**
- Solution

**Issue 2:**
- Solution
```

## License

MIT License - see [LICENSE](../LICENSE) for details.

## Links

- **GitHub Repository**: https://github.com/hellovigoss/cc-burn-report
- **CTok Platform**: https://subus.imds.ai
- **Claude Code**: https://claude.ai/code
