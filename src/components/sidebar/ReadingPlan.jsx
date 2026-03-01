// TODO Phase 5+: wire to real reading plan data
export default function ReadingPlan() {
  return (
    <>
      <div className="sb-label">Reading Plan</div>
      <div style={{
        fontFamily: "'Jost', sans-serif",
        fontSize: '0.7rem',
        color: 'var(--ink-faint)',
        lineHeight: 1.6,
      }}>
        Gospels &amp; Acts
        <br />
        <span style={{ color: 'var(--accent-light)' }}>Day 18 of 90</span>
      </div>
      <div className="plan-bar">
        <div className="plan-fill" />
      </div>
    </>
  )
}
