const amount = 100;
const locale = 'es-MX';
const currency = 'MXN';

console.log('Default (symbol):', new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount));
console.log('Display code:', new Intl.NumberFormat(locale, { style: 'currency', currency, currencyDisplay: 'code' }).format(amount));
console.log('Display narrowSymbol:', new Intl.NumberFormat(locale, { style: 'currency', currency, currencyDisplay: 'narrowSymbol' }).format(amount));
console.log('Display name:', new Intl.NumberFormat(locale, { style: 'currency', currency, currencyDisplay: 'name' }).format(amount));
