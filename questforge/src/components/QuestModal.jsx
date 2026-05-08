import { useState, useEffect } from 'react'
import { getT, getThemeText } from './Components.jsx'

const DIFFS = [
  { key: 'trivial', icon: '🪵', label: 'Trivial', xp: 10 },
  { key: 'easy', icon: '🗡', label: 'Easy', xp: 25 },
  { key: 'medium', icon: '⚔', label: 'Medium', xp: 50 },
  { key: 'hard', icon: '🔱', label: 'Hard', xp: 100 },
  { key: 'boss', icon: '💀', label: 'Boss', xp: 200 },
]

export default function QuestModal({ quest, onSave, onClose }) {
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [diff, setDiff] = useState('trivial')
  const [time, setTime] = useState('')
  const [bossTotal, setBossTotal] = useState(5)
  const [, forceUpdate] = useState(0)

  useEffect(() => {
    if (quest) {
      setTitle(quest.title || '')
      setDesc(quest.description || '')
      setDiff(quest.difficulty || 'trivial')
      setTime(quest.estimated_minutes || '')
      setBossTotal(quest.boss_total || 5)
    }
    const handler = () => forceUpdate(n => n + 1)
    window.addEventListener('medievalchange', handler)
    return () => window.removeEventListener('medievalchange', handler)
  }, [quest])

  function handleSave() {
    if (!title.trim()) { alert(getThemeText('A task must have a title!', 'A quest must have a title!', 'Verily, a quest must bear a title!')); return }
    const isBoss = diff === 'boss'
    onSave({
      title: title.trim(),
      description: desc.trim(),
      difficulty: diff,
      estimated_minutes: parseInt(time) || 0,
      is_boss: isBoss,
      boss_total: isBoss ? (parseInt(bossTotal) || 5) : 1,
      boss_progress: quest?.boss_progress || 0,
    })
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <button className="modal-x" onClick={onClose}>✕</button>
        <div className="modal-title">{quest ? getT('edit_quest') : getT('declare_new')}</div>

        <div className="fgroup">
          <label className="flabel">{getThemeText('Task Title', 'Quest Title', 'Quest Title')}</label>
          <input className="finput" type="text" placeholder={getThemeText('Finish quarterly report...', 'Slay the inbox dragon...', 'Smite the dread inbox wyrm...')} value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div className="fgroup">
          <label className="flabel">{getThemeText('Description', 'Description', 'Chronicle')}</label>
          <textarea className="finput" placeholder={getThemeText('Describe the task...', 'Describe thy noble undertaking...', 'Pray describe thine noble undertaking...')} value={desc} onChange={e => setDesc(e.target.value)} />
        </div>
        <div className="fgroup">
          <label className="flabel">{getT('difficulty_label')}</label>
          <div className="diff-sel">
            {DIFFS.map(d => (
              <div key={d.key} className={`dopt ${diff === d.key ? 'sel' : ''}`} onClick={() => setDiff(d.key)}>
                <span className="d-em">{d.icon}</span>
                {d.label}<br /><small>{d.xp} XP</small>
              </div>
            ))}
          </div>
        </div>
        <div className="fgroup">
          <label className="flabel">{getT('time_label')}</label>
          <input className="finput" type="number" placeholder="30" min="1" value={time} onChange={e => setTime(e.target.value)} />
        </div>
        {diff === 'boss' && (
          <div className="fgroup">
            <label className="flabel">{getT('boss_stages')}</label>
            <input className="finput" type="number" placeholder="5" min="2" max="20" value={bossTotal} onChange={e => setBossTotal(e.target.value)} />
          </div>
        )}
        <div className="modal-actions">
          <button className="btn-can" onClick={onClose}>{getT('cancel')}</button>
          <button className="btn-sub" onClick={handleSave}>{quest ? getT('save_changes') : getT('declare_btn')}</button>
        </div>
      </div>
    </div>
  )
}
