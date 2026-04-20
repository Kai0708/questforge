import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { getT } from './Components.jsx'

export default function FriendsPage({ profile }) {
  const [tab, setTab] = useState('friends')
  const [friends, setFriends] = useState([])
  const [pending, setPending] = useState([])
  const [incoming, setIncoming] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')
  const [, forceUpdate] = useState(0)

  useEffect(() => {
    loadFriends()
    const handler = () => forceUpdate(n => n + 1)
    window.addEventListener('medievalchange', handler)
    return () => window.removeEventListener('medievalchange', handler)
  }, [])

  async function loadFriends() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { data: reqs } = await supabase.from('friendships').select('*').or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
    if (!reqs) { setLoading(false); return }
    const acceptedIds = [], pendingOut = [], pendingIn = []
    for (const r of reqs) {
      if (r.status === 'accepted') acceptedIds.push(r.requester_id === user.id ? r.addressee_id : r.requester_id)
      else if (r.status === 'pending') {
        if (r.requester_id === user.id) pendingOut.push(r)
        else pendingIn.push(r)
      }
    }
    if (acceptedIds.length > 0) {
      const { data: fp } = await supabase.from('public_profiles').select('*').in('id', acceptedIds)
      setFriends(fp || [])
    } else setFriends([])
    if (pendingIn.length > 0) {
      const { data: ip } = await supabase.from('public_profiles').select('*').in('id', pendingIn.map(r => r.requester_id))
      setIncoming((ip || []).map(p => ({ ...p, friendship_id: pendingIn.find(r => r.requester_id === p.id)?.id })))
    } else setIncoming([])
    setPending(pendingOut)
    setLoading(false)
  }

  async function searchUsers() {
    if (!searchQuery.trim()) return
    setSearching(true)
    const { data: { user } } = await supabase.auth.getUser()
    let data = []
    // Search by name OR by short ID (first 8 chars of UUID)
    const q = searchQuery.trim().toUpperCase()
    const isId = /^[0-9A-F]{6,8}$/.test(q)
    if (isId) {
      // Search by UUID prefix
      const { data: byId } = await supabase.from('public_profiles').select('*').ilike('id', `${searchQuery.trim().toLowerCase()}%`).neq('id', user.id).limit(5)
      data = byId || []
    } else {
      const { data: byName } = await supabase.from('public_profiles').select('*').ilike('display_name', `%${searchQuery}%`).neq('id', user.id).limit(10)
      data = byName || []
    }
    setSearchResults(data)
    setSearching(false)
  }

  async function sendRequest(addresseeId) {
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('friendships').insert({ requester_id: user.id, addressee_id: addresseeId, status: 'pending' })
    if (error) setMsg(error.code === '23505' ? 'Request already sent!' : 'Could not send: ' + error.message)
    else { setMsg('Request sent!'); setSearchResults(r => r.filter(x => x.id !== addresseeId)) }
    setTimeout(() => setMsg(''), 3000)
  }

  async function acceptRequest(friendshipId, friendId) {
    await supabase.from('friendships').update({ status: 'accepted' }).eq('id', friendshipId)
    setIncoming(i => i.filter(x => x.friendship_id !== friendshipId))
    const { data: fp } = await supabase.from('public_profiles').select('*').eq('id', friendId).single()
    if (fp) setFriends(f => [...f, fp])
    setMsg('Friend added!')
    setTimeout(() => setMsg(''), 3000)
  }

  async function declineRequest(friendshipId) {
    await supabase.from('friendships').delete().eq('id', friendshipId)
    setIncoming(i => i.filter(x => x.friendship_id !== friendshipId))
  }

  async function removeFriend(friendId) {
    if (!confirm('Remove this friend?')) return
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('friendships').delete().or(`and(requester_id.eq.${user.id},addressee_id.eq.${friendId}),and(requester_id.eq.${friendId},addressee_id.eq.${user.id})`)
    setFriends(f => f.filter(x => x.id !== friendId))
  }

  const myTotalXp = (profile?.xp || 0) + ((profile?.level || 1) - 1) * 100
  const allForLb = [
    { id: 'me', display_name: profile?.display_name || 'You', level: profile?.level || 1, xp: myTotalXp, current_streak: profile?.current_streak || 0, you: true },
    ...friends.map(f => ({ ...f, xp: (f.xp || 0) + ((f.level || 1) - 1) * 100 }))
  ].sort((a, b) => b.xp - a.xp)
  const ranks = ['🥇', '🥈', '🥉']

  const card = (children) => (
    <div style={{ background: 'linear-gradient(155deg, var(--parch) 0%, var(--parch2) 60%, var(--parch3) 100%)', border: '2px solid var(--gold)', borderRadius: 3, padding: '1.3rem 1.5rem', marginBottom: '1rem' }}>
      {children}
    </div>
  )

  return (
    <div style={{ flex: 1, padding: '1.8rem', overflowY: 'auto' }}>
      <div className="board-hdr">
        <div className="board-title">{getT('fellowship')}</div>
      </div>

      {msg && <div style={{ background: 'rgba(15,51,32,0.2)', border: '1px solid var(--forest2)', borderRadius: 2, padding: '.5rem .9rem', fontFamily: "'Almendra', serif", fontSize: '.82rem', color: 'var(--forest2)', marginBottom: '1rem' }}>{msg}</div>}

      <div className="filtertabs" style={{ marginBottom: '1.5rem' }}>
        <button className={`ftab ${tab === 'friends' ? 'active' : ''}`} onClick={() => setTab('friends')}>⚔ {getT('fellowship')} {friends.length > 0 && `(${friends.length})`}</button>
        <button className={`ftab ${tab === 'lb' ? 'active' : ''}`} onClick={() => setTab('lb')}>🏆 {getT('fellowship_lb')}</button>
        <button className={`ftab ${tab === 'search' ? 'active' : ''}`} onClick={() => setTab('search')}>{getT('find_heroes')}</button>
        <button className={`ftab ${tab === 'requests' ? 'active' : ''}`} onClick={() => setTab('requests')}>
          {getT('requests_tab')} {incoming.length > 0 && <span style={{ background: 'var(--crimson2)', color: '#fff', borderRadius: '50%', padding: '0 5px', fontSize: '.6rem', marginLeft: '.3rem' }}>{incoming.length}</span>}
        </button>
      </div>

      {tab === 'friends' && (
        loading ? <div style={{ textAlign: 'center', padding: '2rem', fontFamily: "'Almendra', serif", color: 'var(--parch3)', fontStyle: 'italic' }}>{getT('loading_fellowship')}</div>
        : friends.length === 0 ? (
          <div className="empty-board"><span className="empty-icon">⚔</span><div className="empty-txt">{getT('fellowship_empty')}</div></div>
        ) : friends.map(f => (
          <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: '.9rem', padding: '.9rem 1rem', background: 'linear-gradient(155deg, var(--parch) 0%, var(--parch2) 100%)', border: '1.5px solid var(--parch3)', borderRadius: 3, marginBottom: '.6rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, var(--purple), var(--crimson))', border: '2px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Almendra Display', serif", fontSize: '.85rem', color: 'var(--gold3)', flexShrink: 0 }}>
              {(f.display_name || 'H').slice(0, 2).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Almendra', serif", fontSize: '.92rem', color: 'var(--ink)', fontWeight: 700 }}>{f.display_name}</div>
              <div style={{ fontFamily: "'Fondamento', cursive", fontSize: '.72rem', color: 'var(--ink3)', fontStyle: 'italic' }}>ID: {f.id?.slice(0,8).toUpperCase()}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Almendra Display', serif", fontSize: '.9rem', color: 'var(--gold)' }}>Lvl {f.level}</div>
              <div style={{ fontFamily: "'Almendra', serif", fontSize: '.65rem', color: 'var(--ink3)' }}>🔥 {f.current_streak}d</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Almendra Display', serif", fontSize: '.85rem', color: 'var(--purple2)' }}>✦ {((f.xp || 0) + ((f.level || 1) - 1) * 100).toLocaleString()}</div>
              <div style={{ fontFamily: "'Almendra', serif", fontSize: '.6rem', color: 'var(--ink3)' }}>{getT('total_xp_label')}</div>
            </div>
            <button className="btn-del" onClick={() => removeFriend(f.id)} style={{ fontSize: '.65rem', padding: '.25rem .5rem' }}>{getT('remove_friend')}</button>
          </div>
        ))
      )}

      {tab === 'lb' && (
        allForLb.length <= 1 ? (
          <div className="empty-board"><span className="empty-icon">🏆</span><div className="empty-txt">{getT('add_friends_lb')}</div></div>
        ) : allForLb.map((p, i) => (
          <div key={p.id} className={`lb-row ${p.you ? 'you' : ''}`}>
            <div className={`lb-rank ${i===0?'r1':i===1?'r2':i===2?'r3':''}`}>{i < 3 ? ranks[i] : i + 1}</div>
            <div className="lb-av">{(p.display_name || 'H').slice(0, 2).toUpperCase()}</div>
            <div className="lb-name">{p.display_name}{p.you && <span style={{ fontSize: '.62rem', color: 'var(--gold)', fontFamily: "'Almendra', serif", marginLeft: '.3rem' }}>(you)</span>}</div>
            <div className="lb-xp">✦ {p.xp.toLocaleString()} XP</div>
            <div className="lb-level">Lvl {p.level}</div>
          </div>
        ))
      )}

      {tab === 'search' && card(
        <>
          <div style={{ fontFamily: "'Almendra Display', serif", fontSize: '1rem', color: 'var(--ink)', marginBottom: '.9rem', borderBottom: '1px solid var(--parch3)', paddingBottom: '.5rem' }}>{getT('find_hero_title')}</div>
          <div style={{ fontFamily: "'Fondamento', cursive", fontStyle: 'italic', fontSize: '.82rem', color: 'var(--ink3)', marginBottom: '.8rem' }}>
            Search by name, or enter a Hero ID (e.g. <strong>A3F2B190</strong>) to find someone directly.
          </div>
          <div style={{ display: 'flex', gap: '.6rem', marginBottom: '1rem' }}>
            <input className="finput" type="text" placeholder={getT('search_placeholder')} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && searchUsers()} style={{ marginBottom: 0, flex: 1 }} />
            <button className="btn-add" onClick={searchUsers} disabled={searching} style={{ whiteSpace: 'nowrap' }}>{searching ? '⏳' : '⚔ Search'}</button>
          </div>
          {searchResults.length === 0 && searchQuery && !searching && (
            <div style={{ fontFamily: "'Fondamento', cursive", fontSize: '.85rem', color: 'var(--ink3)', fontStyle: 'italic', textAlign: 'center', padding: '1rem' }}>{getT('no_heroes_found')}</div>
          )}
          {searchResults.map(r => (
            <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '.8rem', padding: '.7rem .9rem', background: 'rgba(22,14,4,0.06)', border: '1px solid rgba(200,145,30,0.25)', borderRadius: 2, marginBottom: '.5rem' }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, var(--purple), var(--crimson))', border: '1.5px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Almendra Display', serif", fontSize: '.75rem', color: 'var(--gold3)', flexShrink: 0 }}>
                {(r.display_name || 'H').slice(0, 2).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Almendra', serif", fontSize: '.88rem', color: 'var(--ink)', fontWeight: 700 }}>{r.display_name}</div>
                <div style={{ fontFamily: "'Fondamento', cursive", fontSize: '.72rem', color: 'var(--ink3)', fontStyle: 'italic' }}>{r.hero_class || 'Adventurer'} · Lvl {r.level} · ID: {r.id?.slice(0,8).toUpperCase()}</div>
              </div>
              <button className="btn-complete" onClick={() => sendRequest(r.id)}>{getT('recruit_btn')}</button>
            </div>
          ))}
        </>
      )}

      {tab === 'requests' && (
        <>
          {incoming.length > 0 && card(
            <>
              <div style={{ fontFamily: "'Almendra Display', serif", fontSize: '1rem', color: 'var(--ink)', marginBottom: '.9rem', borderBottom: '1px solid var(--parch3)', paddingBottom: '.5rem' }}>{getT('incoming_requests')}</div>
              {incoming.map(r => (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '.8rem', padding: '.7rem 0', borderBottom: '1px solid rgba(200,145,30,0.15)' }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, var(--purple), var(--crimson))', border: '1.5px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Almendra Display', serif", fontSize: '.75rem', color: 'var(--gold3)' }}>
                    {(r.display_name || 'H').slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Almendra', serif", fontSize: '.88rem', color: 'var(--ink)', fontWeight: 700 }}>{r.display_name}</div>
                    <div style={{ fontFamily: "'Fondamento', cursive", fontSize: '.72rem', color: 'var(--ink3)', fontStyle: 'italic' }}>{getT('seeks_fellowship')} · Lvl {r.level}</div>
                  </div>
                  <button className="btn-complete" onClick={() => acceptRequest(r.friendship_id, r.id)}>{getT('accept_btn')}</button>
                  <button className="btn-del" onClick={() => declineRequest(r.friendship_id)}>✕</button>
                </div>
              ))}
            </>
          )}
          {pending.length > 0 && card(
            <>
              <div style={{ fontFamily: "'Almendra Display', serif", fontSize: '1rem', color: 'var(--ink)', marginBottom: '.6rem' }}>{getT('sent_requests')}</div>
              <div style={{ fontFamily: "'Fondamento', cursive", fontSize: '.85rem', color: 'var(--ink3)', fontStyle: 'italic' }}>{pending.length} request{pending.length > 1 ? 's' : ''} awaiting response...</div>
            </>
          )}
          {incoming.length === 0 && pending.length === 0 && (
            <div className="empty-board"><span className="empty-icon">📜</span><div className="empty-txt">{getT('no_requests')}</div></div>
          )}
        </>
      )}
    </div>
  )
}
