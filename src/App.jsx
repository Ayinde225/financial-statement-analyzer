import { useMemo, useState } from 'react'
import StatementInput from './components/StatementInput.jsx'
import RatioGrid from './components/RatioGrid.jsx'
import Insights from './components/Insights.jsx'
import { emptyStatement, normalize } from './lib/model.js'
import { computeRatios } from './lib/ratios.js'
import { generateInsights } from './lib/insights.js'
import { SAMPLE_COMPANY } from './lib/sampleData.js'

export default function App() {
  const [values, setValues] = useState(emptyStatement)
  const [notice, setNotice] = useState(null)

  const derived = useMemo(() => normalize(values), [values])
  const ratios = useMemo(() => computeRatios(derived), [derived])
  const insights = useMemo(() => generateInsights(ratios, derived), [ratios, derived])

  const hasData = derived.revenue > 0 || derived.totalAssets > 0

  const loadSample = () => {
    setValues({ ...emptyStatement(), ...SAMPLE_COMPANY.data })
    setNotice({ type: 'ok', text: `Loaded ${SAMPLE_COMPANY.name}.` })
  }

  const handleImport = ({ data, matched, ignored }) => {
    if (matched.length === 0) {
      setNotice({
        type: 'err',
        text: 'No recognizable line items found. Use the Template button for the expected format.',
      })
      return
    }
    setValues({ ...emptyStatement(), ...data })
    setNotice({
      type: 'ok',
      text: `Imported ${matched.length} line item${matched.length === 1 ? '' : 's'}${
        ignored.length ? ` · ${ignored.length} row(s) not recognized` : ''
      }.`,
    })
  }

  return (
    <div className="app">
      <header className="masthead">
        <h1>Financial Statement Analyzer</h1>
        <p>
          Enter or upload an income statement and balance sheet. Get the standard liquidity,
          profitability, leverage, and efficiency ratios — plus plain-English insights.
        </p>
      </header>

      <main className="layout">
        <aside className="panel">
          <StatementInput
            values={values}
            derived={derived}
            onChange={(v) => {
              setValues(v)
              setNotice(null)
            }}
            onImport={handleImport}
            onLoadSample={loadSample}
          />
          {notice && <div className={`notice notice-${notice.type}`}>{notice.text}</div>}
        </aside>

        <div className="results">
          {hasData ? (
            <>
              <section className="panel">
                <h2>Insights</h2>
                <Insights insights={insights} />
              </section>
              <section className="panel">
                <h2>Ratios</h2>
                <RatioGrid ratios={ratios} />
                <p className="disclaimer">
                  Thresholds are general rules of thumb. Real analysis is industry-relative —
                  compare against peers and prior periods. Efficiency ratios are informational.
                </p>
              </section>
            </>
          ) : (
            <div className="panel empty-state">
              <h2>👋 Start here</h2>
              <p>
                Click <b>Load sample</b> to see a worked example, <b>Upload CSV</b> to import your
                own figures, or just type into the fields on the left.
              </p>
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        Built with React · ratio &amp; insight engines from first principles ·{' '}
        <span>a finance-meets-code project</span>
      </footer>
    </div>
  )
}
