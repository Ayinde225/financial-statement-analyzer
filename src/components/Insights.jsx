const ICON = {
  critical: '🔴',
  warning: '🟠',
  positive: '🟢',
  info: '🔵',
}

/** Ranked, plain-English observations generated from the ratios. */
export default function Insights({ insights }) {
  return (
    <div className="insights">
      {insights.map((it, i) => (
        <div key={i} className={`insight insight-${it.severity}`}>
          <span className="insight-icon" aria-hidden="true">
            {ICON[it.severity]}
          </span>
          <div>
            <div className="insight-title">{it.title}</div>
            <div className="insight-detail">{it.detail}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
