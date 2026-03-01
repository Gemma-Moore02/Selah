/**
 * scripts/fetch-mhcc.js
 *
 * Downloads Matthew Henry's Concise Commentary (1706, public domain) from the
 * Christian Classics Ethereal Library in ThML/XML format and converts it to
 * per-book JSON files matching the app's commentary schema.
 *
 * Usage:
 *   node scripts/fetch-mhcc.js
 *
 * Output: src/data/commentaries/matthew-henry/{bookname}.json
 *   e.g., genesis.json, 1corinthians.json, songofsolomon.json
 *
 * This is a one-time data pipeline. Run it once and commit the generated files.
 * The john.json that was hand-curated will be overwritten with the full CCEL text.
 */

import { writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname }        from 'path'
import { fileURLToPath }           from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTDIR    = resolve(__dirname, '../src/data/commentaries/matthew-henry')
const CCEL_URL  = 'https://ccel.org/ccel/h/henry/mhcc.xml'

const SKIP_BOOKS = new Set(['Title Page', 'Indexes'])

// ── Helpers ─────────────────────────────────────────────────────────────────

/** "Song of Solomon" → "songofsolomon" (matches useCommentary hook normalization) */
function toFileName(name) {
  return name.toLowerCase().replace(/\s+/g, '')
}

/** Strip all XML/HTML tags and decode common entities */
function stripTags(str) {
  return str
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Extract all <p>…</p> paragraph texts from a block of XML */
function extractParagraphs(block) {
  const paras = []
  const re = /<p[^>]*>([\s\S]*?)<\/p>/gi
  let m
  while ((m = re.exec(block)) !== null) {
    const text = stripTags(m[1])
    if (text.length > 30) paras.push(text)
  }
  return paras
}

/**
 * Build a human-readable entry title from the h3 content.
 * "Verses 1, 2"  → "Genesis 1:1, 2"
 * "Chapter 1"    → "Genesis 1"  (chapter intro)
 * "Verse 14"     → "Genesis 1:14"
 */
function buildTitle(book, chapter, h3Raw) {
  const clean = stripTags(h3Raw)
  if (/^chapter\s*\d+/i.test(clean)) {
    return `${book} ${chapter}`
  }
  const ref = clean.replace(/^verses?\s+/i, '').trim()
  return `${book} ${chapter}:${ref}`
}

/** Extract the starting verse number from an h3 heading */
function extractVerse(h3Raw) {
  const clean = stripTags(h3Raw)
  if (/^chapter\s*\d+/i.test(clean)) return 0
  const m = clean.match(/(\d+)/)
  return m ? parseInt(m[1], 10) : 0
}

/**
 * Some books in the CCEL XML use Structure A (div class="Commentary" blocks)
 * and some use Structure B (flat <p> paragraphs with <b><scripRef> headings).
 *
 * Structure A:  <div class="Commentary"><h3>Verses 1, 2</h3><p>…</p></div>
 * Structure B:  <p><b><scripRef passage="…">Eccl. 1:1-3</scripRef></b> text…</p>
 */

/**
 * Parse Structure A: <div class="Commentary"> blocks with <h3> headings.
 * Returns entries for one chapter.
 */
function parseStructureA(chapChunk, bookTitle, chapter) {
  const entries = []
  let idx = 0

  while (true) {
    const start = chapChunk.indexOf('<div class="Commentary"', idx)
    if (start === -1) break

    // Depth-counted search for the matching </div>
    let depth = 0
    let end   = -1
    for (let i = start; i < chapChunk.length; i++) {
      if (chapChunk[i] !== '<') continue
      if (chapChunk.substr(i, 4) === '<div' &&
          (chapChunk[i + 4] === ' ' || chapChunk[i + 4] === '>')) {
        depth++
      } else if (chapChunk.substr(i, 6) === '</div>') {
        depth--
        if (depth === 0) { end = i + 6; break }
      }
    }

    if (end === -1) break

    const block = chapChunk.slice(start, end)
    idx = end

    const h3M = block.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i)
    if (!h3M) continue

    const h3Raw      = h3M[1]
    const title      = buildTitle(bookTitle, chapter, h3Raw)
    const verse      = extractVerse(h3Raw)
    const paragraphs = extractParagraphs(block)

    if (paragraphs.length > 0) {
      entries.push({ chapter, verse, title, paragraphs })
    }
  }

  return entries
}

/**
 * Parse Structure B: flat <p><b><scripRef>…</scripRef></b> text…</p> paragraphs.
 * Returns entries for one chapter.
 */
function parseStructureB(chapChunk, bookTitle, chapter) {
  const entries = []

  // Each <p> that begins with <b><scripRef ...>ref text</scripRef></b> is a verse entry
  const re = /<p[^>]*><b><scripRef[^>]+>([^<]+)<\/scripRef><\/b>([\s\S]*?)<\/p>/gi
  let m

  while ((m = re.exec(chapChunk)) !== null) {
    const refText = m[1].trim()    // e.g. "Eccl. 1:1-3"
    const body    = stripTags(m[2]).trim()

    if (body.length < 20) continue

    // Extract the first verse number from the reference text
    const verseM = refText.match(/:(\d+)/)
    const verse  = verseM ? parseInt(verseM[1], 10) : 0

    // Build a clean title from the reference
    const title = `${bookTitle} ${chapter}:${refText.replace(/^[A-Za-z.]+\s*\d+\s*:/, '')}`

    entries.push({ chapter, verse, title, paragraphs: [body] })
  }

  return entries
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`Fetching: ${CCEL_URL}`)
  const res = await fetch(CCEL_URL)
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)

  const xml = await res.text()
  console.log(`Downloaded ${(xml.length / 1024 / 1024).toFixed(2)} MB\n`)

  mkdirSync(OUTDIR, { recursive: true })

  // Split into book sections (each chunk begins after "<div1 ")
  const bookChunks = xml.split(/<div1\s/)
  let bookCount    = 0

  for (const chunk of bookChunks.slice(1)) {
    const titleM = chunk.match(/title="([^"]+)"/)
    if (!titleM) continue

    const bookTitle = titleM[1]
    if (SKIP_BOOKS.has(bookTitle)) continue

    // Split into chapter sections (each chunk begins after "<div2 ")
    const chapChunks = chunk.split(/<div2\s/)
    const entries    = []

    for (const chapChunk of chapChunks.slice(1)) {
      const chapM = chapChunk.match(/title="Chapter (\d+)"/)
      if (!chapM) continue
      const chapter = parseInt(chapM[1], 10)

      // Detect structure by presence of <div class="Commentary">
      const usesStructureA = chapChunk.includes('<div class="Commentary"')

      const chapEntries = usesStructureA
        ? parseStructureA(chapChunk, bookTitle, chapter)
        : parseStructureB(chapChunk, bookTitle, chapter)

      entries.push(...chapEntries)
    }

    if (entries.length === 0) {
      console.warn(`  ⚠  ${bookTitle}: 0 entries — skipped`)
      continue
    }

    const fileName = `${toFileName(bookTitle)}.json`
    const output   = {
      source:  'Matthew Henry',
      dates:   '1662–1714',
      book:    bookTitle,
      entries,
    }

    writeFileSync(resolve(OUTDIR, fileName), JSON.stringify(output, null, 2), 'utf8')
    console.log(`  ✓  ${bookTitle.padEnd(24)} ${String(entries.length).padStart(3)} entries → ${fileName}`)
    bookCount++
  }

  console.log(`\nDone. ${bookCount} books written to src/data/commentaries/matthew-henry/`)
}

main().catch(e => { console.error(e.message); process.exit(1) })
