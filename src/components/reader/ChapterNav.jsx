import { getChapterCount } from '@/data/books'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function ChapterNav({ book, chapter, onNavigate }) {
  const maxChapter = getChapterCount(book)
  const hasPrev    = chapter > 1
  const hasNext    = chapter < maxChapter

  return (
    <div className="ch-nav">
      <button
        className="ch-nav-btn"
        onClick={() => onNavigate(book, chapter - 1)}
        disabled={!hasPrev}
      >
        <ChevronLeft size={11} strokeWidth={1.5} />
        {book} {chapter - 1}
      </button>

      <span className="ch-pos">
        {book} · Chapter {chapter}
      </span>

      <button
        className="ch-nav-btn"
        onClick={() => onNavigate(book, chapter + 1)}
        disabled={!hasNext}
      >
        {book} {chapter + 1}
        <ChevronRight size={11} strokeWidth={1.5} />
      </button>
    </div>
  )
}
