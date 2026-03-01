const TYPE_CONFIG = {
  archaeology: { chipClass: 'chip-arch',    icon: '⛏', label: 'Archaeology' },
  manuscript:  { chipClass: 'chip-scroll',  icon: '📜', label: 'Manuscripts' },
  geography:   { chipClass: 'chip-map',     icon: '🗺', label: 'Geography'   },
  history:     { chipClass: 'chip-history', icon: '📖', label: 'Context'     },
}

export default function InsightChip({ insight, onOpen }) {
  const cfg = TYPE_CONFIG[insight.type] ?? TYPE_CONFIG.history

  function handleClick(e) {
    e.stopPropagation()
    onOpen(insight)
  }

  return (
    <span
      className={`insight-chip ${cfg.chipClass}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick(e)}
    >
      <span className="chip-icon">{cfg.icon}</span>
      {cfg.label}
    </span>
  )
}
