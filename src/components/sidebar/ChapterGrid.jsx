import { getChapterCount } from '@/data/books'

export default function ChapterGrid({ book, activeChapter, onSelect }) {
  const count = getChapterCount(book)

  return (
    <>
      <div className="sb-label">{book} — Chapters</div>
      <div className="ch-grid">
        {Array.from({ length: count }, (_, i) => i + 1).map(n => (
          <button
            key={n}
            className={`ch-btn${n === activeChapter ? ' active' : ''}`}
            onClick={() => onSelect(n)}
            type="button"
          >
            {n}
          </button>
        ))}
      </div>
    </>
  )
}
