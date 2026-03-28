# Intl Currency Helper

A lightweight, zero-dependency JavaScript library for formatting numbers to currency strings using the native `Intl.NumberFormat` API. Compatible with both **Node.js** and **React**.

## Features

- 📂 **Universal**: Works in the browser and Node.js.
- 🇲🇽 **Smart Defaults**: Pre-configured for Mexican Peso (`MXN`) and Spanish (Mexico) (`es-MX`).
- ⚡ **Zero-config Shorthands**: Fast functions like `formatUSD()` and `formatMXN()`.
- ⚙️ **Global Config**: Set your preferences once and use them everywhere.
- 🛠️ **Customizable**: Easy to override currency, locale, and decimal precision.
- 🧪 **Safe**: Includes input validation.

## Installation

```bash
npm install intl-currency-helper
```

## Usage

### 🚀 Shorthand Functions (The Easiest Way)

If you just need common currencies, use these dedicated functions:

```javascript
import { formatMXN, formatUSD, formatEUR } from 'intl-currency-helper';

formatMXN(1234.56); // "$1,234.56"
formatUSD(1234.56); // "$1,234.56" (en-US)
formatEUR(1234.56); // "1.234,56 €" (es-ES)

// You can still pass extra options if needed:
formatUSD(100, { minimumFractionDigits: 0 }); // "$100"

// Show the currency code at the end using an object:
formatMXN(1234.56, { code: true }); // "$1,234.56 MXN"
formatUSD(1234.56, { code: true }); // "$1,234.56 USD"
```

### ⚙️ Global Configuration

Set your default currency and locale once (e.g., in your `App.js` or entry point) and stop passing options!

```javascript
import { configure, formatCurrency } from 'intl-currency-helper';

// Configure once
configure({ 
  currency: 'CLP', 
  locale: 'es-CL' 
});

// Now formatCurrency uses CLP by default!
formatCurrency(5000); // "$5.000"
```

### 🛠️ Advanced Usage (Custom)

```javascript
import { formatCurrency, CURRENCIES, LOCALES } from 'intl-currency-helper';

formatCurrency(1234.56, { 
  currency: CURRENCIES.JPY, 
  locale: LOCALES.JP 
}); 
// Output: "￥1,235"
```

## API

### Shorthands
- `formatMXN(amount, options)`
- `formatUSD(amount, options)`
- `formatEUR(amount, options)`

### Core
- `formatCurrency(amount, options)`
- `configure(options)`: Sets global defaults for all subsequent calls.

#### Options
- `locale` (String): BCP 47 language tag.
- `currency` (String): ISO 4217 currency code.
- `code` (Boolean): If `true`, appends the ISO currency code at the end (e.g., "$100.00 MXN").
- `minimumFractionDigits` (Number): Default `2`.
- `maximumFractionDigits` (Number): Default `2`.
- `useGrouping` (Boolean): Default `true`.

## License

MIT
