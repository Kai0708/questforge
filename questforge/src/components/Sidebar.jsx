import { useState, useEffect } from 'react'
import { getT } from './Components.jsx'

const ACHIEVEMENTS = [
  { id: 'first', name: 'First Blood', icon: '⚔', check: p => p.total_done >= 1 },
  { id: 'ten', name: 'Veteran', icon: '🛡', check: p => p.total_done >= 10 },
  { id: 'streak7', name: 'Week Warrior', icon: '🔥', check: p => p.current_streak >= 7 },
  { id: 'boss', name: 'Dragon Slayer', icon: '🐉', check: p => p.boss_kills >= 1 },
  { id: 'perfect', name: 'Perfect Day', icon: '⭐', check: p => p.perfect_days >= 1 },
  { id: 'gold', name: 'Gold Hoarder', icon: '🪙', check: p => p.gold >= 500 },
]

export default function Sidebar({ profile, timerSec, timerOn, onTimerToggle }) {
  const [, forceUpdate] = useState(0)
  useEffect(() => {
    const handler = () => forceUpdate(n => n + 1)
    window.addEventListener('medievalchange', handler)
    return () => window.removeEventListener('medievalchange', handler)
  }, [])

  const level = profile?.level || 1
  const xp = profile?.xp || 0
  const needed = level * 100
  const pct = Math.min(100, Math.round(xp / needed * 100))
  const m = Math.floor(timerSec / 60)
  const s = timerSec % 60
  const timeStr = `${m}:${s < 10 ? '0' : ''}${s}`

  return (
    <aside className="sidebar">
      <div className="parch-card">
        <div className="lvl-badge">{level}</div>
        <div className="char-name">{profile?.display_name || 'Hero'}</div>
        <div className="char-class">{profile?.hero_class || 'Adventurer'}</div>
        <div className="xp-lbl">{getT('xp_label')}</div>
        <div className="xp-track"><div className="xp-fill" style={{ width: pct + '%' }} /></div>
        <div className="xp-num">{xp} / {needed} XP</div>
        <div className="stat-row">
          <div className="stat-cell"><div className="stat-val">{profile?.total_done || 0}</div><div className="stat-lbl">{getT('stat_quests')}</div></div>
          <div className="stat-cell"><div className="stat-val">{profile?.gold || 0}</div><div className="stat-lbl">{getT('stat_gold')}</div></div>
          <div className="stat-cell"><div className="stat-val">{profile?.current_streak || 0}</div><div className="stat-lbl">{getT('stat_streak')}</div></div>
        </div>
      </div>

      <div className="torch-card">
        <div className="widget-title">{getT('daily_flame')}</div>
        <span className="big-flame">🔥</span>
        <div className="streak-num">{profile?.current_streak || 0}</div>
        <div className="streak-sub">{getT('days_glory')}</div>
      </div>

      <div className="timer-card">
        <div className="widget-title">{getT('hourglass')}</div>
        <div className="timer-num">{timeStr}</div>
        <div className="timer-sub">{timerOn ? `⏳ ${timerSec}s remaining` : '+15 XP upon completion'}</div>
        <button className="btn-timer" onClick={onTimerToggle}>
          {timerOn ? getT('abandon_quest') : getT('begin_quest')}
        </button>
      </div>

      <div className="achv-card">
        <div className="widget-title">{getT('achievements')}</div>
        <div className="achv-grid">
          {ACHIEVEMENTS.map(a => (
            <div key={a.id} className={`achv ${a.check(profile || {}) ? '' : 'locked'}`} title={a.name}>
              <span className="achv-icon">{a.icon}</span>
              <div className="achv-name">{a.name}</div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
