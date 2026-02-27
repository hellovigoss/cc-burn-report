#!/usr/bin/env node

/**
 * HTML report generator for token usage data
 */

const fs = require('fs');
const path = require('path');

/**
 * Format number with thousands separator
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
function formatNumber(num) {
  return num.toLocaleString('en-US');
}

/**
 * Format large numbers with K/M/G/T units
 * @param {number} num - Number to format
 * @returns {string} Formatted number with unit
 */
function formatLargeNumber(num) {
  if (num >= 1e12) {
    return (num / 1e12).toFixed(2) + 'T';
  } else if (num >= 1e9) {
    return (num / 1e9).toFixed(2) + 'G';
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(2) + 'M';
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(2) + 'K';
  } else {
    return num.toString();
  }
}

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency
 */
function formatCurrency(amount) {
  return `$${amount.toFixed(4)}`;
}

/**
 * Format date
 * @param {string} dateStr - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Generate HTML report
 * @param {Object} stats - Usage statistics
 * @param {Array} records - Usage records
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {string} HTML content
 */
function generateReport(stats, records, startDate, endDate) {
  // Calculate aggregated data by model
  const modelStats = {};
  records.forEach((record) => {
    const model = record.model || 'unknown';
    if (!modelStats[model]) {
      modelStats[model] = {
        count: 0,
        totalCost: 0,
        inputTokens: 0,
        outputTokens: 0,
      };
    }
    modelStats[model].count++;
    modelStats[model].totalCost += parseFloat(record.total_cost || record.cost || 0);
    modelStats[model].inputTokens += parseInt(record.input_tokens || record.prompt_tokens || 0);
    modelStats[model].outputTokens += parseInt(record.output_tokens || record.completion_tokens || 0);
  });

  // Calculate aggregated data by API key
  const keyStats = {};
  records.forEach((record) => {
    const key = (record.api_key && record.api_key.name) || record.key_name || 'unknown';
    if (!keyStats[key]) {
      keyStats[key] = {
        count: 0,
        totalCost: 0,
        inputTokens: 0,
        outputTokens: 0,
        totalDuration: 0,
      };
    }
    keyStats[key].count++;
    keyStats[key].totalCost += parseFloat(record.total_cost || record.cost || 0);
    keyStats[key].inputTokens += parseInt(record.input_tokens || record.prompt_tokens || 0);
    keyStats[key].outputTokens += parseInt(record.output_tokens || record.completion_tokens || 0);
    keyStats[key].totalDuration += parseFloat(record.duration_ms || record.duration || 0);
  });

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Claude Code Burn Report (${startDate} ~ ${endDate})</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      color: #333;
    }
    .container {
      max-width: 1400px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }
    .header h1 {
      font-size: 32px;
      margin-bottom: 10px;
    }
    .header p {
      font-size: 16px;
      opacity: 0.9;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      padding: 40px;
      background: #f8f9fa;
    }
    .stat-card {
      background: white;
      padding: 24px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s;
    }
    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }
    .stat-label {
      font-size: 14px;
      color: #666;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .stat-value {
      font-size: 32px;
      font-weight: bold;
      color: #667eea;
    }
    .stat-detail {
      font-size: 12px;
      color: #999;
      margin-top: 8px;
    }
    .section {
      padding: 40px;
    }
    .section-title {
      font-size: 24px;
      margin-bottom: 20px;
      color: #333;
      border-bottom: 3px solid #667eea;
      padding-bottom: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      font-size: 14px;
    }
    th {
      background: #667eea;
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      position: sticky;
      top: 0;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #eee;
    }
    tr:hover {
      background: #f8f9fa;
    }
    .model-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      background: #e3f2fd;
      color: #1976d2;
    }
    .cost-cell {
      color: #e91e63;
      font-weight: 600;
    }
    .footer {
      background: #f8f9fa;
      padding: 20px 40px;
      text-align: center;
      color: #666;
      font-size: 14px;
    }
    .chart-container {
      margin: 20px 0;
      padding: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔥 Claude Code Burn Report</h1>
      <p>统计周期: ${startDate} ~ ${endDate}</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">总请求数</div>
        <div class="stat-value">${formatNumber(stats.total_requests || records.length)}</div>
        <div class="stat-detail">所选范围内</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">总 Token</div>
        <div class="stat-value">${formatLargeNumber(stats.total_tokens || 0)}</div>
        <div class="stat-detail">输入: ${formatLargeNumber(stats.total_input_tokens || 0)} / 输出: ${formatLargeNumber(stats.total_output_tokens || 0)}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">总消费</div>
        <div class="stat-value">${formatCurrency(stats.total_cost || stats.total_actual_cost || 0)}</div>
        <div class="stat-detail">实际消费金额</div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">🔑 按 API 密钥统计</h2>
      <table>
        <thead>
          <tr>
            <th>API 密钥</th>
            <th>请求次数</th>
            <th>输入 Token</th>
            <th>输出 Token</th>
            <th>总消费</th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(keyStats)
            .sort((a, b) => b[1].count - a[1].count)
            .map(
              ([key, data]) => `
            <tr>
              <td>${key}</td>
              <td>${formatNumber(data.count)}</td>
              <td>${formatNumber(data.inputTokens)}</td>
              <td>${formatNumber(data.outputTokens)}</td>
              <td>${formatCurrency(data.totalCost)}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2 class="section-title">📊 按模型统计</h2>
      <table>
        <thead>
          <tr>
            <th>模型</th>
            <th>请求次数</th>
            <th>输入 Token</th>
            <th>输出 Token</th>
            <th>总消费</th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(modelStats)
            .sort((a, b) => b[1].totalCost - a[1].totalCost)
            .map(
              ([model, data]) => `
            <tr>
              <td><span class="model-badge">${model}</span></td>
              <td>${formatNumber(data.count)}</td>
              <td>${formatNumber(data.inputTokens)}</td>
              <td>${formatNumber(data.outputTokens)}</td>
              <td>${formatCurrency(data.totalCost)}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    </div>

    <div class="footer">
      <p>Generated by token-report-cli | ${new Date().toLocaleString('zh-CN')}</p>
    </div>
  </div>
</body>
</html>`;

  return html;
}

/**
 * Save report to file
 * @param {string} html - HTML content
 * @param {string} outputPath - Output file path
 */
function saveReport(html, outputPath) {
  fs.writeFileSync(outputPath, html, 'utf8');
  console.log(`Report saved to: ${outputPath}`);
}

module.exports = {
  generateReport,
  saveReport,
};
