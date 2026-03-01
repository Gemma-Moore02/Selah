// Verse-level section headings interspersed in the reader.
// SECTION_HEADINGS[book][chapter] = [{ beforeVerse, heading }]
// "beforeVerse: N" means the heading is rendered before verse N.

const SECTION_HEADINGS = {
  John: {
    1: [
      { beforeVerse: 1,  heading: 'The Word Became Flesh' },
      { beforeVerse: 19, heading: 'The Testimony of John the Baptist' },
      { beforeVerse: 35, heading: "Jesus' First Disciples" },
      { beforeVerse: 43, heading: 'Philip and Nathanael' },
    ],
    2: [
      { beforeVerse: 1,  heading: 'The Wedding at Cana' },
      { beforeVerse: 13, heading: 'Jesus Cleanses the Temple' },
    ],
    3: [
      { beforeVerse: 1,  heading: 'You Must Be Born Again' },
      { beforeVerse: 22, heading: 'John the Baptist Exalts Christ' },
    ],
    4: [
      { beforeVerse: 1,  heading: 'Jesus and the Samaritan Woman' },
      { beforeVerse: 27, heading: 'The Disciples Return' },
      { beforeVerse: 39, heading: 'Many Samaritans Believe' },
      { beforeVerse: 43, heading: "The Healing of the Official's Son" },
    ],
    5: [
      { beforeVerse: 1,  heading: 'The Healing at the Pool of Bethesda' },
      { beforeVerse: 19, heading: 'The Authority of the Son' },
      { beforeVerse: 31, heading: 'Witnesses to Jesus' },
    ],
    6: [
      { beforeVerse: 1,  heading: 'Feeding of the Five Thousand' },
      { beforeVerse: 16, heading: 'Jesus Walks on Water' },
      { beforeVerse: 25, heading: 'The Bread of Life' },
      { beforeVerse: 60, heading: 'Many Disciples Turn Away' },
    ],
    11: [
      { beforeVerse: 1,  heading: 'The Death of Lazarus' },
      { beforeVerse: 17, heading: 'Jesus Comforts the Sisters' },
      { beforeVerse: 38, heading: 'Jesus Raises Lazarus' },
    ],
    19: [
      { beforeVerse: 1,  heading: 'Jesus Delivered to Be Crucified' },
      { beforeVerse: 17, heading: 'The Crucifixion' },
      { beforeVerse: 31, heading: 'Jesus\' Side Is Pierced' },
      { beforeVerse: 38, heading: 'Jesus Is Buried' },
    ],
    20: [
      { beforeVerse: 1,  heading: 'The Empty Tomb' },
      { beforeVerse: 11, heading: 'Jesus Appears to Mary Magdalene' },
      { beforeVerse: 19, heading: 'Jesus Appears to the Disciples' },
      { beforeVerse: 24, heading: 'Jesus and Thomas' },
    ],
  },
}

export function getSections(book, chapter) {
  return SECTION_HEADINGS[book]?.[chapter] ?? []
}
