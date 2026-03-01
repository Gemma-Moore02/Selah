/**
 * Local KJV translation loader (used as dev fallback for WEB).
 * Vite's import.meta.glob lazily loads only the book files that are requested.
 *
 * Usage:
 *   import { getChapter } from '@/data/translations/web'
 *   const verses = await getChapter('John', 4)
 *   // → [{ verse: 1, text: "..." }, ...]
 */

// Keyed map: './john.json' → () => Promise<module>
const bookModules = import.meta.glob('./*.json')

// KJV uses Roman numeral prefixes ("I Samuel") and "Revelation of John".
// Map standard app names → actual generated filenames.
const FILE_MAP = {
  '1samuel':        'isamuel',
  '2samuel':        'iisamuel',
  '1kings':         'ikings',
  '2kings':         'iikings',
  '1chronicles':    'ichronicles',
  '2chronicles':    'iichronicles',
  '1corinthians':   'icorinthians',
  '2corinthians':   'iicorinthians',
  '1thessalonians': 'ithessalonians',
  '2thessalonians': 'iithessalonians',
  '1timothy':       'itimothy',
  '2timothy':       'iitimothy',
  '1peter':         'ipeter',
  '2peter':         'iipeter',
  '1john':          'ijohn',
  '2john':          'iijohn',
  '3john':          'iiijohn',
  'revelation':     'revelationofjohn',
}

function toKey(bookName) {
  return bookName.toLowerCase().replace(/\s+/g, '')
}

/**
 * Returns the verses array for a given book + chapter.
 * @param {string} book     - Book name (e.g. 'John', '1 Corinthians')
 * @param {number} chapter  - 1-based chapter number
 * @returns {Promise<Array<{ verse: number, text: string }>>}
 */
export async function getChapter(book, chapter) {
  const normalized = toKey(book)
  const fileKey    = FILE_MAP[normalized] ?? normalized
  const path       = `./${fileKey}.json`
  const loader     = bookModules[path]

  if (!loader) {
    throw new Error(
      `No local file for "${book}". Run scripts/convert-web.js to generate it.`
    )
  }

  const mod        = await loader()
  const bookData   = mod.default
  const chapterData = bookData.chapters.find(c => c.chapter === chapter)

  if (!chapterData) {
    throw new Error(`Chapter ${chapter} not found in ${book}`)
  }

  return chapterData.verses
}

/**
 * Returns the chapter count for a book from the local data.
 * @param {string} book
 * @returns {Promise<number>}
 */
export async function getChapterCount(book) {
  const normalized = toKey(book)
  const fileKey    = FILE_MAP[normalized] ?? normalized
  const path       = `./${fileKey}.json`
  const loader     = bookModules[path]
  if (!loader) return 0
  const mod = await loader()
  return mod.default.chapters.length
}
