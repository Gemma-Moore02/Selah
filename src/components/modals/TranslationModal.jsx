import { useEffect } from 'react'
import { X } from 'lucide-react'
import { TRANSLATIONS } from '@/hooks/useBibleText'

const TRANSLATION_ORDER = ['KJV', 'WEB', 'ASV', 'ESV']

export default function TranslationModal({ current, onChange, onClose }) {
  // ESC to close
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  function handleSelect(key) {
    onChange(key)
    onClose()
  }

  return (
    <div className="tm-backdrop" onMouseDown={onClose}>
      <div className="tm-modal" onMouseDown={e => e.stopPropagation()}>
        <div className="tm-header">
          <div>
            <div className="tm-title">Select Translation</div>
            <div className="tm-sub">Open-license texts load instantly. ESV fetched live.</div>
          </div>
          <button className="tm-close" type="button" onClick={onClose} aria-label="Close">
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        <div className="tm-grid">
          {TRANSLATION_ORDER.map(key => {
            const cfg     = TRANSLATIONS[key]
            const active  = key === current
            return (
              <button
                key={key}
                className={`trans-opt${active ? ' active' : ''}`}
                type="button"
                onClick={() => handleSelect(key)}
              >
                <span className="ta">{key}</span>
                <span className="tn">{cfg.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
