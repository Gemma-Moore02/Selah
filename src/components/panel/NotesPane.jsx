import { useUIStore }   from '@/store/uiStore'
import { useBibleText } from '@/hooks/useBibleText'
import { useNotes }     from '@/hooks/useNotes'
import NoteCompose      from './NoteCompose'
import NoteCard         from './NoteCard'

export default function NotesPane({ book, chapter }) {
  const activeVerseData = useUIStore((s) => s.activeVerse)
  const setActiveVerse  = useUIStore((s) => s.setActiveVerse)

  const { data: verses } = useBibleText(book, chapter)
  const { noteMap, notes, saveNote, deleteNote } = useNotes(book, chapter)

  // Only treat the stored active verse as active if it belongs to the current chapter
  const activeVerse =
    activeVerseData?.book === book && activeVerseData?.chapter === chapter
      ? activeVerseData.verse
      : null

  const verseText = verses?.find((v) => v.verse === activeVerse)?.text ?? ''

  function handleNoteCardClick(verse) {
    setActiveVerse({ book, chapter, verse })
  }

  return (
    <div className="notes-pane">
      <NoteCompose
        book={book}
        chapter={chapter}
        activeVerse={activeVerse}
        verseText={verseText}
        noteMap={noteMap}
        onSave={saveNote}
      />

      <div className="notes-list">
        {notes.length > 0 && (
          <div className="list-label">Saved · {book} {chapter}</div>
        )}

        {notes.map((note) => (
          <NoteCard
            key={note.verse}
            note={note}
            book={book}
            chapter={chapter}
            onClick={handleNoteCardClick}
            onDelete={deleteNote}
          />
        ))}

        {notes.length === 0 && (
          <div className="comm-empty">No notes for {book} {chapter} yet.</div>
        )}
      </div>
    </div>
  )
}
