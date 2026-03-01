import { Highlighter, Eraser, PenLine, StickyNote, BookOpen, Lightbulb } from 'lucide-react'
import { useStudyStore } from '@/store/studyStore'
import { useUIStore }   from '@/store/uiStore'

const COLORS = [
  { key: 'yellow', cls: 'sw-y' },
  { key: 'green',  cls: 'sw-g' },
  { key: 'blue',   cls: 'sw-b' },
  { key: 'pink',   cls: 'sw-p' },
  { key: 'purple', cls: 'sw-u' },
]

export default function ToolStrip() {
  const toolMode          = useStudyStore((s) => s.toolMode)
  const activeColor       = useStudyStore((s) => s.activeHighlightColor)
  const setToolMode       = useStudyStore((s) => s.setToolMode)
  const setHighlightColor = useStudyStore((s) => s.setHighlightColor)

  const panelOpen     = useUIStore((s) => s.panelOpen)
  const activePane    = useUIStore((s) => s.activePane)
  const setPanelOpen  = useUIStore((s) => s.setPanelOpen)
  const setActivePane = useUIStore((s) => s.setActivePane)

  function handleSwatchClick(color) {
    setHighlightColor(color)
    setToolMode('highlight')
  }

  function handlePanelToggle(pane) {
    if (!panelOpen) {
      setActivePane(pane)
      setPanelOpen(true)
    } else if (activePane === pane) {
      setPanelOpen(false)
    } else {
      setActivePane(pane)
    }
  }

  function isPaneActive(pane) {
    return panelOpen && activePane === pane
  }

  return (
    <div className="tool-strip">
      <div className="strip-label">Tools</div>

      {/* Tool mode buttons */}
      <button
        className={`tbtn${toolMode === 'highlight' ? ' active' : ''}`}
        type="button"
        title="Highlight"
        onClick={() => setToolMode('highlight')}
      >
        <Highlighter size={15} strokeWidth={1.5} />
      </button>

      <button
        className={`tbtn${toolMode === 'erase' ? ' active' : ''}`}
        type="button"
        title="Erase highlight"
        onClick={() => setToolMode('erase')}
      >
        <Eraser size={15} strokeWidth={1.5} />
      </button>

      <button
        className={`tbtn${toolMode === 'note' ? ' active' : ''}`}
        type="button"
        title="Note"
        onClick={() => setToolMode('note')}
      >
        <PenLine size={15} strokeWidth={1.5} />
      </button>

      <div className="t-div" />

      {/* Color swatches */}
      {COLORS.map((c) => (
        <div
          key={c.key}
          className={`hl-sw ${c.cls}${activeColor === c.key ? ' active' : ''}`}
          title={c.key}
          role="button"
          tabIndex={0}
          onClick={() => handleSwatchClick(c.key)}
          onKeyDown={(e) => e.key === 'Enter' && handleSwatchClick(c.key)}
        />
      ))}

      <div className="t-div" />

      {/* Panel toggle buttons */}
      <button
        className={`tbtn${isPaneActive('notes') ? ' panel-active' : ''}`}
        type="button"
        title="Notes"
        onClick={() => handlePanelToggle('notes')}
      >
        <StickyNote size={15} strokeWidth={1.5} />
      </button>

      <button
        className={`tbtn${isPaneActive('commentary') ? ' panel-active' : ''}`}
        type="button"
        title="Commentary"
        onClick={() => handlePanelToggle('commentary')}
      >
        <BookOpen size={15} strokeWidth={1.5} />
      </button>

      <button
        className={`tbtn${isPaneActive('insights') ? ' panel-active' : ''}`}
        type="button"
        title="Insights"
        onClick={() => handlePanelToggle('insights')}
      >
        <Lightbulb size={15} strokeWidth={1.5} />
      </button>
    </div>
  )
}
