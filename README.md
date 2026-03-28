# Intl Currency Helper

A lightweight, zero-dependency JavaScript library for formatting numbers to currency strings using the native `Intl.NumberFormat` API. Compatible with both **Node.js** and **React**.

## Features

- 📂 **Universal**: Works in the browser and Node.js.
- 🇲🇽 **Smart Defaults**: Pre-configured for Mexican Peso (`MXN`) and Spanish (Mexico) (`es-MX`).
- 🛠️ **Customizable**: Easy to override currency, locale, and decimal precision.
- 🧪 **Safe**: Includes input validation.

## Installation

```bash
# If you published it to NPM
npm install intl-currency-helper
```

Or just copy the files into your project.

## Usage

### Basic Usage (ES Modules)

```javascript
import { formatCurrency } from './index.js';

// Default: MXN / es-MX
console.log(formatCurrency(1234.56)); // Output: "$1,234.56"
console.log(formatCurrency("100"));    // Output: "$100.00"
```

### Advanced Usage

You can customize the formatting by passing an options object.

```javascript
import { formatCurrency, CURRENCIES, LOCALES } from './index.js';

// US Dollars
formatCurrency(1234.56, { 
  currency: CURRENCIES.USD, 
  locale: LOCALES.US 
}); 
// Output: "$1,234.56"

// Euros in Spain
formatCurrency(1234.56, { 
  currency: CURRENCIES.EUR, 
  locale: LOCALES.ES 
}); 
// Output: "1.234,56 €"

// No decimals
formatCurrency(1234.56, { 
  minimumFractionDigits: 0, 
  maximumFractionDigits: 0 
}); 
// Output: "$1,235"
```

## API

### `formatCurrency(amount, options)`

| Argument | Type | Description |
| :--- | :--- | :--- |
| `amount` | `Number`\|`String` | The value to format. |
| `options` | `Object` | (Optional) Configuration object. |

#### Options
- `locale` (String): BCP 47 language tag (default: `'es-MX'`).
- `currency` (String): ISO 4217 currency code (default: `'MXN'`).
- `minimumFractionDigits` (Number): Default `2`.
- `maximumFractionDigits` (Number): Default `2`.
- `useGrouping` (Boolean): Whether to use thousand separators (default: `true`).

## License

MIT
