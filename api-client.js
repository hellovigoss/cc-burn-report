#!/usr/bin/env node

/**
 * API client for fetching token usage data
 */

const https = require('https');
const { URL } = require('url');

class ApiClient {
  constructor(config) {
    this.baseUrl = config.baseUrl;
    this.email = config.email;
    this.password = config.password;
    this.timezone = config.timezone;
    this.authToken = null;
  }

  /**
   * Make HTTP request
   * @param {string} method - HTTP method
   * @param {string} path - API path
   * @param {Object} data - Request body (for POST)
   * @returns {Promise<Object>} Response data
   */
  async request(method, path, data = null) {
    return new Promise((resolve, reject) => {
      const url = new URL(path, this.baseUrl);
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'token-report-cli/1.0.0',
        },
      };

      // Add Authorization header if authenticated
      if (this.authToken) {
        options.headers['Authorization'] = `Bearer ${this.authToken}`;
      }

      const req = https.request(url, options, (res) => {
        let body = '';

        res.on('data', (chunk) => {
          body += chunk;
        });

        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(JSON.parse(body));
            } catch (error) {
              resolve(body);
            }
          } else {
            reject(
              new Error(
                `HTTP ${res.statusCode}: ${body || res.statusMessage}`
              )
            );
          }
        });
      });

      req.on('error', reject);

      if (data) {
        req.write(JSON.stringify(data));
      }

      req.end();
    });
  }

  /**
   * Login to get authentication token
   * @returns {Promise<void>}
   */
  async login() {
    try {
      const response = await this.request('POST', '/api/v1/auth/login', {
        email: this.email,
        password: this.password,
      });

      // Extract token from response
      if (response.data && response.data.access_token) {
        this.authToken = response.data.access_token;
      } else if (response.access_token) {
        this.authToken = response.access_token;
      } else if (response.data && response.data.token) {
        this.authToken = response.data.token;
      } else if (response.token) {
        this.authToken = response.token;
      } else {
        throw new Error(`No token in login response. Response: ${JSON.stringify(response)}`);
      }
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  /**
   * Fetch usage statistics
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @returns {Promise<Object>} Usage statistics
   */
  async fetchStats(startDate, endDate) {
    const path = `/api/v1/usage/stats?start_date=${startDate}&end_date=${endDate}&timezone=${encodeURIComponent(this.timezone)}`;
    return this.request('GET', path);
  }

  /**
   * Fetch usage records with pagination
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @param {number} page - Page number
   * @param {number} pageSize - Page size
   * @returns {Promise<Object>} Usage records
   */
  async fetchUsage(startDate, endDate, page = 1, pageSize = 100) {
    const path = `/api/v1/usage?page=${page}&page_size=${pageSize}&start_date=${startDate}&end_date=${endDate}&timezone=${encodeURIComponent(this.timezone)}`;
    return this.request('GET', path);
  }

  /**
   * Fetch all usage records (handles pagination)
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @param {Function} progressCallback - Optional callback for progress updates
   * @returns {Promise<Array>} All usage records
   */
  async fetchAllUsage(startDate, endDate, progressCallback = null) {
    const allRecords = [];
    let page = 1;
    const pageSize = 100;
    let totalFetched = 0;
    let totalRecords = null;

    while (true) {
      const response = await this.fetchUsage(startDate, endDate, page, pageSize);

      // Handle different response structures
      let records = null;
      if (response.data && Array.isArray(response.data.items)) {
        records = response.data.items;
        totalRecords = response.data.total || totalRecords;
      } else if (response.data && Array.isArray(response.data.records)) {
        records = response.data.records;
        totalRecords = response.data.total || totalRecords;
      } else if (response.data && Array.isArray(response.data)) {
        records = response.data;
      } else if (Array.isArray(response.items)) {
        records = response.items;
        totalRecords = response.total || totalRecords;
      } else if (Array.isArray(response.records)) {
        records = response.records;
        totalRecords = response.total || totalRecords;
      } else if (Array.isArray(response)) {
        records = response;
      }

      if (!records || records.length === 0) {
        break;
      }

      allRecords.push(...records);
      totalFetched += records.length;

      // Progress callback
      if (progressCallback) {
        progressCallback(totalFetched, totalRecords);
      }

      // Check if we've fetched all records
      if (totalRecords && totalFetched >= totalRecords) {
        break;
      }

      // Check if there are more pages (fallback if total not available)
      if (records.length < pageSize) {
        break;
      }

      page++;

      // Safety limit to prevent infinite loops
      if (page > 1000) {
        console.warn('Warning: Reached page limit of 1000, stopping pagination');
        break;
      }
    }

    return allRecords;
  }
}

module.exports = ApiClient;
