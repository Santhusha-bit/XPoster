import { useState, useEffect } from 'react'
import { LayoutDashboard, Sparkles, ListVideo, User, BookOpen } from 'lucide-react'
import Sidebar from './components/Sidebar'
import GenerateTab from './components/GenerateTab'
import QueueTab from './components/QueueTab'
import ProfileTab from './components/ProfileTab'
import GuideTab from './components/GuideTab'
import DashboardTab from './components/DashboardTab'
import { ToastProvider } from './lib/toast'
import { useKeyboard } from './lib/useKeyboard'
import './App.css'

const STORAGE_KEY = 'xposter_v3'

const BOTTOM_NAV = [
  { id: 'dashboard', label: 'Home',     icon: LayoutDashboard },
  { id: 'generate',  label: 'Generate', icon: Sparkles },
  { id: 'queue',     label: 'Queue',    icon: ListVideo },
  { id: 'profile',   label: 'Profile',  icon: User },
  { id: 'guide',     label: 'Guide',    icon: BookOpen },
]

function getTodayKey() { return new Date().toISOString().split('T')[0] }

function AppInner() {
  const [tab, setTab]                   = useState('dashboard')
  const [profile, setProfile]           = useState({ name:'', handle:'', background:'', niche:'', tone:'Insightful & Educational', topics:[] })
  const [profileSaved, setProfileSaved] = useState(false)
  const [queue, setQueue]               = useState([])
  const [history, setHistory]           = useState([])
  const [streak, setStreak]             = useState({ count: 0, lastPostedDate: null })

  useEffect(() => {
    try {
      const d = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
      if (d.profile)      setProfile(d.profile)
      if (d.queue)        setQueue(d.queue)
      if (d.profileSaved) setProfileSaved(d.profileSaved)
      if (d.history)      setHistory(d.history)
      if (d.streak)       setStreak(d.streak)
    } catch {}
  }, [])

  const persist = (u) => {
    try {
      const c = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...c, ...u }))
    } catch {}
  }

  // Keyboard shortcuts: g+1..5 to switch tabs, mod+g to generate
  useKeyboard({
    '1': () => setTab('dashboard'),
    '2': () => setTab('generate'),
    '3': () => setTab('queue'),
    '4': () => setTab('profile'),
    '5': () => setTab('guide'),
    'mod+g': () => setTab('generate'),
  })

  const saveProfile = (p) => {
    setProfile(p); setProfileSaved(true)
    persist({ profile: p, profileSaved: true })
  }

  const addToQueue = (post) => {
    const item = { ...post, queueId: Date.now(), addedAt: new Date().toLocaleDateString(), scheduledTime: null, status: 'ready' }
    const next = [...queue, item]; setQueue(next); persist({ queue: next })
  }

  const updateQueueItem = (queueId, updates) => {
    const next = queue.map(p => p.queueId === queueId ? { ...p, ...updates } : p)
    setQueue(next); persist({ queue: next })
  }

  const removeFromQueue = (queueId) => {
    const next = queue.filter(p => p.queueId !== queueId)
    setQueue(next); persist({ queue: next })
  }

  const clearQueue = () => { setQueue([]); persist({ queue: [] }) }

  const markPosted = (post) => {
    const today = getTodayKey()
    const item = { ...post, historyId: Date.now(), postedAt: new Date().toLocaleString(), postedDate: today, liked: false }
    const nextHistory = [item, ...history].slice(0, 100)
    setHistory(nextHistory)

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yKey = yesterday.toISOString().split('T')[0]
    const count = streak.lastPostedDate === today ? streak.count
                : (streak.lastPostedDate === yKey || !streak.lastPostedDate) ? streak.count + 1
                : 1
    const nextStreak = { count, lastPostedDate: today }
    setStreak(nextStreak)
    persist({ history: nextHistory, streak: nextStreak })
    removeFromQueue(post.queueId)
  }

  const toggleHistoryLike = (historyId) => {
    const next = history.map(h => h.historyId === historyId ? { ...h, liked: !h.liked } : h)
    setHistory(next); persist({ history: next })
  }

  const postsThisWeek = history.filter(h => {
    const d = new Date(h.postedDate)
    return d >= new Date(Date.now() - 7 * 86400000)
  }).length

  const sharedProps = { profile, profileSaved, setTab }

  return (
    <div className="app-shell">
      <Sidebar
        tab={tab} setTab={setTab}
        profileSaved={profileSaved} handle={profile.handle}
        queueCount={queue.length} streak={streak.count} totalPosted={history.length}
      />

      <main className="app-main">
        {tab === 'dashboard' && (
          <DashboardTab
            {...sharedProps}
            streak={streak} totalPosted={history.length} postsThisWeek={postsThisWeek}
            history={history} queue={queue}
            toggleHistoryLike={toggleHistoryLike}
          />
        )}
        {tab === 'generate' && (
          <GenerateTab {...sharedProps} addToQueue={addToQueue} />
        )}
        {tab === 'queue' && (
          <QueueTab
            queue={queue}
            removeFromQueue={removeFromQueue}
            clearQueue={clearQueue}
            updateQueueItem={updateQueueItem}
            markPosted={markPosted}
            setTab={setTab}
          />
        )}
        {tab === 'profile' && (
          <ProfileTab {...sharedProps} onSave={saveProfile} />
        )}
        {tab === 'guide' && <GuideTab />}
      </main>

      {/* Mobile bottom nav */}
      <nav className="mobile-bottom-nav">
        {BOTTOM_NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`mobile-nav-btn ${tab === id ? 'mobile-nav-active' : ''}`}
            onClick={() => setTab(id)}
          >
            <Icon size={20} strokeWidth={tab === id ? 2.5 : 1.8} />
            <span>{label}</span>
            {id === 'queue' && queue.length > 0 && (
              <span className="mobile-nav-badge">{queue.length}</span>
            )}
          </button>
        ))}
      </nav>
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <AppInner />
    </ToastProvider>
  )
}
