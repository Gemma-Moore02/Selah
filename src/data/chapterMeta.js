// Long-form book names for ChapterHeader display.
// Falls back to the short name if not listed.
export const BOOK_LONG_NAMES = {
  // Pentateuch
  Genesis:          'The First Book of Moses',
  Exodus:           'The Second Book of Moses',
  Leviticus:        'The Third Book of Moses',
  Numbers:          'The Fourth Book of Moses',
  Deuteronomy:      'The Fifth Book of Moses',
  // Gospels & Acts
  Matthew:          'The Gospel According to Matthew',
  Mark:             'The Gospel According to Mark',
  Luke:             'The Gospel According to Luke',
  John:             'The Gospel According to John',
  Acts:             'The Acts of the Apostles',
  // Pauline epistles
  Romans:           'The Epistle to the Romans',
  '1 Corinthians':  'The First Epistle to the Corinthians',
  '2 Corinthians':  'The Second Epistle to the Corinthians',
  Galatians:        'The Epistle to the Galatians',
  Ephesians:        'The Epistle to the Ephesians',
  Philippians:      'The Epistle to the Philippians',
  Colossians:       'The Epistle to the Colossians',
  '1 Thessalonians':'The First Epistle to the Thessalonians',
  '2 Thessalonians':'The Second Epistle to the Thessalonians',
  '1 Timothy':      'The First Epistle to Timothy',
  '2 Timothy':      'The Second Epistle to Timothy',
  Titus:            'The Epistle to Titus',
  Philemon:         'The Epistle to Philemon',
  // General epistles
  Hebrews:          'The Epistle to the Hebrews',
  James:            'The Epistle of James',
  '1 Peter':        'The First Epistle of Peter',
  '2 Peter':        'The Second Epistle of Peter',
  '1 John':         'The First Epistle of John',
  '2 John':         'The Second Epistle of John',
  '3 John':         'The Third Epistle of John',
  Jude:             'The Epistle of Jude',
  Revelation:       'The Revelation of John',
  // Poetry / Wisdom
  Psalms:           'The Book of Psalms',
  Proverbs:         'The Proverbs of Solomon',
  'Song of Solomon':'The Song of Solomon',
}

// Optional chapter-level subtitles shown below the chapter title.
// Keyed as CHAPTER_SUBTITLES[book][chapter].
export const CHAPTER_SUBTITLES = {
  John: {
    1:  'The Word Becomes Flesh · The Witness of John',
    2:  'The Wedding at Cana · The Temple Cleansed',
    3:  'Nicodemus · The Witness of John the Baptist',
    4:  'Jesus and the Woman of Samaria · The Official\'s Son',
    5:  'The Healing at Bethesda · Jesus\' Authority',
    6:  'Feeding of the Five Thousand · The Bread of Life',
    11: 'The Death and Raising of Lazarus',
    14: 'The Way, the Truth, and the Life',
    15: 'The True Vine · The Hatred of the World',
    17: 'The High Priestly Prayer',
    19: 'The Crucifixion of Jesus',
    20: 'The Empty Tomb · The Risen Christ',
    21: 'The Miraculous Catch · Jesus and Peter',
  },
}

export function getBookLongName(book) {
  return BOOK_LONG_NAMES[book] ?? book
}

export function getChapterSubtitle(book, chapter) {
  return CHAPTER_SUBTITLES[book]?.[chapter] ?? null
}
