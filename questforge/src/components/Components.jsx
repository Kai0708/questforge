// Leaderboard
const LB_STATIC = [
  { name: 'Lady Seraphina', initials: 'LS', xp: 2400, level: 24 },
  { name: 'Brother Aldric', initials: 'BA', xp: 1850, level: 18 },
  { name: 'Mage Theron', initials: 'MT', xp: 1200, level: 12 },
  { name: 'Ranger Lyssa', initials: 'RL', xp: 980, level: 9 },
  { name: 'Paladin Dusk', initials: 'PD', xp: 740, level: 7 },
  { name: 'Rogue Nyx', initials: 'RN', xp: 520, level: 5 },
]

export function Leaderboard({ profile }) {
  const me = {
    name: profile?.display_name || 'Hero',
    initials: (profile?.display_name || 'H').slice(0, 2).toUpperCase(),
    xp: (profile?.xp || 0) + ((profile?.level || 1) - 1) * 100,
    level: profile?.level || 1,
    you: true,
  }
  const all = [...LB_STATIC, me].sort((a, b) => b.xp - a.xp)
  const ranks = ['🥇', '🥈', '🥉']

  return (
    <div style={{ flex: 1, padding: '1.8rem', overflowY: 'auto' }}>
      <div className="board-hdr">
        <div className="board-title">⚔ Hall of Champions</div>
      </div>
      {all.map((p, i) => (
        <div key={p.name} className={`lb-row ${p.you ? 'you' : ''}`}>
          <div className={`lb-rank ${i === 0 ? 'r1' : i === 1 ? 'r2' : i === 2 ? 'r3' : ''}`}>
            {i < 3 ? ranks[i] : i + 1}
          </div>
          <div className="lb-av">{p.initials}</div>
          <div className="lb-name">
            {p.name}
            {p.you && <span style={{ fontSize: '.62rem', color: 'var(--gold)', fontFamily: "'Almendra', serif", marginLeft: '.3rem' }}>(you)</span>}
          </div>
          <div className="lb-xp">✦ {p.xp.toLocaleString()} XP</div>
          <div className="lb-level">Lvl {p.level}</div>
        </div>
      ))}
    </div>
  )
}

// Settings
export function SettingsPage({ profile, onSave, onLogout }) {
  const [name, setName] = useState_local(profile?.display_name || '')
  const [heroClass, setHeroClass] = useState_local(profile?.hero_class || 'Adventurer')
  const [toggles, setToggles] = useState_local({ anim: true, sound: true, lvlup: true, remind: true })

  function tog(k) { setToggles(t => ({ ...t, [k]: !t[k] })) }

  return (
    <div className="settings-page">
      <div className="board-hdr"><div className="board-title">🏰 The Citadel</div></div>
      <div className="scard">
        <div className="scard-title">⚔ Hero Profile</div>
        <div className="fgroup"><label className="flabel">Hero Name</label><input className="finput" value={name} onChange={e => setName(e.target.value)} /></div>
        <div className="fgroup"><label className="flabel">Title / Class</label><input className="finput" value={heroClass} onChange={e => setHeroClass(e.target.value)} /></div>
        <button className="btn-realm" style={{ maxWidth: 180, fontSize: '.82rem', padding: '.6rem' }} onClick={() => onSave({ display_name: name, hero_class: heroClass })}>Save Profile</button>
      </div>
      <div className="scard">
        <div className="scard-title">🔔 Realm Settings</div>
        {[['anim', 'Gold rain animations'], ['sound', 'Sound effects (coin clinks)'], ['lvlup', 'Level-up celebrations'], ['remind', 'Daily streak reminders']].map(([k, lbl]) => (
          <div className="srow" key={k}>
            <span className="slabel">{lbl}</span>
            <div className={`toggle ${toggles[k] ? 'on' : ''}`} onClick={() => tog(k)}><div className="toggle-knob" /></div>
          </div>
        ))}
      </div>
      <div className="scard">
        <div className="scard-title">📊 Thy Legend</div>
        <div style={{ fontFamily: "'Almendra', serif", fontSize: '.85rem', color: 'var(--ink3)', lineHeight: 1.8 }}>
          <div>✦ Level: <strong style={{ color: 'var(--gold)' }}>{profile?.level || 1}</strong></div>
          <div>✦ Total XP earned: <strong style={{ color: 'var(--purple2)' }}>{((profile?.level || 1) - 1) * 100 + (profile?.xp || 0)}</strong></div>
          <div>✦ Longest streak: <strong style={{ color: '#FF8C00' }}>{profile?.longest_streak || 0} days</strong></div>
          <div>✦ Perfect days: <strong style={{ color: 'var(--gold)' }}>{profile?.perfect_days || 0}</strong></div>
          <div>✦ Gold collected: <strong style={{ color: 'var(--gold2)' }}>{profile?.gold || 0}</strong></div>
        </div>
      </div>
      <div className="scard">
        <div className="scard-title">🚪 Depart the Realm</div>
        <button className="btn-can" style={{ fontFamily: "'Almendra', serif", fontSize: '.82rem', padding: '.6rem 1.3rem' }} onClick={onLogout}>⚔ Depart from Realm</button>
      </div>
    </div>
  )
}

// Tiny local useState wrapper so we can use hooks in this file
import { useState as useState_local } from 'react'

// LevelUpOverlay
export function LevelUpOverlay({ level, onClose }) {
  return (
    <div className="lvlup-overlay">
      <div className="lvlup-box">
        <div style={{ fontSize: '2.8rem', marginBottom: '.4rem' }}>🎺</div>
        <div className="lvlup-title">✦ Level Up! ✦</div>
        <div className="lvlup-num">{level}</div>
        <div className="lvlup-sub">Thy power grows, brave hero!</div>
        <button className="btn-lvlclose" onClick={onClose}>Continue thy legend →</button>
      </div>
    </div>
  )
}

// XpPopup
export function XpPopup({ msg }) {
  return <div className="xp-popup">{msg}</div>
}

// GoldCoins
export function GoldCoins({ count }) {
  const coins = Array.from({ length: Math.min(count, 20) }, (_, i) => ({
    id: i,
    left: 15 + Math.random() * 70,
    top: 8 + Math.random() * 25,
    dur: 0.7 + Math.random() * 0.9,
    delay: i * 55,
  }))
  return (
    <>
      {coins.map(c => (
        <div
          key={c.id}
          className="coin"
          style={{ left: c.left + '%', top: c.top + '%', animationDuration: c.dur + 's', animationDelay: c.delay + 'ms' }}
        />
      ))}
    </>
  )
}
