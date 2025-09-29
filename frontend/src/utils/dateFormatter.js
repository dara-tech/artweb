/**
 * Centralized date formatting utilities
 * All dates should be displayed in DD/MM/YYYY format for consistency
 */

/**
 * Format a date string to DD/MM/YYYY format
 * @param {string|Date} dateString - The date to format
 * @param {string} fallback - Fallback text if date is invalid (default: 'N/A')
 * @returns {string} Formatted date in DD/MM/YYYY format
 */
export const formatDate = (dateString, fallback = 'N/A') => {
  if (!dateString || dateString === '1900-01-01' || dateString === '') {
    return fallback;
  }
  
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return fallback;
    }
    
    // Format as DD/MM/YYYY
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.warn('Date formatting error:', error, 'for date:', dateString);
    return fallback;
  }
};

/**
 * Format a date for display in tables (with special handling for invalid dates)
 * @param {string|Date} dateString - The date to format
 * @returns {string} Formatted date or 'Invalid Date' if parsing fails
 */
export const formatDateForTable = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    
    return formatDate(dateString);
  } catch (error) {
    return 'Invalid Date';
  }
};

/**
 * Format a date range for display
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {string} Formatted date range
 */
export const formatDateRange = (startDate, endDate) => {
  const start = formatDate(startDate, '');
  const end = formatDate(endDate, '');
  
  if (!start || !end) return 'N/A';
  return `${start} - ${end}`;
};

/**
 * Check if a date is valid
 * @param {string|Date} dateString - The date to check
 * @returns {boolean} True if date is valid
 */
export const isValidDate = (dateString) => {
  if (!dateString) return false;
  
  try {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  } catch (error) {
    return false;
  }
};

/**
 * Get current date in DD/MM/YYYY format
 * @returns {string} Current date formatted as DD/MM/YYYY
 */
export const getCurrentDateFormatted = () => {
  return formatDate(new Date());
};

/**
 * Parse a DD/MM/YYYY string back to a Date object
 * @param {string} dateString - Date string in DD/MM/YYYY format
 * @returns {Date|null} Parsed date or null if invalid
 */
export const parseFormattedDate = (dateString) => {
  if (!dateString || typeof dateString !== 'string') return null;
  
  try {
    const [day, month, year] = dateString.split('/');
    if (!day || !month || !year) return null;
    
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return isValidDate(date) ? date : null;
  } catch (error) {
    return null;
  }
};
