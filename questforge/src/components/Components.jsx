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

const MEDIEVAL_LEVELS = [
  { value: 0, label: 'Modern', desc: 'Clean, minimal UI', fonts: "'Inter', sans-serif", bg: '#f8f9fa', card: '#ffffff', text: '#1a1a1a', accent: '#6366f1', border: '#e2e8f0' },
  { value: 25, label: 'Rustic', desc: 'Wooden tavern vibes', fonts: "'Georgia', serif", bg: '#2a1f0e', card: '#F0D9A0', text: '#2a1208', accent: '#b8860b', border: '#CEB87A' },
  { value: 50, label: 'Medieval', desc: 'Classic castle aesthetic', fonts: "'Fondamento', cursive", bg: '#1a1208', card: '#F4E4B8', text: '#160E04', accent: '#C8911E', border: '#CEB87A' },
  { value: 75, label: 'Dark Ages', desc: 'Gritty stone and shadow', fonts: "'Almendra', serif", bg: '#0d0905', card: '#D4B87A', text: '#0a0703', accent: '#8B6518', border: '#A07828' },
  { value: 100, label: 'Full Epic', desc: 'Maximum medieval immersion', fonts: "'Almendra Display', serif", bg: '#080603', card: '#C9A85C', text: '#080603', accent: '#C8911E', border: '#8B6518' },
]

export function SettingsPage({ profile, onSave, onLogout, onQuestImport }) {
  const [name, setName] = useState_local(profile?.display_name || '')
  const [heroClass, setHeroClass] = useState_local(profile?.hero_class || 'Adventurer')
  const [toggles, setToggles] = useState_local({ anim: true, sound: true, lvlup: true, remind: true })
  const [medievalness, setMedievalness] = useState_local(() => parseInt(localStorage.getItem('qf_medieval') || '100'))

  function tog(k) { setToggles(t => ({ ...t, [k]: !t[k] })) }

  function applyMedievalness(val) {
    setMedievalness(val)
    localStorage.setItem('qf_medieval', val)
    const level = MEDIEVAL_LEVELS.reduce((prev, curr) => Math.abs(curr.value - val) < Math.abs(prev.value - val) ? curr : prev)
    const root = document.documentElement
    if (val === 0) {
      root.style.setProperty('--parch', '#ffffff')
      root.style.setProperty('--parch2', '#f1f5f9')
      root.style.setProperty('--parch3', '#e2e8f0')
      root.style.setProperty('--gold', '#6366f1')
      root.style.setProperty('--gold2', '#818cf8')
      root.style.setProperty('--gold3', '#a5b4fc')
      root.style.setProperty('--ink', '#1e293b')
      root.style.setProperty('--ink3', '#475569')
      root.style.setProperty('--purple', '#4f46e5')
      root.style.setProperty('--purple2', '#6366f1')
      document.body.style.background = '#f1f5f9'
      document.body.style.fontFamily = "'Inter', sans-serif"
    } else if (val <= 25) {
      root.style.setProperty('--parch', '#F5E8C0')
      root.style.setProperty('--parch2', '#E8D498')
      root.style.setProperty('--parch3', '#D4B870')
      root.style.setProperty('--gold', '#b8860b')
      root.style.setProperty('--gold2', '#DAA520')
      root.style.setProperty('--gold3', '#FFD700')
      root.style.setProperty('--ink', '#2a1208')
      root.style.setProperty('--ink3', '#5a3215')
      root.style.setProperty('--purple', '#5c2d91')
      root.style.setProperty('--purple2', '#7c3db1')
      document.body.style.background = '#2a1f0e'
      document.body.style.fontFamily = "'Georgia', serif"
    } else if (val <= 50) {
      root.style.removeProperty('--parch')
      root.style.removeProperty('--parch2')
      root.style.removeProperty('--parch3')
      root.style.removeProperty('--gold')
      root.style.removeProperty('--gold2')
      root.style.removeProperty('--gold3')
      root.style.removeProperty('--ink')
      root.style.removeProperty('--ink3')
      root.style.removeProperty('--purple')
      root.style.removeProperty('--purple2')
      document.body.style.background = ''
      document.body.style.fontFamily = ''
    } else if (val <= 75) {
      root.style.setProperty('--parch', '#D8C48A')
      root.style.setProperty('--parch2', '#C8A860')
      root.style.setProperty('--parch3', '#A88840')
      root.style.setProperty('--gold', '#8B6518')
      root.style.setProperty('--gold2', '#A07828')
      root.style.setProperty('--gold3', '#C89A30')
      root.style.setProperty('--ink', '#0a0703')
      root.style.setProperty('--ink3', '#2a1a08')
      document.body.style.background = '#0d0905'
      document.body.style.fontFamily = "'Almendra', serif"
    } else {
      root.style.setProperty('--parch', '#C9A85C')
      root.style.setProperty('--parch2', '#B89040')
      root.style.setProperty('--parch3', '#9A7828')
      root.style.setProperty('--gold', '#C8911E')
      root.style.setProperty('--gold2', '#E8B84A')
      root.style.setProperty('--gold3', '#F7D070')
      root.style.setProperty('--ink', '#080603')
      root.style.setProperty('--ink3', '#1a0e05')
      document.body.style.background = '#080603'
      document.body.style.fontFamily = "'Almendra Display', serif"
    }
  }

  const currentLevel = MEDIEVAL_LEVELS.reduce((prev, curr) => Math.abs(curr.value - medievalness) < Math.abs(prev.value - medievalness) ? curr : prev)

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
        <div className="scard-title">⚔ Medieval-ness</div>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.5rem' }}>
            <span style={{ fontFamily: "'Almendra', serif", fontSize: '.8rem', color: 'var(--ink3)' }}>Modern</span>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Almendra Display', serif", fontSize: '1rem', color: 'var(--gold)', fontWeight: 700 }}>{currentLevel.label}</div>
              <div style={{ fontFamily: "'Fondamento', cursive", fontSize: '.7rem', color: 'var(--ink3)', fontStyle: 'italic' }}>{currentLevel.desc}</div>
            </div>
            <span style={{ fontFamily: "'Almendra', serif", fontSize: '.8rem', color: 'var(--ink3)' }}>Full Epic</span>
          </div>
          <input
            type="range" min="0" max="100" step="25"
            value={medievalness}
            onChange={e => applyMedievalness(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--gold)', cursor: 'pointer', height: '6px' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '.3rem' }}>
            {MEDIEVAL_LEVELS.map(l => (
              <span key={l.value} style={{
                fontFamily: "'Almendra', serif", fontSize: '.6rem',
                color: medievalness === l.value ? 'var(--gold)' : 'var(--ink3)',
                fontWeight: medievalness === l.value ? 700 : 400,
                cursor: 'pointer'
              }} onClick={() => applyMedievalness(l.value)}>{l.label}</span>
            ))}
          </div>
        </div>
      </div>

      <CalendarSyncWrapper onImport={onQuestImport} />
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

function CalendarSyncWrapper({ onImport }) {
  const [CalendarSync, setCalendarSync] = useState_local(null)
  useState_local(() => {
    import('./CalendarSync.jsx').then(m => setCalendarSync(() => m.default))
  }, [])
  if (!CalendarSync) return null
  return <CalendarSync onImport={onImport} />
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
