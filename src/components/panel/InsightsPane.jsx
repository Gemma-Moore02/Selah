import { useState }         from 'react'
import { useInsights }       from '@/hooks/useInsights'
import InsightCard           from './InsightCard'
import InsightDetailModal    from '@/components/modals/InsightDetailModal'
import MapModal              from '@/components/modals/MapModal'

export default function InsightsPane({ book, chapter }) {
  const { data: insights, isLoading } = useInsights(book, chapter)
  const [activeInsight,    setActiveInsight]    = useState(null)
  const [activeMapInsight, setActiveMapInsight] = useState(null)

  function handleOpenInsight(insight) {
    if (insight.type === 'geography') {
      setActiveMapInsight(insight)
    } else {
      setActiveInsight(insight)
    }
  }

  const hasInsights = insights && insights.length > 0

  return (
    <>
      <div className="insights-scroll">
        {isLoading && (
          <div className="comm-empty">Loading…</div>
        )}

        {!isLoading && !hasInsights && (
          <div className="comm-empty">
            No insights available for {book} {chapter}.
          </div>
        )}

        {!isLoading && hasInsights && insights.map((insight) => (
          <InsightCard
            key={insight.id}
            insight={insight}
            onOpen={handleOpenInsight}
          />
        ))}
      </div>

      {activeInsight && (
        <InsightDetailModal
          insight={activeInsight}
          onClose={() => setActiveInsight(null)}
        />
      )}

      {activeMapInsight && (
        <MapModal
          insight={activeMapInsight}
          onClose={() => setActiveMapInsight(null)}
        />
      )}
    </>
  )
}
