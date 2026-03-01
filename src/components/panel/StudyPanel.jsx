import { useUIStore }    from '@/store/uiStore'
import PanelTabs        from './PanelTabs'
import NotesPane        from './NotesPane'
import CommentaryPane   from './CommentaryPane'
import InsightsPane     from './InsightsPane'

export default function StudyPanel({ book, chapter }) {
  const panelOpen     = useUIStore((s) => s.panelOpen)
  const activePane    = useUIStore((s) => s.activePane)
  const setActivePane = useUIStore((s) => s.setActivePane)

  return (
    <div className={`study-panel${panelOpen ? ' open' : ''}`}>
      <div className="panel-inner">
        <PanelTabs activePane={activePane} onPaneChange={setActivePane} />

        <div className={`pane${activePane === 'notes' ? ' active' : ''}`}>
          <NotesPane book={book} chapter={chapter} />
        </div>

        <div className={`pane${activePane === 'commentary' ? ' active' : ''}`}>
          <CommentaryPane book={book} chapter={chapter} />
        </div>

        <div className={`pane${activePane === 'insights' ? ' active' : ''}`}>
          <InsightsPane book={book} chapter={chapter} />
        </div>
      </div>
    </div>
  )
}
