#!/usr/bin/env node

/**
 * Token Usage Report CLI
 * Fetches token usage data and generates HTML report
 */

const path = require('path');
const { loadConfig, validateConfig } = require('./config');
const ApiClient = require('./api-client');
const { generateReport, saveReport } = require('./report-generator');

/**
 * Parse command line arguments
 * @returns {Object} Parsed arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    startDate: null,
    endDate: null,
    output: 'token-report.html',
    days: 7,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--start':
      case '-s':
        options.startDate = args[++i];
        break;
      case '--end':
      case '-e':
        options.endDate = args[++i];
        break;
      case '--output':
      case '-o':
        options.output = args[++i];
        break;
      case '--days':
      case '-d':
        options.days = parseInt(args[++i], 10);
        break;
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
        break;
      default:
        console.error(`Unknown option: ${arg}`);
        printHelp();
        process.exit(1);
    }
  }

  // Calculate dates if not provided
  if (!options.endDate) {
    options.endDate = new Date().toISOString().split('T')[0];
  }
  if (!options.startDate) {
    const start = new Date();
    start.setDate(start.getDate() - options.days);
    options.startDate = start.toISOString().split('T')[0];
  }

  return options;
}

/**
 * Print help message
 */
function printHelp() {
  console.log(`
Token Usage Report CLI

Usage:
  token-report [options]

Options:
  -s, --start <date>    Start date (YYYY-MM-DD) [default: 7 days ago]
  -e, --end <date>      End date (YYYY-MM-DD) [default: today]
  -d, --days <number>   Number of days to look back [default: 7]
  -o, --output <path>   Output HTML file path [default: token-report.html]
  -h, --help            Show this help message

Environment Variables:
  TOKEN_REPORT_EMAIL       Email for authentication
  TOKEN_REPORT_PASSWORD    Password for authentication
  TOKEN_REPORT_BASE_URL    API base URL [default: https://subus.imds.ai]
  TOKEN_REPORT_TIMEZONE    Timezone [default: Asia/Shanghai]

Configuration File:
  ~/.token-report.json    JSON file with email, password, baseUrl, timezone

Examples:
  # Generate report for last 7 days
  token-report

  # Generate report for specific date range
  token-report --start 2026-02-01 --end 2026-02-27

  # Generate report for last 30 days
  token-report --days 30

  # Specify output file
  token-report --output my-report.html
`);
}

/**
 * Main function
 */
async function main() {
  try {
    // Parse arguments
    const options = parseArgs();

    console.log('🚀 Token Usage Report CLI');
    console.log(`📅 Date range: ${options.startDate} ~ ${options.endDate}`);
    console.log('');

    // Load and validate configuration
    console.log('🔐 Loading configuration...');
    const config = loadConfig();
    validateConfig(config);

    // Create API client
    const client = new ApiClient(config);

    // Login
    console.log('🔑 Authenticating...');
    await client.login();
    console.log('✅ Authentication successful');

    // Fetch data
    console.log('📊 Fetching usage statistics...');
    const statsResponse = await client.fetchStats(options.startDate, options.endDate);
    const stats = statsResponse.data || statsResponse;

    console.log('📝 Fetching usage records...');
    const records = await client.fetchAllUsage(
      options.startDate,
      options.endDate
    );
    console.log(`✅ Fetched ${records.length} records`);

    // Generate report
    console.log('📄 Generating HTML report...');
    const html = generateReport(stats, records, options.startDate, options.endDate);

    // Save report
    const outputPath = path.resolve(options.output);
    saveReport(html, outputPath);

    console.log('');
    console.log('✨ Report generated successfully!');
    console.log(`📂 Open: ${outputPath}`);
  } catch (error) {
    console.error('');
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run main function
if (require.main === module) {
  main();
}

module.exports = { main, parseArgs };
