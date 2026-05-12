import { useState, useEffect } from 'react'
import { getT, getThemeText } from './Components.jsx'

const DIFF_ICON = { trivial: '🪵', easy: '🗡', medium: '⚔', hard: '🔱', boss: '💀' }

export default function QuestBoard({ quests, allQuests, filter, setFilter, doneCount, perfectDay, onAdd, onEdit, onComplete, onDelete }) {
  const [, forceUpdate] = useState(0)
  useEffect(() => {
    const handler = () => forceUpdate(n => n + 1)
    window.addEventListener('medievalchange', handler)
    return () => window.removeEventListener('medievalchange', handler)
  }, [])

  const todayText = getT('today_progress')
    .replace('{done}', doneCount)
    .replace('{total}', allQuests.length)

  return (
    <div className="board">
      <div className="board-hdr">
        <div className="board-title">{getT('quest_board')}</div>
        <button className="btn-add" onClick={onAdd}>{getT('declare_quest')}</button>
      </div>

      {perfectDay && <div className="perfect-banner">{getT('perfect_day')}</div>}

      <div className="day-banner">
        {todayText}
        {allQuests.length > 0 && !perfectDay && <> · {getT('complete_all')}</>}
      </div>

      <div className="filtertabs">
        {[['all','filter_all'],['active','filter_active'],['boss','filter_boss'],['done','filter_done']].map(([f, tk]) => (
          <button key={f} className={`ftab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {getT(tk)}
          </button>
        ))}
      </div>

      <div className="quest-grid">
        {quests.length === 0 ? (
          <div className="empty-board">
            <span className="empty-icon">📜</span>
            <div className="empty-txt">{getThemeText('No tasks found.\nCreate your first one!', 'No quests found, brave soul.\nThe board awaits thy declarations!', 'No quests found, noble soul.\nThe royal board awaiteth thy proclamations!').split("\n").map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}</div>
          </div>
        ) : quests.map(q => (
          <div
            key={q.id}
            className={`qcard ${q.completed ? 'done' : ''} ${q.is_boss && !q.completed ? 'boss-card' : ''}`}
            onClick={() => onEdit(q)}
          >
            {q.is_boss && !q.completed && <div className="boss-ribbon">{getT('boss_ribbon')}</div>}
            <div className="qhdr">
              <div className="qtitle">{q.title}</div>
              <div className="diff-icon">{DIFF_ICON[q.difficulty] || '⚔'}</div>
            </div>
            {q.description && <div className="qdesc">{q.description}</div>}
            {q.is_boss && !q.completed && (
              <>
                <div className="boss-hp-lbl">
                  <span>{getT('boss_hp')}</span>
                  <span>{q.boss_progress}/{q.boss_total} {getT('stages_label')}</span>
                </div>
                <div className="boss-hp-track">
                  <div className="boss-hp-fill" style={{ width: `${Math.round((q.boss_total - q.boss_progress) / q.boss_total * 100)}%` }} />
                </div>
              </>
            )}
            <div className="qfooter">
              <span className="xp-tag">✦ {({ trivial: 10, easy: 25, medium: 50, hard: 100, boss: 200 }[q.difficulty] || 10)} XP</span>
              {q.estimated_minutes > 0 && <span className="time-tag">⏳ ~{q.estimated_minutes} {getT('min_label')}</span>}
              {q.due_at && <span className="time-tag">📅 {new Date(q.due_at).toLocaleString()}</span>}
              {q.due_at && q.notify_before_minutes >= 0 && <span className="time-tag">🔔 {q.notify_before_minutes}m before</span>}
              <div style={{ display: 'flex', gap: '.3rem' }}>
                {!q.completed && (
                  <button className="btn-complete" onClick={e => { e.stopPropagation(); onComplete(q) }}>
                    {q.is_boss ? getT('strike') : getT('complete')}
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
