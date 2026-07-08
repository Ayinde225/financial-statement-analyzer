/**
 * The financial-statement data model.
 *
 * We ask for the minimal set of line items needed to compute standard ratios.
 * Subtotals that can be derived (gross profit, EBIT) are computed, not entered,
 * so the inputs can't contradict themselves.
 */

/** Input line items, grouped by statement, in display order. */
export const LINE_ITEMS = [
  // Income statement
  { key: 'revenue', label: 'Revenue', statement: 'income' },
  { key: 'cogs', label: 'Cost of goods sold', statement: 'income' },
  { key: 'operatingExpenses', label: 'Operating expenses', statement: 'income' },
  { key: 'interestExpense', label: 'Interest expense', statement: 'income' },
  { key: 'netIncome', label: 'Net income', statement: 'income' },
  // Balance sheet
  { key: 'cash', label: 'Cash & equivalents', statement: 'balance' },
  { key: 'accountsReceivable', label: 'Accounts receivable', statement: 'balance' },
  { key: 'inventory', label: 'Inventory', statement: 'balance' },
  { key: 'currentAssets', label: 'Total current assets', statement: 'balance' },
  { key: 'totalAssets', label: 'Total assets', statement: 'balance' },
  { key: 'currentLiabilities', label: 'Total current liabilities', statement: 'balance' },
  { key: 'totalLiabilities', label: 'Total liabilities', statement: 'balance' },
  { key: 'totalEquity', label: "Total shareholders' equity", statement: 'balance' },
]

export const INCOME_ITEMS = LINE_ITEMS.filter((i) => i.statement === 'income')
export const BALANCE_ITEMS = LINE_ITEMS.filter((i) => i.statement === 'balance')

/** An all-zero statement, used as the initial form state. */
export function emptyStatement() {
  return Object.fromEntries(LINE_ITEMS.map((i) => [i.key, 0]))
}

/**
 * Normalize raw input (strings from a form, or parsed CSV) into numbers, and
 * attach derived subtotals.
 */
export function normalize(raw) {
  const data = {}
  for (const { key } of LINE_ITEMS) {
    data[key] = Number(raw?.[key]) || 0
  }
  data.grossProfit = data.revenue - data.cogs
  data.operatingIncome = data.grossProfit - data.operatingExpenses // EBIT
  return data
}
