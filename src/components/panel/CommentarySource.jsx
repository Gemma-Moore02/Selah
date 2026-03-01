const SOURCES = [
  { label: 'Matthew Henry', dates: '1662–1714' },
  { label: 'John Calvin',   dates: '1509–1564' },
  { label: 'John Gill',     dates: '1697–1771' },
  { label: 'Geneva',        dates: '1560' },
]

export function COMMENTARY_SOURCES() {
  return SOURCES
}

export default function CommentarySource({ activeSource, onSourceChange }) {
  return (
    <div className="comm-source-select">
      {SOURCES.map((s) => (
        <button
          key={s.label}
          type="button"
          className={`comm-src-btn${activeSource === s.label ? ' active' : ''}`}
          onClick={() => onSourceChange(s.label)}
        >
          {s.label}
        </button>
      ))}
    </div>
  )
}
