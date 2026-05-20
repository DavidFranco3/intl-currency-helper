import type { CurrencyOptions, CurrencyInfo } from './types'

export type { CurrencyOptions, CurrencyInfo }

// ─── Global Config ───────────────────────────────────────────────

let globalConfig: Partial<CurrencyOptions> = {
  locale: 'es-MX',
  currency: 'MXN',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  style: 'currency',
  useGrouping: true,
}

export const updateGlobalConfig = (options: Partial<CurrencyOptions>): void => {
  globalConfig = { ...globalConfig, ...options }
}

export const getGlobalConfig = (): Partial<CurrencyOptions> => {
  return { ...globalConfig }
}

export const configure = updateGlobalConfig

// ─── Validation ──────────────────────────────────────────────────

const forceNumber = (
  value: unknown,
  mode: 'throw' | 'zero' | 'passthrough',
): number => {
  const number = Number(value)
  if (isNaN(number)) {
    if (mode === 'zero') return 0
    throw new Error(
      `Invalid input: expected a number, but received ${typeof value} (${value})`,
    )
  }
  return number
}

// ─── Options Normalization ───────────────────────────────────────

const normalizeOptions = (
  options: Partial<CurrencyOptions> = {},
): Partial<CurrencyOptions> => {
  return { ...globalConfig, ...options }
}

const buildFormatter = (
  config: Partial<CurrencyOptions>,
): Intl.NumberFormat => {
  const intlOptions = stripInternalOptions(config)
  return new Intl.NumberFormat(config.locale, intlOptions)
}

const stripInternalOptions = (
  config: Partial<CurrencyOptions>,
): Intl.NumberFormatOptions => {
  const { code: _c, validationMode: _v, locale: _l, ...rest } = config
  return rest as unknown as Intl.NumberFormatOptions
}

// ─── Main Format ─────────────────────────────────────────────────

export const formatCurrency = (
  amount: unknown,
  options: Partial<CurrencyOptions> = {},
): string => {
  const config = normalizeOptions(options)
  const validationMode = config.validationMode ?? 'throw'

  let number: number
  try {
    number = forceNumber(amount, validationMode)
  } catch (e) {
    if (validationMode === 'passthrough') return String(amount)
    throw e
  }

  const formatter = buildFormatter(config)
  let formatted = formatter.format(number)

  if (config.code && config.currency) {
    formatted = `${formatted} ${config.currency}`
  }

  return formatted
}

// ─── Range Formatting ────────────────────────────────────────────

export const formatRange = (
  amount1: unknown,
  amount2: unknown,
  options: Partial<CurrencyOptions> = {},
): string => {
  const config = normalizeOptions(options)
  const a = forceNumber(amount1, 'throw')
  const b = forceNumber(amount2, 'throw')
  const formatter = buildFormatter(config)
  return formatter.formatRange(a, b)
}

// ─── Format Parts ────────────────────────────────────────────────

export const formatParts = (
  amount: unknown,
  options: Partial<CurrencyOptions> = {},
): Intl.NumberFormatPart[] => {
  const config = normalizeOptions(options)
  const number = forceNumber(amount, 'throw')
  const formatter = buildFormatter(config)
  return formatter.formatToParts(number)
}

// ─── Parse Currency ──────────────────────────────────────────────

const detectSeparators = (
  locale: string,
): { decimal: string; group: string } => {
  const parts = new Intl.NumberFormat(locale, {
    style: 'decimal',
    useGrouping: true,
  }).formatToParts(11111.1)

  let decimal = '.'
  let group = ''

  for (const part of parts) {
    if (part.type === 'decimal') decimal = part.value
    if (part.type === 'group') group = part.value
  }

  return { decimal, group }
}

