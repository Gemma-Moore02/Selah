import InsightChip from './InsightChip'

const HL_BACKGROUND = {
  yellow: 'var(--hl-yellow)',
  green:  'var(--hl-green)',
  blue:   'var(--hl-blue)',
  pink:   'var(--hl-pink)',
  purple: 'var(--hl-purple)',
}

export default function VerseBlock({ verse, text, highlightColor, onClick, insights, onOpenInsight }) {
  const style = {}
  if (highlightColor) style.background = HL_BACKGROUND[highlightColor]
  if (onClick)        style.cursor = 'pointer'

  return (
    <div className="verse-block" style={style} onClick={onClick}>
      <div className="v-num">{verse}</div>
      <div className="v-text">
        {text}
        {insights && insights.map((insight) => (
          <InsightChip key={insight.id} insight={insight} onOpen={onOpenInsight} />
        ))}
      </div>
      {/* Note dot — activated in SPEC-008 */}
      <div className="note-dot-wrap">
        <div className="note-dot empty" />
      </div>
    </div>
  )
}
