import { validateNumber, normalizeOptions } from './utils.js';

/**
 * Formats a number into a currency string using Intl.NumberFormat.
 * 
 * @param {number|string} amount - The numeric value to format.
 * @param {object} [options] - Optional configuration.
 * @param {string} [options.locale='es-MX'] - The BCP 47 language tag (e.g., 'es-MX', 'en-US').
 * @param {string} [options.currency='MXN'] - The ISO 4217 currency code (e.g., 'MXN', 'USD', 'EUR').
 * @param {number} [options.minimumFractionDigits=2] - Minimum number of decimal places.
 * @param {number} [options.maximumFractionDigits=2] - Maximum number of decimal places.
 * @param {boolean} [options.useGrouping=true] - Whether to use thousand separators.
 * @returns {string} The formatted currency string.
 * @example
 * formatCurrency(1234.56) // "$1,234.56" (default MXN)
 * formatCurrency(1234.56, { currency: 'USD', locale: 'en-US' }) // "$1,234.56"
 */
export const formatCurrency = (amount, options = {}) => {
  const number = validateNumber(amount);
  const config = normalizeOptions(options);

  return new Intl.NumberFormat(config.locale, config).format(number);
};

/**
 * Common currency codes for easy reference.
 */
export const CURRENCIES = {
  MXN: 'MXN',
  USD: 'USD',
  EUR: 'EUR',
  GBP: 'GBP',
  CAD: 'CAD',
  JPY: 'JPY',
};

/**
 * Common locales for easy reference.
 */
export const LOCALES = {
  MX: 'es-MX',
  US: 'en-US',
  ES: 'es-ES',
  GB: 'en-GB',
  JP: 'ja-JP',
};

export default formatCurrency;
