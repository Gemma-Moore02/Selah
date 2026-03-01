import { useEffect } from 'react'

const TYPE_CONFIG = {
  archaeology: { typeClass: 'ic-arch',    icon: '⛏', label: 'Archaeology'      },
  manuscript:  { typeClass: 'ic-scroll',  icon: '📜', label: 'Manuscripts'      },
  geography:   { typeClass: 'ic-map',     icon: '🗺', label: 'Geography'        },
  history:     { typeClass: 'ic-history', icon: '📖', label: 'Historical Context'},
}

export default function InsightDetailModal({ insight, onClose }) {
  const cfg = TYPE_CONFIG[insight.type] ?? TYPE_CONFIG.history

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="insight-modal-backdrop open"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="insight-modal" role="dialog" aria-modal="true">
        <div className="im-header">
          <div>
            <div className={`im-type ${cfg.typeClass}`}>{cfg.icon} {cfg.label}</div>
            <div className="im-title">{insight.title}</div>
            {insight.sub && <div className="im-sub">{insight.sub}</div>}
          </div>
          <button className="im-close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="im-body">
          {/* body is trusted static HTML from local data files */}
          {/* eslint-disable-next-line react/no-danger */}
          <div className="im-text" dangerouslySetInnerHTML={{ __html: insight.body }} />
        </div>
      </div>
    </div>
  )
}
