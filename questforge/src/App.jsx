import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default function App() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
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
        <Route path="/login" element={!session ? <AuthPage /> : <Navigate to="/" />} />
        <Route path="/*" element={session ? <Dashboard session={session} /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  )
}
