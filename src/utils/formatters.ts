
import { formatRupiah, formatPercentage, formatYearDifference } from "./formatters";

/**
 * Format a number with thousand separators
 * @param value Number to format
 * @returns Formatted number string with thousand separators
 */
export function formatNumberWithSeparator(value: number | string): string {
  // Convert to number first to handle string inputs
  const numberValue = typeof value === 'string' ? parseFloat(value.replace(/\./g, '')) : value;
  
  // Use toLocaleString for thousand separators
  return numberValue.toLocaleString('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

// Export existing formatters
export { formatRupiah, formatPercentage, formatYearDifference };

