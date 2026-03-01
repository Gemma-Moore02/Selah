import { useState }           from 'react'
import { useBibleText }       from '@/hooks/useBibleText'
import { useInsights }        from '@/hooks/useInsights'
import { useHighlights }      from '@/hooks/useHighlights'
import { useNotes }           from '@/hooks/useNotes'
import { getSections }        from '@/data/sections'
import { useStudyStore }      from '@/store/studyStore'
import { useUIStore }         from '@/store/uiStore'
import ChapterHeader          from './ChapterHeader'
import PassageSection         from './PassageSection'
import VerseBlock             from './VerseBlock'
import ChapterNav             from './ChapterNav'
import InsightDetailModal     from '@/components/modals/InsightDetailModal'
import MapModal               from '@/components/modals/MapModal'

export default function BibleText({ book, chapter, translation = 'KJV', onNavigate }) {
  const { data: verses, isLoading, isError, error } = useBibleText(book, chapter, translation)
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

  const toolMode    = useStudyStore((s) => s.toolMode)
  const activeColor = useStudyStore((s) => s.activeHighlightColor)

  const { highlightMap, addHighlight, removeHighlight } = useHighlights(book, chapter)
  const { noteMap }                                     = useNotes(book, chapter)

  const setActiveVerse = useUIStore((s) => s.setActiveVerse)
  const setPanelOpen   = useUIStore((s) => s.setPanelOpen)
  const setActivePane  = useUIStore((s) => s.setActivePane)

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
      addHighlight(verse, activeColor)
    } else if (toolMode === 'erase') {
      removeHighlight(verse)
    } else if (toolMode === 'note') {
      setActiveVerse({ book, chapter, verse })
      setPanelOpen(true)
      setActivePane('notes')
    }
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
        const highlightColor = highlightMap[v.verse]?.color ?? null
        const hasNote        = !!noteMap?.[v.verse]

        return (
          <span key={v.verse}>
            {sectionMap[v.verse] && (
              <PassageSection heading={sectionMap[v.verse]} />
            )}
            <VerseBlock
              verse={v.verse}
              text={v.text}
              highlightColor={highlightColor}
              hasNote={hasNote}
              onClick={() => handleVerseClick(v.verse)}
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
