import { formatRatio, RATING_LABEL } from '../lib/format.js'

const GROUP_TITLES = {
  liquidity: 'Liquidity',
  profitability: 'Profitability',
  leverage: 'Leverage & solvency',
  efficiency: 'Efficiency',
}

/** Grouped ratio cards, each showing value, rating chip, benchmark, formula. */
export default function RatioGrid({ ratios }) {
  return (
    <div className="ratio-groups">
      {Object.entries(ratios).map(([group, items]) => (
        <section key={group} className="ratio-group">
          <h3>{GROUP_TITLES[group]}</h3>
          <div className="ratio-cards">
            {items.map((r) => (
              <div key={r.key} className={`ratio-card rating-${r.rating}`}>
                <div className="ratio-top">
                  <span className="ratio-label">{r.label}</span>
                  <span className={`chip chip-${r.rating}`}>{RATING_LABEL[r.rating]}</span>
                </div>
                <div className="ratio-value">{formatRatio(r.value, r.format)}</div>
                <div className="ratio-meta">
                  <span title={r.formula}>{r.formula}</span>
                  <span className="ratio-bench">{r.benchmark}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
