// TODO Phase 6: onClick opens TranslationModal
export default function TranslationBadge({ translation = 'KJV' }) {
  return (
    <button className="trans-badge" type="button">
      {translation}
    </button>
  )
}
