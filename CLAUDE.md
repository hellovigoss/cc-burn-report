# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Node.js CLI tool that fetches token usage data from CTok API (https://subus.imds.ai) and generates HTML reports. Uses only Node.js built-in modules (no external dependencies).

## Architecture

**Four-module design:**

1. **index.js** - CLI entry point
   - Argument parsing (--days, --start, --end, --output)
   - Main workflow orchestration (config → login → fetch → generate → save)
   - User-facing console output with emoji indicators

2. **config.js** - Configuration management
   - Loads from environment variables OR `.token-report.json` file
   - Priority: env vars > config file
   - Validates required fields (email, password)

3. **api-client.js** - HTTP client for CTok API
   - Bearer token authentication via `/api/v1/auth/login`
   - Handles multiple response formats (flexible data extraction)
   - Auto-pagination with safety limit (max 1000 pages)
   - Endpoints: `/api/v1/usage/stats`, `/api/v1/usage`

4. **report-generator.js** - HTML report generation
   - Aggregates records by model and API key
   - Formats numbers (K/M/G/T units), currency, dates
   - Inline CSS with gradient styling
   - Three sections: overall stats, by API key, by model

## Development Commands

```bash
# Install CLI globally (symlink to local repo)
npm link

# Run CLI
token-report --days 7
token-report --start 2026-02-01 --end 2026-02-27 --output report.html

# Test locally without installing
node index.js --days 7

# Uninstall
npm unlink -g cc-burn-report
```

## Configuration

Two methods (priority: env vars > file):

**Environment variables:**
```bash
export TOKEN_REPORT_EMAIL="user@example.com"
export TOKEN_REPORT_PASSWORD="password"
export TOKEN_REPORT_BASE_URL="https://subus.imds.ai"  # optional
export TOKEN_REPORT_TIMEZONE="Asia/Shanghai"          # optional
```

**Config file:** `.token-report.json` (gitignored)
```json
{
  "baseUrl": "https://subus.imds.ai",
  "email": "user@example.com",
  "password": "password",
  "timezone": "Asia/Shanghai"
}
```

## API Response Handling

The API client handles multiple response structures for flexibility:

**Login response** - tries multiple token field names:
- `response.data.access_token`
- `response.access_token`
- `response.data.token`
- `response.token`

**Usage records** - tries multiple array field names:
- `response.data.items`
- `response.data.records`
- `response.data` (if array)
- `response.items`
- `response.records`
- `response` (if array)

**Token fields** - supports both naming conventions:
- `input_tokens` / `prompt_tokens`
- `output_tokens` / `completion_tokens`
- `total_cost` / `cost`

## Key Implementation Details

**Pagination logic** (`api-client.js:fetchAllUsage`):
- Fetches 100 records per page
- Stops when: no records returned, total reached, or page size not full
- Safety limit: 1000 pages max to prevent infinite loops

**Data aggregation** (`report-generator.js:generateReport`):
- Iterates through all records once to build `modelStats` and `keyStats` objects
- Sorts by count (API keys) or total cost (models) for display

**Date handling:**
- CLI accepts YYYY-MM-DD format
- Defaults to last 7 days if not specified
- Timezone parameter sent to API for correct date filtering

## Testing Approach

When adding features or fixing bugs:
1. Test with real API (requires valid credentials)
2. Test edge cases: empty results, single page, multiple pages
3. Test different response formats (API may change structure)
4. Verify HTML output renders correctly in browsers
