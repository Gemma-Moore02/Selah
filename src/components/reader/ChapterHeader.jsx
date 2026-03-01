import { numberToWords } from '@/lib/numberToWords'
import { getBookLongName, getChapterSubtitle } from '@/data/chapterMeta'

export default function ChapterHeader({ book, chapter }) {
  const longName = getBookLongName(book)
  const subtitle = getChapterSubtitle(book, chapter)

  return (
    <div className="ch-header">
      <div className="bk-name">{longName}</div>
      <div className="ch-title">Chapter {numberToWords(chapter)}</div>
      {subtitle && <div className="ch-sub">{subtitle}</div>}
    </div>
  )
}
