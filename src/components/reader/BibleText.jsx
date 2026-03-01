import { useBibleText }   from '@/hooks/useBibleText'
import { getSections }    from '@/data/sections'
import ChapterHeader      from './ChapterHeader'
import PassageSection     from './PassageSection'
import VerseBlock         from './VerseBlock'
import ChapterNav         from './ChapterNav'

export default function BibleText({ book, chapter, onNavigate }) {
  const { data: verses, isLoading, isError, error } = useBibleText(book, chapter)
  const sections = getSections(book, chapter)

  // Build a lookup: verseNumber → section heading to display before it
  const sectionMap = Object.fromEntries(
    sections.map(s => [s.beforeVerse, s.heading])
  )

  if (isLoading) {
    return <div className="reader-status">Loading…</div>
  }

  if (isError) {
    return (
      <div className="reader-status error">
        {error?.message ?? 'Could not load chapter.'}
      </div>
    )
  }

  return (
    <>
      <ChapterHeader book={book} chapter={chapter} />

      {verses.map(v => (
        <span key={v.verse}>
          {sectionMap[v.verse] && (
            <PassageSection heading={sectionMap[v.verse]} />
          )}
          <VerseBlock verse={v.verse} text={v.text} />
        </span>
      ))}

      <ChapterNav book={book} chapter={chapter} onNavigate={onNavigate} />
    </>
  )
}
