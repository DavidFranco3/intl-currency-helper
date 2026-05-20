import { useMemo } from 'react'
import { formatCurrency } from './index'
import type { CurrencyOptions } from './types'

export { formatCurrency }
export type { CurrencyOptions }

export const useCurrencyFormat = (
  amount: number | string,
  options?: Partial<CurrencyOptions>,
): string => {
  return useMemo(
    () => formatCurrency(amount, options),
    [amount, JSON.stringify(options)],
  )
}
