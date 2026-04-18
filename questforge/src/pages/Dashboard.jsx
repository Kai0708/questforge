import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import TopNav from '../components/TopNav'
import Sidebar from '../components/Sidebar'
import QuestBoard from '../components/QuestBoard'
import Leaderboard from '../components/Leaderboard'
import SettingsPage from '../components/SettingsPage'
import QuestModal from '../components/QuestModal'
import LevelUpOverlay from '../components/LevelUpOverlay'
import XpPopup from '../components/XpPopup'
import GoldCoins from '../components/GoldCoins'

const XP_MAP = { trivial: 10, easy: 25, medium: 50, hard: 100, boss: 200 }
const GOLD_MAP = { trivial: 5, easy: 10, medium: 20, hard: 40, boss: 80 }

export default function Dashboard({ session }) {
  const [page, setPage] = useState('board')
  const [profile, setProfile] = useState(null)
  const [quests, setQuests] = useState([])
  const [filter, setFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingQuest, setEditingQuest] = useState(null)
  const [levelUpNum, setLevelUpNum] = useState(null)
  const [xpMessages, setXpMessages] = useState([])
  const [coinBursts, setCoinBursts] = useState([])
  const [timerSec, setTimerSec] = useState(300)
  const [timerOn, setTimerOn] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load profile and quests
  useEffect(() => {
    loadProfile()
    loadQuests()
  }, [session])

  // Timer
  useEffect(() => {
    if (!timerOn) return
    const iv = setInterval(() => {
      setTimerSec(s => {
        if (s <= 1) {
          clearInterval(iv)
          setTimerOn(false)
          gainXp(15, 'trivial')
          showXp('⏳ Focus complete! +15 XP!')
          return 300
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(iv)
  }, [timerOn])

  async function loadProfile() {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()
    if (data) {
      await checkStreak(data)
    }
    setLoading(false)
  }

  async function checkStreak(prof) {
    const today = new Date().toISOString().slice(0, 10)
    let newStreak = prof.current_streak
    let longestStreak = prof.longest_streak

    if (prof.last_active_date) {
      const last = new Date(prof.last_active_date)
      const now = new Date(today)
      const diff = Math.round((now - last) / (1000 * 60 * 60 * 24))
      if (diff === 1) {
        newStreak = prof.current_streak + 1
        if (newStreak > longestStreak) longestStreak = newStreak
      } else if (diff > 1) {
        newStreak = 1
      }
    } else {
      newStreak = 1
    }

    const updated = { ...prof, current_streak: newStreak, longest_streak: longestStreak, last_active_date: today }
    await supabase.from('profiles').update({ current_streak: newStreak, longest_streak: longestStreak, last_active_date: today }).eq('id', session.user.id)
    setProfile(updated)
  }

  async function loadQuests() {
    const { data } = await supabase
      .from('quests')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
    if (data) setQuests(data)
  }

  async function saveQuest(questData) {
    if (editingQuest) {
      const { data } = await supabase
        .from('quests')
        .update(questData)
        .eq('id', editingQuest.id)
        .select()
        .single()
      if (data) setQuests(q => q.map(x => x.id === data.id ? data : x))
    } else {
      const { data } = await supabase
        .from('quests')
        .insert({ ...questData, user_id: session.user.id })
        .select()
        .single()
      if (data) setQuests(q => [data, ...q])
    }
    setModalOpen(false)
    setEditingQuest(null)
  }

  async function deleteQuest(id) {
    if (!confirm('Remove this quest from the board?')) return
    await supabase.from('quests').delete().eq('id', id)
    setQuests(q => q.filter(x => x.id !== id))
  }

  async function completeQuest(quest) {
    if (quest.completed) return

    if (quest.is_boss) {
      const newProgress = quest.boss_progress + 1
      if (newProgress < quest.boss_total) {
        const xpChunk = Math.round(XP_MAP[quest.difficulty] / quest.boss_total)
        const goldChunk = Math.round(GOLD_MAP[quest.difficulty] / quest.boss_total)
        await supabase.from('quests').update({ boss_progress: newProgress }).eq('id', quest.id)
        setQuests(q => q.map(x => x.id === quest.id ? { ...x, boss_progress: newProgress } : x))
        await gainXp(xpChunk, quest.difficulty)
        await gainGold(goldChunk)
        showXp(`⚔ Boss struck! +${xpChunk} XP`)
        return
      }
    }

    const now = new Date().toISOString()
    await supabase.from('quests').update({ completed: true, completed_at: now }).eq('id', quest.id)
    setQuests(q => q.map(x => x.id === quest.id ? { ...x, completed: true, completed_at: now } : x))

    const xp = XP_MAP[quest.difficulty] || 10
    const gold = GOLD_MAP[quest.difficulty] || 5
    await gainXp(xp, quest.difficulty)
    await gainGold(gold)
    spawnCoins(quest.difficulty)

    // Check multi-task bonus
    const nowDone = quests.filter(q => q.completed).length + 1
    const total = quests.length
    if (nowDone === 3) {
      setTimeout(async () => {
        showXp('🏆 3+ Quests! +10 Bonus XP')
        await gainXp(10, 'trivial')
      }, 1400)
    }
    if (nowDone === total && total > 0) {
      await supabase.from('profiles').update({ perfect_days: (profile?.perfect_days || 0) + 1 }).eq('id', session.user.id)
      setProfile(p => ({ ...p, perfect_days: (p?.perfect_days || 0) + 1 }))
      setTimeout(async () => {
        showXp('⚜ PERFECT DAY! +50 Bonus XP!')
        await gainXp(50, 'boss')
      }, 2200)
    }
  }

  async function gainXp(amount, diff) {
    if (!profile) return
    let newXp = profile.xp + amount
    let newLevel = profile.level
    const needed = newLevel * 100
    if (newXp >= needed) {
      newXp -= needed
      newLevel++
      setTimeout(() => setLevelUpNum(newLevel), 600)
    }
    const updates = { xp: newXp, level: newLevel }
    await supabase.from('profiles').update(updates).eq('id', session.user.id)
    setProfile(p => ({ ...p, ...updates }))
    showXp(`+${amount} XP!`)
  }

  async function gainGold(amount) {
    if (!profile) return
    const newGold = (profile.gold || 0) + amount
    await supabase.from('profiles').update({ gold: newGold }).eq('id', session.user.id)
    setProfile(p => ({ ...p, gold: newGold }))
  }

  function showXp(msg) {
    const id = Date.now()
    setXpMessages(m => [...m, { id, msg }])
    setTimeout(() => setXpMessages(m => m.filter(x => x.id !== id)), 2600)
  }

  function spawnCoins(diff) {
    const id = Date.now()
    const count = { trivial: 5, easy: 10, medium: 15, hard: 22, boss: 32 }[diff] || 10
    setCoinBursts(b => [...b, { id, count }])
    setTimeout(() => setCoinBursts(b => b.filter(x => x.id !== id)), 2000)
  }

  async function updateProfile(updates) {
    await supabase.from('profiles').update(updates).eq('id', session.user.id)
    setProfile(p => ({ ...p, ...updates }))
    showXp('Profile saved!')
  }

  function openAdd() { setEditingQuest(null); setModalOpen(true) }
  function openEdit(quest) { setEditingQuest(quest); setModalOpen(true) }

  if (loading || !profile) {
    return <div className="loading-screen"><div className="loading-text">✦ Entering the Realm... ✦</div></div>
  }

  const filteredQuests = quests.filter(q => {
    if (filter === 'active') return !q.completed
    if (filter === 'boss') return q.is_boss
    if (filter === 'done') return q.completed
    return true
  })

  const doneCount = quests.filter(q => q.completed).length
  const perfectDay = doneCount === quests.length && quests.length > 0

  return (
    <>
      <TopNav
        profile={profile}
        page={page}
        setPage={setPage}
        onLogout={() => supabase.auth.signOut()}
      />
      <div className="main-layout">
        <Sidebar
          profile={profile}
          timerSec={timerSec}
          timerOn={timerOn}
          onTimerToggle={() => {
            if (timerOn) { setTimerOn(false); setTimerSec(300) }
            else setTimerOn(true)
          }}
        />
        {page === 'board' && (
          <QuestBoard
            quests={filteredQuests}
            allQuests={quests}
            filter={filter}
            setFilter={setFilter}
            doneCount={doneCount}
            perfectDay={perfectDay}
            onAdd={openAdd}
            onEdit={openEdit}
            onComplete={completeQuest}
            onDelete={deleteQuest}
          />
        )}
        {page === 'lb' && <Leaderboard profile={profile} />}
        {page === 'settings' && <SettingsPage profile={profile} onSave={updateProfile} onLogout={() => supabase.auth.signOut()} />}
      </div>

      {modalOpen && (
        <QuestModal
          quest={editingQuest}
          onSave={saveQuest}
          onClose={() => { setModalOpen(false); setEditingQuest(null) }}
        />
      )}

      {levelUpNum && (
        <LevelUpOverlay level={levelUpNum} onClose={() => { setLevelUpNum(null); spawnCoins('boss') }} />
      )}

      {xpMessages.map(m => <XpPopup key={m.id} msg={m.msg} />)}
      {coinBursts.map(b => <GoldCoins key={b.id} count={b.count} />)}
    </>
  )
}
