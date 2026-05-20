export interface CurrencyOptions {
  locale?: string
  currency?: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  minimumIntegerDigits?: number
  style?: 'currency' | 'decimal' | 'percent' | 'unit'
  useGrouping?: boolean
  code?: boolean
  currencyDisplay?: 'symbol' | 'code' | 'name' | 'narrowSymbol'
  currencySign?: 'standard' | 'accounting'
  signDisplay?: 'auto' | 'always' | 'never' | 'exceptZero'
  roundingMode?: 'ceil' | 'floor' | 'expand' | 'trunc' | 'halfCeil' | 'halfFloor' | 'halfExpand' | 'halfTrunc' | 'halfEven'
  trailingZeroDisplay?: 'auto' | 'stripIfInteger'
  validationMode?: 'throw' | 'zero' | 'passthrough'
}

export interface CurrencyInfo {
  code: string
  symbol: string
  name: string
  locale: string
  fractionDigits: number
}
