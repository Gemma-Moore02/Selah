import { useState } from 'react'
import { useCommentary } from '@/hooks/useCommentary'
import CommentarySource from './CommentarySource'

const SOURCE_META = {
  'Matthew Henry': '1662–1714',
  'John Calvin':   '1509–1564',
  'John Gill':     '1697–1771',
  'Geneva':        '1560',
}

export default function CommentaryPane({ book, chapter }) {
  const [source, setSource] = useState('Matthew Henry')
  const { data: entries, isLoading } = useCommentary(source, book, chapter)

  const hasEntries = entries && entries.length > 0

  return (
    <>
      <CommentarySource activeSource={source} onSourceChange={setSource} />

      <div className="commentary-scroll">
        {isLoading && (
          <div className="comm-empty">Loading…</div>
        )}

        {!isLoading && !hasEntries && (
          <div className="comm-empty">
            No commentary available for {book} {chapter} in this source.
          </div>
        )}

        {!isLoading && hasEntries && entries.map((entry, i) => (
          <div key={i}>
            {i > 0 && <hr className="comm-divider" />}

            <div className="comm-passage-ref">{entry.title}</div>

            {i === 0 && (
              <div className="comm-author">
                {source}
                <span>{SOURCE_META[source]}</span>
              </div>
            )}

            <div className="comm-text">
              {entry.paragraphs.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