export const parseCurrency = (
  formatted: string,
  options: Partial<CurrencyOptions> = {},
): number => {
  const config = normalizeOptions(options)
  const locale = config.locale ?? 'es-MX'
  const { decimal, group } = detectSeparators(locale)

  let normalized = formatted.trim()

  // Handle accounting format: (100.00) -> -100.00
  if (normalized.startsWith('(') && normalized.endsWith(')')) {
    normalized = '-' + normalized.slice(1, -1)
  }

  // Strip currency code if present
  if (config.currency) {
    normalized = normalized.replace(
      new RegExp(config.currency.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
      '',
    )
  }

  // Remove group separators
  if (group) {
    normalized = normalized.replace(
      new RegExp(group.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
      '',
    )
  }

  // Replace locale decimal with JS decimal
  if (decimal !== '.') {
    normalized = normalized.replace(
      new RegExp(decimal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
      '.',
    )
  }

  // Remove remaining non-numeric (except ., -, digits)
  normalized = normalized.replace(/[^0-9.\-]/g, '').trim()

  // Handle multiple dots (keep only the last one)
  const dotParts = normalized.split('.')
  if (dotParts.length > 2) {
    normalized = dotParts.slice(0, -1).join('') + '.' + dotParts[dotParts.length - 1]
  }

  const result = Number(normalized)
  if (isNaN(result)) {
    throw new Error(`Unable to parse "${formatted}" as a currency value`)
  }

  return result
}

// ─── Shorthand Factory ───────────────────────────────────────────

export const createFormat = (
  currency: string,
  locale?: string,
): ((amount: unknown, options?: Partial<CurrencyOptions>) => string) => {
  return (amount, options = {}) =>
    formatCurrency(amount, { currency, locale, ...options })
}

// ─── Built-in Shorthands ─────────────────────────────────────────

export const formatMXN = createFormat('MXN', 'es-MX')
export const formatUSD = createFormat('USD', 'en-US')
export const formatEUR = createFormat('EUR', 'es-ES')

// ─── Currency Codes ──────────────────────────────────────────────

export const CURRENCIES: Record<string, string> = {
  MXN: 'MXN',
  USD: 'USD',
  EUR: 'EUR',
  GBP: 'GBP',
  CAD: 'CAD',
  JPY: 'JPY',
  BRL: 'BRL',
  ARS: 'ARS',
  CLP: 'CLP',
  COP: 'COP',
  PEN: 'PEN',
  UYU: 'UYU',
  AUD: 'AUD',
  NZD: 'NZD',
  CHF: 'CHF',
  CNY: 'CNY',
  KRW: 'KRW',
  INR: 'INR',
  RUB: 'RUB',
  SEK: 'SEK',
  NOK: 'NOK',
  DKK: 'DKK',
  TRY: 'TRY',
  ZAR: 'ZAR',
  SGD: 'SGD',
  HKD: 'HKD',
  TWD: 'TWD',
  THB: 'THB',
  ILS: 'ILS',
  PLN: 'PLN',
  CZK: 'CZK',
  HUF: 'HUF',
  VND: 'VND',
  PHP: 'PHP',
  MYR: 'MYR',
  IDR: 'IDR',
}

// ─── Locales ─────────────────────────────────────────────────────

export const LOCALES: Record<string, string> = {
  MX: 'es-MX',
  US: 'en-US',
  ES: 'es-ES',
  GB: 'en-GB',
  JP: 'ja-JP',
  AR: 'es-AR',
  CL: 'es-CL',
  CO: 'es-CO',
  PE: 'es-PE',
  UY: 'es-UY',
  BR: 'pt-BR',
  DE: 'de-DE',
  FR: 'fr-FR',
  IT: 'it-IT',
  PT: 'pt-PT',
  CN: 'zh-CN',
  KR: 'ko-KR',
  IN: 'hi-IN',
  RU: 'ru-RU',
  SE: 'sv-SE',
  NO: 'nb-NO',
  DK: 'da-DK',
  TR: 'tr-TR',
  ZA: 'en-ZA',
  SG: 'en-SG',
  HK: 'zh-HK',
  TW: 'zh-TW',
  TH: 'th-TH',
  IL: 'he-IL',
  PL: 'pl-PL',
  CZ: 'cs-CZ',
  HU: 'hu-HU',
  VN: 'vi-VN',
  PH: 'en-PH',
  MY: 'ms-MY',
  ID: 'id-ID',
}

// ─── Currency Metadata ───────────────────────────────────────────

export const CURRENCY_DATA: Record<string, CurrencyInfo> = {
  MXN: { code: 'MXN', symbol: '$', name: 'Mexican Peso', locale: 'es-MX', fractionDigits: 2 },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US', fractionDigits: 2 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', locale: 'es-ES', fractionDigits: 2 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB', fractionDigits: 2 },
  CAD: { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', locale: 'en-CA', fractionDigits: 2 },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP', fractionDigits: 0 },
  BRL: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', locale: 'pt-BR', fractionDigits: 2 },
  ARS: { code: 'ARS', symbol: '$', name: 'Argentine Peso', locale: 'es-AR', fractionDigits: 2 },
  CLP: { code: 'CLP', symbol: '$', name: 'Chilean Peso', locale: 'es-CL', fractionDigits: 0 },
  COP: { code: 'COP', symbol: '$', name: 'Colombian Peso', locale: 'es-CO', fractionDigits: 2 },
  PEN: { code: 'PEN', symbol: 'S/', name: 'Peruvian Sol', locale: 'es-PE', fractionDigits: 2 },
  UYU: { code: 'UYU', symbol: '$', name: 'Uruguayan Peso', locale: 'es-UY', fractionDigits: 2 },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU', fractionDigits: 2 },
  NZD: { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', locale: 'en-NZ', fractionDigits: 2 },
  CHF: { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', locale: 'de-CH', fractionDigits: 2 },
  CNY: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', locale: 'zh-CN', fractionDigits: 2 },
  KRW: { code: 'KRW', symbol: '₩', name: 'South Korean Won', locale: 'ko-KR', fractionDigits: 0 },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'hi-IN', fractionDigits: 2 },
  RUB: { code: 'RUB', symbol: '₽', name: 'Russian Ruble', locale: 'ru-RU', fractionDigits: 2 },
  SEK: { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', locale: 'sv-SE', fractionDigits: 2 },
  NOK: { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', locale: 'nb-NO', fractionDigits: 2 },
  DKK: { code: 'DKK', symbol: 'kr', name: 'Danish Krone', locale: 'da-DK', fractionDigits: 2 },
  TRY: { code: 'TRY', symbol: '₺', name: 'Turkish Lira', locale: 'tr-TR', fractionDigits: 2 },
  ZAR: { code: 'ZAR', symbol: 'R', name: 'South African Rand', locale: 'en-ZA', fractionDigits: 2 },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', locale: 'en-SG', fractionDigits: 2 },
  HKD: { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', locale: 'zh-HK', fractionDigits: 2 },
  TWD: { code: 'TWD', symbol: 'NT$', name: 'New Taiwan Dollar', locale: 'zh-TW', fractionDigits: 2 },
  THB: { code: 'THB', symbol: '฿', name: 'Thai Baht', locale: 'th-TH', fractionDigits: 2 },
  ILS: { code: 'ILS', symbol: '₪', name: 'Israeli Shekel', locale: 'he-IL', fractionDigits: 2 },
  PLN: { code: 'PLN', symbol: 'zł', name: 'Polish Zloty', locale: 'pl-PL', fractionDigits: 2 },
  CZK: { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna', locale: 'cs-CZ', fractionDigits: 2 },
  HUF: { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint', locale: 'hu-HU', fractionDigits: 2 },
  VND: { code: 'VND', symbol: '₫', name: 'Vietnamese Dong', locale: 'vi-VN', fractionDigits: 0 },
  PHP: { code: 'PHP', symbol: '₱', name: 'Philippine Peso', locale: 'en-PH', fractionDigits: 2 },
  MYR: { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', locale: 'ms-MY', fractionDigits: 2 },
  IDR: { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', locale: 'id-ID', fractionDigits: 2 },
}

export default formatCurrency
