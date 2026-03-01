const BASE = 'https://api.scripture.api.bible/v1'

// USFM book abbreviations for API.Bible
const BOOK_IDS = {
  'Genesis': 'GEN', 'Exodus': 'EXO', 'Leviticus': 'LEV', 'Numbers': 'NUM',
  'Deuteronomy': 'DEU', 'Joshua': 'JOS', 'Judges': 'JDG', 'Ruth': 'RUT',
  '1 Samuel': '1SA', '2 Samuel': '2SA', '1 Kings': '1KI', '2 Kings': '2KI',
  '1 Chronicles': '1CH', '2 Chronicles': '2CH', 'Ezra': 'EZR', 'Nehemiah': 'NEH',
  'Esther': 'EST', 'Job': 'JOB', 'Psalms': 'PSA', 'Proverbs': 'PRO',
  'Ecclesiastes': 'ECC', 'Song of Solomon': 'SNG', 'Isaiah': 'ISA',
  'Jeremiah': 'JER', 'Lamentations': 'LAM', 'Ezekiel': 'EZK', 'Daniel': 'DAN',
  'Hosea': 'HOS', 'Joel': 'JOL', 'Amos': 'AMO', 'Obadiah': 'OBA',
  'Jonah': 'JON', 'Micah': 'MIC', 'Nahum': 'NAM', 'Habakkuk': 'HAB',
  'Zephaniah': 'ZEP', 'Haggai': 'HAG', 'Zechariah': 'ZEC', 'Malachi': 'MAL',
  'Matthew': 'MAT', 'Mark': 'MRK', 'Luke': 'LUK', 'John': 'JHN',
  'Acts': 'ACT', 'Romans': 'ROM', '1 Corinthians': '1CO', '2 Corinthians': '2CO',
  'Galatians': 'GAL', 'Ephesians': 'EPH', 'Philippians': 'PHP', 'Colossians': 'COL',
  '1 Thessalonians': '1TH', '2 Thessalonians': '2TH', '1 Timothy': '1TI',
  '2 Timothy': '2TI', 'Titus': 'TIT', 'Philemon': 'PHM', 'Hebrews': 'HEB',
  'James': 'JAS', '1 Peter': '1PE', '2 Peter': '2PE', '1 John': '1JN',
  '2 John': '2JN', '3 John': '3JN', 'Jude': 'JUD', 'Revelation': 'REV',
}

// Parse "[1] verse text [2] verse text …" into [{ verse, text }, …]
function parseVerseText(content) {
  const parts = content.split(/\[(\d+)\]/)
  const verses = []
  for (let i = 1; i < parts.length; i += 2) {
    const verse = parseInt(parts[i], 10)
    const text = (parts[i + 1] ?? '')
      .replace(/¶/g, '')
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    if (text) verses.push({ verse, text })
  }
  return verses
}

/**
 * Fetch a chapter from API.Bible.
 * @param {string} bibleId  - API.Bible Bible ID (e.g. 'de4e12af7f28f599-02')
 * @param {string} book     - Book name (e.g. 'John')
 * @param {number} chapter  - Chapter number
 * @returns {Promise<Array<{ verse: number, text: string }>>}
 */
export async function fetchChapterApiBible(bibleId, book, chapter) {
  const apiKey = import.meta.env.VITE_API_BIBLE_KEY
  if (!apiKey) throw new Error('No API.Bible key configured.')

  const bookId = BOOK_IDS[book]
  if (!bookId) throw new Error(`Unknown book: ${book}`)

  const chapterId = `${bookId}.${chapter}`
  const params = new URLSearchParams({
    'content-type':           'text',
    'include-verse-numbers':  'true',
    'include-titles':         'false',
    'include-chapter-numbers':'false',
  })

  const res = await fetch(
    `${BASE}/bibles/${bibleId}/chapters/${chapterId}?${params}`,
    { headers: { 'api-key': apiKey } }
  )

  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText)
    throw new Error(`API.Bible ${res.status}: ${msg}`)
  }

  const json = await res.json()
  return parseVerseText(json.data?.content ?? '')
}
