import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      if (event === 'SIGNED_IN') {
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-text">✦ Entering the Realm... ✦</div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <Routes>
        <Route path="/login" element={!session ? <AuthPage /> : <Navigate to="/" />} />
        <Route path="/*" element={session ? <Dashboard session={session} /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  )
}
