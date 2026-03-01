import { OLD_TESTAMENT, NEW_TESTAMENT } from '@/data/books'

export default function BookList({ activeBook, onSelect }) {
  return (
    <>
      <div className="sb-label" style={{ marginTop: 0 }}>Old Testament</div>
      <ul className="book-list">
        {OLD_TESTAMENT.map(b => (
          <li
            key={b.name}
            className={`book-item${b.name === activeBook ? ' active' : ''}`}
            onClick={() => onSelect(b.name)}
          >
            {b.name}
          </li>
        ))}
      </ul>

      <div className="sb-label">New Testament</div>
      <ul className="book-list">
        {NEW_TESTAMENT.map(b => (
          <li
            key={b.name}
            className={`book-item${b.name === activeBook ? ' active' : ''}`}
            onClick={() => onSelect(b.name)}
          >
            {b.name}
          </li>
        ))}
      </ul>
    </>
  )
}
