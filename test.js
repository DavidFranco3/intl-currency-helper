import {
  formatCurrency,
  formatMXN,
  formatUSD,
  formatEUR,
  configure,
  getGlobalConfig,
  CURRENCIES,
  LOCALES,
  CURRENCY_DATA,
  createFormat,
  formatRange,
  formatParts,
  parseCurrency,
  updateGlobalConfig,
} from './dist/index.js'

const assert = (condition, msg) => {
  if (!condition) throw new Error(`FAIL: ${msg}`)
}

let _testName = ''
const test = (name, fn) => {
  _testName = name
  total++
  try {
    fn()
    passed++
    console.log(`  ✅ ${name}`)
  } catch (e) {
    console.log(`  ❌ ${name}: ${e.message}`)
  }
}

const assertEqual = (actual, expected, msg) => {
  const normalize = (s) => String(s).replace(/\u00A0/g, ' ').trim()
  if (normalize(actual) !== normalize(expected)) {
    console.log(`     Expected: ${JSON.stringify(expected)}`)
    console.log(`     Received: ${JSON.stringify(actual)}`)
    throw new Error(msg ?? 'values differ')
  }
}

// Reset global config before tests
updateGlobalConfig({
  locale: 'es-MX',
  currency: 'MXN',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  style: 'currency',
  useGrouping: true,
})

let passed = 0
let total = 0

// ─── Legacy / Backward Compat ────────────────────────────────────
console.log('\n━━━ Legacy / Backward Compatibility ━━━\n')

test('Default MXN formatting', () => {
  assertEqual(formatCurrency(1234.56), '$1,234.56')
})

test('formatMXN shorthand', () => {
  assertEqual(formatMXN(1234.56), '$1,234.56')
})

test('formatUSD shorthand', () => {
  assertEqual(formatUSD(1234.56), '$1,234.56')
})

test('formatEUR shorthand', () => {
  assertEqual(formatEUR(1234.56), '1.234,56 €')
})

test('configure + global config', () => {
  configure({ currency: 'USD', locale: 'en-US' })
  const g = getGlobalConfig()
  assert(g.currency === 'USD', 'global currency is USD')
  assertEqual(formatCurrency(100), '$100.00')
  // Reset
  configure({ currency: 'MXN', locale: 'es-MX' })
})

test('extra options (no decimals)', () => {
  assertEqual(formatUSD(100, { minimumFractionDigits: 0, maximumFractionDigits: 0 }), '$100')
})

test('code option appends currency', () => {
  assertEqual(formatMXN(100, { code: true }), '$100.00 MXN')
})

test('code false hides currency', () => {
  assertEqual(formatUSD(100, { code: false }), '$100.00')
})

test('CURRENCIES and LOCALES constants', () => {
  assert(CURRENCIES.MXN === 'MXN', 'CURRENCIES.MXN')
  assert(LOCALES.MX === 'es-MX', 'LOCALES.MX')
})

// ─── New Intl.NumberFormat options ───────────────────────────────
console.log('\n━━━ New Intl.NumberFormat Options ━━━\n')

test('currencyDisplay: code', () => {
  assertEqual(
    formatCurrency(100, { currency: 'USD', locale: 'en-US', currencyDisplay: 'code', minimumFractionDigits: 0 }),
    'USD 100',
  )
})

test('currencyDisplay: name', () => {
  const r = formatCurrency(100, { currency: 'USD', locale: 'en-US', currencyDisplay: 'name', minimumFractionDigits: 0 })
  assert(r.includes('US dollars'), `got "${r}"`)
})

test('currencyDisplay: narrowSymbol', () => {
  // narrowSymbol may be same as symbol for USD
  const r = formatCurrency(100, { currency: 'USD', locale: 'en-US', currencyDisplay: 'narrowSymbol', minimumFractionDigits: 0 })
  assert(r.includes('$'), `got "${r}"`)
})

test('currencySign: accounting (negative)', () => {
  const r = formatCurrency(-100, { currency: 'USD', locale: 'en-US', currencySign: 'accounting', minimumFractionDigits: 0 })
  assert(r === '($100)', `got "${r}"`)
})

test('signDisplay: always', () => {
  assertEqual(
    formatCurrency(100, { currency: 'USD', locale: 'en-US', signDisplay: 'always', minimumFractionDigits: 0 }),
    '+$100',
  )
})

test('signDisplay: never', () => {
  assertEqual(
    formatCurrency(-100, { currency: 'USD', locale: 'en-US', signDisplay: 'never', minimumFractionDigits: 0 }),
    '$100',
  )
})

test('signDisplay: exceptZero', () => {
  assertEqual(
    formatCurrency(0, { currency: 'USD', locale: 'en-US', signDisplay: 'exceptZero', minimumFractionDigits: 0 }),
    '$0',
  )
})

