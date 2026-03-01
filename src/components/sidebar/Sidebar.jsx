import BookList    from './BookList'
import ChapterGrid from './ChapterGrid'
import ReadingPlan from './ReadingPlan'

export default function Sidebar({
  book,
  chapter,
  isOpen,
  onBookChange,
  onChapterChange,
  onClose,
}) {
  function handleBookSelect(name) {
    onBookChange(name)
    // Close sidebar after selection on mobile
    if (window.innerWidth < 1024) onClose()
  }

  function handleChapterSelect(n) {
    onChapterChange(n)
    if (window.innerWidth < 1024) onClose()
  }

  return (
    <>
      {/* Mobile backdrop — hidden on desktop via CSS */}
      <div
        className={`sidebar-backdrop${isOpen ? ' active' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`sidebar${isOpen ? ' sidebar-mobile-open' : ''}`}>
        <div className="sb-inner">
          <BookList
            activeBook={book}
            onSelect={handleBookSelect}
          />
          <ChapterGrid
            book={book}
            activeChapter={chapter}
            onSelect={handleChapterSelect}
          />
          <ReadingPlan />
        </div>
      </aside>
    </>
  )
}
