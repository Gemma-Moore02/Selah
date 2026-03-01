import { useState, useEffect } from 'react'

export default function NoteCompose({ book, chapter, activeVerse, verseText, noteMap, onSave }) {
  const [draft, setDraft] = useState('')

  // Load existing note text when the active verse changes
  useEffect(() => {
    setDraft(noteMap?.[activeVerse]?.text ?? '')
  }, [activeVerse, noteMap])

  const hasVerse = activeVerse != null
  const label    = hasVerse ? `${book} ${chapter}:${activeVerse}` : `${book} ${chapter}`
  const preview  = verseText
    ? `"${verseText.slice(0, 110)}${verseText.length > 110 ? '…' : ''}"`
    : null

  function handleSave() {
    if (!hasVerse || !draft.trim()) return
    onSave(activeVerse, draft.trim())
  }

  return (
    <div className="note-compose">
      <div className="compose-label">{label}</div>
      <div className="compose-verse">
        {hasVerse && preview
          ? preview
          : 'Click a verse in note mode to annotate.'}
      </div>
      <textarea
        className="compose-ta"
        placeholder="Write your note…"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        disabled={!hasVerse}
        rows={3}
      />
      <div className="compose-footer">
        <button
          className="btn-sm btn-ghost"
          onClick={() => setDraft('')}
          disabled={!draft}
        >
          Clear
        </button>
        <button
          className="btn-sm btn-primary"
          onClick={handleSave}
          disabled={!hasVerse || !draft.trim()}
        >
          Save
        </button>
      </div>
    </div>
  )
}
