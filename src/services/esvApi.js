const BASE = 'https://api.esv.org/v3/passage/text/'

// Parse ESV API response into [{ verse, text }, …]
// ESV returns lines like "[1] In the beginning..." with footnote markers we strip.
function parseEsvText(text) {
  // Remove footnote markers like [1] inside text — ESV uses (1) style but let's strip both
  // Remove headings in all-caps lines, blank lines, etc.
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  const verses = []

  for (const line of lines) {
    // ESV verse lines start with [N] where N is verse number
    const m = line.match(/^\[(\d+)\](.*)$/)
    if (!m) continue
    const verse = parseInt(m[1], 10)
    const raw   = m[2]
      .replace(/\(\d+\)/g, '')   // strip footnote refs like (1)
      .replace(/\s+/g, ' ')
      .trim()
    if (raw) verses.push({ verse, text: raw })
  }
  return verses
}

/**
 * Fetch a chapter from the ESV API.
 * @param {string} book    - Book name (e.g. 'John')
 * @param {number} chapter - Chapter number
 * @returns {Promise<Array<{ verse: number, text: string }>>}
 */
export async function fetchChapterEsv(book, chapter) {
  const apiKey = import.meta.env.VITE_ESV_KEY
  if (!apiKey) throw new Error('No ESV API key configured.')

  const query   = `${book} ${chapter}`
  const params  = new URLSearchParams({
    q:                         query,
    'include-headings':        'false',
    'include-footnotes':       'false',
    'include-verse-numbers':   'true',
    'include-short-copyright': 'false',
    'include-passage-references': 'false',
  })

  const res = await fetch(`${BASE}?${params}`, {
    headers: { Authorization: `Token ${apiKey}` },
  })

  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText)
    throw new Error(`ESV API ${res.status}: ${msg}`)
  }

  const json = await res.json()
  const raw  = (json.passages ?? []).join('\n')
  return parseEsvText(raw)
}
