import { useQuery } from '@tanstack/react-query'
import { getChapter }             from '@/data/translations/web'
import { fetchChapterApiBible }   from '@/services/apiBible'
import { fetchChapterEsv }        from '@/services/esvApi'

// Translation config — maps badge key → fetch strategy
export const TRANSLATIONS = {
  KJV: { label: 'King James Version',          source: 'local'    },
  WEB: { label: 'World English Bible',          source: 'apibible', bibleId: '9879dbb7cfe39e4d-01' },
  ASV: { label: 'American Standard Version',    source: 'apibible', bibleId: '06125adad2d5898a-01' },
  ESV: { label: 'English Standard Version',     source: 'esv'      },
}

async function fetchChapter(translation, book, chapter) {
  const cfg = TRANSLATIONS[translation]
  if (!cfg) throw new Error(`Unknown translation: ${translation}`)

  if (cfg.source === 'local')    return getChapter(book, chapter)
  if (cfg.source === 'apibible') return fetchChapterApiBible(cfg.bibleId, book, chapter)
  if (cfg.source === 'esv')      return fetchChapterEsv(book, chapter)

  throw new Error(`Unhandled source: ${cfg.source}`)
}

/**
 * Tanstack Query wrapper for chapter data.
 * staleTime/gcTime: Infinity — never re-fetch the same translation+chapter in a session.
 *
 * @param {string} book
 * @param {number} chapter
 * @param {string} [translation='KJV']
 */
export function useBibleText(book, chapter, translation = 'KJV') {
  return useQuery({
    queryKey:  ['bible', translation, book, chapter],
    queryFn:   () => fetchChapter(translation, book, chapter),
    staleTime: Infinity,
    gcTime:    Infinity,
    enabled:   Boolean(book && chapter),
  })
}
