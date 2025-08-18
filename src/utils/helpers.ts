export const removeSpaces = (str: string): string => str.replace(/\s+/g, '');

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Formats a number as a dollar amount with proper currency formatting
 * @param value - The number to format (can be number, string, or null/undefined)
 * @param options - Formatting options
 * @returns Formatted dollar string (e.g., "$12.34", "$1,234.56")
 */
export const formatDollar = (
  value: number | string | null | undefined,
  options: {
    showCents?: boolean;
    showSymbol?: boolean;
  } = {},
): string => {
  const { showCents = true, showSymbol = true } = options;

  // Handle null, undefined, or empty string
  if (value === null || value === undefined || value === '') {
    return showSymbol ? '$0.00' : '0.00';
  }

  // Convert to number if it's a string
  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  // Handle invalid numbers
  if (isNaN(numValue)) {
    return showSymbol ? '$0.00' : '0.00';
  }

  // Check if the value is already formatted as a dollar string
  if (typeof value === 'string' && value.startsWith('$')) {
    // If it's already formatted and matches our expected format, return as is
    const dollarRegex = /^\$[\d,]+(\.\d{2})?$/;
    if (dollarRegex.test(value)) {
      return showSymbol ? value : value.slice(1);
    }
  }

  // Format the number
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  });

  const formatted = formatter.format(numValue);

  // Return with or without the dollar symbol
  return showSymbol ? formatted : formatted.slice(1);
};
