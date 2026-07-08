/**
 * Minimal CSV parsing for the analyzer's import feature.
 *
 * Expected format is a simple two-column sheet: a line-item label and its
 * value, e.g.
 *
 *   Revenue,1000000
 *   Cost of goods sold,600000
 *   ...
 *
 * Labels are matched case-insensitively against the model's line items (and a
 * few common aliases), so exports from spreadsheets line up without manual
 * key mapping. Unknown rows are ignored and reported back to the caller.
 */
import { LINE_ITEMS } from './model.js'

// Map of normalized label -> model key, including aliases.
const LABEL_TO_KEY = (() => {
  const map = new Map()
  for (const item of LINE_ITEMS) map.set(norm(item.label), item.key)
  const aliases = {
    'sales': 'revenue',
    'total revenue': 'revenue',
    'cogs': 'cogs',
    'cost of sales': 'cogs',
    'opex': 'operatingExpenses',
    'operating expense': 'operatingExpenses',
    'interest': 'interestExpense',
    'net profit': 'netIncome',
    'profit': 'netIncome',
    'cash': 'cash',
    'cash and cash equivalents': 'cash',
    'receivables': 'accountsReceivable',
    'ar': 'accountsReceivable',
    'current assets': 'currentAssets',
    'current liabilities': 'currentLiabilities',
    'equity': 'totalEquity',
    "shareholders equity": 'totalEquity',
  }
  for (const [alias, key] of Object.entries(aliases)) map.set(norm(alias), key)
  return map
})()

function norm(s) {
  return String(s)
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Split one CSV line, honoring simple double-quoted fields. */
function splitLine(line) {
  const fields = []
  let cur = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (c === ',' && !inQuotes) {
      fields.push(cur)
      cur = ''
    } else {
      cur += c
    }
  }
  fields.push(cur)
  return fields
}

/** Parse a number that may contain $ , () thousands/negatives. */
function parseNumber(raw) {
  const s = String(raw).trim()
  const negative = /^\(.*\)$/.test(s)
  const cleaned = s.replace(/[$,()\s]/g, '')
  if (cleaned === '' || Number.isNaN(Number(cleaned))) return null
  const n = Number(cleaned)
  return negative ? -n : n
}

/**
 * @param {string} text  Raw CSV contents.
 * @returns {{ data: Record<string, number>, matched: string[], ignored: string[] }}
 */
export function parseStatementCsv(text) {
  const data = {}
  const matched = []
  const ignored = []

  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== '')
  for (const line of lines) {
    const [label, valueRaw] = splitLine(line)
    if (label == null || valueRaw == null) continue

    const key = LABEL_TO_KEY.get(norm(label))
    const value = parseNumber(valueRaw)

    if (key && value != null) {
      data[key] = value
      matched.push(label.trim())
    } else if (norm(label) && !/label|item|account/.test(norm(label))) {
      ignored.push(label.trim())
    }
  }

  return { data, matched, ignored }
}
