import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function CalendarSync({ onImport }) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState('')
  const [imported, setImported] = useState({})

  useEffect(() => {
    checkConnection()
  }, [])

  async function checkConnection() {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.provider_token) {
      setConnected(true)
      fetchEvents(session.provider_token)
    }
  }

  async function connectCalendar() {
    setLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://questforge-ashy.vercel.app',
        scopes: 'https://www.googleapis.com/auth/calendar.readonly',
        queryParams: { access_type: 'offline', prompt: 'consent' }
      }
    })
  }

  async function fetchEvents(token) {
    setSyncing(true)
    setError('')
    try {
      const now = new Date().toISOString()
      const future = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      const res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${now}&timeMax=${future}&singleEvents=true&orderBy=startTime&maxResults=20`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (!res.ok) {
        if (res.status === 401) { setConnected(false); setError('Session expired — reconnect calendar') }
        else setError('Failed to fetch calendar events')
        setSyncing(false); return
      }
      const data = await res.json()
      setEvents(data.items || [])
      setConnected(true)
    } catch (e) {
      setError('Could not reach Google Calendar')
    }
    setSyncing(false)
  }

  async function importAsQuest(event) {
    const { data: { session } } = await supabase.auth.getSession()
    const title = event.summary || 'Calendar Event'
    const start = event.start?.dateTime || event.start?.date
    const end = event.end?.dateTime || event.end?.date
    const mins = start && end ? Math.round((new Date(end) - new Date(start)) / 60000) : 30

    const { data: quest } = await supabase.from('quests').insert({
      user_id: session.user.id,
      title,
      description: event.description || `📅 From Google Calendar: ${start ? new Date(start).toLocaleString() : ''}`,
      difficulty: mins > 120 ? 'hard' : mins > 60 ? 'medium' : mins > 30 ? 'easy' : 'trivial',
      estimated_minutes: mins,
      is_boss: false,
      boss_progress: 0,
      boss_total: 1,
    }).select().single()

    await supabase.from('calendar_events').upsert({
      user_id: session.user.id,
      google_event_id: event.id,
      title,
      start_time: start,
      end_time: end,
      imported_as_quest: true,
      quest_id: quest?.id,
    })

    setImported(i => ({ ...i, [event.id]: true }))
    if (onImport) onImport(quest)
  }

  function formatDate(dateStr) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="scard">
      <div className="scard-title">📅 Google Calendar Sync</div>

      {error && (
        <div style={{ background: 'rgba(122,21,21,0.15)', border: '1px solid var(--crimson)', borderRadius: 2, padding: '.5rem .8rem', fontFamily: "'Almendra', serif", fontSize: '.8rem', color: 'var(--crimson2)', marginBottom: '.8rem' }}>
          {error}
        </div>
      )}

      {!connected ? (
        <div>
          <p style={{ fontFamily: "'Fondamento', cursive", fontSize: '.85rem', color: 'var(--ink3)', marginBottom: '1rem', fontStyle: 'italic' }}>
            Connect thy Google Calendar to import upcoming events as quests automatically.
          </p>
          <button className="btn-goog" onClick={connectCalendar} disabled={loading}>
            <svg width="15" height="15" viewBox="0 0 16 16"><path d="M15.5 8.17c0-.52-.05-1.02-.14-1.5H8v2.85h4.2a3.6 3.6 0 01-1.56 2.36v1.96h2.52c1.48-1.36 2.34-3.36 2.34-5.67z" fill="#4285F4"/><path d="M8 16c2.12 0 3.9-.7 5.2-1.9l-2.52-1.97C9.93 12.75 9.02 13 8 13a5.12 5.12 0 01-4.8-3.53H.6v2.03A8 8 0 008 16z" fill="#34A853"/><path d="M3.2 9.47A4.87 4.87 0 013 8c0-.51.1-1.01.2-1.47V4.5H.6A8 8 0 000 8c0 1.29.31 2.5.6 3.5l2.6-2.03z" fill="#FBBC05"/><path d="M8 3.13c1.2 0 2.27.41 3.12 1.22l2.33-2.33A8 8 0 00.6 4.5L3.2 6.53A4.88 4.88 0 018 3.13z" fill="#EA4335"/></svg>
            {loading ? 'Connecting...' : 'Connect Google Calendar'}
          </button>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontFamily: "'Almendra', serif", fontSize: '.8rem', color: 'var(--forest2)' }}>✅ Calendar connected</span>
            <button className="btn-complete" onClick={async () => {
              const { data: { session } } = await supabase.auth.getSession()
              if (session?.provider_token) fetchEvents(session.provider_token)
              else { setConnected(false); setError('Reconnect thy calendar') }
            }} disabled={syncing}>
              {syncing ? '⏳ Syncing...' : '🔄 Refresh'}
            </button>
          </div>

          {syncing && (
            <div style={{ fontFamily: "'Almendra', serif", fontSize: '.8rem', color: 'var(--ink3)', textAlign: 'center', padding: '1rem' }}>
              ⏳ Fetching thy calendar scrolls...
            </div>
          )}

          {!syncing && events.length === 0 && (
            <div style={{ fontFamily: "'Fondamento', cursive", fontSize: '.85rem', color: 'var(--ink3)', fontStyle: 'italic', textAlign: 'center', padding: '1rem' }}>
              No upcoming events in the next 7 days
            </div>
          )}

          {!syncing && events.map(event => (
            <div key={event.id} style={{
              background: 'rgba(22,14,4,0.06)',
              border: '1px solid rgba(200,145,30,0.25)',
              borderRadius: 2, padding: '.7rem .9rem', marginBottom: '.5rem',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '.5rem'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Almendra', serif", fontSize: '.85rem', color: 'var(--ink)', fontWeight: 700 }}>
                  📅 {event.summary || 'Untitled Event'}
                </div>
                <div style={{ fontFamily: "'Fondamento', cursive", fontSize: '.75rem', color: 'var(--ink3)', fontStyle: 'italic', marginTop: '.15rem' }}>
                  {formatDate(event.start?.dateTime || event.start?.date)}
                </div>
              </div>
              {imported[event.id] ? (
                <span style={{ fontFamily: "'Almendra', serif", fontSize: '.7rem', color: 'var(--forest2)' }}>✅ Added</span>
              ) : (
                <button className="btn-complete" onClick={() => importAsQuest(event)}>
                  + Import
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
