import { useUIStore }    from '@/store/uiStore'
import PanelTabs        from './PanelTabs'
import CommentaryPane   from './CommentaryPane'
import InsightsPane     from './InsightsPane'

export default function StudyPanel({ book, chapter }) {
  const panelOpen   = useUIStore((s) => s.panelOpen)
  const activePane  = useUIStore((s) => s.activePane)
  const setActivePane = useUIStore((s) => s.setActivePane)

  return (
    <div className={`study-panel${panelOpen ? ' open' : ''}`}>
      <div className="panel-inner">
        <PanelTabs activePane={activePane} onPaneChange={setActivePane} />

        {/* Notes pane — stub until SPEC-008 */}
        <div className={`pane${activePane === 'notes' ? ' active' : ''}`}>
          <div className="pane-stub">
            <div className="pane-stub-label">Notes</div>
            <div className="pane-stub-note">Coming in the next phase.</div>
          </div>
        </div>

        {/* Commentary pane */}
        <div className={`pane${activePane === 'commentary' ? ' active' : ''}`}>
          <CommentaryPane book={book} chapter={chapter} />
        </div>

        {/* Insights pane */}
        <div className={`pane${activePane === 'insights' ? ' active' : ''}`}>
          <InsightsPane book={book} chapter={chapter} />
        </div>
      </div>
    </div>
  )
}
