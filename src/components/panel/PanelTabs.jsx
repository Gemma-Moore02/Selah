const TABS = [
  { id: 'notes',       label: 'Notes' },
  { id: 'commentary',  label: 'Commentary' },
  { id: 'insights',    label: 'Insights' },
]

export default function PanelTabs({ activePane, onPaneChange }) {
  return (
    <div className="panel-tabs">
      {TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          className={`ptab${activePane === t.id ? ' active' : ''}`}
          onClick={() => onPaneChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
