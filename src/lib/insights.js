/**
 * Insights engine.
 *
 * Turns computed ratios into a ranked list of plain-English observations. Each
 * insight has a severity so the UI can color and sort them:
 *   'critical' > 'warning' > 'positive' > 'info'
 *
 * Pure function of the ratio map + normalized statement.
 */
import { ratiosByKey } from './ratios.js'

const SEVERITY_ORDER = { critical: 0, warning: 1, positive: 2, info: 3 }

const pct = (v) => `${(v * 100).toFixed(1)}%`
const x = (v) => `${v.toFixed(2)}x`

export function generateInsights(grouped, data) {
  const r = ratiosByKey(grouped)
  const out = []
  const add = (severity, title, detail) => out.push({ severity, title, detail })

  // ---- Liquidity ----
  const cr = r.currentRatio.value
  if (cr != null) {
    if (cr < 1) {
      add(
        'critical',
        'Short-term liquidity risk',
        `Current ratio is ${x(cr)} — current liabilities exceed current assets, so the company may struggle to cover obligations due within a year.`,
      )
    } else if (cr >= 2) {
      add(
        'positive',
        'Strong liquidity cushion',
        `Current ratio of ${x(cr)} gives comfortable coverage of short-term obligations.`,
      )
    }
  }

  const qr = r.quickRatio.value
  if (qr != null && cr != null && qr < 1 && cr >= 1.5) {
    add(
      'warning',
      'Liquidity leans on inventory',
      `Quick ratio (${x(qr)}) is well below the current ratio (${x(cr)}), meaning a large share of current assets is tied up in inventory that may not convert to cash quickly.`,
    )
  }

  // ---- Profitability ----
  const nm = r.netMargin.value
  if (nm != null) {
    if (nm < 0) {
      add(
        'critical',
        'Operating at a loss',
        `Net margin is ${pct(nm)} — the company is spending more than it earns.`,
      )
    } else if (nm >= 0.1) {
      add('positive', 'Healthy bottom line', `Net margin of ${pct(nm)} is strong.`)
    }
  }

  const gm = r.grossMargin.value
  const om = r.operatingMargin.value
  if (gm != null && om != null && gm - om > 0.3) {
    add(
      'info',
      'Operating costs eat into gross profit',
      `Gross margin is ${pct(gm)} but operating margin is only ${pct(om)} — overhead and operating expenses are absorbing a large portion of gross profit.`,
    )
  }

  const roe = r.roe.value
  if (roe != null && roe >= 0.15) {
    add('positive', 'Efficient use of equity', `Return on equity of ${pct(roe)} indicates strong returns to shareholders.`)
  }

  // ---- Leverage ----
  const de = r.debtToEquity.value
  if (de != null) {
    if (de > 2) {
      add(
        'warning',
        'Highly leveraged',
        `Debt-to-equity of ${x(de)} means the company is financed far more by debt than equity, which raises financial risk.`,
      )
    } else if (de <= 0.5) {
      add('info', 'Conservative capital structure', `Debt-to-equity of ${x(de)} reflects low reliance on debt.`)
    }
  }

  const ic = r.interestCoverage.value
  if (ic != null && data.interestExpense > 0 && ic < 1.5) {
    add(
      'critical',
      'Thin interest coverage',
      `Operating income covers interest only ${x(ic)} — earnings barely service the debt, leaving little margin for a downturn.`,
    )
  }

  // ---- Fallback ----
  if (out.length === 0) {
    add('info', 'No red flags detected', 'The entered figures do not trip any of the ratio thresholds. Compare against industry peers and prior periods for a fuller picture.')
  }

  return out.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity])
}
