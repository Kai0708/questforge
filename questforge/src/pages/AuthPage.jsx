import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AuthPage() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setError(''); setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  async function handleRegister(e) {
    e.preventDefault()
    setError(''); setLoading(true)
    if (!name.trim()) { setError('A hero must have a name!'); setLoading(false); return }
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { display_name: name } }
    })
    if (error) setError(error.message)
    else setMessage('Check thy email to confirm thy account, then return here to login!')
    setLoading(false)
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'https://questforge-ashy.vercel.app' }
    })
  }

  return (
    <div className="auth-page">
      <svg className="castle-art" width="210" height="115" viewBox="0 0 210 115">
        <rect x="20" y="68" width="170" height="47" fill="#1C1710"/>
        <rect x="20" y="38" width="32" height="34" fill="#1C1710"/>
        <rect x="89" y="27" width="32" height="45" fill="#1C1710"/>
        <rect x="158" y="38" width="32" height="34" fill="#1C1710"/>
        <rect x="20" y="30" width="8" height="12" fill="#1C1710"/><rect x="32" y="30" width="8" height="12" fill="#1C1710"/><rect x="44" y="30" width="8" height="12" fill="#1C1710"/>
        <rect x="89" y="19" width="8" height="12" fill="#1C1710"/><rect x="101" y="19" width="8" height="12" fill="#1C1710"/><rect x="113" y="19" width="8" height="12" fill="#1C1710"/>
        <rect x="158" y="30" width="8" height="12" fill="#1C1710"/><rect x="170" y="30" width="8" height="12" fill="#1C1710"/><rect x="182" y="30" width="8" height="12" fill="#1C1710"/>
        <rect x="90" y="82" width="30" height="33" fill="#080604"/>
        <ellipse cx="105" cy="82" rx="15" ry="11" fill="#080604"/>
        <line x1="97" y1="78" x2="97" y2="115" stroke="#2E2618" strokeWidth="2"/>
        <line x1="105" y1="75" x2="105" y2="115" stroke="#2E2618" strokeWidth="2"/>
        <line x1="113" y1="78" x2="113" y2="115" stroke="#2E2618" strokeWidth="2"/>
        <rect x="76" y="68" width="4" height="12" fill="#6B5A35"/>
        <ellipse cx="78" cy="65" rx="5" ry="7" fill="#FF8C00" opacity=".9"/>
        <ellipse cx="78" cy="62" rx="3" ry="4" fill="#FFD700" opacity=".7"/>
        <rect x="130" y="68" width="4" height="12" fill="#6B5A35"/>
        <ellipse cx="132" cy="65" rx="5" ry="7" fill="#FF8C00" opacity=".9"/>
        <ellipse cx="132" cy="62" rx="3" ry="4" fill="#FFD700" opacity=".7"/>
        <circle cx="45" cy="14" r="1.5" fill="#F7D070" opacity=".8"/>
        <circle cx="82" cy="7" r="1" fill="#F7D070" opacity=".6"/>
        <circle cx="148" cy="11" r="1.5" fill="#F7D070" opacity=".8"/>
        <ellipse cx="105" cy="102" rx="22" ry="8" fill="#C8911E" opacity=".12"/>
      </svg>

      <div className="realm-name">✦ Questforge ✦</div>
      <div className="realm-tagline">Where heroes vanquish procrastination</div>

      <div className="auth-card">
        <div className="wax-seal">⚜</div>
        <div className="auth-heading">{mode === 'login' ? 'Enter the Realm' : 'Forge Thy Legend'}</div>

        {error && <div className="auth-error">{error}</div>}
        {message && <div className="auth-error" style={{color:'var(--forest2)',borderColor:'var(--forest2)',background:'rgba(15,51,32,0.15)'}}>{message}</div>}

        <form onSubmit={mode === 'login' ? handleLogin : handleRegister}>
          {mode === 'register' && (
            <div className="fgroup">
              <label className="flabel">⚔ Hero Name</label>
              <input className="finput" type="text" placeholder="Sir Aldric the Bold" value={name} onChange={e => setName(e.target.value)} required />
            </div>
          )}
          <div className="fgroup">
            <label className="flabel">✦ Email Scroll</label>
            <input className="finput" type="email" placeholder="hero@realm.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="fgroup">
            <label className="flabel">🛡 Password Ward</label>
            <input className="finput" type="password" placeholder={mode === 'register' ? 'Min 6 characters' : '••••••••'} value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button className="btn-realm" type="submit" disabled={loading}>
            {loading ? '⏳ One moment...' : mode === 'login' ? '⚔ Enter the Realm' : '✦ Begin Thy Legend'}
          </button>
        </form>

        <div className="auth-divider">or</div>
        <button className="btn-goog" onClick={handleGoogle}>
          <svg width="15" height="15" viewBox="0 0 16 16"><path d="M15.5 8.17c0-.52-.05-1.02-.14-1.5H8v2.85h4.2a3.6 3.6 0 01-1.56 2.36v1.96h2.52c1.48-1.36 2.34-3.36 2.34-5.67z" fill="#4285F4"/><path d="M8 16c2.12 0 3.9-.7 5.2-1.9l-2.52-1.97C9.93 12.75 9.02 13 8 13a5.12 5.12 0 01-4.8-3.53H.6v2.03A8 8 0 008 16z" fill="#34A853"/><path d="M3.2 9.47A4.87 4.87 0 013 8c0-.51.1-1.01.2-1.47V4.5H.6A8 8 0 000 8c0 1.29.31 2.5.6 3.5l2.6-2.03z" fill="#FBBC05"/><path d="M8 3.13c1.2 0 2.27.41 3.12 1.22l2.33-2.33A8 8 0 00.6 4.5L3.2 6.53A4.88 4.88 0 018 3.13z" fill="#EA4335"/></svg>
          Ride forth with Google
        </button>

        <div className="auth-switch">
          {mode === 'login'
            ? <>New to the realm? <span onClick={() => { setMode('register'); setError(''); setMessage(''); }}>Forge thy legend</span></>
            : <>Already a hero? <span onClick={() => { setMode('login'); setError(''); setMessage(''); }}>Return to the gate</span></>
          }
        </div>
      </div>
    </div>
  )
}
