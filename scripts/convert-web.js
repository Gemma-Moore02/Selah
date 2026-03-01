/**
 * SPEC-002: Convert a scrollmapper translation JSON into per-book files.
 *
 * Usage:
 *   node scripts/convert-web.js [path/to/Translation.json]
 *
 * Default input: C:/Users/gemja/OneDrive/Projects/bible_databases/formats/json/KJV.json
 * Output:        src/data/translations/web/{bookname}.json  (one file per book)
 *
 * Input schema (scrollmapper format):
 *   { "books": [{ "name": "Genesis", "chapters": [{ "chapter": 1, "verses": [...] }] }] }
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const INPUT = process.argv[2]
  ? resolve(process.argv[2])
  : 'C:/Users/gemja/OneDrive/Projects/bible_databases/formats/json/KJV.json'

const OUTDIR = resolve(__dirname, '../src/data/translations/web')

// "1 Corinthians" → "1corinthians"
function toFileName(bookName) {
  return bookName.toLowerCase().replace(/\s+/g, '')
}

// ── Main ────────────────────────────────────────────────────────────
if (!existsSync(INPUT)) {
  console.error(`ERROR: Input file not found:\n  ${INPUT}`)
  console.error('\nUsage: node scripts/convert-web.js [path/to/Translation.json]')
  process.exit(1)
}

console.log(`Reading: ${INPUT}`)
const raw = JSON.parse(readFileSync(INPUT, 'utf8'))
const books = raw.books ?? raw

if (!Array.isArray(books) || !books[0]?.chapters) {
  console.error('Unexpected format. Expected { "books": [{ "name", "chapters" }] }')
  console.error('Keys found:', Object.keys(raw).slice(0, 5).join(', '))
  process.exit(1)
}

mkdirSync(OUTDIR, { recursive: true })

let count = 0
for (const book of books) {
  const fileName = `${toFileName(book.name)}.json`
  const outPath  = resolve(OUTDIR, fileName)
  const payload  = JSON.stringify({ book: book.name, chapters: book.chapters }, null, 2)
  writeFileSync(outPath, payload, 'utf8')
  console.log(`  ✓  ${fileName}`)
  count++
}

console.log(`\nDone. ${count} book files written to src/data/translations/web/`)
