
/**
 * Utility functions for formatting values in the BerapaNanti app
 */

/**
 * Format a number as Indonesian Rupiah
 * @param value Number to format
 * @returns Formatted rupiah string
 */
export function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format a number as a percentage
 * @param value Number to format as percentage
 * @param decimals Number of decimal places
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return value.toLocaleString('id-ID', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format a year as a "5 tahun yang lalu" or "dalam 3 tahun" type string
 * @param year Year to convert to relative string
 * @param currentYear Reference current year
 * @returns Formatted year string
 */
export function formatYearDifference(year: number, currentYear: number = new Date().getFullYear()): string {
  const diff = year - currentYear;
  
  if (diff === 0) {
    return 'tahun ini';
  } else if (diff < 0) {
    const years = Math.abs(diff);
    return `${years} tahun yang lalu`;
  } else {
    return `dalam ${diff} tahun`;
  }
}

/**
 * Format a number with thousand separators
 * @param value Number to format
 * @returns Formatted number string with thousand separators
 */
export function formatNumberWithSeparator(value: number | string): string {
  // Convert to number first to handle string inputs
  const numberValue = typeof value === 'string' ? parseFloat(value.replace(/\./g, '').replace(/,/g, '.') || '0') : value;
  
  // Use toLocaleString for thousand separators
  return numberValue.toLocaleString('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}
