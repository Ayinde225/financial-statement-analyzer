/**
 * A sample company ("Acme Manufacturing") used for the "Load sample" button and
 * as a demo of a moderately-leveraged, profitable business. Figures in USD.
 */
export const SAMPLE_COMPANY = {
  name: 'Acme Manufacturing (sample)',
  data: {
    revenue: 4200000,
    cogs: 2730000,
    operatingExpenses: 840000,
    interestExpense: 95000,
    netIncome: 385000,
    cash: 310000,
    accountsReceivable: 520000,
    inventory: 640000,
    currentAssets: 1620000,
    totalAssets: 3950000,
    currentLiabilities: 910000,
    totalLiabilities: 2150000,
    totalEquity: 1800000,
  },
}

/** CSV template string offered as a download for the import feature. */
export const CSV_TEMPLATE = [
  'Revenue,4200000',
  'Cost of goods sold,2730000',
  'Operating expenses,840000',
  'Interest expense,95000',
  'Net income,385000',
  'Cash & equivalents,310000',
  'Accounts receivable,520000',
  'Inventory,640000',
  'Total current assets,1620000',
  'Total assets,3950000',
  'Total current liabilities,910000',
  'Total liabilities,2150000',
  "Total shareholders' equity,1800000",
  '',
].join('\n')
