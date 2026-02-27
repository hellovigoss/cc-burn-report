#!/usr/bin/env node

/**
 * Configuration management for token report CLI
 * Loads credentials from environment variables or config file
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Config file search paths (in priority order)
const CONFIG_PATHS = [
  path.join(process.cwd(), '.token-report.json'),           // 1. Current directory
  path.join(os.homedir(), '.token-report.json'),            // 2. Home directory
  path.join(__dirname, '.token-report.json'),               // 3. Tool directory (backward compat)
];

/**
 * Find first existing config file
 * @returns {string|null} Path to config file or null
 */
function findConfigFile() {
  for (const configPath of CONFIG_PATHS) {
    if (fs.existsSync(configPath)) {
      return configPath;
    }
  }
  return null;
}

/**
 * Load configuration from environment or config file
 * @returns {Object} Configuration object
 */
function loadConfig() {
  const config = {
    baseUrl: process.env.TOKEN_REPORT_BASE_URL || 'https://subus.imds.ai',
    email: process.env.TOKEN_REPORT_EMAIL,
    password: process.env.TOKEN_REPORT_PASSWORD,
    timezone: process.env.TOKEN_REPORT_TIMEZONE || 'Asia/Shanghai',
  };

  // Try to load from config file if env vars not set
  if (!config.email || !config.password) {
    const configFile = findConfigFile();
    if (configFile) {
      try {
        const fileConfig = JSON.parse(fs.readFileSync(configFile, 'utf8'));
        config.email = config.email || fileConfig.email;
        config.password = config.password || fileConfig.password;
        config.baseUrl = config.baseUrl || fileConfig.baseUrl;
        config.timezone = config.timezone || fileConfig.timezone;
      } catch (error) {
        // Ignore file read errors, will validate later
      }
    }
  }

  return config;
}

/**
 * Validate configuration
 * @param {Object} config - Configuration object
 * @throws {Error} If required fields are missing
 */
function validateConfig(config) {
  if (!config.email) {
    throw new Error(
      'Email is required. Set TOKEN_REPORT_EMAIL env var or create .token-report.json (current dir or ~/.token-report.json)'
    );
  }
  if (!config.password) {
    throw new Error(
      'Password is required. Set TOKEN_REPORT_PASSWORD env var or create .token-report.json (current dir or ~/.token-report.json)'
    );
  }
}

/**
 * Save configuration to file
 * @param {Object} config - Configuration object
 * @param {string} location - 'global' or 'local' (default: 'global')
 */
function saveConfig(config, location = 'global') {
  const configToSave = {
    baseUrl: config.baseUrl,
    email: config.email,
    password: config.password,
    timezone: config.timezone,
  };

  const configPath = location === 'local'
    ? CONFIG_PATHS[0]  // Current directory
    : CONFIG_PATHS[1]; // Home directory

  fs.writeFileSync(configPath, JSON.stringify(configToSave, null, 2), 'utf8');
  console.log(`Configuration saved to ${configPath}`);
}

module.exports = {
  loadConfig,
  validateConfig,
  saveConfig,
  findConfigFile,
  CONFIG_PATHS,
};
