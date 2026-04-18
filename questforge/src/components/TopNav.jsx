export default function TopNav({ profile, page, setPage, onLogout }) {
  const initial = (profile?.display_name || 'H').slice(0, 1).toUpperCase()
  return (
    <nav className="topnav">
      <div className="brand">✦ Questforge</div>
      <div className="navlinks">
        <button className={`navbtn ${page === 'board' ? 'active' : ''}`} onClick={() => setPage('board')}>📜 Quest Board</button>
        <button className={`navbtn ${page === 'lb' ? 'active' : ''}`} onClick={() => setPage('lb')}>⚔ Rankings</button>
        <button className={`navbtn ${page === 'settings' ? 'active' : ''}`} onClick={() => setPage('settings')}>🏰 Citadel</button>
      </div>
      <div className="nav-r">
        <div className="nav-streak"><span className="flame">🔥</span>{profile?.current_streak || 0}</div>
        <div className="nav-gold">🪙 {profile?.gold || 0}</div>
        <div className="avatar-orb" onClick={() => setPage('settings')}>{initial}</div>
      </div>
    </nav>
  )
}
