const TYPE_CONFIG = {
  archaeology: { typeClass: 'ic-arch',    icon: '⛏' },
  manuscript:  { typeClass: 'ic-scroll',  icon: '📜' },
  geography:   { typeClass: 'ic-map',     icon: '🗺' },
  history:     { typeClass: 'ic-history', icon: '📖' },
}

export default function InsightCard({ insight, onOpen }) {
  const cfg = TYPE_CONFIG[insight.type] ?? TYPE_CONFIG.history

  return (
    <div className="insight-card" onClick={() => onOpen(insight)}>
      <div className={`ic-type ${cfg.typeClass}`}>
        {cfg.icon} {insight.label}
      </div>
      <div className="ic-title">{insight.title}</div>
      <div className="ic-preview">{insight.preview}</div>
      <button type="button" className="ic-action">
        Read more{' '}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  )
}
