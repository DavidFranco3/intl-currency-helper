import { 
  formatCurrency, 
  formatMXN, 
  formatUSD, 
  formatEUR, 
  configure, 
  CURRENCIES, 
  LOCALES 
} from './index.js';

const tests = [
  {
    name: 'Default formatting (MXN / es-MX)',
    input: 1234.56,
    expected: '$1,234.56',
  },
  {
    name: 'Shorthand formatMXN',
    fn: () => formatMXN(1234.56),
    expected: '$1,234.56',
  },
  {
    name: 'Shorthand formatUSD',
    fn: () => formatUSD(1234.56),
    expected: '$1,234.56',
  },
  {
    name: 'Shorthand formatEUR',
    fn: () => formatEUR(1234.56),
    expected: '1.234,56\u00A0€',
  },
  {
    name: 'Global configuration (Change default to USD)',
    fn: () => {
      configure({ currency: 'USD', locale: 'en-US' });
      return formatCurrency(100);
    },
    expected: '$100.00',
  },
  {
    name: 'Shorthand with extra options (No decimals)',
    fn: () => formatUSD(100, { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
    expected: '$100',
  },
  {
    name: 'Show currency code (with curly braces)',
    fn: () => formatMXN(100, { code: true }),
    expected: '$100.00 MXN',
  },
  {
    name: 'Explicitly hide code (with curly braces)',
    fn: () => formatUSD(100, { code: false }),
    expected: '$100.00',
  }
];

let passed = 0;
let total = tests.length;

console.log('--- Starting Simplification Tests ---\n');

tests.forEach(test => {
  try {
    const result = test.fn ? test.fn() : formatCurrency(test.input, test.options);
    const normalizedResult = result.replace(/\u00A0/g, ' ').trim();
    const normalizedExpected = test.expected.replace(/\u00A0/g, ' ').trim();

    if (normalizedResult === normalizedExpected || normalizedResult.includes(normalizedExpected)) {
      console.log(`✅ [PASS] ${test.name}`);
      passed++;
    } else {
      console.log(`❌ [FAIL] ${test.name}`);
      console.log(`   Expected: ${test.expected}`);
      console.log(`   Received: ${result}`);
    }
  } catch (error) {
    console.log(`❌ [ERROR] ${test.name}: ${error.message}`);
  }
});

console.log(`\n--- Summary: ${passed}/${total} passed ---`);

if (passed === total) {
  process.exit(0);
} else {
  process.exit(1);
}
