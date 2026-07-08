/**
 * Financial ratio engine.
 *
 * Pure functions only. Given a normalized statement (see model.js), compute the
 * standard ratios grouped into liquidity, profitability, leverage, and
 * efficiency — each annotated with a rating so the UI and the insights engine
 * can react consistently.
 *
 * Rating thresholds are general rules of thumb. Real analysis is always
 * industry-relative, so efficiency ratios are reported as informational rather
 * than pass/fail. This is stated in the UI too.
 */

/** Safe division: returns null instead of Infinity/NaN for a zero denominator. */
export function safeDiv(numerator, denominator) {
  if (!denominator) return null
  return numerator / denominator
}

/**
 * Rate a value against ascending thresholds where HIGHER is better.
 * @returns 'bad' | 'warn' | 'good'
 */
function rateHigher(value, warnAt, goodAt) {
  if (value == null) return 'neutral'
  if (value >= goodAt) return 'good'
  if (value >= warnAt) return 'warn'
  return 'bad'
}

/**
 * Rate a value where LOWER is better.
 * @returns 'bad' | 'warn' | 'good'
 */
function rateLower(value, warnBelow, goodBelow) {
  if (value == null) return 'neutral'
  if (value <= goodBelow) return 'good'
  if (value <= warnBelow) return 'warn'
  return 'bad'
}

export function computeRatios(d) {
  const liquidity = [
    {
      key: 'currentRatio',
      label: 'Current ratio',
      value: safeDiv(d.currentAssets, d.currentLiabilities),
      format: 'x',
      benchmark: '≥ 1.5 healthy',
      rating: rateHigher(safeDiv(d.currentAssets, d.currentLiabilities), 1, 1.5),
      formula: 'Current assets ÷ current liabilities',
    },
    {
      key: 'quickRatio',
      label: 'Quick ratio',
      value: safeDiv(d.currentAssets - d.inventory, d.currentLiabilities),
      format: 'x',
      benchmark: '≥ 1.0 healthy',
      rating: rateHigher(safeDiv(d.currentAssets - d.inventory, d.currentLiabilities), 0.7, 1),
      formula: '(Current assets − inventory) ÷ current liabilities',
    },
    {
      key: 'cashRatio',
      label: 'Cash ratio',
      value: safeDiv(d.cash, d.currentLiabilities),
      format: 'x',
      benchmark: '≥ 0.5 strong',
      rating: rateHigher(safeDiv(d.cash, d.currentLiabilities), 0.2, 0.5),
      formula: 'Cash ÷ current liabilities',
    },
  ]

  const profitability = [
    {
      key: 'grossMargin',
      label: 'Gross margin',
      value: safeDiv(d.grossProfit, d.revenue),
      format: '%',
      benchmark: 'industry-relative',
      rating: rateHigher(safeDiv(d.grossProfit, d.revenue), 0.2, 0.4),
      formula: 'Gross profit ÷ revenue',
    },
    {
      key: 'operatingMargin',
      label: 'Operating margin',
      value: safeDiv(d.operatingIncome, d.revenue),
      format: '%',
      benchmark: '≥ 15% strong',
      rating: rateHigher(safeDiv(d.operatingIncome, d.revenue), 0.05, 0.15),
      formula: 'Operating income (EBIT) ÷ revenue',
    },
    {
      key: 'netMargin',
      label: 'Net margin',
      value: safeDiv(d.netIncome, d.revenue),
      format: '%',
      benchmark: '≥ 10% strong',
      rating: rateHigher(safeDiv(d.netIncome, d.revenue), 0.03, 0.1),
      formula: 'Net income ÷ revenue',
    },
    {
      key: 'roa',
      label: 'Return on assets',
      value: safeDiv(d.netIncome, d.totalAssets),
      format: '%',
      benchmark: '≥ 5% strong',
      rating: rateHigher(safeDiv(d.netIncome, d.totalAssets), 0.02, 0.05),
      formula: 'Net income ÷ total assets',
    },
    {
      key: 'roe',
      label: 'Return on equity',
      value: safeDiv(d.netIncome, d.totalEquity),
      format: '%',
      benchmark: '≥ 15% strong',
      rating: rateHigher(safeDiv(d.netIncome, d.totalEquity), 0.08, 0.15),
      formula: 'Net income ÷ shareholders’ equity',
    },
  ]

  const leverage = [
    {
      key: 'debtToEquity',
      label: 'Debt-to-equity',
      value: safeDiv(d.totalLiabilities, d.totalEquity),
      format: 'x',
      benchmark: '≤ 1.0 conservative',
      rating: rateLower(safeDiv(d.totalLiabilities, d.totalEquity), 2, 1),
      formula: 'Total liabilities ÷ equity',
    },
    {
      key: 'debtRatio',
      label: 'Debt ratio',
      value: safeDiv(d.totalLiabilities, d.totalAssets),
      format: '%',
      benchmark: '≤ 50% conservative',
      rating: rateLower(safeDiv(d.totalLiabilities, d.totalAssets), 0.7, 0.5),
      formula: 'Total liabilities ÷ total assets',
    },
    {
      key: 'interestCoverage',
      label: 'Interest coverage',
      value: safeDiv(d.operatingIncome, d.interestExpense),
      format: 'x',
      benchmark: '≥ 3x safe',
      rating: rateHigher(safeDiv(d.operatingIncome, d.interestExpense), 1.5, 3),
      formula: 'EBIT ÷ interest expense',
    },
  ]

  // Efficiency ratios are highly industry-dependent, so we report them as
  // informational (neutral rating) rather than pass/fail.
  const efficiency = [
    {
      key: 'assetTurnover',
      label: 'Asset turnover',
      value: safeDiv(d.revenue, d.totalAssets),
      format: 'x',
      benchmark: 'informational',
      rating: 'neutral',
      formula: 'Revenue ÷ total assets',
    },
    {
      key: 'inventoryTurnover',
      label: 'Inventory turnover',
      value: safeDiv(d.cogs, d.inventory),
      format: 'x',
      benchmark: 'informational',
      rating: 'neutral',
      formula: 'COGS ÷ inventory',
    },
    {
      key: 'daysSalesOutstanding',
      label: 'Days sales outstanding',
      value: (() => {
        const turns = safeDiv(d.revenue, d.accountsReceivable)
        return turns ? 365 / turns : null
      })(),
      format: 'days',
      benchmark: 'informational',
      rating: 'neutral',
      formula: '365 ÷ (revenue ÷ receivables)',
    },
  ]

  return { liquidity, profitability, leverage, efficiency }
}

/** Flatten the grouped ratios into a single lookup by key. */
export function ratiosByKey(grouped) {
  const map = {}
  for (const group of Object.values(grouped)) {
    for (const r of group) map[r.key] = r
  }
  return map
}
