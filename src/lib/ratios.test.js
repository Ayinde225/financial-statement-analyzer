import { describe, it, expect } from 'vitest'
import { computeRatios, safeDiv, ratiosByKey } from './ratios.js'
import { normalize } from './model.js'
import { SAMPLE_COMPANY } from './sampleData.js'

const sample = normalize(SAMPLE_COMPANY.data)
const r = ratiosByKey(computeRatios(sample))

describe('safeDiv', () => {
  it('divides normally', () => {
    expect(safeDiv(10, 2)).toBe(5)
  })
  it('returns null for a zero denominator instead of Infinity/NaN', () => {
    expect(safeDiv(10, 0)).toBeNull()
    expect(safeDiv(0, 0)).toBeNull()
  })
})

describe('derived subtotals', () => {
  it('computes gross profit and EBIT from the raw line items', () => {
    expect(sample.grossProfit).toBe(4200000 - 2730000)
    expect(sample.operatingIncome).toBe(sample.grossProfit - 840000)
  })
})

describe('computeRatios on the sample company', () => {
  it('current ratio ≈ 1.78 and rated healthy', () => {
    expect(r.currentRatio.value).toBeCloseTo(1.78, 2)
    expect(r.currentRatio.rating).toBe('good')
  })

  it('net margin ≈ 9.2% and rated watch (below 10%)', () => {
    expect(r.netMargin.value).toBeCloseTo(0.0917, 3)
    expect(r.netMargin.rating).toBe('warn')
  })

  it('return on equity ≈ 21% and rated healthy', () => {
    expect(r.roe.value).toBeCloseTo(0.2139, 3)
    expect(r.roe.rating).toBe('good')
  })

  it('debt-to-equity ≈ 1.19 and rated watch (lower is better)', () => {
    expect(r.debtToEquity.value).toBeCloseTo(1.194, 2)
    expect(r.debtToEquity.rating).toBe('warn')
  })

  it('interest coverage ≈ 6.6x and rated healthy', () => {
    expect(r.interestCoverage.value).toBeCloseTo(6.63, 1)
    expect(r.interestCoverage.rating).toBe('good')
  })

  it('efficiency ratios are informational (neutral)', () => {
    expect(r.assetTurnover.rating).toBe('neutral')
    expect(r.daysSalesOutstanding.value).toBeCloseTo(45.2, 0)
  })
})

describe('divide-by-zero safety', () => {
  it('yields null ratios (not crashes) for an all-zero statement', () => {
    const zero = normalize({})
    const rz = ratiosByKey(computeRatios(zero))
    expect(rz.currentRatio.value).toBeNull()
    expect(rz.netMargin.value).toBeNull()
  })
})
