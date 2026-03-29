/**
 * Options for currency formatting.
 */
export interface CurrencyOptions {
  /** The locale to use for formatting (e.g., 'es-MX', 'en-US'). */
  locale?: string;
  /** The currency code to use (e.g., 'MXN', 'USD'). */
  currency?: string;
  /** The minimum number of fraction digits to use. */
  minimumFractionDigits?: number;
  /** The maximum number of fraction digits to use. */
  maximumFractionDigits?: number;
  /** The formatting style to use. Default is 'currency'. */
  style?: 'currency' | 'decimal' | 'percent' | 'unit';
  /** Whether to use grouping separators, such as thousands separators. */
  useGrouping?: boolean;
  /** Whether to append the currency code at the end of the formatted string. */
  code?: boolean;
}

/**
 * Updates the global configuration for all formatting calls.
 * @param options - Options to set as default.
 */
export function configure(options: Partial<CurrencyOptions>): void;

/**
 * Formats a number into a currency string using Intl.NumberFormat.
 * @param amount - The numeric value to format.
 * @param options - Optional configuration.
 * @returns The formatted currency string.
 */
export function formatCurrency(amount: number | string, options?: Partial<CurrencyOptions>): string;

/**
 * Shorthand for Mexican Peso (MXN)
 * @param amount - The numeric value to format.
 * @param options - Optional configuration.
 * @returns The formatted currency string.
 */
export function formatMXN(amount: number | string, options?: Partial<CurrencyOptions>): string;

/**
 * Shorthand for US Dollar (USD)
 * @param amount - The numeric value to format.
 * @param options - Optional configuration.
 * @returns The formatted currency string.
 */
export function formatUSD(amount: number | string, options?: Partial<CurrencyOptions>): string;

/**
 * Shorthand for Euro (EUR)
 * @param amount - The numeric value to format.
 * @param options - Optional configuration.
 * @returns The formatted currency string.
 */
export function formatEUR(amount: number | string, options?: Partial<CurrencyOptions>): string;

/**
 * Common currency codes for easy reference.
 */
export const CURRENCIES: {
  MXN: string;
  USD: string;
  EUR: string;
  GBP: string;
  CAD: string;
  JPY: string;
};

/**
 * Common locales for easy reference.
 */
export const LOCALES: {
  MX: string;
  US: string;
  ES: string;
  GB: string;
  JP: string;
};

export default formatCurrency;
