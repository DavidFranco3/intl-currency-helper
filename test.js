import { formatCurrency, CURRENCIES, LOCALES } from './index.js';

const tests = [
  {
    name: 'Default formatting (MXN / es-MX)',
    input: 1234.56,
    expected: '$1,234.56', // Note: specific spacing can vary by environment, we'll check contains
  },
  {
    name: 'USD / en-US',
    input: 1234.56,
    options: { currency: CURRENCIES.USD, locale: LOCALES.US },
    expected: '$1,234.56',
  },
  {
    name: 'EUR / es-ES',
    input: 1234.56,
    options: { currency: CURRENCIES.EUR, locale: LOCALES.ES },
    expected: '1.234,56\u00A0€', // Note: \u00A0 is non-breaking space
  },
  {
    name: 'Negative number',
    input: -500,
    expected: '-$500.00',
  },
  {
    name: 'Zero',
    input: 0,
    expected: '$0.00',
  },
  {
    name: 'String input',
    input: "99.99",
    expected: '$99.99',
  }
];

let passed = 0;
let total = tests.length;

console.log('--- Starting Tests ---\n');

tests.forEach(test => {
  try {
    const result = formatCurrency(test.input, test.options);
    // Use includes/regex/normalize to avoid tiny formatting discrepancies in different environments (like nbsp)
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

// Error handling test
console.log('\n--- Error Handling Test ---');
try {
  formatCurrency('not-a-number');
  console.log('❌ [FAIL] Should have thrown an error for invalid input');
} catch (error) {
  console.log('✅ [PASS] Threw error for invalid input: ' + error.message);
}

console.log(`\n--- Summary: ${passed}/${total} passed ---`);

if (passed === total) {
  process.exit(0);
} else {
  process.exit(1);
}
