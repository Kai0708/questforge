import { useState, useEffect } from 'react'

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

  useEffect(() => {
    if (quest) {
      setTitle(quest.title || '')
      setDesc(quest.description || '')
      setDiff(quest.difficulty || 'trivial')
      setTime(quest.estimated_minutes || '')
      setBossTotal(quest.boss_total || 5)
    }
  }, [quest])

  function handleSave() {
    if (!title.trim()) { alert('A quest must have a title, brave hero!'); return }
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
        <div className="modal-title">{quest ? '📜 Edit Quest' : '📜 Declare a New Quest'}</div>

        <div className="fgroup">
          <label className="flabel">Quest Title</label>
          <input className="finput" type="text" placeholder="Slay the inbox dragon..." value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div className="fgroup">
          <label className="flabel">Description</label>
          <textarea className="finput" placeholder="Describe thy noble undertaking..." value={desc} onChange={e => setDesc(e.target.value)} />
        </div>
        <div className="fgroup">
          <label className="flabel">Difficulty</label>
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
          <label className="flabel">Est. Time (minutes)</label>
          <input className="finput" type="number" placeholder="30" min="1" value={time} onChange={e => setTime(e.target.value)} />
        </div>
        {diff === 'boss' && (
          <div className="fgroup">
            <label className="flabel">Boss Stages (total)</label>
            <input className="finput" type="number" placeholder="5" min="2" max="20" value={bossTotal} onChange={e => setBossTotal(e.target.value)} />
          </div>
        )}
        <div className="modal-actions">
          <button className="btn-can" onClick={onClose}>Cancel</button>
          <button className="btn-sub" onClick={handleSave}>⚔ {quest ? 'Save Changes' : 'Declare!'}</button>
        </div>
      </div>
    </div>
  )
}
