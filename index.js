import { validateNumber, normalizeOptions, updateGlobalConfig } from './utils.js';

/**
 * Updates the global configuration for all formatting calls.
 * @param {object} options - Options to set as default.
 */
export const configure = (options) => {
  updateGlobalConfig(options);
};

/**
 * Formats a number into a currency string using Intl.NumberFormat.
 * 
 * @param {number|string} amount - The numeric value to format.
 * @param {object} [options] - Optional configuration.
 * @returns {string} The formatted currency string.
 */
export const formatCurrency = (amount, options = {}) => {
  const number = validateNumber(amount);
  const config = normalizeOptions(options);

  return new Intl.NumberFormat(config.locale, config).format(number);
};

/**
 * Shorthand for Mexican Peso (MXN)
 */
export const formatMXN = (amount, options = {}) => {
  return formatCurrency(amount, { currency: 'MXN', locale: 'es-MX', ...options });
};

/**
 * Shorthand for US Dollar (USD)
 */
export const formatUSD = (amount, options = {}) => {
  return formatCurrency(amount, { currency: 'USD', locale: 'en-US', ...options });
};

/**
 * Shorthand for Euro (EUR)
 */
export const formatEUR = (amount, options = {}) => {
  return formatCurrency(amount, { currency: 'EUR', locale: 'es-ES', ...options });
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
