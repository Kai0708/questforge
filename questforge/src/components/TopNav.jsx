import { useState, useEffect } from 'react'
import { getT } from './Components.jsx'

export default function TopNav({ profile, page, setPage, onLogout }) {
  const [, forceUpdate] = useState(0)
  useEffect(() => {
    const handler = () => forceUpdate(n => n + 1)
    window.addEventListener('medievalchange', handler)
    return () => window.removeEventListener('medievalchange', handler)
  }, [])

  const initial = (profile?.display_name || 'H').slice(0, 1).toUpperCase()
  return (
    <nav className="topnav">
      <div className="brand">{getT('brand')}</div>
      <div className="navlinks">
        <button className={`navbtn ${page === 'board' ? 'active' : ''}`} onClick={() => setPage('board')}>{getT('quest_board')}</button>
        <button className={`navbtn ${page === 'friends' ? 'active' : ''}`} onClick={() => setPage('friends')}>{getT('fellowship')}</button>
        <button className={`navbtn ${page === 'lb' ? 'active' : ''}`} onClick={() => setPage('lb')}>{getT('rankings')}</button>
        <button className={`navbtn ${page === 'settings' ? 'active' : ''}`} onClick={() => setPage('settings')}>{getT('citadel')}</button>
      </div>
      <div className="nav-r">
        <div className="nav-streak"><span className="flame">🔥</span>{profile?.current_streak || 0}</div>
        <div className="nav-gold">🪙 {profile?.gold || 0}</div>
        <div className="avatar-orb" onClick={() => setPage('settings')}>{initial}</div>
      </div>
    </nav>
  )
}
