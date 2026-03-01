export default function NoteCard({ note, book, chapter, onClick, onDelete }) {
  const ref  = `${book} ${chapter}:${note.verse}`
  const when = note.updatedAt ?? note.updated_at
  const date = when
    ? new Date(when).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null

  return (
    <div className="note-card" onClick={() => onClick(note.verse)}>
      <div className="nc-header">
        <div className="nc-ref">{ref}</div>
        <button
          className="nc-delete"
          aria-label="Delete note"
          onClick={(e) => { e.stopPropagation(); onDelete(note.verse) }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="nc-text">{note.text}</div>
      {date && <div className="nc-date">{date}</div>}
    </div>
  )
}
