import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'

export default function App() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        setSession(session ?? null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  if (session === undefined) {
    return (
      <div className="loading-screen">
        <div className="loading-text">✦ Entering the Realm... ✦</div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <Routes>
        <Route path="/login" element={!session ? <AuthPage /> : <Navigate to="/" replace />} />
        <Route path="/*" element={session ? <Dashboard session={session} /> : <Navigate to="/login" replace />} />
      </Routes>
    </div>
  )
}
