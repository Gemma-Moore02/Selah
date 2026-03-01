import { useState }           from 'react'
import { useBibleText }       from '@/hooks/useBibleText'
import { useInsights }        from '@/hooks/useInsights'
import { getSections }        from '@/data/sections'
import { useStudyStore }      from '@/store/studyStore'
import ChapterHeader          from './ChapterHeader'
import PassageSection         from './PassageSection'
import VerseBlock             from './VerseBlock'
import ChapterNav             from './ChapterNav'
import InsightDetailModal     from '@/components/modals/InsightDetailModal'
import MapModal               from '@/components/modals/MapModal'

export default function BibleText({ book, chapter, onNavigate }) {
  const { data: verses, isLoading, isError, error } = useBibleText(book, chapter)
  const { data: insights }                           = useInsights(book, chapter)
  const sections = getSections(book, chapter)

  const [activeInsight,    setActiveInsight]    = useState(null)
  const [activeMapInsight, setActiveMapInsight] = useState(null)

  function handleOpenInsight(insight) {
    if (insight.type === 'geography') {
      setActiveMapInsight(insight)
    } else {
      setActiveInsight(insight)
    }
  }

  const toolMode           = useStudyStore((s) => s.toolMode)
  const activeColor        = useStudyStore((s) => s.activeHighlightColor)
  const highlights         = useStudyStore((s) => s.highlights)
  const addHighlight       = useStudyStore((s) => s.addHighlight)
  const removeHighlight    = useStudyStore((s) => s.removeHighlight)

  // Build verse → [insight, …] lookup for quick chip rendering
  const insightsByVerse = {}
  if (insights) {
    for (const insight of insights) {
      if (!insightsByVerse[insight.verse]) insightsByVerse[insight.verse] = []
      insightsByVerse[insight.verse].push(insight)
    }
  }

  // Build a lookup: verseNumber → section heading to display before it
  const sectionMap = Object.fromEntries(
    sections.map(s => [s.beforeVerse, s.heading])
  )

  function handleVerseClick(verse) {
    if (toolMode === 'highlight') {
      addHighlight(book, chapter, verse, activeColor)
    } else if (toolMode === 'erase') {
      removeHighlight(book, chapter, verse)
    }
    // note mode handled in SPEC-008
  }

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

      {verses.map(v => {
        const key = `${book}-${chapter}-${v.verse}`
        const highlightColor = highlights[key]?.color ?? null

        return (
          <span key={v.verse}>
            {sectionMap[v.verse] && (
              <PassageSection heading={sectionMap[v.verse]} />
            )}
            <VerseBlock
              verse={v.verse}
              text={v.text}
              highlightColor={highlightColor}
              onClick={toolMode !== 'note' ? () => handleVerseClick(v.verse) : undefined}
              insights={insightsByVerse[v.verse]}
              onOpenInsight={handleOpenInsight}
            />
          </span>
        )
      })}

      <ChapterNav book={book} chapter={chapter} onNavigate={onNavigate} />

      {activeInsight && (
        <InsightDetailModal
          insight={activeInsight}
          onClose={() => setActiveInsight(null)}
        />
      )}

      {activeMapInsight && (
        <MapModal
          insight={activeMapInsight}
          onClose={() => setActiveMapInsight(null)}
        />
      )}
    </>
  )
}
