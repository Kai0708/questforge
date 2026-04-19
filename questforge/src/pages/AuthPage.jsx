import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { getT } from '../components/Components.jsx'

export default function AuthPage() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [, forceUpdate] = useState(0)

  useEffect(() => {
    const handler = () => forceUpdate(n => n + 1)
    window.addEventListener('medievalchange', handler)
    return () => window.removeEventListener('medievalchange', handler)
  }, [])

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
    else setMessage('Check thy email to confirm thy account!')
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
      <div className="realm-name">{getT('brand')}</div>
      <div className="realm-tagline">{getT('tagline')}</div>
      <div className="auth-card">
        <div className="wax-seal">⚜</div>
        <div className="auth-heading">{mode === 'login' ? getT('login_heading') : getT('begin_legend')}</div>
        {error && <div className="auth-error">{error}</div>}
        {message && <div className="auth-error" style={{color:'var(--forest2)',borderColor:'var(--forest2)'}}>{message}</div>}
        <form onSubmit={mode === 'login' ? handleLogin : handleRegister}>
          {mode === 'register' && (
            <div className="fgroup">
              <label className="flabel">{getT('name_label')}</label>
              <input className="finput" type="text" placeholder="Sir Aldric the Bold" value={name} onChange={e => setName(e.target.value)} required />
            </div>
          )}
          <div className="fgroup">
            <label className="flabel">{getT('email_label')}</label>
            <input className="finput" type="email" placeholder="hero@realm.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="fgroup">
            <label className="flabel">{getT('password_label')}</label>
            <input className="finput" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button className="btn-realm" type="submit" disabled={loading}>
            {loading ? '⏳ One moment...' : mode === 'login' ? getT('enter_realm') : getT('begin_legend')}
          </button>
        </form>
        <div className="auth-divider">or</div>
        <button className="btn-goog" onClick={handleGoogle}>
          <svg width="15" height="15" viewBox="0 0 16 16"><path d="M15.5 8.17c0-.52-.05-1.02-.14-1.5H8v2.85h4.2a3.6 3.6 0 01-1.56 2.36v1.96h2.52c1.48-1.36 2.34-3.36 2.34-5.67z" fill="#4285F4"/><path d="M8 16c2.12 0 3.9-.7 5.2-1.9l-2.52-1.97C9.93 12.75 9.02 13 8 13a5.12 5.12 0 01-4.8-3.53H.6v2.03A8 8 0 008 16z" fill="#34A853"/><path d="M3.2 9.47A4.87 4.87 0 013 8c0-.51.1-1.01.2-1.47V4.5H.6A8 8 0 000 8c0 1.29.31 2.5.6 3.5l2.6-2.03z" fill="#FBBC05"/><path d="M8 3.13c1.2 0 2.27.41 3.12 1.22l2.33-2.33A8 8 0 00.6 4.5L3.2 6.53A4.88 4.88 0 018 3.13z" fill="#EA4335"/></svg>
          Ride forth with Google
        </button>
        <div className="auth-switch">
          {mode === 'login'
            ? <>{getT('new_to_realm')} <span onClick={() => { setMode('register'); setError(''); setMessage('') }}>{getT('forge_legend')}</span></>
            : <>{getT('already_hero')} <span onClick={() => { setMode('login'); setError(''); setMessage('') }}>{getT('return_gate')}</span></>
          }
        </div>
      </div>
    </div>
  )
}
