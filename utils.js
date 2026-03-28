/**
 * Validates if the input is a valid number.
 * @param {any} value - The value to validate.
 * @returns {number} The validated number.
 * @throws {Error} if the value is not a valid number.
 */
export const validateNumber = (value) => {
  const number = Number(value);
  if (isNaN(number)) {
    throw new Error(`Invalid input: expected a number, but received ${typeof value} (${value})`);
  }
  return number;
};

let globalConfig = {
  locale: 'es-MX',
  currency: 'MXN',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  style: 'currency',
  useGrouping: true,
};

/**
 * Updates the global configuration for all calls.
 * @param {object} options - New default options.
 */
export const updateGlobalConfig = (options) => {
  globalConfig = { ...globalConfig, ...options };
};

/**
 * Normalizes options for Intl.NumberFormat using global configuration.
 * @param {object} options - User-provided options.
 * @returns {object} Normalized options.
 */
export const normalizeOptions = (options = {}) => {
  return { ...globalConfig, ...options };
};