test('trailingZeroDisplay: stripIfInteger', () => {
  assertEqual(
    formatCurrency(100, { currency: 'USD', locale: 'en-US', trailingZeroDisplay: 'stripIfInteger', minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    '$100',
  )
})

test('roundingMode: ceil (round up)', () => {
  assertEqual(
    formatCurrency(1.001, { currency: 'USD', locale: 'en-US', roundingMode: 'ceil', minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    '$1.01',
  )
})

test('roundingMode: floor (round down)', () => {
  assertEqual(
    formatCurrency(1.009, { currency: 'USD', locale: 'en-US', roundingMode: 'floor', minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    '$1.00',
  )
})

// ─── createFormat ────────────────────────────────────────────────
console.log('\n━━━ createFormat Factory ─━━\n')

test('createFormat basic', () => {
  const formatARS = createFormat('ARS', 'es-AR')
  const r = formatARS(1500)
  // es-AR adds a non-breaking space after $
  assert(r.replace(/\u00A0/g, ' ').includes('$'), 'includes $')
  assert(r.includes('1.500'), 'includes 1.500')
})

test('createFormat with overrides', () => {
  const formatGBP = createFormat('GBP', 'en-GB')
  assertEqual(formatGBP(50, { minimumFractionDigits: 0 }), '£50')
})

// ─── formatRange ─────────────────────────────────────────────────
console.log('\n━━━ formatRange ━━━\n')

test('formatRange basic', () => {
  const r = formatRange(100, 200, { currency: 'USD', locale: 'en-US', minimumFractionDigits: 0 })
  assert(r.includes('100') && r.includes('200'), `got "${r}"`)
})

// ─── formatParts ─────────────────────────────────────────────────
console.log('\n━━━ formatParts ━━━\n')

test('formatParts returns array of parts', () => {
  const parts = formatParts(100, { currency: 'USD', locale: 'en-US', minimumFractionDigits: 0 })
  assert(Array.isArray(parts), 'parts is array')
  const types = parts.map((p) => p.type)
  assert(types.includes('currency'), `types ${types} should include currency`)
  assert(types.includes('integer'), `types ${types} should include integer`)
})

// ─── parseCurrency ───────────────────────────────────────────────
console.log('\n━━━ parseCurrency ━━━\n')

test('parseCurrency simple USD', () => {
  assertEqual(parseCurrency('$1,234.56', { locale: 'en-US' }), 1234.56)
})

test('parseCurrency with currency code', () => {
  assertEqual(parseCurrency('$100.00 USD', { locale: 'en-US', currency: 'USD' }), 100)
})

test('parseCurrency European format', () => {
  assertEqual(parseCurrency('1.234,56 €', { locale: 'es-ES' }), 1234.56)
})

test('parseCurrency accounting format (parentheses)', () => {
  assertEqual(parseCurrency('($500)', { locale: 'en-US', currency: 'USD' }), -500)
})

test('parseCurrency negative sign', () => {
  assertEqual(parseCurrency('-$500.00', { locale: 'en-US' }), -500)
})

test('parseCurrency zero fraction digits (JPY)', () => {
  assertEqual(parseCurrency('¥1,235', { locale: 'ja-JP', currency: 'JPY' }), 1235)
})

// ─── validationMode ──────────────────────────────────────────────
console.log('\n━━━ validationMode ━━━\n')

test('validationMode: throw (default)', () => {
  try {
    formatCurrency('not-a-number')
    assert(false, 'should have thrown')
  } catch {
    assert(true, 'threw as expected')
  }
})

test('validationMode: zero', () => {
  assertEqual(
    formatCurrency('invalid', { currency: 'USD', locale: 'en-US', validationMode: 'zero', minimumFractionDigits: 0 }),
    '$0',
  )
})

test('validationMode: passthrough', () => {
  assertEqual(
    formatCurrency('N/A', { currency: 'USD', locale: 'en-US', validationMode: 'passthrough', minimumFractionDigits: 0 }),
    'N/A',
  )
})

// ─── CURRENCY_DATA ───────────────────────────────────────────────
console.log('\n━━━ CURRENCY_DATA ━━━\n')

test('CURRENCY_DATA has entries', () => {
  assert(CURRENCY_DATA.USD !== undefined, 'USD exists')
  assert(CURRENCY_DATA.MXN !== undefined, 'MXN exists')
  assert(CURRENCY_DATA.JPY.fractionDigits === 0, 'JPY has 0 fraction digits')
  assert(CURRENCY_DATA.EUR.symbol === '€', 'EUR symbol is €')
})

// ─── Summary ─────────────────────────────────────────────────────
console.log(`\n━━━ Summary: ${passed}/${total} passed ━━━\n`)
process.exit(passed === total ? 0 : 1)
