import { useRef } from 'react'
import { INCOME_ITEMS, BALANCE_ITEMS } from '../lib/model.js'
import { parseStatementCsv } from '../lib/parseCsv.js'
import { CSV_TEMPLATE } from '../lib/sampleData.js'
import { formatMoney } from '../lib/format.js'

/**
 * Left-hand data entry: line items grouped by statement, plus import controls
 * (load sample, upload CSV, download a template). Live-derived subtotals are
 * shown so the user can sanity-check their inputs.
 */
export default function StatementInput({ values, derived, onChange, onImport, onLoadSample }) {
  const fileRef = useRef(null)

  const setField = (key) => (e) => onChange({ ...values, [key]: e.target.value })

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    const result = parseStatementCsv(text)
    onImport(result)
    e.target.value = '' // allow re-uploading the same file
  }

  const downloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'statement-template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="input-panel">
      <div className="import-bar">
        <button type="button" className="btn btn-primary" onClick={onLoadSample}>
          Load sample
        </button>
        <button type="button" className="btn" onClick={() => fileRef.current?.click()}>
          Upload CSV
        </button>
        <button type="button" className="btn btn-ghost" onClick={downloadTemplate}>
          Template
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,text/csv"
          onChange={handleFile}
          hidden
        />
      </div>

      <Group title="Income statement" items={INCOME_ITEMS} values={values} setField={setField}>
        <Derived label="Gross profit" value={derived.grossProfit} />
        <Derived label="Operating income (EBIT)" value={derived.operatingIncome} />
      </Group>

      <Group title="Balance sheet" items={BALANCE_ITEMS} values={values} setField={setField} />
    </div>
  )
}

function Group({ title, items, values, setField, children }) {
  return (
    <fieldset className="group">
      <legend>{title}</legend>
      {items.map((item) => (
        <label key={item.key} className="row">
          <span>{item.label}</span>
          <span className="money-input">
            <span className="affix">$</span>
            <input
              type="number"
              inputMode="decimal"
              value={values[item.key]}
              onChange={setField(item.key)}
            />
          </span>
        </label>
      ))}
      {children}
    </fieldset>
  )
}

function Derived({ label, value }) {
  return (
    <div className="row derived">
      <span>{label}</span>
      <span className={value < 0 ? 'neg' : ''}>{formatMoney(value)}</span>
    </div>
  )
}
