import InsightChip from './InsightChip'

const HL_BACKGROUND = {
  yellow: 'var(--hl-yellow)',
  green:  'var(--hl-green)',
  blue:   'var(--hl-blue)',
  pink:   'var(--hl-pink)',
  purple: 'var(--hl-purple)',
}

export default function VerseBlock({ verse, text, highlightColor, onClick, insights, onOpenInsight, hasNote }) {
  const style = {}
  if (highlightColor) style.background = HL_BACKGROUND[highlightColor]

  return (
    <div
      className={`verse-block${hasNote ? ' has-note' : ''}`}
      style={style}
      onClick={onClick}
    >
      <div className="v-num">{verse}</div>
      <div className="v-text">
        {text}
        {insights && insights.map((insight) => (
          <InsightChip key={insight.id} insight={insight} onOpen={onOpenInsight} />
        ))}
      </div>
      <div className="note-dot-wrap">
        <div className={`note-dot${hasNote ? '' : ' empty'}`} />
      </div>
    </div>
  )
}
