// TODO Phase 2: add onClick for note/highlight, hasNote prop, selected state

export default function VerseBlock({ verse, text }) {
  return (
    <div className="verse-block">
      <div className="v-num">{verse}</div>
      <div className="v-text">{text}</div>
      {/* Note dot — stub, activated in Phase 2 (SPEC-008) */}
      <div className="note-dot-wrap">
        <div className="note-dot empty" />
      </div>
    </div>
  )
}
