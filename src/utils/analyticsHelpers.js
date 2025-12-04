/**
 * Analytics Utilities
 * Helper functions for formatting and processing analytics data
 */

/**
 * Format large numbers with commas
 * @param {number} value - The number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (value) => {
  if (!value) return '0';
  return parseInt(value).toLocaleString();
};

/**
 * Format currency values
 * @param {number} value - The value to format
 * @param {string} currency - Currency code (default: EGP)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, currency = 'EGP') => {
  if (!value) return `0 ${currency}`;
  return `${formatNumber(value)} ${currency}`;
};

/**
 * Calculate percentage change between two values
 * @param {number} newValue - New value
 * @param {number} oldValue - Old value
 * @returns {number} Percentage change
 */
export const calculatePercentageChange = (newValue, oldValue) => {
  if (oldValue === 0) return 0;
  return Math.round(((newValue - oldValue) / oldValue) * 100);
};

/**
 * Format date for analytics display
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date
 */
export const formatDate = (date) => {
  const d = new Date(date);
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  return `${monthNames[d.getMonth()]} ${d.getDate()}`;
};

/**
 * Get date range label
 * @param {string} range - Time range (week, month, year)
 * @returns {string} Date range label
 */
export const getDateRangeLabel = (range) => {
  const today = new Date();
  const startDate = new Date();

  switch (range) {
    case 'week':
      startDate.setDate(today.getDate() - 7);
      return `Last 7 Days (${formatDate(startDate)} - ${formatDate(today)})`;
    case 'month':
      startDate.setMonth(today.getMonth() - 1);
      return `Last 30 Days (${formatDate(startDate)} - ${formatDate(today)})`;
    case 'year':
      startDate.setFullYear(today.getFullYear() - 1);
      return `Last Year (${formatDate(startDate)} - ${formatDate(today)})`;
    default:
      return formatDate(today);
  }
};

/**
 * Calculate conversion rate
 * @param {number} conversions - Number of conversions
 * @param {number} totalVisits - Total number of visits
 * @returns {number} Conversion rate percentage
 */
export const calculateConversionRate = (conversions, totalVisits) => {
  if (totalVisits === 0) return 0;
  return ((conversions / totalVisits) * 100).toFixed(2);
};

/**
 * Calculate average value
 * @param {number[]} values - Array of values
 * @returns {number} Average value
 */
export const calculateAverage = (values) => {
  if (!values || values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return (sum / values.length).toFixed(2);
};

/**
 * Get top performing items
 * @param {object[]} items - Array of items
 * @param {string} metric - Metric to sort by (e.g., 'revenue', 'bookings')
 * @param {number} limit - Number of top items to return
 * @returns {object[]} Top performing items
 */
export const getTopPerformers = (items, metric, limit = 5) => {
  return items
    .sort((a, b) => (b[metric] || 0) - (a[metric] || 0))
    .slice(0, limit);
};

/**
 * Group data by date
 * @param {object[]} data - Array of data objects
 * @param {string} dateField - Name of the date field
 * @returns {object} Data grouped by date
 */
export const groupByDate = (data, dateField = 'date') => {
  return data.reduce((acc, item) => {
    const date = formatDate(item[dateField]);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});
};

/**
 * Calculate total from array of objects
 * @param {object[]} items - Array of objects
 * @param {string} field - Field to sum
 * @returns {number} Total sum
 */
export const calculateTotal = (items, field) => {
  return items.reduce((sum, item) => sum + (item[field] || 0), 0);
};

/**
 * Get trend status (up, down, stable)
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {string} Trend status
 */
export const getTrendStatus = (current, previous) => {
  const change = current - previous;
  if (change > 0) return 'up';
  if (change < 0) return 'down';
  return 'stable';
};

/**
 * Format time duration
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration
 */
export const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};

export default {
  formatNumber,
  formatCurrency,
  calculatePercentageChange,
  formatDate,
  getDateRangeLabel,
  calculateConversionRate,
  calculateAverage,
  getTopPerformers,
  groupByDate,
  calculateTotal,
  getTrendStatus,
  formatDuration,
};
