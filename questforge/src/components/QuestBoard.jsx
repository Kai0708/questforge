const DIFF_ICON = { trivial: '🪵', easy: '🗡', medium: '⚔', hard: '🔱', boss: '💀' }

export default function QuestBoard({ quests, allQuests, filter, setFilter, doneCount, perfectDay, onAdd, onEdit, onComplete, onDelete }) {
  return (
    <div className="board">
      <div className="board-hdr">
        <div className="board-title">📜 The Quest Board</div>
        <button className="btn-add" onClick={onAdd}>+ Declare Quest</button>
      </div>

      {perfectDay && (
        <div className="perfect-banner">⚜ Perfect Day! All quests conquered! +50 Bonus XP! ⚜</div>
      )}

      <div className="day-banner">
        📊 Today: <span>{doneCount}</span> of <span>{allQuests.length}</span> quests complete
        {allQuests.length > 0 && !perfectDay && <> · Complete all for <strong>+50 Bonus XP!</strong></>}
      </div>

      <div className="filtertabs">
        {['all', 'active', 'boss', 'done'].map(f => (
          <button key={f} className={`ftab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All Quests' : f === 'active' ? 'Active' : f === 'boss' ? '⚔ Boss' : 'Completed'}
          </button>
        ))}
      </div>

      <div className="quest-grid">
        {quests.length === 0 ? (
          <div className="empty-board">
            <span className="empty-icon">📜</span>
            <div className="empty-txt">No quests found, brave soul.<br />The board awaits thy declarations!</div>
          </div>
        ) : quests.map(q => (
          <div
            key={q.id}
            className={`qcard ${q.completed ? 'done' : ''} ${q.is_boss && !q.completed ? 'boss-card' : ''}`}
            onClick={() => onEdit(q)}
          >
            {q.is_boss && !q.completed && <div className="boss-ribbon">⚔ Boss</div>}
            <div className="qhdr">
              <div className="qtitle">{q.title}</div>
              <div className="diff-icon">{DIFF_ICON[q.difficulty] || '⚔'}</div>
            </div>
            {q.description && <div className="qdesc">{q.description}</div>}
            {q.is_boss && !q.completed && (
              <>
                <div className="boss-hp-lbl">
                  <span>⚔ Boss HP</span>
                  <span>{q.boss_progress}/{q.boss_total} stages</span>
                </div>
                <div className="boss-hp-track">
                  <div className="boss-hp-fill" style={{ width: `${Math.round((q.boss_total - q.boss_progress) / q.boss_total * 100)}%` }} />
                </div>
              </>
            )}
            <div className="qfooter">
              <span className="xp-tag">✦ {({ trivial: 10, easy: 25, medium: 50, hard: 100, boss: 200 }[q.difficulty] || 10)} XP</span>
              {q.estimated_minutes > 0 && <span className="time-tag">⏳ ~{q.estimated_minutes}min</span>}
              <div style={{ display: 'flex', gap: '.3rem' }}>
                {!q.completed && (
                  <button className="btn-complete" onClick={e => { e.stopPropagation(); onComplete(q) }}>
                    {q.is_boss ? '⚔ Strike!' : '✓ Complete'}
                  </button>
                )}
                <button className="btn-del" onClick={e => { e.stopPropagation(); onDelete(q.id) }}>✕</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
