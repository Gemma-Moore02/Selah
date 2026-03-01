import { OLD_TESTAMENT, NEW_TESTAMENT, getChapterCount } from '@/data/books'

export default function NavSelects({ book, chapter, onBookChange, onChapterChange }) {
  const chapterCount = getChapterCount(book)

  function handleBookChange(e) {
    onBookChange(e.target.value)
  }

  function handleChapterChange(e) {
    onChapterChange(Number(e.target.value))
  }

  return (
    <>
      {/* Book select */}
      <div className="sel-wrap">
        <select className="nav-sel" value={book} onChange={handleBookChange}>
          <optgroup label="Old Testament">
            {OLD_TESTAMENT.map(b => (
              <option key={b.name} value={b.name}>{b.name}</option>
            ))}
          </optgroup>
          <optgroup label="New Testament">
            {NEW_TESTAMENT.map(b => (
              <option key={b.name} value={b.name}>{b.name}</option>
            ))}
          </optgroup>
        </select>
        <span className="sel-arrow">▾</span>
      </div>

      <div className="sel-div" />

      {/* Chapter select */}
      <div className="sel-wrap">
        <select
          className="nav-sel"
          style={{ width: '74px' }}
          value={chapter}
          onChange={handleChapterChange}
        >
          {Array.from({ length: chapterCount }, (_, i) => i + 1).map(n => (
            <option key={n} value={n}>Ch. {n}</option>
          ))}
        </select>
        <span className="sel-arrow">▾</span>
      </div>
    </>
  )
}
