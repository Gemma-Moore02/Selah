export default function TranslationBadge({ translation = 'KJV', onOpen }) {
  return (
    <button className="trans-badge" type="button" onClick={onOpen}>
      {translation}
    </button>
  )
}
