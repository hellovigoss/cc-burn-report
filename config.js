#!/usr/bin/env node

/**
 * Configuration management for token report CLI
 * Loads credentials from environment variables or config file
 */

const fs = require('fs');
const path = require('path');

const CONFIG_FILE = path.join(__dirname, '.token-report.json');

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
    try {
      if (fs.existsSync(CONFIG_FILE)) {
        const fileConfig = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
        config.email = config.email || fileConfig.email;
        config.password = config.password || fileConfig.password;
        config.baseUrl = config.baseUrl || fileConfig.baseUrl;
        config.timezone = config.timezone || fileConfig.timezone;
      }
    } catch (error) {
      // Ignore file read errors, will validate later
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
      'Email is required. Set TOKEN_REPORT_EMAIL env var or create .token-report.json in project root'
    );
  }
  if (!config.password) {
    throw new Error(
      'Password is required. Set TOKEN_REPORT_PASSWORD env var or create .token-report.json in project root'
    );
  }
}

/**
 * Save configuration to file
 * @param {Object} config - Configuration object
 */
function saveConfig(config) {
  const configToSave = {
    baseUrl: config.baseUrl,
    email: config.email,
    password: config.password,
    timezone: config.timezone,
  };
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(configToSave, null, 2), 'utf8');
  console.log(`Configuration saved to ${CONFIG_FILE}`);
}

module.exports = {
  loadConfig,
  validateConfig,
  saveConfig,
  CONFIG_FILE,
};
