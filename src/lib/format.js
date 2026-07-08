/** Display formatting helpers. */

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export const formatMoney = (n) => money.format(n || 0)

/**
 * Format a ratio value according to its declared display format.
 * Returns an em dash for null (undefined ratio, e.g. divide-by-zero).
 */
export function formatRatio(value, format) {
  if (value == null || Number.isNaN(value)) return '—'
  switch (format) {
    case '%':
      return `${(value * 100).toFixed(1)}%`
    case 'x':
      return `${value.toFixed(2)}x`
    case 'days':
      return `${Math.round(value)} days`
    default:
      return value.toFixed(2)
  }
}

export const RATING_LABEL = {
  good: 'Healthy',
  warn: 'Watch',
  bad: 'Concern',
  neutral: 'Info',
}
