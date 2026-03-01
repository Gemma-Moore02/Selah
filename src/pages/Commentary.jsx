import { useState, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useBibleText }   from '@/hooks/useBibleText'
import { useCommentary }  from '@/hooks/useCommentary'
import NavSelects         from '@/components/topbar/NavSelects'
import CommentarySource   from '@/components/panel/CommentarySource'

const SOURCE_META = {
  'Matthew Henry': '1662–1714',
  'John Calvin':   '1509–1564',
  'John Gill':     '1697–1771',
  'Geneva':        '1560',
}

export default function Commentary() {
  const [book,    setBook]    = useState('John')
  const [chapter, setChapter] = useState(4)
  const [source,  setSource]  = useState('Matthew Henry')
  const [activeVerse, setActiveVerse] = useState(null)

  const { data: verses,  isLoading: versesLoading  } = useBibleText(book, chapter)
  const { data: entries, isLoading: entriesLoading } = useCommentary(source, book, chapter)

  // Map: entry index → DOM element ref, for scrolling
  const entryRefs = useRef({})

  function handleBookChange(b) {
    setBook(b)
    setChapter(1)
    setActiveVerse(null)
  }

  function handleChapterChange(c) {
    setChapter(c)
    setActiveVerse(null)
  }

  // When a verse is clicked, find the commentary entry whose verse is the
  // closest anchor ≤ the clicked verse, then scroll to it.
  const handleVerseClick = useCallback((verse) => {
    setActiveVerse(verse)
    if (!entries || entries.length === 0) return

    // Find last entry with entry.verse <= verse (or entry with no verse → first)
    let bestIdx = 0
    for (let i = 0; i < entries.length; i++) {
      const ev = entries[i].verse ?? 1
      if (ev <= verse) bestIdx = i
    }

    const el = entryRefs.current[bestIdx]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [entries])

  // Which entry index is "active" given the active verse
  const activeEntryIdx = (() => {
    if (activeVerse == null || !entries || entries.length === 0) return null
    let best = 0
    for (let i = 0; i < entries.length; i++) {
      if ((entries[i].verse ?? 1) <= activeVerse) best = i
    }
    return best
  })()

  return (
    <div className="cp-page">

      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="cp-header">
        <Link to="/" className="cp-back">
          <ArrowLeft size={14} strokeWidth={1.5} />
          Reader
        </Link>

        <div className="cp-logo">S<span>elah</span></div>

        <div className="cp-nav">
          <NavSelects
            book={book}
            chapter={chapter}
            onBookChange={handleBookChange}
            onChapterChange={handleChapterChange}
          />
        </div>

        <div className="cp-source-wrap">
          <CommentarySource activeSource={source} onSourceChange={setSource} />
        </div>
      </header>

      {/* ── Body ───────────────────────────────────────────────── */}
      <div className="cp-body">

        {/* Scripture column */}
        <div className="cp-scripture">
          <div className="cp-col-label">Scripture · {book} {chapter}</div>

          {versesLoading && (
            <div className="comm-empty">Loading…</div>
          )}

          {verses && verses.map((v) => (
            <div
              key={v.verse}
              className={`cp-verse${activeVerse === v.verse ? ' active' : ''}`}
              onClick={() => handleVerseClick(v.verse)}
            >
              <span className="cp-vnum">{v.verse}</span>
              <span className="cp-vtext">{v.text}</span>
            </div>
          ))}
        </div>

        {/* Commentary column */}
        <div className="cp-commentary">
          <div className="cp-col-label">
            {source}
            <span className="cp-col-label-dates">{SOURCE_META[source]}</span>
          </div>

          {entriesLoading && (
            <div className="comm-empty">Loading…</div>
          )}

          {!entriesLoading && entries && entries.length === 0 && (
            <div className="comm-empty">
              No commentary available for {book} {chapter} in this source.
            </div>
          )}

          {!entriesLoading && entries && entries.map((entry, i) => (
            <div
              key={i}
              ref={(el) => { entryRefs.current[i] = el }}
              className={`cp-entry${activeEntryIdx === i ? ' active' : ''}`}
            >
              <div className="cp-entry-ref">{entry.title}</div>
              <div className="comm-text">
                {entry.paragraphs.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
              {i < entries.length - 1 && <hr className="comm-divider" />}
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
