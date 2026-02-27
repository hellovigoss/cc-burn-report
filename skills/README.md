# Claude Code Skills

This directory contains Claude Code skills for token usage reporting.

## Available Skills

### token-report

Generate HTML reports for Claude API token usage statistics from CTok.

**Installation:**

```bash
# Option 1: Copy to your global skills directory
cp skills/token-report.md ~/.claude/skills/

# Option 2: Copy to project-specific skills directory
cp skills/token-report.md .claude/skills/

# Option 3: Reference directly from this repo
# Add to your ~/.claude/settings.json or project .claude/settings.json:
{
  "skillPaths": [
    "/path/to/token-report/skills"
  ]
}
```

**Usage:**

Once installed, Claude Code will automatically recognize when to use this skill based on user requests like:
- "Generate a token usage report"
- "Show me my API consumption for last month"
- "Create a burn report for the last 7 days"

## Contributing

To add new skills:
1. Create a new `.md` file in this directory
2. Follow the skill template format (see `token-report.md` as example)
3. Update this README with the new skill

## Skill Template

```markdown
# Skill Name

Brief description of what the skill does.

## When to Use

- Trigger condition 1
- Trigger condition 2

## What This Skill Does

1. Step 1
2. Step 2

## Prerequisites

Requirements for using this skill.

## Usage

Code examples and commands.

## Implementation Notes

Technical details and architecture notes.

## Troubleshooting

Common issues and solutions.
```
