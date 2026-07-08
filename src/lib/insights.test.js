import { describe, it, expect } from 'vitest'
import { computeRatios } from './ratios.js'
import { generateInsights } from './insights.js'
import { normalize } from './model.js'
import { SAMPLE_COMPANY } from './sampleData.js'

const analyze = (raw) => {
  const data = normalize(raw)
  return generateInsights(computeRatios(data), data)
}

describe('generateInsights', () => {
  it('flags a strong ROE as a positive for the sample company', () => {
    const insights = analyze(SAMPLE_COMPANY.data)
    const roe = insights.find((i) => /equity/i.test(i.title + i.detail))
    expect(roe).toBeDefined()
    expect(roe.severity).toBe('positive')
  })

  it('raises criticals for an illiquid, loss-making, over-leveraged firm', () => {
    const distressed = {
      revenue: 100000,
      cogs: 90000,
      operatingExpenses: 25000,
      interestExpense: 20000,
      netIncome: -15000,
      cash: 2000,
      accountsReceivable: 8000,
      inventory: 30000,
      currentAssets: 40000,
      totalAssets: 120000,
      currentLiabilities: 80000,
      totalLiabilities: 110000,
      totalEquity: 10000,
    }
    const insights = analyze(distressed)
    const criticals = insights.filter((i) => i.severity === 'critical')
    expect(criticals.length).toBeGreaterThan(0)
    // Loss-making should be surfaced.
    expect(insights.some((i) => /loss/i.test(i.title + i.detail))).toBe(true)
  })

  it('sorts the most severe insight first', () => {
    const insights = analyze({
      revenue: 100000,
      cogs: 95000,
      operatingExpenses: 20000,
      interestExpense: 15000,
      netIncome: -20000,
      cash: 1000,
      currentAssets: 20000,
      inventory: 12000,
      currentLiabilities: 60000,
      totalAssets: 90000,
      totalLiabilities: 85000,
      totalEquity: 5000,
      accountsReceivable: 5000,
    })
    expect(insights[0].severity).toBe('critical')
  })

  it('never returns an empty list (falls back to an info note)', () => {
    const insights = analyze({})
    expect(insights.length).toBeGreaterThan(0)
  })
})
